import type { ApplicationStatus } from "@/types/database";
import { Check, X } from "lucide-react";

type StatusStepperProps = {
  currentStatus: ApplicationStatus;
};

const STEPS: { status: ApplicationStatus; label: string }[] = [
  { status: "saved", label: "Tersimpan" },
  { status: "applied", label: "Terkirim" },
  { status: "assessment", label: "Assessment" },
  { status: "interview", label: "Interview" },
  { status: "offer", label: "Penawaran" },
];

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const isRejected = currentStatus === "rejected";
  const isWithdrawn = currentStatus === "withdrawn";

  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);

  if (isRejected || isWithdrawn) {
    return (
      <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
              {isRejected ? "Lamaran Tidak Lolos Seleksi" : "Lamaran Dibatalkan"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Status proses saat ini: {isRejected ? "Rejected" : "Withdrawn"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider text-[10px]">Alur Tahapan Seleksi</span>
        <span className="font-mono text-[11px]">
          Langkah {Math.max(1, currentIndex + 1)} dari {STEPS.length}
        </span>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Track Line behind steps */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-muted z-0" />

        {STEPS.map((step, idx) => {
          const isPassed = currentIndex >= idx;
          const isCurrent = currentIndex === idx;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-xs"
                    : isPassed
                    ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-950 shadow-2xs"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {isPassed && !isCurrent ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] hidden sm:block font-medium tracking-tight whitespace-nowrap ${
                  isCurrent
                    ? "text-foreground font-semibold"
                    : isPassed
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
