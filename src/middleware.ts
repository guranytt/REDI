import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Routes that require authentication.
 * Unauthenticated users will be redirected to sign-in.
 */
const isProtectedRoute = createRouteMatcher([
  '/vendor(.*)',
  '/rider(.*)',
  '/admin(.*)',
  '/profile(.*)',
  '/cart(.*)',
  '/orders(.*)',
]);

/**
 * Routes that require specific roles.
 * These are checked at the API layer with requireVendor/requireAdmin/requireRider.
 */
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
