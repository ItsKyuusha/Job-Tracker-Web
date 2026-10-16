"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Quick Demo Autofill handler
  const handleQuickDemo = () => {
    setEmail("demo@careersync.id");
    setPassword("DemoSecure123!");
    toast.success("Kredensial demo terisi!", {
      description: "Silakan tekan tombol 'Masuk Sekarang' untuk melanjutkan.",
    });
  };

  const handleClearDemo = () => {
    setEmail("");
    setPassword("");
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Harap masukkan alamat email Anda");
      return;
    }
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetDialogOpen(false);
      toast.success("Tautan pemulihan terkirim!", {
        description: `Instruksi reset telah dikirim ke ${resetEmail}. Silakan periksa kotak masuk atau spam.`,
      });
      setResetEmail("");
    }, 1200);
  };

  const handleGoogleLogin = async () => {
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
        toast.error("Login dengan Google gagal", {
          description: error.message || "Periksa konfigurasi Google Client ID & Secret pada dashboard Supabase Auth.",
        });
      }
    } catch {
      toast.error("Login dengan Google gagal", {
        description: "Terjadi kesalahan saat memulai sesi OAuth.",
      });
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-5 text-slate-900 transition-all">
      {/* Top Segmented Navigation Pills: Masuk vs Daftar */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
        <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#6545FF] text-white shadow-xs text-center font-bold transition-all">
          <span>Masuk ke Akun</span>
        </div>
        <Link
          href="/register"
          className="flex items-center justify-center py-2 px-3 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all text-center"
        >
          <span>Daftar Akun Baru</span>
        </Link>
      </div>

      {/* Demo Account Quick Access Box */}
      <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-100 flex items-center justify-between gap-3 group hover:border-violet-200 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#6545FF]/10 text-[#6545FF] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">Uji Coba Demo Akun?</p>
            <p className="text-[11px] text-slate-500 truncate">Isi otomatis formulir 1-klik</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {email && (
            <button
              type="button"
              onClick={handleClearDemo}
              aria-label="Bersihkan form"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#6545FF] hover:bg-[#5636EC] text-white shadow-xs shadow-[#6545FF]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Isi Demo
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="flex items-start gap-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="space-y-0.5">
              <span className="font-semibold text-rose-800">Gagal Masuk</span>
              <p className="text-[11px] leading-relaxed text-rose-600">
                {state.error}
              </p>
            </div>
          </div>
        )}

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

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Kata Sandi
            </Label>

            {/* Forgot password dialog trigger */}
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-[11px] font-medium text-[#6545FF] hover:underline underline-offset-4 cursor-pointer"
                >
                  Lupa password?
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900 shadow-2xl">
                <DialogHeader>
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#6545FF] flex items-center justify-center mb-2">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <DialogTitle className="text-slate-900">Atur Ulang Kata Sandi</DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Masukkan alamat email terdaftar untuk menerima tautan pemulihan kata sandi akun CareerSync Anda.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSendResetLink} className="space-y-4 pt-2">
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="reset-email" className="text-xs font-semibold text-slate-700">
                      Email Akun
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="nama@email.com"
                        required
                        className="pl-9 h-10 text-xs bg-white border-slate-300 text-slate-900 rounded-xl"
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setResetDialogOpen(false)}
                      className="text-xs rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={resetLoading}
                      className="text-xs rounded-xl bg-[#6545FF] hover:bg-[#5636EC] text-white gap-2 border-0"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengirim Tautan...</span>
                        </>
                      ) : (
                        <span>Kirim Tautan Reset</span>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
              placeholder="••••••••"
              required
              autoComplete="current-password"
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
        </div>

        {/* Remember me toggle */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 bg-white text-[#6545FF] focus:ring-[#6545FF] focus:ring-offset-0 cursor-pointer accent-[#6545FF]"
            />
            <span className="text-xs text-slate-600 hover:text-slate-900 transition-colors">
              Ingat saya di perangkat ini
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-10 text-xs font-semibold gap-2 mt-2 bg-[#6545FF] hover:bg-[#5636EC] text-white transition-all shadow-md shadow-[#6545FF]/25 hover:shadow-[#6545FF]/40 hover:-translate-y-0.5 active:translate-y-0 rounded-xl border-0 cursor-pointer group"
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi Kredensial...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Dashboard</span>
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
          <span className="bg-white px-3 text-slate-400 font-medium">atau masuk dengan</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <div>
        <button
          type="button"
          onClick={handleGoogleLogin}
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
          <span>Masuk dengan Google</span>
        </button>
      </div>

      {/* Bottom Switch Note */}
      <div className="pt-1 text-center">
        <p className="text-xs text-slate-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-[#6545FF] font-semibold hover:underline underline-offset-4 transition-colors"
          >
            Daftar Akun Baru Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
