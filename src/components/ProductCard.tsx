"use client";

import { motion } from "framer-motion";
import { cardReveal } from "@/lib/animations";
import AddToCartButton from "./AddToCartButton";
import { Heart } from "lucide-react";

export default function ProductCard({ item }: { item: any }) {
  return (
    <motion.div 
      variants={cardReveal}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-72 bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 cursor-pointer p-3 group"
    >
      <div className="relative h-48 w-full rounded-3xl overflow-hidden">
        <motion.img 
          whileHover={{ scale: 1.05 }} 
          transition={{ duration: 0.3 }}
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600'} 
          alt={item.title} 
          className="w-full h-full object-cover origin-center" 
        />
        {/* Quick fade overlay for Add To Cart */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

        {item.tag && (
          <div className="absolute top-3 left-3 bg-[#f46919] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {item.tag}
          </div>
        )}
        <button className="absolute top-3 right-3 bg-white/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-[#f46919] transition">
          <Heart className="w-4 h-4" />
        </button>

        <AddToCartButton product={{
          id: item.id,
          vendor_id: item.vendor_id,
          name: item.title,
          price: item.price,
          quantity: 1,
          image_url: item.image_url
        }} />
      </div>
      
      <div className="px-2 pt-4 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 leading-tight">{item.title}</h3>
          <span className="font-bold text-[#f46919] ml-2">${item.price}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
          <span>{item.vendors?.name || 'Local Vendor'}</span>
        </div>
      </div>
    </motion.div>
  );
}
