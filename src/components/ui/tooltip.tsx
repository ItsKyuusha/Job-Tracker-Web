"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-flex group">{children}</div>;
}

export function TooltipTrigger({
  children,
  asChild,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: unknown;
}) {
  if (asChild && React.isValidElement(children)) {
    return children;
  }
  return <span {...props}>{children}</span>;
}

export function TooltipContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex z-50 items-center rounded-md bg-zinc-900 dark:bg-zinc-100 px-2 py-1 text-[11px] font-medium text-white dark:text-zinc-900 shadow-md whitespace-nowrap animate-in fade-in-0",
        className
      )}
    >
      {children}
    </div>
  );
}
