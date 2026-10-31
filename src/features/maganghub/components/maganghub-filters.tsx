"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown, LayoutGrid, TableProperties } from "lucide-react";
import { cn } from "@/lib/utils";

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

type MaganghubFiltersProps = {
  viewMode: "grid" | "table";
  onViewChange: (mode: "grid" | "table") => void;
};

export function MaganghubFilters({ viewMode, onViewChange }: MaganghubFiltersProps) {
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

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("location") ||
    searchParams.has("sort");

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 p-1.5 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md shadow-xs">
      {/* Search Bar */}
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

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 shrink-0">
        {/* Sort */}
        <FilterSelect
          value={searchParams.get("sort") ?? "created_at"}
          onChange={(v) => handleFilter("sort", v)}
          className="w-40"
        >
          <option value="created_at">Terbaru ditambah</option>
          <option value="company_name">Perusahaan A-Z</option>
          <option value="allowance">Uang saku tertinggi</option>
        </FilterSelect>

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

      {/* Divider */}
      <div className="hidden lg:block w-px h-6 bg-border/80 shrink-0 mx-0.5" />

      {/* View Switcher (Grid / Table) */}
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
          <LayoutGrid className="w-3.5 h-3.5 text-violet-500" />
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
          <TableProperties className="w-3.5 h-3.5 text-violet-500" />
          <span className="hidden sm:inline">Tabel</span>
        </Button>
      </div>
    </div>
  );
}
