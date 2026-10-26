# SUPER LEAGUE — Midnight Purple (v0.1)

A fresh, standalone prototype for the SUPER LEAGUE management app.

## Included in this first version
- **Player Registration:** player name, club, position, shirt number, OVR, nationality, optional photo URL; search, filter, delete.
- **Match Center:** date, home/away clubs, score, round/competition, MOM; upcoming fixtures supported by leaving scores blank.
- **Code:** JSON preview, copy, and export/download.

## Design
- Midnight Purple theme with violet and lavender accents.
- Responsive mobile-first layout.
- Three tabs only: 선수등록 / 경기센터 / 코드.

## Storage limitation
This prototype stores data in the current browser using localStorage. It is not yet connected to Supabase or a shared cloud database, so data does not automatically sync between devices or users.

## Run
Open `index.html` in a browser or deploy the folder as a static site. No build step required.

## Next step
Add authentication and a properly secured shared database only after the Supabase project and access permissions are confirmed.
