import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProfileClient from "@/components/ProfileClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFDFD] items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold font-sora mb-2">Please Log In</h1>
        <p className="text-gray-500 mb-6">You need to be logged in to view your profile and order history.</p>
        <Link href="/sign-in" className="bg-[#f46919] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#d65510] transition">
          Log In or Sign Up
        </Link>
        <Link href="/" className="mt-4 text-gray-500 font-bold hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const clerkId = user.id;

  // Fetch Profile from our new schema
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  const userId = profile?.id;

  // Fetch Order History
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, status, created_at, total')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 text-[#333]">
      <header className="flex items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/browse" className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold font-sora">Your Profile</h1>
      </header>

      <main className="p-6">
        <ProfileClient 
          initialProfile={profile || { id: userId || clerkId, full_name: user.firstName || '', role: 'customer' }} 
          orders={orders || []} 
        />
      </main>
    </div>
  );
}
