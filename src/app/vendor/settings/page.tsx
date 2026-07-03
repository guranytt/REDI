"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Save } from "lucide-react";

export default function VendorSettings() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Store Settings</h2>
        <button className="flex items-center space-x-2 bg-[#f46919] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#d65510] transition shadow-sm">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
        <h3 className="text-lg font-bold mb-6">Store Identity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ImageUpload 
              label="Store Logo" 
              defaultImage={logoUrl || undefined}
              onUploadSuccess={(url) => setLogoUrl(url)}
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Store Name</label>
              <input 
                type="text" 
                defaultValue="Burger Joint Admin"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#f46919] font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Store Address</label>
              <input 
                type="text" 
                defaultValue="123 University Ave"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#f46919] font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
