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
import { Search, X } from "lucide-react";

export function JobFilters() {
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
      // Reset page saat filter berubah
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
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari posisi atau perusahaan..."
          className="pl-9"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            // Debounce sederhana via timeout
            const val = e.target.value;
            clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>)._searchTimeout);
            (window as unknown as Record<string, ReturnType<typeof setTimeout>>)._searchTimeout = setTimeout(() => handleSearch(val), 400);
          }}
        />
      </div>

      {/* Status filter */}
      <Select
        value={searchParams.get("status") ?? "all"}
        onValueChange={(v) => handleFilter("status", v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="saved">Saved</SelectItem>
          <SelectItem value="applied">Applied</SelectItem>
          <SelectItem value="assessment">Assessment</SelectItem>
          <SelectItem value="interview">Interview</SelectItem>
          <SelectItem value="offer">Offer</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="withdrawn">Withdrawn</SelectItem>
        </SelectContent>
      </Select>

      {/* Employment type filter */}
      <Select
        value={searchParams.get("employment_type") ?? "all"}
        onValueChange={(v) => handleFilter("employment_type", v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Tipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tipe</SelectItem>
          <SelectItem value="full_time">Full-time</SelectItem>
          <SelectItem value="part_time">Part-time</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="freelance">Freelance</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
        </SelectContent>
      </Select>

      {/* Workplace type filter */}
      <Select
        value={searchParams.get("workplace_type") ?? "all"}
        onValueChange={(v) => handleFilter("workplace_type", v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Tempat" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tempat</SelectItem>
          <SelectItem value="onsite">On-site</SelectItem>
          <SelectItem value="remote">Remote</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X className="w-3.5 h-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
