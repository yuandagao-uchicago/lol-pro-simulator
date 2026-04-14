'use client';

import Image from 'next/image';
import { Champion } from '@/lib/types';
import { useState } from 'react';

interface ChampionGridProps {
  champions: Champion[];
  disabledIds: Set<string>;
  onSelect: (champion: Champion) => void;
  currentTeam: 'blue' | 'red';
  currentAction: 'ban' | 'pick';
}

const ROLE_FILTERS = ['All', 'Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank'] as const;

export default function ChampionGrid({ champions, disabledIds, onSelect, currentTeam, currentAction }: ChampionGridProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const filtered = champions.filter((c) => {
    if (disabledIds.has(c.id)) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'All' && !c.tags.includes(roleFilter)) return false;
    return true;
  });

  const borderColor = currentAction === 'ban'
    ? 'border-red-accent'
    : currentTeam === 'blue'
      ? 'border-blue-accent'
      : 'border-red-accent';

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
        <div className="flex gap-1 flex-wrap">
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-gold text-background'
                  : 'bg-card-bg text-foreground/50 hover:text-foreground'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-[400px] overflow-y-auto p-1">
        {filtered.map((champ) => (
          <button
            key={champ.id}
            onClick={() => onSelect(champ)}
            className={`champion-card relative group rounded-md overflow-hidden border-2 border-transparent hover:${borderColor}`}
            title={champ.name}
          >
            <Image
              src={champ.image}
              alt={champ.name}
              width={48}
              height={48}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-center">
              <span className="text-[9px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity pb-0.5 truncate px-0.5">
                {champ.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
