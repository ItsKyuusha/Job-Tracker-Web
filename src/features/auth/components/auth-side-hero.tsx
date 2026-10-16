"use client";

import { Zap, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

export function AuthSideHero() {
  return (
    <div className="relative flex flex-col justify-between p-8 xl:p-12 text-slate-900 select-none min-h-full h-full overflow-hidden">
      {/* ─── Top Brand Header ─── */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-xs shadow-slate-200/50">
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-tight text-slate-900">CareerSync</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[11px] font-medium text-slate-500">Workspace</span>
          </div>
        </div>

        {/* Subtle Live Workspace status chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs text-[11px] font-medium text-slate-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Workspace</span>
        </div>
      </div>

      {/* ─── Upper Pitch (Above Laptop Negative Space) ─── */}
      <div className="relative z-10 pt-6 pb-2 max-w-lg space-y-2.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-blue-200/60 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Smart Career Tracker</span>
        </div>

        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
          Kawal Karir Impianmu Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Terarah &amp; Terukur</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
          Pantau tahapan lamaran, jadwal interview, dan arsip lowongan kerja dalam satu ruang kerja digital yang tenang dan produktif.
        </p>
      </div>

      {/* ─── Spacious Center Gap (Unobstructed Laptop & City View) ─── */}
      <div className="flex-1 min-h-[140px]" />

      {/* ─── Bottom Status & Privacy Bar ─── */}
      <div className="relative z-10 pt-4 flex items-center justify-between text-xs text-slate-500">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/90 text-[11px] font-medium text-slate-700 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Keamanan Terenkripsi &amp; Row-Level Privacy</span>
        </div>

        <div className="hidden xl:inline-flex items-center gap-1.5 text-[11px] text-slate-600 bg-white/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/70">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Career Acceleration Hub</span>
        </div>
      </div>
    </div>
  );
}
