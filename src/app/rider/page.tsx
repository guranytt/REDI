"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Package, User, CheckCircle2, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// Dynamically import the map to avoid SSR 'window is not defined' error
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function RiderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("map"); // map or list

  // Initial Fetch & Realtime Subscription
  useEffect(() => {
    const fetchReadyOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, status, created_at, total")
        .eq("status", "READY") // Riders only care about ready orders
        .limit(20);
      
      if (data) setOrders(data);
    };

    fetchReadyOrders();

    // Supabase Realtime Listener!
    const subscription = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: "status=eq.READY" },
        (payload) => {
          // When an order becomes READY, add it to our list
          setOrders(prev => {
            if (prev.find(o => o.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: "status=eq.DELIVERED" },
        (payload) => {
          // When an order is delivered or taken, remove it
          setOrders(prev => prev.filter(o => o.id !== payload.new.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const acceptOrder = async (orderId: string) => {
    // Optimistic Update
    setOrders(prev => prev.filter(o => o.id !== orderId));
    
    // In reality, status would go to "OUT_FOR_DELIVERY", 
    // but for our MVP schema, we just mark it DELIVERED to clear it out.
    await supabase.from("orders").update({ status: "DELIVERED" }).eq("id", orderId);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD] text-[#333] relative overflow-hidden">
      
      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100 z-0">
        <MapComponent orders={orders} />
        
        {/* Overlay Gradients */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-6 left-6 z-20">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet UI (Framer Motion) */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 w-full bg-white rounded-t-[40px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20 flex flex-col max-h-[60vh]"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4 shrink-0"></div>
        
        <div className="px-6 pb-4 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold font-sora">Nearby Pickups</h2>
          <span className="bg-orange-50 text-[#f46919] px-3 py-1 rounded-full text-sm font-bold">
            {orders.length} Ready
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
          <AnimatePresence>
            {orders.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Package className="w-12 h-12 mb-3 opacity-50" />
                <p>Waiting for new orders...</p>
              </motion.div>
            )}
            
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gray-50 border border-gray-100 p-5 rounded-3xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg leading-none">Order #{order.id.slice(0,6).toUpperCase()}</h3>
                    <p className="text-gray-500 text-sm mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> 2.4 miles away
                    </p>
                  </div>
                  <p className="font-bold text-[#f46919] bg-white px-3 py-1 rounded-xl shadow-sm border border-orange-100">
                    ${(order.total * 0.15 + 2.99).toFixed(2)} {/* Mock rider payout */}
                  </p>
                </div>
                
                <button 
                  onClick={() => acceptOrder(order.id)}
                  className="w-full bg-[#f46919] text-white py-3.5 rounded-2xl font-bold shadow-md hover:bg-[#d65510] transition flex items-center justify-center mt-4"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Accept Delivery
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Rider Navigation Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 pb-safe z-30">
        <div className="flex justify-around items-center p-4">
          <button className="flex flex-col items-center text-[#f46919]">
            <Navigation className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Map</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
