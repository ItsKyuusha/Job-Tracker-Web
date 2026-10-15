import type { ScrapedJob } from "../types";

export type DateFilterOption = "all" | "24h" | "7d" | "14d" | "30d";

export const DATE_FILTER_OPTIONS: { id: DateFilterOption; label: string; desc: string }[] = [
  { id: "all", label: "Semua Waktu", desc: "Tampilkan seluruh lowongan" },
  { id: "24h", label: "24 Jam Terakhir", desc: "Postingan 1 hari ke belakang" },
  { id: "7d", label: "7 Hari Terakhir", desc: "Postingan 1 minggu terakhir" },
  { id: "14d", label: "14 Hari Terakhir", desc: "Postingan 2 minggu terakhir" },
  { id: "30d", label: "30 Hari Terakhir", desc: "Postingan 1 bulan terakhir" },
];

/**
 * Format any raw date or ISO string into human-friendly relative Indonesian text.
 * E.g. "Baru saja", "3 jam yang lalu", "Kemarin", "3 hari yang lalu", "2 minggu yang lalu"
 */
export function formatRelativeDate(raw: string | null | undefined): {
  relative: string;
  formattedDate?: string;
} | null {
  if (!raw || !raw.trim()) return null;
  const s = raw.trim();

  // Try parsing date directly
  const date = new Date(s);
  const isValidDate = !isNaN(date.getTime());

  if (isValidDate) {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let relative = "";
    if (diffMs < 0 || diffSec < 60) {
      relative = "Baru saja";
    } else if (diffMin < 60) {
      relative = `${diffMin} menit yang lalu`;
    } else if (diffHour < 24) {
      relative = `${diffHour} jam yang lalu`;
    } else if (diffDay === 1) {
      relative = "Kemarin";
    } else if (diffDay < 7) {
      relative = `${diffDay} hari yang lalu`;
    } else if (diffDay < 14) {
      relative = "1 minggu yang lalu";
    } else if (diffDay < 30) {
      relative = `${Math.floor(diffDay / 7)} minggu yang lalu`;
    } else if (diffDay < 60) {
      relative = "1 bulan yang lalu";
    } else {
      relative = `${Math.floor(diffDay / 30)} bulan yang lalu`;
    }

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

    return { relative, formattedDate };
  }

  // Fallback: If raw text is already short relative code (e.g., "1d", "3h", "2w")
  const shortMatch = s.match(/^(\d+)\s*([hdwm])$/i);
  if (shortMatch) {
    const n = shortMatch[1];
    const unit = shortMatch[2].toLowerCase();
    if (unit === "h") return { relative: `${n} jam yang lalu` };
    if (unit === "d") return { relative: `${n} hari yang lalu` };
    if (unit === "w") return { relative: `${n} minggu yang lalu` };
    if (unit === "m") return { relative: `${n} bulan yang lalu` };
  }

  // Fallback: English strings like "3 days ago", "1 week ago"
  const enMatch = s.match(/(\d+)\s*(hour|hours|day|days|week|weeks|month|months)\s*(?:ago)?/i);
  if (enMatch) {
    const n = enMatch[1];
    const unit = enMatch[2].toLowerCase();
    if (unit.startsWith("hour")) return { relative: `${n} jam yang lalu` };
    if (unit.startsWith("day")) return { relative: `${n} hari yang lalu` };
    if (unit.startsWith("week")) return { relative: `${n} minggu yang lalu` };
    if (unit.startsWith("month")) return { relative: `${n} bulan yang lalu` };
  }

  // Fallback: Indonesian relative string as-is
  if (/(hari|jam|minggu|bulan|kemarin|baru)/i.test(s)) {
    return { relative: s };
  }

  return { relative: s };
}

/**
 * Filter scraped jobs array based on selected DateFilterOption.
 */
/**
 * Deduplicate jobs on the client side.
 * Preserves the item with highest completeness if duplicate URL or duplicate Title+Company is encountered.
 */
export function deduplicateJobsClient(jobs: ScrapedJob[]): ScrapedJob[] {
  function getScore(job: ScrapedJob): number {
    let score = 0;
    if (job.description && job.description.length > 30) score += 4;
    if (job.salary_raw || job.salary_min) score += 3;
    if (job.posted_at) score += 2;
    if (job.location && job.location !== "Indonesia") score += 1;
    if (job.employment_type && job.employment_type !== "unknown") score += 1;
    if (job.workplace_type && job.workplace_type !== "unknown") score += 1;
    return score;
  }

  function cleanUrl(rawUrl: string): string {
    try {
      const u = new URL(rawUrl);
      u.searchParams.delete("refId");
      u.searchParams.delete("trackingId");
      u.searchParams.delete("position");
      u.searchParams.delete("pageNum");
      u.searchParams.delete("utm_source");
      u.searchParams.delete("utm_medium");
      u.searchParams.delete("utm_campaign");
      u.searchParams.delete("utm_referrer");
      u.searchParams.delete("traceInfo");
      return u.origin + u.pathname;
    } catch {
      return rawUrl.split("?")[0].toLowerCase().trim();
    }
  }

  function makeTitleKey(title: string, company: string): string {
    const t = title.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    const c = company.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    return `${t}@@${c}`;
  }

  const map = new Map<string, ScrapedJob>();
  const titleKeyToUrlKey = new Map<string, string>();

  for (const job of jobs) {
    const urlKey = cleanUrl(job.source_url);
    const titleKey = makeTitleKey(job.title, job.company);

    const existingKey = titleKeyToUrlKey.get(titleKey) || urlKey;
    const existing = map.get(existingKey);

    if (!existing) {
      map.set(urlKey, job);
      if (titleKey.length > 5) {
        titleKeyToUrlKey.set(titleKey, urlKey);
      }
    } else {
      if (getScore(job) > getScore(existing)) {
        map.delete(existingKey);
        map.set(urlKey, job);
        titleKeyToUrlKey.set(titleKey, urlKey);
      }
    }
  }

  return Array.from(map.values());
}

export function filterJobsByDate(
  jobs: ScrapedJob[],
  filter: DateFilterOption
): ScrapedJob[] {

  const now = Date.now();
  const maxHoursMap: Record<DateFilterOption, number> = {
    all: Infinity,
    "24h": 24,
    "7d": 24 * 7,
    "14d": 24 * 14,
    "30d": 24 * 30,
  };

  const maxMs = maxHoursMap[filter] * 60 * 60 * 1000;

  return jobs.filter((job) => {
    if (!job.posted_at) {
      // Exclude jobs without timestamp when user explicitly asks for specific recent timeframe
      return false;
    }

    const d = new Date(job.posted_at);
    if (!isNaN(d.getTime())) {
      const diffMs = now - d.getTime();
      // Allow up to 2 hours of clock drift for recent jobs
      return diffMs >= -7200000 && diffMs <= maxMs;
    }

    // Try parsing relative raw strings
    const lower = job.posted_at.toLowerCase();
    if (filter === "24h") {
      return (
        lower.includes("jam") ||
        lower.includes("hour") ||
        lower.includes("kemarin") ||
        lower.includes("1d") ||
        lower.includes("1 hari")
      );
    }
    if (filter === "7d") {
      if (lower.includes("jam") || lower.includes("kemarin") || lower.includes("hari")) {
        const dayMatch = lower.match(/(\d+)\s*hari/);
        if (dayMatch && parseInt(dayMatch[1]) > 7) return false;
        return true;
      }
      return lower.includes("1 minggu") || lower.includes("1w");
    }
    if (filter === "14d") {
      if (lower.includes("jam") || lower.includes("kemarin") || lower.includes("hari")) {
        const dayMatch = lower.match(/(\d+)\s*hari/);
        if (dayMatch && parseInt(dayMatch[1]) > 14) return false;
        return true;
      }
      return (
        lower.includes("1 minggu") ||
        lower.includes("2 minggu") ||
        lower.includes("1w") ||
        lower.includes("2w")
      );
    }
    if (filter === "30d") {
      if (lower.includes("bulan") && !lower.includes("1 bulan")) return false;
      return true;
    }

    return true;
  });
}
