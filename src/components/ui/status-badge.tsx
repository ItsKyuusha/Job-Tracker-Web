import { cn, APPLICATION_STATUS_CONFIG, APPLICATION_STATUS_LABELS } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/database";

type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
  showDot?: boolean;
};

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const config = APPLICATION_STATUS_CONFIG[status] || APPLICATION_STATUS_CONFIG.saved;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)}
          aria-hidden="true"
        />
      )}
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
