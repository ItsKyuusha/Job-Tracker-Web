"use client";

import { useActionState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { APPLICATION_STATUS_LABELS } from "@/lib/utils";
import type { ApplicationStatus as AppStatus } from "@/types/database";
import { SlidersHorizontal, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

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
  const jobId = typeof window !== "undefined"
    ? window.location.pathname.split("/jobs/")[1]?.split("/")[0] ?? ""
    : "";

  const boundAction = updateApplicationAction.bind(null, applicationId, jobId);
  const [state, formAction, pending] = useActionState(boundAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Status lamaran berhasil diperbarui");
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
    <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          <span>Kelola Status Lamaran</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form action={formAction} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="app-status" className="text-xs font-medium">Tahapan Saat Ini</Label>
            <Select name="status" defaultValue={currentStatus}>
              <SelectTrigger id="app-status" className="h-8 text-xs border-border/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {APPLICATION_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="app-applied-at" className="text-[11px] font-medium text-muted-foreground">Tgl Melamar</Label>
              <Input
                id="app-applied-at"
                name="applied_at"
                type="date"
                defaultValue={toDateInput(appliedAt)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="app-deadline" className="text-[11px] font-medium text-muted-foreground">Deadline / Tes</Label>
              <Input
                id="app-deadline"
                name="deadline_at"
                type="date"
                defaultValue={toDateInput(deadlineAt)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="app-notes" className="text-xs font-medium">Catatan Pribadi</Label>
            <Textarea
              id="app-notes"
              name="notes"
              placeholder="Gaji negosiasi, kontak recruiter, instruksi tes..."
              defaultValue={notes ?? ""}
              rows={3}
              className="resize-none text-xs"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={pending}
            className="w-full h-8 text-xs font-semibold gap-1.5 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all shadow-sm shadow-indigo-600/20 border-0"
          >
            {pending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Perbarui Status</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
