"use client";

import { useState } from "react";
import { ScrapedJob } from "../types";
import {
  ExternalLink,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  BookmarkPlus,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "../utils/date";
import { importScrapedJobAction } from "../actions";
import { toast } from "sonner";

interface PortalJobCardProps {
  job: ScrapedJob;
  isSaved?: boolean;
  onSavedChange?: (url: string) => void;
}

export function PortalJobCard({ job, isSaved = false, onSavedChange }: PortalJobCardProps) {
  const [isLocallySaved, setIsLocallySaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const saved = isSaved || isLocallySaved;

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

  const dateInfo = formatRelativeDate(job.posted_at);

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      const res = await importScrapedJobAction(job);
      if (res.alreadySaved) {
        setIsLocallySaved(true);
        if (job.source_url) onSavedChange?.(job.source_url);
        toast.info("Lowongan sudah ada di Kanban!", {
          description: "Lowongan ini sebelumnya sudah pernah Anda simpan.",
        });
      } else if (res.success) {
        setIsLocallySaved(true);
        if (job.source_url) onSavedChange?.(job.source_url);
        toast.success("Berhasil disimpan ke Kanban!", {
          description: `${job.title} di ${job.company} masuk ke kolom 'Tersimpan'.`,
        });
      } else {
        toast.error(res.error || "Gagal menyimpan lowongan");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan lowongan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-border/80 bg-card p-5 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Top Header: Portal Badge, Tags, and Relative Date */}
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

          <div className="flex items-center gap-2">
            {dateInfo && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/70 px-2 py-0.5 rounded-md"
                title={dateInfo.formattedDate ? `Diposting: ${dateInfo.formattedDate}` : undefined}
              >
                <Clock className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                <span>{dateInfo.relative}</span>
                {dateInfo.formattedDate && (
                  <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">
                    • {dateInfo.formattedDate}
                  </span>
                )}
              </span>
            )}
          </div>
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

      {/* Action Footer: Save to Kanban & Open Source Link */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/60 flex-wrap">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-8 text-xs font-semibold gap-1.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/40 dark:hover:border-indigo-800 transition-colors"
        >
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <span>Buka di {portalName}</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </Button>

        {saved ? (
          <Button
            size="sm"
            variant="secondary"
            disabled
            className="h-8 text-xs font-medium gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-xl cursor-default"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Tersimpan</span>
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="h-8 text-xs font-semibold gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-600/20 border-0 transition-all rounded-xl cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <BookmarkPlus className="w-3.5 h-3.5" />
            )}
            <span>Simpan</span>
          </Button>
        )}
      </div>
    </div>
  );
}
