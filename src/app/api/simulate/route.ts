import { simulateGame } from '@/lib/simulation';
import { Champion } from '@/lib/types';
import { ProPlayer, ProTeam } from '@/lib/pro-teams';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body: {
    blueTeam: Champion[];
    redTeam: Champion[];
    blueRoster?: ProPlayer[];
    redRoster?: ProPlayer[];
    blueTeamInfo?: ProTeam;
    redTeamInfo?: ProTeam;
  } = await req.json();

  if (!body.blueTeam || !body.redTeam || body.blueTeam.length !== 5 || body.redTeam.length !== 5) {
    return NextResponse.json({ error: 'Each team must have exactly 5 champions' }, { status: 400 });
  }

  const result = simulateGame({
    blueTeam: body.blueTeam,
    redTeam: body.redTeam,
    blueRoster: body.blueRoster,
    redRoster: body.redRoster,
    blueTeamInfo: body.blueTeamInfo,
    redTeamInfo: body.redTeamInfo,
  });

  return NextResponse.json(result);
}
