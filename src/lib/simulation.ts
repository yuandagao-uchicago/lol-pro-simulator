import { Champion, GameEvent, GameState, GoldSnapshot, PlayerStats } from './types';
import { ProPlayer, ProTeam } from './pro-teams';

// ── Helpers ──────────────────────────────────────────────

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weighted(blueWeight: number, redWeight: number): 'blue' | 'red' {
  return Math.random() < blueWeight / (blueWeight + redWeight) ? 'blue' : 'red';
}

function fmt(minute: number): string {
  const m = Math.floor(minute);
  const s = Math.floor((minute - m) * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const DRAGON_NAMES = ['Infernal', 'Mountain', 'Ocean', 'Cloud', 'Hextech', 'Chemtech'];

const KILL_VERBS_LANE = [
  'solo kills', 'catches out', 'outplays', 'all-ins', 'tower dives',
  'flash-engages onto', 'finds a flank on', 'zones out',
];
const KILL_VERBS_SKIRMISH = [
  'cleans up', 'picks off', 'collapses on', 'catches', 'assassinates',
  'bursts down', 'one-shots', 'chases down',
];
const TF_DESCRIPTIONS = [
  'A massive teamfight erupts in the river',
  'Both teams commit to an all-out brawl',
  'The engage lands perfectly',
  'A chaotic 5v5 breaks out around the objective',
  'The flanking play catches them off guard',
  'An explosive teamfight near Baron pit',
  'Dragon fight turns into a full-blown teamfight',
];

// ── Champion strength (used when no pro players) ─────────

function getChampStrength(team: Champion[]) {
  let early = 50, mid = 50, late = 50, tf = 50, skirmish = 50, obj = 50;
  for (const c of team) {
    const t = c.tags;
    if (t.includes('Assassin'))  { early += 3; mid += 4; skirmish += 5; late -= 2; }
    if (t.includes('Fighter'))   { mid += 3; skirmish += 3; obj += 2; }
    if (t.includes('Mage'))      { mid += 3; late += 3; tf += 4; }
    if (t.includes('Marksman'))  { late += 5; tf += 3; obj += 4; early -= 2; }
    if (t.includes('Support'))   { tf += 3; late += 2; }
    if (t.includes('Tank'))      { tf += 5; late += 3; obj += 2; early -= 1; }
  }
  return { early, mid, late, tf, skirmish, obj };
}

// ── Player performance roll ──────────────────────────────

function rollPerformance(player: ProPlayer): number {
  // Each game, a player performs somewhere between their floor and ceiling
  // consistency determines how likely they are to hit their peak
  const floor = player.peakPerformance * (player.consistency / 100) * 0.7;
  const ceiling = player.peakPerformance;
  const consistencyRoll = Math.random();
  // Higher consistency = more likely to be near ceiling
  const skew = Math.pow(consistencyRoll, (100 - player.consistency) / 50);
  return floor + (ceiling - floor) * skew;
}

interface TeamStrength {
  early: number;
  mid: number;
  late: number;
  tf: number;
  skirmish: number;
  obj: number;
  laneMatchups: Array<{ lane: string; blue: number; red: number; bluePlayer?: string; redPlayer?: string }>;
}

function computeTeamStrength(
  blueTeam: Champion[],
  redTeam: Champion[],
  blueRoster?: ProPlayer[],
  redRoster?: ProPlayer[],
): { blue: TeamStrength; red: TeamStrength } {
  const bc = getChampStrength(blueTeam);
  const rc = getChampStrength(redTeam);

  const lanes = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];
  const laneMatchups: TeamStrength['laneMatchups'] = [];

  if (blueRoster && redRoster) {
    // With pro players, combine player skill + champion synergy
    let blueEarly = 0, blueMid = 0, blueLate = 0, blueTF = 0, blueSkirmish = 0, blueObj = 0;
    let redEarly = 0, redMid = 0, redLate = 0, redTF = 0, redSkirmish = 0, redObj = 0;

    for (let i = 0; i < 5; i++) {
      const bp = blueRoster[i];
      const rp = redRoster[i];
      const bPerf = rollPerformance(bp);
      const rPerf = rollPerformance(rp);

      // Signature champion bonus (+8 if playing a signature champ)
      const bSigBonus = bp.signatureChamps.includes(blueTeam[i].id) ? 8 : 0;
      const rSigBonus = rp.signatureChamps.includes(redTeam[i].id) ? 8 : 0;

      const bLane = bp.mechanics * 0.5 + bp.gameIQ * 0.3 + bPerf * 0.2 + bSigBonus;
      const rLane = rp.mechanics * 0.5 + rp.gameIQ * 0.3 + rPerf * 0.2 + rSigBonus;

      laneMatchups.push({
        lane: lanes[i],
        blue: bLane,
        red: rLane,
        bluePlayer: bp.name,
        redPlayer: rp.name,
      });

      blueEarly += bp.mechanics * 0.4 + bPerf * 0.3;
      blueMid += bp.gameIQ * 0.4 + bPerf * 0.3;
      blueLate += bp.gameIQ * 0.3 + bp.consistency * 0.3 + bPerf * 0.2;
      blueTF += (bp.gameIQ + bp.mechanics) * 0.3 + bPerf * 0.2;
      blueSkirmish += bp.mechanics * 0.5 + bPerf * 0.3;
      blueObj += bp.gameIQ * 0.4 + bPerf * 0.2;

      redEarly += rp.mechanics * 0.4 + rPerf * 0.3;
      redMid += rp.gameIQ * 0.4 + rPerf * 0.3;
      redLate += rp.gameIQ * 0.3 + rp.consistency * 0.3 + rPerf * 0.2;
      redTF += (rp.gameIQ + rp.mechanics) * 0.3 + rPerf * 0.2;
      redSkirmish += rp.mechanics * 0.5 + rPerf * 0.3;
      redObj += rp.gameIQ * 0.4 + rPerf * 0.2;
    }

    // Blend champion comp + player skill (60% player, 40% comp)
    return {
      blue: {
        early: blueEarly * 0.6 + bc.early * 0.4,
        mid: blueMid * 0.6 + bc.mid * 0.4,
        late: blueLate * 0.6 + bc.late * 0.4,
        tf: blueTF * 0.6 + bc.tf * 0.4,
        skirmish: blueSkirmish * 0.6 + bc.skirmish * 0.4,
        obj: blueObj * 0.6 + bc.obj * 0.4,
        laneMatchups,
      },
      red: {
        early: redEarly * 0.6 + rc.early * 0.4,
        mid: redMid * 0.6 + rc.mid * 0.4,
        late: redLate * 0.6 + rc.late * 0.4,
        tf: redTF * 0.6 + rc.tf * 0.4,
        skirmish: redSkirmish * 0.6 + rc.skirmish * 0.4,
        obj: redObj * 0.6 + rc.obj * 0.4,
        laneMatchups,
      },
    };
  }

  // No pro players — use champion data only
  for (let i = 0; i < 5; i++) {
    laneMatchups.push({ lane: lanes[i], blue: 50 + rand(-10, 10), red: 50 + rand(-10, 10) });
  }

  return {
    blue: { ...bc, laneMatchups },
    red: { ...rc, laneMatchups },
  };
}

// ── Main simulation ──────────────────────────────────────

export interface SimulationOptions {
  blueTeam: Champion[];
  redTeam: Champion[];
  blueRoster?: ProPlayer[];
  redRoster?: ProPlayer[];
  blueTeamInfo?: ProTeam;
  redTeamInfo?: ProTeam;
}

export function simulateGame(opts: SimulationOptions): GameState {
  const { blueTeam, redTeam, blueRoster, redRoster, blueTeamInfo, redTeamInfo } = opts;
  const { blue: bs, red: rs } = computeTeamStrength(blueTeam, redTeam, blueRoster, redRoster);

  // Team-level bonuses from pro team data
  const btw = blueTeamInfo?.teamwork ?? 75;
  const rtw = redTeamInfo?.teamwork ?? 75;

  const state: GameState = {
    blueGold: 0, redGold: 0,
    blueKills: 0, redKills: 0,
    blueTowers: 0, redTowers: 0,
    blueDragons: 0, redDragons: 0,
    blueBarons: 0, redBarons: 0,
    events: [],
    goldTimeline: [],
    playerStats: [],
    winner: null,
    duration: 0,
    blueTeamName: blueTeamInfo?.shortName,
    redTeamName: redTeamInfo?.shortName,
  };

  // Track per-player stats
  const pStats: Record<string, { kills: number; deaths: number; assists: number; damage: number }> = {};
  type PlayerInfo = { name: string; champ: Champion; side: 'blue' | 'red'; roster?: ProPlayer };
  const allPlayers: PlayerInfo[] = [
    ...blueTeam.map((c, i) => ({ name: blueRoster?.[i]?.name ?? c.name, champ: c, side: 'blue' as const, roster: blueRoster?.[i] })),
    ...redTeam.map((c, i) => ({ name: redRoster?.[i]?.name ?? c.name, champ: c, side: 'red' as const, roster: redRoster?.[i] })),
  ];
  for (const p of allPlayers) {
    pStats[p.name] = { kills: 0, deaths: 0, assists: 0, damage: 0 };
  }
  const bluePlayers: PlayerInfo[] = allPlayers.filter(p => p.side === 'blue');
  const redPlayers: PlayerInfo[] = allPlayers.filter(p => p.side === 'red');

  function teamLabel(side: 'blue' | 'red'): string {
    if (side === 'blue' && blueTeamInfo) return blueTeamInfo.shortName;
    if (side === 'red' && redTeamInfo) return redTeamInfo.shortName;
    return side === 'blue' ? 'Blue' : 'Red';
  }

  function addKill(killerSide: 'blue' | 'red', count: number = 1) {
    for (let i = 0; i < count; i++) {
      if (killerSide === 'blue') {
        state.blueKills++;
        const killer = pick(bluePlayers);
        const victim = pick(redPlayers);
        pStats[killer.name].kills++;
        pStats[victim.name].deaths++;
        // Assists for 1-2 teammates
        const assistCount = randInt(1, 3);
        const teammates = bluePlayers.filter(p => p.name !== killer.name);
        for (let a = 0; a < Math.min(assistCount, teammates.length); a++) {
          pStats[teammates[a].name].assists++;
        }
      } else {
        state.redKills++;
        const killer = pick(redPlayers);
        const victim = pick(bluePlayers);
        pStats[killer.name].kills++;
        pStats[victim.name].deaths++;
        const assistCount = randInt(1, 3);
        const teammates = redPlayers.filter(p => p.name !== killer.name);
        for (let a = 0; a < Math.min(assistCount, teammates.length); a++) {
          pStats[teammates[a].name].assists++;
        }
      }
    }
  }

  let minute = 0;
  let dragonCount = 0;
  let blueRunningGold = 2500 * 5; // Starting gold
  let redRunningGold = 2500 * 5;
  let momentum = 0; // positive = blue momentum, negative = red

  function snapshot() {
    state.goldTimeline.push({ minute: Math.floor(minute), blueGold: blueRunningGold, redGold: redRunningGold });
  }

  // ── Laning Phase (0-14 min) ──────────────────────────
  snapshot();

  // Lane-by-lane trades
  for (const matchup of bs.laneMatchups) {
    const laneMinute = rand(3, 12);
    const diff = matchup.blue - matchup.red;
    const advantageSide = diff > 0 ? 'blue' : 'red';
    const advantage = Math.abs(diff);

    // Only generate kill if meaningful advantage
    if (advantage > 5 && Math.random() < 0.6) {
      const killerName = advantageSide === 'blue' ? (matchup.bluePlayer ?? blueTeam[0].name) : (matchup.redPlayer ?? redTeam[0].name);
      const victimName = advantageSide === 'blue' ? (matchup.redPlayer ?? redTeam[0].name) : (matchup.bluePlayer ?? blueTeam[0].name);
      const verb = pick(KILL_VERBS_LANE);

      addKill(advantageSide);
      const goldSwing = randInt(300, 600);
      if (advantageSide === 'blue') { blueRunningGold += goldSwing; momentum += 2; }
      else { redRunningGold += goldSwing; momentum -= 2; }

      state.events.push({
        time: fmt(laneMinute), minute: Math.floor(laneMinute),
        type: 'kill', team: advantageSide,
        description: `${killerName}'s ${advantageSide === 'blue' ? blueTeam[bs.laneMatchups.indexOf(matchup)].name : redTeam[bs.laneMatchups.indexOf(matchup)].name} ${verb} ${victimName} in ${matchup.lane} lane`,
        playerName: killerName,
        goldSwing,
      });

      // Double kill chance if huge lane diff
      if (advantage > 15 && Math.random() < 0.3) {
        minute = laneMinute + rand(1, 3);
        addKill(advantageSide);
        if (advantageSide === 'blue') { blueRunningGold += 300; momentum += 1; }
        else { redRunningGold += 300; momentum -= 1; }
        state.events.push({
          time: fmt(minute), minute: Math.floor(minute),
          type: 'kill', team: advantageSide,
          description: `${killerName} picks up another kill in ${matchup.lane} — dominating the lane!`,
          playerName: killerName, highlight: true,
        });
      }
    }
  }

  // Passive gold income per minute
  const passiveGoldPerMin = 380;

  // First dragon (5-8 min)
  minute = rand(5, 8);
  const d1Side = weighted(bs.obj + momentum * 3, rs.obj - momentum * 3);
  const d1Name = pick(DRAGON_NAMES);
  if (d1Side === 'blue') { state.blueDragons++; blueRunningGold += 200; }
  else { state.redDragons++; redRunningGold += 200; }
  dragonCount++;
  state.events.push({
    time: fmt(minute), minute: Math.floor(minute),
    type: 'dragon', team: d1Side,
    description: `${teamLabel(d1Side)} secures the ${d1Name} Drake`,
  });
  snapshot();

  // Rift Herald (14 min)
  minute = rand(13.5, 15.5);
  const heraldSide = weighted(bs.obj + momentum * 2, rs.obj - momentum * 2);
  state.events.push({
    time: fmt(minute), minute: Math.floor(minute),
    type: 'herald', team: heraldSide,
    description: `${teamLabel(heraldSide)} takes Rift Herald and charges it mid!`,
  });
  // Herald gives a tower plate or tower
  if (heraldSide === 'blue') { state.blueTowers++; blueRunningGold += 550; }
  else { state.redTowers++; redRunningGold += 550; }
  state.events.push({
    time: fmt(minute + 0.5), minute: Math.floor(minute),
    type: 'tower', team: heraldSide,
    description: `Rift Herald crashes into a tower — ${teamLabel(heraldSide)} takes First Tower!`,
    highlight: true,
    goldSwing: 550,
  });

  // Update gold
  blueRunningGold += passiveGoldPerMin * 14;
  redRunningGold += passiveGoldPerMin * 14;
  snapshot();

  // ── Mid Game (15-28 min) ───────────────────────────────
  minute = 15;
  while (minute < 28) {
    minute += rand(1.5, 4);
    if (minute > 28) break;

    const roll = Math.random();
    const momBonus = momentum * 3;

    if (roll < 0.3) {
      // Skirmish (2v2 or 3v3)
      const side = weighted(bs.skirmish + momBonus, rs.skirmish - momBonus);
      const kills = randInt(1, 3);
      const traded = Math.random() < 0.4 ? randInt(1, 2) : 0;
      addKill(side, kills);
      if (traded > 0) addKill(side === 'blue' ? 'red' : 'blue', traded);

      const killer = pick(side === 'blue' ? bluePlayers : redPlayers);
      const verb = pick(KILL_VERBS_SKIRMISH);
      const goldGain = kills * randInt(250, 400);
      if (side === 'blue') { blueRunningGold += goldGain; momentum += kills; }
      else { redRunningGold += goldGain; momentum -= kills; }

      const tradeText = traded > 0 ? ` (${traded} traded back)` : '';
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: 'kill', team: side,
        description: `${killer.name} ${verb} enemies in a river skirmish — ${kills} kill${kills > 1 ? 's' : ''}${tradeText}`,
        playerName: killer.name,
        goldSwing: goldGain,
        highlight: kills >= 3,
      });

    } else if (roll < 0.5) {
      // Tower take
      const side = weighted(bs.mid + momBonus + state.blueKills * 2, rs.mid - momBonus + state.redKills * 2);
      if (side === 'blue') { state.blueTowers++; blueRunningGold += 550; }
      else { state.redTowers++; redRunningGold += 550; }
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: 'tower', team: side,
        description: `${teamLabel(side)} takes a tower after gaining map control`,
        goldSwing: 550,
      });
      if (side === 'blue') momentum += 1; else momentum -= 1;

    } else if (roll < 0.65 && dragonCount < 4) {
      // Dragon
      const side = weighted(bs.obj + momBonus, rs.obj - momBonus);
      const dName = pick(DRAGON_NAMES);
      if (side === 'blue') { state.blueDragons++; blueRunningGold += 200; }
      else { state.redDragons++; redRunningGold += 200; }
      dragonCount++;
      const isSoul = (side === 'blue' ? state.blueDragons : state.redDragons) >= 4;
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: 'dragon', team: side,
        description: isSoul
          ? `${teamLabel(side)} CLAIMS THE ${dName.toUpperCase()} DRAGON SOUL!`
          : `${teamLabel(side)} slays the ${dName} Drake`,
        highlight: isSoul,
      });
      if (isSoul) { if (side === 'blue') momentum += 5; else momentum -= 5; }

    } else if (roll < 0.85) {
      // Teamfight
      const tfDesc = pick(TF_DESCRIPTIONS);
      const side = weighted(bs.tf + btw * 0.3 + momBonus, rs.tf + rtw * 0.3 - momBonus);
      const killsW = randInt(2, 5);
      const killsL = randInt(0, 3);
      addKill(side, killsW);
      addKill(side === 'blue' ? 'red' : 'blue', killsL);

      const goldGain = killsW * randInt(250, 400);
      if (side === 'blue') { blueRunningGold += goldGain; momentum += killsW; }
      else { redRunningGold += goldGain; momentum -= killsW; }

      const mvpPlayer = pick(side === 'blue' ? bluePlayers : redPlayers);
      const isAce = killsW >= 4;

      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: isAce ? 'ace' : 'teamfight', team: side,
        description: `${tfDesc} — ${teamLabel(side)} wins ${killsW}-${killsL}! ${mvpPlayer.name} leads the charge on ${mvpPlayer.champ.name}`,
        playerName: mvpPlayer.name,
        highlight: isAce || killsW >= 3,
        goldSwing: goldGain,
      });

      if (isAce) {
        state.events.push({
          time: fmt(minute + 0.3), minute: Math.floor(minute),
          type: 'ace', team: side,
          description: `ACE! ${teamLabel(side)} wipes the enemy team!`,
          highlight: true,
        });
      }
    }

    // Passive income
    blueRunningGold += passiveGoldPerMin * 2;
    redRunningGold += passiveGoldPerMin * 2;
    if (Math.floor(minute) % 3 === 0) snapshot();
  }

  // ── Baron (20-26 min) ──────────────────────────────────
  minute = rand(21, 26);
  // Baron fight can be contested
  const baronContested = Math.random() < 0.4;
  const baronSide = weighted(bs.obj + bs.tf * 0.3 + momentum * 4, rs.obj + rs.tf * 0.3 - momentum * 4);

  if (baronContested) {
    // Baron steal attempt!
    const stealChance = Math.random();
    if (stealChance < 0.15) {
      const stealSide = baronSide === 'blue' ? 'red' : 'blue';
      const stealer = pick(stealSide === 'blue' ? bluePlayers : redPlayers);
      if (stealSide === 'blue') { state.blueBarons++; blueRunningGold += 1500; momentum += 5; }
      else { state.redBarons++; redRunningGold += 1500; momentum -= 5; }
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: 'steal', team: stealSide,
        description: `BARON STEAL! ${stealer.name} steals Baron Nashor with a clutch smite!`,
        playerName: stealer.name, highlight: true, goldSwing: 1500,
      });
    } else {
      // Contested but not stolen — fight breaks out
      addKill(baronSide, randInt(2, 4));
      addKill(baronSide === 'blue' ? 'red' : 'blue', randInt(0, 2));
      if (baronSide === 'blue') { state.blueBarons++; blueRunningGold += 1500; momentum += 4; }
      else { state.redBarons++; redRunningGold += 1500; momentum -= 4; }
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: 'baron', team: baronSide,
        description: `${teamLabel(baronSide)} wins the Baron fight and secures Nashor!`,
        highlight: true, goldSwing: 1500,
      });
    }
  } else {
    if (baronSide === 'blue') { state.blueBarons++; blueRunningGold += 1500; momentum += 3; }
    else { state.redBarons++; redRunningGold += 1500; momentum -= 3; }
    state.events.push({
      time: fmt(minute), minute: Math.floor(minute),
      type: 'baron', team: baronSide,
      description: `${teamLabel(baronSide)} secures an uncontested Baron Nashor`,
    });
  }
  snapshot();

  // ── Late Game (28-45 min) ──────────────────────────────
  minute = 28;
  let gameOver = false;

  while (minute < 45 && !gameOver) {
    minute += rand(2, 5);
    if (minute > 45) break;

    const roll = Math.random();
    const momBonus = momentum * 4;

    if (roll < 0.45) {
      // Late teamfight — much higher stakes
      const tfDesc = pick(TF_DESCRIPTIONS);
      const side = weighted(bs.late + bs.tf + btw * 0.5 + momBonus, rs.late + rs.tf + rtw * 0.5 - momBonus);
      const killsW = randInt(3, 5);
      const killsL = randInt(0, 3);
      addKill(side, killsW);
      addKill(side === 'blue' ? 'red' : 'blue', killsL);

      const goldGain = killsW * randInt(300, 500);
      if (side === 'blue') { blueRunningGold += goldGain; momentum += killsW * 1.5; }
      else { redRunningGold += goldGain; momentum -= killsW * 1.5; }

      const mvpPlayer = pick(side === 'blue' ? bluePlayers : redPlayers);
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: killsW >= 4 ? 'ace' : 'teamfight', team: side,
        description: `${tfDesc} — ${teamLabel(side)} dominates ${killsW}-${killsL}! ${mvpPlayer.name}'s ${mvpPlayer.champ.name} is unstoppable!`,
        playerName: mvpPlayer.name,
        highlight: true,
        goldSwing: goldGain,
      });

      // Push towers after winning teamfight
      const towersTaken = randInt(1, 3);
      for (let t = 0; t < towersTaken; t++) {
        if (side === 'blue') { state.blueTowers++; blueRunningGold += 550; }
        else { state.redTowers++; redRunningGold += 550; }
      }
      state.events.push({
        time: fmt(minute + 0.5), minute: Math.floor(minute),
        type: 'tower', team: side,
        description: `${teamLabel(side)} pushes and destroys ${towersTaken} tower${towersTaken > 1 ? 's' : ''} off the fight`,
        goldSwing: towersTaken * 550,
      });

    } else if (roll < 0.6 && dragonCount < 6) {
      // Elder Dragon
      const side = weighted(bs.obj + momBonus, rs.obj - momBonus);
      if (side === 'blue') { state.blueDragons++; blueRunningGold += 300; momentum += 4; }
      else { state.redDragons++; redRunningGold += 300; momentum -= 4; }
      dragonCount++;
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: 'dragon', team: side,
        description: `${teamLabel(side)} slays the ELDER DRAGON — execute threshold active!`,
        highlight: true,
      });

    } else if (roll < 0.75 && minute > 33) {
      // Second baron
      const side = weighted(bs.obj + momBonus, rs.obj - momBonus);
      if (side === 'blue') { state.blueBarons++; blueRunningGold += 1500; }
      else { state.redBarons++; redRunningGold += 1500; }
      state.events.push({
        time: fmt(minute), minute: Math.floor(minute),
        type: 'baron', team: side,
        description: `${teamLabel(side)} secures another Baron!`,
      });
    }

    blueRunningGold += passiveGoldPerMin * 3;
    redRunningGold += passiveGoldPerMin * 3;
    if (Math.floor(minute) % 3 === 0) snapshot();

    // End conditions
    const bScore = state.blueKills * 2 + state.blueTowers * 5 + state.blueDragons * 3 + state.blueBarons * 8;
    const rScore = state.redKills * 2 + state.redTowers * 5 + state.redDragons * 3 + state.redBarons * 8;
    if (state.blueTowers >= 8 || (minute > 33 && bScore > rScore + 15)) {
      gameOver = true; state.winner = 'blue';
    } else if (state.redTowers >= 8 || (minute > 33 && rScore > bScore + 15)) {
      gameOver = true; state.winner = 'red';
    }
  }

  // Force winner
  if (!state.winner) {
    const bFinal = state.blueKills * 2 + state.blueTowers * 5 + state.blueDragons * 3 + state.blueBarons * 8 + bs.late * 0.5;
    const rFinal = state.redKills * 2 + state.redTowers * 5 + state.redDragons * 3 + state.redBarons * 8 + rs.late * 0.5;
    state.winner = weighted(bFinal, rFinal);
    minute = rand(36, 48);
  }

  // Final push
  const winnerPlayers = state.winner === 'blue' ? bluePlayers : redPlayers;
  const finalMVP = pick(winnerPlayers);
  state.events.push({
    time: fmt(minute), minute: Math.floor(minute),
    type: 'teamfight', team: state.winner,
    description: `${teamLabel(state.winner)} wins a decisive teamfight! ${finalMVP.name} goes off!`,
    playerName: finalMVP.name, highlight: true,
  });
  state.events.push({
    time: fmt(minute + 0.5), minute: Math.floor(minute),
    type: 'inhibitor', team: state.winner,
    description: `${teamLabel(state.winner)} storms through the Inhibitor and ends the game!`,
    highlight: true,
  });

  // Sort events
  state.events.sort((a, b) => {
    const timeA = parseFloat(a.time.replace(':', '.'));
    const timeB = parseFloat(b.time.replace(':', '.'));
    return timeA - timeB;
  });

  // Final gold
  state.blueGold = blueRunningGold;
  state.redGold = redRunningGold;
  state.duration = Math.floor(minute + 1);
  snapshot();

  // Build player stats
  for (const p of allPlayers) {
    const s = pStats[p.name];
    const csPerMin = p.roster?.avgCSPerMin ?? rand(6, 10);
    const dpm = p.roster?.avgDPM ?? rand(300, 600);
    state.playerStats.push({
      playerName: p.name,
      championName: p.champ.name,
      championImage: p.champ.image,
      kills: s.kills,
      deaths: s.deaths,
      assists: s.assists,
      cs: Math.floor(csPerMin * state.duration + rand(-20, 20)),
      gold: Math.floor(s.kills * 300 + (csPerMin * state.duration * 20) + rand(5000, 8000)),
      damage: Math.floor(dpm * state.duration + rand(-3000, 3000)),
      side: p.side,
    });
  }

  // MVP = highest KDA on winning team
  const winnerStats = state.playerStats.filter(p => p.side === state.winner);
  winnerStats.sort((a, b) => {
    const kdaA = (a.kills + a.assists) / Math.max(1, a.deaths);
    const kdaB = (b.kills + b.assists) / Math.max(1, b.deaths);
    return kdaB - kdaA;
  });
  if (winnerStats.length > 0) state.mvp = winnerStats[0].playerName;

  return state;
}
