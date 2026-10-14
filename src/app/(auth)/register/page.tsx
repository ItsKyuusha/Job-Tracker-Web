import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthSideHero } from "@/features/auth/components/auth-side-hero";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Akun — CareerSync Job Tracker",
  description: "Buat akun CareerSync gratis untuk melacak alur lowongan, interview, dan negosiasi tawaran kerja.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white text-slate-900 relative selection:bg-[#6545FF] selection:text-white">
      {/* ─── Left Column (60%): Dark Mode Auth Side Hero ─── */}
      <div className="lg:col-span-7 xl:col-span-7 hidden lg:block bg-[#080A14]">
        <AuthSideHero />
      </div>

      {/* ─── Right Column (40%): Light Mode Authentication Form ─── */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 relative z-10 min-h-screen bg-slate-50/70 border-l border-slate-200/80">
        {/* Ambient subtle light aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Navigation */}
        <div className="relative z-10 flex items-center justify-between gap-3 pb-6">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6545FF] to-[#4F35CC] flex items-center justify-center text-white shadow-md shadow-[#6545FF]/30 transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">CareerSync</span>
              <p className="text-[10px] text-slate-500 font-medium">Job Application Intelligence</p>
            </div>
          </Link>

          {/* Right Action: Back link & Theme toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Form Container */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto py-6 space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-[#6545FF] border border-violet-100 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>Akses Penuh Tanpa Biaya</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Buat Akun CareerSync
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Mulai kelola alur lamaran kerja, persiapan wawancara, dan tawaran karir Anda secara terstruktur.
            </p>
          </div>

          {/* Main Form Component */}
          <RegisterForm />
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200">
          <span className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>PostgreSQL Row Level Security</span>
          </span>
          <span>&copy; {new Date().getFullYear()} CareerSync</span>
        </div>
      </div>
    </div>
  );
}
