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
        <h1 className="text-2xl font-bold text-foreground/70">Sign in to view your match history</h1>
        <p className="text-foreground/40">Your simulated games will be saved here.</p>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] gap-4">
        <h1 className="text-2xl font-bold text-foreground/70">No matches yet</h1>
        <p className="text-foreground/40">Start a draft to simulate your first game!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gold mb-6">Match History</h1>
      <div className="flex flex-col gap-4">
        {simulations.map((sim) => (
          <div
            key={sim.id}
            className="p-4 bg-card-bg rounded-xl border border-card-border hover:border-gold/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-sm font-bold ${
                sim.result.winner === 'blue' ? 'text-blue-accent' : 'text-red-accent'
              }`}>
                {sim.result.winner === 'blue' ? 'Blue' : 'Red'} Side Victory
              </div>
              <div className="text-xs text-foreground/30">
                {new Date(sim.created_at).toLocaleDateString()} &middot; {sim.result.duration}min
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Blue team */}
              <div className="flex gap-1 flex-1">
                {sim.blue_team.map((champ: any) => (
                  <div key={champ.id} className="w-8 h-8 rounded overflow-hidden border border-blue-accent/40">
                    <Image src={champ.image} alt={champ.name} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {/* Score */}
              <div className="text-center px-4">
                <span className="text-blue-accent font-bold">{sim.result.blueKills}</span>
                <span className="text-foreground/30 mx-2">-</span>
                <span className="text-red-accent font-bold">{sim.result.redKills}</span>
              </div>
              {/* Red team */}
              <div className="flex gap-1 flex-1 justify-end">
                {sim.red_team.map((champ: any) => (
                  <div key={champ.id} className="w-8 h-8 rounded overflow-hidden border border-red-accent/40">
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
