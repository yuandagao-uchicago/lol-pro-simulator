import { Champion, DRAFT_ORDER } from './types';
import { CHAMPION_LANES, Lane, PICK_LANE_ORDER } from './lanes';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getChampionsForLane(available: Champion[], lane: Lane): Champion[] {
  return available.filter(c => {
    const lanes = CHAMPION_LANES[c.id];
    return lanes && lanes.includes(lane);
  });
}

export interface AutofillResult {
  blueBans: Champion[];
  redBans: Champion[];
  bluePicks: Champion[];
  redPicks: Champion[];
}

/**
 * Autofill the remaining draft steps from the current position.
 * Respects already-made picks/bans and fills intelligently by lane.
 */
export function autofillDraft(
  champions: Champion[],
  currentStep: number,
  existingBlueBans: Champion[],
  existingRedBans: Champion[],
  existingBluePicks: Champion[],
  existingRedPicks: Champion[],
): AutofillResult {
  const blueBans = [...existingBlueBans];
  const redBans = [...existingRedBans];
  const bluePicks = [...existingBluePicks];
  const redPicks = [...existingRedPicks];

  const usedIds = new Set([
    ...blueBans.map(c => c.id),
    ...redBans.map(c => c.id),
    ...bluePicks.map(c => c.id),
    ...redPicks.map(c => c.id),
  ]);

  function pickRandom(): Champion {
    const available = champions.filter(c => !usedIds.has(c.id));
    const choice = available[Math.floor(Math.random() * available.length)];
    usedIds.add(choice.id);
    return choice;
  }

  function pickForLane(lane: Lane): Champion {
    const available = champions.filter(c => !usedIds.has(c.id));
    const laneChamps = getChampionsForLane(available, lane);
    const pool = laneChamps.length > 0 ? shuffle(laneChamps) : shuffle(available);
    const choice = pool[0];
    usedIds.add(choice.id);
    return choice;
  }

  for (let i = currentStep; i < DRAFT_ORDER.length; i++) {
    const { team, action } = DRAFT_ORDER[i];

    if (action === 'ban') {
      const champ = pickRandom();
      if (team === 'blue') blueBans.push(champ);
      else redBans.push(champ);
    } else {
      const pickIndex = team === 'blue' ? bluePicks.length : redPicks.length;
      const lane = PICK_LANE_ORDER[pickIndex];
      const champ = pickForLane(lane);
      if (team === 'blue') bluePicks.push(champ);
      else redPicks.push(champ);
    }
  }

  return { blueBans, redBans, bluePicks, redPicks };
}
