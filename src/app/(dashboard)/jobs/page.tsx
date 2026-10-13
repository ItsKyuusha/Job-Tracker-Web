import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/features/jobs/components/job-card";
import { JobFilters } from "@/features/jobs/components/job-filters";
import type { JobListItem } from "@/features/jobs/types";
import type { ApplicationStatus } from "@/types/database";
import { Plus, BriefcaseIcon } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Lowongan — Job Tracker",
};

type SearchParams = Promise<{
  search?: string;
  status?: string;
  employment_type?: string;
  workplace_type?: string;
  sort?: string;
}>;

function JobListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}

async function JobList({ searchParams }: { searchParams: Awaited<SearchParams> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Build query
  let query = supabase
    .from("jobs")
    .select(
      "id, title, company_name, location, employment_type, workplace_type, deadline_at, is_active, created_at, source_name, applications(status, applied_at)"
    )
    .eq("user_id", user.id);

  // Filter by search
  if (searchParams.search) {
    query = query.or(
      `title.ilike.%${searchParams.search}%,company_name.ilike.%${searchParams.search}%`
    );
  }

  // Filter by employment_type
  if (searchParams.employment_type && searchParams.employment_type !== "all") {
    query = query.eq("employment_type", searchParams.employment_type);
  }

  // Filter by workplace_type
  if (searchParams.workplace_type && searchParams.workplace_type !== "all") {
    query = query.eq("workplace_type", searchParams.workplace_type);
  }

  // Sort
  const sortField = searchParams.sort === "deadline_at" ? "deadline_at" : "created_at";
  query = query.order(sortField, { ascending: false });

  const { data: rawJobs } = await query;
  let jobs = (rawJobs ?? []) as unknown as JobListItem[];

  // Filter by status (client-side karena ada join)
  if (searchParams.status && searchParams.status !== "all") {
    jobs = jobs.filter((j) =>
      j.applications.some((a) => a.status === (searchParams.status as ApplicationStatus))
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <BriefcaseIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-1">Belum ada lowongan</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {searchParams.search || searchParams.status
            ? "Tidak ada lowongan yang sesuai filter."
            : "Mulai dengan menambahkan lowongan pertama Anda."}
        </p>
        {!searchParams.search && !searchParams.status && (
          <Button asChild size="sm">
            <Link href="/jobs/new">
              <Plus className="w-4 h-4 mr-1" />
              Tambah Lowongan
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Lowongan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola semua lowongan yang Anda simpan
          </p>
        </div>
        <Button asChild>
          <Link href="/jobs/new">
            <Plus className="w-4 h-4 mr-1" />
            Tambah
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-10 rounded-lg" />}>
        <JobFilters />
      </Suspense>

      <Suspense fallback={<JobListSkeleton />}>
        <JobList searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
