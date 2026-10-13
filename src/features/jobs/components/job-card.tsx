import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
  formatDate,
  formatRelativeDate,
} from "@/lib/utils";
import type { JobListItem } from "@/features/jobs/types";
import { MapPin, Briefcase, Monitor, CalendarClock, Archive } from "lucide-react";

type JobCardProps = {
  job: JobListItem;
};

export function JobCard({ job }: JobCardProps) {
  const application = job.applications[0];
  const status = application?.status;
  const isArchived = !job.is_active;

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card
        className={`transition-colors hover:border-primary/50 hover:shadow-sm cursor-pointer ${isArchived ? "opacity-60" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                {isArchived && (
                  <Archive className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{job.company_name}</p>
            </div>

            {status && (
              <Badge
                variant="secondary"
                className={`text-xs shrink-0 ${APPLICATION_STATUS_COLORS[status]}`}
              >
                {APPLICATION_STATUS_LABELS[status]}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {job.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
            )}
            {job.employment_type && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Briefcase className="w-3 h-3" />
                {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
              </span>
            )}
            {job.workplace_type && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Monitor className="w-3 h-3" />
                {WORKPLACE_TYPE_LABELS[job.workplace_type]}
              </span>
            )}
            {job.deadline_at && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="w-3 h-3" />
                {formatRelativeDate(job.deadline_at)}
              </span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground">
              Ditambahkan {formatDate(job.created_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
