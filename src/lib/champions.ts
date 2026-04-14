import { Champion } from './types';

const DDRAGON_VERSION_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';

let cachedVersion: string | null = null;

export async function getLatestVersion(): Promise<string> {
  if (cachedVersion) return cachedVersion;
  const res = await fetch(DDRAGON_VERSION_URL, { next: { revalidate: 86400 } });
  const versions: string[] = await res.json();
  cachedVersion = versions[0];
  return cachedVersion;
}

export async function fetchAllChampions(): Promise<Champion[]> {
  const version = await getLatestVersion();
  const url = `${DDRAGON_BASE}/${version}/data/en_US/champion.json`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  const data = await res.json();

  return Object.values(data.data).map((champ: any) => ({
    id: champ.id,
    key: champ.key,
    name: champ.name,
    title: champ.title,
    tags: champ.tags,
    image: `${DDRAGON_BASE}/${version}/img/champion/${champ.image.full}`,
  }));
}

export function getChampionSquare(version: string, championId: string): string {
  return `${DDRAGON_BASE}/${version}/img/champion/${championId}.png`;
}

export function getChampionSplash(championId: string, skinNum = 0): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skinNum}.jpg`;
}

export function getChampionLoading(championId: string, skinNum = 0): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_${skinNum}.jpg`;
}
