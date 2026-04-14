# LoL Pro Match Simulator

## What We're Building
A League of Legends match simulator powered by pro game statistics. Users go through a champion ban/pick phase, then watch a simulated game unfold based on historical pro match data.

## Core Features
1. **Champion Draft Phase** — Full ban/pick flow (alternating like real pro play)
2. **Match Simulation** — Game timeline generated from pro stats (gold leads, objectives, team fights)
3. **Match History** — Users save and review past simulations
4. **Auth** — Clerk for sign up / sign in / sign out
5. **Database** — Supabase for user data and saved simulations

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Clerk (auth)
- Supabase (database)
- Riot ddragon CDN (champion data, icons, splash art — no key needed)

## Data Model (Supabase)
- `simulations` — id, user_id, blue_team (jsonb), red_team (jsonb), bans (jsonb), result (jsonb), timeline (jsonb), created_at
- `champion_stats` — champion_id, name, win_rate, pick_rate, role, avg_gold_at_15, synergies (jsonb), counters (jsonb)

## External APIs
- **Riot ddragon** (https://ddragon.leagueoflegends.com) — champion list, icons, splash art. No API key needed.

## Style Preferences
- Dark theme (league-inspired, dark blues/golds)
- Bold typography, generous spacing
- Smooth transitions for draft phase
- Mobile-responsive

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
