"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SheetContext = React.createContext<SheetContextType | null>(null);

export function Sheet({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (action: React.SetStateAction<boolean>) => {
      const next = typeof action === "function" ? action(open) : action;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange, open]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  asChild,
  children,
  ...props
}: {
  asChild?: boolean;
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within Sheet");

  const handleClick = () => context.setOpen(true);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: () => void }>;
    return React.cloneElement(child, {
      onClick: () => {
        child.props.onClick?.();
        handleClick();
      },
    });
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export function SheetContent({
  side = "left",
  className,
  children,
}: {
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(SheetContext);

  // Handle escape key to close - must be called unconditionally before any return!
  React.useEffect(() => {
    if (!context?.open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        context.setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [context]);

  if (!context || !context.open) return null;

  const sideStyles = {
    top: "inset-x-0 top-0 border-b max-h-[85vh]",
    bottom: "inset-x-0 bottom-0 border-t max-h-[85vh]",
    left: "inset-y-0 left-0 h-full border-r max-w-[85vw]",
    right: "inset-y-0 right-0 h-full border-l max-w-[85vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => context.setOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-2xl transition ease-in-out duration-300 overflow-y-auto",
          sideStyles[side],
          className
        )}
      >
        <button
          type="button"
          onClick={() => context.setOpen(false)}
          className="absolute right-3.5 top-3.5 z-20 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          aria-label="Tutup menu"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}
