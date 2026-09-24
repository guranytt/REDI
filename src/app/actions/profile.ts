"use server";

import { getAuthUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function updateProfileAction(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");
    
    const userId = user.dbUserId;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    // Update user profile data in users table
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (e: any) {
    console.error("Profile update error:", e);
    return { success: false, error: e.message };
  }
}
