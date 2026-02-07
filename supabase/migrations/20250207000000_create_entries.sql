-- Entries table for overstimmed tracking data.
-- Run this in Supabase Dashboard: SQL Editor → New query → paste → Run.

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null,
  energy_level smallint not null check (energy_level >= 0 and energy_level <= 10),
  stimulation_level smallint not null check (stimulation_level >= 0 and stimulation_level <= 10),
  stimulation_type text not null default 'neutral' check (stimulation_type in ('positive', 'negative', 'neutral')),
  triggers text not null default '',
  feelings text not null default '',
  activities text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- Index for listing by time (dashboard, archive, insights).
create index if not exists entries_timestamp_desc on public.entries (timestamp desc);

-- RLS: allow all for anon so the app works without auth. Tighten with auth later.
alter table public.entries enable row level security;

create policy "Allow all for anon"
  on public.entries
  for all
  to anon
  using (true)
  with check (true);

-- Optional: when you add auth, you can add a user_id column and restrict by auth.uid():
-- alter table public.entries add column if not exists user_id uuid references auth.users(id);
-- create policy "Users can manage own entries" on public.entries for all using (auth.uid() = user_id);
