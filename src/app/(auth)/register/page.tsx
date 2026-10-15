import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthSideHero } from "@/features/auth/components/auth-side-hero";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Akun — CareerSync",
  description: "Buat akun CareerSync untuk mulai melacak alur lowongan dan interview kerja Anda.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] relative selection:bg-blue-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Unified Rounded Dual-Pane Card Container (Expanded Canvas & 2:1 Ratio) ─── */}
      <div className="relative z-10 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/60 bg-white grid lg:grid-cols-12 min-h-[620px]">
        {/* Left Pane (67% / 8 cols): Modern Royal Blue Side Hero */}
        <div className="lg:col-span-8 hidden lg:block">
          <AuthSideHero />
        </div>

        {/* Right Pane (33% / 4 cols): Clean Focused Form Pane */}
        <div className="lg:col-span-4 flex flex-col justify-between p-7 sm:p-9 lg:p-8 xl:p-10 bg-white text-slate-900 border-l border-slate-100">
          {/* Top Quick Actions (Back & Theme) */}
          <div className="flex items-center justify-between pb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Form Header & Inputs */}
          <div className="my-auto space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900 leading-snug">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Daftarkan akun baru untuk mengelola proses rekrutmen kerja dan jadwal wawancara Anda.
              </p>
            </div>

            <RegisterForm />
          </div>

          {/* Bottom Sub-footer */}
          <div className="pt-3 text-center border-t border-slate-100 text-[11px] text-slate-400">
            Secure Access • CareerSync System
          </div>
        </div>
      </div>
    </div>
  );
}
