import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const MASTER_ADMIN_EMAILS = ['redi.admin@gmail.com']; // Update with your admin email

interface ClerkUserData {
  id: string;
  email_addresses: { email_address: string }[];
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  unsafe_metadata: { role?: string; shopName?: string; phone?: string };
  public_metadata: { role?: string };
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error('[CLERK WEBHOOK] Missing CLERK_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Missing secret' }, { status: 500 });
  }

  // Verify svix signature
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(SIGNING_SECRET);

  let evt: { type: string; data: ClerkUserData };
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as { type: string; data: ClerkUserData };
  } catch (err: unknown) {
    console.error('[CLERK WEBHOOK] Verification failed:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }

  const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata, public_metadata } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const email = email_addresses?.[0]?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim() || email?.split('@')[0] || 'User';

    // Role resolution: metadata role → existing DB role → default 'customer'
    const metadataRole = unsafe_metadata?.role || public_metadata?.role;

    // Check if master admin
    const isMasterAdmin = email && MASTER_ADMIN_EMAILS.includes(email.toLowerCase());

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('clerk_id', id)
      .maybeSingle();

    const resolvedRole = isMasterAdmin
      ? 'admin'
      : metadataRole || existingUser?.role || 'customer';

    const upsertPayload = {
      clerk_id: id,
      email,
      full_name: fullName,
      role: resolvedRole,
      avatar_url: image_url,
      updated_at: new Date().toISOString(),
    };

    const { data: upsertedUser, error } = await supabaseAdmin
      .from('users')
      .upsert(upsertPayload, { onConflict: 'clerk_id' })
      .select('id')
      .single();

    if (error) {
      console.error('[CLERK WEBHOOK] Upsert failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Auto-provision vendor profile if role is vendor
    if (resolvedRole === 'vendor' && upsertedUser) {
      const restaurantName = unsafe_metadata?.shopName || `${fullName}'s Restaurant`;
      const slug = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 60);

      await supabaseAdmin.from('restaurants').upsert({
        user_id: upsertedUser.id,
        name: restaurantName,
        slug: `${slug}-${upsertedUser.id.slice(0, 8)}`,
        phone: unsafe_metadata?.phone || '',
        status: 'pending',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' as never });
    }

    // Auto-provision rider profile if role is rider
    if (resolvedRole === 'rider' && upsertedUser) {
      await supabaseAdmin.from('riders').upsert({
        user_id: upsertedUser.id,
        city: 'Uyo',
        is_available: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    console.log(`[CLERK WEBHOOK] Synced user ${id} as ${resolvedRole}`);
  }

  if (eventType === 'user.deleted') {
    const { data: deletedUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', id)
      .maybeSingle();

    if (deletedUser) {
      // Anonymize orders instead of cascade delete (preserve for restaurant history)
      await supabaseAdmin
        .from('orders')
        .update({ delivery_address: 'Deleted User', delivery_notes: null })
        .eq('customer_id', deletedUser.id);
    }

    await supabaseAdmin.from('users').delete().eq('clerk_id', id);
    console.log(`[CLERK WEBHOOK] Deleted user ${id}`);
  }

  return NextResponse.json({ success: true });
}
