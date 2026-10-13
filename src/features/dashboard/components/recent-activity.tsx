import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, formatRelativeDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/database";
import { Activity } from "lucide-react";
import Link from "next/link";

type ActivityItem = {
  status: ApplicationStatus;
  updated_at: string;
  jobs: { title: string; company_name: string } | null;
};

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
            <Link
              href="/jobs/new"
              className="text-sm font-medium hover:underline mt-2"
            >
              Tambah lowongan pertama
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {item.jobs?.title ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.jobs?.company_name ?? "—"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge
                variant="secondary"
                className={`text-xs ${APPLICATION_STATUS_COLORS[item.status]}`}
              >
                {APPLICATION_STATUS_LABELS[item.status]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(item.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
