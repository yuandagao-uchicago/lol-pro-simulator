'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { Simulation } from '@/lib/types';

export default function HistoryPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    fetch('/api/simulations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSimulations(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-lg text-foreground/50">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] gap-4">
        <div className="text-[10px] font-mono text-foreground/15 uppercase tracking-[0.3em] mb-1">// access_denied</div>
        <h1 className="text-xl font-bold font-mono text-foreground/50 uppercase tracking-wider">Sign in to view match history</h1>
        <div className="neon-line-h w-24 opacity-30" />
        <p className="text-[11px] font-mono text-foreground/25">Your simulated games will be saved here.</p>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] gap-4">
        <div className="text-[10px] font-mono text-foreground/15 uppercase tracking-[0.3em] mb-1">// empty_archive</div>
        <h1 className="text-xl font-bold font-mono text-foreground/50 uppercase tracking-wider">No matches yet</h1>
        <div className="neon-line-h w-24 opacity-30" />
        <p className="text-[11px] font-mono text-foreground/25">Start a draft to simulate your first game!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-[10px] font-mono text-foreground/15 uppercase tracking-[0.3em] mb-2">// system.match_archive</div>
        <h1 className="text-2xl font-extrabold neon-gold font-mono uppercase tracking-wider">Match History</h1>
        <div className="neon-line-h w-32 mt-3 opacity-40" />
      </div>
      <div className="flex flex-col gap-3">
        {simulations.map((sim, index) => (
          <div
            key={sim.id}
            className={`p-4 bg-card-bg border border-card-border hover:border-gold/20 transition-all cyber-card-sm relative overflow-hidden group ${
              sim.result.winner === 'blue' ? 'hover:shadow-[0_0_12px_rgba(0,229,255,0.06)]' : 'hover:shadow-[0_0_12px_rgba(255,32,96,0.06)]'
            }`}
          >
            {/* Side indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${
              sim.result.winner === 'blue' ? 'bg-blue-accent/40' : 'bg-red-accent/40'
            }`} />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-foreground/15 tabular-nums">#{simulations.length - index}</span>
                <div className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  sim.result.winner === 'blue' ? 'neon-blue' : 'neon-red'
                }`}>
                  {sim.result.winner === 'blue' ? 'Blue' : 'Red'} Side Victory
                </div>
              </div>
              <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-wider">
                {new Date(sim.created_at).toLocaleDateString()} // {sim.result.duration}min
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Blue team */}
              <div className="flex gap-1 flex-1">
                {sim.blue_team.map((champ: any) => (
                  <div key={champ.id} className="w-8 h-8 overflow-hidden border border-blue-accent/30 cyber-card-sm">
                    <Image src={champ.image} alt={champ.name} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {/* Score */}
              <div className="text-center px-4">
                <span className="neon-blue font-bold font-mono text-sm">{sim.result.blueKills}</span>
                <span className="text-foreground/15 mx-2 font-mono text-xs">/</span>
                <span className="neon-red font-bold font-mono text-sm">{sim.result.redKills}</span>
              </div>
              {/* Red team */}
              <div className="flex gap-1 flex-1 justify-end">
                {sim.red_team.map((champ: any) => (
                  <div key={champ.id} className="w-8 h-8 overflow-hidden border border-red-accent/30 cyber-card-sm">
                    <Image src={champ.image} alt={champ.name} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
