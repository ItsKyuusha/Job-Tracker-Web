import { LoginForm } from "@/features/auth/components/login-form";
import { AuthSideHero } from "@/features/auth/components/auth-side-hero";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — CareerSync Job Tracker",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left hero side */}
      <AuthSideHero />

      {/* Right form side */}
      <div className="flex flex-col justify-between p-6 sm:p-12 relative">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Selamat Datang Kembali</h1>
            <p className="text-xs text-muted-foreground">
              Masukkan kredensial akun untuk mengakses dashboard pelacakan karir Anda.
            </p>
          </div>

          <LoginForm />
        </div>

        <div className="text-center text-xs text-muted-foreground">
          CareerSync Job Tracker &bull; Secure Authentication
        </div>
      </div>
    </div>
  );
}
