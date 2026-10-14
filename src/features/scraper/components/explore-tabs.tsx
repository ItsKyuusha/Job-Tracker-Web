"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, MessageSquareText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExploreTabs() {
  const pathname = usePathname();
  const isPortals = pathname.includes("/portals");
  const isSocial = pathname.includes("/social");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-muted/70 border border-border/80 backdrop-blur-md">
      <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
        {/* Tab 1: Portal Karir Resmi */}
        <Link
          href="/explore/portals"
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none",
            isPortals
              ? "bg-background text-foreground shadow-sm shadow-black/5 dark:shadow-black/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/40"
          )}
        >
          <Building2
            className={cn(
              "w-4 h-4",
              isPortals ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
            )}
          />
          <div className="flex items-center gap-1.5">
            <span>Portal Karir</span>
            <span className="hidden md:inline text-[10px] text-muted-foreground font-normal">
              (JobStreet, Glints)
            </span>
          </div>
        </Link>

        {/* Tab 2: Loker Sosmed & Komunitas */}
        <Link
          href="/explore/social"
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none",
            isSocial
              ? "bg-background text-foreground shadow-sm shadow-black/5 dark:shadow-black/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/40"
          )}
        >
          <MessageSquareText
            className={cn(
              "w-4 h-4",
              isSocial ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}
          />
          <div className="flex items-center gap-1.5">
            <span>Loker Sosmed</span>
            <span className="hidden md:inline text-[10px] text-muted-foreground font-normal">
              (Threads, LinkedIn)
            </span>
          </div>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-2 px-3 text-[11px] text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Pemisahan feed formal vs postingan informal komunitas</span>
      </div>
    </div>
  );
}
