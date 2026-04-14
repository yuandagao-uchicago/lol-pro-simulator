import { simulateGame } from '@/lib/simulation';
import { Champion } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { blueTeam, redTeam }: { blueTeam: Champion[]; redTeam: Champion[] } = await req.json();

  if (!blueTeam || !redTeam || blueTeam.length !== 5 || redTeam.length !== 5) {
    return NextResponse.json({ error: 'Each team must have exactly 5 champions' }, { status: 400 });
  }

  const result = simulateGame(blueTeam, redTeam);
  return NextResponse.json(result);
}
