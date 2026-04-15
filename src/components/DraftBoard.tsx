'use client';

import Image from 'next/image';
import { Champion } from '@/lib/types';
import { Lane, LANE_LABELS, CHAMPION_LANES } from '@/lib/lanes';

const LANE_ORDER: Lane[] = ['top', 'jungle', 'mid', 'bot', 'support'];

const LANE_ICONS: Record<Lane, string> = {
  top: '\u2694',
  jungle: '\ud83c\udf32',
  mid: '\ud83d\udca0',
  bot: '\ud83c\udfaf',
  support: '\ud83d\udee1',
};

interface DraftBoardProps {
  blueBans: Champion[];
  redBans: Champion[];
  bluePicks: Champion[];
  redPicks: Champion[];
  currentStep: number;
  phase: 'ban' | 'pick' | 'complete';
  currentTeam: 'blue' | 'red';
  currentPickLane?: Lane;
}

function BanSlot({ champion }: { champion?: Champion }) {
  return (
    <div
      className={`w-10 h-10 rounded-md border ${
        champion ? 'border-red-accent/50 bg-red-accent/10' : 'border-card-border bg-card-bg/50'
      } flex items-center justify-center overflow-hidden`}
    >
      {champion ? (
        <Image
          src={champion.image}
          alt={champion.name}
          width={40}
          height={40}
          className="w-full h-full object-cover opacity-50 grayscale"
        />
      ) : (
        <span className="text-xs text-foreground/20">X</span>
      )}
    </div>
  );
}

function PickSlot({ champion, lane, side, isActive }: {
  champion?: Champion;
  lane: Lane;
  side: 'blue' | 'red';
  isActive: boolean;
}) {
  const borderColor = side === 'blue' ? 'border-blue-accent' : 'border-red-accent';
  const bgColor = side === 'blue' ? 'bg-blue-accent/10' : 'bg-red-accent/10';
  const activeBorder = side === 'blue' ? 'border-blue-accent' : 'border-red-accent';
  const activePulse = isActive ? 'animate-pulse' : '';

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg border ${
        champion
          ? `${borderColor} ${bgColor}`
          : isActive
            ? `${activeBorder} ${bgColor} ${activePulse}`
            : 'border-card-border bg-card-bg/50'
      } ${side === 'red' ? 'flex-row-reverse text-right' : ''}`}
    >
      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-card-bg">
        {champion ? (
          <Image
            src={champion.image}
            alt={champion.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground/20 text-lg">
            {LANE_ICONS[lane]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">
          {champion ? champion.name : <span className="text-foreground/30">{LANE_LABELS[lane]}</span>}
        </div>
        <div className="text-xs text-foreground/40 truncate">
          {champion
            ? (CHAMPION_LANES[champion.id] || []).map(l => LANE_LABELS[l]).join(', ')
            : ''}
        </div>
      </div>
    </div>
  );
}

export default function DraftBoard({
  blueBans,
  redBans,
  bluePicks,
  redPicks,
  currentStep,
  phase,
  currentTeam,
  currentPickLane,
}: DraftBoardProps) {
  // Determine which pick index is active for each side
  const bluePickIndex = bluePicks.length;
  const redPickIndex = redPicks.length;

  return (
    <div className="flex gap-8 justify-between">
      {/* Blue Side */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-blue-accent" />
          <h2 className="text-lg font-bold text-blue-accent">Blue Side</h2>
        </div>
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <BanSlot key={i} champion={blueBans[i]} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {LANE_ORDER.map((lane, i) => (
            <PickSlot
              key={lane}
              champion={bluePicks[i]}
              lane={lane}
              side="blue"
              isActive={phase === 'pick' && currentTeam === 'blue' && i === bluePickIndex}
            />
          ))}
        </div>
      </div>

      {/* Center Status */}
      <div className="flex flex-col items-center justify-center gap-2">
        {phase !== 'complete' ? (
          <>
            <div className={`text-sm font-bold uppercase tracking-wider ${
              currentTeam === 'blue' ? 'text-blue-accent' : 'text-red-accent'
            }`}>
              {currentTeam} side
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider ${
              phase === 'ban' ? 'text-red-accent' : 'text-gold'
            }`}>
              {phase === 'ban' ? 'Banning' : `Picking ${currentPickLane ? LANE_LABELS[currentPickLane] : ''}`}
            </div>
          </>
        ) : (
          <div className="text-sm font-bold text-gold uppercase tracking-wider">
            Draft Complete
          </div>
        )}
      </div>

      {/* Red Side */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center gap-2 mb-3 justify-end">
          <h2 className="text-lg font-bold text-red-accent">Red Side</h2>
          <div className="w-3 h-3 rounded-full bg-red-accent" />
        </div>
        <div className="flex gap-1.5 mb-4 justify-end">
          {Array.from({ length: 5 }).map((_, i) => (
            <BanSlot key={i} champion={redBans[i]} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {LANE_ORDER.map((lane, i) => (
            <PickSlot
              key={lane}
              champion={redPicks[i]}
              lane={lane}
              side="red"
              isActive={phase === 'pick' && currentTeam === 'red' && i === redPickIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
