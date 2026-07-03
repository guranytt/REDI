"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getSession } from '@auth0/nextjs-auth0';

export async function addProductAction(formData: FormData) {
  try {
    const session = await getSession();
    // Default fallback for testing if not logged in
    const userId = session?.user?.sub || '00000000-0000-0000-0000-000000000001'; 

    const supabase = await getSupabaseServerClient();
    
    // Validate vendor
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('owner_id', userId)
      .single();

    if (!vendor) throw new Error("Vendor profile not found for this user");

    // Extract fields
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const category_id = formData.get("category_id") as string;
    const image_url = formData.get("image_url") as string;

    if (!title || price <= 0 || !category_id) {
      throw new Error("Invalid product data");
    }

    // Insert Product
    const { error } = await supabase
      .from('products')
      .insert({
        vendor_id: vendor.id,
        category_id,
        title,
        price,
        image_url,
        is_available: true
      });

    if (error) throw new Error("Failed to insert product: " + error.message);

    return { success: true };
  } catch (error: any) {
    console.error("Add product error:", error);
    return { success: false, error: error.message };
  }
}
