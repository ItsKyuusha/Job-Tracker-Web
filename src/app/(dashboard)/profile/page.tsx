import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/features/auth/components/profile-form";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, Sparkles } from "lucide-react";
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
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Page header */}
      <div className="pb-4 border-b border-border/80">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Pengaturan Profil</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Kelola informasi nama dan keamanan kata sandi akun CareerSync Anda.
        </p>
      </div>

      {/* Identity card with subtle gradient border */}
      <div className="relative overflow-hidden flex items-center gap-5 p-6 rounded-2xl border border-indigo-500/20 bg-card/70 backdrop-blur-md shadow-xs">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <Avatar className="h-16 w-16 ring-4 ring-indigo-500/20 shadow-md">
          <AvatarFallback className="text-lg font-extrabold bg-linear-to-br from-indigo-600 to-violet-600 text-white">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-base text-foreground truncate">{displayName}</p>
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono">{user.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <Badge variant="secondary" className="gap-1 text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              Row Level Security Active
            </Badge>
            <Badge variant="secondary" className="gap-1 text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
              <User className="w-3 h-3" />
              Akun Personal
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
