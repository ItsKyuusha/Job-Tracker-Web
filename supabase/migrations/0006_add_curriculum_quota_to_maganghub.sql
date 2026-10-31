-- ─── Add curriculum & quota fields to maganghub_listings ──────────────────────
-- Menambahkan field kurikulum yang dipelajari dan kuota/pesaing
-- untuk mendukung riset yang lebih detail di MagangHub.

ALTER TABLE maganghub_listings
  ADD COLUMN IF NOT EXISTS curriculum      text,           -- Kurikulum/skill yang dipelajari
  ADD COLUMN IF NOT EXISTS quota           smallint CHECK (quota >= 1),  -- Jumlah kuota lowongan
  ADD COLUMN IF NOT EXISTS total_applicants integer CHECK (total_applicants >= 0); -- Total pelamar saat ini
