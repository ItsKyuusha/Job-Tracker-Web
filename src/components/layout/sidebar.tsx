"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-links";
import { Sparkles, Plus, Zap, X, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";
import { logoutAction } from "@/features/auth/actions";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  displayName?: string;
  email?: string;
  avatarUrl?: string | null;
}

export function Sidebar({ displayName, email, avatarUrl }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      {/* ─── Mobile Backdrop (dimmed background) ─── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
        aria-hidden="true"
      />

      {/* ─── Responsive Sider / Sidebar ─── */}
      <aside
        className={cn(
          // Base styles
          "flex flex-col bg-sidebar border-sidebar-border select-none transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto",
          // Desktop: static left column, persistent, 256px width, full height, right border
          "lg:static lg:translate-x-0 lg:w-64 lg:min-h-screen lg:border-r lg:z-auto lg:shadow-none",
          // Mobile & Tablet: fixed off-canvas overlay drawer, z-50, shadow-2xl, 288px width
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full border-r shadow-2xl",
          // Open/Close toggle animation on mobile
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border shrink-0">
          <Link
            href="/dashboard"
            onClick={close}
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 via-violet-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-foreground">CareerSync</span>
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">Job Tracker Suite</span>
            </div>
          </Link>

          {/* Close button for Mobile/Tablet only */}
          <button
            type="button"
            onClick={close}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors cursor-pointer"
            aria-label="Tutup sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Snippet (rendered prominently on mobile drawer) */}
        {displayName && (
          <div className="lg:hidden p-3.5 mx-3 mt-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="h-8 w-8 ring-1 ring-border">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{email}</p>
              </div>
            </div>
            <Link
              href="/profile"
              onClick={close}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Lihat profil"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Quick Action Button */}
        <div className="p-4 shrink-0">
          <Button
            asChild
            size="sm"
            onClick={close}
            className="w-full justify-start gap-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs h-9 shadow-sm shadow-indigo-600/25 border-0 rounded-xl transition-all active:scale-[0.98]"
          >
            <Link href="/jobs/new">
              <Plus className="w-4 h-4" />
              <span>Tambah Lowongan</span>
            </Link>
          </Button>
        </div>

        {/* Navigation Menu */}
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
                    onClick={close}
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
        <div className="p-4 border-t border-sidebar-border shrink-0 space-y-3">
          <div className="p-3 rounded-xl bg-linear-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 border border-indigo-500/15 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming Update</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Scraper service untuk LinkedIn & Glints sedang dirancang.
            </p>
          </div>

          {/* Mobile-only bottom quick actions */}
          <div className="flex lg:hidden items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-[11px] text-muted-foreground">Tema</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                close();
                await logoutAction();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
