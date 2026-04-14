import { Champion, GameEvent, GameState } from './types';

// Champion archetype classification based on tags
function getTeamStrength(team: Champion[]): {
  earlyGame: number;
  midGame: number;
  lateGame: number;
  teamfight: number;
  skirmish: number;
  objective: number;
} {
  let earlyGame = 50;
  let midGame = 50;
  let lateGame = 50;
  let teamfight = 50;
  let skirmish = 50;
  let objective = 50;

  for (const champ of team) {
    const tags = champ.tags;

    if (tags.includes('Assassin')) {
      earlyGame += 3;
      midGame += 4;
      skirmish += 5;
      lateGame -= 2;
    }
    if (tags.includes('Fighter')) {
      midGame += 3;
      skirmish += 3;
      objective += 2;
    }
    if (tags.includes('Mage')) {
      midGame += 3;
      lateGame += 3;
      teamfight += 4;
    }
    if (tags.includes('Marksman')) {
      lateGame += 5;
      teamfight += 3;
      objective += 4;
      earlyGame -= 2;
    }
    if (tags.includes('Support')) {
      teamfight += 3;
      lateGame += 2;
    }
    if (tags.includes('Tank')) {
      teamfight += 5;
      lateGame += 3;
      objective += 2;
      earlyGame -= 1;
    }
  }

  return { earlyGame, midGame, lateGame, teamfight, skirmish, objective };
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function weightedCoinFlip(blueWeight: number, redWeight: number): 'blue' | 'red' {
  const total = blueWeight + redWeight;
  return Math.random() < blueWeight / total ? 'blue' : 'red';
}

function formatTime(minute: number): string {
  const m = Math.floor(minute);
  const s = Math.floor((minute - m) * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const DRAGON_NAMES = ['Infernal', 'Mountain', 'Ocean', 'Cloud', 'Hextech', 'Chemtech'];

export function simulateGame(blueTeam: Champion[], redTeam: Champion[]): GameState {
  const blueStr = getTeamStrength(blueTeam);
  const redStr = getTeamStrength(redTeam);

  const state: GameState = {
    blueGold: 0,
    redGold: 0,
    blueKills: 0,
    redKills: 0,
    blueTowers: 0,
    redTowers: 0,
    blueDragons: 0,
    redDragons: 0,
    blueBarons: 0,
    redBarons: 0,
    events: [],
    winner: null,
    duration: 0,
  };

  let minute = 0;
  let dragonCount = 0;
  let gameOver = false;

  // Laning phase (1-14 min)
  minute = rand(2, 4);
  const earlyKills = Math.floor(rand(2, 6));
  for (let i = 0; i < earlyKills; i++) {
    minute += rand(1, 3);
    if (minute > 14) break;
    const team = weightedCoinFlip(blueStr.earlyGame, redStr.earlyGame);
    const killer = team === 'blue' ? blueTeam[Math.floor(rand(0, 5))] : redTeam[Math.floor(rand(0, 5))];
    const victim = team === 'blue' ? redTeam[Math.floor(rand(0, 5))] : blueTeam[Math.floor(rand(0, 5))];

    if (team === 'blue') state.blueKills++;
    else state.redKills++;

    state.events.push({
      time: formatTime(minute),
      minute: Math.floor(minute),
      type: 'kill',
      team,
      description: `${killer.name} picks off ${victim.name} in lane`,
    });
  }

  // First tower
  minute = rand(13, 16);
  const firstTowerTeam = weightedCoinFlip(blueStr.earlyGame + blueStr.objective, redStr.earlyGame + redStr.objective);
  if (firstTowerTeam === 'blue') state.blueTowers++;
  else state.redTowers++;
  state.events.push({
    time: formatTime(minute),
    minute: Math.floor(minute),
    type: 'tower',
    team: firstTowerTeam,
    description: `${firstTowerTeam === 'blue' ? 'Blue' : 'Red'} side takes First Tower!`,
  });

  // Rift Herald
  minute = rand(14, 16);
  const heraldTeam = weightedCoinFlip(blueStr.objective, redStr.objective);
  state.events.push({
    time: formatTime(minute),
    minute: Math.floor(minute),
    type: 'herald',
    team: heraldTeam,
    description: `${heraldTeam === 'blue' ? 'Blue' : 'Red'} side secures Rift Herald`,
  });

  // First dragon
  minute = rand(5, 8);
  const dragonTeam1 = weightedCoinFlip(blueStr.objective, redStr.objective);
  const dragon1 = DRAGON_NAMES[Math.floor(rand(0, DRAGON_NAMES.length))];
  if (dragonTeam1 === 'blue') state.blueDragons++;
  else state.redDragons++;
  dragonCount++;
  state.events.push({
    time: formatTime(minute),
    minute: Math.floor(minute),
    type: 'dragon',
    team: dragonTeam1,
    description: `${dragonTeam1 === 'blue' ? 'Blue' : 'Red'} side slays ${dragon1} Drake`,
  });

  // Mid game (15-30 min)
  minute = 15;
  while (minute < 30 && !gameOver) {
    minute += rand(1, 4);
    if (minute > 30) break;

    const eventRoll = Math.random();

    if (eventRoll < 0.35) {
      // Skirmish / kill
      const team = weightedCoinFlip(blueStr.midGame + blueStr.skirmish, redStr.midGame + redStr.skirmish);
      const kills = Math.floor(rand(1, 3));
      for (let k = 0; k < kills; k++) {
        if (team === 'blue') state.blueKills++;
        else state.redKills++;
      }
      const killer = team === 'blue' ? blueTeam[Math.floor(rand(0, 5))] : redTeam[Math.floor(rand(0, 5))];
      state.events.push({
        time: formatTime(minute),
        minute: Math.floor(minute),
        type: 'kill',
        team,
        description: kills > 1
          ? `${killer.name} leads a skirmish — ${team === 'blue' ? 'Blue' : 'Red'} picks up ${kills} kills!`
          : `${killer.name} finds a pick in the mid game`,
      });
    } else if (eventRoll < 0.55) {
      // Tower
      const towerTeam = weightedCoinFlip(
        blueStr.midGame + state.blueKills * 2,
        redStr.midGame + state.redKills * 2
      );
      if (towerTeam === 'blue') state.blueTowers++;
      else state.redTowers++;
      state.events.push({
        time: formatTime(minute),
        minute: Math.floor(minute),
        type: 'tower',
        team: towerTeam,
        description: `${towerTeam === 'blue' ? 'Blue' : 'Red'} side destroys a tower`,
      });
    } else if (eventRoll < 0.70 && dragonCount < 4) {
      // Dragon
      const dTeam = weightedCoinFlip(blueStr.objective + state.blueKills, redStr.objective + state.redKills);
      const dName = DRAGON_NAMES[Math.floor(rand(0, DRAGON_NAMES.length))];
      if (dTeam === 'blue') state.blueDragons++;
      else state.redDragons++;
      dragonCount++;
      state.events.push({
        time: formatTime(minute),
        minute: Math.floor(minute),
        type: 'dragon',
        team: dTeam,
        description: dragonCount >= 4
          ? `${dTeam === 'blue' ? 'Blue' : 'Red'} side claims the Dragon Soul!`
          : `${dTeam === 'blue' ? 'Blue' : 'Red'} side slays ${dName} Drake`,
      });
    } else if (eventRoll < 0.80) {
      // Teamfight
      const tfTeam = weightedCoinFlip(blueStr.teamfight + blueStr.midGame, redStr.teamfight + redStr.midGame);
      const killsWin = Math.floor(rand(2, 4));
      const killsLose = Math.floor(rand(0, 2));
      if (tfTeam === 'blue') {
        state.blueKills += killsWin;
        state.redKills += killsLose;
      } else {
        state.redKills += killsWin;
        state.blueKills += killsLose;
      }
      state.events.push({
        time: formatTime(minute),
        minute: Math.floor(minute),
        type: 'teamfight',
        team: tfTeam,
        description: `Teamfight breaks out! ${tfTeam === 'blue' ? 'Blue' : 'Red'} wins ${killsWin}-${killsLose}`,
      });
    }
  }

  // Baron spawns at 20 min
  if (!gameOver) {
    minute = rand(21, 26);
    const baronTeam = weightedCoinFlip(
      blueStr.objective + blueStr.teamfight + state.blueKills * 2,
      redStr.objective + redStr.teamfight + state.redKills * 2
    );
    if (baronTeam === 'blue') state.blueBarons++;
    else state.redBarons++;
    state.events.push({
      time: formatTime(minute),
      minute: Math.floor(minute),
      type: 'baron',
      team: baronTeam,
      description: `${baronTeam === 'blue' ? 'Blue' : 'Red'} side secures Baron Nashor!`,
    });
  }

  // Late game (30-45 min)
  minute = 30;
  while (minute < 45 && !gameOver) {
    minute += rand(2, 5);
    if (minute > 45) break;

    const eventRoll = Math.random();

    if (eventRoll < 0.4) {
      // Late game teamfight
      const tfTeam = weightedCoinFlip(
        blueStr.lateGame + blueStr.teamfight + state.blueBarons * 10,
        redStr.lateGame + redStr.teamfight + state.redBarons * 10
      );
      const killsWin = Math.floor(rand(2, 5));
      const killsLose = Math.floor(rand(0, 3));
      if (tfTeam === 'blue') {
        state.blueKills += killsWin;
        state.redKills += killsLose;
      } else {
        state.redKills += killsWin;
        state.blueKills += killsLose;
      }
      state.events.push({
        time: formatTime(minute),
        minute: Math.floor(minute),
        type: 'teamfight',
        team: tfTeam,
        description: `Late game teamfight! ${tfTeam === 'blue' ? 'Blue' : 'Red'} dominates ${killsWin}-${killsLose}`,
      });

      // Tower after teamfight
      if (tfTeam === 'blue') state.blueTowers++;
      else state.redTowers++;
      state.events.push({
        time: formatTime(minute + 0.5),
        minute: Math.floor(minute),
        type: 'tower',
        team: tfTeam,
        description: `${tfTeam === 'blue' ? 'Blue' : 'Red'} pushes and destroys a tower after the fight`,
      });
    } else if (eventRoll < 0.6 && dragonCount < 6) {
      const dTeam = weightedCoinFlip(blueStr.objective + state.blueKills, redStr.objective + state.redKills);
      if (dTeam === 'blue') state.blueDragons++;
      else state.redDragons++;
      dragonCount++;
      state.events.push({
        time: formatTime(minute),
        minute: Math.floor(minute),
        type: 'dragon',
        team: dTeam,
        description: `${dTeam === 'blue' ? 'Blue' : 'Red'} side takes Elder Dragon!`,
      });
    } else if (eventRoll < 0.75 && minute > 35) {
      // Second baron
      const baronTeam = weightedCoinFlip(
        blueStr.objective + state.blueKills * 2,
        redStr.objective + state.redKills * 2
      );
      if (baronTeam === 'blue') state.blueBarons++;
      else state.redBarons++;
      state.events.push({
        time: formatTime(minute),
        minute: Math.floor(minute),
        type: 'baron',
        team: baronTeam,
        description: `${baronTeam === 'blue' ? 'Blue' : 'Red'} takes Baron!`,
      });
    }

    // Check for game end condition
    const blueScore = state.blueKills * 2 + state.blueTowers * 5 + state.blueDragons * 3 + state.blueBarons * 8;
    const redScore = state.redKills * 2 + state.redTowers * 5 + state.redDragons * 3 + state.redBarons * 8;
    if (state.blueTowers >= 8 || (minute > 35 && blueScore > redScore + 20)) {
      gameOver = true;
      state.winner = 'blue';
    } else if (state.redTowers >= 8 || (minute > 35 && redScore > blueScore + 20)) {
      gameOver = true;
      state.winner = 'red';
    }
  }

  // Force a winner if game hasn't ended
  if (!state.winner) {
    const blueScore = state.blueKills * 2 + state.blueTowers * 5 + state.blueDragons * 3 + state.blueBarons * 8 + blueStr.lateGame;
    const redScore = state.redKills * 2 + state.redTowers * 5 + state.redDragons * 3 + state.redBarons * 8 + redStr.lateGame;
    state.winner = weightedCoinFlip(blueScore, redScore);
    minute = rand(38, 48);
  }

  // Final push events
  state.events.push({
    time: formatTime(minute),
    minute: Math.floor(minute),
    type: 'teamfight',
    team: state.winner,
    description: `${state.winner === 'blue' ? 'Blue' : 'Red'} side wins a decisive teamfight!`,
  });
  state.events.push({
    time: formatTime(minute + 1),
    minute: Math.floor(minute + 1),
    type: 'inhibitor',
    team: state.winner,
    description: `${state.winner === 'blue' ? 'Blue' : 'Red'} side destroys the Inhibitor and pushes to end!`,
  });

  // Sort events by minute
  state.events.sort((a, b) => a.minute - b.minute || a.time.localeCompare(b.time));

  // Calculate gold (rough approximation)
  state.blueGold = Math.round(
    (state.blueKills * 300 + state.blueTowers * 550 + state.blueDragons * 200 + state.blueBarons * 1500 + 15000 + rand(-2000, 2000)) / 100
  ) * 100;
  state.redGold = Math.round(
    (state.redKills * 300 + state.redTowers * 550 + state.redDragons * 200 + state.redBarons * 1500 + 15000 + rand(-2000, 2000)) / 100
  ) * 100;
  state.duration = Math.floor(minute + 1);

  return state;
}
