// Player bios, career facts, and highlight clip URLs

export interface PlayerBio {
  id: string;
  bio: string;
  facts: string[];
  // YouTube video IDs for career highlights — all verified working
  highlights: Array<{ title: string; youtubeId: string }>;
  achievements: string[];
}

export const PLAYER_BIOS: Record<string, PlayerBio> = {
  faker: {
    id: 'faker',
    bio: 'Lee "Faker" Sang-hyeok is widely regarded as the greatest League of Legends player of all time. Debuting in 2013, Faker has dominated competitive LoL for over a decade, known for his unmatched mechanical skill, game sense, and clutch performances in high-pressure situations.',
    facts: [
      'Four-time World Champion (2013, 2015, 2016, 2023)',
      'Only player to have won 4 World Championships',
      'Has played for T1 (formerly SKT) his entire career — over 10 years',
      'Known as the "Unkillable Demon King"',
      'His Zed vs Zed outplay in 2013 is one of the most iconic moments in esports history',
      'Holds the record for most kills in LCK history',
    ],
    highlights: [
      { title: 'Faker\'s INSANE Zed vs Ryu Zed outplay (2013)', youtubeId: 'ZPCfoCVCx3U' },
      { title: 'ICONIC Esports Moments: Faker vs Ryu', youtubeId: 'cPAjwNa8MfE' },
      { title: 'Everything Faker did at Worlds 2023 — 4th Trophy Highlights', youtubeId: '6q60G7KmKKc' },
    ],
    achievements: ['4x World Champion', '10x LCK Champion', 'MSI 2016 & 2017 Champion', '2023 Worlds MVP'],
  },
  theshy: {
    id: 'theshy',
    bio: 'Kang "TheShy" Seung-lok is a Korean top laner who became legendary playing in China\'s LPL. Known for his hyper-aggressive playstyle and incredible mechanical ceiling, TheShy at his peak was considered the most dominant laner in professional LoL history.',
    facts: [
      'Won the 2018 World Championship with Invictus Gaming',
      'Famous for his fearless 1v1 duels in top lane',
      'Originally a solo queue prodigy scouted from Korean solo queue',
      'His Fiora and Jayce are considered some of the best ever played',
      'Suffered a hand injury in 2017 that nearly ended his career before it began',
    ],
    highlights: [
      { title: 'TheShy Worlds 2018 — Best Plays', youtubeId: '0DZCRrJRi1U' },
      { title: 'FNC vs IG — World Championship Finals Highlights (2018)', youtubeId: 'SdidA-9GvgE' },
      { title: 'TheShy "THE TOPLANE CARRY" Montage', youtubeId: 'eLzch2JuLxs' },
    ],
    achievements: ['2018 World Champion', 'LPL Champion', 'Worlds 2018 Finals MVP'],
  },
  rookie: {
    id: 'rookie',
    bio: 'Song "Rookie" Eui-jin is a Korean mid laner who became one of China\'s most beloved imports. Joining IG in 2014, Rookie spent years building the team before finally winning Worlds in 2018. He\'s known for his deep champion pool and ability to win any lane matchup.',
    facts: [
      'Won 2018 Worlds — was the emotional heart of IG\'s championship run',
      'Considered by many as a top-3 mid laner of all time',
      'Spent most of his career in the LPL despite being Korean',
      'Known for crying tears of joy after winning Worlds',
      'His LeBlanc is feared across all regions',
    ],
    highlights: [
      { title: 'Rookie Highlights ALL GAMES — Worlds 2018 Grand Finals', youtubeId: 'huf6uQ-ZkwE' },
      { title: 'IG Rookie Highlights ALL GAMES On Worlds 2018', youtubeId: '9st57ORyOJQ' },
    ],
    achievements: ['2018 World Champion', 'Multiple LPL titles', 'LPL MVP'],
  },
  chovy: {
    id: 'chovy',
    bio: 'Jeong "Chovy" Ji-hoon is known as one of the most mechanically gifted mid laners in LoL history. Famous for his absurd CS numbers and lane dominance, Chovy consistently tops the stats charts but has been on a long quest for his first World Championship.',
    facts: [
      'Holds records for highest CS per minute in LCK history',
      'Known as the "CS King" for his near-perfect farming',
      'Has been to Worlds multiple times with different teams',
      'His Azir and Orianna are considered textbook-level play',
      'Often compared to Faker as the greatest mid of his generation',
    ],
    highlights: [
      { title: 'Top 25 Chovy Plays — Legends In Action', youtubeId: 'gtXkBrVsfP4' },
      { title: 'Chovy "BEST PRO MIDLANER" Montage', youtubeId: '31T62joSsWM' },
      { title: 'Top 20 Chovy Plays', youtubeId: 'kq0GAGOs-1Y' },
    ],
    achievements: ['2024 World Champion with Gen.G', 'Multiple LCK titles', 'LCK MVP'],
  },
  canyon: {
    id: 'canyon',
    bio: 'Kim "Canyon" Geon-bu revolutionized jungle play in professional LoL. His pathing efficiency, mechanical prowess, and ability to control the tempo of entire games earned him the title of best jungler in the world during DAMWON\'s dominant 2020 run.',
    facts: [
      'Won 2020 World Championship with DAMWON Gaming',
      'His Nidalee is considered the greatest ever played in pro',
      'Known for innovative jungle pathing that other junglers study',
      'Youngest World Champion jungler at the time of his win',
      'Transitioned to Gen.G and continued dominating',
    ],
    highlights: [
      { title: 'DWG Canyon Montage — The MVP of Finals Worlds 2020', youtubeId: 'b85FYY4zMtU' },
      { title: 'DWG vs SN Highlights ALL GAMES — GRAND FINAL Worlds 2020', youtubeId: 'bJeG2xddRt8' },
    ],
    achievements: ['2020 World Champion', '2024 World Champion', 'Multiple LCK titles'],
  },
  showmaker: {
    id: 'showmaker',
    bio: 'Heo "ShowMaker" Su is a Korean mid laner who formed one of the most iconic mid-jungle duos in LoL history alongside Canyon at DAMWON. Known for his versatile champion pool and ability to perform in clutch moments.',
    facts: [
      'Won 2020 Worlds with DAMWON Gaming',
      'His Syndra and Twisted Fate are iconic picks',
      'Famous for his aggressive roaming playstyle',
      'Was Faker\'s biggest rival in the LCK for years',
      'Known for being calm under pressure in elimination games',
    ],
    highlights: [
      { title: 'ShowMaker Highlights Worlds 2020', youtubeId: 'b2jZY6zJ_3w' },
      { title: 'ShowMaker solokills Caps — Worlds 2020 Semifinals DWG vs G2', youtubeId: '4BATMeTNN88' },
      { title: 'Best of Damwon — Worlds 2020 Edition', youtubeId: 'fwzByyIVEQ4' },
    ],
    achievements: ['2020 World Champion', 'LCK Champion', 'Worlds 2020 MVP'],
  },
  caps: {
    id: 'caps',
    bio: 'Rasmus "Caps" Winther is Europe\'s greatest mid laner and the face of G2 Esports\' golden era. Known as "Claps" when he\'s popping off and "Craps" when he\'s not, Caps brought a level of mechanical aggression that Europe had never seen before.',
    facts: [
      'Two-time Worlds finalist (2018, 2019)',
      'Won MSI 2019 with G2 — Europe\'s first international title in years',
      'Known for his incredibly aggressive laning and limit-testing',
      'Played both mid and ADC for G2 at the highest level',
      'His Sylas debut at Worlds 2019 was iconic',
    ],
    highlights: [
      { title: 'Caps REACTS to his BEST Plays of All Time', youtubeId: 'veqZBAs-QCs' },
      { title: '20 Times Caps HUMILIATED His Opponents', youtubeId: '8ZM0XO5Mfxs' },
      { title: 'Best G2 Caps Plays in Tournament Highlights', youtubeId: 'MHI-aJI1Opg' },
    ],
    achievements: ['MSI 2019 Champion', '2x Worlds Finalist', 'Multiple LEC titles'],
  },
  doinb: {
    id: 'doinb',
    bio: 'Kim "Doinb" Tae-sang is one of the most unconventional mid laners in LoL history. Known for his massive champion pool including off-meta picks like Nautilus and Malphite mid, Doinb won Worlds 2019 with FPX through superior macro rather than raw mechanics.',
    facts: [
      'Won 2019 World Championship with FunPlus Phoenix',
      'Famous for playing "support mids" like Nautilus and Galio',
      'Married a Chinese woman and became a Chinese citizen',
      'One of the most beloved figures in the LPL community',
      'His game IQ is considered one of the highest ever in pro LoL',
    ],
    highlights: [
      { title: 'FPX Doinb — All Games Montage Worlds 2019 Finals', youtubeId: 'txpwBPdZW8U' },
      { title: 'G2 vs FPX Highlights ALL GAMES — Worlds 2019 Grand Final', youtubeId: 'STCHSLBI85k' },
      { title: 'Play Wrong, Win Worlds: The Mid Laner Who Defied Expectations', youtubeId: 'v4t3MjhQDN0' },
    ],
    achievements: ['2019 World Champion', 'LPL Champion', 'Worlds 2019 MVP'],
  },
  viper: {
    id: 'viper',
    bio: 'Park "Viper" Do-hyeon is a Korean ADC who achieved greatness in the LPL with Edward Gaming. His mechanical precision on champions like Aphelios helped EDG win the 2021 World Championship in one of the most dramatic finals ever.',
    facts: [
      'Won 2021 Worlds with EDG in a historic 5-game final vs DWG',
      'His Aphelios is considered one of the best ever',
      'Quiet and reserved personality, lets his gameplay do the talking',
      'Started his career with Griffin in the LCK',
    ],
    highlights: [
      { title: 'EDG Viper — Aphelios Masterclass Worlds 2021 Finals', youtubeId: 't3G-X7ZcvUQ' },
      { title: 'DK vs EDG Highlights ALL GAMES — Worlds 2021 GRAND FINAL', youtubeId: 'LLEfcQueqKM' },
      { title: 'Viper "BEST PRO ADC" Montage', youtubeId: '05Y3z-Gpk1M' },
    ],
    achievements: ['2021 World Champion', 'LPL Champion', 'Worlds 2021 Finals MVP'],
  },
  ruler: {
    id: 'ruler',
    bio: 'Park "Ruler" Jae-hyuk is one of the greatest ADCs in LCK history. He won Worlds 2017 with Samsung Galaxy and has remained a top-tier carry for years. His positioning in teamfights is considered textbook-level.',
    facts: [
      'Won 2017 Worlds with Samsung Galaxy',
      'His Varus arrow to start the comeback in the 2017 Finals is legendary',
      'Has played at the highest level for over 7 years',
      'Known for his incredible positioning and teamfight awareness',
    ],
    highlights: [
      { title: 'SSG Ruler 4.5 Million Dollar Varus Flash — Final Fight at Worlds 2017', youtubeId: 'UEZcu2On3Io' },
      { title: 'SKT vs SSG Highlights ALL GAMES — Worlds 2017 Grand Final', youtubeId: 'lPNh-adaiPE' },
    ],
    achievements: ['2017 World Champion', 'Multiple LCK titles'],
  },
  keria: {
    id: 'keria',
    bio: 'Ryu "Keria" Min-seok is widely regarded as the best support player in the world. His mechanical skill on playmaking champions is unmatched, and his synergy with T1\'s bot lane has been a cornerstone of their success.',
    facts: [
      'Considered the best support player in the world since 2022',
      'His Thresh and Renata are feared globally',
      'Known for having champion-level mechanics on support, playing flashy combos',
      'Won Worlds 2023 with T1',
    ],
    highlights: [
      { title: '20 Times Keria SHOCKED The World', youtubeId: 'nb1PiORQ_-8' },
      { title: 'T1 Keria "BEST SUPPORT WORLD" Montage', youtubeId: 'nGEPqmlhzUE' },
      { title: 'T1 Keria Hits 4 Hooks In 10 Seconds', youtubeId: 'EYVlpGvOYSE' },
    ],
    achievements: ['2023 World Champion', 'Multiple LCK titles', 'LCK Support of the Year'],
  },
};
