"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <Card className="border-border/80 shadow-xs bg-card/60 backdrop-blur-xs">
      <form action={formAction}>
        <CardContent className="pt-6 pb-6 space-y-4">
          {state.error && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3.5 py-2.5 rounded-lg">
              {state.error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              required
              autoComplete="email"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="h-9 text-xs"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-9 text-xs font-semibold gap-2 mt-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all shadow-sm shadow-indigo-600/25 border-0"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Button>

          <div className="pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-foreground font-semibold hover:underline underline-offset-4">
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
