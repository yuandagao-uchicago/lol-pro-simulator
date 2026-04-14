'use client';

import { GameState, GameEvent } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';

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
};

export default function GameTimeline({ gameState }: GameTimelineProps) {
  const [visibleEvents, setVisibleEvents] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || visibleEvents >= gameState.events.length) return;

    const timer = setTimeout(() => {
      setVisibleEvents((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [visibleEvents, isPlaying, gameState.events.length]);

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

  return (
    <div className="flex flex-col gap-4">
      {/* Scoreboard */}
      <div className="flex items-center justify-between p-4 bg-card-bg rounded-xl border border-card-border">
        <div className="text-center flex-1">
          <div className="text-3xl font-bold text-blue-accent">{gameState.blueKills}</div>
          <div className="text-xs text-foreground/40 mt-1">Blue Kills</div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/60">{gameState.blueTowers}</div>
            <div className="text-[10px] text-foreground/30">Towers</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/60">{gameState.blueDragons}</div>
            <div className="text-[10px] text-foreground/30">Drakes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/60">{gameState.blueBarons}</div>
            <div className="text-[10px] text-foreground/30">Barons</div>
          </div>
        </div>
        <div className="px-4">
          <div className="text-lg font-bold text-gold">VS</div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/60">{gameState.redBarons}</div>
            <div className="text-[10px] text-foreground/30">Barons</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/60">{gameState.redDragons}</div>
            <div className="text-[10px] text-foreground/30">Drakes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground/60">{gameState.redTowers}</div>
            <div className="text-[10px] text-foreground/30">Towers</div>
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-3xl font-bold text-red-accent">{gameState.redKills}</div>
          <div className="text-xs text-foreground/40 mt-1">Red Kills</div>
        </div>
      </div>

      {/* Gold Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-blue-accent font-medium w-16 text-right">
          {(gameState.blueGold / 1000).toFixed(1)}k
        </span>
        <div className="flex-1 h-3 rounded-full overflow-hidden bg-card-bg flex">
          <div
            className="h-full bg-blue-accent gold-bar"
            style={{
              width: `${(gameState.blueGold / (gameState.blueGold + gameState.redGold)) * 100}%`,
            }}
          />
          <div
            className="h-full bg-red-accent gold-bar"
            style={{
              width: `${(gameState.redGold / (gameState.blueGold + gameState.redGold)) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs text-red-accent font-medium w-16">
          {(gameState.redGold / 1000).toFixed(1)}k
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!allVisible && (
          <>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 text-xs font-medium bg-card-bg border border-card-border rounded-lg hover:border-gold transition-colors"
            >
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={showAll}
              className="px-4 py-2 text-xs font-medium bg-card-bg border border-card-border rounded-lg hover:border-gold transition-colors"
            >
              Skip to End
            </button>
          </>
        )}
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2">
        {gameState.events.slice(0, visibleEvents).map((event, i) => (
          <div
            key={i}
            className={`event-enter flex items-start gap-3 p-3 rounded-lg border ${
              event.team === 'blue'
                ? 'border-blue-accent/20 bg-blue-accent/5'
                : 'border-red-accent/20 bg-red-accent/5'
            }`}
          >
            <span className="text-lg flex-shrink-0">{EVENT_ICONS[event.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{event.description}</div>
            </div>
            <span className="text-xs text-foreground/40 flex-shrink-0 font-mono">
              {event.time}
            </span>
          </div>
        ))}
      </div>

      {/* Winner */}
      {allVisible && gameState.winner && (
        <div className={`text-center p-6 rounded-xl border-2 ${
          gameState.winner === 'blue'
            ? 'border-blue-accent bg-blue-accent/10'
            : 'border-red-accent bg-red-accent/10'
        }`}>
          <div className="text-3xl font-extrabold mb-1">
            {gameState.winner === 'blue' ? (
              <span className="text-blue-accent">Blue Side Wins!</span>
            ) : (
              <span className="text-red-accent">Red Side Wins!</span>
            )}
          </div>
          <div className="text-sm text-foreground/50">
            Game Duration: {gameState.duration} minutes
          </div>
        </div>
      )}
    </div>
  );
}
