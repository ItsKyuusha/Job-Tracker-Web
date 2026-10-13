import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import type { ApplicationStatus, EmploymentType, WorkplaceType } from "@/types/database";

// ─── Label maps ────────────────────────────────────────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Tersimpan",
  applied: "Terkirim",
  assessment: "Assessment",
  interview: "Interview",
  offer: "Penawaran",
  rejected: "Ditolak",
  withdrawn: "Dibatalkan",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Kontrak",
  freelance: "Freelance",
  internship: "Magang",
};

export const WORKPLACE_TYPE_LABELS: Record<WorkplaceType, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

// ─── Status pills style (Linear Light / Vercel Dark high contrast) ──────────────

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  saved: {
    bg: "bg-slate-100 dark:bg-slate-900/60",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300/80 dark:border-slate-700/60",
    dot: "bg-slate-500",
  },
  applied: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-500/30 dark:border-blue-500/30",
    dot: "bg-blue-500",
  },
  assessment: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-500/30 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  interview: {
    bg: "bg-violet-500/10 dark:bg-violet-500/20",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-500/30 dark:border-violet-500/30",
    dot: "bg-violet-500 animate-pulse",
  },
  offer: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-500/30 dark:border-emerald-500/30",
    dot: "bg-emerald-500 shadow-xs shadow-emerald-500",
  },
  rejected: {
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-500/30 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  withdrawn: {
    bg: "bg-slate-100 dark:bg-slate-900/40",
    text: "text-slate-500 dark:text-slate-400",
    border: "border-slate-300 dark:border-slate-800",
    dot: "bg-slate-400",
  },
};

// Legacy backwards compatibility
export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  saved: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800",
  applied: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900",
  assessment: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900",
  interview: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-900",
  offer: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
  rejected: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900",
  withdrawn: "bg-zinc-100 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800",
};

// ─── Company initials color generator ─────────────────────────────────────────

export function getCompanyGradient(name: string): string {
  const gradients = [
    "from-blue-600 to-indigo-600",
    "from-violet-600 to-purple-600",
    "from-emerald-600 to-teal-600",
    "from-rose-600 to-pink-600",
    "from-amber-600 to-orange-600",
    "from-cyan-600 to-blue-600",
    "from-fuchsia-600 to-violet-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// ─── Format helpers ────────────────────────────────────────────────────────────

export function formatDate(date: string | null | undefined): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date: string | null | undefined): string {
  if (!date) return "-";
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  if (diffDays === -1) return "Kemarin";
  if (diffDays > 1 && diffDays <= 7) return `${diffDays} hari lagi`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} hari lalu`;
  return formatDate(date);
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency = "IDR"
): string {
  if (!min && !max) return "-";
  const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  if (min && max) return `${fmt.format(min)} - ${fmt.format(max)}`;
  if (min) return `Mulai ${fmt.format(min)}`;
  return `Hingga ${fmt.format(max!)}`;
}
