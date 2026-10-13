import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { UpcomingDeadlines } from "@/features/dashboard/components/upcoming-deadlines";
import type { ApplicationStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Dashboard — Job Tracker",
};

type ApplicationRow = {
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  deadline_at: string | null;
  jobs: { title: string; company_name: string } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ambil stats dari database
  const { data: rawApplications } = await supabase
    .from("applications")
    .select("status, created_at, updated_at, deadline_at, jobs(title, company_name)")
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ringkasan proses lamaran Anda
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={recentActivity} />
        <UpcomingDeadlines deadlines={upcoming} />
      </div>
    </div>
  );
}
