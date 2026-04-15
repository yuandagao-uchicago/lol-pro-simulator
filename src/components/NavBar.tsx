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
        className={`text-xs font-mono uppercase tracking-widest transition-all relative py-1 ${
          active ? 'neon-blue' : 'text-foreground/40 hover:text-foreground/80'
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-1 left-0 right-0 h-px bg-blue-accent shadow-[0_0_8px_var(--blue-glow)]" />
        )}
      </Link>
    );
  };

  return (
    <nav className="glass flex items-center justify-between px-6 py-3 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 cyber-card-sm bg-card-bg border border-cyber-purple/30 flex items-center justify-center group-hover:glow-purple transition-all"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
          <span className="neon-purple font-extrabold text-xs font-mono">LS</span>
        </div>
        <span className="text-sm font-mono font-bold text-foreground/80 tracking-wider hidden sm:block">
          LOL<span className="neon-gold">_SIM</span>
        </span>
      </Link>
      <div className="flex items-center gap-5">
        {navLink('/pro-draft', 'Pro')}
        {navLink('/draft', 'Custom')}
        {isLoaded && isSignedIn && navLink('/history', 'History')}
        <div className="w-px h-4 bg-card-border" />
        {isLoaded && isSignedIn && <UserButton />}
        {isLoaded && !isSignedIn && (
          <SignInButton mode="modal">
            <button className="btn-primary px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest bg-gold text-background">
              Jack In
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
