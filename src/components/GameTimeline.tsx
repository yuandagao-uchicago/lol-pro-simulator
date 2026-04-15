'use client';

import { GameState, GameEvent } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface GameTimelineProps {
  gameState: GameState;
}

const EVENT_ICONS: Record<GameEvent['type'], string> = {
  kill: '\u2694\ufe0f',
  dragon: '\ud83d\udc09',
  herald: '\ud83d\udc41\ufe0f',
  baron: '\ud83d\udc79',
  tower: '\ud83c\udff0',
  teamfight: '\ud83d\udca5',
  inhibitor: '\ud83d\udea8',
  ace: '\ud83d\udc80',
  steal: '\u2728',
};

function GoldGraph({ goldTimeline, blueLabel, redLabel }: {
  goldTimeline: GameState['goldTimeline'];
  blueLabel: string;
  redLabel: string;
}) {
  if (goldTimeline.length < 2) return null;

  const maxGold = Math.max(...goldTimeline.map(s => Math.max(s.blueGold, s.redGold)));
  const width = 600;
  const height = 150;
  const padding = 30;

  const xScale = (i: number) => padding + (i / (goldTimeline.length - 1)) * (width - padding * 2);
  const yScale = (gold: number) => height - padding - ((gold / maxGold) * (height - padding * 2));

  const blueLine = goldTimeline.map((s, i) => `${xScale(i)},${yScale(s.blueGold)}`).join(' ');
  const redLine = goldTimeline.map((s, i) => `${xScale(i)},${yScale(s.redGold)}`).join(' ');

  return (
    <div className="bg-card-bg border border-card-border p-4 cyber-card cyber-corners">
      <h3 className="text-[10px] font-mono font-bold text-foreground/40 mb-3 uppercase tracking-[0.2em]">// Gold Over Time</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <line
            key={pct}
            x1={padding} y1={yScale(maxGold * pct)}
            x2={width - padding} y2={yScale(maxGold * pct)}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1}
          />
        ))}
        {/* Lines */}
        <polyline points={blueLine} fill="none" stroke="#0397ab" strokeWidth={2.5} strokeLinejoin="round" />
        <polyline points={redLine} fill="none" stroke="#e84057" strokeWidth={2.5} strokeLinejoin="round" />
        {/* End labels */}
        {goldTimeline.length > 0 && (
          <>
            <text x={width - padding + 5} y={yScale(goldTimeline[goldTimeline.length - 1].blueGold) + 4}
              fill="#0397ab" fontSize={10} fontWeight="bold">{blueLabel}</text>
            <text x={width - padding + 5} y={yScale(goldTimeline[goldTimeline.length - 1].redGold) + 4}
              fill="#e84057" fontSize={10} fontWeight="bold">{redLabel}</text>
          </>
        )}
        {/* Time labels */}
        {goldTimeline.filter((_, i) => i % Math.max(1, Math.floor(goldTimeline.length / 5)) === 0).map((s, i, arr) => (
          <text key={s.minute} x={xScale(goldTimeline.indexOf(s))} y={height - 5}
            fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle">{s.minute}m</text>
        ))}
      </svg>
    </div>
  );
}

function PlayerStatsTable({ playerStats, winner }: { playerStats: GameState['playerStats']; winner: string | null }) {
  const bluePlayers = playerStats.filter(p => p.side === 'blue');
  const redPlayers = playerStats.filter(p => p.side === 'red');

  const Row = ({ p, isWinner }: { p: typeof playerStats[0]; isWinner: boolean }) => {
    const kda = ((p.kills + p.assists) / Math.max(1, p.deaths)).toFixed(1);
    const kdaNum = parseFloat(kda);
    return (
      <tr className={`border-b border-card-border/20 transition-colors hover:bg-foreground/[0.02] ${isWinner ? 'bg-gold/[0.03]' : ''}`}>
        <td className="py-2 px-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 overflow-hidden flex-shrink-0 cyber-card-sm">
              <Image src={p.championImage} alt={p.championName} width={28} height={28} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono uppercase tracking-wide">{p.playerName}</div>
              <div className="text-[9px] text-foreground/25 font-mono">{p.championName}</div>
            </div>
          </div>
        </td>
        <td className="py-2 px-2 text-center text-xs font-mono font-bold">
          <span className="text-green-400">{p.kills}</span>
          <span className="text-foreground/20">/</span>
          <span className="text-red-400">{p.deaths}</span>
          <span className="text-foreground/20">/</span>
          <span className="text-foreground/50">{p.assists}</span>
        </td>
        <td className={`py-2 px-2 text-center text-xs font-mono font-bold ${kdaNum >= 5 ? 'text-gold' : kdaNum >= 3 ? 'text-foreground/70' : 'text-foreground/40'}`}>{kda}</td>
        <td className="py-2 px-2 text-center text-xs font-mono text-foreground/40">{p.cs}</td>
        <td className="py-2 px-2 text-center text-xs font-mono text-gold/60">{(p.gold / 1000).toFixed(1)}k</td>
        <td className="py-2 px-2 text-center text-xs font-mono text-foreground/40">{(p.damage / 1000).toFixed(1)}k</td>
      </tr>
    );
  };

  return (
    <div className="bg-card-bg border border-card-border overflow-hidden cyber-card cyber-corners">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border bg-background/50">
            <th className="py-2 px-3 text-left text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/30">Player</th>
            <th className="py-2 px-2 text-center text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/30">K/D/A</th>
            <th className="py-2 px-2 text-center text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/30">KDA</th>
            <th className="py-2 px-2 text-center text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/30">CS</th>
            <th className="py-2 px-2 text-center text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/30">Gold</th>
            <th className="py-2 px-2 text-center text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/30">DMG</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={6} className="py-1.5 px-3 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-blue-accent bg-blue-accent/[0.07] border-l-2 border-blue-accent/50">Blue Side</td></tr>
          {bluePlayers.map(p => <Row key={p.playerName} p={p} isWinner={winner === 'blue'} />)}
          <tr><td colSpan={6} className="py-1.5 px-3 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-red-accent bg-red-accent/[0.07] border-l-2 border-red-accent/50">Red Side</td></tr>
          {redPlayers.map(p => <Row key={p.playerName} p={p} isWinner={winner === 'red'} />)}
        </tbody>
      </table>
    </div>
  );
}

export default function GameTimeline({ gameState }: GameTimelineProps) {
  const [visibleEvents, setVisibleEvents] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(600);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || visibleEvents >= gameState.events.length) return;
    const timer = setTimeout(() => {
      setVisibleEvents((prev) => prev + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [visibleEvents, isPlaying, gameState.events.length, speed]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [visibleEvents]);

  const showAll = () => {
    setVisibleEvents(gameState.events.length);
    setIsPlaying(false);
  };

  const allVisible = visibleEvents >= gameState.events.length;
  const blueLabel = gameState.blueTeamName || 'Blue';
  const redLabel = gameState.redTeamName || 'Red';

  return (
    <div className="flex flex-col gap-4">
      {/* Scoreboard */}
      <div className="flex items-center justify-between p-5 bg-card-bg border border-card-border cyber-card cyber-corners relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/[0.03] via-transparent to-red-accent/[0.03]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-accent/30 via-transparent to-red-accent/30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-accent/20 via-transparent to-red-accent/20" />

        <div className="text-center flex-1 relative z-10">
          <div className="text-[10px] font-mono text-blue-accent font-bold mb-1 uppercase tracking-[0.2em]">{blueLabel}</div>
          <div className="text-4xl font-extrabold neon-blue font-mono">{gameState.blueKills}</div>
        </div>
        <div className="flex gap-5 items-center relative z-10">
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-foreground/50">{gameState.blueTowers}</div>
            <div className="text-[10px] text-foreground/30">\ud83c\udff0</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-foreground/50">{gameState.blueDragons}</div>
            <div className="text-[10px] text-foreground/30">\ud83d\udc09</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-foreground/50">{gameState.blueBarons}</div>
            <div className="text-[10px] text-foreground/30">\ud83d\udc79</div>
          </div>
        </div>
        <div className="px-6 relative z-10">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-px bg-gradient-to-r from-blue-accent/40 to-red-accent/40" />
            <div className="text-lg font-extrabold neon-gold font-mono tracking-widest">VS</div>
            <div className="w-8 h-px bg-gradient-to-r from-blue-accent/40 to-red-accent/40" />
          </div>
        </div>
        <div className="flex gap-5 items-center relative z-10">
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-foreground/50">{gameState.redBarons}</div>
            <div className="text-[10px] text-foreground/30">\ud83d\udc79</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-foreground/50">{gameState.redDragons}</div>
            <div className="text-[10px] text-foreground/30">\ud83d\udc09</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-foreground/50">{gameState.redTowers}</div>
            <div className="text-[10px] text-foreground/30">\ud83c\udff0</div>
          </div>
        </div>
        <div className="text-center flex-1 relative z-10">
          <div className="text-[10px] font-mono text-red-accent font-bold mb-1 uppercase tracking-[0.2em]">{redLabel}</div>
          <div className="text-4xl font-extrabold neon-red font-mono">{gameState.redKills}</div>
        </div>
      </div>

      {/* Gold Bar */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-[10px] font-mono font-bold neon-blue w-16 text-right tracking-wide">
          {(gameState.blueGold / 1000).toFixed(1)}k
        </span>
        <div className="flex-1 relative">
          <div className="h-3 overflow-hidden bg-card-bg/80 flex border border-card-border/50" style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 50%, calc(100% - 4px) 100%, 4px 100%, 0 50%)' }}>
            <div
              className="h-full bg-gradient-to-r from-blue-accent/80 to-blue-accent gold-bar"
              style={{ width: `${(gameState.blueGold / (gameState.blueGold + gameState.redGold)) * 100}%` }}
            />
            <div
              className="h-full bg-gradient-to-l from-red-accent/80 to-red-accent gold-bar"
              style={{ width: `${(gameState.redGold / (gameState.blueGold + gameState.redGold)) * 100}%` }}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-mono text-foreground/30 uppercase tracking-widest">gold</div>
        </div>
        <span className="text-[10px] font-mono font-bold neon-red w-16 tracking-wide">
          {(gameState.redGold / 1000).toFixed(1)}k
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center">
        {!allVisible && (
          <>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest bg-card-bg border border-card-border hover:border-gold/50 transition-all"
              style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
            >
              {isPlaying ? '// pause' : '// resume'}
            </button>
            <button onClick={showAll}
              className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest bg-card-bg border border-card-border hover:border-gold/50 transition-all"
              style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
            >
              {'>> skip'}
            </button>
            <div className="w-px h-5 bg-card-border mx-1" />
            <div className="flex gap-1">
              {[{ label: '1x', ms: 800 }, { label: '2x', ms: 400 }, { label: '4x', ms: 150 }].map(s => (
                <button key={s.label} onClick={() => setSpeed(s.ms)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider transition-all border ${
                    speed === s.ms ? 'bg-gold text-background border-gold/60 shadow-[0_0_6px_rgba(240,224,64,0.2)]' : 'bg-card-bg text-foreground/30 border-card-border hover:text-foreground hover:border-foreground/20'
                  }`}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-2 border-l border-card-border/30 ml-1">
        {gameState.events.slice(0, visibleEvents).map((event, i) => (
          <div
            key={i}
            className={`event-enter flex items-start gap-3 border transition-all relative ${
              event.highlight
                ? `cyber-card-sm event-highlight ${event.team === 'blue'
                  ? 'border-blue-accent/40 bg-blue-accent/10 p-4'
                  : 'border-red-accent/40 bg-red-accent/10 p-4'}`
                : event.team === 'blue'
                  ? 'border-blue-accent/[0.06] bg-blue-accent/[0.02] p-3'
                  : 'border-red-accent/[0.06] bg-red-accent/[0.02] p-3'
            }`}
          >
            {/* Side indicator bar */}
            <div className={`absolute left-0 top-2 bottom-2 w-[2px] ${
              event.team === 'blue' ? 'bg-blue-accent/30' : 'bg-red-accent/30'
            }`} />
            <span className={`flex-shrink-0 ${event.highlight ? 'text-2xl' : 'text-lg'} ml-1`}>
              {EVENT_ICONS[event.type]}
            </span>
            <div className="flex-1 min-w-0">
              <div className={`font-mono ${event.highlight ? 'text-sm font-bold' : 'text-sm text-foreground/80'}`}>
                {event.description}
              </div>
              {event.commentary && (
                <div className="text-[10px] mt-1 font-mono italic text-foreground/40 leading-relaxed">
                  {event.commentary}
                </div>
              )}
              {event.goldSwing && (
                <div className={`text-[9px] mt-0.5 font-mono font-bold ${event.team === 'blue' ? 'text-blue-accent/50' : 'text-red-accent/50'}`}>
                  +{event.goldSwing}g
                </div>
              )}
            </div>
            <span className="text-[10px] text-foreground/20 flex-shrink-0 font-mono mt-0.5 tabular-nums tracking-wide">
              {event.time}
            </span>
          </div>
        ))}
      </div>

      {/* Winner */}
      {allVisible && gameState.winner && (
        <>
          <div className={`victory-enter text-center p-8 border-2 cyber-card relative overflow-hidden ${
            gameState.winner === 'blue'
              ? 'border-blue-accent/60 bg-blue-accent/[0.08]'
              : 'border-red-accent/60 bg-red-accent/[0.08]'
          }`}>
            {/* Victory decorative elements */}
            <div className={`absolute inset-0 ${
              gameState.winner === 'blue'
                ? 'bg-gradient-to-b from-blue-accent/[0.06] via-transparent to-transparent'
                : 'bg-gradient-to-b from-red-accent/[0.06] via-transparent to-transparent'
            }`} />
            <div className={`absolute top-0 left-0 right-0 h-px ${
              gameState.winner === 'blue'
                ? 'bg-gradient-to-r from-transparent via-blue-accent/60 to-transparent'
                : 'bg-gradient-to-r from-transparent via-red-accent/60 to-transparent'
            }`} />
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/30 mb-3 relative z-10">// match result</div>
            <div className="text-4xl font-extrabold mb-3 font-mono relative z-10">
              {gameState.winner === 'blue' ? (
                <span className="neon-blue">{blueLabel} Wins!</span>
              ) : (
                <span className="neon-red">{redLabel} Wins!</span>
              )}
            </div>
            <div className="neon-line-h w-24 mx-auto mb-3 opacity-40" />
            <div className="text-[10px] font-mono text-foreground/40 mb-1 uppercase tracking-widest relative z-10">
              Duration: {gameState.duration} minutes
            </div>
            {gameState.mvp && (
              <div className="text-sm font-mono font-bold neon-gold mt-3 relative z-10 uppercase tracking-wider">
                MVP: {gameState.mvp}
              </div>
            )}
          </div>

          {/* Gold Graph */}
          <GoldGraph goldTimeline={gameState.goldTimeline} blueLabel={blueLabel} redLabel={redLabel} />

          {/* Player Stats */}
          <PlayerStatsTable playerStats={gameState.playerStats} winner={gameState.winner} />
        </>
      )}
    </div>
  );
}
