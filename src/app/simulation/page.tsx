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
        <div className="text-lg text-foreground/50">Loading simulation...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Teams display */}
      <div className="flex gap-8 mb-8">
        {/* Blue Team */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-blue-accent mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-accent" />
            Blue Side
          </h2>
          <div className="flex gap-2">
            {data.blueTeam.map((champ) => (
              <div key={champ.id} className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-blue-accent">
                  <Image src={champ.image} alt={champ.name} width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] text-foreground/60 truncate max-w-[56px]">{champ.name}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-2">
            {data.bans.blue.map((champ) => (
              <div key={champ.id} className="w-7 h-7 rounded overflow-hidden opacity-40 grayscale">
                <Image src={champ.image} alt={champ.name} width={28} height={28} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* VS */}
        <div className="flex items-center">
          <span className="text-2xl font-extrabold text-gold">VS</span>
        </div>

        {/* Red Team */}
        <div className="flex-1 text-right">
          <h2 className="text-lg font-bold text-red-accent mb-3 flex items-center gap-2 justify-end">
            Red Side
            <span className="w-3 h-3 rounded-full bg-red-accent" />
          </h2>
          <div className="flex gap-2 justify-end">
            {data.redTeam.map((champ) => (
              <div key={champ.id} className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-red-accent">
                  <Image src={champ.image} alt={champ.name} width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] text-foreground/60 truncate max-w-[56px]">{champ.name}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-2 justify-end">
            {data.bans.red.map((champ) => (
              <div key={champ.id} className="w-7 h-7 rounded overflow-hidden opacity-40 grayscale">
                <Image src={champ.image} alt={champ.name} width={28} height={28} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Timeline */}
      <GameTimeline gameState={data.result} />

      {/* Actions */}
      <div className="flex gap-3 mt-6 justify-center">
        <button
          onClick={() => router.push('/draft')}
          className="px-6 py-3 text-sm font-bold bg-gold text-background rounded-lg hover:bg-gold-dark transition-colors"
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
          className="px-6 py-3 text-sm font-bold border-2 border-gold/40 text-gold rounded-lg hover:border-gold hover:bg-gold/10 transition-all"
        >
          Re-simulate
        </button>
      </div>
    </div>
  );
}
