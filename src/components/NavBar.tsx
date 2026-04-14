'use client';

import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';

export default function NavBar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-card-bg/50 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3">
        <span className="text-2xl font-bold text-gold tracking-tight">
          LoL Simulator
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/draft"
          className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors"
        >
          New Game
        </Link>
        {isLoaded && isSignedIn && (
          <>
            <Link
              href="/history"
              className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors"
            >
              History
            </Link>
            <UserButton />
          </>
        )}
        {isLoaded && !isSignedIn && (
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium bg-gold text-background rounded-lg hover:bg-gold-dark transition-colors">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
