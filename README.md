# SUPER LEAGUE — Midnight Purple rebuild

## Included
- Club-code gate for player registration
- Team dropdown containing the 21 SUPER LEAGUE clubs
- Player fields, image upload (up to 1 MB), optional photo URL
- Match center
- No JSON menu in the user interface

## Secure club-code setup
The API route `/api/verify-team.js` checks codes server-side using Vercel environment variables. Do not put real codes in browser HTML.

Set these variables in Vercel for Production (and Preview/Development if needed):
- `TEAM_CODE_CELTOTTENAM` — 셀틱트넘FC code
- `TEAM_CODE_BARCELONA` — FC BARCELONA code
- `TEAM_CODE_NOTTINGHAM` — 노팅엄 실험실 code
- `TEAM_CODE_MARESCA` — 마레스카나치오날레 code
- `TEAM_CODE_ALVILLA` — 알 빌라 AL VILLA code
- `TEAM_CODE_ALNERBAHCE` — 알네르바체 code
- `TEAM_CODE_ASKROMA` — ASK 로마사라이 code
- `TEAM_CODE_SEOULPOOL` — 서울풀FC code
- `TEAM_CODE_COMOKUZEN` — 코모쿠젠 code
- `TEAM_CODE_HAMMERS` — 해머스 code
- `TEAM_CODE_HUNLAFE` — 헌라페 code
- `TEAM_CODE_QBR` — QUEENS BLACK ROVERS code
- `TEAM_CODE_SKYCITY` — SKY CITY code
- `TEAM_CODE_ROYALYORK` — Royal York Madrid code
- `TEAM_CODE_MSG` — MSG code
- `TEAM_CODE_LESBLEUS` — Les Bleus code
- `TEAM_CODE_DERKLASSIKER` — FC Der Klassiker code
- `TEAM_CODE_BONDEOL` — 본덜랜드 code
- `TEAM_CODE_NAPLESEA` — NAPLESEA code
- `TEAM_CODE_ATLETICOMILAN` — Atletico Milan code
- `TEAM_CODE_ARSENAL` — 아스날FC code

Use the initial codes shared with the league administrator as values. After adding variables, redeploy the project.

## Important limitation
Player and match data are still stored in browser localStorage. Authentication checks are server-side, but full per-club data isolation and shared cross-device records require Supabase/database-backed storage and authorization policies.
