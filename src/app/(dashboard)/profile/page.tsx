import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/features/auth/components/profile-form";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";
import type { Profile } from "@/types/database";

export const metadata: Metadata = {
  title: "Profil Saya — CareerSync",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = rawProfile as unknown as Profile | null;
  const displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "Pengguna";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      {/* Page header */}
      <div className="pb-4 border-b border-border/60">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Profil Saya</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola informasi akun dan keamanan login Anda.
        </p>
      </div>

      {/* Identity card */}
      <div className="flex items-center gap-5 p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs">
        <Avatar className="h-16 w-16 ring-2 ring-border">
          <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-bold text-base text-foreground truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="gap-1 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
              <ShieldCheck className="w-3 h-3" />
              Akun Terverifikasi
            </Badge>
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <User className="w-3 h-3" />
              Personal Tracker
            </Badge>
          </div>
        </div>
      </div>

      {/* Edit profile form */}
      <ProfileForm defaultFullName={profile?.full_name ?? ""} />

      {/* Change password form */}
      <ChangePasswordForm />
    </div>
  );
}
