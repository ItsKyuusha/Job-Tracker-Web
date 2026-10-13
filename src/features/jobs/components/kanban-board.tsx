import type { JobListItem } from "@/features/jobs/types";
import type { ApplicationStatus } from "@/types/database";
import { JobCard } from "./job-card";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_CONFIG } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

type KanbanBoardProps = {
  jobs: JobListItem[];
};

const KANBAN_COLUMNS: ApplicationStatus[] = [
  "saved",
  "applied",
  "assessment",
  "interview",
  "offer",
  "rejected",
];

export function KanbanBoard({ jobs }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none">
      {KANBAN_COLUMNS.map((columnStatus) => {
        const columnJobs = jobs.filter(
          (j) => (j.applications?.[0]?.status ?? "saved") === columnStatus
        );
        const config = APPLICATION_STATUS_CONFIG[columnStatus];

        return (
          <div
            key={columnStatus}
            className="flex flex-col shrink-0 w-72 bg-muted/30 dark:bg-zinc-950/40 rounded-xl p-3 border border-border/60 max-h-[calc(100vh-240px)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                <h4 className="text-xs font-semibold text-foreground">
                  {APPLICATION_STATUS_LABELS[columnStatus]}
                </h4>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                  {columnJobs.length}
                </span>
              </div>

              {columnStatus === "saved" && (
                <Link
                  href="/jobs/new"
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded"
                  title="Tambah Lowongan Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Column Job Items */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-thin">
              {columnJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border/60 rounded-lg">
                  <p className="text-[11px] text-muted-foreground">Belum ada lamaran</p>
                </div>
              ) : (
                columnJobs.map((job) => (
                  <JobCard key={job.id} job={job} compact />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
