# CareerSync — Job Tracker Web

Aplikasi web untuk melacak dan mengelola proses lamaran pekerjaan secara terstruktur. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS v4, dan Supabase.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 — pure utility, tanpa UI library eksternal
- **Database**: Supabase PostgreSQL + Row Level Security
- **Auth**: Supabase Auth (email & password)
- **Package Manager**: npm

## Fitur

- **Dashboard** — Ringkasan 8 metrik status lamaran, conversion funnel pipeline, aktivitas terbaru (clickable), dan deadline mendatang
- **Job Management (Lowongan Saya)** — Tambah, edit, hapus, dan arsipkan lowongan
- **Multi-Layout View** — Pilihan tampilan **Grid Cards**, **Tabel Daftar**, dan **Kanban Board** interaktif
- **Riset MagangHub** — Wadah pembanding dan riset lowongan magang MagangHub dengan field **Kurikulum yang Dipelajari**, **Kuota**, **Total Pelamar**, uang saku, hari kerja, dan layout Grid/Tabel
- **Eksplorasi Loker Live (Scraper)** — Pencarian live dari portal karir resmi (JobStreet, Glints) dan media sosial (Threads, LinkedIn) dengan opsi langsung simpan ke Kanban
- **Application Tracking** — 7 status lamaran (`saved`, `applied`, `assessment`, `interview`, `offer`, `rejected`, `withdrawn`) dengan riwayat perubahan otomatis
- **Pipeline Stepper** — Visualisasi tahapan seleksi interaktif per lowongan
- **Search & Filter** — Pencarian instan (debounced), filter status/tipe/tempat kerja, dan multi-kriteria sorting
- **Profil & Autentikasi** — Email/password dan Google OAuth (PKCE flow), ganti nama, dan reset password
- **Dark / Light Mode** — Toggle tema modern dengan persistence

## Struktur Database

```
profiles            → Data profil pengguna (relasi 1:1 dengan auth.users)
jobs                → Informasi lowongan pekerjaan (manual & hasil import scraper)
applications        → Status lamaran per user per lowongan
application_events  → Riwayat audit log perubahan status & catatan
maganghub_listings  → Data riset lowongan magang (kurikulum, kuota, pelamar, uang saku)
```

## Setup & Instalasi

### 1. Clone dan install dependencies

```bash
git clone https://github.com/ItsKyuusha/Job-Tracker-Web.git
cd job-tracker-web
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Jalankan SQL migrations secara berurutan di **SQL Editor** Supabase:
   - `supabase/migrations/0001_create_profiles.sql`
   - `supabase/migrations/0002_create_jobs.sql`
   - `supabase/migrations/0003_create_applications.sql`
   - `supabase/migrations/0004_create_application_events.sql`
   - `supabase/migrations/0005_create_maganghub_listings.sql`
   - `supabase/migrations/0006_add_curriculum_quota_to_maganghub.sql`
3. Di **Authentication → Providers**, pastikan Email provider aktif

### 3. Konfigurasi environment

Salin file `.env.example` menjadi `.env.local` dan isi dengan credentials Supabase:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Credentials tersedia di: **Supabase Dashboard → Settings → Data API**

### 4. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), lalu daftar akun baru untuk mulai menggunakan.

## Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Struktur Folder

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login & Register pages
│   └── (dashboard)/        # Dashboard, Jobs, Profile pages
├── components/
│   ├── layout/             # Sidebar, Header, MobileNav, ThemeToggle
│   └── ui/                 # Reusable UI components (pure Tailwind)
├── features/
│   ├── auth/               # Auth forms & server actions
│   ├── jobs/               # Job CRUD components & actions
│   ├── applications/       # Application tracking components & actions
│   └── dashboard/          # Dashboard stats & widgets
├── lib/
│   └── supabase/           # Supabase client (browser, server, middleware)
└── types/
    └── database.ts         # TypeScript types untuk semua tabel

supabase/
├── migrations/             # SQL migration files
└── seed.sql                # Sample data (opsional)
```

## Catatan Pengembangan

### Generate Supabase Types (Opsional tapi Direkomendasikan)

Setelah database selesai di-setup, generate types dari schema aktual untuk type safety penuh:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.gen.ts
```

### Arsitektur Ekosistem CareerSync

CareerSync terdiri dari 2 microservice/aplikasi:

1. **Job Tracker Web** (repositori ini) — Antarmuka web utama pelacak karir, kanban board, dan riset MagangHub (Next.js 16 + Supabase).
2. **Job Scraper Service** (`../job-scraper-service`) — Express.js microservice dengan Playwright, Cheerio, dan p-queue untuk multi-source scraping (JobStreet, Glints, Threads, LinkedIn).

Konfigurasi environment scraper di Web App:
```env
NEXT_PUBLIC_SCRAPER_API_URL=https://job-scraper-service-seven.vercel.app
```
