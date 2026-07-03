"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getSession } from '@auth0/nextjs-auth0';

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");
    
    const userId = session.user.sub;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    const supabase = await getSupabaseServerClient();

    // Upsert profile data
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        phone_number: phone,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (e: any) {
    console.error("Profile update error:", e);
    return { success: false, error: e.message };
  }
}
