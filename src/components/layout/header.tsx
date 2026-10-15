import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "./sidebar-trigger";
import { LiveDateTime } from "./live-datetime";
import type { Profile } from "@/types/database";
import Link from "next/link";
import { Zap } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Pick<Profile, "full_name" | "avatar_url"> | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data as Pick<Profile, "full_name" | "avatar_url"> | null;
  }

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "Pengguna";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3.5 sm:px-6 h-16 border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
      {/* Left: Mobile Sidebar Trigger & Brand / Breadcrumb */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <SidebarTrigger />

        {/* Mobile-only brand logo */}
        <Link
          href="/dashboard"
          className="flex lg:hidden items-center gap-2 group"
          aria-label="Ke Dashboard"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 via-violet-600 to-purple-600 text-white shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground">CareerSync</span>
        </Link>

        {/* Desktop breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">Workspace</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-[11px]">
            Career Tracker
          </span>
        </div>
      </div>

      {/* Right Actions: Live DateTime + Theme Toggle + User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LiveDateTime />
        <ThemeToggle />
        <div className="w-px h-4 bg-border/80" />
        {user && (
          <UserMenu
            displayName={displayName}
            email={user.email ?? ""}
            avatarUrl={profile?.avatar_url ?? null}
          />
        )}
      </div>
    </header>
  );
}
