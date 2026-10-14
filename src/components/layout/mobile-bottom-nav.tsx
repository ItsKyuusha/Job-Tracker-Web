"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Plus, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/dashboard";
  const isJobsActive = pathname === "/jobs" || (pathname.startsWith("/jobs") && pathname !== "/jobs/new");
  const isNewJobActive = pathname === "/jobs/new";
  const isProfileActive = pathname.startsWith("/profile");

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/80 px-2 py-1.5 shadow-lg shadow-black/10 select-none pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-all",
            isDashboardActive
              ? "text-indigo-600 dark:text-indigo-400 font-semibold scale-105"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {isDashboardActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="mt-1">Dashboard</span>
        </Link>

        {/* Lowongan / Jobs */}
        <Link
          href="/jobs"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-all",
            isJobsActive
              ? "text-indigo-600 dark:text-indigo-400 font-semibold scale-105"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            <Briefcase className="w-5 h-5" />
            {isJobsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="mt-1">Lowongan</span>
        </Link>

        {/* Center Floating Quick Add */}
        <Link
          href="/jobs/new"
          className={cn(
            "flex items-center justify-center -mt-4 w-11 h-11 rounded-full bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/35 border-2 border-background active:scale-95 transition-transform",
            isNewJobActive && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-background"
          )}
          aria-label="Tambah Lowongan Baru"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </Link>

        {/* Profil */}
        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-all",
            isProfileActive
              ? "text-indigo-600 dark:text-indigo-400 font-semibold scale-105"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            <UserRound className="w-5 h-5" />
            {isProfileActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
          <span className="mt-1">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
