import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
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

  const displayName = profile?.full_name ?? user?.email ?? "Pengguna";

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b bg-card/80 backdrop-blur-sm lg:px-6">
      {/* Mobile nav toggle */}
      <MobileNav />

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
      {user && (
        <UserMenu
          displayName={displayName}
          email={user.email ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
        />
      )}
    </header>
  );
}
