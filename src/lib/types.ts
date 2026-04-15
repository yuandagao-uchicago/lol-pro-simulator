export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  image: string;
}

export interface DraftState {
  phase: 'ban' | 'pick' | 'complete';
  currentTeam: 'blue' | 'red';
  step: number;
  blueBans: Champion[];
  redBans: Champion[];
  bluePicks: Champion[];
  redPicks: Champion[];
}

export interface GameEvent {
  time: string;
  minute: number;
  type: 'kill' | 'dragon' | 'herald' | 'baron' | 'tower' | 'teamfight' | 'inhibitor' | 'ace' | 'steal';
  team: 'blue' | 'red';
  description: string;
  highlight?: boolean; // Big moment — show with more emphasis
  playerName?: string; // The player who made the play
  goldSwing?: number;  // How much gold changed hands
}

export interface GoldSnapshot {
  minute: number;
  blueGold: number;
  redGold: number;
}

export interface PlayerStats {
  playerName: string;
  championName: string;
  championImage: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  damage: number;
  side: 'blue' | 'red';
}

export interface GameState {
  blueGold: number;
  redGold: number;
  blueKills: number;
  redKills: number;
  blueTowers: number;
  redTowers: number;
  blueDragons: number;
  redDragons: number;
  blueBarons: number;
  redBarons: number;
  events: GameEvent[];
  goldTimeline: GoldSnapshot[];
  playerStats: PlayerStats[];
  mvp?: string;
  winner: 'blue' | 'red' | null;
  duration: number;
  blueTeamName?: string;
  redTeamName?: string;
}

export interface Simulation {
  id: string;
  user_id: string;
  blue_team: Champion[];
  red_team: Champion[];
  bans: { blue: Champion[]; red: Champion[] };
  result: GameState;
  created_at: string;
}

// Draft order: ban1-ban2-ban3-ban4-ban5-ban6 then pick1-pick2-pick3... etc
// Real pro draft: B-ban, R-ban, B-ban, R-ban, B-ban, R-ban,
//                 B-pick, R-pick, R-pick, B-pick, B-pick, R-pick,
//                 R-ban, B-ban, R-ban, B-ban,
//                 R-pick, B-pick, B-pick, R-pick
export const DRAFT_ORDER: Array<{ team: 'blue' | 'red'; action: 'ban' | 'pick' }> = [
  // Phase 1 bans
  { team: 'blue', action: 'ban' },
  { team: 'red', action: 'ban' },
  { team: 'blue', action: 'ban' },
  { team: 'red', action: 'ban' },
  { team: 'blue', action: 'ban' },
  { team: 'red', action: 'ban' },
  // Phase 1 picks
  { team: 'blue', action: 'pick' },
  { team: 'red', action: 'pick' },
  { team: 'red', action: 'pick' },
  { team: 'blue', action: 'pick' },
  { team: 'blue', action: 'pick' },
  { team: 'red', action: 'pick' },
  // Phase 2 bans
  { team: 'red', action: 'ban' },
  { team: 'blue', action: 'ban' },
  { team: 'red', action: 'ban' },
  { team: 'blue', action: 'ban' },
  // Phase 2 picks
  { team: 'red', action: 'pick' },
  { team: 'blue', action: 'pick' },
  { team: 'blue', action: 'pick' },
  { team: 'red', action: 'pick' },
];
