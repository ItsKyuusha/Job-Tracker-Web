import {
  LayoutDashboard,
  Briefcase,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Lowongan",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    label: "Profil",
    href: "/profile",
    icon: UserRound,
  },
];
