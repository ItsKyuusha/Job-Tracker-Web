import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
  formatDate,
  formatRelativeDate,
  getCompanyGradient,
} from "@/lib/utils";
import type { JobListItem } from "@/features/jobs/types";
import { MapPin, Briefcase, Monitor, CalendarClock, Archive } from "lucide-react";

type JobCardProps = {
  job: JobListItem;
  compact?: boolean;
};

export function JobCard({ job, compact = false }: JobCardProps) {
  const application = job.applications?.[0];
  const status = application?.status ?? "saved";
  const isArchived = !job.is_active;

  const initial = job.company_name?.charAt(0)?.toUpperCase() || "J";
  const gradientClass = getCompanyGradient(job.company_name);

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <Card
        className={`relative overflow-hidden border border-border/80 bg-card/80 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/40 ${
          isArchived ? "opacity-60" : ""
        }`}
      >
        {/* Subtle top color strip */}
        <div className={`h-1 w-full bg-linear-to-r ${gradientClass} opacity-80 group-hover:opacity-100 transition-opacity`} />

        <CardContent className="p-4 sm:p-5 space-y-3.5">
          {/* Header Card: Company Avatar + Position + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradientClass} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform`}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {job.title}
                  </h3>
                  {isArchived && (
                    <Archive className="w-3 h-3 text-muted-foreground shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">
                  {job.company_name}
                </p>
              </div>
            </div>

            <StatusBadge status={status} />
          </div>

          {!compact && (
            <>
              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {job.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-muted/70 px-2.5 py-1 rounded-lg border border-border/60">
                    <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="truncate max-w-32">{job.location}</span>
                  </span>
                )}
                {job.workplace_type && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-muted/70 px-2.5 py-1 rounded-lg border border-border/60">
                    <Monitor className="w-3 h-3 text-blue-500 shrink-0" />
                    {WORKPLACE_TYPE_LABELS[job.workplace_type]}
                  </span>
                )}
                {job.employment_type && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-muted/70 px-2.5 py-1 rounded-lg border border-border/60">
                    <Briefcase className="w-3 h-3 text-emerald-500 shrink-0" />
                    {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                  </span>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50">
                <span className="font-mono text-[10px]">Dibuat {formatDate(job.created_at)}</span>
                {job.deadline_at && (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
                    <CalendarClock className="w-3 h-3" />
                    {formatRelativeDate(job.deadline_at)}
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
