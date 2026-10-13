"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-links";
import { Sparkles, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/80 bg-sidebar min-h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-foreground">CareerSync</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5 font-medium">Job Tracker Pro</span>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <Button
          asChild
          size="sm"
          className="w-full justify-start gap-2 shadow-xs bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs h-9"
        >
          <Link href="/jobs/new">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Lowongan</span>
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-1 space-y-6">
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Menu Utama
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="p-3 rounded-lg bg-sidebar-accent/50 border border-sidebar-border/60 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground text-[11px]">Next: Job Scraper Service</p>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Fitur auto-scrape LinkedIn & Glints sedang dalam roadmap.
          </p>
        </div>
      </div>
    </aside>
  );
}
