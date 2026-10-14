/**
 * CareerSync — Demo Account Seeder
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengisi data lowongan & lamaran untuk akun demo@careersync.id
 *
 * Cara pakai:
 *   1. Pastikan SUPABASE_SERVICE_ROLE_KEY sudah diisi di .env.local
 *   2. Jalankan: npx tsx scripts/seed-demo.ts
 *
 * Script ini aman dijalankan berulang kali — data lama akan dihapus
 * terlebih dahulu sebelum data baru dimasukkan (idempoten).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// ─── Load env ────────────────────────────────────────────────────────────────
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_EMAIL = "demo@careersync.id";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(`
❌  Environment variables tidak lengkap.

Tambahkan baris berikut ke file .env.local:
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

Dapatkan service role key dari:
  Supabase Dashboard → Project Settings → API → service_role
`);
  process.exit(1);
}

// Pakai service role → bypass RLS sepenuhnya
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Type helpers ─────────────────────────────────────────────────────────────
type EmploymentType = "full_time" | "part_time" | "contract" | "freelance" | "internship";
type WorkplaceType = "onsite" | "remote" | "hybrid";
type SourceName = "manual" | "linkedin" | "jobstreet" | "glints" | "indeed" | "other";
type ApplicationStatus = "saved" | "applied" | "assessment" | "interview" | "offer" | "rejected" | "withdrawn";

interface SeedJob {
  title: string;
  company_name: string;
  description: string;
  location: string;
  employment_type: EmploymentType;
  workplace_type: WorkplaceType;
  salary_min: number;
  salary_max: number;
  currency: string;
  source_name: SourceName;
  source_url: string | null;
  posted_at: string | null;
  deadline_at: string | null;
  is_active: boolean;
  // Status aplikasi & tanggal apply (dipakai untuk update tabel applications)
  _status: ApplicationStatus;
  _applied_at: string | null;
  _notes: string | null;
}

// ─── Data Seed ────────────────────────────────────────────────────────────────
// Tanggal relatif terhadap hari ini supaya selalu relevan
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function daysAgo(n: number): string {
  return daysFromNow(-n);
}

const SEED_JOBS: SeedJob[] = [
  // ── 1. Offer ─────────────────────────────────────────────────────────────
  {
    title: "Senior Frontend Engineer",
    company_name: "GoTo Financial",
    description:
      "Bergabung dengan tim PayLater & GoPay untuk membangun antarmuka pembayaran yang digunakan jutaan pengguna. Stack: React 18, TypeScript, GraphQL, Turborepo.",
    location: "Jakarta Selatan, Indonesia",
    employment_type: "full_time",
    workplace_type: "hybrid",
    salary_min: 28_000_000,
    salary_max: 38_000_000,
    currency: "IDR",
    source_name: "linkedin",
    source_url: "https://linkedin.com/jobs/view/goto-financial-senior-fe",
    posted_at: daysAgo(30),
    deadline_at: daysFromNow(5),
    is_active: true,
    _status: "offer",
    _applied_at: daysAgo(25),
    _notes:
      "Offering letter diterima. Review kontrak & benefit BPJS. Konfirmasi ke recruiter paling lambat " +
      new Date(Date.now() + 5 * 86400_000).toLocaleDateString("id-ID", { day: "numeric", month: "long" }) +
      ".",
  },

  // ── 2. Interview ─────────────────────────────────────────────────────────
  {
    title: "Fullstack Engineer (React & Go)",
    company_name: "Traveloka",
    description:
      "Tim Platform Engineering Traveloka mencari engineer yang kuat di kedua sisi. Backend: Go + gRPC. Frontend: React + Next.js. Unit test wajib, CI/CD GitOps.",
    location: "Jakarta Pusat, Indonesia",
    employment_type: "full_time",
    workplace_type: "hybrid",
    salary_min: 22_000_000,
    salary_max: 30_000_000,
    currency: "IDR",
    source_name: "linkedin",
    source_url: "https://linkedin.com/jobs/view/traveloka-fullstack",
    posted_at: daysAgo(20),
    deadline_at: daysFromNow(10),
    is_active: true,
    _status: "interview",
    _applied_at: daysAgo(15),
    _notes:
      "Tahap User Interview bersama VP Engineering & Staff Engineer. Siapkan sistem desain dan portfolio proyek open-source.",
  },

  // ── 3. Interview ─────────────────────────────────────────────────────────
  {
    title: "Frontend Engineer — Design System",
    company_name: "Tokopedia",
    description:
      "Bangun dan pelihara Tokopedia Coral Design System yang dipakai ratusan engineer internal. Fokus aksesibilitas (a11y), Storybook, CSS-in-JS, dan performance.",
    location: "Cilincing, Jakarta Utara, Indonesia",
    employment_type: "full_time",
    workplace_type: "onsite",
    salary_min: 20_000_000,
    salary_max: 27_000_000,
    currency: "IDR",
    source_name: "glints",
    source_url: "https://glints.com/id/opportunities/tokopedia-design-system",
    posted_at: daysAgo(18),
    deadline_at: daysFromNow(14),
    is_active: true,
    _status: "interview",
    _applied_at: daysAgo(12),
    _notes:
      "Technical Interview tahap 2 — sistem desain & live coding. Fokus aksesibilitas dan component API design.",
  },

  // ── 4. Assessment ────────────────────────────────────────────────────────
  {
    title: "Software Engineer — Payments",
    company_name: "Xendit",
    description:
      "Kembangkan infrastruktur pembayaran skala regional (ID, PH, MY, VN). Stack: Node.js, TypeScript, PostgreSQL, Kafka. Produk: VA, QRIS, PayLater.",
    location: "Jakarta Selatan, Indonesia",
    employment_type: "full_time",
    workplace_type: "remote",
    salary_min: 25_000_000,
    salary_max: 35_000_000,
    currency: "IDR",
    source_name: "linkedin",
    source_url: "https://linkedin.com/jobs/view/xendit-payments-engineer",
    posted_at: daysAgo(14),
    deadline_at: daysFromNow(7),
    is_active: true,
    _status: "assessment",
    _applied_at: daysAgo(10),
    _notes:
      "Take-home assessment: membangun payment webhook handler dengan retry exponential backoff. Deadline pengumpulan " +
      new Date(Date.now() + 7 * 86400_000).toLocaleDateString("id-ID", { day: "numeric", month: "long" }) +
      ".",
  },

  // ── 5. Applied ───────────────────────────────────────────────────────────
  {
    title: "React Native Engineer",
    company_name: "Grab",
    description:
      "Tim Driver & Merchant App Grab Indonesia sedang ekspansi. React Native + TypeScript, Redux Toolkit, integrasi Maps SDK & Push Notif.",
    location: "Jakarta Selatan, Indonesia",
    employment_type: "full_time",
    workplace_type: "hybrid",
    salary_min: 23_000_000,
    salary_max: 32_000_000,
    currency: "IDR",
    source_name: "jobstreet",
    source_url: "https://jobstreet.co.id/en/job/grab-react-native",
    posted_at: daysAgo(10),
    deadline_at: daysFromNow(20),
    is_active: true,
    _status: "applied",
    _applied_at: daysAgo(7),
    _notes: "CV & portofolio sudah dikirim via portal Grab Career. Menunggu jadwal HR screening.",
  },

  // ── 6. Applied ───────────────────────────────────────────────────────────
  {
    title: "Backend Engineer — Data Platform",
    company_name: "Tiket.com",
    description:
      "Kembangkan data pipeline dan event-driven microservice untuk platform tiket perjalanan terbesar di Indonesia. Go, Kafka, ClickHouse, Kubernetes.",
    location: "Menteng, Jakarta Pusat, Indonesia",
    employment_type: "full_time",
    workplace_type: "hybrid",
    salary_min: 18_000_000,
    salary_max: 26_000_000,
    currency: "IDR",
    source_name: "glints",
    source_url: "https://glints.com/id/opportunities/tiket-backend-data",
    posted_at: daysAgo(8),
    deadline_at: daysFromNow(22),
    is_active: true,
    _status: "applied",
    _applied_at: daysAgo(5),
    _notes: "Dilamar lewat Glints. Portfolio project data pipeline di-attach. Follow-up minggu depan jika belum ada respons.",
  },

  // ── 7. Saved / Wishlist ──────────────────────────────────────────────────
  {
    title: "Platform Engineer — Infrastructure",
    company_name: "Shopee Indonesia",
    description:
      "Kelola dan kembangkan infrastruktur cloud-native Shopee skala besar. Kubernetes, Terraform, Prometheus, ArgoCD, multi-cloud AWS & GCP.",
    location: "Jakarta Selatan, Indonesia",
    employment_type: "full_time",
    workplace_type: "onsite",
    salary_min: 30_000_000,
    salary_max: 45_000_000,
    currency: "IDR",
    source_name: "linkedin",
    source_url: "https://linkedin.com/jobs/view/shopee-platform-engineer",
    posted_at: daysAgo(5),
    deadline_at: daysFromNow(30),
    is_active: true,
    _status: "saved",
    _applied_at: null,
    _notes:
      "Interessting stack. Review dulu persyaratan Kubernetes CKA. Siapkan CV versi infrastructure-focused sebelum apply.",
  },

  // ── 8. Saved / Wishlist ──────────────────────────────────────────────────
  {
    title: "TypeScript Engineer — Core Product",
    company_name: "Kredivo",
    description:
      "Bangun engine kredit buy-now-pay-later generasi berikutnya. Node.js, TypeScript, NestJS, PostgreSQL, event sourcing pattern.",
    location: "Jakarta Selatan, Indonesia",
    employment_type: "full_time",
    workplace_type: "remote",
    salary_min: 20_000_000,
    salary_max: 30_000_000,
    currency: "IDR",
    source_name: "indeed",
    source_url: "https://id.indeed.com/viewjob?jk=kredivo-ts-engineer",
    posted_at: daysAgo(3),
    deadline_at: daysFromNow(28),
    is_active: true,
    _status: "saved",
    _applied_at: null,
    _notes: "Remote-friendly. Sesuai tech stack. Jadwalkan untuk lamar pekan ini.",
  },

  // ── 9. Rejected ──────────────────────────────────────────────────────────
  {
    title: "Software Engineer II",
    company_name: "Gojek",
    description:
      "Tim GoFood Engineering — microservice untuk fitur merchant analytics dan rekomendasi menu berbasis ML. Java, Kotlin, Spring Boot.",
    location: "Jakarta Pusat, Indonesia",
    employment_type: "full_time",
    workplace_type: "hybrid",
    salary_min: 22_000_000,
    salary_max: 30_000_000,
    currency: "IDR",
    source_name: "linkedin",
    source_url: "https://linkedin.com/jobs/view/gojek-swe-ii",
    posted_at: daysAgo(45),
    deadline_at: daysAgo(5),
    is_active: false,
    _status: "rejected",
    _applied_at: daysAgo(40),
    _notes:
      "Feedback: kurang pengalaman di Java/Kotlin enterprise scale. Perlu perkuat skill backend JVM. Re-apply di cycle berikutnya.",
  },

  // ── 10. Withdrawn ────────────────────────────────────────────────────────
  {
    title: "Frontend Developer",
    company_name: "OVO",
    description:
      "Pengembangan aplikasi dompet digital OVO: React Native + web dashboard React. Fokus performa & animasi UI.",
    location: "Jakarta Pusat, Indonesia",
    employment_type: "contract",
    workplace_type: "onsite",
    salary_min: 15_000_000,
    salary_max: 20_000_000,
    currency: "IDR",
    source_name: "manual",
    source_url: null,
    posted_at: daysAgo(35),
    deadline_at: daysAgo(10),
    is_active: false,
    _status: "withdrawn",
    _applied_at: daysAgo(30),
    _notes:
      "Mundur karena paket kontrak tidak sesuai ekspektasi dan skema kerja onsite penuh tidak fleksibel.",
  },
];

// ─── Main Seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 CareerSync Demo Seeder");
  console.log("━".repeat(60));

  // 1. Cari user demo di auth.users
  console.log(`\n🔍 Mencari akun: ${DEMO_EMAIL} ...`);
  const { data: users, error: userErr } = await supabase.auth.admin.listUsers();

  if (userErr) {
    console.error("❌ Gagal mengambil daftar users:", userErr.message);
    process.exit(1);
  }

  const demoUser = users.users.find((u) => u.email === DEMO_EMAIL);
  if (!demoUser) {
    console.error(`
❌  Akun ${DEMO_EMAIL} tidak ditemukan.

Pastikan akun demo sudah didaftarkan terlebih dahulu melalui halaman /register
atau buat manual di Supabase Dashboard → Authentication → Users.
`);
    process.exit(1);
  }

  const userId = demoUser.id;
  console.log(`✅ User ditemukan: ${demoUser.email} (${userId})`);

  // 2. Hapus data lama supaya idempoten
  console.log("\n🗑️  Menghapus data demo lama...");
  const { error: delErr } = await supabase
    .from("jobs")
    .delete()
    .eq("user_id", userId);

  if (delErr) {
    console.error("❌ Gagal menghapus data lama:", delErr.message);
    process.exit(1);
  }
  console.log("   → Data lama berhasil dihapus (jobs + applications CASCADE)");

  // 3. Insert jobs satu per satu supaya bisa capture id dan update applications
  console.log(`\n📋 Menyisipkan ${SEED_JOBS.length} lowongan...`);

  let successCount = 0;
  let failCount = 0;

  for (const [i, seed] of SEED_JOBS.entries()) {
    const { _status, _applied_at, _notes, ...jobPayload } = seed;

    // Insert job
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .insert({ ...jobPayload, user_id: userId })
      .select("id")
      .single();

    if (jobErr || !job) {
      console.error(`   ❌ [${i + 1}] ${seed.company_name} — ${seed.title}: ${jobErr?.message}`);
      failCount++;
      continue;
    }

    // Update application (auto-created oleh createJobAction / trigger via DB)
    // Karena insert langsung ke jobs tanpa action, kita perlu insert applications manual
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", job.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingApp) {
      // Update existing
      await supabase
        .from("applications")
        .update({
          status: _status,
          applied_at: _applied_at,
          notes: _notes,
        })
        .eq("id", existingApp.id);
    } else {
      // Insert baru
      await supabase.from("applications").insert({
        job_id: job.id,
        user_id: userId,
        status: _status,
        applied_at: _applied_at,
        notes: _notes,
      });
    }

    const statusEmoji: Record<ApplicationStatus, string> = {
      saved: "🔖",
      applied: "📤",
      assessment: "📝",
      interview: "🎙️",
      offer: "🎉",
      rejected: "❌",
      withdrawn: "↩️",
    };

    console.log(
      `   ${statusEmoji[_status]} [${i + 1}/${SEED_JOBS.length}] ${seed.company_name.padEnd(20)} — ${seed.title.padEnd(38)} [${_status}]`
    );
    successCount++;
  }

  // 4. Summary
  console.log("\n" + "━".repeat(60));
  console.log(`✅ Selesai! ${successCount} lowongan berhasil diseed.`);
  if (failCount > 0) {
    console.log(`⚠️  ${failCount} lowongan gagal diinsert (lihat error di atas).`);
  }

  console.log(`
📊 Ringkasan Status Alur Lamaran:
   🎉 Offer       : 1  (GoTo Financial)
   🎙️  Interview   : 2  (Traveloka, Tokopedia)
   📝 Assessment  : 1  (Xendit)
   📤 Applied     : 2  (Grab, Tiket.com)
   🔖 Saved       : 2  (Shopee, Kredivo)
   ❌ Rejected    : 1  (Gojek)
   ↩️  Withdrawn   : 1  (OVO)
   ──────────────────
   Total          : 10 lowongan

🔗 Akun demo:
   Email    : ${DEMO_EMAIL}
   Password : DemoSecure123!
`);
}

main().catch((err) => {
  console.error("💥 Unexpected error:", err);
  process.exit(1);
});
