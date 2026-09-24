"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { CheckCircle2, Clock, Truck, MapPin } from "lucide-react";

export default function OrderTrackingClient({ initialOrder, items }: { initialOrder: any, items: any[] }) {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    const subscription = supabase
      .channel(`public:orders:${order.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` },
        (payload) => {
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [order.id]);

  const steps = [
    { status: "pending", label: "Order Received", icon: Clock },
    { status: "preparing", label: "Preparing", icon: CheckCircle2 },
    { status: "ready", label: "Ready for Pickup", icon: MapPin },
    { status: "delivered", label: "Delivered", icon: Truck },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status) !== -1 
    ? steps.findIndex(s => s.status === order.status) 
    : 0;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      
      {/* Status Header */}
      <div className="mb-10 text-center">
        <h2 className="text-xl font-bold text-gray-900 capitalize">
          {order.status.replace("_", " ")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative flex justify-between mb-12">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isCompleted ? "bg-primary text-white" : "bg-white border-2 border-gray-200 text-gray-300"
              } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold mt-3 absolute top-12 whitespace-nowrap ${
                isCompleted ? "text-gray-900" : "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Order Details */}
      <div className="mt-20 border-t border-gray-100 pt-8">
        <h3 className="font-bold mb-4">Order Details from {order.restaurants?.name}</h3>
        
        <div className="space-y-3 mb-6">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-medium text-gray-900">${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">${order.total.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}
