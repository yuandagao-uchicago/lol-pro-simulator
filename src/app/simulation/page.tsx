'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Champion, GameState } from '@/lib/types';
import GameTimeline from '@/components/GameTimeline';

interface SimulationData {
  blueTeam: Champion[];
  redTeam: Champion[];
  bans: { blue: Champion[]; red: Champion[] };
  result: GameState;
}

export default function SimulationPage() {
  const router = useRouter();
  const [data, setData] = useState<SimulationData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastSimulation');
    if (!stored) {
      router.push('/draft');
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-sm font-mono text-foreground/30 animate-pulse uppercase tracking-widest">// loading simulation...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Teams display */}
      <div className="flex gap-6 mb-8 p-5 border border-card-border bg-card-bg/40 cyber-card relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/[0.02] via-transparent to-red-accent/[0.02]" />

        {/* Blue Team */}
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-5 bg-blue-accent" style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }} />
            <h2 className="text-sm font-bold font-mono uppercase tracking-widest neon-blue">Blue Side</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-accent/30 to-transparent" />
          </div>
          <div className="flex gap-2">
            {data.blueTeam.map((champ) => (
              <div key={champ.id} className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 overflow-hidden border-2 border-blue-accent/60 cyber-card-sm shadow-[0_0_8px_rgba(0,229,255,0.15)]">
                  <Image src={champ.image} alt={champ.name} width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-mono text-foreground/40 truncate max-w-[56px] uppercase">{champ.name}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-3 items-center">
            <span className="text-[8px] font-mono text-foreground/15 uppercase tracking-widest mr-1">bans</span>
            {data.bans.blue.map((champ) => (
              <div key={champ.id} className="w-6 h-6 overflow-hidden opacity-30 grayscale border border-card-border/30 cyber-card-sm">
                <Image src={champ.image} alt={champ.name} width={24} height={24} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center gap-1 relative z-10">
          <div className="w-px h-6 bg-gradient-to-b from-blue-accent/30 to-transparent" />
          <div className="py-2 px-3 border border-card-border bg-card-bg/80 cyber-card">
            <span className="text-lg font-extrabold neon-gold font-mono tracking-widest">VS</span>
          </div>
          <div className="w-px h-6 bg-gradient-to-b from-transparent to-red-accent/30" />
        </div>

        {/* Red Team */}
        <div className="flex-1 text-right relative z-10">
          <div className="flex items-center gap-3 mb-3 justify-end">
            <div className="flex-1 h-px bg-gradient-to-l from-red-accent/30 to-transparent" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-widest neon-red">Red Side</h2>
            <div className="w-2 h-5 bg-red-accent" style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)' }} />
          </div>
          <div className="flex gap-2 justify-end">
            {data.redTeam.map((champ) => (
              <div key={champ.id} className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 overflow-hidden border-2 border-red-accent/60 cyber-card-sm shadow-[0_0_8px_rgba(255,32,96,0.15)]">
                  <Image src={champ.image} alt={champ.name} width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-mono text-foreground/40 truncate max-w-[56px] uppercase">{champ.name}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-3 justify-end items-center">
            {data.bans.red.map((champ) => (
              <div key={champ.id} className="w-6 h-6 overflow-hidden opacity-30 grayscale border border-card-border/30 cyber-card-sm">
                <Image src={champ.image} alt={champ.name} width={24} height={24} className="w-full h-full object-cover" />
              </div>
            ))}
            <span className="text-[8px] font-mono text-foreground/15 uppercase tracking-widest ml-1">bans</span>
          </div>
        </div>
      </div>

      {/* Game Timeline */}
      <GameTimeline gameState={data.result} />

      {/* Actions */}
      <div className="flex gap-3 mt-8 justify-center">
        <button
          onClick={() => router.push('/draft')}
          className="btn-primary px-8 py-3 text-[10px] font-mono font-bold uppercase tracking-widest bg-gold text-background"
        >
          New Draft
        </button>
        <button
          onClick={() => {
            // Re-simulate with same teams
            const resim = async () => {
              const res = await fetch('/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blueTeam: data.blueTeam, redTeam: data.redTeam }),
              });
              const result = await res.json();
              const newData = { ...data, result };
              sessionStorage.setItem('lastSimulation', JSON.stringify(newData));
              setData(newData);
            };
            resim();
          }}
          className="px-8 py-3 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/[0.06] hover:shadow-[0_0_12px_rgba(240,224,64,0.1)] transition-all"
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
        >
          Re-simulate
        </button>
      </div>
    </div>
  );
}
