import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string; // Product ID
  vendor_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed (Getters)
  getSubtotal: () => number;
  getTotalItems: () => number;
  getVendorId: () => string | null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => set((state) => {
        // Enforce single-vendor cart rule
        if (state.items.length > 0 && state.items[0].vendor_id !== newItem.vendor_id) {
          // If trying to add from a different vendor, clear the cart first (or throw error in UI)
          return { items: [{ ...newItem, quantity: 1 }] };
        }

        const existingItem = state.items.find(item => item.id === newItem.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                : item
            )
          };
        }
        
        return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0 
          ? state.items.filter(item => item.id !== id)
          : state.items.map(item => item.id === id ? { ...item, quantity } : item)
      })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getVendorId: () => {
        const items = get().items;
        return items.length > 0 ? items[0].vendor_id : null;
      }
    }),
    {
      name: 'redi-cart-storage', // saves to local storage
    }
  )
)
