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
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search champions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-card-bg border border-card-border rounded-lg text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold flex-1 min-w-[150px]"
        />
        <div className="flex gap-1">
          {LANE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setLaneFilter(key)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                laneFilter === key
                  ? 'bg-gold text-background'
                  : 'bg-card-bg text-foreground/50 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-[400px] overflow-y-auto p-1">
        {filtered.map((champ) => {
          const lanes = CHAMPION_LANES[champ.id] || [];
          return (
            <button
              key={champ.id}
              onClick={() => onSelect(champ)}
              className={`champion-card relative group rounded-md overflow-hidden border-2 border-transparent ${
                currentAction === 'ban'
                  ? 'hover:border-red-accent'
                  : currentTeam === 'blue'
                    ? 'hover:border-blue-accent'
                    : 'hover:border-red-accent'
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-end">
                <span className="text-[9px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity pb-0.5 truncate px-0.5">
                  {champ.name}
                </span>
              </div>
              {/* Lane indicator dots */}
              <div className="absolute top-0.5 right-0.5 flex gap-px">
                {lanes.length > 0 && laneFilter === 'all' && (
                  <span className="text-[7px] text-gold/70 bg-black/60 rounded px-0.5">
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
