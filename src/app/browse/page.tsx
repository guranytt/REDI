import Link from "next/link";
import { Search, Heart, User, MapPin, ChevronRight, Star, Settings2 } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import CartNavIcon from "@/components/CartNavIcon";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 0;

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  const { data: products } = await supabase
    .from('products')
    .select('*, vendors(name)')
    .limit(10);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] text-[#333] font-sans pb-24">
      
      {/* Top Header Section with Gradient */}
      <div className="bg-gradient-to-br from-[#c82216] to-[#f46919] rounded-b-[40px] px-6 pt-10 pb-8 text-white shadow-md">
        <header className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-white/80 font-medium uppercase tracking-wider">Delivering to</span>
            <div className="flex items-center text-sm font-bold cursor-pointer hover:text-white/90">
              <MapPin className="w-4 h-4 mr-1 text-white/90" />
              Main Campus Dorms
              <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Heart className="w-6 h-6" />
            </button>
            <Link href="/profile" className="p-2 rounded-full hover:bg-white/10 transition">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </header>

        {/* Search */}
        <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Restaurants, groceries, dishes"
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none text-white placeholder:text-white/70 focus:ring-0 outline-none text-sm font-medium"
          />
          <button className="p-2 bg-white/20 rounded-xl mr-1">
            <Settings2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-4xl px-6 py-6 space-y-8">
        
        {/* Categories */}
        <section>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide pt-2">
            {[
              { name: 'Grocery', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200' },
              { name: 'Offer', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200', tag: '70% OFF' },
              { name: 'Chinese', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=200' },
              { name: 'Japanese', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200' },
            ].map((category) => (
              <div key={category.name} className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white p-1">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img src={category.img} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    {category.tag && (
                      <div className="absolute top-0 left-0 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                        {category.tag}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Near You (Using new Animated ProductGrid) */}
        <section>
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xl font-bold font-playfair tracking-tight">Popular Near You</h2>
            <Link href="/explore" className="text-[#f46919] text-sm font-bold flex items-center hover:opacity-80 transition">
              See all <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          
          <ProductGrid products={products || []} />
        </section>

        {/* Promo Banner */}
        <section className="relative w-full h-32 bg-[#fff1e5] rounded-[32px] overflow-hidden flex items-center justify-between p-6 shadow-sm border border-orange-50">
          <div className="z-10">
            <h2 className="text-lg font-bold text-[#333] mb-1">How was your order?</h2>
            <p className="text-xs text-gray-500 mb-2">Rooftop Restaurant</p>
            <div className="flex space-x-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 text-[#f46919]" strokeWidth={1.5} />
              ))}
            </div>
          </div>
          <div className="text-right font-serif text-[#f46919] font-bold text-4xl leading-none opacity-20 -mr-4">
            eat<br/>me
          </div>
        </section>

      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-center p-3 rounded-2xl text-[#f46919]">
          <div className="w-6 h-6 border-2 border-current rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-current rounded-sm"></div>
          </div>
        </div>
        <div className="flex items-center justify-center p-3 text-gray-400 hover:text-gray-800 transition">
          <Search className="w-6 h-6" />
        </div>
        <CartNavIcon />
        <Link href="/profile" className="flex items-center justify-center p-3 text-gray-400 hover:text-gray-800 transition">
          <User className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
}
