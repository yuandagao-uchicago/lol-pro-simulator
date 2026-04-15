'use client';

import Image from 'next/image';
import { Champion } from '@/lib/types';
import { Lane, LANE_LABELS, CHAMPION_LANES } from '@/lib/lanes';
import { useState } from 'react';

interface ChampionGridProps {
  champions: Champion[];
  disabledIds: Set<string>;
  onSelect: (champion: Champion) => void;
  currentTeam: 'blue' | 'red';
  currentAction: 'ban' | 'pick';
  suggestedLane?: Lane;
}

const LANE_FILTERS: Array<{ key: Lane | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'top', label: 'Top' },
  { key: 'jungle', label: 'JG' },
  { key: 'mid', label: 'Mid' },
  { key: 'bot', label: 'Bot' },
  { key: 'support', label: 'Sup' },
];

export default function ChampionGrid({ champions, disabledIds, onSelect, currentTeam, currentAction, suggestedLane }: ChampionGridProps) {
  const [search, setSearch] = useState('');
  const [laneFilter, setLaneFilter] = useState<Lane | 'all'>(suggestedLane || 'all');

  const filtered = champions.filter((c) => {
    if (disabledIds.has(c.id)) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (laneFilter !== 'all') {
      const lanes = CHAMPION_LANES[c.id];
      if (!lanes || !lanes.includes(laneFilter)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar with cyber styling */}
      <div className="flex gap-2 items-center flex-wrap p-3 border border-card-border bg-card-bg/60 cyber-card">
        <span className="text-[9px] font-mono text-foreground/20 uppercase tracking-widest mr-1">//</span>
        <div className="relative flex-1 min-w-[150px]">
          <input
            type="text"
            placeholder="search champions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-background/80 border border-card-border text-sm font-mono text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-blue-accent/50 tracking-wide"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          />
        </div>
        <div className="w-px h-6 bg-card-border mx-1" />
        <div className="flex gap-1">
          {LANE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setLaneFilter(key)}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 border ${
                laneFilter === key
                  ? 'bg-gold text-background border-gold/60 shadow-[0_0_8px_rgba(240,224,64,0.2)]'
                  : 'bg-card-bg/80 text-foreground/40 border-card-border hover:text-foreground hover:border-foreground/20'
              }`}
              style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Champion grid */}
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-[400px] overflow-y-auto p-2 border border-card-border/50 bg-card-bg/20">
        {filtered.map((champ) => {
          const lanes = CHAMPION_LANES[champ.id] || [];
          return (
            <button
              key={champ.id}
              onClick={() => onSelect(champ)}
              className={`champion-card relative group overflow-hidden border-2 border-transparent ${
                currentAction === 'ban'
                  ? 'hover:border-red-accent hover:shadow-[0_0_10px_rgba(255,32,96,0.3)]'
                  : currentTeam === 'blue'
                    ? 'hover:border-blue-accent hover:shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'hover:border-red-accent hover:shadow-[0_0_10px_rgba(255,32,96,0.3)]'
              }`}
              title={`${champ.name} — ${lanes.map(l => LANE_LABELS[l]).join(', ') || 'Flex'}`}
            >
              <Image
                src={champ.image}
                alt={champ.name}
                width={48}
                height={48}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end">
                <span className="text-[8px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pb-0.5 truncate px-0.5 uppercase tracking-wider">
                  {champ.name}
                </span>
              </div>
              {/* Lane indicator dots */}
              <div className="absolute top-0.5 right-0.5 flex gap-px">
                {lanes.length > 0 && laneFilter === 'all' && (
                  <span className="text-[7px] font-mono text-gold/70 bg-black/70 px-0.5" style={{ clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))' }}>
                    {lanes.map(l => LANE_LABELS[l][0]).join('')}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
