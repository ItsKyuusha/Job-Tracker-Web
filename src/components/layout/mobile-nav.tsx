"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-links";
import { logoutAction } from "@/features/auth/actions";
import { ThemeToggle } from "./theme-toggle";
import { Menu, Zap, Plus, LogOut, Sparkles, ChevronRight } from "lucide-react";

interface MobileNavProps {
  displayName?: string;
  email?: string;
  avatarUrl?: string | null;
}

export function MobileNav({ displayName, email, avatarUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[85vw] max-w-76 p-0 bg-sidebar border-sidebar-border flex flex-col justify-between"
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <SheetHeader className="px-5 h-16 border-b border-sidebar-border flex justify-center">
            <SheetTitle className="flex items-center gap-3 text-left">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 via-violet-600 to-purple-600 text-white shadow-sm shadow-indigo-500/25">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-foreground">CareerSync</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">Job Tracker Suite</span>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* User Profile Snippet in Mobile Drawer */}
          {displayName && (
            <div className="p-3.5 mx-3 mt-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border flex items-center justify-between gap-3">
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
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Lihat profil"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Quick Action Button */}
          <div className="p-3">
            <Button
              asChild
              size="sm"
              onClick={() => setOpen(false)}
              className="w-full justify-start gap-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs h-9 shadow-sm shadow-indigo-600/25 border-0 rounded-xl"
            >
              <Link href="/jobs/new">
                <Plus className="w-4 h-4" />
                <span>Tambah Lowongan</span>
              </Link>
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-1 space-y-1">
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
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
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
                            : "text-muted-foreground"
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

        {/* Footer Area: Info, Theme Toggle & Logout */}
        <div className="p-3 border-t border-sidebar-border space-y-3 mt-auto">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 border border-indigo-500/15 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">
              <Sparkles className="w-3 h-3" />
              <span>CareerSync Mobile</span>
            </div>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Akses cepat pipeline karir kapan saja di genggaman Anda.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-[11px] text-muted-foreground">Tema</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await logoutAction();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
