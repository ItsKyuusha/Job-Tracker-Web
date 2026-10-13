"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface OptionInfo {
  value: string;
  label: React.ReactNode;
}

interface SelectContextType {
  value: string;
  name?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onValueChange: (val: string) => void;
  options: OptionInfo[];
  registerOption: (val: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export function Select({
  value: controlledValue,
  defaultValue = "",
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
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const optionsMapRef = React.useRef<Map<string, React.ReactNode>>(new Map());
  const [, setTick] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const registerOption = React.useCallback(
    (val: string, label: React.ReactNode) => {
      if (!optionsMapRef.current.has(val)) {
        optionsMapRef.current.set(val, label);
        // Force sync sekali agar SelectValue bisa menampilkan label saat inisialisasi
        setTick((t) => t + 1);
      }
    },
    []
  );

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Convert map ke list options
  const options = React.useMemo(() => {
    return Array.from(optionsMapRef.current.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [optionsMapRef.current.size]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        name,
        open,
        setOpen,
        onValueChange: handleValueChange,
        options,
        registerOption,
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
      onClick={(e) => {
        e.stopPropagation();
        context.setOpen((prev) => !prev);
      }}
      className={cn(
        "flex h-8.5 w-full items-center justify-between rounded-xl border border-input bg-background/90 px-3 py-1.5 text-xs text-foreground shadow-2xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5 transition-transform duration-150",
          context.open && "rotate-180"
        )}
      />
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

  const currentOption = context.options.find((o) => o.value === context.value);

  return (
    <span className={cn("truncate", !currentOption && "text-muted-foreground")}>
      {currentOption ? currentOption.label : placeholder || ""}
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
        "absolute left-0 right-0 z-50 mt-1 max-h-60 min-w-[8rem] overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 backdrop-blur-md",
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

  // Daftarkan opsi sekali saat mount
  React.useEffect(() => {
    context.registerOption(value, children);
  }, [value, context.registerOption]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSelected = context.value === value;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        context.onValueChange(value);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-1.5 text-xs outline-hidden transition-colors hover:bg-muted hover:text-foreground",
        isSelected && "bg-muted/80 font-bold text-foreground",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="w-3.5 h-3.5 text-primary ml-2 shrink-0" />}
    </div>
  );
}
