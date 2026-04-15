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

// Player photos — mapped by player ID
export const PLAYER_PHOTOS: Record<string, string> = {
  // IG 2018
  theshy:      `${WIKI}/2/2a/IG_TheShy_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190117081042`,
  ning:        `${WIKI}/a/a0/IG_Ning_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190117081325`,
  rookie:      `${WIKI}/1/10/IG_Rookie_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190117081325`,
  jackeylove:  `${WIKI}/0/0f/TES_JackeyLove_2020_Split_2.png/revision/latest/scale-to-width-down/220?cb=20200614033515`,
  baolan:      `${WIKI}/d/d0/IG_Baolan_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190117081042`,
  // FPX 2019
  gimgoon:     `${WIKI}/c/c1/FPX_GimGoon_2019_Split_2.png/revision/latest/scale-to-width-down/220?cb=20190613160749`,
  tian:        `${WIKI}/a/a2/FPX_Tian_2019_Split_2.png/revision/latest/scale-to-width-down/220?cb=20190613160749`,
  doinb:       `${WIKI}/4/49/FPX_Doinb_2019_Split_2.png/revision/latest/scale-to-width-down/220?cb=20190613160749`,
  lwx:         `${WIKI}/2/25/FPX_Lwx_2019_Split_2.png/revision/latest/scale-to-width-down/220?cb=20190613160749`,
  crisp:       `${WIKI}/5/52/FPX_Crisp_2019_Split_2.png/revision/latest/scale-to-width-down/220?cb=20190613160749`,
  // T1 2023
  zeus:        `${WIKI}/0/01/T1_Zeus_2023_Split_1.png/revision/latest/scale-to-width-down/220?cb=20230110193005`,
  oner:        `${WIKI}/5/5f/T1_Oner_2023_Split_1.png/revision/latest/scale-to-width-down/220?cb=20230110193005`,
  faker:       `${WIKI}/b/b8/T1_Faker_2023_Split_1.png/revision/latest/scale-to-width-down/220?cb=20230110193005`,
  gumayusi:    `${WIKI}/6/6a/T1_Gumayusi_2023_Split_1.png/revision/latest/scale-to-width-down/220?cb=20230110193005`,
  keria:       `${WIKI}/f/f3/T1_Keria_2023_Split_1.png/revision/latest/scale-to-width-down/220?cb=20230110193005`,
  // Gen.G 2024
  kiin:        `${WIKI}/0/00/GEN_Kiin_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110143004`,
  canyon:      `${WIKI}/4/4c/GEN_Canyon_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110143004`,
  chovy:       `${WIKI}/6/6f/GEN_Chovy_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110143004`,
  peyz:        `${WIKI}/b/b7/GEN_Peyz_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110143004`,
  lehends:     `${WIKI}/3/33/GEN_Lehends_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110143004`,
  // SKT 2016
  duke:        `${WIKI}/6/6c/SKT_Duke_2016_Spring.png/revision/latest/scale-to-width-down/220?cb=20160107181524`,
  bengi:       `${WIKI}/c/ca/SKT_Bengi_2016_Spring.png/revision/latest/scale-to-width-down/220?cb=20160107181524`,
  'faker-2016': `${WIKI}/b/b8/T1_Faker_2023_Split_1.png/revision/latest/scale-to-width-down/220?cb=20230110193005`,
  bang:        `${WIKI}/4/4e/SKT_Bang_2016_Spring.png/revision/latest/scale-to-width-down/220?cb=20160107181524`,
  wolf:        `${WIKI}/a/ab/SKT_Wolf_2016_Spring.png/revision/latest/scale-to-width-down/220?cb=20160107181524`,
  // DWG 2020
  nuguri:      `${WIKI}/7/7c/DWG_Nuguri_2020_Split_2.png/revision/latest/scale-to-width-down/220?cb=20200614020517`,
  'canyon-2020': `${WIKI}/3/38/DWG_Canyon_2020_Split_2.png/revision/latest/scale-to-width-down/220?cb=20200614020517`,
  showmaker:   `${WIKI}/3/3e/DWG_ShowMaker_2020_Split_2.png/revision/latest/scale-to-width-down/220?cb=20200614020517`,
  ghost:       `${WIKI}/0/0f/DWG_Ghost_2020_Split_2.png/revision/latest/scale-to-width-down/220?cb=20200614020517`,
  beryl:       `${WIKI}/c/ce/DWG_BeryL_2020_Split_2.png/revision/latest/scale-to-width-down/220?cb=20200614020517`,
  // G2 2019
  wunder:      `${WIKI}/c/cd/G2_Wunder_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190118200814`,
  jankos:      `${WIKI}/3/34/G2_Jankos_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190118200814`,
  caps:        `${WIKI}/2/2a/G2_Caps_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190118200814`,
  perkz:       `${WIKI}/2/25/G2_Perkz_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190118200814`,
  mikyx:       `${WIKI}/6/62/G2_Mikyx_2019_Split_1.png/revision/latest/scale-to-width-down/220?cb=20190118200814`,
  // EDG 2021
  flandre:     `${WIKI}/7/7d/EDG_Flandre_2021_Split_2.png/revision/latest/scale-to-width-down/220?cb=20210614164148`,
  jiejie:      `${WIKI}/5/5f/EDG_JieJie_2021_Split_2.png/revision/latest/scale-to-width-down/220?cb=20210614164148`,
  scout:       `${WIKI}/0/07/EDG_Scout_2021_Split_2.png/revision/latest/scale-to-width-down/220?cb=20210614164148`,
  viper:       `${WIKI}/2/28/EDG_Viper_2021_Split_2.png/revision/latest/scale-to-width-down/220?cb=20210614164148`,
  meiko:       `${WIKI}/b/be/EDG_Meiko_2021_Split_2.png/revision/latest/scale-to-width-down/220?cb=20210614164148`,
  // RNG 2022
  breathe:     `${WIKI}/2/24/RNG_Breathe_2022_Split_1.png/revision/latest/scale-to-width-down/220?cb=20220111091515`,
  wei:         `${WIKI}/f/f5/RNG_Wei_2022_Split_1.png/revision/latest/scale-to-width-down/220?cb=20220111091515`,
  xiaohu:      `${WIKI}/4/4f/RNG_Xiaohu_2022_Split_1.png/revision/latest/scale-to-width-down/220?cb=20220111091515`,
  gala:        `${WIKI}/d/dd/RNG_GALA_2022_Split_1.png/revision/latest/scale-to-width-down/220?cb=20220111091515`,
  ming:        `${WIKI}/b/bc/RNG_Ming_2022_Split_1.png/revision/latest/scale-to-width-down/220?cb=20220111091515`,
  // BLG 2024
  bin:         `${WIKI}/0/0b/BLG_Bin_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110142405`,
  xun:         `${WIKI}/f/f5/BLG_Xun_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110142405`,
  knight:      `${WIKI}/5/56/BLG_Knight_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110142405`,
  elk:         `${WIKI}/8/80/BLG_Elk_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110142405`,
  on:          `${WIKI}/b/b1/BLG_ON_2024_Split_1.png/revision/latest/scale-to-width-down/220?cb=20240110142405`,
  // WBG 2024
  'breathe-wbg': `${WIKI}/2/24/RNG_Breathe_2022_Split_1.png/revision/latest/scale-to-width-down/220?cb=20220111091515`,
  tarzan:      `${WIKI}/d/d7/LNG_Tarzan_2021_Split_2.png/revision/latest/scale-to-width-down/220?cb=20210614165419`,
  'xiaohu-wbg': `${WIKI}/4/4f/RNG_Xiaohu_2022_Split_1.png/revision/latest/scale-to-width-down/220?cb=20220111091515`,
  light:       `${WIKI}/8/8f/WBG_Light_2023_Split_1.png/revision/latest/scale-to-width-down/220?cb=20230111023004`,
  'crisp-wbg': `${WIKI}/5/52/FPX_Crisp_2019_Split_2.png/revision/latest/scale-to-width-down/220?cb=20190613160749`,
  // SSG 2017
  cuvee:       `${WIKI}/4/4e/SSG_CuVee_2017_Split_2.png/revision/latest/scale-to-width-down/220?cb=20170617085424`,
  ambition:    `${WIKI}/c/c5/SSG_Ambition_2017_Split_2.png/revision/latest/scale-to-width-down/220?cb=20170617085424`,
  crown:       `${WIKI}/6/65/SSG_Crown_2017_Split_2.png/revision/latest/scale-to-width-down/220?cb=20170617085424`,
  ruler:       `${WIKI}/8/8d/SSG_Ruler_2017_Split_2.png/revision/latest/scale-to-width-down/220?cb=20170617085424`,
  corejj:      `${WIKI}/3/32/SSG_CoreJJ_2017_Split_2.png/revision/latest/scale-to-width-down/220?cb=20170617085424`,
};

export function getTeamLogo(teamId: string): string | undefined {
  return TEAM_LOGOS[teamId];
}

export function getPlayerPhoto(playerId: string): string | undefined {
  return PLAYER_PHOTOS[playerId];
}
