import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-49px)] px-6 relative">
      {/* Decorative lines */}
      <div className="absolute top-20 left-0 right-0 neon-line-h opacity-20" />
      <div className="absolute bottom-20 left-0 right-0 neon-line-h opacity-10" />

      {/* Hero */}
      <div className="text-center max-w-3xl animate-fade-up">
        <div className="inline-block px-4 py-1 border border-card-border bg-card-bg/50 text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/30 mb-8"
          style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
          // 172 champions &middot; 12 pro teams &middot; full draft sim
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05] font-mono">
          <span className="neon-gold animate-glitch">DRAFT.</span>{" "}
          <span className="neon-blue">SIMULATE.</span>{" "}
          <span className="neon-red">DOMINATE.</span>
        </h1>
        <p className="text-sm sm:text-base text-foreground/30 mb-12 leading-relaxed max-w-lg mx-auto font-mono">
          Pick real pro teams. Draft their champions. Watch the game unfold
          with play-by-play commentary, gold graphs, and MVP awards.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pro-draft"
            className="btn-primary px-10 py-4 text-sm font-mono font-bold uppercase tracking-widest bg-gold text-background"
          >
            Pro Match
          </Link>
          <Link
            href="/draft"
            className="px-10 py-4 text-sm font-mono font-bold uppercase tracking-widest border border-card-border text-foreground/40 hover:border-blue-accent/40 hover:text-blue-accent hover:glow-blue transition-all"
            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
          >
            Custom Draft
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl w-full stagger-children">
        <div className="animate-fade-up cyber-card bg-card-bg p-6 border border-card-border hover:border-blue-accent/20 hover:glow-blue transition-all group cyber-corners">
          <div className="text-xs font-mono uppercase tracking-widest text-blue-accent/60 mb-3">01 // Draft</div>
          <h3 className="font-mono font-bold text-sm mb-2 text-foreground/80">Pro-Style Ban/Pick</h3>
          <p className="text-[11px] font-mono text-foreground/25 leading-relaxed">
            Full 20-step draft with lane positions. Filter by role. Autofill for quick games.
          </p>
        </div>
        <div className="animate-fade-up cyber-card bg-card-bg p-6 border border-card-border hover:border-cyber-purple/20 hover:glow-purple transition-all group cyber-corners"
          style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
          <div className="text-xs font-mono uppercase tracking-widest text-cyber-purple/60 mb-3"
            style={{ color: 'var(--cyber-purple)', opacity: 0.6 }}>02 // Teams</div>
          <h3 className="font-mono font-bold text-sm mb-2 text-foreground/80">Pro Player Stats</h3>
          <p className="text-[11px] font-mono text-foreground/25 leading-relaxed">
            T1, Gen.G, IG, FPX, DWG, and more. Player ratings shape every fight.
          </p>
        </div>
        <div className="animate-fade-up cyber-card bg-card-bg p-6 border border-card-border hover:border-red-accent/20 hover:glow-red transition-all group cyber-corners"
          style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
          <div className="text-xs font-mono uppercase tracking-widest text-red-accent/60 mb-3">03 // Sim</div>
          <h3 className="font-mono font-bold text-sm mb-2 text-foreground/80">Rich Simulation</h3>
          <p className="text-[11px] font-mono text-foreground/25 leading-relaxed">
            Gold timeline, baron steals, aces, per-player KDA, damage stats, MVP.
          </p>
        </div>
      </div>
    </div>
  );
}
