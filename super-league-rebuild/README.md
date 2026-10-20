# SUPER LEAGUE — Independent Rebuild

A standalone Vite app scaffold stored in its own folder so existing NFTA/SUPER LEAGUE files remain untouched.

## Current features
- Responsive dark green management dashboard
- Teams, players, youth/coaches/managers, transfers, match notes, news management
- Add/edit/delete/search for management records
- Player, staff and crest image URLs
- Isolated browser storage key (`super-league-rebuild-v1`)

## Run
`npm install`
`npm run dev`
`npm run build`

## Persistence
Current MVP uses browser localStorage only. That means data stays in that browser/device and is not synced to another device. Configure a **dedicated Supabase project** before enabling cloud sync. Do not point it at an existing production database until the schema and access policies are reviewed. Never use a Supabase service-role key in client-side variables.

## Vercel
Set the project root directory to `super-league-rebuild`, framework Vite, build command `npm run build`, output directory `dist`.
