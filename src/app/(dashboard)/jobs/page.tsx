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

const PAGE_SIZE = 12;

type SearchParams = Promise<{
  search?: string;
  status?: string;
  employment_type?: string;
  workplace_type?: string;
  sort?: string;
  show_archived?: string;
  page?: string;
}>;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const p = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const currentPage = Math.max(1, parseInt(p.page ?? "1", 10));
  const showArchived = p.show_archived === "1";
  const sortBy = p.sort ?? "created_at";

  // ── Build query ────────────────────────────────────────────────────────────
  let query = supabase
    .from("jobs")
    .select(
      "id, title, company_name, location, employment_type, workplace_type, deadline_at, is_active, created_at, source_name, applications(id, status, applied_at)"
    )
    .eq("user_id", user.id);

  // archived filter
  if (!showArchived) {
    query = query.eq("is_active", true);
  }

  // text search
  if (p.search) {
    query = query.or(
      `title.ilike.%${p.search}%,company_name.ilike.%${p.search}%`
    );
  }

  // column filters
  if (p.employment_type && p.employment_type !== "all") {
    query = query.eq("employment_type", p.employment_type);
  }
  if (p.workplace_type && p.workplace_type !== "all") {
    query = query.eq("workplace_type", p.workplace_type);
  }

  // server-side sort (columns that live on jobs table)
  if (sortBy === "created_at" || sortBy === "company_name") {
    query = query.order(sortBy, {
      ascending: sortBy === "company_name",
    });
  } else {
    // applied_at & deadline_at: sort after fetch (see below)
    query = query.order("created_at", { ascending: false });
  }

  const { data: rawJobs } = await query;
  let jobs = (rawJobs ?? []) as unknown as JobListItem[];

  // ── Client-side filters that need JOIN data ────────────────────────────────
  if (p.status && p.status !== "all") {
    jobs = jobs.filter((j) =>
      j.applications?.some((a) => a.status === (p.status as ApplicationStatus))
    );
  }

  // client-side sort for joined columns
  if (sortBy === "applied_at") {
    jobs = jobs.sort((a, b) => {
      const dateA = a.applications?.[0]?.applied_at ?? "";
      const dateB = b.applications?.[0]?.applied_at ?? "";
      return dateB.localeCompare(dateA); // descending (terbaru)
    });
  } else if (sortBy === "deadline_at") {
    jobs = jobs.sort((a, b) => {
      // null deadline goes to end
      if (!a.deadline_at && !b.deadline_at) return 0;
      if (!a.deadline_at) return 1;
      if (!b.deadline_at) return -1;
      return a.deadline_at.localeCompare(b.deadline_at); // ascending (terdekat)
    });
  }

  // ── Pagination (grid view only — kanban gets all) ──────────────────────────
  const totalItems = jobs.length;
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasSearchOrFilter = Boolean(
    p.search ||
    (p.status && p.status !== "all") ||
    (p.employment_type && p.employment_type !== "all") ||
    (p.workplace_type && p.workplace_type !== "all") ||
    showArchived
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
            {totalItems} lowongan ditemukan
            {showArchived ? " (termasuk arsip)" : ""}
          </p>
        </div>
        <Button asChild size="sm" className="h-9 text-xs font-semibold gap-1.5 shadow-xs">
          <Link href="/jobs/new">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Lowongan</span>
          </Link>
        </Button>
      </div>

      {/* Jobs Container — Grid & Kanban view */}
      <JobsContainer
        jobs={paginatedJobs}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        hasSearchOrFilter={hasSearchOrFilter}
      />
    </div>
  );
}
