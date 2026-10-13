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
import { Search, X, LayoutGrid, Kanban } from "lucide-react";

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

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("status") ||
    searchParams.has("employment_type") ||
    searchParams.has("workplace_type");

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-2.5 items-center flex-1">
        {/* Search */}
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari posisi atau perusahaan..."
            className="pl-9 h-9 text-xs border-border/80 bg-background"
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              const win = window as unknown as Record<string, ReturnType<typeof setTimeout>>;
              clearTimeout(win._searchTimeout);
              win._searchTimeout = setTimeout(() => handleSearch(val), 350);
            }}
          />
        </div>

        {/* Status filter (hanya muncul di Grid mode) */}
        {viewMode === "grid" && (
          <Select
            value={searchParams.get("status") ?? "all"}
            onValueChange={(v) => handleFilter("status", v)}
          >
            <SelectTrigger className="w-32 h-9 text-xs border-border/80 bg-background">
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
        )}

        {/* Workplace type filter */}
        <Select
          value={searchParams.get("workplace_type") ?? "all"}
          onValueChange={(v) => handleFilter("workplace_type", v)}
        >
          <SelectTrigger className="w-28 h-9 text-xs border-border/80 bg-background">
            <SelectValue placeholder="Tempat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tempat</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        {/* Employment type filter */}
        <Select
          value={searchParams.get("employment_type") ?? "all"}
          onValueChange={(v) => handleFilter("employment_type", v)}
        >
          <SelectTrigger className="w-28 h-9 text-xs border-border/80 bg-background">
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

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs gap-1 text-muted-foreground hover:text-foreground">
            <X className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Dual View Toggle (Grid vs Kanban) */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border/80 bg-muted/40 shrink-0 self-end sm:self-auto">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs gap-1.5 shadow-2xs"
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Grid</span>
        </Button>
        <Button
          variant={viewMode === "kanban" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs gap-1.5 shadow-2xs"
          onClick={() => onViewChange("kanban")}
        >
          <Kanban className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kanban</span>
        </Button>
      </div>
    </div>
  );
}
