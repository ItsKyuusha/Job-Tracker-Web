import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelativeDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/database";
import { Activity, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ActivityItem = {
  status: ApplicationStatus;
  updated_at: string;
  jobs: { id?: string; title: string; company_name: string } | null;
};

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Aktivitas Terbaru</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center space-y-3">
          <p className="text-xs text-muted-foreground">Belum ada aktivitas lamaran yang tercatat.</p>
          <Button asChild size="sm" variant="outline" className="text-xs h-8">
            <Link href="/jobs/new">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Catat Lowongan Pertama
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/80 bg-card/70 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Aktivitas Terbaru</span>
        </CardTitle>
        <Link href="/jobs" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold transition-colors">
          <span>Lihat Semua</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-border/40 p-0">
        {activities.map((item, i) => {
          const jobId = item.jobs?.id;
          const Wrapper = ({ children }: { children: React.ReactNode }) =>
            jobId ? (
              <Link href={`/jobs/${jobId}`} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                {children}
              </Link>
            ) : (
              <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                {children}
              </div>
            );

          return (
            <Wrapper key={i}>
              <div className="min-w-0 pr-3">
                <p className="text-xs font-bold text-foreground truncate">
                  {item.jobs?.title ?? "—"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-medium">
                  {item.jobs?.company_name ?? "—"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <StatusBadge status={item.status} />
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formatRelativeDate(item.updated_at)}
                </span>
              </div>
            </Wrapper>
          );
        })}
      </CardContent>
    </Card>
  );
}
