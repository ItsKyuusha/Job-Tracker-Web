import { ScrapedJob, ScraperSource } from "../types";
import {
  ExternalLink,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  BookmarkPlus,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: ScrapedJob;
}

const sourceConfig: Record<
  ScraperSource,
  { label: string; badgeClass: string; dotClass: string }
> = {
  linkedin: {
    label: "LinkedIn",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  jobstreet: {
    label: "JobStreet",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    dotClass: "bg-purple-500",
  },
  glints: {
    label: "Glints",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500",
  },
  threads: {
    label: "Threads",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
};

export function ScrapedJobCard({ job }: JobCardProps) {
  const source = sourceConfig[job.source] || {
    label: job.source,
    badgeClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
  };

  const workplaceLabel =
    job.workplace_type === "remote"
      ? "Remote"
      : job.workplace_type === "hybrid"
      ? "Hybrid"
      : job.workplace_type === "onsite"
      ? "Onsite"
      : null;

  const employmentLabel =
    job.employment_type === "full_time"
      ? "Penuh Waktu"
      : job.employment_type === "part_time"
      ? "Paruh Waktu"
      : job.employment_type === "contract"
      ? "Kontrak"
      : job.employment_type === "internship"
      ? "Magang"
      : null;

  return (
    <div className="group relative rounded-2xl border border-border/80 bg-card p-5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Source Badge & Workplace pill */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${source.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${source.dotClass}`} />
              <span>{source.label}</span>
            </span>

            {workplaceLabel && (
              <Badge variant="secondary" className="text-[10px] font-medium">
                {workplaceLabel}
              </Badge>
            )}

            {employmentLabel && (
              <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                {employmentLabel}
              </Badge>
            )}
          </div>

          {job.posted_at && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              <span>{job.posted_at}</span>
            </span>
          )}
        </div>

        {/* Job Title & Company */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
            <span className="font-medium text-foreground/80 truncate">{job.company}</span>
          </div>
        </div>

        {/* Location & Salary */}
        <div className="space-y-1 text-xs pt-1 border-t border-border/60">
          {job.location && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate">{job.location}</span>
            </div>
          )}

          {job.salary_raw && (
            <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{job.salary_raw}</span>
            </div>
          )}
        </div>

        {/* Description snippet if any */}
        {job.description && (
          <p className="text-[11px] text-muted-foreground/90 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>

      {/* Action Footer: Visit Source */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/60">
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          ID: {job.id.slice(0, 8)}
        </span>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-8 text-xs font-semibold gap-1.5 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/40 dark:hover:border-indigo-800 transition-colors"
        >
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <span>Buka Loker</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
