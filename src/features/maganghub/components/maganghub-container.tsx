"use client";

import { useState } from "react";
import type { MaganghubListItem } from "@/features/maganghub/types";
import { MaganghubFilters } from "./maganghub-filters";
import { MaganghubCard } from "./maganghub-card";
import { MaganghubTableRow } from "./maganghub-table-row";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";

type MaganghubContainerProps = {
  listings: MaganghubListItem[];
  hasSearchOrFilter: boolean;
};

export function MaganghubContainer({
  listings,
  hasSearchOrFilter,
}: MaganghubContainerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <div className="space-y-5">
      <MaganghubFilters viewMode={viewMode} onViewChange={setViewMode} />

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/80 rounded-2xl bg-card/40">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
            <GraduationCap className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-1 text-foreground">
            Tidak Ada Lowongan Magang
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            {hasSearchOrFilter
              ? "Tidak ada data yang cocok dengan kriteria pencarian atau filter Anda."
              : "Anda belum menambahkan lowongan MagangHub apa pun ke daftar riset."}
          </p>
          {!hasSearchOrFilter && (
            <Button asChild size="sm" className="h-8 text-xs font-semibold">
              <Link href="/maganghub/new">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Lowongan Pertama
              </Link>
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <MaganghubCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Posisi / Perusahaan
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Lokasi
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Uang Saku
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Hari Kerja
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Kuota
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Pelamar
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Link
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Ditambah
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px] whitespace-nowrap">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <MaganghubTableRow key={listing.id} listing={listing} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
