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

interface JourneyStage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof BookmarkCheck;
  accentColor: string;
  badge: string;
}

const stages: JourneyStage[] = [
  {
    id: "wishlist",
    step: "01",
    title: "Eksplorasi & Catat",
    subtitle: "Katalog Peluang Karir",
    description:
      "Kumpulkan lowongan potensial dari LinkedIn, JobStreet, atau relasi ke dalam satu daftar rapi sebelum mengajukan berkas.",
    icon: BookmarkCheck,
    accentColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    badge: "Tahap Awal",
  },
  {
    id: "applied",
    step: "02",
    title: "Lamaran Terkirim",
    subtitle: "Tracking Riwayat Pengajuan",
    description:
      "Catat tanggal pengiriman, versi resume, dan link portofolio yang diajukan untuk mempermudah tindak lanjut.",
    icon: Send,
    accentColor: "text-[#6545FF] border-[#6545FF]/30 bg-[#6545FF]/10",
    badge: "Dalam Proses",
  },
  {
    id: "interview",
    step: "03",
    title: "Sesi Wawancara",
    subtitle: "Jadwal & Pengingat Otomatis",
    description:
      "Kelola jadwal temu pewawancara teknis, HR, dan tugas studi kasus dengan notifikasi tanggal tenggat.",
    icon: CalendarCheck,
    accentColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    badge: "Krusial",
  },
  {
    id: "offer",
    step: "04",
    title: "Penawaran & Keputusan",
    subtitle: "Evaluasi Paket Kontrak",
    description:
      "Tinjau offering letter, kompensasi gaji, benefit, dan putuskan langkah karir berikutnya dengan percaya diri.",
    icon: Award,
    accentColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    badge: "Tahap Akhir",
  },
];

export function AuthSideHero() {
  const [activeStageId, setActiveStageId] = useState<string>("interview");

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[2];
  const StageIcon = currentStage.icon;

  return (
    <div className="relative flex flex-col justify-between p-8 xl:p-14 bg-[#080A14] text-[#F8FAFC] overflow-hidden select-none min-h-full border-r border-[#1A223D]">
      {/* ─── Ambient Glow Gradients ─── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6545FF]/12 rounded-full blur-3xl pointer-events-none animate-ambient-drift" />
      <div
        className="absolute bottom-12 left-1/3 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none animate-ambient-drift"
        style={{ animationDelay: "-6s" }}
      />
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-[#6545FF]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle geometric dot matrix overlay with center mask */}
      <div className="absolute inset-0 bg-[radial-gradient(#6545ff18_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_75%)] pointer-events-none" />

      {/* ─── Top Header (Centered Brand) ─── */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6545FF] to-[#4F35CC] text-white shadow-lg shadow-[#6545FF]/25 border border-white/10">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-sans">
                CareerSync
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#6545FF]/15 border border-[#6545FF]/30 text-[#A594FF] rounded-full uppercase tracking-wider">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-normal">Job Application Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E1428] border border-[#1E284A] text-[11px] text-[#94A3B8]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="font-medium text-slate-300">Sistem Aktif</span>
        </div>
      </div>

      {/* ─── Center Visual Showcase (Centered Alignment) ─── */}
      <div className="relative z-10 my-auto py-8 space-y-7 max-w-lg mx-auto flex flex-col items-center text-center">
        {/* Main Headline & Badge */}
        <div className="space-y-3 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121933] border border-[#232F55] text-xs text-[#A594FF] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6545FF]" />
            <span>Alur Pelacakan Karir Terstruktur</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.2] text-center">
            Kendalikan arah karir Anda dengan{" "}
            <span className="bg-gradient-to-r from-white via-[#C3B7FF] to-cyan-300 bg-clip-text text-transparent">
              presisi & ketenangan
            </span>
            .
          </h2>

          <p className="text-xs xl:text-sm text-[#94A3B8] leading-relaxed font-normal text-center max-w-md">
            CareerSync memandu setiap proses lamaran kerja melalui alur 4 fase komprehensif, mulai dari eksplorasi hingga kesepakatan offering.
          </p>
        </div>

        {/* ─── Interactive Journey Stage Card ─── */}
        <div className="w-full rounded-2xl border border-[#1E284A] bg-[#0B0F1E]/90 p-5 backdrop-blur-xl shadow-xl shadow-black/40 space-y-4 relative overflow-hidden text-left transition-all duration-300">
          {/* Subtle accent border glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#6545FF]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Active Stage Highlight View */}
          <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#1A2340]">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${currentStage.accentColor}`}
              >
                <StageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#6545FF] font-semibold">
                    Fase {currentStage.step}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#161F3B] text-[#94A3B8] border border-[#232F55] font-medium">
                    {currentStage.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                  {currentStage.title}
                </h3>
              </div>
            </div>

            <span className="text-[11px] text-[#64748B] font-mono shrink-0">
              {currentStage.subtitle}
            </span>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed font-normal">
            {currentStage.description}
          </p>

          {/* Interactive Stage Step Ribbon */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-2 font-medium">
              <span>Pilih fase alur untuk ditinjau:</span>
              <span className="text-[#A594FF] font-mono text-[10px]">
                ✦ Klik untuk beralih
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {stages.map((stage) => {
                const isActive = activeStageId === stage.id;
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#6545FF]/20 border-[#6545FF] text-white shadow-sm shadow-[#6545FF]/30 scale-[1.02]"
                        : "bg-[#0E1428] border-[#1A2340] text-[#64748B] hover:text-[#94A3B8] hover:border-[#2A375E]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 mb-1 ${isActive ? "text-[#A594FF]" : "text-[#64748B]"}`} />
                    <span className="text-[10px] font-semibold truncate w-full">{stage.step}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Real App Capabilities (Centered Grid) ─── */}
        <div className="w-full grid grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-[#0B0F1E] border border-[#1A2340] hover:border-[#6545FF]/40 transition-colors flex flex-col items-center text-center">
            <Kanban className="w-4 h-4 text-[#6545FF] mb-1.5" />
            <span className="font-semibold text-white block text-xs">Dual View</span>
            <span className="text-[10px] text-[#64748B] mt-0.5 block">Kanban & Grid Cards</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0F1E] border border-[#1A2340] hover:border-cyan-500/40 transition-colors flex flex-col items-center text-center">
            <Clock className="w-4 h-4 text-cyan-400 mb-1.5" />
            <span className="font-semibold text-white block text-xs">Pengingat Jadwal</span>
            <span className="text-[10px] text-[#64748B] mt-0.5 block">Alert Interview & Deadline</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0F1E] border border-[#1A2340] hover:border-emerald-500/40 transition-colors flex flex-col items-center text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
            <span className="font-semibold text-white block text-xs">PostgreSQL RLS</span>
            <span className="text-[10px] text-[#64748B] mt-0.5 block">Isolasi Data Terenkripsi</span>
          </div>
        </div>
      </div>

      {/* ─── Bottom Footer (Centered) ─── */}
      <div className="relative z-10 pt-4 border-t border-[#161F3B] flex items-center justify-between text-xs text-[#64748B]">
        <p>&copy; {new Date().getFullYear()} CareerSync. Personal Career Intelligence.</p>
        <span className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Privasi Akun Terlindungi</span>
        </span>
      </div>
    </div>
  );
}
