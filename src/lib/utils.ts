export { cn } from "cn";

import type { ApplicationStatus, EmploymentType, WorkplaceType } from "@/types/database";

// ─── Label maps ────────────────────────────────────────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  assessment: "Assessment",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};

export const WORKPLACE_TYPE_LABELS: Record<WorkplaceType, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

// ─── Status color helpers ──────────────────────────────────────────────────────

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  saved: "bg-slate-100 text-slate-700",
  applied: "bg-blue-100 text-blue-700",
  assessment: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};

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
  if (min) return `Ab ${fmt.format(min)}`;
  return `Hingga ${fmt.format(max!)}`;
}
