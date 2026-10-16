"use client";

import { useState, useEffect } from "react";
import { ScrapedJob, ScraperSource, ScrapeSuccessResponse } from "../types";
import { ScrapedJobCard } from "./scraped-job-card";
import { ExploreTabs } from "./explore-tabs";
import {
  Search,
  MapPin,
  Sparkles,
  Loader2,
  Compass,
  AlertCircle,
  Layers,
  Building2,
  MessageSquareText,
  Clock,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateFilterOption, DATE_FILTER_OPTIONS, filterJobsByDate, deduplicateJobsClient } from "../utils/date";
import { getSavedJobUrlsAction } from "../actions";
import { toast } from "sonner";

const SCRAPER_API_URL =
  process.env.NEXT_PUBLIC_SCRAPER_API_URL || "https://job-scraper-service-seven.vercel.app";

const ALL_SOURCES: { id: ScraperSource; label: string; color: string; type: "portal" | "social" }[] = [
  { id: "jobstreet", label: "JobStreet", color: "bg-purple-500", type: "portal" },
  { id: "glints", label: "Glints", color: "bg-rose-500", type: "portal" },
  { id: "threads", label: "Threads", color: "bg-emerald-500", type: "social" },
  { id: "linkedin", label: "LinkedIn", color: "bg-blue-500", type: "social" },
];

export function JobExplorer() {
  const [keyword, setKeyword] = useState("Frontend Developer");
  const [location, setLocation] = useState("Jakarta");
  const [selectedSources, setSelectedSources] = useState<ScraperSource[]>([
    "jobstreet",
    "glints",
    "threads",
    "linkedin",
  ]);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScrapedJob[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [duration, setDuration] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter state for displayed cards
  const [filterSource, setFilterSource] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");

  // Track already saved job URLs for duplicate indicators
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    getSavedJobUrlsAction().then((urls) => {
      setSavedUrls(new Set(urls));
    });
  }, []);

  const handleSavedUrl = (url: string) => {
    setSavedUrls((prev) => new Set([...prev, url]));
  };

  const toggleSource = (sourceId: ScraperSource) => {
    setSelectedSources((prev) => {
      if (prev.includes(sourceId)) {
        if (prev.length === 1) {
          toast.error("Minimal satu sumber harus dipilih");
          return prev;
        }
        return prev.filter((s) => s !== sourceId);
      }
      return [...prev, sourceId];
    });
  };

  const selectGroup = (group: "all" | "portals" | "social") => {
    if (group === "all") {
      setSelectedSources(["jobstreet", "glints", "threads", "linkedin"]);
    } else if (group === "portals") {
      setSelectedSources(["jobstreet", "glints"]);
    } else if (group === "social") {
      setSelectedSources(["threads", "linkedin"]);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!keyword.trim()) {
      toast.error("Masukkan kata kunci posisi pekerjaan");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);
    setPage(1);
    setHasMore(true);

    try {
      const sourcesParam =
        selectedSources.length === ALL_SOURCES.length ? "all" : selectedSources.join(",");
      const url = new URL(`${SCRAPER_API_URL}/api/scrape`);
      url.searchParams.set("keyword", keyword.trim());
      if (location.trim()) url.searchParams.set("location", location.trim());
      url.searchParams.set("sources", sourcesParam);
      url.searchParams.set("limit", "15");
      url.searchParams.set("page", "1");

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Service scraper merespon dengan status ${res.status}. Pastikan service scraper aktif (${SCRAPER_API_URL}).`
        );
      }

      const data = (await res.json()) as ScrapeSuccessResponse;
      const cleanResults = deduplicateJobsClient(data.results || []);
      setResults(cleanResults);
      setDuration(data.duration_ms);

      toast.success("Scraping gabungan berhasil!", {
        description: `Ditemukan ${cleanResults.length} lowongan unik dari ${selectedSources.length} sumber platform.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(message);
      setResults([]);
      toast.error("Gagal melakukan scraping", {
        description: message.length < 90 ? message : `Periksa status service scraper di ${SCRAPER_API_URL}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const sourcesParam =
        selectedSources.length === ALL_SOURCES.length ? "all" : selectedSources.join(",");
      const url = new URL(`${SCRAPER_API_URL}/api/scrape`);
      url.searchParams.set("keyword", keyword.trim());
      if (location.trim()) url.searchParams.set("location", location.trim());
      url.searchParams.set("sources", sourcesParam);
      url.searchParams.set("limit", "15");
      url.searchParams.set("page", String(nextPage));

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        toast.error("Gagal mengambil halaman berikutnya.");
        return;
      }

      const data = (await res.json()) as ScrapeSuccessResponse;
      const newItems = data.results || [];

      if (newItems.length === 0) {
        setHasMore(false);
        toast.info("Tidak ada lagi lowongan baru yang ditemukan.");
      } else {
        setResults((prev) => {
          const merged = [...prev, ...newItems];
          const deduplicated = deduplicateJobsClient(merged);
          const addedCount = deduplicated.length - prev.length;
          if (addedCount <= 0) {
            setHasMore(false);
            toast.info("Semua lowongan dari halaman berikutnya sudah ada di daftar.");
          } else {
            toast.success(`Berhasil memuat ${addedCount} lowongan baru.`);
          }
          return deduplicated;
        });
        setPage(nextPage);
      }
    } catch {
      toast.error("Terjadi kendala saat memuat halaman tambahan.");
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredBySource = results.filter((job) => {
    if (filterSource === "all") return true;
    return job.source === filterSource;
  });

  const displayedJobs = filterJobsByDate(filteredBySource, dateFilter);

  return (
    <div className="space-y-6">
      {/* ─── Top Switcher Tab ─── */}
      <ExploreTabs />

      {/* ─── Hero Header Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-linear-to-r from-slate-950 via-indigo-950 to-[#080A14] p-6 sm:p-8 text-white shadow-xl shadow-cyan-950/20">
        <div className="absolute -top-24 -right-12 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-semibold backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mode Gabungan: Semua Platform & Sosmed</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Eksplorasi Lowongan Lintas Sumber (All-in-One)
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed font-normal">
            Bandingkan lowongan kerja resmi dari <strong className="text-white">JobStreet</strong> dan{" "}
            <strong className="text-white">Glints</strong> dengan postingan informal langsung dari{" "}
            <strong className="text-white">Threads</strong> dan <strong className="text-white">LinkedIn</strong> dalam satu feed terpadu.
          </p>
        </div>
      </div>

      {/* ─── Search & Filter Controls ─── */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Keyword Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Posisi pekerjaan, cth: Frontend Developer, System Analyst..."
                className="pl-10 h-10 text-xs rounded-xl"
              />
            </div>

            {/* Location Input */}
            <div className="md:col-span-4 relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lokasi (cth: Jakarta, Bandung, Remote)..."
                className="pl-10 h-10 text-xs rounded-xl"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-semibold gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/30 border-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Cari Semua</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sources Checkbox Toggles & Quick Preset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/60">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium mr-1.5">
                Sumber Aktif:
              </span>
              {ALL_SOURCES.map((s) => {
                const isSelected = selectedSources.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSource(s.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-50 border-cyan-300 text-cyan-800 dark:bg-cyan-950/60 dark:border-cyan-700 dark:text-cyan-300 shadow-2xs"
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

            {/* Preset shortcuts */}
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>Preset:</span>
              <button
                type="button"
                onClick={() => selectGroup("all")}
                className="px-1.5 py-0.5 rounded hover:bg-muted text-foreground font-medium cursor-pointer"
              >
                Semua
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => selectGroup("portals")}
                className="px-1.5 py-0.5 rounded hover:bg-muted text-foreground font-medium cursor-pointer"
              >
                Hanya Portal
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => selectGroup("social")}
                className="px-1.5 py-0.5 rounded hover:bg-muted text-foreground font-medium cursor-pointer"
              >
                Hanya Sosmed
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ─── Results Toolbar & Chips Filter ─── */}
      {hasSearched && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
            <span className="font-semibold text-foreground">
              {displayedJobs.length} dari {results.length} lowongan
            </span>
            <span>ditampilkan ({selectedSources.length} platform)</span>
            {duration && (
              <span className="text-[11px] font-mono text-muted-foreground/60">
                ({(duration / 1000).toFixed(1)} detik)
              </span>
            )}
          </div>

          {/* Source & Date Filter Controls */}
          {results.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date Filter Selector */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted/60 border border-border/60">
                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-[11px] text-muted-foreground font-medium">Waktu:</span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
                  className="bg-transparent text-xs font-semibold text-foreground focus:outline-hidden cursor-pointer"
                >
                  {DATE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-popover text-popover-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 flex-wrap">
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

                {ALL_SOURCES.map((s) => {
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
              Endpoint aktif:{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">
                {SCRAPER_API_URL}
              </code>
            </p>
          </div>
        </div>
      )}

      {/* ─── Job Cards Grid ─── */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-600 dark:text-cyan-400" />
          <div className="space-y-1">
            <p className="font-semibold text-sm text-foreground">
              Sedang mengambil data gabungan dari semua sumber...
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Memindai JobStreet, Glints, Threads, dan LinkedIn secara berurutan. Proses memakan waktu beberapa detik.
            </p>
          </div>
        </div>
      ) : displayedJobs.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedJobs.map((job) => (
              <ScrapedJobCard
                key={job.id}
                job={job}
                isSaved={savedUrls.has(job.source_url)}
                onSavedChange={handleSavedUrl}
              />
            ))}
          </div>

          {/* Pagination: Load More */}
          {hasMore && (
            <div className="flex flex-col items-center justify-center gap-2 pt-4 pb-2 border-t border-border/60">
              <Button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                size="lg"
                className="rounded-2xl px-8 font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 gap-2 cursor-pointer transition-all"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang Mengambil Halaman {page + 1}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Muat Lebih Banyak Lowongan (Halaman {page + 1})</span>
                  </>
                )}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Mengambil batch berikutnya dan otomatis membuang duplikat yang sudah ada di daftar.
              </p>
            </div>
          )}
        </div>
      ) : hasSearched && !errorMsg ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-2">
          <Compass className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="font-semibold text-sm text-foreground">
            Tidak ada lowongan yang ditemukan
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Coba variasikan kata kunci posisi atau ubah lokasi pencarian untuk menemukan lebih banyak hasil.
          </p>
        </div>
      ) : (
        /* Initial Empty State Banner */
        <div className="p-10 rounded-2xl border border-border/60 bg-muted/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground">
              Mulai Penjelajahan Lowongan Semua Sumber Sekaligus
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Ketik posisi impianmu di atas dan klik &ldquo;Cari Semua&rdquo; untuk menarik feed pekerjaan gabungan dari JobStreet, Glints, Threads, dan LinkedIn dalam satu tampilan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
