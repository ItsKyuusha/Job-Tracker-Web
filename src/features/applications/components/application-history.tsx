import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import type { ApplicationEvent } from "@/types/database";
import { History, ArrowRight } from "lucide-react";

type ApplicationHistoryProps = {
  events: ApplicationEvent[];
};

export function ApplicationHistory({ events }: ApplicationHistoryProps) {
  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-primary" />
          <span>Riwayat Perubahan Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative space-y-0">
          {events.map((event, i) => (
            <div key={event.id} className="flex gap-3">
              {/* Vertical line indicator */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 ring-2 ring-primary/20" />
                {i < events.length - 1 && (
                  <div className="w-px flex-1 bg-border my-1" />
                )}
              </div>

              {/* Event Content */}
              <div className="pb-4 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {event.from_status && (
                    <>
                      <StatusBadge status={event.from_status} showDot={false} className="text-[10px] px-2 py-0" />
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </>
                  )}
                  <StatusBadge status={event.to_status} className="text-[10px] px-2 py-0" />
                </div>

                {event.notes && (
                  <p className="text-xs text-foreground bg-muted/40 p-2 rounded-md mt-1.5 border border-border/40">
                    {event.notes}
                  </p>
                )}

                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatDate(event.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
