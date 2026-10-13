"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <Card>
      <form action={formAction}>
        <CardContent className="pt-6 space-y-4">
          {state.error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="kamu@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Masuk..." : "Masuk"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Belum punya akun?{" "}
            <Link href="/register" className="text-foreground font-medium hover:underline">
              Daftar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
