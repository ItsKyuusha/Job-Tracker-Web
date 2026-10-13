import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { CalendarClock, ArrowUpRight, AlertCircle } from "lucide-react";
import Link from "next/link";

type DeadlineItem = {
  deadline_at: string | null;
  jobs: { id?: string; title: string; company_name: string } | null;
};

export function UpcomingDeadlines({ deadlines }: { deadlines: DeadlineItem[] }) {
  if (deadlines.length === 0) {
    return (
      <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Jadwal & Deadline Mendatang</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <p className="text-xs text-muted-foreground">
            Tidak ada deadline atau jadwal interview dalam waktu dekat.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Jadwal & Deadline Mendatang</span>
        </CardTitle>
        <Link href="/jobs" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold transition-colors">
          <span>Semua Lowongan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-border/40 p-0">
        {deadlines.map((item, i) => {
          const daysLeft = item.deadline_at
            ? Math.ceil(
                (new Date(item.deadline_at).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

          const isUrgent = daysLeft !== null && daysLeft <= 3;

          return (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="min-w-0 pr-3">
                <p className="text-xs font-bold text-foreground truncate">
                  {item.jobs?.title ?? "—"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-medium">
                  {item.jobs?.company_name ?? "—"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    isUrgent
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                  }`}
                >
                  {isUrgent && <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />}
                  {formatRelativeDate(item.deadline_at)}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formatDate(item.deadline_at)}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
