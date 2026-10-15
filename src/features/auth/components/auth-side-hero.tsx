"use client";

import { useState } from "react";
import {
  Zap,
  BookmarkCheck,
  Send,
  CalendarCheck,
  Award,
  Kanban,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface Capability {
  title: string;
  desc: string;
}

const features: Capability[] = [
  {
    title: "Kanban & Grid Board",
    desc: "Visualisasikan status lamaran dari Tersimpan hingga Offering.",
  },
  {
    title: "Multi-Source Job Scraper",
    desc: "Agregasi loker JobStreet, Glints, Threads, dan LinkedIn.",
  },
  {
    title: "Deadline & Interview Alert",
    desc: "Pengingat otomatis jadwal wawancara kerja dan masa kedaluwarsa.",
  },
];

export function AuthSideHero() {
  return (
    <div className="relative flex flex-col justify-between p-8 xl:p-14 bg-linear-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#1E40AF] text-white select-none min-h-full overflow-hidden">
      {/* ─── Ambient Glow Accents ─── */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* ─── Top Brand Header ─── */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-inner">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-sans">
                CareerSync
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/15 border border-white/20 text-white rounded-full uppercase tracking-wider">
                Management System
              </span>
            </div>
            <p className="text-[11px] text-blue-100/75 font-normal">
              Smart Career & Application Tracker
            </p>
          </div>
        </div>
      </div>

      {/* ─── Center Hero Content ─── */}
      <div className="relative z-10 my-auto py-8 space-y-6 max-w-xl">
        {/* Main Bold Headline */}
        <div className="space-y-3.5">
          <h1 className="text-3xl xl:text-4xl 2xl:text-[42px] font-extrabold tracking-tight text-white leading-[1.2]">
            Smart Career &amp; Application{" "}
            <span className="text-cyan-300">Management</span>
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-normal max-w-lg">
            Platform modern untuk melacak alur rekrutmen kerja, monitoring jadwal interview,
            arsip berkas lamaran, serta manajemen operasional karir secara real-time dengan performa tinggi dan tampilan profesional.
          </p>
        </div>

        {/* ─── 3 Feature Stat Badges (Like SiMERPATIK: 24/7, Real-Time, Secure) ─── */}
        <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between">
            <div className="font-bold text-base text-white">4 Platform</div>
            <div className="text-[11px] text-blue-100/75 mt-0.5 leading-tight">
              Scraper Multi-Portal
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between">
            <div className="font-bold text-base text-white">Real-Time</div>
            <div className="text-[11px] text-blue-100/75 mt-0.5 leading-tight">
              Kanban Job Tracking
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between">
            <div className="font-bold text-base text-white">Secure</div>
            <div className="text-[11px] text-blue-100/75 mt-0.5 leading-tight">
              Row-Level Privacy
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Footer ─── */}
      <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-100/70">
        <p>&copy; {new Date().getFullYear()} CareerSync System</p>
        <p className="text-[11px] text-blue-100/80">Career Acceleration Workspace</p>
      </div>
    </div>
  );
}
