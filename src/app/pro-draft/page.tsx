'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Champion, DRAFT_ORDER } from '@/lib/types';
import { Lane, LANE_LABELS, PICK_LANE_ORDER } from '@/lib/lanes';
import { ProTeam, ProPlayer, PlayerWithTeam, getAllPlayers, buildCustomTeam } from '@/lib/pro-teams';
import { TEAM_LOGOS, PLAYER_PHOTOS } from '@/lib/team-assets';
import { autofillDraft } from '@/lib/autofill';
import Image from 'next/image';
import ChampionGrid from '@/components/ChampionGrid';
import DraftBoard from '@/components/DraftBoard';
import TeamLogo from '@/components/TeamLogo';

type Phase = 'team-select' | 'drafting';
type SetupMode = 'preset' | 'custom';

const LANE_ORDER: Lane[] = ['top', 'jungle', 'mid', 'bot', 'support'];

export default function ProDraftPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [phase, setPhase] = useState<Phase>('team-select');
  const [setupMode, setSetupMode] = useState<SetupMode>('preset');
  const [teams, setTeams] = useState<ProTeam[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [allPlayers, setAllPlayers] = useState<PlayerWithTeam[]>([]);
  const [loading, setLoading] = useState(true);

  // Preset team selection
  const [blueTeamInfo, setBlueTeamInfo] = useState<ProTeam | null>(null);
  const [redTeamInfo, setRedTeamInfo] = useState<ProTeam | null>(null);

  // Custom roster selection: lane -> player
  const [blueCustom, setBlueCustom] = useState<Record<Lane, PlayerWithTeam | null>>({
    top: null, jungle: null, mid: null, bot: null, support: null,
  });
  const [redCustom, setRedCustom] = useState<Record<Lane, PlayerWithTeam | null>>({
    top: null, jungle: null, mid: null, bot: null, support: null,
  });

  // Draft state
  const [step, setStep] = useState(0);
  const [blueBans, setBlueBans] = useState<Champion[]>([]);
  const [redBans, setRedBans] = useState<Champion[]>([]);
  const [bluePicks, setBluePicks] = useState<Champion[]>([]);
  const [redPicks, setRedPicks] = useState<Champion[]>([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/teams').then(r => r.json()),
      fetch('/api/champions').then(r => r.json()),
    ]).then(([teamsData, champsData]) => {
      setTeams(teamsData);
      setChampions(champsData);
      setAllPlayers(getAllPlayers());
      setLoading(false);
    });
  }, []);

  // Build ProTeam objects from custom rosters
  const blueCustomComplete = LANE_ORDER.every(l => blueCustom[l] !== null);
  const redCustomComplete = LANE_ORDER.every(l => redCustom[l] !== null);

  const getEffectiveTeams = (): { blue: ProTeam; red: ProTeam } | null => {
    if (setupMode === 'preset') {
      if (!blueTeamInfo || !redTeamInfo) return null;
      return { blue: blueTeamInfo, red: redTeamInfo };
    } else {
      if (!blueCustomComplete || !redCustomComplete) return null;
      const blueRoster = LANE_ORDER.map(l => blueCustom[l]!);
      const redRoster = LANE_ORDER.map(l => redCustom[l]!);
      return {
        blue: buildCustomTeam('Blue Legends', 'BLU', blueRoster),
        red: buildCustomTeam('Red Legends', 'RED', redRoster),
      };
    }
  };

  const canStartDraft = setupMode === 'preset'
    ? (blueTeamInfo && redTeamInfo)
    : (blueCustomComplete && redCustomComplete);

  const currentOrder = step < DRAFT_ORDER.length ? DRAFT_ORDER[step] : null;
  const isComplete = step >= DRAFT_ORDER.length;

  const getCurrentPickLane = (): Lane | undefined => {
    if (!currentOrder || currentOrder.action !== 'pick') return undefined;
    const pickIndex = currentOrder.team === 'blue' ? bluePicks.length : redPicks.length;
    return PICK_LANE_ORDER[pickIndex];
  };

  const disabledIds = new Set([
    ...blueBans.map(c => c.id),
    ...redBans.map(c => c.id),
    ...bluePicks.map(c => c.id),
    ...redPicks.map(c => c.id),
  ]);

  const handleSelect = useCallback(
    (champion: Champion) => {
      if (!currentOrder || isComplete) return;
      const { team, action } = currentOrder;
      if (action === 'ban') {
        if (team === 'blue') setBlueBans(prev => [...prev, champion]);
        else setRedBans(prev => [...prev, champion]);
      } else {
        if (team === 'blue') setBluePicks(prev => [...prev, champion]);
        else setRedPicks(prev => [...prev, champion]);
      }
      setStep(prev => prev + 1);
    },
    [currentOrder, isComplete]
  );

  const handleUndo = () => {
    if (step === 0) return;
    const prevOrder = DRAFT_ORDER[step - 1];
    if (prevOrder.action === 'ban') {
      if (prevOrder.team === 'blue') setBlueBans(prev => prev.slice(0, -1));
      else setRedBans(prev => prev.slice(0, -1));
    } else {
      if (prevOrder.team === 'blue') setBluePicks(prev => prev.slice(0, -1));
      else setRedPicks(prev => prev.slice(0, -1));
    }
    setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setBlueBans([]);
    setRedBans([]);
    setBluePicks([]);
    setRedPicks([]);
  };

  const handleAutofill = () => {
    if (champions.length === 0) return;
    const result = autofillDraft(champions, step, blueBans, redBans, bluePicks, redPicks);
    setBlueBans(result.blueBans);
    setRedBans(result.redBans);
    setBluePicks(result.bluePicks);
    setRedPicks(result.redPicks);
    setStep(DRAFT_ORDER.length);
  };

  const handleSimulate = async () => {
    const effectiveTeams = getEffectiveTeams();
    if (!effectiveTeams || bluePicks.length !== 5 || redPicks.length !== 5) return;

    setSimulating(true);
    try {
      const simRes = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueTeam: bluePicks,
          redTeam: redPicks,
          blueRoster: effectiveTeams.blue.roster,
          redRoster: effectiveTeams.red.roster,
          blueTeamInfo: effectiveTeams.blue,
          redTeamInfo: effectiveTeams.red,
        }),
      });
      const result = await simRes.json();

      if (isSignedIn) {
        await fetch('/api/simulations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blueTeam: bluePicks, redTeam: redPicks,
            bans: { blue: blueBans, red: redBans }, result,
          }),
        });
      }

      sessionStorage.setItem('lastSimulation', JSON.stringify({
        blueTeam: bluePicks, redTeam: redPicks,
        bans: { blue: blueBans, red: redBans }, result,
      }));
      router.push('/simulation');
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  // ── Player picker for custom roster ──
  const usedPlayerIds = new Set([
    ...Object.values(blueCustom).filter(Boolean).map(p => p!.id),
    ...Object.values(redCustom).filter(Boolean).map(p => p!.id),
  ]);

  function PlayerPicker({ side, lane }: { side: 'blue' | 'red'; lane: Lane }) {
    const custom = side === 'blue' ? blueCustom : redCustom;
    const setCustom = side === 'blue' ? setBlueCustom : setRedCustom;
    const selected = custom[lane];
    const lanePlayers = allPlayers.filter(p => p.lane === lane && !usedPlayerIds.has(p.id));
    const [open, setOpen] = useState(false);

    const neonClass = side === 'blue' ? 'border-blue-accent/30' : 'border-red-accent/30';
    const glowClass = side === 'blue' ? 'glow-blue' : 'glow-red';
    const neonText = side === 'blue' ? 'neon-blue' : 'neon-red';

    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 p-2.5 border bg-card-bg/80 transition-all text-left cyber-card-sm ${
            selected ? `${neonClass} ${glowClass}` : 'border-card-border hover:border-foreground/15'
          }`}
        >
          <span className="text-[9px] font-mono text-foreground/25 uppercase tracking-widest w-10 flex-shrink-0">
            {LANE_LABELS[lane]}
          </span>
          {selected ? (
            <>
              {PLAYER_PHOTOS[selected.id] && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-card-border flex-shrink-0 bg-card-bg">
                  <Image src={PLAYER_PHOTOS[selected.id]} alt={selected.name} width={32} height={32} className="w-full h-full object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold truncate">{selected.name}</div>
                <div className="text-[9px] font-mono text-foreground/30 truncate">{selected.teamShortName}</div>
              </div>
            </>
          ) : (
            <span className="text-[10px] font-mono text-foreground/20">{'> select player'}</span>
          )}
          {selected && (
            <div className="flex gap-1.5 flex-shrink-0">
              <StatBadge label="M" value={selected.mechanics} />
              <StatBadge label="IQ" value={selected.gameIQ} />
            </div>
          )}
          <span className="text-foreground/20 text-xs ml-auto flex-shrink-0">{open ? '\u25b2' : '\u25bc'}</span>
        </button>

        {open && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 border border-card-border bg-card-bg/95 backdrop-blur-md max-h-52 overflow-y-auto animate-slide-down"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            {/* Option to clear */}
            {selected && (
              <button
                onClick={() => { setCustom(prev => ({ ...prev, [lane]: null })); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-[10px] font-mono text-red-accent/60 hover:bg-red-accent/10 border-b border-card-border/30"
              >
                // clear selection
              </button>
            )}
            {lanePlayers.map(player => (
              <button
                key={player.id}
                onClick={() => { setCustom(prev => ({ ...prev, [lane]: player })); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-foreground/5 border-b border-card-border/20 transition-colors"
              >
                {PLAYER_PHOTOS[player.id] ? (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-card-border/50 flex-shrink-0 bg-card-bg">
                    <Image src={PLAYER_PHOTOS[player.id]} alt={player.name} width={28} height={28} className="w-full h-full object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border border-card-border/30 flex-shrink-0 bg-card-bg flex items-center justify-center">
                    <span className="text-[8px] font-mono text-foreground/20">{player.name[0]}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-semibold">{player.name}</div>
                  <div className="text-[9px] font-mono text-foreground/25">{player.teamShortName} &middot; {player.teamName}</div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <StatBadge label="M" value={player.mechanics} />
                  <StatBadge label="IQ" value={player.gameIQ} />
                  <StatBadge label="PK" value={player.peakPerformance} />
                </div>
              </button>
            ))}
            {lanePlayers.length === 0 && (
              <div className="px-3 py-3 text-[10px] font-mono text-foreground/20">// no available players</div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-49px)]">
        <div className="text-sm font-mono text-foreground/30 animate-pulse">// loading...</div>
      </div>
    );
  }

  // ── TEAM SELECTION PHASE ──
  if (phase === 'team-select') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up">
        <h1 className="text-2xl font-extrabold font-mono neon-gold mb-1 text-center uppercase tracking-wider">
          Pro Match Setup
        </h1>
        <p className="text-center text-[11px] font-mono text-foreground/30 mb-6">// choose teams or build your dream roster</p>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setSetupMode('preset')}
            className={`px-5 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${
              setupMode === 'preset'
                ? 'bg-gold text-background border-gold/60 shadow-[0_0_8px_rgba(240,224,64,0.2)]'
                : 'bg-card-bg text-foreground/40 border-card-border hover:border-foreground/20'
            }`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            Pro Teams
          </button>
          <button
            onClick={() => setSetupMode('custom')}
            className={`px-5 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${
              setupMode === 'custom'
                ? 'bg-gold text-background border-gold/60 shadow-[0_0_8px_rgba(240,224,64,0.2)]'
                : 'bg-card-bg text-foreground/40 border-card-border hover:border-foreground/20'
            }`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            Build Roster
          </button>
        </div>

        {/* ── PRESET MODE ── */}
        {setupMode === 'preset' && (
          <>
            <div className="flex gap-6">
              {/* Blue Side */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-4 bg-blue-accent" style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }} />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest neon-blue">Blue Side</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-accent/20 to-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {teams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => setBlueTeamInfo(team)}
                      disabled={redTeamInfo?.id === team.id}
                      className={`p-3 border text-left transition-all cyber-card-sm ${
                        blueTeamInfo?.id === team.id
                          ? 'border-blue-accent/50 bg-blue-accent/10 glow-blue'
                          : redTeamInfo?.id === team.id
                            ? 'border-card-border bg-card-bg/20 opacity-25 cursor-not-allowed'
                            : 'border-card-border bg-card-bg hover:border-blue-accent/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <TeamLogo shortName={team.shortName} teamId={team.id} size="sm" />
                        <div>
                          <div className="text-xs font-mono font-bold">{team.shortName}</div>
                          <div className="text-[9px] font-mono text-foreground/30">{team.name}</div>
                          <div className="text-[8px] font-mono text-foreground/20 mt-0.5">{team.region}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-card-border to-transparent" />
                <span className="text-lg font-mono font-extrabold neon-gold">VS</span>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-card-border to-transparent" />
              </div>

              {/* Red Side */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 justify-end">
                  <div className="flex-1 h-px bg-gradient-to-l from-red-accent/20 to-transparent" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest neon-red">Red Side</h2>
                  <div className="w-2 h-4 bg-red-accent" style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {teams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => setRedTeamInfo(team)}
                      disabled={blueTeamInfo?.id === team.id}
                      className={`p-3 border text-left transition-all cyber-card-sm ${
                        redTeamInfo?.id === team.id
                          ? 'border-red-accent/50 bg-red-accent/10 glow-red'
                          : blueTeamInfo?.id === team.id
                            ? 'border-card-border bg-card-bg/20 opacity-25 cursor-not-allowed'
                            : 'border-card-border bg-card-bg hover:border-red-accent/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <TeamLogo shortName={team.shortName} teamId={team.id} size="sm" />
                        <div>
                          <div className="text-xs font-mono font-bold">{team.shortName}</div>
                          <div className="text-[9px] font-mono text-foreground/30">{team.name}</div>
                          <div className="text-[8px] font-mono text-foreground/20 mt-0.5">{team.region}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Roster Preview */}
            {(blueTeamInfo || redTeamInfo) && (
              <div className="flex gap-6 mt-6">
                {blueTeamInfo && (
                  <div className="flex-1">
                    <div className="text-[9px] font-mono text-blue-accent/50 uppercase tracking-widest mb-2">// {blueTeamInfo.shortName} roster</div>
                    <div className="flex flex-col gap-1 stagger-children">
                      {blueTeamInfo.roster.map(p => (
                        <div key={p.id} className="animate-fade-up flex items-center gap-2 text-[10px] font-mono bg-card-bg/50 border border-card-border/30 px-3 py-1.5 cyber-card-sm">
                          <span className="text-foreground/20 w-10 uppercase tracking-widest">{p.lane}</span>
                          {PLAYER_PHOTOS[p.id] ? (
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-card-border/50 flex-shrink-0">
                              <Image src={PLAYER_PHOTOS[p.id]} alt={p.name} width={24} height={24} className="w-full h-full object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-card-border/30 flex-shrink-0 bg-card-bg flex items-center justify-center">
                              <span className="text-[7px] text-foreground/20">{p.name[0]}</span>
                            </div>
                          )}
                          <span className="font-bold">{p.name}</span>
                          <span className="text-foreground/15 ml-auto text-[9px]">{p.signatureChamps.slice(0, 3).join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="w-8" />
                {redTeamInfo && (
                  <div className="flex-1">
                    <div className="text-[9px] font-mono text-red-accent/50 uppercase tracking-widest mb-2">// {redTeamInfo.shortName} roster</div>
                    <div className="flex flex-col gap-1 stagger-children">
                      {redTeamInfo.roster.map(p => (
                        <div key={p.id} className="animate-fade-up flex items-center gap-2 text-[10px] font-mono bg-card-bg/50 border border-card-border/30 px-3 py-1.5 cyber-card-sm">
                          <span className="text-foreground/20 w-10 uppercase tracking-widest">{p.lane}</span>
                          {PLAYER_PHOTOS[p.id] ? (
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-card-border/50 flex-shrink-0">
                              <Image src={PLAYER_PHOTOS[p.id]} alt={p.name} width={24} height={24} className="w-full h-full object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-card-border/30 flex-shrink-0 bg-card-bg flex items-center justify-center">
                              <span className="text-[7px] text-foreground/20">{p.name[0]}</span>
                            </div>
                          )}
                          <span className="font-bold">{p.name}</span>
                          <span className="text-foreground/15 ml-auto text-[9px]">{p.signatureChamps.slice(0, 3).join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── CUSTOM ROSTER MODE ── */}
        {setupMode === 'custom' && (
          <div className="flex gap-6">
            {/* Blue Roster Builder */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-4 bg-blue-accent" style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }} />
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest neon-blue">Blue Roster</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-accent/20 to-transparent" />
              </div>
              <div className="flex flex-col gap-1.5">
                {LANE_ORDER.map(lane => (
                  <PlayerPicker key={`blue-${lane}`} side="blue" lane={lane} />
                ))}
              </div>
              {blueCustomComplete && (
                <div className="mt-2 text-[9px] font-mono text-blue-accent/40">// roster complete</div>
              )}
            </div>

            {/* VS */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-card-border to-transparent" />
              <span className="text-lg font-mono font-extrabold neon-gold">VS</span>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-card-border to-transparent" />
            </div>

            {/* Red Roster Builder */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 justify-end">
                <div className="flex-1 h-px bg-gradient-to-l from-red-accent/20 to-transparent" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest neon-red">Red Roster</h2>
                <div className="w-2 h-4 bg-red-accent" style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 85%)' }} />
              </div>
              <div className="flex flex-col gap-1.5">
                {LANE_ORDER.map(lane => (
                  <PlayerPicker key={`red-${lane}`} side="red" lane={lane} />
                ))}
              </div>
              {redCustomComplete && (
                <div className="mt-2 text-[9px] font-mono text-red-accent/40 text-right">// roster complete</div>
              )}
            </div>
          </div>
        )}

        {/* Start Draft Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPhase('drafting')}
            disabled={!canStartDraft}
            className="btn-primary px-10 py-4 text-sm font-mono font-bold uppercase tracking-widest bg-gold text-background disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Start Draft
          </button>
        </div>
      </div>
    );
  }

  // ── DRAFTING PHASE ──
  const currentPickLane = getCurrentPickLane();
  const effectiveTeams = getEffectiveTeams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-up">
      {/* Team names header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs font-mono font-bold neon-blue uppercase tracking-widest">
          {effectiveTeams?.blue.shortName}
        </div>
        <button
          onClick={() => { setPhase('team-select'); handleReset(); }}
          className="text-[9px] font-mono text-foreground/20 hover:text-foreground/50 transition-colors uppercase tracking-widest"
        >
          // change teams
        </button>
        <div className="text-xs font-mono font-bold neon-red uppercase tracking-widest">
          {effectiveTeams?.red.shortName}
        </div>
      </div>

      <div className="mb-6">
        <DraftBoard
          blueBans={blueBans}
          redBans={redBans}
          bluePicks={bluePicks}
          redPicks={redPicks}
          currentStep={step}
          phase={isComplete ? 'complete' : currentOrder?.action || 'ban'}
          currentTeam={isComplete ? 'blue' : currentOrder?.team || 'blue'}
          currentPickLane={currentPickLane}
          blueTeamName={effectiveTeams?.blue.shortName}
          redTeamName={effectiveTeams?.red.shortName}
          blueTeamId={effectiveTeams?.blue.id}
          redTeamId={effectiveTeams?.red.id}
        />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={handleUndo} disabled={step === 0}
          className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest bg-card-bg border border-card-border hover:border-foreground/20 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
          Undo
        </button>
        <button onClick={handleReset}
          className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest bg-card-bg border border-card-border hover:border-red-accent/30 transition-colors"
          style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
          Reset
        </button>
        {!isComplete && (
          <button onClick={handleAutofill}
            className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border border-card-border hover:border-blue-accent/40 transition-colors"
            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))', background: 'var(--card-bg)' }}>
            Autofill
          </button>
        )}
        {isComplete && (
          <button onClick={handleSimulate} disabled={simulating}
            className="btn-primary px-6 py-2 text-[10px] font-mono uppercase tracking-widest font-bold bg-gold text-background disabled:opacity-50 ml-auto">
            {simulating ? '// simulating...' : 'Simulate'}
          </button>
        )}
      </div>

      {!isComplete && (
        <ChampionGrid
          champions={champions}
          disabledIds={disabledIds}
          onSelect={handleSelect}
          currentTeam={currentOrder?.team || 'blue'}
          currentAction={currentOrder?.action || 'ban'}
          suggestedLane={currentPickLane}
        />
      )}
    </div>
  );
}

// ── Small stat badge for player cards ──
function StatBadge({ label, value }: { label: string; value: number }) {
  const color = value >= 90 ? 'text-gold' : value >= 80 ? 'text-blue-accent' : 'text-foreground/40';
  return (
    <div className={`text-[8px] font-mono ${color} bg-background/60 px-1 py-0.5 border border-card-border/30`}>
      <span className="text-foreground/20">{label}</span> {value}
    </div>
  );
}
