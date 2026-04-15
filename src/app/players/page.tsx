'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PRO_TEAMS, ProPlayer, ProTeam } from '@/lib/pro-teams';
import { PLAYER_PHOTOS, TEAM_LOGOS } from '@/lib/team-assets';
import { PLAYER_BIOS, PlayerBio } from '@/lib/player-bios';
import { LANE_LABELS } from '@/lib/lanes';
import TeamLogo from '@/components/TeamLogo';

function StatBar({ label, value }: { label: string; value: number }) {
  const color = value >= 93 ? 'bg-gold' : value >= 85 ? 'bg-blue-accent' : value >= 75 ? 'bg-foreground/40' : 'bg-foreground/20';
  const textColor = value >= 93 ? 'neon-gold' : value >= 85 ? 'neon-blue' : 'text-foreground/50';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-mono text-foreground/30 uppercase tracking-widest w-16">{label}</span>
      <div className="flex-1 h-1.5 bg-card-border/30 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))' }}>
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[10px] font-mono font-bold ${textColor} w-6 text-right`}>{value}</span>
    </div>
  );
}

function PlayerCard({ player, team, isExpanded, onToggle }: {
  player: ProPlayer;
  team: ProTeam;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const photo = PLAYER_PHOTOS[player.id];
  const bio = PLAYER_BIOS[player.id];

  return (
    <div className={`border bg-card-bg transition-all duration-300 ${
      isExpanded ? 'border-gold/30 glow-gold' : 'border-card-border hover:border-foreground/15'
    }`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
      {/* Header — always visible */}
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left">
        {/* Photo */}
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden border border-card-border bg-card-bg"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
          {photo ? (
            <Image src={photo} alt={player.name} width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/15 text-xl font-mono font-bold">
              {player.name[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold uppercase tracking-wider">{player.name}</span>
            <span className="text-[8px] font-mono text-foreground/20 uppercase tracking-widest px-1.5 py-0.5 border border-card-border/50">
              {LANE_LABELS[player.lane]}
            </span>
          </div>
          <div className="text-[10px] font-mono text-foreground/30 mt-0.5">
            {player.realName} &middot; {team.shortName}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-2 flex-shrink-0">
          {[
            { l: 'MCH', v: player.mechanics },
            { l: 'IQ', v: player.gameIQ },
            { l: 'PK', v: player.peakPerformance },
          ].map(s => (
            <div key={s.l} className={`text-center px-2 py-1 border border-card-border/30 ${
              s.v >= 93 ? 'bg-gold/5' : 'bg-card-bg/50'
            }`}>
              <div className={`text-[8px] font-mono text-foreground/20`}>{s.l}</div>
              <div className={`text-xs font-mono font-bold ${s.v >= 93 ? 'neon-gold' : s.v >= 85 ? 'neon-blue' : 'text-foreground/50'}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Expand indicator */}
        <span className="text-foreground/15 text-xs font-mono flex-shrink-0">
          {isExpanded ? '\u25b2' : '\u25bc'}
        </span>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-slide-down">
          <div className="neon-line-h opacity-15 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Stats + Signature Champs */}
            <div>
              <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em] mb-3">// player ratings</div>
              <div className="flex flex-col gap-2">
                <StatBar label="Mechanics" value={player.mechanics} />
                <StatBar label="Game IQ" value={player.gameIQ} />
                <StatBar label="Consistency" value={player.consistency} />
                <StatBar label="Peak" value={player.peakPerformance} />
                <StatBar label="Champ Pool" value={player.championPool} />
              </div>

              <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em] mt-4 mb-2">// avg game stats</div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { l: 'KDA', v: player.avgKDA.toFixed(1) },
                  { l: 'CS/m', v: player.avgCSPerMin.toFixed(1) },
                  { l: 'GD@15', v: `${player.avgGoldDiff15 >= 0 ? '+' : ''}${player.avgGoldDiff15}` },
                  { l: 'DPM', v: player.avgDPM.toString() },
                ].map(s => (
                  <div key={s.l} className="text-center p-2 border border-card-border/20 bg-card-bg/30">
                    <div className="text-[8px] font-mono text-foreground/20 uppercase">{s.l}</div>
                    <div className="text-xs font-mono font-bold text-foreground/70">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em] mt-4 mb-2">// signature champions</div>
              <div className="flex gap-1 flex-wrap">
                {player.signatureChamps.map(c => (
                  <span key={c} className="text-[10px] font-mono text-foreground/40 px-2 py-0.5 border border-card-border/30 bg-card-bg/50">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Bio + Facts + Highlights */}
            <div>
              {bio ? (
                <>
                  <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em] mb-2">// biography</div>
                  <p className="text-[11px] font-mono text-foreground/50 leading-relaxed mb-4">{bio.bio}</p>

                  {bio.achievements.length > 0 && (
                    <>
                      <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em] mb-2">// achievements</div>
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {bio.achievements.map(a => (
                          <span key={a} className="text-[9px] font-mono neon-gold px-2 py-0.5 border border-gold/20 bg-gold/5">
                            {a}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em] mb-2">// career facts</div>
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {bio.facts.map((f, i) => (
                      <li key={i} className="text-[10px] font-mono text-foreground/40 flex gap-2">
                        <span className="text-foreground/15 flex-shrink-0">&gt;</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {bio.highlights.length > 0 && (
                    <>
                      <div className="text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em] mb-2">// career highlights</div>
                      <div className="flex flex-col gap-2">
                        {bio.highlights.map(h => (
                          <a
                            key={h.youtubeId}
                            href={`https://www.youtube.com/watch?v=${h.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 border border-card-border/30 bg-card-bg/30 hover:border-red-accent/30 hover:bg-red-accent/5 transition-all group"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center bg-red-accent/10 border border-red-accent/20 flex-shrink-0 group-hover:bg-red-accent/20 transition-colors">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-accent/60">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <span className="text-[10px] font-mono text-foreground/40 group-hover:text-foreground/60 transition-colors truncate">
                              {h.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-[10px] font-mono text-foreground/20 italic">
                  // detailed bio coming soon
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayersPage() {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);

  const filteredTeams = teamFilter
    ? PRO_TEAMS.filter(t => t.id === teamFilter)
    : PRO_TEAMS;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-6">
        <div className="text-[10px] font-mono text-foreground/15 uppercase tracking-[0.3em] mb-2">// system.player_database</div>
        <h1 className="text-2xl font-extrabold neon-gold font-mono uppercase tracking-wider">Pro Players</h1>
        <div className="neon-line-h w-32 mt-3 opacity-40" />
      </div>

      {/* Team filter */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        <button
          onClick={() => setTeamFilter(null)}
          className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border transition-all ${
            teamFilter === null
              ? 'bg-gold text-background border-gold/60 shadow-[0_0_6px_rgba(240,224,64,0.2)]'
              : 'bg-card-bg text-foreground/30 border-card-border hover:border-foreground/20'
          }`}
          style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))' }}
        >
          All Teams
        </button>
        {PRO_TEAMS.map(team => (
          <button
            key={team.id}
            onClick={() => setTeamFilter(team.id)}
            className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border transition-all flex items-center gap-1.5 ${
              teamFilter === team.id
                ? 'bg-gold text-background border-gold/60 shadow-[0_0_6px_rgba(240,224,64,0.2)]'
                : 'bg-card-bg text-foreground/30 border-card-border hover:border-foreground/20'
            }`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))' }}
          >
            {team.shortName}
          </button>
        ))}
      </div>

      {/* Player list grouped by team */}
      <div className="flex flex-col gap-6">
        {filteredTeams.map(team => (
          <div key={team.id}>
            <div className="flex items-center gap-3 mb-3">
              <TeamLogo shortName={team.shortName} teamId={team.id} size="sm" />
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest">{team.name}</div>
                <div className="text-[9px] font-mono text-foreground/20">{team.region} &middot; {team.id.split('-')[1]}</div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-card-border to-transparent" />
            </div>
            <div className="flex flex-col gap-1.5">
              {team.roster.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  team={team}
                  isExpanded={expandedPlayer === player.id}
                  onToggle={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
