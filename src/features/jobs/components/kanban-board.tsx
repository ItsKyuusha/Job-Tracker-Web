"use client";

import type { JobListItem } from "@/features/jobs/types";
import type { ApplicationStatus } from "@/types/database";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_CONFIG, getCompanyGradient } from "@/lib/utils";
import { KanbanStatusMover } from "./kanban-status-mover";
import Link from "next/link";
import { Plus, MapPin, Monitor } from "lucide-react";
import { WORKPLACE_TYPE_LABELS } from "@/lib/utils";

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
            className="flex flex-col shrink-0 w-72 bg-muted/30 dark:bg-zinc-950/40 rounded-xl p-3 border border-border/60 max-h-[calc(100vh-220px)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                <h4 className="text-xs font-semibold text-foreground">
                  {APPLICATION_STATUS_LABELS[columnStatus]}
                </h4>
                <span className="text-[10px] font-mono font-medium px-1.5 rounded-full bg-muted text-muted-foreground">
                  {columnJobs.length}
                </span>
              </div>
              {columnStatus === "saved" && (
                <Link
                  href="/jobs/new"
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {columnJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border/60 rounded-lg">
                  <p className="text-[11px] text-muted-foreground">Belum ada lamaran</p>
                </div>
              ) : (
                columnJobs.map((job) => {
                  const application = job.applications?.[0];
                  const initial = job.company_name?.charAt(0)?.toUpperCase() || "J";
                  const gradient = getCompanyGradient(job.company_name);

                  return (
                    <div
                      key={job.id}
                      className="bg-card border border-border/80 rounded-lg p-3 space-y-2.5 hover:border-foreground/30 hover:shadow-xs transition-all"
                    >
                      {/* Card top: avatar + title */}
                      <Link href={`/jobs/${job.id}`} className="flex items-start gap-2.5 group">
                        <div
                          className={`w-7 h-7 rounded-md bg-linear-to-br ${gradient} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                        >
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate leading-snug">
                            {job.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {job.company_name}
                          </p>
                        </div>
                      </Link>

                      {/* Metadata tags */}
                      {(job.location || job.workplace_type) && (
                        <div className="flex flex-wrap gap-1">
                          {job.location && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                              <MapPin className="w-2.5 h-2.5" />
                              <span className="truncate max-w-20">{job.location}</span>
                            </span>
                          )}
                          {job.workplace_type && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                              <Monitor className="w-2.5 h-2.5" />
                              {WORKPLACE_TYPE_LABELS[job.workplace_type]}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Status mover — optimistic update */}
                      {application && (
                        <KanbanStatusMover
                          applicationId={application.id as unknown as string}
                          currentStatus={application.status}
                          jobId={job.id}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
