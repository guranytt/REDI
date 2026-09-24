"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthUser } from "@/lib/auth";

export async function addProductAction(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      throw new Error("Unauthorized: You must be logged in to manage products");
    }
    const userId = user.dbUserId; 

    // Validate vendor
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!restaurant) throw new Error("Vendor profile not found for this user");

    // Extract fields
    const name = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const category_id = formData.get("category_id") as string;
    const image_url = formData.get("image_url") as string;

    if (!name || price <= 0) {
      throw new Error("Invalid product data");
    }

    // Insert Product
    const { error } = await supabaseAdmin
      .from('menu_items')
      .insert({
        restaurant_id: restaurant.id,
        category_id: category_id || null, // Optional in schema? Actually we didn't require category_id for MVP if it's tricky
        name,
        description: "Delicious " + name,
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
