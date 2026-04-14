import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-extrabold tracking-tight mb-4">
          <span className="text-gold">Draft.</span>{" "}
          <span className="text-blue-accent">Simulate.</span>{" "}
          <span className="text-red-accent">Dominate.</span>
        </h1>
        <p className="text-xl text-foreground/60 mb-10 leading-relaxed">
          Pick your champions in a full pro-style draft, then watch the game
          unfold based on team compositions and champion synergies.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/draft"
            className="px-8 py-4 text-lg font-bold bg-gold text-background rounded-xl hover:bg-gold-dark transition-colors"
          >
            Start Draft
          </Link>
          <Link
            href="/history"
            className="px-8 py-4 text-lg font-bold border-2 border-gold/40 text-gold rounded-xl hover:border-gold hover:bg-gold/10 transition-all"
          >
            Match History
          </Link>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-3 gap-8 text-center max-w-xl">
        <div>
          <div className="text-3xl font-bold text-blue-accent">10</div>
          <div className="text-sm text-foreground/50 mt-1">Bans</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gold">10</div>
          <div className="text-sm text-foreground/50 mt-1">Picks</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-accent">1</div>
          <div className="text-sm text-foreground/50 mt-1">Winner</div>
        </div>
      </div>
    </div>
  );
}
