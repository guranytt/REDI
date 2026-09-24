import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthUser } from "@/lib/auth";
import MenuClient from "@/components/vendor/MenuClient";

export const revalidate = 0; // Dynamic

export default async function VendorMenuPage() {
  const user = await getAuthUser();
  const userId = user?.dbUserId;
  
  let vendorId = "";
  if (userId) {
    const { data: restaurant } = await supabaseAdmin
      .from("restaurants")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    vendorId = restaurant?.id || "";
  }

  return <MenuClient vendorId={vendorId} />;
}
