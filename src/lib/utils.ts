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
    bg: "bg-zinc-100 dark:bg-zinc-900/80",
    text: "text-zinc-700 dark:text-zinc-300",
    border: "border-zinc-200 dark:border-zinc-800",
    dot: "bg-zinc-400 dark:bg-zinc-500",
  },
  applied: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/60",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  assessment: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900/60",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  interview: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900/60",
    dot: "bg-violet-500 dark:bg-violet-400 animate-pulse",
  },
  offer: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/60",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  rejected: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-900/60",
    dot: "bg-rose-500 dark:bg-rose-400",
  },
  withdrawn: {
    bg: "bg-zinc-100 dark:bg-zinc-900/60",
    text: "text-zinc-500 dark:text-zinc-400",
    border: "border-zinc-200 dark:border-zinc-800",
    dot: "bg-zinc-400 dark:bg-zinc-600",
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
