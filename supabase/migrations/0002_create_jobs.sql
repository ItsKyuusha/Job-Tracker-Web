-- Migration: 0002_create_jobs
-- Deskripsi: Tabel informasi lowongan pekerjaan
-- Catatan: user_id nullable untuk mengantisipasi data dari scraper eksternal

-- ─── Enum types ────────────────────────────────────────────────────────────────

create type public.employment_type as enum (
  'full_time',
  'part_time',
  'contract',
  'freelance',
  'internship'
);

create type public.workplace_type as enum (
  'onsite',
  'remote',
  'hybrid'
);

create type public.source_name as enum (
  'manual',
  'linkedin',
  'jobstreet',
  'glints',
  'indeed',
  'other'
);

-- ─── Tabel jobs ────────────────────────────────────────────────────────────────

create table public.jobs (
  id              uuid            not null default gen_random_uuid(),
  user_id         uuid            references auth.users(id) on delete set null,
  title           text            not null,
  company_name    text            not null,
  description     text,
  location        text,
  employment_type public.employment_type,
  workplace_type  public.workplace_type,
  salary_min      numeric(15, 2),
  salary_max      numeric(15, 2),
  currency        text            not null default 'IDR',
  source_name     public.source_name not null default 'manual',
  source_url      text,
  posted_at       timestamptz,
  deadline_at     timestamptz,
  is_active       boolean         not null default true,
  created_at      timestamptz     not null default now(),
  updated_at      timestamptz     not null default now(),

  constraint jobs_pkey primary key (id),
  constraint jobs_salary_range_check check (
    salary_min is null or salary_max is null or salary_min <= salary_max
  )
);

comment on table public.jobs is 'Informasi lowongan pekerjaan (dari input manual atau scraper)';
comment on column public.jobs.user_id is 'Nullable: null jika dari scraper, diisi jika input manual';
comment on column public.jobs.source_name is 'Asal data lowongan: manual (user input) atau nama platform scraper';
comment on column public.jobs.is_active is 'False jika lowongan diarsipkan/tidak aktif';

-- ─── Index ─────────────────────────────────────────────────────────────────────

create index jobs_user_id_idx on public.jobs (user_id);
create index jobs_company_name_idx on public.jobs (company_name);
create index jobs_created_at_idx on public.jobs (created_at desc);
create index jobs_deadline_at_idx on public.jobs (deadline_at) where deadline_at is not null;

-- Full-text search
create index jobs_fts_idx on public.jobs
  using gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(company_name, '')));

-- ─── Trigger: updated_at ──────────────────────────────────────────────────────

create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.handle_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table public.jobs enable row level security;

-- Pengguna bisa melihat lowongan miliknya sendiri
create policy "jobs: select own" on public.jobs
  for select using (auth.uid() = user_id);

-- Pengguna bisa membuat lowongan (user_id otomatis diisi via insert)
create policy "jobs: insert own" on public.jobs
  for insert with check (auth.uid() = user_id);

-- Pengguna hanya bisa update lowongan miliknya
create policy "jobs: update own" on public.jobs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Pengguna hanya bisa hapus lowongan miliknya
create policy "jobs: delete own" on public.jobs
  for delete using (auth.uid() = user_id);
