import Link from "next/link";
import { ArrowLeft, Star, Clock, ShoppingBag, Plus } from "lucide-react";

export default function VendorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-brand-olive font-sans pb-24">
      {/* Hero Banner */}
      <div className="relative w-full h-64 bg-gray-300">
        <img 
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop" 
          alt="Vendor Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md text-brand-olive hover:bg-gray-100 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-6 pt-6 pb-4 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-serif font-bold">Campus Burger Joint</h1>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full space-x-1">
            <Star className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
            <span className="font-bold text-sm">4.8</span>
            <span className="text-gray-500 text-xs">(120+)</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">American • Burgers • Fast Food</p>
        
        <div className="flex space-x-6 text-sm font-medium text-gray-700">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
            15 - 25 min
          </div>
          <div className="flex items-center">
            <ShoppingBag className="w-4 h-4 mr-1.5 text-gray-400" />
            $1.99 Delivery
          </div>
          <div className="flex items-center text-gray-500">
            Min $10
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="sticky top-0 bg-white z-40 border-b border-gray-100 shadow-sm mt-2">
        <div className="flex space-x-6 px-6 py-4 overflow-x-auto scrollbar-hide text-sm font-bold text-gray-500">
          <span className="text-brand-red border-b-2 border-brand-red pb-1 whitespace-nowrap cursor-pointer">Popular</span>
          <span className="hover:text-brand-olive transition whitespace-nowrap cursor-pointer">Combos</span>
          <span className="hover:text-brand-olive transition whitespace-nowrap cursor-pointer">Burgers</span>
          <span className="hover:text-brand-olive transition whitespace-nowrap cursor-pointer">Sides</span>
          <span className="hover:text-brand-olive transition whitespace-nowrap cursor-pointer">Drinks</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 px-2">Popular</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between group cursor-pointer hover:shadow-md transition">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-lg mb-1">Classic Cheeseburger {item}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    Our signature beef patty with cheddar cheese, lettuce, tomato, and special sauce.
                  </p>
                  <span className="font-bold text-brand-olive">${(8.99 + item).toFixed(2)}</span>
                </div>
                <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop`} 
                    alt="Burger" 
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-2 right-2 bg-white text-brand-red rounded-full p-1.5 shadow-md hover:bg-brand-red hover:text-white transition">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Cart Summary */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-4xl mx-auto">
          <Link href="/cart" className="flex items-center justify-between bg-brand-red text-white p-4 rounded-2xl shadow-lg hover:bg-red-700 transition">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="font-bold">View Cart</span>
            </div>
            <span className="font-bold text-lg">$21.98</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
