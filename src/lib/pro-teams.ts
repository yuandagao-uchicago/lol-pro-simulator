import { Lane } from './lanes';

export interface ProPlayer {
  id: string;
  name: string;         // IGN
  realName?: string;
  lane: Lane;
  // Normalized stats (0-100 scale, relative to other pros)
  mechanics: number;     // Laning, outplays, solo kills
  gameIQ: number;        // Macro, rotations, decision making
  consistency: number;   // How often they perform at their peak
  peakPerformance: number; // Ceiling when they're on fire
  championPool: number;  // Flexibility
  // Average per-game stats (approximated from pro data)
  avgKDA: number;
  avgCSPerMin: number;
  avgGoldDiff15: number; // Gold diff at 15 min
  avgDPM: number;        // Damage per minute
  signatureChamps: string[]; // Champion IDs they're known for
}

export interface ProTeam {
  id: string;
  name: string;
  shortName: string;
  region: string;
  logo?: string;
  // Team-level stats
  teamwork: number;      // Coordination, team fight execution
  earlyGame: number;     // Tendency and skill in early aggression
  lateGame: number;      // Scaling, patience, team fight
  objective: number;     // Dragon/Baron control
  aggression: number;    // How proactive vs reactive
  roster: ProPlayer[];
}

// Historical rosters — these represent iconic/peak lineups
export const PRO_TEAMS: ProTeam[] = [
  {
    id: 'ig-2018',
    name: 'Invictus Gaming',
    shortName: 'IG',
    region: 'LPL',
    teamwork: 78,
    earlyGame: 92,
    lateGame: 75,
    objective: 80,
    aggression: 95,
    roster: [
      {
        id: 'theshy', name: 'TheShy', realName: 'Kang Seung-lok', lane: 'top',
        mechanics: 97, gameIQ: 85, consistency: 72, peakPerformance: 99, championPool: 85,
        avgKDA: 3.8, avgCSPerMin: 9.2, avgGoldDiff15: 450, avgDPM: 620,
        signatureChamps: ['Fiora', 'Jayce', 'Aatrox', 'Riven', 'Akali'],
      },
      {
        id: 'ning', name: 'Ning', realName: 'Gao Zhen-Ning', lane: 'jungle',
        mechanics: 82, gameIQ: 78, consistency: 65, peakPerformance: 90, championPool: 70,
        avgKDA: 3.5, avgCSPerMin: 5.1, avgGoldDiff15: 200, avgDPM: 350,
        signatureChamps: ['Camille', 'LeeSin', 'Gragas', 'XinZhao'],
      },
      {
        id: 'rookie', name: 'Rookie', realName: 'Song Eui-jin', lane: 'mid',
        mechanics: 95, gameIQ: 93, consistency: 88, peakPerformance: 97, championPool: 90,
        avgKDA: 4.5, avgCSPerMin: 9.5, avgGoldDiff15: 500, avgDPM: 580,
        signatureChamps: ['Leblanc', 'Irelia', 'Syndra', 'Azir', 'Akali'],
      },
      {
        id: 'jackeylove', name: 'JackeyLove', realName: 'Yu Wen-Bo', lane: 'bot',
        mechanics: 90, gameIQ: 82, consistency: 78, peakPerformance: 95, championPool: 80,
        avgKDA: 4.2, avgCSPerMin: 9.8, avgGoldDiff15: 350, avgDPM: 550,
        signatureChamps: ['Kaisa', 'Xayah', 'Draven', 'Lucian', 'Ezreal'],
      },
      {
        id: 'baolan', name: 'Baolan', realName: 'Wang Liu-Yi', lane: 'support',
        mechanics: 72, gameIQ: 78, consistency: 70, peakPerformance: 80, championPool: 68,
        avgKDA: 3.0, avgCSPerMin: 1.2, avgGoldDiff15: -50, avgDPM: 150,
        signatureChamps: ['Rakan', 'Alistar', 'Thresh', 'Braum'],
      },
    ],
  },
  {
    id: 'fpx-2019',
    name: 'FunPlus Phoenix',
    shortName: 'FPX',
    region: 'LPL',
    teamwork: 95,
    earlyGame: 85,
    lateGame: 82,
    objective: 88,
    aggression: 88,
    roster: [
      {
        id: 'gimgoon', name: 'GimGoon', realName: 'Kim Han-saem', lane: 'top',
        mechanics: 75, gameIQ: 88, consistency: 90, peakPerformance: 80, championPool: 72,
        avgKDA: 3.2, avgCSPerMin: 8.1, avgGoldDiff15: -100, avgDPM: 380,
        signatureChamps: ['Gangplank', 'Renekton', 'Mordekaiser', 'Ornn'],
      },
      {
        id: 'tian', name: 'Tian', realName: 'Gao Tian-Liang', lane: 'jungle',
        mechanics: 90, gameIQ: 92, consistency: 75, peakPerformance: 96, championPool: 78,
        avgKDA: 5.2, avgCSPerMin: 5.5, avgGoldDiff15: 400, avgDPM: 380,
        signatureChamps: ['LeeSin', 'Qiyana', 'Elise', 'Gragas', 'RekSai'],
      },
      {
        id: 'doinb', name: 'Doinb', realName: 'Kim Tae-sang', lane: 'mid',
        mechanics: 82, gameIQ: 97, consistency: 92, peakPerformance: 90, championPool: 95,
        avgKDA: 4.8, avgCSPerMin: 8.5, avgGoldDiff15: 200, avgDPM: 450,
        signatureChamps: ['Ryze', 'Nautilus', 'Galio', 'Malphite', 'Rumble'],
      },
      {
        id: 'lwx', name: 'Lwx', realName: 'Lin Wei-Xiang', lane: 'bot',
        mechanics: 85, gameIQ: 80, consistency: 82, peakPerformance: 90, championPool: 78,
        avgKDA: 4.5, avgCSPerMin: 9.6, avgGoldDiff15: 250, avgDPM: 520,
        signatureChamps: ['Kaisa', 'Xayah', 'Sivir', 'Ezreal', 'Vayne'],
      },
      {
        id: 'crisp', name: 'Crisp', realName: 'Liu Qing-Song', lane: 'support',
        mechanics: 85, gameIQ: 88, consistency: 85, peakPerformance: 90, championPool: 82,
        avgKDA: 3.8, avgCSPerMin: 1.4, avgGoldDiff15: 50, avgDPM: 180,
        signatureChamps: ['Thresh', 'Nautilus', 'Rakan', 'Leona', 'Pyke'],
      },
    ],
  },
  {
    id: 't1-2023',
    name: 'T1',
    shortName: 'T1',
    region: 'LCK',
    teamwork: 92,
    earlyGame: 82,
    lateGame: 95,
    objective: 90,
    aggression: 75,
    roster: [
      {
        id: 'zeus', name: 'Zeus', realName: 'Choi Woo-je', lane: 'top',
        mechanics: 92, gameIQ: 88, consistency: 85, peakPerformance: 95, championPool: 88,
        avgKDA: 4.0, avgCSPerMin: 9.0, avgGoldDiff15: 300, avgDPM: 550,
        signatureChamps: ['Jayce', 'Ksante', 'Gnar', 'Kennen', 'Aatrox'],
      },
      {
        id: 'oner', name: 'Oner', realName: 'Moon Hyeon-jun', lane: 'jungle',
        mechanics: 88, gameIQ: 90, consistency: 82, peakPerformance: 94, championPool: 80,
        avgKDA: 4.2, avgCSPerMin: 5.8, avgGoldDiff15: 300, avgDPM: 350,
        signatureChamps: ['LeeSin', 'Viego', 'Graves', 'Vi', 'Nocturne'],
      },
      {
        id: 'faker', name: 'Faker', realName: 'Lee Sang-hyeok', lane: 'mid',
        mechanics: 95, gameIQ: 99, consistency: 95, peakPerformance: 99, championPool: 95,
        avgKDA: 5.0, avgCSPerMin: 9.8, avgGoldDiff15: 400, avgDPM: 560,
        signatureChamps: ['Azir', 'Ahri', 'Leblanc', 'Orianna', 'Ryze'],
      },
      {
        id: 'gumayusi', name: 'Gumayusi', realName: 'Lee Min-hyeong', lane: 'bot',
        mechanics: 90, gameIQ: 85, consistency: 80, peakPerformance: 95, championPool: 82,
        avgKDA: 4.8, avgCSPerMin: 10.0, avgGoldDiff15: 350, avgDPM: 570,
        signatureChamps: ['Jinx', 'Aphelios', 'Varus', 'Jhin', 'Kaisa'],
      },
      {
        id: 'keria', name: 'Keria', realName: 'Ryu Min-seok', lane: 'support',
        mechanics: 93, gameIQ: 95, consistency: 90, peakPerformance: 97, championPool: 92,
        avgKDA: 4.5, avgCSPerMin: 1.5, avgGoldDiff15: 100, avgDPM: 200,
        signatureChamps: ['Thresh', 'Renata', 'Lulu', 'Nautilus', 'Bard'],
      },
    ],
  },
  {
    id: 'geng-2024',
    name: 'Gen.G',
    shortName: 'GEN',
    region: 'LCK',
    teamwork: 93,
    earlyGame: 80,
    lateGame: 93,
    objective: 92,
    aggression: 70,
    roster: [
      {
        id: 'kiin', name: 'Kiin', realName: 'Kim Gi-in', lane: 'top',
        mechanics: 90, gameIQ: 92, consistency: 90, peakPerformance: 94, championPool: 85,
        avgKDA: 4.2, avgCSPerMin: 9.1, avgGoldDiff15: 250, avgDPM: 520,
        signatureChamps: ['Aatrox', 'Gnar', 'Renekton', 'Jax', 'Rumble'],
      },
      {
        id: 'canyon', name: 'Canyon', realName: 'Kim Geon-bu', lane: 'jungle',
        mechanics: 93, gameIQ: 96, consistency: 88, peakPerformance: 98, championPool: 85,
        avgKDA: 4.8, avgCSPerMin: 6.0, avgGoldDiff15: 450, avgDPM: 380,
        signatureChamps: ['Nidalee', 'LeeSin', 'Graves', 'Viego', 'Kindred'],
      },
      {
        id: 'chovy', name: 'Chovy', realName: 'Jeong Ji-hoon', lane: 'mid',
        mechanics: 96, gameIQ: 90, consistency: 94, peakPerformance: 98, championPool: 88,
        avgKDA: 5.5, avgCSPerMin: 10.2, avgGoldDiff15: 500, avgDPM: 580,
        signatureChamps: ['Azir', 'Orianna', 'Corki', 'Viktor', 'Syndra'],
      },
      {
        id: 'peyz', name: 'Peyz', realName: 'Kim Su-hwan', lane: 'bot',
        mechanics: 85, gameIQ: 80, consistency: 78, peakPerformance: 90, championPool: 75,
        avgKDA: 4.0, avgCSPerMin: 9.7, avgGoldDiff15: 200, avgDPM: 530,
        signatureChamps: ['Jinx', 'Ezreal', 'Kaisa', 'Varus', 'Aphelios'],
      },
      {
        id: 'lehends', name: 'Lehends', realName: 'Son Si-woo', lane: 'support',
        mechanics: 82, gameIQ: 90, consistency: 85, peakPerformance: 88, championPool: 85,
        avgKDA: 3.5, avgCSPerMin: 1.3, avgGoldDiff15: 0, avgDPM: 170,
        signatureChamps: ['Singed', 'Thresh', 'Lulu', 'Nautilus', 'Rell'],
      },
    ],
  },
  {
    id: 'skt-2016',
    name: 'SK Telecom T1',
    shortName: 'SKT',
    region: 'LCK',
    teamwork: 96,
    earlyGame: 78,
    lateGame: 98,
    objective: 95,
    aggression: 68,
    roster: [
      {
        id: 'duke', name: 'Duke', realName: 'Lee Ho-seong', lane: 'top',
        mechanics: 85, gameIQ: 82, consistency: 80, peakPerformance: 90, championPool: 78,
        avgKDA: 3.5, avgCSPerMin: 8.8, avgGoldDiff15: 100, avgDPM: 450,
        signatureChamps: ['Trundle', 'Ekko', 'Poppy', 'Gnar'],
      },
      {
        id: 'bengi', name: 'Bengi', realName: 'Bae Seong-ung', lane: 'jungle',
        mechanics: 75, gameIQ: 95, consistency: 88, peakPerformance: 88, championPool: 65,
        avgKDA: 3.8, avgCSPerMin: 4.8, avgGoldDiff15: 100, avgDPM: 280,
        signatureChamps: ['Nidalee', 'Elise', 'RekSai', 'Olaf'],
      },
      {
        id: 'faker-2016', name: 'Faker', realName: 'Lee Sang-hyeok', lane: 'mid',
        mechanics: 97, gameIQ: 97, consistency: 93, peakPerformance: 99, championPool: 98,
        avgKDA: 5.5, avgCSPerMin: 10.0, avgGoldDiff15: 500, avgDPM: 600,
        signatureChamps: ['Ryze', 'Cassiopeia', 'Viktor', 'Orianna', 'Leblanc'],
      },
      {
        id: 'bang', name: 'Bang', realName: 'Bae Jun-sik', lane: 'bot',
        mechanics: 90, gameIQ: 88, consistency: 92, peakPerformance: 93, championPool: 82,
        avgKDA: 5.2, avgCSPerMin: 10.1, avgGoldDiff15: 300, avgDPM: 560,
        signatureChamps: ['Ezreal', 'Jhin', 'Caitlyn', 'Sivir', 'Lucian'],
      },
      {
        id: 'wolf', name: 'Wolf', realName: 'Lee Jae-wan', lane: 'support',
        mechanics: 80, gameIQ: 85, consistency: 82, peakPerformance: 88, championPool: 78,
        avgKDA: 3.2, avgCSPerMin: 1.2, avgGoldDiff15: -20, avgDPM: 160,
        signatureChamps: ['Karma', 'Nami', 'Alistar', 'Zyra'],
      },
    ],
  },
  {
    id: 'ssg-2017',
    name: 'Samsung Galaxy',
    shortName: 'SSG',
    region: 'LCK',
    teamwork: 97,
    earlyGame: 75,
    lateGame: 96,
    objective: 93,
    aggression: 62,
    roster: [
      {
        id: 'cuvee', name: 'CuVee', realName: 'Lee Seong-jin', lane: 'top',
        mechanics: 85, gameIQ: 88, consistency: 82, peakPerformance: 92, championPool: 82,
        avgKDA: 3.8, avgCSPerMin: 8.9, avgGoldDiff15: 150, avgDPM: 480,
        signatureChamps: ['Gnar', 'Kennen', 'Camille', 'Cho\'Gath'],
      },
      {
        id: 'ambition', name: 'Ambition', realName: 'Kang Chan-yong', lane: 'jungle',
        mechanics: 78, gameIQ: 92, consistency: 85, peakPerformance: 88, championPool: 72,
        avgKDA: 3.5, avgCSPerMin: 5.0, avgGoldDiff15: 50, avgDPM: 300,
        signatureChamps: ['Sejuani', 'JarvanIV', 'Ezreal', 'Graves'],
      },
      {
        id: 'crown', name: 'Crown', realName: 'Lee Min-ho', lane: 'mid',
        mechanics: 85, gameIQ: 85, consistency: 80, peakPerformance: 92, championPool: 78,
        avgKDA: 4.0, avgCSPerMin: 9.3, avgGoldDiff15: 200, avgDPM: 500,
        signatureChamps: ['Malzahar', 'Taliyah', 'Viktor', 'Veigar'],
      },
      {
        id: 'ruler', name: 'Ruler', realName: 'Park Jae-hyuk', lane: 'bot',
        mechanics: 92, gameIQ: 88, consistency: 90, peakPerformance: 95, championPool: 85,
        avgKDA: 5.0, avgCSPerMin: 10.0, avgGoldDiff15: 350, avgDPM: 560,
        signatureChamps: ['Varus', 'Xayah', 'Tristana', 'Ezreal'],
      },
      {
        id: 'corejj', name: 'CoreJJ', realName: 'Jo Yong-in', lane: 'support',
        mechanics: 85, gameIQ: 92, consistency: 88, peakPerformance: 92, championPool: 82,
        avgKDA: 3.8, avgCSPerMin: 1.3, avgGoldDiff15: 30, avgDPM: 170,
        signatureChamps: ['Janna', 'Lulu', 'Rakan', 'Thresh'],
      },
    ],
  },
  {
    id: 'dwg-2020',
    name: 'DAMWON Gaming',
    shortName: 'DWG',
    region: 'LCK',
    teamwork: 92,
    earlyGame: 88,
    lateGame: 90,
    objective: 92,
    aggression: 82,
    roster: [
      {
        id: 'nuguri', name: 'Nuguri', realName: 'Jang Ha-gwon', lane: 'top',
        mechanics: 93, gameIQ: 85, consistency: 78, peakPerformance: 97, championPool: 88,
        avgKDA: 3.8, avgCSPerMin: 9.3, avgGoldDiff15: 400, avgDPM: 570,
        signatureChamps: ['Kennen', 'Fiora', 'Camille', 'Jayce', 'Lulu'],
      },
      {
        id: 'canyon-2020', name: 'Canyon', realName: 'Kim Geon-bu', lane: 'jungle',
        mechanics: 95, gameIQ: 95, consistency: 90, peakPerformance: 99, championPool: 88,
        avgKDA: 5.5, avgCSPerMin: 6.2, avgGoldDiff15: 500, avgDPM: 400,
        signatureChamps: ['Nidalee', 'Graves', 'Kindred', 'LeeSin', 'Lillia'],
      },
      {
        id: 'showmaker', name: 'ShowMaker', realName: 'Heo Su', lane: 'mid',
        mechanics: 95, gameIQ: 94, consistency: 88, peakPerformance: 98, championPool: 90,
        avgKDA: 5.2, avgCSPerMin: 9.8, avgGoldDiff15: 450, avgDPM: 570,
        signatureChamps: ['Syndra', 'TwistedFate', 'Zoe', 'Akali', 'Katarina'],
      },
      {
        id: 'ghost', name: 'Ghost', realName: 'Jang Yong-jun', lane: 'bot',
        mechanics: 80, gameIQ: 85, consistency: 88, peakPerformance: 85, championPool: 72,
        avgKDA: 4.0, avgCSPerMin: 9.5, avgGoldDiff15: 100, avgDPM: 480,
        signatureChamps: ['Jhin', 'Ashe', 'Caitlyn', 'Ezreal'],
      },
      {
        id: 'beryl', name: 'BeryL', realName: 'Cho Geon-hee', lane: 'support',
        mechanics: 82, gameIQ: 88, consistency: 75, peakPerformance: 92, championPool: 85,
        avgKDA: 3.2, avgCSPerMin: 1.1, avgGoldDiff15: -30, avgDPM: 180,
        signatureChamps: ['Pantheon', 'Leona', 'Bard', 'Thresh'],
      },
    ],
  },
  {
    id: 'edg-2021',
    name: 'Edward Gaming',
    shortName: 'EDG',
    region: 'LPL',
    teamwork: 90,
    earlyGame: 82,
    lateGame: 88,
    objective: 85,
    aggression: 80,
    roster: [
      {
        id: 'flandre', name: 'Flandre', realName: 'Li Xuan-Jun', lane: 'top',
        mechanics: 85, gameIQ: 82, consistency: 80, peakPerformance: 90, championPool: 80,
        avgKDA: 3.5, avgCSPerMin: 8.8, avgGoldDiff15: 150, avgDPM: 480,
        signatureChamps: ['Graves', 'Gwen', 'Kennen', 'Jayce'],
      },
      {
        id: 'jiejie', name: 'JieJie', realName: 'Zhao Li-Jie', lane: 'jungle',
        mechanics: 85, gameIQ: 85, consistency: 78, peakPerformance: 92, championPool: 78,
        avgKDA: 4.0, avgCSPerMin: 5.5, avgGoldDiff15: 200, avgDPM: 340,
        signatureChamps: ['LeeSin', 'Viego', 'JarvanIV', 'Xin Zhao'],
      },
      {
        id: 'scout', name: 'Scout', realName: 'Lee Ye-chan', lane: 'mid',
        mechanics: 90, gameIQ: 88, consistency: 82, peakPerformance: 94, championPool: 85,
        avgKDA: 4.5, avgCSPerMin: 9.5, avgGoldDiff15: 350, avgDPM: 540,
        signatureChamps: ['Zoe', 'Leblanc', 'Ryze', 'Lissandra'],
      },
      {
        id: 'viper', name: 'Viper', realName: 'Park Do-hyeon', lane: 'bot',
        mechanics: 93, gameIQ: 88, consistency: 85, peakPerformance: 96, championPool: 85,
        avgKDA: 5.0, avgCSPerMin: 10.2, avgGoldDiff15: 400, avgDPM: 580,
        signatureChamps: ['Aphelios', 'Jinx', 'MissFortune', 'Lucian'],
      },
      {
        id: 'meiko', name: 'Meiko', realName: 'Tian Ye', lane: 'support',
        mechanics: 88, gameIQ: 92, consistency: 88, peakPerformance: 92, championPool: 85,
        avgKDA: 3.8, avgCSPerMin: 1.3, avgGoldDiff15: 50, avgDPM: 180,
        signatureChamps: ['Nautilus', 'Leona', 'Rakan', 'Thresh', 'Lulu'],
      },
    ],
  },
  {
    id: 'rng-2022',
    name: 'Royal Never Give Up',
    shortName: 'RNG',
    region: 'LPL',
    teamwork: 90,
    earlyGame: 85,
    lateGame: 82,
    objective: 82,
    aggression: 85,
    roster: [
      {
        id: 'breathe', name: 'Breathe', realName: 'Chen Chen', lane: 'top',
        mechanics: 82, gameIQ: 80, consistency: 78, peakPerformance: 88, championPool: 75,
        avgKDA: 3.2, avgCSPerMin: 8.5, avgGoldDiff15: 100, avgDPM: 440,
        signatureChamps: ['Gwen', 'Aatrox', 'Gangplank', 'Kennen'],
      },
      {
        id: 'wei', name: 'Wei', realName: 'Yan Yang-Wei', lane: 'jungle',
        mechanics: 87, gameIQ: 85, consistency: 78, peakPerformance: 93, championPool: 78,
        avgKDA: 4.0, avgCSPerMin: 5.3, avgGoldDiff15: 250, avgDPM: 350,
        signatureChamps: ['LeeSin', 'Viego', 'Diana', 'Wukong'],
      },
      {
        id: 'xiaohu', name: 'Xiaohu', realName: 'Li Yuan-Hao', lane: 'mid',
        mechanics: 88, gameIQ: 90, consistency: 85, peakPerformance: 92, championPool: 90,
        avgKDA: 4.5, avgCSPerMin: 9.2, avgGoldDiff15: 300, avgDPM: 520,
        signatureChamps: ['Ahri', 'Taliyah', 'Lissandra', 'Viktor'],
      },
      {
        id: 'gala', name: 'GALA', realName: 'Chen Wei', lane: 'bot',
        mechanics: 90, gameIQ: 82, consistency: 80, peakPerformance: 95, championPool: 78,
        avgKDA: 4.8, avgCSPerMin: 9.9, avgGoldDiff15: 300, avgDPM: 560,
        signatureChamps: ['Kaisa', 'Lucian', 'Tristana', 'Jinx'],
      },
      {
        id: 'ming', name: 'Ming', realName: 'Shi Sen-Ming', lane: 'support',
        mechanics: 85, gameIQ: 90, consistency: 85, peakPerformance: 90, championPool: 82,
        avgKDA: 3.5, avgCSPerMin: 1.2, avgGoldDiff15: 20, avgDPM: 170,
        signatureChamps: ['Nautilus', 'Thresh', 'Leona', 'Rakan'],
      },
    ],
  },
  {
    id: 'g2-2019',
    name: 'G2 Esports',
    shortName: 'G2',
    region: 'LEC',
    teamwork: 90,
    earlyGame: 88,
    lateGame: 85,
    objective: 85,
    aggression: 90,
    roster: [
      {
        id: 'wunder', name: 'Wunder', realName: 'Martin Hansen', lane: 'top',
        mechanics: 85, gameIQ: 85, consistency: 75, peakPerformance: 93, championPool: 88,
        avgKDA: 3.5, avgCSPerMin: 8.8, avgGoldDiff15: 200, avgDPM: 480,
        signatureChamps: ['Camille', 'Irelia', 'Akali', 'Wukong', 'Pyke'],
      },
      {
        id: 'jankos', name: 'Jankos', realName: 'Marcin Jankowski', lane: 'jungle',
        mechanics: 82, gameIQ: 90, consistency: 82, peakPerformance: 90, championPool: 80,
        avgKDA: 3.8, avgCSPerMin: 5.2, avgGoldDiff15: 200, avgDPM: 320,
        signatureChamps: ['Elise', 'LeeSin', 'Olaf', 'JarvanIV', 'Sejuani'],
      },
      {
        id: 'caps', name: 'Caps', realName: 'Rasmus Winther', lane: 'mid',
        mechanics: 93, gameIQ: 88, consistency: 75, peakPerformance: 97, championPool: 92,
        avgKDA: 4.8, avgCSPerMin: 9.5, avgGoldDiff15: 400, avgDPM: 560,
        signatureChamps: ['Sylas', 'Akali', 'Leblanc', 'Yasuo', 'Zoe'],
      },
      {
        id: 'perkz', name: 'Perkz', realName: 'Luka Perkovic', lane: 'bot',
        mechanics: 88, gameIQ: 90, consistency: 82, peakPerformance: 93, championPool: 90,
        avgKDA: 4.2, avgCSPerMin: 9.5, avgGoldDiff15: 200, avgDPM: 500,
        signatureChamps: ['Xayah', 'Kaisa', 'Ezreal', 'Syndra', 'Yasuo'],
      },
      {
        id: 'mikyx', name: 'Mikyx', realName: 'Mihael Mehle', lane: 'support',
        mechanics: 85, gameIQ: 88, consistency: 80, peakPerformance: 92, championPool: 82,
        avgKDA: 3.5, avgCSPerMin: 1.2, avgGoldDiff15: 30, avgDPM: 160,
        signatureChamps: ['Thresh', 'Rakan', 'Pyke', 'TahmKench'],
      },
    ],
  },
  {
    id: 'blg-2024',
    name: 'Bilibili Gaming',
    shortName: 'BLG',
    region: 'LPL',
    teamwork: 88,
    earlyGame: 86,
    lateGame: 85,
    objective: 84,
    aggression: 88,
    roster: [
      {
        id: 'bin', name: 'Bin', realName: 'Chen Ze-Bin', lane: 'top',
        mechanics: 93, gameIQ: 82, consistency: 72, peakPerformance: 97, championPool: 82,
        avgKDA: 3.5, avgCSPerMin: 9.0, avgGoldDiff15: 350, avgDPM: 550,
        signatureChamps: ['Jax', 'Fiora', 'Renekton', 'Aatrox', 'Irelia'],
      },
      {
        id: 'xun', name: 'Xun', realName: 'Peng Li-Xun', lane: 'jungle',
        mechanics: 85, gameIQ: 82, consistency: 78, peakPerformance: 90, championPool: 75,
        avgKDA: 3.8, avgCSPerMin: 5.4, avgGoldDiff15: 200, avgDPM: 330,
        signatureChamps: ['LeeSin', 'Viego', 'Vi', 'Sejuani'],
      },
      {
        id: 'knight', name: 'Knight', realName: 'Zhuo Ding', lane: 'mid',
        mechanics: 94, gameIQ: 90, consistency: 85, peakPerformance: 97, championPool: 85,
        avgKDA: 5.0, avgCSPerMin: 9.8, avgGoldDiff15: 400, avgDPM: 570,
        signatureChamps: ['Syndra', 'Ahri', 'Azir', 'Leblanc', 'Orianna'],
      },
      {
        id: 'elk', name: 'Elk', realName: 'Marco Ye', lane: 'bot',
        mechanics: 88, gameIQ: 82, consistency: 80, peakPerformance: 93, championPool: 78,
        avgKDA: 4.5, avgCSPerMin: 9.8, avgGoldDiff15: 300, avgDPM: 550,
        signatureChamps: ['Kaisa', 'Ezreal', 'Jinx', 'Varus'],
      },
      {
        id: 'on', name: 'ON', realName: 'Choi Hyeon-jun', lane: 'support',
        mechanics: 82, gameIQ: 85, consistency: 80, peakPerformance: 88, championPool: 78,
        avgKDA: 3.2, avgCSPerMin: 1.2, avgGoldDiff15: 0, avgDPM: 160,
        signatureChamps: ['Nautilus', 'Thresh', 'Braum', 'Alistar'],
      },
    ],
  },
  {
    id: 'weibo-2024',
    name: 'Weibo Gaming',
    shortName: 'WBG',
    region: 'LPL',
    teamwork: 82,
    earlyGame: 90,
    lateGame: 78,
    objective: 80,
    aggression: 92,
    roster: [
      {
        id: 'breathe-wbg', name: 'Breathe', realName: 'Chen Chen', lane: 'top',
        mechanics: 84, gameIQ: 82, consistency: 78, peakPerformance: 90, championPool: 78,
        avgKDA: 3.3, avgCSPerMin: 8.7, avgGoldDiff15: 150, avgDPM: 460,
        signatureChamps: ['Aatrox', 'Renekton', 'Rumble', 'Gwen'],
      },
      {
        id: 'tarzan', name: 'Tarzan', realName: 'Lee Seung-yong', lane: 'jungle',
        mechanics: 88, gameIQ: 90, consistency: 82, peakPerformance: 94, championPool: 82,
        avgKDA: 4.2, avgCSPerMin: 5.8, avgGoldDiff15: 350, avgDPM: 360,
        signatureChamps: ['Nidalee', 'LeeSin', 'Graves', 'Viego'],
      },
      {
        id: 'xiaohu-wbg', name: 'Xiaohu', realName: 'Li Yuan-Hao', lane: 'mid',
        mechanics: 86, gameIQ: 88, consistency: 82, peakPerformance: 90, championPool: 88,
        avgKDA: 4.2, avgCSPerMin: 9.2, avgGoldDiff15: 250, avgDPM: 510,
        signatureChamps: ['Ahri', 'Sylas', 'Azir', 'Viktor'],
      },
      {
        id: 'light', name: 'Light', realName: 'Wang Guang-Yu', lane: 'bot',
        mechanics: 87, gameIQ: 80, consistency: 76, peakPerformance: 93, championPool: 75,
        avgKDA: 4.3, avgCSPerMin: 9.8, avgGoldDiff15: 280, avgDPM: 550,
        signatureChamps: ['Kaisa', 'Draven', 'Lucian', 'Ezreal'],
      },
      {
        id: 'crisp-wbg', name: 'Crisp', realName: 'Liu Qing-Song', lane: 'support',
        mechanics: 83, gameIQ: 86, consistency: 82, peakPerformance: 88, championPool: 80,
        avgKDA: 3.4, avgCSPerMin: 1.2, avgGoldDiff15: 10, avgDPM: 165,
        signatureChamps: ['Thresh', 'Nautilus', 'Rakan', 'Leona'],
      },
    ],
  },
];

export function getTeamById(id: string): ProTeam | undefined {
  return PRO_TEAMS.find(t => t.id === id);
}

export function getPlayerById(id: string): ProPlayer | undefined {
  for (const team of PRO_TEAMS) {
    const player = team.roster.find(p => p.id === id);
    if (player) return player;
  }
  return undefined;
}
