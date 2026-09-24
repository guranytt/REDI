import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { notFound } from "next/navigation";
import OrderTrackingClient from "@/components/OrderTrackingClient";
import Navbar from "@/components/Navbar";

export const revalidate = 0; // Dynamic tracking

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  
  // Fetch Order
  const { data: order } = await supabase
    .from("orders")
    .select("*, restaurants(name, phone)")
    .eq("id", id)
    .single();

  if (!order) {
    notFound();
  }

  // Fetch Order Items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-container-margin py-8">
        <h1 className="text-2xl font-bold font-headline-md mb-6">
          Order Tracking
        </h1>
        
        <OrderTrackingClient initialOrder={order} items={items || []} />
      </main>
    </div>
  );
}
