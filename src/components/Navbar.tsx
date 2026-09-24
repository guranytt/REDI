import React from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import CartNavIcon from './CartNavIcon';

export default function Navbar() {
  return (
    <nav className="docked full-width top-0 sticky z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
      <div className="flex justify-between items-center w-full px-container-margin py-base max-w-7xl mx-auto min-h-[72px]">
        <div className="flex items-center gap-lg">
          <Link href="/" className="font-headline-lg text-headline-lg font-black text-primary tracking-tighter">
            REDI
          </Link>
          <div className="hidden md:flex items-center gap-md">
            <Link href="/browse" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Restaurants
            </Link>
            <Link href="/vendor" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Vendor Dashboard
            </Link>
            <Link href="/rider" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Rider Portal
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-sm">
          <CartNavIcon />
          
          <SignedOut>
            <div className="hidden sm:block">
              <SignInButton mode="modal">
                <button className="font-label-md text-label-md text-on-surface-variant hover:opacity-90 hover:scale-[1.02] transition-all px-4 py-2">
                  Login
                </button>
              </SignInButton>
            </div>
            <SignUpButton mode="modal">
              <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <button className="md:hidden text-on-surface ml-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
