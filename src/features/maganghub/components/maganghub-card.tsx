import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getCompanyGradient } from "@/lib/utils";
import type { MaganghubListItem } from "@/features/maganghub/types";
import { MapPin, Banknote, CalendarDays, Clock } from "lucide-react";

type MaganghubCardProps = {
  listing: MaganghubListItem;
};

function formatAllowance(amount: number | null): string {
  if (!amount) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MaganghubCard({ listing }: MaganghubCardProps) {
  const initial = listing.company_name?.charAt(0)?.toUpperCase() || "M";
  const gradientClass = getCompanyGradient(listing.company_name);

  return (
    <Link href={`/maganghub/${listing.id}`} className="block group">
      <Card
        className="relative overflow-hidden border border-border/80 bg-card/80 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/5 hover:border-violet-500/40"
      >
        {/* Top color strip */}
        <div
          className={`h-1 w-full bg-linear-to-r ${gradientClass} opacity-80 group-hover:opacity-100 transition-opacity`}
        />

        <CardContent className="p-4 sm:p-5 space-y-3.5">
          {/* Header: Company Avatar + Position */}
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradientClass} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-violet-500/10 group-hover:scale-105 transition-transform`}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                {listing.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">
                {listing.company_name}
              </p>
            </div>
          </div>

          {/* Metadata Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {listing.location && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-muted/70 px-2.5 py-1 rounded-lg border border-border/60">
                <MapPin className="w-3 h-3 text-violet-500 shrink-0" />
                <span className="truncate max-w-32">{listing.location}</span>
              </span>
            )}
            {listing.work_days && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-muted/70 px-2.5 py-1 rounded-lg border border-border/60">
                <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                {listing.work_days} hari/minggu
              </span>
            )}
            {listing.allowance && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Banknote className="w-3 h-3 text-emerald-500 shrink-0" />
                {formatAllowance(listing.allowance)}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50">
            <span className="font-mono text-[10px]">
              Ditambah {formatDate(listing.created_at)}
            </span>
            {listing.source_url && (
              <span className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 font-semibold bg-violet-500/10 px-2 py-0.5 rounded-md">
                <CalendarDays className="w-3 h-3" />
                Ada Link
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
