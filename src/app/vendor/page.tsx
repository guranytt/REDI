import { DollarSign, TrendingUp, ShoppingBag, Clock } from "lucide-react";
import ActiveOrdersClient from "@/components/vendor/ActiveOrdersClient";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export const revalidate = 0; // Dynamic data

export default async function VendorDashboard() {
  const supabase = await getSupabaseServerClient();
  
  // For MVP, we just grab the first vendor. In production, this comes from the Auth session.
  const { data: vendorData } = await supabase.from("vendors").select("id").limit(1).single();
  const vendorId = vendorData?.id;

  // Fetch initial active orders
  let initialOrders = [];
  if (vendorId) {
    const { data } = await supabase
      .from("orders")
      .select("id, status, created_at, total")
      .eq("vendor_id", vendorId)
      .in("status", ["PENDING", "PREPARING", "READY"])
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) initialOrders = data;
  }

  // Egress optimized: In a real scenario, this would use the `get_order_summary` RPC.
  // For now, we mock the metrics calculation based on minimal DB queries or static for visual.
  const metrics = {
    revenue: 4250.00,
    orders: 142,
    prepTime: "14 min"
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f46919] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">${metrics.revenue.toFixed(2)}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +5.2%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.orders}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c82216] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Avg Prep Time</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.prepTime}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders Client Component with Polling */}
        {vendorId ? (
          <ActiveOrdersClient initialOrders={initialOrders} vendorId={vendorId} />
        ) : (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
            No vendor account found.
          </div>
        )}

        {/* Top Products (Static for MVP Dashboard View) */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-6">
          <h3 className="font-bold text-lg mb-6">Top Selling Items</h3>
          
          <div className="space-y-5">
            {[
              { name: 'Classic Burger', sales: 45, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100&auto=format&fit=crop' },
              { name: 'Spicy Chicken', sales: 32, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=100&auto=format&fit=crop' },
              { name: 'Loaded Fries', sales: 28, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=100&auto=format&fit=crop' },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <img src={product.img} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.sales} orders</p>
                </div>
                <span className="font-bold text-[#f46919] text-sm">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
