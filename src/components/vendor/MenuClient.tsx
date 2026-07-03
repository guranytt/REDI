"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { addProductAction } from "@/app/actions/product";
import { useStorefrontCache } from "@/lib/store/vendorStore";

export default function MenuClient({ vendorId }: { vendorId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchProducts = useStorefrontCache(state => state.fetchProducts);
  const toggleAvailability = useStorefrontCache(state => state.toggleAvailability);
  const cache = useStorefrontCache(state => state.cache);

  const products = cache[vendorId]?.data || [];

  useEffect(() => {
    if (vendorId) {
      fetchProducts(vendorId);
    }
  }, [vendorId, fetchProducts]);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("category_id", '22222222-2222-2222-2222-222222222222'); 
    formData.append("vendor_id", vendorId);
    if (imageUrl) formData.append("image_url", imageUrl);

    const result = await addProductAction(formData);
    setIsLoading(false);

    if (result.success) {
      setIsModalOpen(false);
      setImageUrl(null);
      // Force refetch to update list
      fetchProducts(vendorId);
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Manager</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your products, prices, and availability.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search menu..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f46919] w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-[#f46919] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#d65510] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4 pl-6 font-bold">Product</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 pr-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 && (
                 <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-sm">No products found.</td></tr>
              )}
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 pl-6 font-bold text-gray-900">{item.title}</td>
                  <td className="p-4 text-sm font-bold text-[#f46919]">${item.price.toFixed(2)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleAvailability(vendorId, item.id, item.is_available)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase transition ${
                        item.is_available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {item.is_available ? 'Available' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-900 transition"><MoreHorizontal className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Basic Pagination (UI only to satisfy egress rules) */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to {Math.max(products.length, 1)} of 20 items (limit reached)</span>
          <div className="flex space-x-1">
            <button disabled className="px-3 py-1 border border-gray-200 rounded-lg opacity-50 font-medium">Prev</button>
            <button disabled className="px-3 py-1 border border-gray-200 rounded-lg opacity-50 font-medium">Next</button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 space-y-5">
              <ImageUpload 
                label="Product Image (Cloudinary)" 
                onUploadSuccess={(url) => setImageUrl(url)}
              />
              
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Product Name</label>
                <input required name="title" type="text" placeholder="e.g. Bacon Burger" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#f46919]" />
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Price ($)</label>
                <input required name="price" type="number" step="0.01" min="0" placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#f46919]" />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#f46919] text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-[#d65510] transition disabled:opacity-50 mt-2"
              >
                {isLoading ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
