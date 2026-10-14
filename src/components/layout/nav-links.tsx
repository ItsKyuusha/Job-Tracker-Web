import {
  LayoutDashboard,
  Briefcase,
  Building2,
  MessageSquareText,
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
    label: "Portal Karir",
    href: "/explore/portals",
    icon: Building2,
    badge: "Resmi",
  },
  {
    label: "Loker Sosmed",
    href: "/explore/social",
    icon: MessageSquareText,
    badge: "Sosmed",
  },
  {
    label: "Profil",
    href: "/profile",
    icon: UserRound,
  },
];
