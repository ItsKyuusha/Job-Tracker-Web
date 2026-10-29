"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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
  toggle: (triggerEl: HTMLElement) => void;
  close: () => void;
  onValueChange: (val: string) => void;
  options: OptionInfo[];
  registerOption: (val: string, label: React.ReactNode) => void;
  coords: {
    top: number;
    left: number;
    width: number;
    openUpwards: boolean;
  } | null;
  mounted: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

const emptySubscribe = () => () => {};

function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function getOptionsFromChildren(children: React.ReactNode): OptionInfo[] {
  const options: OptionInfo[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as { value?: unknown; children?: React.ReactNode };
    if (props && typeof props.value === "string") {
      options.push({
        value: props.value,
        label: props.children ?? props.value,
      });
    }
    if (props && props.children) {
      options.push(...getOptionsFromChildren(props.children));
    }
  });
  return options;
}

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
  const [prevDefault, setPrevDefault] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const mounted = useIsMounted();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
    width: number;
    openUpwards: boolean;
  } | null>(null);

  const isControlled = controlledValue !== undefined;
  if (!isControlled && defaultValue !== prevDefault) {
    setPrevDefault(defaultValue);
    setInternalValue(defaultValue);
  }
  const currentValue = isControlled ? controlledValue : internalValue;

  const childOptions = React.useMemo(
    () => getOptionsFromChildren(children),
    [children]
  );
  const [dynamicOptions, setDynamicOptions] = React.useState<OptionInfo[]>([]);

  const registerOption = React.useCallback(
    (val: string, label: React.ReactNode) => {
      setDynamicOptions((prev) => {
        if (prev.some((o) => o.value === val)) return prev;
        return [...prev, { value: val, label }];
      });
    },
    []
  );

  const options = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    for (const opt of childOptions) {
      map.set(opt.value, opt.label);
    }
    for (const opt of dynamicOptions) {
      map.set(opt.value, opt.label);
    }
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [childOptions, dynamicOptions]);

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  const calcCoords = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const dropdownHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards =
      spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    let left = rect.left;
    if (typeof window !== "undefined" && left + rect.width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - rect.width - 12);
    }

    return {
      top: openUpwards ? rect.top - 6 : rect.bottom + 6,
      left,
      width: rect.width,
      openUpwards,
    };
  };

  const toggle = React.useCallback((triggerEl: HTMLElement) => {
    triggerRef.current = triggerEl;
    setOpen((prev) => {
      if (!prev) {
        setCoords(calcCoords(triggerEl));
        return true;
      }
      return false;
    });
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        triggerRef.current?.contains(target) ||
        contentRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        if (triggerRef.current instanceof HTMLElement) {
          triggerRef.current.focus();
        }
      }
    }

    function handleScrollOrResize() {
      if (triggerRef.current) {
        setCoords(calcCoords(triggerRef.current));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        name,
        open,
        toggle,
        close,
        onValueChange: handleValueChange,
        options,
        registerOption,
        coords,
        mounted,
        contentRef,
      }}
    >
      <div ref={containerRef} className={cn("relative inline-block w-full", open && "z-30")}>
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
        context.toggle(e.currentTarget);
      }}
      aria-expanded={context.open}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground shadow-2xs transition-all hover:bg-muted/50 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer select-none",
        context.open && "ring-1 ring-ring border-ring",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <ChevronDown
        className={cn(
          "h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5 transition-transform duration-200",
          context.open && "rotate-180 text-foreground"
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
    <span className={cn("truncate font-medium", !currentOption && "text-muted-foreground font-normal")}>
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
  if (!context) return null;

  const { open, mounted, coords, contentRef } = context;

  if (!open || !mounted || !coords) return null;

  return createPortal(
    <div
      ref={contentRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: `${coords.left}px`,
        top: coords.openUpwards ? undefined : `${coords.top}px`,
        bottom: coords.openUpwards
          ? `${window.innerHeight - coords.top}px`
          : undefined,
        width: `${coords.width}px`,
        zIndex: 9999,
      }}
      className={cn(
        "max-h-64 overflow-y-auto rounded-xl border border-border bg-popover/98 p-1 text-popover-foreground shadow-2xl shadow-black/20 backdrop-blur-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
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

  const isSelected = context.value === value;

  return (
    <div
      onMouseDown={(e) => {
        // Mencegah mousedown membubbling ke listener handleClickOutside sebelum selection selesai
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        context.onValueChange(value);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-2 text-xs outline-hidden transition-colors hover:bg-muted hover:text-foreground",
        isSelected && "bg-secondary text-secondary-foreground font-semibold",
        className
      )}
      {...props}
    >
      <span className="truncate pr-2">{children}</span>
      {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
    </div>
  );
}
