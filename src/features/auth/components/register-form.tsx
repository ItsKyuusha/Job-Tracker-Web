"use client";

import { useActionState, useState, useMemo } from "react";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, {});
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Real-time password strength calculation
  const passwordStats = useMemo(() => {
    const hasMinLength = password.length >= 6;
    const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (password.length > 0) score += 1;
    if (hasMinLength) score += 1;
    if (hasUpperAndLower) score += 1;
    if (hasNumberOrSpecial) score += 1;

    let label = "Belum diisi";
    let colorClass = "bg-slate-200";
    let textColor = "text-slate-400";

    if (password.length > 0) {
      if (score <= 1) {
        label = "Sangat Lemah";
        colorClass = "bg-rose-500";
        textColor = "text-rose-600";
      } else if (score === 2) {
        label = "Cukup";
        colorClass = "bg-amber-500";
        textColor = "text-amber-600";
      } else if (score === 3) {
        label = "Kuat";
        colorClass = "bg-[#6545FF]";
        textColor = "text-[#6545FF]";
      } else {
        label = "Sangat Kuat";
        colorClass = "bg-emerald-500";
        textColor = "text-emerald-600";
      }
    }

    return {
      score,
      label,
      colorClass,
      textColor,
      hasMinLength,
      hasUpperAndLower,
      hasNumberOrSpecial,
    };
  }, [password]);

  const handleGoogleRegister = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) {
        toast.error("Daftar dengan Google gagal", {
          description: error.message || "Periksa konfigurasi Google Client ID & Secret pada dashboard Supabase Auth.",
        });
      }
    } catch {
      toast.error("Daftar dengan Google gagal", {
        description: "Terjadi kesalahan saat memulai sesi OAuth.",
      });
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-5 text-slate-900 transition-all">
      {/* Top Segmented Navigation Pills: Masuk vs Daftar */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
        <Link
          href="/login"
          className="flex items-center justify-center py-2 px-3 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all text-center"
        >
          <span>Masuk ke Akun</span>
        </Link>
        <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#6545FF] text-white shadow-xs text-center font-bold transition-all">
          <span>Daftar Akun Baru</span>
        </div>
      </div>

      {/* Main Register Form */}
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="flex items-start gap-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="space-y-0.5">
              <span className="font-semibold text-rose-800">Registrasi Gagal</span>
              <p className="text-[11px] leading-relaxed text-rose-600">
                {state.error}
              </p>
            </div>
          </div>
        )}

        {/* Full Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-xs font-semibold text-slate-700">
            Nama Lengkap
          </Label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6545FF] transition-colors pointer-events-none">
              <User className="w-4 h-4" />
            </div>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Alex Pratama"
              required
              autoComplete="name"
              className="h-10 pl-10 pr-3 text-xs bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#6545FF] focus:ring-2 focus:ring-[#6545FF]/20 transition-all rounded-xl"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
            Alamat Email
          </Label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6545FF] transition-colors pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              autoComplete="email"
              className="h-10 pl-10 pr-3 text-xs bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#6545FF] focus:ring-2 focus:ring-[#6545FF]/20 transition-all rounded-xl"
            />
          </div>
        </div>

        {/* Password Field with live strength calculation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Kata Sandi Baru
            </Label>
            {password && (
              <span className={`text-[11px] font-semibold transition-colors ${passwordStats.textColor}`}>
                {passwordStats.label}
              </span>
            )}
          </div>

          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6545FF] transition-colors pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              autoComplete="new-password"
              className="h-10 pl-10 pr-10 text-xs bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#6545FF] focus:ring-2 focus:ring-[#6545FF]/20 transition-all rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Interactive Password Strength Meter Bar */}
          {password.length > 0 && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-all duration-300 ${
                      passwordStats.score >= step ? passwordStats.colorClass : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Requirement Checkpoints */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-0.5">
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    passwordStats.hasMinLength ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                      passwordStats.hasMinLength
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Min. 6 Karakter</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    passwordStats.hasUpperAndLower || passwordStats.hasNumberOrSpecial
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                      passwordStats.hasUpperAndLower || passwordStats.hasNumberOrSpecial
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Kombinasi Huruf & Angka</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 bg-white text-[#6545FF] focus:ring-[#6545FF] focus:ring-offset-0 cursor-pointer accent-[#6545FF]"
            />
            <span className="text-xs text-slate-600 leading-snug">
              Saya menyetujui{" "}
              <span className="text-slate-900 font-medium underline underline-offset-2">
                Ketentuan Layanan
              </span>{" "}
              dan{" "}
              <span className="text-slate-900 font-medium underline underline-offset-2">
                Kebijakan Privasi
              </span>{" "}
              CareerSync.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={pending || !agreedTerms}
          className="w-full h-10 text-xs font-semibold gap-2 mt-2 bg-[#6545FF] hover:bg-[#5636EC] text-white transition-all shadow-md shadow-[#6545FF]/25 hover:shadow-[#6545FF]/40 hover:-translate-y-0.5 active:translate-y-0 rounded-xl border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Mendaftarkan Akun Anda...</span>
            </>
          ) : (
            <>
              <span>Buat Akun Gratis Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium">atau daftar dengan</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <div>
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-2.5 h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Daftar dengan Google</span>
        </button>
      </div>

      {/* Bottom Switch Note */}
      <div className="pt-1 text-center">
        <p className="text-xs text-slate-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-[#6545FF] font-semibold hover:underline underline-offset-4 transition-colors"
          >
            Masuk ke Akun Anda
          </Link>
        </p>
      </div>
    </div>
  );
}
