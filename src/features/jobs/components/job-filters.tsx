"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, LayoutGrid, Kanban, Archive, ChevronDown, TableProperties } from "lucide-react";
import { cn } from "@/lib/utils";

type JobFiltersProps = {
  viewMode: "grid" | "kanban" | "table";
  onViewChange: (mode: "grid" | "kanban" | "table") => void;
};

// Styled Select Native yang tidak akan pernah terpotong/ke-hide oleh overflow apapun
function FilterSelect({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 appearance-none rounded-xl border border-border/80 bg-background/90 pl-3 pr-8 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted/50 focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
    </div>
  );
}

export function JobFilters({ viewMode, onViewChange }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 p-1.5 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md shadow-xs">
      {/* 1. Search Bar (Fleksibel memanjang) */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Cari posisi atau nama perusahaan..."
          className="pl-9 h-9 text-xs border-border/80 bg-background/90 rounded-xl"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
            searchTimerRef.current = setTimeout(() => handleSearch(val), 350);
          }}
        />
      </div>

      {/* 2. Group Filter Dropdowns (Satu Baris, Tanpa Overflow Clipping) */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 shrink-0">
        {/* Status (Hanya saat Grid / Table Mode) */}
        {(viewMode === "grid" || viewMode === "table") && (
          <FilterSelect
            value={searchParams.get("status") ?? "all"}
            onChange={(v) => handleFilter("status", v)}
            className="w-32"
          >
            <option value="all">Semua Status</option>
            <option value="saved">Tersimpan</option>
            <option value="applied">Terkirim</option>
            <option value="assessment">Assessment</option>
            <option value="interview">Interview</option>
            <option value="offer">Penawaran</option>
            <option value="rejected">Ditolak</option>
            <option value="withdrawn">Dibatalkan</option>
          </FilterSelect>
        )}

        {/* Workplace */}
        <FilterSelect
          value={searchParams.get("workplace_type") ?? "all"}
          onChange={(v) => handleFilter("workplace_type", v)}
          className="w-28"
        >
          <option value="all">Semua Tempat</option>
          <option value="onsite">On-site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </FilterSelect>

        {/* Employment Type */}
        <FilterSelect
          value={searchParams.get("employment_type") ?? "all"}
          onChange={(v) => handleFilter("employment_type", v)}
          className="w-28"
        >
          <option value="all">Semua Tipe</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Kontrak</option>
          <option value="freelance">Freelance</option>
          <option value="internship">Magang</option>
        </FilterSelect>

        {/* Sort */}
        <FilterSelect
          value={searchParams.get("sort") ?? "created_at"}
          onChange={(v) => handleFilter("sort", v)}
          className="w-36"
        >
          <option value="created_at">Terbaru dibuat</option>
          <option value="applied_at">Terbaru dilamar</option>
          <option value="deadline_at">Deadline terdekat</option>
          <option value="company_name">Perusahaan A-Z</option>
        </FilterSelect>

        {/* Toggle Archived */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleArchived}
          className={cn(
            "h-9 text-xs gap-1.5 border-border/80 rounded-xl shrink-0 font-medium px-3",
            showArchived
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>{showArchived ? "Arsip: ON" : "Arsip"}</span>
        </Button>

        {/* Reset */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 text-xs gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl shrink-0 font-medium px-2"
            title="Reset semua filter"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* 3. Divider Halus */}
      <div className="hidden lg:block w-px h-6 bg-border/80 shrink-0 mx-0.5" />

      {/* 4. View Switcher (Grid / Kanban / Table) Dalam Baris yang Sama */}
      <div className="flex items-center gap-1 p-0.5 rounded-xl border border-border/80 bg-muted/50 shrink-0 self-end lg:self-auto">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7.5 px-2.5 text-xs gap-1.5 rounded-lg transition-all",
            viewMode === "grid" && "bg-card text-foreground shadow-2xs font-bold"
          )}
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Grid</span>
        </Button>
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7.5 px-2.5 text-xs gap-1.5 rounded-lg transition-all",
            viewMode === "table" && "bg-card text-foreground shadow-2xs font-bold"
          )}
          onClick={() => onViewChange("table")}
        >
          <TableProperties className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Tabel</span>
        </Button>
        <Button
          variant={viewMode === "kanban" ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7.5 px-2.5 text-xs gap-1.5 rounded-lg transition-all",
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
