import { LoginForm } from "@/features/auth/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Job Tracker",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Job Tracker</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Masuk untuk melanjutkan
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
