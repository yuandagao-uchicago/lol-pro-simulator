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
      className={`w-10 h-10 border cyber-card-sm ${
        champion ? 'border-red-accent/50 bg-red-accent/10' : 'border-card-border bg-card-bg/50'
      } flex items-center justify-center overflow-hidden relative group`}
    >
      {champion ? (
        <>
          <Image
            src={champion.image}
            alt={champion.name}
            width={40}
            height={40}
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-accent/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-red-accent/60 text-lg font-bold">/</span>
          </div>
        </>
      ) : (
        <span className="text-[10px] font-mono text-foreground/15 uppercase">ban</span>
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
  const glowClass = side === 'blue' ? 'glow-blue' : 'glow-red';
  const bgColor = side === 'blue' ? 'bg-blue-accent/10' : 'bg-red-accent/10';
  const borderIdle = 'border-card-border';

  return (
    <div
      className={`flex items-center gap-3 p-2 border cyber-card-sm relative overflow-hidden transition-all duration-200 ${
        champion
          ? `${glowClass} ${bgColor}`
          : isActive
            ? `pick-active ${bgColor} border-card-border`
            : `${borderIdle} bg-card-bg/50`
      } ${side === 'red' ? 'flex-row-reverse text-right' : ''}`}
    >
      {/* Subtle gradient overlay for filled slots */}
      {champion && (
        <div className={`absolute inset-0 ${
          side === 'blue'
            ? 'bg-gradient-to-r from-blue-accent/5 to-transparent'
            : 'bg-gradient-to-l from-red-accent/5 to-transparent'
        }`} />
      )}
      {/* Active scanning line */}
      {isActive && (
        <div className={`absolute inset-0 overflow-hidden`}>
          <div className={`absolute top-0 h-full w-[2px] ${
            side === 'blue' ? 'bg-blue-accent/40' : 'bg-red-accent/40'
          }`} style={{ animation: 'shimmer 2s linear infinite' }} />
        </div>
      )}
      <div className="w-12 h-12 overflow-hidden flex-shrink-0 bg-card-bg cyber-card-sm relative z-10">
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
      <div className="flex-1 min-w-0 relative z-10">
        <div className="text-sm font-bold font-mono truncate uppercase tracking-wide">
          {champion ? champion.name : <span className="text-foreground/20 text-[10px] tracking-widest">{LANE_LABELS[lane]}</span>}
        </div>
        <div className="text-[10px] text-foreground/30 truncate font-mono">
          {champion
            ? (CHAMPION_LANES[champion.id] || []).map(l => LANE_LABELS[l]).join(' / ')
            : isActive ? <span className={side === 'blue' ? 'text-blue-accent/50' : 'text-red-accent/50'}>{'> select champion'}</span> : ''}
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-5 bg-blue-accent" style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }} />
          <h2 className="text-sm font-bold font-mono uppercase tracking-widest neon-blue">Blue Side</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-accent/30 to-transparent" />
        </div>
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <BanSlot key={i} champion={blueBans[i]} />
          ))}
          <span className="text-[8px] font-mono text-foreground/15 uppercase tracking-widest self-center ml-1">bans</span>
        </div>
        <div className="flex flex-col gap-1.5 stagger-children">
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
      <div className="flex flex-col items-center justify-center gap-3 px-4">
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-card-border to-transparent" />
        {phase !== 'complete' ? (
          <div className="flex flex-col items-center gap-2 py-3 px-5 border border-card-border bg-card-bg/80 cyber-card relative">
            <div className={`text-[10px] font-mono font-bold uppercase tracking-[0.25em] ${
              currentTeam === 'blue' ? 'neon-blue' : 'neon-red'
            }`}>
              {currentTeam} side
            </div>
            <div className="neon-line-h w-full opacity-30" />
            <div className={`text-[10px] font-mono font-medium uppercase tracking-widest ${
              phase === 'ban' ? 'text-red-accent' : 'neon-gold'
            }`}>
              {phase === 'ban' ? '// banning' : `// pick: ${currentPickLane ? LANE_LABELS[currentPickLane] : ''}`}
            </div>
          </div>
        ) : (
          <div className="py-3 px-5 border border-gold/30 bg-gold/5 cyber-card">
            <div className="text-[10px] font-mono font-bold neon-gold uppercase tracking-[0.25em]">
              Draft Complete
            </div>
          </div>
        )}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-card-border to-transparent" />
      </div>

      {/* Red Side */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center gap-3 mb-3 justify-end">
          <div className="flex-1 h-px bg-gradient-to-l from-red-accent/30 to-transparent" />
          <h2 className="text-sm font-bold font-mono uppercase tracking-widest neon-red">Red Side</h2>
          <div className="w-2 h-5 bg-red-accent" style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)' }} />
        </div>
        <div className="flex gap-1.5 mb-4 justify-end">
          <span className="text-[8px] font-mono text-foreground/15 uppercase tracking-widest self-center mr-1">bans</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <BanSlot key={i} champion={redBans[i]} />
          ))}
        </div>
        <div className="flex flex-col gap-1.5 stagger-children">
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
