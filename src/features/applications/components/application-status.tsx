"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateApplicationAction } from "@/features/applications/actions";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  formatDate,
} from "@/lib/utils";
import type { ApplicationStatus as AppStatus } from "@/types/database";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

type ApplicationStatusProps = {
  applicationId: string;
  currentStatus: AppStatus;
  appliedAt: string | null;
  deadlineAt: string | null;
  notes: string | null;
};

const STATUS_ORDER: AppStatus[] = [
  "saved",
  "applied",
  "assessment",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

export function ApplicationStatus({
  applicationId,
  currentStatus,
  appliedAt,
  deadlineAt,
  notes,
}: ApplicationStatusProps) {
  // We need jobId for revalidation — extract from URL
  const jobId = typeof window !== "undefined"
    ? window.location.pathname.split("/jobs/")[1]?.split("/")[0] ?? ""
    : "";

  const boundAction = updateApplicationAction.bind(null, applicationId, jobId);
  const [state, formAction, pending] = useActionState(boundAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Status lamaran diperbarui");
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const toDateInput = (val?: string | null) => {
    if (!val) return "";
    return val.split("T")[0];
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Status Lamaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current status badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant="secondary"
            className={`${APPLICATION_STATUS_COLORS[currentStatus]} text-sm px-3 py-1`}
          >
            {APPLICATION_STATUS_LABELS[currentStatus]}
          </Badge>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="app-status">Ubah Status</Label>
              <Select name="status" defaultValue={currentStatus}>
                <SelectTrigger id="app-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {APPLICATION_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-applied-at">Tanggal Melamar</Label>
              <Input
                id="app-applied-at"
                name="applied_at"
                type="date"
                defaultValue={toDateInput(appliedAt)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-deadline">Deadline Personal</Label>
              <Input
                id="app-deadline"
                name="deadline_at"
                type="date"
                defaultValue={toDateInput(deadlineAt)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-notes">Catatan</Label>
            <Textarea
              id="app-notes"
              name="notes"
              placeholder="Catatan tentang proses lamaran ini..."
              defaultValue={notes ?? ""}
              rows={3}
              className="resize-y"
            />
          </div>

          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Menyimpan..." : "Perbarui"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
