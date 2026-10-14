"use client";

import { useState } from "react";
import { ScrapedJob, ScraperSource, ScrapeSuccessResponse } from "../types";
import { SocialJobCard } from "./social-job-card";
import { ExploreTabs } from "./explore-tabs";
import {
  Search,
  MessageSquareText,
  Loader2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SCRAPER_API_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL || "http://localhost:3001";

const SOCIAL_SOURCES: { id: ScraperSource; label: string; color: string }[] = [
  { id: "threads", label: "Threads", color: "bg-emerald-500" },
  { id: "linkedin", label: "LinkedIn Post", color: "bg-blue-500" },
];

export function SocialExplorer() {
  const [keyword, setKeyword] = useState("frontend");
  const [selectedSources, setSelectedSources] = useState<ScraperSource[]>([
    "threads",
    "linkedin",
  ]);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScrapedJob[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter state for displayed cards
  const [filterSource, setFilterSource] = useState<string>("all");
  const [onlyWithContact, setOnlyWithContact] = useState(false);

  const toggleSource = (sourceId: ScraperSource) => {
    setSelectedSources((prev) => {
      if (prev.includes(sourceId)) {
        if (prev.length === 1) {
          toast.error("Minimal satu platform sosmed harus dipilih");
          return prev;
        }
        return prev.filter((s) => s !== sourceId);
      }
      return [...prev, sourceId];
    });
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!keyword.trim()) {
      toast.error("Masukkan kata kunci atau posisi pekerjaan");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const sourcesParam = selectedSources.join(",");
      const url = new URL(`${SCRAPER_API_URL}/api/scrape`);
      url.searchParams.set("keyword", keyword.trim());
      url.searchParams.set("sources", sourcesParam);
      url.searchParams.set("limit", "20");

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Service scraper merespon dengan status ${res.status}. Pastikan job-scraper-service (port 3001) aktif.`
        );
      }

      const data = (await res.json()) as ScrapeSuccessResponse;
      setResults(data.results || []);
      setDuration(data.duration_ms);

      toast.success("Postingan sosmed berhasil discrape!", {
        description: `Ditemukan ${data.total} postingan lowongan kerja dari komunitas.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(message);
      setResults([]);
      toast.error("Gagal mengambil data dari sosmed", {
        description: "Pastikan job-scraper-service sedang berjalan di http://localhost:3001",
      });
    } finally {
      setLoading(false);
    }
  };

  const displayedJobs = results.filter((job) => {
    if (filterSource !== "all" && job.source !== filterSource) return false;

    if (onlyWithContact) {
      const text = job.description || job.title;
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
      const hasPhone = /(?:\+62|62|08)[0-9]{8,12}/.test(text);
      return hasEmail || hasPhone;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* ─── Top Switcher Tab ─── */}
      <ExploreTabs />

      {/* ─── Hero Header Banner: Loker Sosmed & Komunitas ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-linear-to-r from-emerald-950 via-slate-900 to-[#080A14] p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="absolute -top-24 -right-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-[11px] font-semibold backdrop-blur-md">
            <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Feed Sosial Media & Postingan Komunitas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Lowongan Santai & Peluang Informal Langsung dari HR / Founder
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
            Pantau postingan loker dari <strong className="text-white">Threads</strong> dan{" "}
            <strong className="text-white">LinkedIn</strong>. Biasanya berisikan tawaran cepat, magang, part-time, atau freelance yang langsung meminta DM atau email ke hiring team.
          </p>
        </div>
      </div>

      {/* ─── Search & Filter Controls ─── */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Keyword Input */}
            <div className="md:col-span-9 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Kata kunci loker, cth: frontend, admin, content creator, part time, magang..."
                className="pl-10 h-10 text-xs rounded-xl"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-semibold gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 border-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scraping Feed...</span>
                  </>
                ) : (
                  <>
                    <MessageSquareText className="w-4 h-4" />
                    <span>Cari di Sosmed</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sources Checkbox Toggles & Contact Filter */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-border/60">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium mr-1.5">
                Platform Sosmed:
              </span>
              {SOCIAL_SOURCES.map((s) => {
                const isSelected = selectedSources.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSource(s.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300 shadow-2xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${isSelected ? s.color : "bg-muted-foreground"}`}
                    />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filter Toggle: Only with direct contact */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyWithContact}
                onChange={(e) => setOnlyWithContact(e.target.checked)}
                className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <span>Hanya yang terdeteksi kontak (Email/WA)</span>
              </span>
            </label>
          </div>
        </form>
      </div>

      {/* ─── Results Toolbar & Chips Filter ─── */}
      {hasSearched && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length} postingan</span>
            <span>ditemukan dari feed komunitas</span>
            {duration && (
              <span className="text-[11px] font-mono text-muted-foreground/60">
                ({(duration / 1000).toFixed(1)} detik)
              </span>
            )}
          </div>

          {/* Source Filter Tabs */}
          {results.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
              <button
                type="button"
                onClick={() => setFilterSource("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterSource === "all"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua ({results.length})
              </button>

              {SOCIAL_SOURCES.map((s) => {
                const count = results.filter((j) => j.source === s.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFilterSource(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filterSource === s.id
                        ? "bg-background text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Error Notification ─── */}
      {errorMsg && (
        <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Koneksi ke Scraper Service Gagal</p>
            <p className="text-[11px] leading-relaxed text-rose-600/90 dark:text-rose-400/90">
              {errorMsg}
            </p>
            <p className="text-[10px] text-muted-foreground pt-1">
              Pastikan service scraper berjalan di terminal:{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">
                cd job-scraper-service &amp;&amp; npm run dev
              </code>
            </p>
          </div>
        </div>
      )}

      {/* ─── Social Job Cards Grid ─── */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 dark:text-emerald-400" />
          <div className="space-y-1">
            <p className="font-semibold text-sm text-foreground">
              Sedang memindai feed komunitas sosial media...
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Memeriksa postingan hashtag lowongan kerja di Threads dan feed LinkedIn. Proses ini memakan waktu beberapa detik.
            </p>
          </div>
        </div>
      ) : displayedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedJobs.map((job) => (
            <SocialJobCard key={job.id} job={job} />
          ))}
        </div>
      ) : hasSearched && !errorMsg ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-2">
          <MessageSquareText className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="font-semibold text-sm text-foreground">
            Tidak ada postingan sosmed yang cocok
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {onlyWithContact
              ? "Coba nonaktifkan filter 'Hanya yang terdeteksi kontak' untuk melihat semua postingan."
              : "Coba gunakan kata kunci yang lebih umum seperti 'loker', 'magang', atau 'part time'."}
          </p>
        </div>
      ) : (
        /* Initial Empty State Banner */
        <div className="p-10 rounded-2xl border border-border/60 bg-muted/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground">
              Pencarian Lowongan Informal di Sosial Media
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Ketik kata kunci posisi atau skill di atas dan klik &ldquo;Cari di Sosmed&rdquo; untuk menemukan postingan lowongan kerja langsung dari Threads dan LinkedIn.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
