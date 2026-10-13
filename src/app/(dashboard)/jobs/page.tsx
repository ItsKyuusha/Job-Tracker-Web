import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JobsContainer } from "@/features/jobs/components/jobs-container";
import type { JobListItem } from "@/features/jobs/types";
import type { ApplicationStatus } from "@/types/database";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Lowongan Kerja — CareerSync",
};

type SearchParams = Promise<{
  search?: string;
  status?: string;
  employment_type?: string;
  workplace_type?: string;
  sort?: string;
}>;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let query = supabase
    .from("jobs")
    .select(
      "id, title, company_name, location, employment_type, workplace_type, deadline_at, is_active, created_at, source_name, applications(status, applied_at)"
    )
    .eq("user_id", user.id);

  if (resolvedParams.search) {
    query = query.or(
      `title.ilike.%${resolvedParams.search}%,company_name.ilike.%${resolvedParams.search}%`
    );
  }

  if (resolvedParams.employment_type && resolvedParams.employment_type !== "all") {
    query = query.eq("employment_type", resolvedParams.employment_type);
  }

  if (resolvedParams.workplace_type && resolvedParams.workplace_type !== "all") {
    query = query.eq("workplace_type", resolvedParams.workplace_type);
  }

  query = query.order("created_at", { ascending: false });

  const { data: rawJobs } = await query;
  let jobs = (rawJobs ?? []) as unknown as JobListItem[];

  if (resolvedParams.status && resolvedParams.status !== "all") {
    jobs = jobs.filter((j) =>
      j.applications?.some((a) => a.status === (resolvedParams.status as ApplicationStatus))
    );
  }

  const hasSearchOrFilter = Boolean(
    resolvedParams.search ||
    (resolvedParams.status && resolvedParams.status !== "all") ||
    (resolvedParams.employment_type && resolvedParams.employment_type !== "all") ||
    (resolvedParams.workplace_type && resolvedParams.workplace_type !== "all")
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Daftar Lowongan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola dan pantau semua lowongan kerja yang telah Anda simpan dan lamar.
          </p>
        </div>

        <Button asChild size="sm" className="h-9 text-xs font-semibold gap-1.5 shadow-xs">
          <Link href="/jobs/new">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Lowongan</span>
          </Link>
        </Button>
      </div>

      {/* Jobs Dual-View Container */}
      <JobsContainer jobs={jobs} hasSearchOrFilter={hasSearchOrFilter} />
    </div>
  );
}
