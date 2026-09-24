import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from './supabase-admin';
import { NextRequest, NextResponse } from 'next/server';

export type UserRole = 'customer' | 'vendor' | 'rider' | 'admin';

/**
 * Get the current authenticated Clerk user ID and their role from Supabase.
 * Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<{
  clerkId: string;
  role: UserRole;
  dbUserId: string;
  email: string;
  fullName: string;
  phone: string;
} | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, role, email, full_name, phone')
    .eq('clerk_id', userId)
    .maybeSingle();

  if (!user) return null;

  return {
    clerkId: userId,
    role: user.role as UserRole,
    dbUserId: user.id,
    email: user.email,
    fullName: user.full_name || '',
    phone: user.phone || '',
  };
}

/**
 * Middleware: Require authenticated user.
 * Returns 401 if not signed in.
 */
export async function requireAuth(): Promise<
  { clerkId: string; role: UserRole; dbUserId: string; email: string; fullName: string; phone: string } | NextResponse
> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Please sign in first' }, { status: 401 });
  }
  return user;
}

/**
 * Middleware: Require vendor or admin role.
 */
export async function requireVendor(): Promise<
  { clerkId: string; role: UserRole; dbUserId: string; email: string; fullName: string; phone: string } | NextResponse
> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Please sign in first' }, { status: 401 });
  }
  if (user.role !== 'vendor' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Vendor access required' }, { status: 403 });
  }
  return user;
}

/**
 * Middleware: Require admin role.
 */
export async function requireAdmin(): Promise<
  { clerkId: string; role: UserRole; dbUserId: string; email: string; fullName: string; phone: string } | NextResponse
> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Please sign in first' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  return user;
}

/**
 * Middleware: Require rider or admin role.
 */
export async function requireRider(): Promise<
  { clerkId: string; role: UserRole; dbUserId: string; email: string; fullName: string; phone: string } | NextResponse
> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Please sign in first' }, { status: 401 });
  }
  if (user.role !== 'rider' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Rider access required' }, { status: 403 });
  }
  return user;
}

/**
 * Helper: Check if a returned value is an error response.
 */
export function isAuthError(result: unknown): result is NextResponse {
  return result instanceof NextResponse;
}
