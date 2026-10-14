"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Building2, MessageSquareText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExploreTabs() {
  const pathname = usePathname();
  const isAll = pathname === "/explore" || pathname.includes("/explore/all");
  const isPortals = pathname.includes("/portals");
  const isSocial = pathname.includes("/social");

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-1.5 rounded-2xl bg-muted/70 border border-border/80 backdrop-blur-md">
      <div className="grid grid-cols-3 gap-1.5 w-full lg:w-auto">
        {/* Tab 1: Gabungan / All Sources */}
        <Link
          href="/explore/all"
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none text-center",
            isAll
              ? "bg-background text-foreground shadow-sm shadow-black/5 dark:shadow-black/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/40"
          )}
        >
          <Layers
            className={cn(
              "w-4 h-4 shrink-0",
              isAll ? "text-cyan-500" : "text-muted-foreground"
            )}
          />
          <div className="flex items-center gap-1.5">
            <span>Gabungan</span>
            <span className="hidden sm:inline text-[10px] text-muted-foreground font-normal">
              (Semua)
            </span>
          </div>
        </Link>

        {/* Tab 2: Portal Karir Resmi */}
        <Link
          href="/explore/portals"
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none text-center",
            isPortals
              ? "bg-background text-foreground shadow-sm shadow-black/5 dark:shadow-black/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/40"
          )}
        >
          <Building2
            className={cn(
              "w-4 h-4 shrink-0",
              isPortals ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
            )}
          />
          <div className="flex items-center gap-1.5">
            <span>Portal Karir</span>
            <span className="hidden sm:inline text-[10px] text-muted-foreground font-normal">
              (Resmi)
            </span>
          </div>
        </Link>

        {/* Tab 3: Loker Sosmed & Komunitas */}
        <Link
          href="/explore/social"
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none text-center",
            isSocial
              ? "bg-background text-foreground shadow-sm shadow-black/5 dark:shadow-black/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/40"
          )}
        >
          <MessageSquareText
            className={cn(
              "w-4 h-4 shrink-0",
              isSocial ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}
          />
          <div className="flex items-center gap-1.5">
            <span>Loker Sosmed</span>
            <span className="hidden sm:inline text-[10px] text-muted-foreground font-normal">
              (Komunitas)
            </span>
          </div>
        </Link>
      </div>

      <div className="hidden xl:flex items-center gap-2 px-3 text-[11px] text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span>Eksplorasi fleksibel: gabungan semua sumber atau terpisah per kategori</span>
      </div>
    </div>
  );
}
