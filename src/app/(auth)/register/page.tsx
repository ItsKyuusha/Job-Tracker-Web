import { RegisterForm } from "@/features/auth/components/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — Job Tracker",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Job Tracker</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Buat akun baru
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
