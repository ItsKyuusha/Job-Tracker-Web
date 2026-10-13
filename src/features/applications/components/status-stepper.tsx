import type { ApplicationStatus } from "@/types/database";
import { Check, X, Sparkles } from "lucide-react";

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
      <div className="p-4 sm:p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm shadow-rose-500/30">
            <X className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-400">
              {isRejected ? "Lamaran Belum Berhasil Lolos" : "Lamaran Dibatalkan"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Status proses saat ini: <span className="font-semibold">{isRejected ? "Rejected" : "Withdrawn"}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md space-y-4 shadow-xs">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pipeline Seleksi Lamaran</span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border/60">
          Tahap {Math.max(1, currentIndex + 1)} dari {STEPS.length}
        </span>
      </div>

      <div className="flex items-center justify-between relative px-2">
        {/* Track Line behind steps */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-muted/80 z-0 rounded-full" />
        <div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-linear-to-r from-indigo-500 to-violet-600 z-0 rounded-full transition-all duration-300"
          style={{
            width: `${Math.max(0, Math.min(100, (currentIndex / (STEPS.length - 1)) * 100))}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const isPassed = currentIndex >= idx;
          const isCurrent = currentIndex === idx;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white ring-4 ring-indigo-500/25 scale-110 shadow-md shadow-indigo-600/30"
                    : isPassed
                    ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white shadow-xs"
                    : "bg-background text-muted-foreground border-2 border-border"
                }`}
              >
                {isPassed && !isCurrent ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold tracking-tight whitespace-nowrap hidden sm:block ${
                  isCurrent
                    ? "text-indigo-600 dark:text-indigo-400 font-bold"
                    : isPassed
                    ? "text-foreground"
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
