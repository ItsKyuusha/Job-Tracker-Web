-- Migration: 0003_create_applications
-- Deskripsi: Tabel status lamaran pengguna terhadap lowongan

-- ─── Enum type ─────────────────────────────────────────────────────────────────

create type public.application_status as enum (
  'saved',
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn'
);

-- ─── Tabel applications ────────────────────────────────────────────────────────

create table public.applications (
  id          uuid                     not null default gen_random_uuid(),
  job_id      uuid                     not null references public.jobs(id) on delete cascade,
  user_id     uuid                     not null references auth.users(id) on delete cascade,
  status      public.application_status not null default 'saved',
  applied_at  timestamptz,
  deadline_at timestamptz,
  notes       text,
  created_at  timestamptz              not null default now(),
  updated_at  timestamptz              not null default now(),

  constraint applications_pkey primary key (id),
  -- Satu pengguna hanya bisa punya satu lamaran per lowongan
  constraint applications_job_user_unique unique (job_id, user_id)
);

comment on table public.applications is 'Status lamaran pengguna untuk setiap lowongan';
comment on column public.applications.status is 'Status proses lamaran (terpisah dari status publikasi lowongan)';
comment on column public.applications.deadline_at is 'Deadline personal pengguna, bisa berbeda dari jobs.deadline_at';

-- ─── Index ─────────────────────────────────────────────────────────────────────

create index applications_user_id_idx on public.applications (user_id);
create index applications_job_id_idx on public.applications (job_id);
create index applications_status_idx on public.applications (status);
create index applications_updated_at_idx on public.applications (updated_at desc);
create index applications_deadline_at_idx on public.applications (deadline_at)
  where deadline_at is not null;

-- ─── Trigger: updated_at ──────────────────────────────────────────────────────

create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.handle_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table public.applications enable row level security;

create policy "applications: select own" on public.applications
  for select using (auth.uid() = user_id);

create policy "applications: insert own" on public.applications
  for insert with check (auth.uid() = user_id);

create policy "applications: update own" on public.applications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "applications: delete own" on public.applications
  for delete using (auth.uid() = user_id);
