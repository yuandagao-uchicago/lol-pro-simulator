'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Champion, DRAFT_ORDER } from '@/lib/types';
import { Lane, PICK_LANE_ORDER } from '@/lib/lanes';
import { autofillDraft } from '@/lib/autofill';
import ChampionGrid from '@/components/ChampionGrid';
import DraftBoard from '@/components/DraftBoard';

export default function DraftPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [blueBans, setBlueBans] = useState<Champion[]>([]);
  const [redBans, setRedBans] = useState<Champion[]>([]);
  const [bluePicks, setBluePicks] = useState<Champion[]>([]);
  const [redPicks, setRedPicks] = useState<Champion[]>([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetch('/api/champions')
      .then((res) => res.json())
      .then((data) => {
        setChampions(data);
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

  const currentPickLane = getCurrentPickLane();

  const disabledIds = new Set([
    ...blueBans.map((c) => c.id),
    ...redBans.map((c) => c.id),
    ...bluePicks.map((c) => c.id),
    ...redPicks.map((c) => c.id),
  ]);

  const handleSelect = useCallback(
    (champion: Champion) => {
      if (!currentOrder || isComplete) return;
      const { team, action } = currentOrder;
      if (action === 'ban') {
        if (team === 'blue') setBlueBans((prev) => [...prev, champion]);
        else setRedBans((prev) => [...prev, champion]);
      } else {
        if (team === 'blue') setBluePicks((prev) => [...prev, champion]);
        else setRedPicks((prev) => [...prev, champion]);
      }
      setStep((prev) => prev + 1);
    },
    [currentOrder, isComplete]
  );

  const handleUndo = () => {
    if (step === 0) return;
    const prevOrder = DRAFT_ORDER[step - 1];
    if (prevOrder.action === 'ban') {
      if (prevOrder.team === 'blue') setBlueBans((prev) => prev.slice(0, -1));
      else setRedBans((prev) => prev.slice(0, -1));
    } else {
      if (prevOrder.team === 'blue') setBluePicks((prev) => prev.slice(0, -1));
      else setRedPicks((prev) => prev.slice(0, -1));
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
    if (bluePicks.length !== 5 || redPicks.length !== 5) return;
    setSimulating(true);
    try {
      const simRes = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueTeam: bluePicks, redTeam: redPicks }),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-49px)]">
        <div className="text-sm font-mono text-foreground/30 animate-pulse">// loading champions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-up">
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
          blueTeamName="BLU"
          redTeamName="RED"
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
            className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border border-card-border hover:border-blue-accent/40 hover:neon-blue transition-colors"
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
        {!isSignedIn && isComplete && (
          <span className="text-[10px] font-mono text-foreground/20 self-center">
            // sign in to save
          </span>
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
