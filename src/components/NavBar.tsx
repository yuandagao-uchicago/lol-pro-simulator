'use client';

import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors relative py-1 ${
          active ? 'text-gold' : 'text-foreground/50 hover:text-foreground'
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <nav className="glass flex items-center justify-between px-6 py-3 sticky top-0 z-50 border-b border-card-border/50">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:glow-gold transition-all">
          <span className="text-gold font-extrabold text-sm">LS</span>
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight hidden sm:block">
          LoL <span className="text-gold">Simulator</span>
        </span>
      </Link>
      <div className="flex items-center gap-6">
        {navLink('/pro-draft', 'Pro Match')}
        {navLink('/draft', 'Custom')}
        {isLoaded && isSignedIn && navLink('/history', 'History')}
        <div className="w-px h-5 bg-card-border" />
        {isLoaded && isSignedIn && <UserButton />}
        {isLoaded && !isSignedIn && (
          <SignInButton mode="modal">
            <button className="btn-primary px-4 py-2 text-xs font-bold bg-gold text-background rounded-lg">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
