-- Valoraciones anónimas de cada Gran Premio (F1 Majoda).
-- Pega este archivo en Supabase → SQL Editor → Run.

create table if not exists public.race_ratings (
  id bigint generated always as identity primary key,
  season smallint not null check (season between 1950 and 2100),
  round smallint not null check (round between 1 and 40),
  rating smallint not null check (rating between 1 and 5),
  -- SHA-256 de (sal secreta + IP + navegador). La IP nunca se guarda.
  voter_hash char(64) not null,
  created_at timestamptz not null default now(),
  unique (season, round, voter_hash)
);

create index if not exists race_ratings_race_idx on public.race_ratings (season, round);

create or replace view public.race_rating_summary as
select
  season,
  round,
  count(*)::int as votes,
  round(avg(rating)::numeric, 2) as average,
  count(*) filter (where rating = 1)::int as s1,
  count(*) filter (where rating = 2)::int as s2,
  count(*) filter (where rating = 3)::int as s3,
  count(*) filter (where rating = 4)::int as s4,
  count(*) filter (where rating = 5)::int as s5
from public.race_ratings
group by season, round;

-- Seguridad: el navegador nunca habla con Supabase. La web lee y escribe desde su servidor con la
-- service role key (que ignora RLS); las claves públicas no tienen ningún acceso.
alter table public.race_ratings enable row level security;
revoke all on public.race_ratings from anon, authenticated;
revoke all on public.race_rating_summary from anon, authenticated;
