"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { Trash2, Plus, Minus, ArrowLeft, MapPin, CheckCircle2, LocateFixed } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createOrderAfterPayment } from "@/app/actions/checkout";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { payWithPaystack } from "@/lib/paystack";

export default function CartPage() {
  const { user } = useUser();
  const { items, removeItem, updateQuantity, getSubtotal, clearCart, getVendorId } = useCartStore();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Delivery form state
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [deliveryLat, setDeliveryLat] = useState<number | undefined>();
  const [deliveryLng, setDeliveryLng] = useState<number | undefined>();
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  
  // Success state for the brief transition to WhatsApp
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const deliveryFee = 500; // Fixed in Naira for this task
  const total = subtotal + deliveryFee;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeliveryLat(position.coords.latitude);
        setDeliveryLng(position.coords.longitude);
        setLocationSuccess(true);
        setIsLocating(false);
      },
      (err) => {
        setError("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!user) {
      window.location.href = "/sign-in?redirect_url=/cart";
      return;
    }
    if (!address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }
    
    setError(null);
    setIsCheckingOut(true);

    try {
      const vendorId = getVendorId();
      if (!vendorId) throw new Error("No vendor found in cart.");

      // Open Paystack popup
      await payWithPaystack({
        email: user.primaryEmailAddress?.emailAddress || 'customer@example.com',
        amount: total * 100, // Paystack amount is in kobo
        ref: `RED_${Math.floor(Math.random() * 1000000000 + 1)}`, // Unique reference
        onClose: () => {
          // User closed the payment modal
          setIsCheckingOut(false);
        },
        callback: async (response) => {
          // Payment was successful on the client side
          setIsRedirecting(true);
          
          const result = await createOrderAfterPayment({
            vendorId,
            items: items.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, price: i.price })),
            deliveryAddress: address,
            deliveryInstructions: instructions,
            deliveryLat,
            deliveryLng,
            paystackReference: response.reference,
          });

          if (result.success) {
            clearCart();
            
            // Build WhatsApp Message
            let message = `🍽️ *New Order from REDI*\n\n`;
            message += `*Order ID:* #${result.orderId?.slice(0, 8).toUpperCase()}\n\n`;
            message += `*Items:*\n`;
            items.forEach(i => {
              message += `• ${i.quantity}× ${i.name} — ₦${(i.price * i.quantity).toLocaleString()}\n`;
            });
            message += `\n*Total:* ₦${total.toLocaleString()}\n\n`;
            
            message += `*Customer:* ${result.customerName || 'Customer'}\n`;
            if (result.customerPhone) {
              message += `*Phone:* ${result.customerPhone}\n`;
            }
            
            message += `\n*Delivery Address:* ${address}\n`;
            if (instructions) {
              message += `*Note:* ${instructions}\n`;
            }
            if (deliveryLat && deliveryLng) {
              message += `📍 https://maps.google.com/?q=${deliveryLat},${deliveryLng}\n`;
            }

            const vendorPhone = result.whatsappNumber || '2348000000000'; // fallback
            const whatsappUrl = `https://wa.me/${vendorPhone}?text=${encodeURIComponent(message)}`;
            
            window.location.href = whatsappUrl;
          } else {
            // DB Write failed, but payment succeeded
            setError(`Payment successful (Ref: ${response.reference}) but order saving failed. Please contact support.`);
            setIsCheckingOut(false);
            setIsRedirecting(false);
          }
        }
      });
      
    } catch (e: any) {
      setError(e.message || "Checkout failed");
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

  // REDIRECTING STATE
  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-12 h-12 border-4 border-[#f46919] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold font-sora mb-2 text-center">Payment Successful!</h2>
        <p className="text-gray-500 mb-6 text-center">Saving your order and redirecting to WhatsApp...</p>
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
                <p className="text-[#f46919] font-bold mt-1">₦{item.price.toLocaleString()}</p>
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
            
            <button
              onClick={handleGetLocation}
              disabled={isLocating || locationSuccess}
              className={`w-full py-3 rounded-2xl flex items-center justify-center space-x-2 font-medium transition ${
                locationSuccess 
                  ? 'bg-green-50 text-green-600 border border-green-100' 
                  : 'bg-orange-50 text-[#f46919] hover:bg-orange-100 border border-orange-100'
              }`}
            >
              {isLocating ? (
                <div className="w-4 h-4 border-2 border-[#f46919] border-t-transparent rounded-full animate-spin"></div>
              ) : locationSuccess ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <LocateFixed className="w-5 h-5" />
              )}
              <span>{locationSuccess ? 'Location captured' : 'Use my current location'}</span>
            </button>

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

        {/* Summary */}
        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3 mt-8">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Delivery Fee</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-100 w-full my-4"></div>
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </main>

      {/* Checkout Button fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20 pb-safe">
        <button 
          onClick={handleCheckout} 
          disabled={isCheckingOut || isRedirecting}
          className="w-full bg-[#f46919] text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#d65510] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden relative"
        >
          {isCheckingOut ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2">
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               <span>Initializing Payment...</span>
            </motion.div>
          ) : (
            <span>Pay ₦{total.toLocaleString()}</span>
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
