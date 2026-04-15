import { PRO_TEAMS } from '@/lib/pro-teams';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(PRO_TEAMS);
}
