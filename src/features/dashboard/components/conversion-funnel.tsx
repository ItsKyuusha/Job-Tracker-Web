import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Layers } from "lucide-react";

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
    <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Alur Pipeline Lamaran
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Tingkat Tawaran: <strong className="text-foreground">{offerPct}%</strong>
          </span>
        </div>

        {/* Visual Multi-step Bar */}
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(stats.saved / stats.total) * 100}%` }}
            className="bg-zinc-400 dark:bg-zinc-600 transition-all"
            title={`Tersimpan: ${stats.saved}`}
          />
          <div
            style={{ width: `${(stats.applied / stats.total) * 100}%` }}
            className="bg-blue-500 transition-all"
            title={`Terkirim: ${stats.applied}`}
          />
          <div
            style={{ width: `${(stats.interview / stats.total) * 100}%` }}
            className="bg-violet-500 transition-all"
            title={`Interview: ${stats.interview}`}
          />
          <div
            style={{ width: `${(stats.offer / stats.total) * 100}%` }}
            className="bg-emerald-500 transition-all"
            title={`Penawaran: ${stats.offer}`}
          />
        </div>

        {/* Legend metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <span className="text-muted-foreground">Tersimpan:</span>
            <span className="font-semibold text-foreground">{stats.saved}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Terkirim:</span>
            <span className="font-semibold text-foreground">{stats.applied}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-muted-foreground">Interview:</span>
            <span className="font-semibold text-foreground">{stats.interview}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Penawaran:</span>
            <span className="font-semibold text-foreground">{stats.offer}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
