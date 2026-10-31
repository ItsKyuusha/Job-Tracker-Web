import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
  formatDate,
  formatRelativeDate,
  getCompanyGradient,
} from "@/lib/utils";
import type { JobListItem } from "@/features/jobs/types";
import {
  MapPin,
  Monitor,
  Briefcase,
  CalendarClock,
  Archive,
  Eye,
  Pencil,
} from "lucide-react";

type JobTableRowProps = {
  job: JobListItem;
};

export function JobTableRow({ job }: JobTableRowProps) {
  const application = job.applications?.[0];
  const status = application?.status ?? "saved";
  const isArchived = !job.is_active;

  const initial = job.company_name?.charAt(0)?.toUpperCase() || "J";
  const gradientClass = getCompanyGradient(job.company_name);

  return (
    <tr
      className={`border-b border-border/50 transition-colors hover:bg-muted/40 group ${
        isArchived ? "opacity-60" : ""
      }`}
    >
      {/* Perusahaan & Posisi */}
      <td className="px-4 py-3 min-w-0">
        <Link href={`/jobs/${job.id}`} className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg bg-linear-to-br ${gradientClass} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-xs text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-52">
                {job.title}
              </p>
              {isArchived && (
                <Archive className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate max-w-52 font-medium">
              {job.company_name}
            </p>
          </div>
        </Link>
      </td>

      {/* Status */}
      <td className="px-4 py-3 shrink-0">
        <StatusBadge status={status} />
      </td>

      {/* Lokasi */}
      <td className="px-4 py-3">
        {job.location ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="truncate max-w-36">{job.location}</span>
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Tempat Kerja */}
      <td className="px-4 py-3">
        {job.workplace_type ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
            <Monitor className="w-3 h-3 text-blue-500 shrink-0" />
            {WORKPLACE_TYPE_LABELS[job.workplace_type]}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Tipe */}
      <td className="px-4 py-3">
        {job.employment_type ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
            <Briefcase className="w-3 h-3 text-emerald-500 shrink-0" />
            {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Deadline */}
      <td className="px-4 py-3">
        {job.deadline_at ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <CalendarClock className="w-3 h-3 shrink-0" />
            {formatRelativeDate(job.deadline_at)}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Tanggal Dibuat */}
      <td className="px-4 py-3">
        <span className="font-mono text-[10px] text-muted-foreground">
          {formatDate(job.created_at)}
        </span>
      </td>

      {/* Aksi */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/jobs/${job.id}`}
            title="Lihat detail"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/jobs/${job.id}/edit`}
            title="Edit"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
        </div>
      </td>
    </tr>
  );
}
