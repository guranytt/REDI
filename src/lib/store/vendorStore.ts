import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

export type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  is_available: boolean;
};

interface VendorCache {
  [vendorId: string]: {
    data: Product[];
    lastFetched: number;
  };
}

interface StorefrontStore {
  cache: VendorCache;
  fetchProducts: (vendorId: string) => Promise<Product[]>;
  toggleAvailability: (vendorId: string, productId: string, currentStatus: boolean) => Promise<void>;
}

export const useStorefrontCache = create<StorefrontStore>((set, get) => ({
  cache: {},
  
  fetchProducts: async (vendorId: string) => {
    const now = Date.now();
    const existing = get().cache[vendorId];
    
    // Egress Optimized: Use Memory Cache if fetched within last 2 minutes
    if (existing && (now - existing.lastFetched < 120000)) {
      return existing.data;
    }

    // Otherwise, hit the API/DB (Minimal Select, Paginated/Limited)
    const { data } = await supabase
      .from('products')
      .select('id, title, price, stock, is_available')
      .eq('vendor_id', vendorId)
      .order('title')
      .limit(20);
    
    const products = data || [];
    
    set((state) => ({
      cache: { ...state.cache, [vendorId]: { data: products, lastFetched: now } }
    }));
    
    return products;
  },

  toggleAvailability: async (vendorId: string, productId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    
    // Optimistic Update
    set((state) => {
      const vendorData = state.cache[vendorId];
      if (!vendorData) return state;
      return {
        cache: {
          ...state.cache,
          [vendorId]: {
            ...vendorData,
            data: vendorData.data.map(p => p.id === productId ? { ...p, is_available: nextStatus } : p)
          }
        }
      };
    });

    // DB Update
    await supabase.from('products').update({ is_available: nextStatus }).eq('id', productId);
  }
}));
