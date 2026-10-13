import { Card, CardContent } from "@/components/ui/card";
import { Layers, Sparkles } from "lucide-react";

type FunnelStats = {
  total: number;
  saved: number;
  applied: number;
  interview: number;
  offer: number;
};

export function ConversionFunnel({ stats }: { stats: FunnelStats }) {
  if (stats.total === 0) return null;

  const appliedPct = Math.round((stats.applied / stats.total) * 100) || 0;
  const interviewPct = Math.round((stats.interview / stats.total) * 100) || 0;
  const offerPct = Math.round((stats.offer / stats.total) * 100) || 0;

  return (
    <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-xs">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Alur Konversi Lamaran
              </span>
              <p className="text-[11px] text-muted-foreground">
                Distribusi seluruh lowongan dalam tahapan seleksi karir
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Rate: {offerPct}% Offer</span>
          </div>
        </div>

        {/* Multi-gradient visual bar */}
        <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden flex p-0.5 ring-1 ring-border/50">
          <div
            style={{ width: `${Math.max(2, (stats.saved / stats.total) * 100)}%` }}
            className="bg-slate-400 dark:bg-slate-500 rounded-l-full transition-all"
            title={`Tersimpan: ${stats.saved}`}
          />
          <div
            style={{ width: `${(stats.applied / stats.total) * 100}%` }}
            className="bg-blue-500 transition-all shadow-xs"
            title={`Terkirim: ${stats.applied}`}
          />
          <div
            style={{ width: `${(stats.interview / stats.total) * 100}%` }}
            className="bg-violet-500 transition-all shadow-xs"
            title={`Interview: ${stats.interview}`}
          />
          <div
            style={{ width: `${(stats.offer / stats.total) * 100}%` }}
            className="bg-emerald-500 rounded-r-full transition-all shadow-xs"
            title={`Penawaran: ${stats.offer}`}
          />
        </div>

        {/* Legend metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/30 border border-border/40 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] text-muted-foreground block truncate">Tersimpan</span>
              <span className="font-bold text-foreground text-sm">{stats.saved}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] text-blue-600 dark:text-blue-400 block truncate">Terkirim</span>
              <span className="font-bold text-foreground text-sm">{stats.applied}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-violet-500/5 border border-violet-500/20 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] text-violet-600 dark:text-violet-400 block truncate">Interview</span>
              <span className="font-bold text-foreground text-sm">{stats.interview}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block truncate">Penawaran</span>
              <span className="font-bold text-foreground text-sm">{stats.offer}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
