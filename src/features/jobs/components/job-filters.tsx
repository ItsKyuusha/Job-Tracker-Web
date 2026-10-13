"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, LayoutGrid, Kanban, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

type JobFiltersProps = {
  viewMode: "grid" | "kanban";
  onViewChange: (mode: "grid" | "kanban") => void;
};

export function JobFilters({ viewMode, onViewChange }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (value: string) => {
    const qs = createQueryString({ search: value || null });
    router.push(`${pathname}?${qs}`, { scroll: false });
  };

  const handleFilter = (key: string, value: string) => {
    const qs = createQueryString({ [key]: value });
    router.push(`${pathname}?${qs}`, { scroll: false });
  };

  const showArchived = searchParams.get("show_archived") === "1";
  const toggleArchived = () => {
    const qs = createQueryString({ show_archived: showArchived ? null : "1" });
    router.push(`${pathname}?${qs}`, { scroll: false });
  };

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("status") ||
    searchParams.has("employment_type") ||
    searchParams.has("workplace_type") ||
    searchParams.has("sort") ||
    searchParams.has("show_archived");

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 p-1.5 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md shadow-xs">
      {/* Sisi Kiri: Search Input */}
      <div className="relative flex-1 min-w-[200px] lg:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Cari posisi atau perusahaan..."
          className="pl-9 h-8.5 text-xs border-border/80 bg-background/90 rounded-xl"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            const win = window as unknown as Record<string, ReturnType<typeof setTimeout>>;
            clearTimeout(win._searchTimeout);
            win._searchTimeout = setTimeout(() => handleSearch(val), 350);
          }}
        />
      </div>

      {/* Sisi Tengah: Dropdowns Filter (Satu Baris Horisontal) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none flex-wrap sm:flex-nowrap">
        {/* Status (Hanya saat Grid Mode) */}
        {viewMode === "grid" && (
          <div className="w-28 shrink-0">
            <Select
              value={searchParams.get("status") ?? "all"}
              onValueChange={(v) => handleFilter("status", v)}
            >
              <SelectTrigger className="h-8.5 text-xs border-border/80 bg-background/90 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="saved">Tersimpan</SelectItem>
                <SelectItem value="applied">Terkirim</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Penawaran</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
                <SelectItem value="withdrawn">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Workplace */}
        <div className="w-28 shrink-0">
          <Select
            value={searchParams.get("workplace_type") ?? "all"}
            onValueChange={(v) => handleFilter("workplace_type", v)}
          >
            <SelectTrigger className="h-8.5 text-xs border-border/80 bg-background/90 rounded-xl">
              <SelectValue placeholder="Tempat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tempat</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipe Pekerjaan */}
        <div className="w-28 shrink-0">
          <Select
            value={searchParams.get("employment_type") ?? "all"}
            onValueChange={(v) => handleFilter("employment_type", v)}
          >
            <SelectTrigger className="h-8.5 text-xs border-border/80 bg-background/90 rounded-xl">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="full_time">Full-time</SelectItem>
              <SelectItem value="part_time">Part-time</SelectItem>
              <SelectItem value="contract">Kontrak</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Magang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-36 shrink-0">
          <Select
            value={searchParams.get("sort") ?? "created_at"}
            onValueChange={(v) => handleFilter("sort", v)}
          >
            <SelectTrigger className="h-8.5 text-xs border-border/80 bg-background/90 rounded-xl">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Terbaru dibuat</SelectItem>
              <SelectItem value="applied_at">Terbaru dilamar</SelectItem>
              <SelectItem value="deadline_at">Deadline terdekat</SelectItem>
              <SelectItem value="company_name">Perusahaan A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Archived Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleArchived}
          className={cn(
            "h-8.5 text-xs gap-1.5 border-border/80 rounded-xl shrink-0 font-medium",
            showArchived
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>{showArchived ? "Arsip: ON" : "Arsip"}</span>
        </Button>

        {/* Reset Filter Button */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8.5 text-xs gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl shrink-0 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* Sisi Kanan: View Switcher (Grid / Kanban) Dalam Baris yang Sama */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-border/80 bg-muted/50 shrink-0 self-end lg:self-auto">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7 px-2.5 text-xs gap-1.5 rounded-lg transition-all",
            viewMode === "grid" && "bg-card text-foreground shadow-2xs font-bold"
          )}
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Grid</span>
        </Button>
        <Button
          variant={viewMode === "kanban" ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7 px-2.5 text-xs gap-1.5 rounded-lg transition-all",
            viewMode === "kanban" && "bg-card text-foreground shadow-2xs font-bold"
          )}
          onClick={() => onViewChange("kanban")}
        >
          <Kanban className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Kanban</span>
        </Button>
      </div>
    </div>
  );
}
