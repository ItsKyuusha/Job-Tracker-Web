"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-links";
import { Sparkles, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-sidebar-border bg-sidebar min-h-screen shrink-0 select-none transition-colors">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 via-violet-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-foreground">CareerSync</span>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">PRO</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">Job Tracker Suite</span>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <Button
          asChild
          size="sm"
          className="w-full justify-start gap-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs h-9 shadow-sm shadow-indigo-600/25 border-0 transition-all active:scale-[0.98]"
        >
          <Link href="/jobs/new">
            <Plus className="w-4 h-4" />
            <span>Tambah Lowongan</span>
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-1 space-y-6">
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Menu Utama
          </p>
          <nav className="space-y-1">
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
                    "relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs shadow-indigo-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer info card */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="p-3.5 rounded-xl bg-linear-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 border border-indigo-500/20 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcoming Update</span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Scraper service untuk LinkedIn & Glints sedang dirancang.
          </p>
        </div>
      </div>
    </aside>
  );
}
