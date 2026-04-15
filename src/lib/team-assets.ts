// Team logos and player photos
// Using Leaguepedia/Fandom CDN — verified working URLs

const WIKI = 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images';

export const TEAM_LOGOS: Record<string, string> = {
  'ig-2018':    `${WIKI}/e/e4/Invictus_Gaminglogo_square.png/revision/latest?cb=20220121030730`,
  'fpx-2019':   `${WIKI}/b/b1/FunPlus_Phoenixlogo_square.png/revision/latest?cb=20230426040632`,
  't1-2023':    `${WIKI}/a/a2/T1logo_square.png/revision/latest?cb=20230512040747`,
  'geng-2024':  `${WIKI}/e/e3/Gen.Glogo_square.png/revision/latest?cb=20260114104755`,
  'skt-2016':   `${WIKI}/5/59/SK_Telecom_T1logo_square.png/revision/latest?cb=20221015010024`,
  'ssg-2017':   `${WIKI}/0/04/Samsung_Galaxylogo_square.png/revision/latest?cb=20180527225906`,
  'dwg-2020':   `${WIKI}/6/6d/DAMWON_Gaminglogo_square.png/revision/latest?cb=20200224094730`,
  'edg-2021':   `${WIKI}/5/56/EDward_Gaminglogo_square.png/revision/latest?cb=20260109115903`,
  'rng-2022':   `${WIKI}/e/eb/Royal_Never_Give_Uplogo_square.png/revision/latest?cb=20260204111738`,
  'g2-2019':    `${WIKI}/7/77/G2_Esportslogo_square.png/revision/latest?cb=20210810013355`,
  'blg-2024':   `${WIKI}/9/91/Bilibili_Gaminglogo_square.png/revision/latest?cb=20260109092043`,
  'weibo-2024': `${WIKI}/5/58/Weibo_Gaminglogo_square.png/revision/latest?cb=20260109113138`,
};

// Player photos — verified working URLs using /revision/latest?cb= format
// Only includes players with confirmed working URLs
export const PLAYER_PHOTOS: Record<string, string> = {
  // Verified via Leaguepedia API
  faker:         `${WIKI}/5/5a/T1_Faker_2026_LCK_Cup.png/revision/latest?cb=20260122163312`,
  'faker-2016':  `${WIKI}/5/5a/T1_Faker_2026_LCK_Cup.png/revision/latest?cb=20260122163312`,
  theshy:        `${WIKI}/b/b9/IG_TheShy_2025_Worlds.png/revision/latest?cb=20251013151900`,
  rookie:        `${WIKI}/1/1b/IG_Rookie_2026_Split_1.png/revision/latest?cb=20260327160928`,
  chovy:         `${WIKI}/b/b3/GEN_Chovy_2026_Split_1.png/revision/latest?cb=20260122171212`,
  canyon:        `${WIKI}/5/55/GEN_Canyon_2026_Split_1.png/revision/latest?cb=20260122171322`,
  'canyon-2020': `${WIKI}/5/55/GEN_Canyon_2026_Split_1.png/revision/latest?cb=20260122171322`,
  showmaker:     `${WIKI}/e/e7/DK_ShowMaker_2026_Split_1.png/revision/latest?cb=20260122171041`,
  caps:          `${WIKI}/6/6a/G2_Caps_2026_Split_1.png/revision/latest?cb=20260117092522`,
  doinb:         `${WIKI}/0/0d/NIP_Doinb_2025_Split_1.png/revision/latest?cb=20250109143743`,
  viper:         `${WIKI}/3/3b/BLG_Viper_2026_Split_1.png/revision/latest?cb=20260327160431`,
  ruler:         `${WIKI}/e/e3/GEN_Ruler_2026_Split_1.png/revision/latest?cb=20260122171312`,
  keria:         `${WIKI}/d/da/T1_Keria_2026_LCK_Cup.png/revision/latest?cb=20260122163329`,
};

export function getTeamLogo(teamId: string): string | undefined {
  return TEAM_LOGOS[teamId];
}

export function getPlayerPhoto(playerId: string): string | undefined {
  return PLAYER_PHOTOS[playerId];
}
