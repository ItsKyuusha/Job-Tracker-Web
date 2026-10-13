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
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-border/80 bg-background/80 backdrop-blur-md lg:px-8">
      {/* Mobile nav toggle */}
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Workspace</span>
          <span>/</span>
          <span>Personal Tracker</span>
        </div>
      </div>

      {/* Right Actions: Theme Toggle + User Menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="w-px h-4 bg-border mx-1" />
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
