# SUPER LEAGUE — Independent Rebuild

A standalone Vite app in its own folder. It does not overwrite the existing NFTA app files.

## Features
- Responsive dark-green SUPER LEAGUE management dashboard
- Teams, players, youth players, coaches, managers, transfers, matches, and news
- Add/edit/delete/search records
- Profile and crest image URLs
- Private per-account cloud persistence through the dedicated Supabase project

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these Vite environment variables in `.env.local` (and in Vercel):
- `VITE_SUPABASE_URL`: URL for the dedicated `SUPER-LEAGUE-CLOUD` project
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable/anon key only

Never put a Supabase `service_role` key in client-side code or `VITE_*` variables.

## Cloud persistence
The app uses Supabase Auth. Create an account or sign in from the app's cloud login panel. Teams, players, staff, transfers, matches, and news are stored together in `public.super_league_state` as one JSON state document per authenticated user. Row-level security is enabled; each account can only read or write its own row. The table is in the new dedicated Supabase project `SUPER-LEAGUE-CLOUD`, region Seoul (`ap-northeast-2`).

Existing local browser data is imported on the first login only if that browser has not already been associated with a different account. Once cloud data exists, cloud state is the source of truth.

## Vercel
Project root directory: `super-league-rebuild`  
Framework: Vite  
Build command: `npm run build`  
Output directory: `dist`

The Supabase environment variables have been added to the Vercel project. A deployment is still pending because the Vercel API currently rate-limits deployments, and GitHub auto-deploy linking requires access to the correct Vercel scope.
