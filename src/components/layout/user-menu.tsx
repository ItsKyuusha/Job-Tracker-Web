"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import { LogOut, User, ShieldCheck } from "lucide-react";

type UserMenuProps = {
  displayName: string;
  email: string;
  avatarUrl: string | null;
};

export function UserMenu({ displayName, email, avatarUrl }: UserMenuProps) {
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 ring-1 ring-border hover:ring-primary/40 transition-all"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="text-[11px] font-semibold bg-primary text-primary-foreground">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg border-border/80">
        <DropdownMenuLabel className="font-normal px-2 py-1.5">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold leading-none truncate text-foreground">{displayName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="gap-2.5 text-xs text-muted-foreground cursor-default py-2" disabled>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Status: Active User</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          className="gap-2.5 text-xs text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer py-2 rounded-md"
          onSelect={async () => {
            await logoutAction();
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Akun</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
