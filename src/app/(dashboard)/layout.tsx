import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

// Dashboard routes selalu dynamic karena memerlukan auth
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* Responsive Sider: Persistent on desktop, off-canvas slide-over on mobile */}
        <Sidebar
          displayName={displayName}
          email={user?.email ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 pb-10">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
