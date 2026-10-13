import { Card, CardContent } from "@/components/ui/card";
import {
  Bookmark,
  Send,
  MessageSquare,
  Trophy,
  XCircle,
  Briefcase,
} from "lucide-react";

type Stats = {
  total: number;
  saved: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
};

export function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Lowongan",
      value: stats.total,
      icon: Briefcase,
      accent: "text-foreground",
      badge: "Semua",
      bgBadge: "bg-muted text-muted-foreground",
      borderHover: "hover:border-zinc-400 dark:hover:border-zinc-600",
    },
    {
      label: "Tersimpan",
      value: stats.saved,
      icon: Bookmark,
      accent: "text-zinc-600 dark:text-zinc-400",
      badge: "Draft",
      bgBadge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
      borderHover: "hover:border-zinc-400 dark:hover:border-zinc-700",
    },
    {
      label: "Terkirim (Applied)",
      value: stats.applied,
      icon: Send,
      accent: "text-blue-600 dark:text-blue-400",
      badge: "Aktif",
      bgBadge: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
      borderHover: "hover:border-blue-400 dark:hover:border-blue-800",
    },
    {
      label: "Tahap Interview",
      value: stats.interview,
      icon: MessageSquare,
      accent: "text-violet-600 dark:text-violet-400",
      badge: "Prioritas",
      bgBadge: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400",
      borderHover: "hover:border-violet-400 dark:hover:border-violet-800",
    },
    {
      label: "Offering Letter",
      value: stats.offer,
      icon: Trophy,
      accent: "text-emerald-600 dark:text-emerald-400",
      badge: "Gol!",
      bgBadge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
      borderHover: "hover:border-emerald-400 dark:hover:border-emerald-800",
    },
    {
      label: "Belum Berhasil",
      value: stats.rejected,
      icon: XCircle,
      accent: "text-rose-600 dark:text-rose-400",
      badge: "Evaluasi",
      bgBadge: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400",
      borderHover: "hover:border-rose-400 dark:hover:border-rose-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className={`border-border/80 bg-card/60 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs ${card.borderHover}`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${card.bgBadge}`}>
                  {card.badge}
                </span>
                <Icon className={`w-4 h-4 ${card.accent}`} />
              </div>
              <div className="pt-1">
                <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {card.value}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5 font-medium">
                  {card.label}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
