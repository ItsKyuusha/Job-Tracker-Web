import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import Link from "next/link";

type DeadlineItem = {
  deadline_at: string | null;
  jobs: { title: string; company_name: string } | null;
};

export function UpcomingDeadlines({ deadlines }: { deadlines: DeadlineItem[] }) {
  if (deadlines.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            Deadline Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Tidak ada deadline yang akan datang.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarClock className="w-4 h-4" />
          Deadline Mendatang
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((item, i) => {
          const daysLeft = item.deadline_at
            ? Math.ceil(
                (new Date(item.deadline_at).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

          const isUrgent = daysLeft !== null && daysLeft <= 3;

          return (
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
                  className={
                    isUrgent
                      ? "text-xs bg-red-100 text-red-700"
                      : "text-xs bg-orange-100 text-orange-700"
                  }
                >
                  {formatRelativeDate(item.deadline_at)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.deadline_at)}
                </span>
              </div>
            </div>
          );
        })}
        <div className="pt-2 border-t">
          <Link
            href="/jobs"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Lihat semua lowongan →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
