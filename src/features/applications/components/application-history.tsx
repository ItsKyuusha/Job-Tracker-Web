import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  formatDate,
} from "@/lib/utils";
import type { ApplicationEvent } from "@/types/database";
import { History, ArrowRight } from "lucide-react";

type ApplicationHistoryProps = {
  events: ApplicationEvent[];
};

export function ApplicationHistory({ events }: ApplicationHistoryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <History className="w-4 h-4" />
          Riwayat Perubahan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {events.map((event, i) => (
            <div key={event.id} className="flex gap-3">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-border mt-1.5 shrink-0" />
                {i < events.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1 mb-1" />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {event.from_status ? (
                    <>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${APPLICATION_STATUS_COLORS[event.from_status]}`}
                      >
                        {APPLICATION_STATUS_LABELS[event.from_status]}
                      </Badge>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </>
                  ) : null}
                  <Badge
                    variant="secondary"
                    className={`text-xs ${APPLICATION_STATUS_COLORS[event.to_status]}`}
                  >
                    {APPLICATION_STATUS_LABELS[event.to_status]}
                  </Badge>
                </div>

                {event.notes && (
                  <p className="text-xs text-muted-foreground mt-1">{event.notes}</p>
                )}

                <p className="text-xs text-muted-foreground mt-1">
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
