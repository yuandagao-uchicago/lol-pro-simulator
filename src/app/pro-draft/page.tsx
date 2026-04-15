'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Champion, DRAFT_ORDER } from '@/lib/types';
import { Lane, PICK_LANE_ORDER } from '@/lib/lanes';
import { ProTeam } from '@/lib/pro-teams';
import ChampionGrid from '@/components/ChampionGrid';
import DraftBoard from '@/components/DraftBoard';

type Phase = 'team-select' | 'drafting';

export default function ProDraftPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [phase, setPhase] = useState<Phase>('team-select');
  const [teams, setTeams] = useState<ProTeam[]>([]);
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);

  // Team selection
  const [blueTeamInfo, setBlueTeamInfo] = useState<ProTeam | null>(null);
  const [redTeamInfo, setRedTeamInfo] = useState<ProTeam | null>(null);

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
      setLoading(false);
    });
  }, []);

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

  const handleSimulate = async () => {
    if (!blueTeamInfo || !redTeamInfo || bluePicks.length !== 5 || redPicks.length !== 5) return;

    setSimulating(true);
    try {
      const simRes = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueTeam: bluePicks,
          redTeam: redPicks,
          blueRoster: blueTeamInfo.roster,
          redRoster: redTeamInfo.roster,
          blueTeamInfo,
          redTeamInfo,
        }),
      });
      const result = await simRes.json();

      if (isSignedIn) {
        await fetch('/api/simulations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blueTeam: bluePicks,
            redTeam: redPicks,
            bans: { blue: blueBans, red: redBans },
            result,
          }),
        });
      }

      sessionStorage.setItem('lastSimulation', JSON.stringify({
        blueTeam: bluePicks,
        redTeam: redPicks,
        bans: { blue: blueBans, red: redBans },
        result,
      }));

      router.push('/simulation');
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-lg text-foreground/50">Loading...</div>
      </div>
    );
  }

  // ── Team Selection Phase ──
  if (phase === 'team-select') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gold mb-2 text-center">Pro Match Setup</h1>
        <p className="text-center text-foreground/40 mb-8">Choose two pro teams to face off</p>

        <div className="flex gap-8">
          {/* Blue Side Selection */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-blue-accent mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-accent" />
              Blue Side
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setBlueTeamInfo(team)}
                  disabled={redTeamInfo?.id === team.id}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    blueTeamInfo?.id === team.id
                      ? 'border-blue-accent bg-blue-accent/15'
                      : redTeamInfo?.id === team.id
                        ? 'border-card-border bg-card-bg/30 opacity-30 cursor-not-allowed'
                        : 'border-card-border bg-card-bg hover:border-blue-accent/50'
                  }`}
                >
                  <div className="text-sm font-bold">{team.shortName}</div>
                  <div className="text-xs text-foreground/40">{team.name}</div>
                  <div className="text-[10px] text-foreground/30 mt-1">{team.region}</div>
                </button>
              ))}
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center">
            <span className="text-3xl font-extrabold text-gold">VS</span>
          </div>

          {/* Red Side Selection */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-red-accent mb-4 flex items-center gap-2 justify-end">
              Red Side
              <span className="w-3 h-3 rounded-full bg-red-accent" />
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setRedTeamInfo(team)}
                  disabled={blueTeamInfo?.id === team.id}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    redTeamInfo?.id === team.id
                      ? 'border-red-accent bg-red-accent/15'
                      : blueTeamInfo?.id === team.id
                        ? 'border-card-border bg-card-bg/30 opacity-30 cursor-not-allowed'
                        : 'border-card-border bg-card-bg hover:border-red-accent/50'
                  }`}
                >
                  <div className="text-sm font-bold">{team.shortName}</div>
                  <div className="text-xs text-foreground/40">{team.name}</div>
                  <div className="text-[10px] text-foreground/30 mt-1">{team.region}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rosters Preview */}
        {(blueTeamInfo || redTeamInfo) && (
          <div className="flex gap-8 mt-8">
            {blueTeamInfo && (
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-accent mb-2">{blueTeamInfo.shortName} Roster</h3>
                <div className="flex flex-col gap-1">
                  {blueTeamInfo.roster.map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-xs bg-card-bg/50 rounded-lg px-3 py-2">
                      <span className="text-foreground/30 w-12 uppercase">{p.lane}</span>
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-foreground/30 ml-auto">{p.signatureChamps.slice(0, 3).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="w-8" />
            {redTeamInfo && (
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-accent mb-2">{redTeamInfo.shortName} Roster</h3>
                <div className="flex flex-col gap-1">
                  {redTeamInfo.roster.map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-xs bg-card-bg/50 rounded-lg px-3 py-2">
                      <span className="text-foreground/30 w-12 uppercase">{p.lane}</span>
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-foreground/30 ml-auto">{p.signatureChamps.slice(0, 3).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Start Draft Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPhase('drafting')}
            disabled={!blueTeamInfo || !redTeamInfo}
            className="px-8 py-4 text-lg font-bold bg-gold text-background rounded-xl hover:bg-gold-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Start Draft
          </button>
        </div>
      </div>
    );
  }

  // ── Drafting Phase ──
  const currentPickLane = getCurrentPickLane();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Team names header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-bold text-blue-accent">{blueTeamInfo?.shortName}</div>
        <button
          onClick={() => { setPhase('team-select'); handleReset(); }}
          className="text-xs text-foreground/30 hover:text-foreground transition-colors"
        >
          Change Teams
        </button>
        <div className="text-sm font-bold text-red-accent">{redTeamInfo?.shortName}</div>
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
        />
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={handleUndo} disabled={step === 0}
          className="px-4 py-2 text-sm font-medium bg-card-bg border border-card-border rounded-lg hover:border-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          Undo
        </button>
        <button onClick={handleReset}
          className="px-4 py-2 text-sm font-medium bg-card-bg border border-card-border rounded-lg hover:border-gold transition-colors">
          Reset
        </button>
        {isComplete && (
          <button onClick={handleSimulate} disabled={simulating}
            className="px-6 py-2 text-sm font-bold bg-gold text-background rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 ml-auto">
            {simulating ? 'Simulating...' : 'Simulate Game!'}
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
