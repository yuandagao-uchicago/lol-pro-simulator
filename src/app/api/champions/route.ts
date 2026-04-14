import { fetchAllChampions } from '@/lib/champions';
import { NextResponse } from 'next/server';

export async function GET() {
  const champions = await fetchAllChampions();
  return NextResponse.json(champions);
}
