"use client";

import { useState } from "react";
import type { JobListItem } from "@/features/jobs/types";
import { JobFilters } from "./job-filters";
import { JobCard } from "./job-card";
import { KanbanBoard } from "./kanban-board";
import { BriefcaseIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type JobsContainerProps = {
  jobs: JobListItem[];
  hasSearchOrFilter: boolean;
};

export function JobsContainer({ jobs, hasSearchOrFilter }: JobsContainerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");

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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <KanbanBoard jobs={jobs} />
      )}
    </div>
  );
}
