import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import MenuClient from "@/components/vendor/MenuClient";

export const revalidate = 0; // Dynamic

export default async function VendorMenuPage() {
  const supabase = await getSupabaseServerClient();
  
  // For MVP, fetch first vendor
  const { data: vendorData } = await supabase.from("vendors").select("id").limit(1).single();
  const vendorId = vendorData?.id || "";

  return <MenuClient vendorId={vendorId} />;
}
