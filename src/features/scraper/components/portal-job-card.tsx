import { ScrapedJob } from "../types";
import {
  ExternalLink,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PortalJobCardProps {
  job: ScrapedJob;
}

export function PortalJobCard({ job }: PortalJobCardProps) {
  const isJobStreet = job.source === "jobstreet";
  const portalName = isJobStreet ? "JobStreet" : "Glints";
  const badgeStyle = isJobStreet
    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  const dotColor = isJobStreet ? "bg-purple-500" : "bg-rose-500";

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
    <div className="group relative rounded-2xl border border-border/80 bg-card p-5 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Top Header: Portal Badge & Tags */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              <span>{portalName}</span>
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

          <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Terverifikasi</span>
          </span>
        </div>

        {/* Position Title & Company Name */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
            <span className="font-semibold text-foreground/85 truncate">{job.company}</span>
          </div>
        </div>

        {/* Structured Info: Location & Salary */}
        <div className="space-y-1.5 text-xs pt-2 border-t border-border/60">
          {job.location && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate">{job.location}</span>
            </div>
          )}

          {job.salary_raw ? (
            <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{job.salary_raw}</span>
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/60 italic">
              Gaji dirahasiakan / dinegosiasikan
            </div>
          )}
        </div>

        {/* Description snippet */}
        {job.description && (
          <p className="text-[11px] text-muted-foreground/90 line-clamp-2 leading-relaxed pt-1">
            {job.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/60">
        <span className="text-[10px] text-muted-foreground/60 font-mono truncate">
          Ref: {job.id.slice(0, 8)}
        </span>

        <Button
          asChild
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-600/20 border-0 transition-all rounded-xl"
        >
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <span>Lamar di {portalName}</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
