"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectContextType {
  value?: string;
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  registerOption: (value: string, label: React.ReactNode) => void;
  options: Map<string, React.ReactNode>;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export function Select({
  value: controlledValue,
  defaultValue,
  onValueChange,
  name,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: React.ReactNode;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Map<string, React.ReactNode>>(
    new Map()
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const registerOption = React.useCallback(
    (val: string, label: React.ReactNode) => {
      setOptions((prev) => {
        const next = new Map(prev);
        next.set(val, label);
        return next;
      });
    },
    []
  );

  const handleValueChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        defaultValue,
        name,
        onValueChange: handleValueChange,
        open,
        setOpen,
        registerOption,
        options,
      }}
    >
      <div ref={containerRef} className="relative inline-block w-full">
        {name && <input type="hidden" name={name} value={currentValue} />}
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  id,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  return (
    <button
      id={id}
      type="button"
      onClick={() => context.setOpen((prev) => !prev)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-2xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5" />
    </button>
  );
}

export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  const currentLabel = context.value ? context.options.get(context.value) : null;

  return (
    <span className={cn(!currentLabel && "text-muted-foreground")}>
      {currentLabel || placeholder || ""}
    </span>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SelectContext);
  if (!context || !context.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  React.useEffect(() => {
    context.registerOption(value, children);
  }, [value, children, context]);

  const isSelected = context.value === value;

  return (
    <div
      onClick={() => context.onValueChange?.(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-xs outline-hidden transition-colors hover:bg-muted hover:text-foreground",
        isSelected && "bg-muted font-medium text-foreground",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
    </div>
  );
}
