# Celtic FC Records Archive

A standalone archive for the real-world Celtic Football Club, kept separate from NFTA fantasy-league data.

## Sections
- Club profile and home ground
- Season-by-season honours
- Competition records
- Squad/player statistics
- Match log with score, competition, date, goals and assists
- Data status labels to distinguish verified historical records from records awaiting verification

## Data policy
Do not present unverified figures as official facts. Add a source URL and checked date to every imported historical record. The starter data intentionally avoids hard-coded current squad statistics until verified from official sources.

## Files
- `celtic-fc-records.html`: standalone responsive archive interface
- `data/celtic-fc-records.json`: structured starter dataset
- `data/celtic-fc-records.csv`: editable match-log template
- `supabase/migrations/202610140001_celtic_fc_records.sql`: schema migration

## Run
Open `celtic-fc-records.html` in a browser. Without backend credentials, it uses browser-local storage for records. Supabase connection can be configured in the page's settings using the project's URL and publishable key; never put a service-role key in a browser client.
