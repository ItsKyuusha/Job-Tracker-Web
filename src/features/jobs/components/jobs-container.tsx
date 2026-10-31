"use client";

import { useState } from "react";
import type { JobListItem } from "@/features/jobs/types";
import { JobFilters } from "./job-filters";
import { JobCard } from "./job-card";
import { JobTableRow } from "./job-table-row";
import { KanbanBoard } from "./kanban-board";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { BriefcaseIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type JobsContainerProps = {
  jobs: JobListItem[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasSearchOrFilter: boolean;
};

export function JobsContainer({
  jobs,
  totalItems,
  currentPage,
  pageSize,
  hasSearchOrFilter,
}: JobsContainerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "kanban" | "table">("grid");

  const pagedJobs = jobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-5">
      <JobFilters viewMode={viewMode} onViewChange={setViewMode} />

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/80 rounded-2xl bg-card/40">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
            <BriefcaseIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-1 text-foreground">Tidak Ada Lowongan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            {hasSearchOrFilter
              ? "Tidak ada data yang cocok dengan kriteria pencarian atau filter Anda."
              : "Anda belum menambahkan lowongan apa pun ke tracker."}
          </p>
          {!hasSearchOrFilter && (
            <Button asChild size="sm" className="h-8 text-xs font-semibold">
              <Link href="/jobs/new">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Lowongan Pertama
              </Link>
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pagedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <PaginationBar
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </>
      ) : viewMode === "table" ? (
        <>
          <div className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Posisi / Perusahaan
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Lokasi
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Tempat Kerja
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Tipe
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Deadline
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Dibuat
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedJobs.map((job) => (
                    <JobTableRow key={job.id} job={job} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <PaginationBar
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </>
      ) : (
        // Kanban: tampilkan semua kartu, tidak terpotong slice halaman grid
        <KanbanBoard jobs={jobs} />
      )}
    </div>
  );
}
