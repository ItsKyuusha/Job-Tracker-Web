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
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none scrollbar-thin">
      {KANBAN_COLUMNS.map((columnStatus) => {
        const columnJobs = jobs.filter(
          (j) => (j.applications?.[0]?.status ?? "saved") === columnStatus
        );
        const config = APPLICATION_STATUS_CONFIG[columnStatus];

        return (
          <div
            key={columnStatus}
            className="flex flex-col shrink-0 w-80 bg-slate-900/5 dark:bg-slate-900/30 rounded-2xl p-3.5 border border-border/80 max-h-[calc(100vh-220px)] backdrop-blur-xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1 border-b border-border/40 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-xs`} />
                <h4 className="text-xs font-bold text-foreground tracking-tight">
                  {APPLICATION_STATUS_LABELS[columnStatus]}
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                  {columnJobs.length}
                </span>
              </div>
              {columnStatus === "saved" && (
                <Link
                  href="/jobs/new"
                  className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 hover:bg-muted rounded-lg transition-colors"
                  title="Tambah Lowongan Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Cards Column */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
              {columnJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/70 rounded-xl bg-card/20">
                  <p className="text-[11px] text-muted-foreground font-medium">Kosong</p>
                </div>
              ) : (
                columnJobs.map((job) => {
                  const application = job.applications?.[0];
                  const initial = job.company_name?.charAt(0)?.toUpperCase() || "J";
                  const gradient = getCompanyGradient(job.company_name);

                  return (
                    <div
                      key={job.id}
                      className="bg-card/90 border border-border/80 rounded-xl p-3.5 space-y-3 hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200"
                    >
                      {/* Card top: avatar + title */}
                      <Link href={`/jobs/${job.id}`} className="flex items-start gap-3 group">
                        <div
                          className={`w-8 h-8 rounded-lg bg-linear-to-br ${gradient} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                        >
                          {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate leading-snug">
                            {job.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">
                            {job.company_name}
                          </p>
                        </div>
                      </Link>

                      {/* Metadata tags */}
                      {(job.location || job.workplace_type) && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {job.location && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-700 dark:text-slate-300 bg-muted/70 px-2 py-0.5 rounded-md border border-border/50">
                              <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                              <span className="truncate max-w-24">{job.location}</span>
                            </span>
                          )}
                          {job.workplace_type && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-700 dark:text-slate-300 bg-muted/70 px-2 py-0.5 rounded-md border border-border/50">
                              <Monitor className="w-2.5 h-2.5 text-blue-500" />
                              {WORKPLACE_TYPE_LABELS[job.workplace_type]}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quick Status mover */}
                      {application && (
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground font-mono">Status:</span>
                          <KanbanStatusMover
                            applicationId={application.id as unknown as string}
                            currentStatus={application.status}
                            jobId={job.id}
                          />
                        </div>
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
