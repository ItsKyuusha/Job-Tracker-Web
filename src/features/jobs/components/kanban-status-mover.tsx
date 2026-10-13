"use client";

import { useOptimistic, useTransition } from "react";
import type { ApplicationStatus } from "@/types/database";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_CONFIG } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

const ALL_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "assessment",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

type KanbanStatusMoverProps = {
  applicationId: string;
  currentStatus: ApplicationStatus;
  jobId: string;
};

async function updateStatusDirect(
  applicationId: string,
  jobId: string,
  newStatus: ApplicationStatus
) {
  const { updateApplicationAction } = await import(
    "@/features/applications/actions"
  );
  const formData = new FormData();
  formData.set("status", newStatus);
  const result = await updateApplicationAction(applicationId, jobId, {}, formData);
  return result;
}

export function KanbanStatusMover({
  applicationId,
  currentStatus,
  jobId,
}: KanbanStatusMoverProps) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus);
  const [isPending, startTransition] = useTransition();
  const config = APPLICATION_STATUS_CONFIG[optimisticStatus];

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (newStatus === optimisticStatus) return;
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      const result = await updateStatusDirect(applicationId, jobId, newStatus);
      if (result?.error) {
        toast.error(result.error);
        setOptimisticStatus(currentStatus); // rollback
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 px-2 text-[10px] font-semibold gap-1 rounded-full border ${config.bg} ${config.text} ${config.border} hover:opacity-80`}
          onClick={(e) => e.stopPropagation()}
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
          )}
          <span>{APPLICATION_STATUS_LABELS[optimisticStatus]}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pb-1">
          Pindahkan ke
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ALL_STATUSES.map((s) => {
          const c = APPLICATION_STATUS_CONFIG[s];
          return (
            <DropdownMenuItem
              key={s}
              onClick={() => handleStatusChange(s)}
              className="text-xs gap-2 cursor-pointer"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
              {APPLICATION_STATUS_LABELS[s]}
              {s === optimisticStatus && <Check className="w-3 h-3 ml-auto text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
