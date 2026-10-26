-- ─── Magang Hub Listings ──────────────────────────────────────────────────────
-- Tabel riset lowongan MagangHub: wadah informasi tanpa tracking status.
-- Setiap baris dimiliki oleh satu user (RLS enforced).

CREATE TABLE IF NOT EXISTS maganghub_listings (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core fields dari spreadsheet lama
  title          text NOT NULL,                     -- Posisi lowongan
  company_name   text NOT NULL,                     -- Perusahaan
  location       text,                              -- Lokasi
  allowance      numeric(15, 2),                    -- Uang saku (IDR single value)
  work_days      smallint CHECK (work_days >= 1 AND work_days <= 7), -- Hari kerja/minggu
  description    text,                              -- Detail lowongan
  source_url     text,                              -- Link lowongan

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_maganghub_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maganghub_listings_updated_at
  BEFORE UPDATE ON maganghub_listings
  FOR EACH ROW EXECUTE FUNCTION update_maganghub_updated_at();

-- Full-text search index
CREATE INDEX maganghub_listings_search_idx
  ON maganghub_listings USING gin(
    to_tsvector('indonesian', coalesce(title, '') || ' ' || coalesce(company_name, ''))
  );

-- Index for common query patterns
CREATE INDEX maganghub_listings_user_id_idx ON maganghub_listings(user_id);
CREATE INDEX maganghub_listings_created_at_idx ON maganghub_listings(created_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE maganghub_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own maganghub listings"
  ON maganghub_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maganghub listings"
  ON maganghub_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maganghub listings"
  ON maganghub_listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maganghub listings"
  ON maganghub_listings FOR DELETE
  USING (auth.uid() = user_id);
