"use client";

import { useState, useEffect } from "react";
import { ScrapedJob } from "../types";
import {
  ExternalLink,
  Copy,
  Check,
  Mail,
  Phone,
  Clock,
  MapPin,
  BookmarkPlus,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "../utils/date";
import { importScrapedJobAction } from "../actions";
import { toast } from "sonner";

interface SocialJobCardProps {
  job: ScrapedJob;
  isSaved?: boolean;
  onSavedChange?: (url: string) => void;
}

export function SocialJobCard({ job, isSaved = false, onSavedChange }: SocialJobCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const isThreads = job.source === "threads";
  const platformName = isThreads ? "Threads" : "LinkedIn";
  const badgeStyle = isThreads
    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  const dotColor = isThreads ? "bg-emerald-500" : "bg-blue-500";

  // Text content to display
  const postText = job.description || job.title;

  // Extract contact info using regex
  const emailMatch = postText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = postText.match(/(?:\+62|62|08)[0-9]{8,12}/);
  const detectedEmail = emailMatch ? emailMatch[0] : null;
  const detectedPhone = phoneMatch ? phoneMatch[0] : null;

  const dateInfo = formatRelativeDate(job.posted_at);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} berhasil disalin!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      const res = await importScrapedJobAction(job);
      if (res.alreadySaved) {
        setSaved(true);
        if (job.source_url) onSavedChange?.(job.source_url);
        toast.info("Lowongan sudah ada di Kanban!", {
          description: "Lowongan ini sebelumnya sudah pernah Anda simpan.",
        });
      } else if (res.success) {
        setSaved(true);
        if (job.source_url) onSavedChange?.(job.source_url);
        toast.success("Berhasil disimpan ke Kanban!", {
          description: `${job.title} masuk ke kolom 'Tersimpan'.`,
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
    <div className="group relative rounded-2xl border border-border/80 bg-card p-5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Top Header: Platform Badge, Poster, and Relative Date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              <span>{platformName}</span>
            </span>

            {/* Poster handle / company */}
            <span className="text-xs font-semibold text-foreground/90 truncate max-w-[180px]">
              {job.company || "Postingan Komunitas"}
            </span>
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
            {job.location && (
              <span className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground/70" />
                <span>{job.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Post Title / Main Vacancy Heading */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {job.title}
          </h3>
        </div>

        {/* Contact Chips if detected */}
        {(detectedEmail || detectedPhone) && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {detectedEmail && (
              <button
                type="button"
                onClick={() => handleCopy(detectedEmail, "Email")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-medium hover:scale-105 transition-all cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[180px]">{detectedEmail}</span>
              </button>
            )}

            {detectedPhone && (
              <button
                type="button"
                onClick={() => handleCopy(detectedPhone, "Nomor WhatsApp")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium hover:scale-105 transition-all cursor-pointer"
              >
                <Phone className="w-3 h-3" />
                <span>{detectedPhone}</span>
              </button>
            )}
          </div>
        )}

        {/* Post Full Body (Informal Community Text) */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground/90 space-y-2">
          <p
            className={`leading-relaxed whitespace-pre-line ${
              expanded ? "" : "line-clamp-4"
            }`}
          >
            {postText}
          </p>

          {postText.length > 200 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya..."}
            </button>
          )}
        </div>
      </div>

      {/* Action Footer: Copy Text, Save to Kanban, and Open Link */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/60 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleCopy(postText, "Teks postingan")}
            className="h-8 text-xs font-medium gap-1.5 text-muted-foreground hover:text-foreground rounded-xl"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Salin</span>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground rounded-xl"
          >
            <a
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <span>{platformName}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </Button>
        </div>

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
            className="h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs shadow-emerald-600/20 border-0 transition-all rounded-xl cursor-pointer"
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
