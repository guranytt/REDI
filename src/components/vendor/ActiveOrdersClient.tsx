"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

type Order = {
  id: string;
  status: string;
  created_at: string;
  total: number;
};

export default function ActiveOrdersClient({ initialOrders, vendorId }: { initialOrders: Order[], vendorId: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // 60-second Polling
  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, status, created_at, total")
        .eq("vendor_id", vendorId)
        .in("status", ["PENDING", "PREPARING", "READY"])
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (data) {
        setOrders(data);
      }
    };

    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [vendorId]);

  const updateStatus = async (orderId: string, currentStatus: string) => {
    setIsUpdating(orderId);
    
    let nextStatus = "PREPARING";
    if (currentStatus === "PREPARING") nextStatus = "READY";
    if (currentStatus === "READY") nextStatus = "DELIVERED";

    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o).filter(o => o.status !== "DELIVERED"));

    // DB Update (minimal egress)
    await supabase.from("orders").update({ status: nextStatus }).eq("id", orderId);
    setIsUpdating(null);
  };

  const getStatusColor = (status: string) => {
    if (status === "PENDING" || status === "NEW") return "bg-red-50 text-[#c82216]";
    if (status === "PREPARING") return "bg-orange-50 text-[#f46919]";
    return "bg-green-50 text-green-600";
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Active Orders</h3>
        <button 
          onClick={() => setOrders([...orders])} 
          className="text-sm font-bold text-[#f46919] hover:underline"
        >
          Refresh Now
        </button>
      </div>
      
      <div className="space-y-4 relative">
        <AnimatePresence>
          {orders.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-sm text-center py-8">
              No active orders right now.
            </motion.div>
          )}
          {orders.map((order) => (
            <motion.div 
              key={order.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-orange-100 transition"
            >
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="font-bold">#{order.id.slice(0,6).toUpperCase()}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Total: ${order.total.toFixed(2)}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-xs text-gray-400 font-medium mb-2">
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <button 
                  disabled={isUpdating === order.id}
                  onClick={() => updateStatus(order.id, order.status)}
                  className="text-sm font-bold bg-gray-50 hover:bg-gray-100 px-4 py-1.5 rounded-lg transition disabled:opacity-50"
                >
                  {order.status === "PENDING" ? "Start Prep" : order.status === "PREPARING" ? "Mark Ready" : "Complete"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
