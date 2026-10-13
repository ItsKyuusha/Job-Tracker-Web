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

- **Dashboard** — Ringkasan stats, conversion funnel, aktivitas terbaru, dan deadline mendatang
- **Job Management** — Tambah, edit, hapus, dan arsipkan lowongan
- **Application Tracking** — 7 status lamaran dengan riwayat perubahan otomatis
- **Pipeline Stepper** — Visualisasi tahapan seleksi per lowongan
- **Dual View** — Tampilan Grid Cards dan Kanban Board
- **Search & Filter** — Cari by posisi/perusahaan, filter by status/tipe/tempat, sort by berbagai kriteria
- **Profil** — Edit nama dan ganti password
- **Dark / Light Mode** — Toggle tema dengan persistence

## Struktur Database

```
profiles          → Data profil pengguna (relasi 1:1 dengan auth.users)
jobs              → Informasi lowongan pekerjaan
applications      → Status lamaran per user per lowongan
application_events→ Riwayat perubahan status (audit log, append-only)
```

## Setup & Instalasi

### 1. Clone dan install dependencies

```bash
git clone <repo-url>
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

### Roadmap

Project ini dirancang sebagai bagian dari ekosistem **CareerSync** yang terdiri dari:

1. **Job Tracker Web** ← Ini (selesai)
2. **Job Scraper Service** — Express.js service untuk auto-scraping lowongan dari LinkedIn, Glints, JobStreet, dll. (belum dibangun, repo terpisah)

Schema database sudah dirancang agar siap menerima data dari scraper tanpa perubahan struktur (`jobs.source_name`, `jobs.source_url`, `jobs.user_id` nullable).
