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
import { Plus, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

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

  const [{ data: profile }, { data: rawApplications }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("applications")
      .select("status, created_at, updated_at, deadline_at, jobs(id, title, company_name)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  const userName = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Sobat";

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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Hero Greeting Banner dengan Deep Vibrant Gradient */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/20">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-12 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Career Acceleration Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Halo, {userName}! Siap melangkah lebih jauh? 🚀
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Kamu sedang mengelola <strong className="text-white font-semibold">{stats.applied + stats.interview} proses aktif</strong>.
              {stats.interview > 0 ? (
                <span className="text-amber-300 font-semibold"> Mantap! Ada {stats.interview} tahap interview menantimu!</span>
              ) : (
                " Terus aktif kirimkan berkas lamaran ke perusahaan target."
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              asChild
              size="sm"
              className="bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs h-10 px-4 shadow-sm border-0"
            >
              <Link href="/jobs/new">
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Lowongan
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs h-10 px-4 backdrop-blur-xs"
            >
              <Link href="/jobs">
                Lihat Board Kanban
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
