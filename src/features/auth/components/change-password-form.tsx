"use client";

import { useActionState, useEffect } from "react";
import { changePasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, KeyRound, Check } from "lucide-react";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, {});

  useEffect(() => {
    if (state.success) toast.success(state.message ?? "Password diubah.");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-primary" />
          Ubah Password
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <form action={formAction} className="space-y-4">
          {state.error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3 py-2 rounded-lg">
              {state.error}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">Password Baru</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 6 karakter"
              className="h-9 text-xs"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password" className="text-xs font-medium">Konfirmasi Password Baru</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Ulangi password baru"
              className="h-9 text-xs"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={pending}
              className="h-8 text-xs font-semibold gap-1.5 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm shadow-indigo-600/20 border-0"
            >
              {pending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengubah...</>
              ) : (
                <><Check className="w-3.5 h-3.5" /> Ubah Password</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
