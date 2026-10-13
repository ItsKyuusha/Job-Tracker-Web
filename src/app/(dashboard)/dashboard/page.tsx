import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { UpcomingDeadlines } from "@/features/dashboard/components/upcoming-deadlines";
import { ConversionFunnel } from "@/features/dashboard/components/conversion-funnel";
import type { ApplicationStatus } from "@/types/database";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — CareerSync",
};

type ApplicationRow = {
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  deadline_at: string | null;
  jobs: { id?: string; title: string; company_name: string } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const userName = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Sobat";

  // Ambil stats dari database
  const { data: rawApplications } = await supabase
    .from("applications")
    .select("status, created_at, updated_at, deadline_at, jobs(id, title, company_name)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const applications = (rawApplications ?? []) as unknown as ApplicationRow[];

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    saved: applications.filter((a) => a.status === "saved").length,
  };

  const recentActivity = applications.slice(0, 5);

  const upcoming = applications
    .filter((a) => a.deadline_at && new Date(a.deadline_at) > new Date())
    .sort((a, b) => new Date(a.deadline_at!).getTime() - new Date(b.deadline_at!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-linear-to-r from-zinc-900 to-zinc-950 text-white p-6 sm:p-7 shadow-xs">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-full bg-linear-to-l from-violet-600/20 via-blue-600/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-medium backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Career Overview</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Semangat berburu peluang, {userName}! 👋
            </h1>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
              Saat ini ada <strong>{stats.applied + stats.interview} lamaran aktif</strong> yang sedang berjalan.
              {stats.interview > 0 ? ` Termasuk ${stats.interview} proses interview!` : " Terus kirimkan aplikasi terbaikmu."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button asChild size="sm" className="bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold h-9 shadow-xs">
              <Link href="/jobs/new">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Tambah Lowongan
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 text-white text-xs h-9">
              <Link href="/jobs">
                Lihat Alur Kanban
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Conversion Pipeline Funnel */}
      <ConversionFunnel stats={stats} />

      {/* Two-Column Activity & Upcoming Deadlines */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={recentActivity} />
        <UpcomingDeadlines deadlines={upcoming} />
      </div>
    </div>
  );
}
