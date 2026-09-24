import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Users, Store, Bike, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

export const revalidate = 0;

export default async function AdminDashboard() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    notFound();
  }

  // Fetch some top-level metrics for MVP
  const { count: userCount } = await supabaseAdmin.from("users").select("*", { count: "exact", head: true });
  const { count: restaurantCount } = await supabaseAdmin.from("restaurants").select("*", { count: "exact", head: true });
  const { count: riderCount } = await supabaseAdmin.from("riders").select("*", { count: "exact", head: true });
  const { count: orderCount } = await supabaseAdmin.from("orders").select("*", { count: "exact", head: true });

  const { data: recentOrders } = await supabaseAdmin
    .from("orders")
    .select("id, total, status, created_at, restaurants(name), users(full_name)")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-container-margin py-8">
        <h1 className="text-2xl font-bold font-headline-md mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold">{userCount || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-50 text-[#f46919] rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Restaurants</p>
              <p className="text-2xl font-bold">{restaurantCount || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Riders</p>
              <p className="text-2xl font-bold">{riderCount || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-bold">{orderCount || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Restaurant</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders?.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 pl-6 font-medium">#{order.id.slice(0,6).toUpperCase()}</td>
                    <td className="p-4">{(order.users as any)?.full_name || 'Guest'}</td>
                    <td className="p-4">{(order.restaurants as any)?.name || 'Unknown'}</td>
                    <td className="p-4 font-bold text-[#f46919]">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
}
