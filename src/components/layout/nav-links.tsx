import {
  LayoutDashboard,
  Briefcase,
  Compass,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Lowongan Saya",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    label: "Cari Lowongan",
    href: "/explore",
    icon: Compass,
    badge: "Scraper",
  },
  {
    label: "Profil",
    href: "/profile",
    icon: UserRound,
  },
];
