-- Migration: 0004_create_application_events
-- Deskripsi: Riwayat perubahan status lamaran (audit log / history)

create table public.application_events (
  id             uuid                     not null default gen_random_uuid(),
  application_id uuid                     not null references public.applications(id) on delete cascade,
  user_id        uuid                     not null references auth.users(id) on delete cascade,
  from_status    public.application_status,
  to_status      public.application_status not null,
  notes          text,
  created_at     timestamptz              not null default now(),

  constraint application_events_pkey primary key (id)
);

comment on table public.application_events is 'Riwayat perubahan status lamaran — append-only, tidak pernah diupdate';
comment on column public.application_events.from_status is 'Null untuk event pertama (initial status)';

-- ─── Index ─────────────────────────────────────────────────────────────────────

create index application_events_application_id_idx
  on public.application_events (application_id, created_at desc);

create index application_events_user_id_idx
  on public.application_events (user_id);

-- ─── Trigger: auto-create event saat status berubah ──────────────────────────

create or replace function public.handle_application_status_change()
returns trigger as $$
begin
  -- Hanya buat event jika status berubah
  if old.status is distinct from new.status then
    insert into public.application_events (
      application_id,
      user_id,
      from_status,
      to_status
    ) values (
      new.id,
      new.user_id,
      old.status,
      new.status
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger applications_status_change
  after update on public.applications
  for each row execute function public.handle_application_status_change();

-- Trigger untuk initial event saat application pertama dibuat
create or replace function public.handle_application_created()
returns trigger as $$
begin
  insert into public.application_events (
    application_id,
    user_id,
    from_status,
    to_status
  ) values (
    new.id,
    new.user_id,
    null,       -- tidak ada status sebelumnya
    new.status
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger applications_created_event
  after insert on public.applications
  for each row execute function public.handle_application_created();

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table public.application_events enable row level security;

-- Read-only dari sisi user; write dilakukan oleh trigger (security definer)
create policy "application_events: select own" on public.application_events
  for select using (auth.uid() = user_id);

-- User bisa tambah notes manual ke history (tanpa ubah status)
create policy "application_events: insert own" on public.application_events
  for insert with check (auth.uid() = user_id);
