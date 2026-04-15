import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-6">
      {/* Hero */}
      <div className="text-center max-w-3xl animate-fade-up">
        <div className="inline-block px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs font-medium mb-6">
          172 Champions &middot; 12 Pro Teams &middot; Full Draft Simulation
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          <span className="text-gold">Draft.</span>{" "}
          <span className="text-blue-accent">Simulate.</span>{" "}
          <span className="text-red-accent">Dominate.</span>
        </h1>
        <p className="text-lg sm:text-xl text-foreground/40 mb-10 leading-relaxed max-w-xl mx-auto">
          Pick real pro teams, draft their champions in a full pro-style ban/pick,
          then watch the game unfold with play-by-play commentary, gold graphs, and MVP awards.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pro-draft"
            className="btn-primary px-8 py-4 text-lg font-bold bg-gold text-background rounded-xl"
          >
            Pro Match
          </Link>
          <Link
            href="/draft"
            className="px-8 py-4 text-lg font-bold border border-card-border text-foreground/60 rounded-xl hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all"
          >
            Custom Draft
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full stagger-children">
        <div className="animate-fade-up glass rounded-xl p-6 border border-card-border hover:border-blue-accent/30 transition-all group">
          <div className="text-3xl mb-3">
            <span className="text-blue-accent group-hover:glow-blue inline-block w-10 h-10 rounded-lg bg-blue-accent/10 flex items-center justify-center">\u2694\ufe0f</span>
          </div>
          <h3 className="font-bold text-sm mb-1">Pro-Style Draft</h3>
          <p className="text-xs text-foreground/30 leading-relaxed">
            Full 20-step ban/pick phase with lane positions. Filter champions by role — just like the real thing.
          </p>
        </div>
        <div className="animate-fade-up glass rounded-xl p-6 border border-card-border hover:border-gold/30 transition-all group">
          <div className="text-3xl mb-3">
            <span className="text-gold inline-block w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">\ud83c\udfc6</span>
          </div>
          <h3 className="font-bold text-sm mb-1">Pro Teams</h3>
          <p className="text-xs text-foreground/30 leading-relaxed">
            T1, Gen.G, IG, FPX, DWG, and more. Player skill ratings influence every fight and play.
          </p>
        </div>
        <div className="animate-fade-up glass rounded-xl p-6 border border-card-border hover:border-red-accent/30 transition-all group">
          <div className="text-3xl mb-3">
            <span className="text-red-accent inline-block w-10 h-10 rounded-lg bg-red-accent/10 flex items-center justify-center">\ud83d\udcca</span>
          </div>
          <h3 className="font-bold text-sm mb-1">Rich Simulation</h3>
          <p className="text-xs text-foreground/30 leading-relaxed">
            Lane matchups, gold timeline, player stats, baron steals, aces, and MVP awards.
          </p>
        </div>
      </div>
    </div>
  );
}
