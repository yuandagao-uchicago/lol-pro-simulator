'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Champion, DRAFT_ORDER } from '@/lib/types';
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
    const prevStep = step - 1;
    const prevOrder = DRAFT_ORDER[prevStep];

    if (prevOrder.action === 'ban') {
      if (prevOrder.team === 'blue') setBlueBans((prev) => prev.slice(0, -1));
      else setRedBans((prev) => prev.slice(0, -1));
    } else {
      if (prevOrder.team === 'blue') setBluePicks((prev) => prev.slice(0, -1));
      else setRedPicks((prev) => prev.slice(0, -1));
    }

    setStep(prevStep);
  };

  const handleReset = () => {
    setStep(0);
    setBlueBans([]);
    setRedBans([]);
    setBluePicks([]);
    setRedPicks([]);
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

      // Save to supabase if signed in
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

      // Store in sessionStorage for the simulation page
      sessionStorage.setItem(
        'lastSimulation',
        JSON.stringify({
          blueTeam: bluePicks,
          redTeam: redPicks,
          bans: { blue: blueBans, red: redBans },
          result,
        })
      );

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
        <div className="text-lg text-foreground/50">Loading champions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <DraftBoard
          blueBans={blueBans}
          redBans={redBans}
          bluePicks={bluePicks}
          redPicks={redPicks}
          currentStep={step}
          phase={isComplete ? 'complete' : currentOrder?.action || 'ban'}
          currentTeam={isComplete ? 'blue' : currentOrder?.team || 'blue'}
        />
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleUndo}
          disabled={step === 0}
          className="px-4 py-2 text-sm font-medium bg-card-bg border border-card-border rounded-lg hover:border-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium bg-card-bg border border-card-border rounded-lg hover:border-gold transition-colors"
        >
          Reset
        </button>
        {isComplete && (
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="px-6 py-2 text-sm font-bold bg-gold text-background rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 ml-auto"
          >
            {simulating ? 'Simulating...' : 'Simulate Game!'}
          </button>
        )}
        {!isSignedIn && isComplete && (
          <span className="text-xs text-foreground/40 self-center">
            Sign in to save results
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
        />
      )}
    </div>
  );
}
