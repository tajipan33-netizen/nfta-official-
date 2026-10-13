-- Celtic FC Records Archive
-- Separate tables: no changes to NFTA fantasy-league tables.
create table if not exists public.celtic_fc_matches (
  id bigint generated always as identity primary key,
  match_date date not null,
  season text not null check (char_length(season) between 1 and 20),
  competition text not null check (char_length(competition) between 1 and 120),
  round_label text,
  venue text not null default 'home' check (venue in ('home','away','neutral')),
  opponent text not null check (char_length(opponent) between 1 and 120),
  celtic_score integer not null check (celtic_score >= 0),
  opponent_score integer not null check (opponent_score >= 0),
  attendance integer check (attendance is null or attendance >= 0),
  goals_assists text,
  source_url text,
  verified boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.celtic_fc_players (
  id bigint generated always as identity primary key,
  player_name text not null check (char_length(player_name) between 1 and 120),
  season text not null check (char_length(season) between 1 and 20),
  position text not null check (position in ('GK','DF','MF','FW')),
  appearances integer not null default 0 check (appearances >= 0),
  goals integer not null default 0 check (goals >= 0),
  assists integer not null default 0 check (assists >= 0),
  source_url text,
  verified boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.celtic_fc_seasons (
  id bigint generated always as identity primary key,
  season text not null check (char_length(season) between 1 and 20),
  competition text not null check (char_length(competition) between 1 and 120),
  finish text,
  played integer not null default 0 check (played >= 0),
  won integer not null default 0 check (won >= 0),
  drawn integer not null default 0 check (drawn >= 0),
  lost integer not null default 0 check (lost >= 0),
  goals_for integer not null default 0 check (goals_for >= 0),
  goals_against integer not null default 0 check (goals_against >= 0),
  source_url text,
  verified boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  unique(season, competition)
);
create table if not exists public.celtic_fc_honours (
  id bigint generated always as identity primary key,
  season text not null check (char_length(season) between 1 and 20),
  record_type text not null check (record_type in ('honour','club_history','player_record','other')),
  competition text not null check (char_length(competition) between 1 and 120),
  title text not null check (char_length(title) between 1 and 2000),
  source_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists celtic_fc_matches_date_idx on public.celtic_fc_matches (match_date desc);
create index if not exists celtic_fc_matches_season_competition_idx on public.celtic_fc_matches (season, competition);
create index if not exists celtic_fc_players_season_name_idx on public.celtic_fc_players (season, player_name);
create index if not exists celtic_fc_honours_season_idx on public.celtic_fc_honours (season);

alter table public.celtic_fc_matches enable row level security;
alter table public.celtic_fc_players enable row level security;
alter table public.celtic_fc_seasons enable row level security;
alter table public.celtic_fc_honours enable row level security;

-- Public visitors may read published/verified archive entries only.
create policy "Public can read verified Celtic match records"
on public.celtic_fc_matches for select to anon, authenticated using (verified = true);
create policy "Public can read verified Celtic player records"
on public.celtic_fc_players for select to anon, authenticated using (verified = true);
create policy "Public can read verified Celtic season records"
on public.celtic_fc_seasons for select to anon, authenticated using (verified = true);
create policy "Public can read verified Celtic honours"
on public.celtic_fc_honours for select to anon, authenticated using (verified = true);

-- No anonymous insert/update/delete policies are created. Use dashboard/admin operations
-- or add an authenticated admin-only policy after defining the site's admin authorization model.
grant select on public.celtic_fc_matches, public.celtic_fc_players, public.celtic_fc_seasons, public.celtic_fc_honours to anon, authenticated;
