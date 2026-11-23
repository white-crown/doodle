-- Doodle Wall schema. Lives inside the card-scanner Supabase project,
-- every object is prefixed "doodle_" so it never touches the card-scanner tables.
-- Run once in the SQL Editor. Safe to re-run.

-- Drawings ---------------------------------------------------------------
create table if not exists public.doodle_drawings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  event       text not null default 'christmas' check (char_length(event) <= 40),
  name        text check (char_length(name) <= 40),
  shape       text not null check (char_length(shape) <= 30),
  image_path  text not null check (char_length(image_path) <= 200),
  hidden      boolean not null default false
);
create index if not exists doodle_drawings_event_idx on public.doodle_drawings (event, created_at desc);

alter table public.doodle_drawings enable row level security;

drop policy if exists "doodle read visible" on public.doodle_drawings;
create policy "doodle read visible" on public.doodle_drawings
  for select to anon, authenticated using (hidden = false);

drop policy if exists "doodle add" on public.doodle_drawings;
create policy "doodle add" on public.doodle_drawings
  for insert to anon, authenticated with check (hidden = false);
-- No update/delete policies: guests cannot change or remove anything.
-- The operator hides drawings through the functions below.

-- Operator code ----------------------------------------------------------
-- RLS on, no policies: the API cannot read this table at all.
create table if not exists public.doodle_settings (
  id             int primary key default 1 check (id = 1),
  operator_code  text not null
);
alter table public.doodle_settings enable row level security;
insert into public.doodle_settings (operator_code)
values (encode(extensions.gen_random_bytes(5), 'hex'))
on conflict (id) do nothing;

create or replace function public.doodle_check(p_code text) returns boolean
language sql security definer set search_path = public as $$
  select exists (select 1 from doodle_settings where operator_code = p_code);
$$;

create or replace function public.doodle_hide(p_id uuid, p_code text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not doodle_check(p_code) then return false; end if;
  update doodle_drawings set hidden = true where id = p_id;
  return true;
end $$;

create or replace function public.doodle_clear(p_event text, p_code text) returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if not doodle_check(p_code) then return -1; end if;
  update doodle_drawings set hidden = true where event = p_event and hidden = false;
  get diagnostics n = row_count;
  return n;
end $$;

revoke all on function public.doodle_check(text) from public;
revoke all on function public.doodle_hide(uuid, text) from public;
revoke all on function public.doodle_clear(text, text) from public;
grant execute on function public.doodle_check(text) to anon, authenticated;
grant execute on function public.doodle_hide(uuid, text) to anon, authenticated;
grant execute on function public.doodle_clear(text, text) to anon, authenticated;

-- Realtime: the display listens for new rows ------------------------------
do $$ begin
  alter publication supabase_realtime add table public.doodle_drawings;
exception when duplicate_object then null; end $$;

-- Storage: public bucket, PNG only, 1 MB max ------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('doodle-wall', 'doodle-wall', true, 1048576, array['image/png'])
on conflict (id) do update set public = true, file_size_limit = 1048576, allowed_mime_types = array['image/png'];

drop policy if exists "doodle upload" on storage.objects;
create policy "doodle upload" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'doodle-wall');

-- v2: theme per wall, picked by the operator ---------------------------------
create table if not exists public.doodle_events (
  event       text primary key check (char_length(event) <= 40),
  theme       text not null default 'christmas' check (theme in ('christmas', 'qatar', 'newyear')),
  title       text check (char_length(title) <= 80),
  tagline     text check (char_length(tagline) <= 140),
  updated_at  timestamptz not null default now()
);
alter table public.doodle_events enable row level security;
drop policy if exists "doodle events read" on public.doodle_events;
create policy "doodle events read" on public.doodle_events
  for select to anon, authenticated using (true);
insert into public.doodle_events (event, theme) values ('main', 'christmas') on conflict (event) do nothing;

create or replace function public.doodle_set_event(p_event text, p_theme text, p_title text, p_tagline text, p_code text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not doodle_check(p_code) then return false; end if;
  insert into doodle_events (event, theme, title, tagline, updated_at)
  values (p_event, p_theme, nullif(trim(p_title), ''), nullif(trim(p_tagline), ''), now())
  on conflict (event) do update set theme = excluded.theme, title = excluded.title,
    tagline = excluded.tagline, updated_at = now();
  return true;
end $$;
revoke all on function public.doodle_set_event(text, text, text, text, text) from public;
grant execute on function public.doodle_set_event(text, text, text, text, text) to anon, authenticated;

do $$ begin
  alter publication supabase_realtime add table public.doodle_events;
exception when duplicate_object then null; end $$;

-- v3: operator can change the code from operator.html ------------------------
create or replace function public.doodle_set_code(p_code text, p_new text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not doodle_check(p_code) then return false; end if;
  if p_new is null or char_length(p_new) < 6 or char_length(p_new) > 64 then return false; end if;
  update doodle_settings set operator_code = p_new where id = 1;
  return true;
end $$;
revoke all on function public.doodle_set_code(text, text) from public;
grant execute on function public.doodle_set_code(text, text) to anon, authenticated;
