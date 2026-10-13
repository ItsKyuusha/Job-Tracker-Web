"use client";

import { useActionState, useEffect } from "react";
import { updateProfileAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserRound, Check } from "lucide-react";
import { toast } from "sonner";

export function ProfileForm({ defaultFullName }: { defaultFullName: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {});

  useEffect(() => {
    if (state.success) toast.success(state.message ?? "Profil diperbarui.");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <UserRound className="w-3.5 h-3.5 text-primary" />
          Informasi Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-xs font-medium">Nama Lengkap</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={defaultFullName}
              placeholder="Nama lengkap Anda"
              className="h-9 text-xs"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={pending}
              className="h-8 text-xs font-semibold gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs"
            >
              {pending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...</>
              ) : (
                <><Check className="w-3.5 h-3.5" /> Simpan Perubahan</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
