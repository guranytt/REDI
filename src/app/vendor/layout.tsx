import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Utensils, Settings, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 text-[#333] font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="font-headline-md text-primary font-black text-2xl tracking-tight">REDI</span>
          <span className="ml-2 text-xs font-bold text-gray-400 uppercase">Vendor</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <Link href="/vendor" className="flex items-center space-x-3 px-3 py-2.5 bg-orange-50 text-[#f46919] rounded-xl font-bold transition">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/vendor/orders" className="flex items-center space-x-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition">
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
            <span className="ml-auto bg-[#c82216] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 New</span>
          </Link>
          <Link href="/vendor/menu" className="flex items-center space-x-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition">
            <Utensils className="w-5 h-5" />
            <span>Menu Manager</span>
          </Link>
          <Link href="/vendor/settings" className="flex items-center space-x-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 shadow-sm">
          <h1 className="font-bold text-lg">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c82216] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-gray-100 pl-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
