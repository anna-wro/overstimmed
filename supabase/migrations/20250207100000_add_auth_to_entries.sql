-- Add auth: user_id on entries and RLS so users only see their own data.
-- Run in Supabase Dashboard → SQL Editor.

alter table public.entries
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Drop the permissive anon policy so unauthenticated users cannot access entries.
drop policy if exists "Allow all for anon" on public.entries;

-- Authenticated users can only select/insert/update/delete their own rows.
create policy "Users can read own entries"
  on public.entries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.entries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.entries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.entries for delete
  to authenticated
  using (auth.uid() = user_id);

-- Index for filtering by user (list queries).
create index if not exists entries_user_id_timestamp_desc
  on public.entries (user_id, timestamp desc);
