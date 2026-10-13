import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import type { Profile } from "@/types/database";

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
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
      {/* Left info & mobile toggle */}
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">Workspace</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-[11px]">
            Career Tracker
          </span>
        </div>
      </div>

      {/* Right Actions: Theme Toggle + User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
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
