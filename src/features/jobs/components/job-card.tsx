import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
  formatDate,
  formatRelativeDate,
  getCompanyGradient,
  formatSalary,
} from "@/lib/utils";
import type { JobListItem } from "@/features/jobs/types";
import { MapPin, Briefcase, Monitor, CalendarClock, Archive, Banknote } from "lucide-react";

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
        className={`border-border/80 bg-card/60 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:border-foreground/30 ${
          isArchived ? "opacity-60" : ""
        }`}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header Card: Company Avatar + Position + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg bg-linear-to-br ${gradientClass} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h3>
                  {isArchived && (
                    <Archive className="w-3 h-3 text-muted-foreground shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">
                  {job.company_name}
                </p>
              </div>
            </div>

            <StatusBadge status={status} />
          </div>

          {!compact && (
            <>
              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {job.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-28">{job.location}</span>
                  </span>
                )}
                {job.workplace_type && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    <Monitor className="w-3 h-3" />
                    {WORKPLACE_TYPE_LABELS[job.workplace_type]}
                  </span>
                )}
                {job.employment_type && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    <Briefcase className="w-3 h-3" />
                    {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                  </span>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2.5 border-t border-border/40">
                <span>Dibuat {formatDate(job.created_at)}</span>
                {job.deadline_at && (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
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
