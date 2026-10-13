-- Migration: 0001_create_profiles
-- Deskripsi: Tabel profil pengguna, terhubung dengan auth.users Supabase

create table public.profiles (
  id          uuid        not null references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint profiles_pkey primary key (id)
);

comment on table public.profiles is 'Profil pengguna, relasi 1:1 dengan auth.users';

-- ─── Trigger: updated_at otomatis ─────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ─── Trigger: buat profil otomatis saat user baru daftar ──────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table public.profiles enable row level security;

-- Pengguna hanya bisa melihat dan mengubah profil miliknya sendiri
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
