"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function LiveDateTime() {
  const [dateTimeStr, setDateTimeStr] = useState<string | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format: "Kamis, 15 Okt 2026 • 16:45:12"
      const datePart = new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(now);

      const timePart = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      setDateTimeStr(`${datePart} • ${timePart}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!dateTimeStr) {
    // Skeleton placeholder to prevent layout shift during SSR hydration
    return (
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground/60 w-44 h-7 animate-pulse" />
    );
  }

  return (
    <div
      className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 hover:bg-muted/90 border border-border/70 text-xs font-medium text-foreground/80 tracking-tight transition-colors shadow-2xs select-none"
      title="Waktu server lokal saat ini"
    >
      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0 animate-pulse" />
      <span className="font-mono text-[11px] font-semibold">{dateTimeStr}</span>
    </div>
  );
}
