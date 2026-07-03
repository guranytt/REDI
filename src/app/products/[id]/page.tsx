"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const basePrice = 9.99;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-brand-olive font-sans pb-32">
      {/* Product Image Banner */}
      <div className="relative w-full h-80 bg-gray-200">
        <img 
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" 
          alt="Product Image" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 z-10">
          <Link href="/vendors/1" className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-brand-olive hover:bg-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white px-6 pt-6 pb-6 shadow-sm border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-serif font-bold">Classic Double Cheeseburger</h1>
          <span className="text-xl font-bold text-brand-olive">${basePrice.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Two juicy 100% beef patties layered with two slices of melty American cheese, topped with crispy lettuce, fresh tomatoes, pickles, and our signature secret sauce on a toasted sesame seed bun.
        </p>
        <div className="flex text-xs font-bold text-gray-400 space-x-4">
          <span>850 Calories</span>
          <span>•</span>
          <span>Contains: Dairy, Gluten</span>
        </div>
      </div>

      {/* Customization Options */}
      <div className="px-6 py-6 space-y-6">
        
        {/* Choice of Size */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">Size</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">Required</span>
          </div>
          <div className="space-y-3">
            {['Regular', 'Large (+$2.00)'].map((size, idx) => (
              <label key={size} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-brand-red transition">
                <span className="font-medium text-sm">{size}</span>
                <input type="radio" name="size" defaultChecked={idx === 0} className="w-5 h-5 text-brand-red focus:ring-brand-red border-gray-300" />
              </label>
            ))}
          </div>
        </section>

        {/* Add-ons */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">Add-ons</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Optional</span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Extra Cheese', price: 1.00 },
              { name: 'Bacon', price: 1.50 },
              { name: 'Avocado', price: 1.25 }
            ].map((addon) => (
              <label key={addon.name} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-brand-red transition">
                <span className="font-medium text-sm">{addon.name} <span className="text-gray-400 ml-1">(+${addon.price.toFixed(2)})</span></span>
                <input type="checkbox" className="w-5 h-5 text-brand-red focus:ring-brand-red border-gray-300 rounded" />
              </label>
            ))}
          </div>
        </section>

        {/* Special Instructions */}
        <section>
          <h3 className="text-lg font-bold mb-3">Special Instructions</h3>
          <textarea 
            placeholder="E.g. No onions, extra pickles..."
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all min-h-[100px]"
          ></textarea>
        </section>

      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-2 w-32">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-500 hover:text-brand-red transition"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg w-8 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-500 hover:text-brand-red transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="flex-1 flex items-center justify-between bg-brand-red text-white p-4 rounded-2xl shadow-lg hover:bg-red-700 transition font-bold">
            <span>Add to Cart</span>
            <span>${(basePrice * quantity).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
