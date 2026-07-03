"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { Trash2, Plus, Minus, ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { checkoutAction } from "@/app/actions/checkout";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart, getVendorId } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Delivery form state
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Success state
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }
    
    setIsCheckingOut(true);
    setError(null);
    
    try {
      const vendorId = getVendorId();
      if (!vendorId) throw new Error("No vendor found in cart.");

      const result = await checkoutAction({
        vendorId,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        deliveryAddress: address,
        deliveryInstructions: instructions,
        paymentMethod
      });

      if (result.success) {
        setSuccessOrderId(result.orderId);
        clearCart();
      } else {
        setError(result.error);
      }
    } catch (e: any) {
      setError(e.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFDFD] pb-24 items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#f46919] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // SUCCESS MODAL
  if (successOrderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", damping: 15 }}
          className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center text-center max-w-md w-full relative z-10"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold font-sora mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your delicious food is being prepared. It will be with you shortly.</p>
          
          <div className="bg-gray-50 w-full p-4 rounded-2xl mb-8 border border-gray-100">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
            <p className="text-lg font-bold text-gray-900">#{successOrderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <Link href="/browse" className="w-full bg-[#f46919] text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#d65510] transition flex items-center justify-center">
            Back to Home
          </Link>
        </motion.div>
        
        {/* Confetti-like background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-6 flex items-center justify-center text-gray-400">
          <ShoppingCartIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/browse" className="bg-[#f46919] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#d65510] transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] pb-32 text-[#333]">
      <header className="flex items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/browse" className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold font-sora">Your Cart</h1>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-[#c82216] p-4 rounded-xl font-medium text-sm">
            {error}
          </div>
        )}

        {/* Cart Items List */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg px-2">Order Items</h2>
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-3xl border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200'} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                <p className="text-[#f46919] font-bold mt-1">${item.price}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-[#f46919] text-white rounded-full flex items-center justify-center hover:bg-[#d65510] transition shadow-sm">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-3 bg-red-50 text-[#c82216] rounded-xl hover:bg-red-100 transition self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Delivery Details Section */}
        <div className="space-y-4 mt-8">
          <h2 className="font-bold text-lg px-2">Delivery Details</h2>
          <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Full Delivery Address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#f46919] transition"
              />
            </div>
            <textarea 
              placeholder="Delivery Instructions (e.g. Ring the bell, Leave at door)" 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#f46919] transition min-h-[80px]"
            ></textarea>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-4 mt-8">
          <h2 className="font-bold text-lg px-2">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center space-y-2 transition ${
                paymentMethod === 'card' ? 'border-[#f46919] bg-orange-50/50 text-[#f46919]' : 'border-gray-50 bg-white text-gray-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="font-bold text-sm">Credit Card</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center space-y-2 transition ${
                paymentMethod === 'cash' ? 'border-[#f46919] bg-orange-50/50 text-[#f46919]' : 'border-gray-50 bg-white text-gray-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              }`}
            >
              <Banknote className="w-6 h-6" />
              <span className="font-bold text-sm">Cash on Delivery</span>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3 mt-8">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-gray-100 w-full my-4"></div>
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </main>

      {/* Checkout Button fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20 pb-safe">
        <button 
          onClick={handleCheckout} 
          disabled={isCheckingOut}
          className="w-full bg-[#f46919] text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#d65510] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden relative"
        >
          {isCheckingOut ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2">
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               <span>Processing Order...</span>
            </motion.div>
          ) : (
            <span>Checkout • ${total.toFixed(2)}</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Quick fallback for missing icon
function ShoppingCartIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
