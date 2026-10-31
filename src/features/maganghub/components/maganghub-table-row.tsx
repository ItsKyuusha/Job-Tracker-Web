import Link from "next/link";
import { formatDate, getCompanyGradient } from "@/lib/utils";
import type { MaganghubListItem } from "@/features/maganghub/types";
import {
  MapPin,
  Banknote,
  Clock,
  Target,
  Users,
  ExternalLink,
  Eye,
  Pencil,
} from "lucide-react";

type MaganghubTableRowProps = {
  listing: MaganghubListItem;
};

function formatAllowance(amount: number | null): string {
  if (!amount) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MaganghubTableRow({ listing }: MaganghubTableRowProps) {
  const initial = listing.company_name?.charAt(0)?.toUpperCase() || "M";
  const gradientClass = getCompanyGradient(listing.company_name);

  const quota = listing.quota;
  const total = listing.total_applicants;
  const ratio = quota && quota > 0 && total != null ? total / quota : null;
  const competitionColor =
    ratio == null
      ? ""
      : ratio >= 2
      ? "text-rose-600 dark:text-rose-400"
      : ratio >= 1
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <tr className="border-b border-border/50 transition-colors hover:bg-muted/40 group">
      {/* Perusahaan & Posisi */}
      <td className="px-4 py-3 min-w-0">
        <Link href={`/maganghub/${listing.id}`} className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg bg-linear-to-br ${gradientClass} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate max-w-52">
              {listing.title}
            </p>
            <p className="text-[11px] text-muted-foreground truncate max-w-52 font-medium">
              {listing.company_name}
            </p>
          </div>
        </Link>
      </td>

      {/* Lokasi */}
      <td className="px-4 py-3">
        {listing.location ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-violet-500 shrink-0" />
            <span className="truncate max-w-32">{listing.location}</span>
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Uang Saku */}
      <td className="px-4 py-3">
        {listing.allowance ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
            <Banknote className="w-3 h-3 text-emerald-500 shrink-0" />
            {formatAllowance(listing.allowance)}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Hari Kerja */}
      <td className="px-4 py-3">
        {listing.work_days ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
            <Clock className="w-3 h-3 text-blue-500 shrink-0" />
            {listing.work_days} hr/mgg
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Kuota */}
      <td className="px-4 py-3">
        {quota != null ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
            <Target className="w-3 h-3 text-violet-500 shrink-0" />
            {quota} slot
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Pelamar */}
      <td className="px-4 py-3">
        {total != null ? (
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${competitionColor || "text-slate-700 dark:text-slate-300"}`}>
            <Users className="w-3 h-3 shrink-0" />
            {total} orang
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Link */}
      <td className="px-4 py-3">
        {listing.source_url ? (
          <a
            href={listing.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            Buka
          </a>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Tanggal */}
      <td className="px-4 py-3">
        <span className="font-mono text-[10px] text-muted-foreground">
          {formatDate(listing.created_at)}
        </span>
      </td>

      {/* Aksi */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/maganghub/${listing.id}`}
            title="Lihat detail"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/maganghub/${listing.id}/edit`}
            title="Edit"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
        </div>
      </td>
    </tr>
  );
}


