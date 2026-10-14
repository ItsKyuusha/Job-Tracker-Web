"use client";

import { useSidebar } from "./sidebar-context";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarTrigger() {
  const { toggle } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="lg:hidden h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
      aria-label="Buka navigasi sidebar"
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}
