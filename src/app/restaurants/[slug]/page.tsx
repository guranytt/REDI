import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

export const revalidate = 60; // Cache for 60s

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();
  
  // Fetch Restaurant
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    notFound();
  }

  // Fetch Menu Items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*, restaurants(name)")
    .eq("restaurant_id", restaurant.id)
    .eq("is_available", true);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 w-full bg-gray-900">
        <Image 
          src={restaurant.cover_image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200"}
          alt={restaurant.name}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full px-container-margin pb-8 max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-headline-lg tracking-tight mb-2">
              {restaurant.name}
            </h1>
            <div className="flex items-center space-x-4 text-white/90 text-sm font-medium">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                15-25 min
              </span>
              <span>Uyo City</span>
              <span className="flex items-center">
                <span className="material-symbols-outlined text-[16px] mr-1 text-yellow-400">star</span>
                4.8 (120+ ratings)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <main className="max-w-7xl mx-auto px-container-margin py-12">
        <h2 className="text-2xl font-bold font-headline-md mb-6 border-b border-gray-100 pb-4">
          Full Menu
        </h2>
        
        {menuItems && menuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
            {menuItems.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            No items available right now.
          </div>
        )}
      </main>
    </div>
  );
}
