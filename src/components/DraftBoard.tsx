'use client';

import Image from 'next/image';
import { Champion } from '@/lib/types';
import { Lane, LANE_LABELS, CHAMPION_LANES } from '@/lib/lanes';
import TeamLogo from './TeamLogo';

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
  blueTeamName?: string;
  redTeamName?: string;
  blueTeamId?: string;
  redTeamId?: string;
}

function BanSlot({ champion, side }: { champion?: Champion; side: 'blue' | 'red' }) {
  return (
    <div className={`w-11 h-11 border relative overflow-hidden transition-all duration-300 ${
      champion
        ? 'border-red-accent/30 bg-red-accent/5'
        : 'border-card-border/40 bg-card-bg/30'
    }`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))' }}
    >
      {champion ? (
        <>
          <Image
            src={champion.image}
            alt={champion.name}
            width={44}
            height={44}
            className="w-full h-full object-cover opacity-35 grayscale"
          />
          {/* X slash */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-accent/50">
              <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-0.5">
            <span className="text-[6px] font-mono text-foreground/40 uppercase truncate block text-center">{champion.name}</span>
          </div>
        </>
      ) : (
        <span className="text-[8px] font-mono text-foreground/10 uppercase absolute inset-0 flex items-center justify-center">BAN</span>
      )}
    </div>
  );
}

function PickSlot({ champion, lane, side, isActive, playerName }: {
  champion?: Champion;
  lane: Lane;
  side: 'blue' | 'red';
  isActive: boolean;
  playerName?: string;
}) {
  const accentColor = side === 'blue' ? 'blue-accent' : 'red-accent';

  // Champion loading art URL (tall portrait)
  const loadingUrl = champion
    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`
    : null;

  return (
    <div className={`relative overflow-hidden transition-all duration-300 border ${
      champion
        ? `border-${accentColor}/40`
        : isActive
          ? `border-${accentColor}/60 pick-active`
          : 'border-card-border/30 bg-card-bg/20'
    } ${side === 'red' ? 'text-right' : ''}`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        height: '72px',
      }}
    >
      {/* Background splash */}
      {champion && loadingUrl && (
        <div className="absolute inset-0">
          <Image
            src={loadingUrl}
            alt={champion.name}
            width={308}
            height={560}
            className={`absolute ${side === 'red' ? '-right-8' : '-left-8'} -top-12 h-[140%] w-auto object-cover opacity-30`}
            style={{ objectPosition: side === 'red' ? 'right center' : 'left center' }}
          />
          <div className={`absolute inset-0 ${
            side === 'blue'
              ? 'bg-gradient-to-r from-blue-accent/10 via-card-bg/60 to-card-bg/90'
              : 'bg-gradient-to-l from-red-accent/10 via-card-bg/60 to-card-bg/90'
          }`} />
        </div>
      )}

      {/* Active scanning effect */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 bottom-0 w-[1px] bg-${accentColor}/50`}
            style={{ animation: 'shimmer 2s linear infinite', left: side === 'blue' ? '0' : 'auto', right: side === 'red' ? '0' : 'auto' }} />
          <div className={`absolute inset-0 bg-${accentColor}/5`} />
        </div>
      )}

      {/* Lock-in glow border for filled picks */}
      {champion && (
        <div className={`absolute ${side === 'blue' ? 'left-0' : 'right-0'} top-0 bottom-0 w-[2px] bg-${accentColor} shadow-[0_0_8px_var(--${accentColor === 'blue-accent' ? 'blue' : 'red'}-glow)]`} />
      )}

      {/* Content */}
      <div className={`relative z-10 flex items-center gap-3 h-full px-3 ${side === 'red' ? 'flex-row-reverse' : ''}`}>
        {/* Champion icon */}
        <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-card-bg/50"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
          {champion ? (
            <Image
              src={champion.image}
              alt={champion.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/15 text-xl">
              {LANE_ICONS[lane]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={`flex-1 min-w-0 ${side === 'red' ? 'text-right' : ''}`}>
          {champion ? (
            <>
              <div className="text-sm font-mono font-bold uppercase tracking-wide truncate">
                {champion.name}
              </div>
              <div className="text-[9px] font-mono text-foreground/30 truncate">
                {playerName || (CHAMPION_LANES[champion.id] || []).map(l => LANE_LABELS[l]).join(' / ')}
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] font-mono text-foreground/15 uppercase tracking-[0.2em]">
                {LANE_LABELS[lane]}
              </div>
              {isActive && (
                <div className={`text-[9px] font-mono ${side === 'blue' ? 'text-blue-accent/50' : 'text-red-accent/50'} animate-pulse`}>
                  {'> awaiting pick'}
                </div>
              )}
            </>
          )}
        </div>

        {/* Lane tag */}
        <div className={`text-[7px] font-mono uppercase tracking-widest flex-shrink-0 px-1.5 py-0.5 border ${
          champion
            ? `text-${accentColor}/60 border-${accentColor}/20 bg-${accentColor}/5`
            : 'text-foreground/10 border-card-border/20'
        }`}>
          {LANE_LABELS[lane][0] + LANE_LABELS[lane].slice(1, 3).toUpperCase()}
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
  blueTeamName,
  redTeamName,
  blueTeamId,
  redTeamId,
}: DraftBoardProps) {
  const bluePickIndex = bluePicks.length;
  const redPickIndex = redPicks.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar: team logos + bans + phase indicator */}
      <div className="flex items-center gap-4">
        {/* Blue team identity */}
        <div className="flex items-center gap-3 flex-1">
          <TeamLogo shortName={blueTeamName || 'BLU'} teamId={blueTeamId} size="md" />
          <div>
            <div className="text-sm font-mono font-bold neon-blue uppercase tracking-widest">{blueTeamName || 'Blue'}</div>
            <div className="text-[8px] font-mono text-foreground/15 uppercase tracking-widest">blue side</div>
          </div>
        </div>

        {/* Center: phase indicator */}
        <div className="flex flex-col items-center px-6">
          {phase !== 'complete' ? (
            <div className="flex flex-col items-center gap-1.5 py-2 px-6 border border-card-border bg-card-bg/80"
              style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}>
              <div className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${
                currentTeam === 'blue' ? 'neon-blue' : 'neon-red'
              }`}>
                {currentTeam} side
              </div>
              <div className="neon-line-h w-full opacity-20" />
              <div className={`text-[9px] font-mono uppercase tracking-widest ${
                phase === 'ban' ? 'text-red-accent/70' : 'neon-gold'
              }`}>
                {phase === 'ban' ? 'banning phase' : `picking: ${currentPickLane ? LANE_LABELS[currentPickLane] : ''}`}
              </div>
            </div>
          ) : (
            <div className="py-2 px-6 border border-gold/30 bg-gold/5"
              style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}>
              <div className="text-[10px] font-mono font-bold neon-gold uppercase tracking-[0.3em]">
                draft locked in
              </div>
            </div>
          )}
        </div>

        {/* Red team identity */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="text-right">
            <div className="text-sm font-mono font-bold neon-red uppercase tracking-widest">{redTeamName || 'Red'}</div>
            <div className="text-[8px] font-mono text-foreground/15 uppercase tracking-widest">red side</div>
          </div>
          <TeamLogo shortName={redTeamName || 'RED'} teamId={redTeamId} size="md" />
        </div>
      </div>

      {/* Bans row */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <BanSlot key={`bb-${i}`} champion={blueBans[i]} side="blue" />
          ))}
          <span className="text-[7px] font-mono text-foreground/10 uppercase tracking-widest self-center ml-1">bans</span>
        </div>
        <div className="w-20" /> {/* spacer for center alignment */}
        <div className="flex gap-1 flex-1 justify-end">
          <span className="text-[7px] font-mono text-foreground/10 uppercase tracking-widest self-center mr-1">bans</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <BanSlot key={`rb-${i}`} champion={redBans[i]} side="red" />
          ))}
        </div>
      </div>

      {/* Neon divider */}
      <div className="neon-line-h opacity-15" />

      {/* Picks — two columns with center gap */}
      <div className="flex gap-6">
        {/* Blue picks */}
        <div className="flex-1 flex flex-col gap-1.5">
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

        {/* Red picks */}
        <div className="flex-1 flex flex-col gap-1.5">
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
