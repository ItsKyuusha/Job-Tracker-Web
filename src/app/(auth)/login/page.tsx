import { LoginForm } from "@/features/auth/components/login-form";
import { AuthSideHero } from "@/features/auth/components/auth-side-hero";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Masuk — CareerSync",
  description: "Masuk ke CareerSync untuk mengelola lowongan kerja dan jadwal interview Anda.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0B0F17] via-[#111827] to-[#070A10] relative selection:bg-blue-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Unified Rounded Dual-Pane Card Container (60:30 Split with Photographic Background) ─── */}
      <div className="relative z-10 w-full max-w-[1360px] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-slate-700/50 bg-[url('/auth-bg.png')] bg-cover bg-center grid lg:grid-cols-10 min-h-[660px] lg:min-h-[720px]">
        {/* Left Pane (60% / 6 cols): Clean, Uncluttered Workspace Hero */}
        <div className="lg:col-span-6 hidden lg:flex flex-col">
          <AuthSideHero />
        </div>

        {/* Right Pane (40% / 4 cols with centered ~30% form): Focused Form Pane */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 xl:p-10 bg-white/85 sm:bg-white/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none text-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200/40">
          {/* Top Quick Actions (Back & Theme) */}
          <div className="flex items-center justify-between pb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-xl bg-white/80 hover:bg-white border border-slate-200/70 shadow-2xs backdrop-blur-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-0.5 border border-slate-200/70 shadow-2xs">
              <ThemeToggle />
            </div>
          </div>

          {/* Form Header & Inputs */}
          <div className="my-auto py-4 space-y-5 w-full max-w-[410px] mx-auto">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900 leading-snug">
                Welcome to CareerSync
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Silakan login menggunakan akun Anda untuk mengakses dashboard sistem.
              </p>
            </div>

            <LoginForm />
          </div>

          {/* Bottom Sub-footer */}
          <div className="pt-3 text-center border-t border-slate-200/50 text-[11px] text-slate-400">
            Secure Access • CareerSync System
          </div>
        </div>
      </div>
    </div>
  );
}
