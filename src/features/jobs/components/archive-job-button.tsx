"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleArchiveJobAction } from "@/features/jobs/actions";
import { toast } from "sonner";
import { Archive, ArchiveRestore } from "lucide-react";

type ArchiveJobButtonProps = {
  jobId: string;
  isActive: boolean;
};

export function ArchiveJobButton({ jobId, isActive }: ArchiveJobButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleArchiveJobAction(jobId, isActive);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(isActive ? "Lowongan diarsipkan" : "Lowongan dipulihkan");
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className="gap-2"
    >
      {isActive ? (
        <>
          <Archive className="w-4 h-4" />
          {isPending ? "Mengarsipkan..." : "Arsipkan"}
        </>
      ) : (
        <>
          <ArchiveRestore className="w-4 h-4" />
          {isPending ? "Memulihkan..." : "Pulihkan"}
        </>
      )}
    </Button>
  );
}
