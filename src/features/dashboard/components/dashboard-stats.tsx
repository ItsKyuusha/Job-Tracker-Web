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
      accent: "text-indigo-600 dark:text-indigo-400",
      badge: "Koleksi",
      badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      borderGlow: "hover:border-indigo-500/40",
      gradient: "from-indigo-500/5 to-transparent",
    },
    {
      label: "Tersimpan",
      value: stats.saved,
      icon: Bookmark,
      accent: "text-slate-600 dark:text-slate-400",
      badge: "Draft",
      badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
      borderGlow: "hover:border-slate-500/40",
      gradient: "from-slate-500/5 to-transparent",
    },
    {
      label: "Terkirim (Applied)",
      value: stats.applied,
      icon: Send,
      accent: "text-blue-600 dark:text-blue-400",
      badge: "Diproses",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      borderGlow: "hover:border-blue-500/40",
      gradient: "from-blue-500/5 to-transparent",
    },
    {
      label: "Tahap Interview",
      value: stats.interview,
      icon: MessageSquare,
      accent: "text-violet-600 dark:text-violet-400",
      badge: "Prioritas",
      badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 animate-pulse",
      borderGlow: "hover:border-violet-500/40",
      gradient: "from-violet-500/5 to-transparent",
    },
    {
      label: "Offering Letter",
      value: stats.offer,
      icon: Trophy,
      accent: "text-emerald-600 dark:text-emerald-400",
      badge: "Gol!",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      borderGlow: "hover:border-emerald-500/40",
      gradient: "from-emerald-500/5 to-transparent",
    },
    {
      label: "Belum Berhasil",
      value: stats.rejected,
      icon: XCircle,
      accent: "text-rose-600 dark:text-rose-400",
      badge: "Evaluasi",
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      borderGlow: "hover:border-rose-500/40",
      gradient: "from-rose-500/5 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className={`relative overflow-hidden border border-border/80 bg-card/70 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${card.borderGlow}`}
          >
            {/* Ambient subtle top-gradient */}
            <div className={`absolute inset-x-0 top-0 h-16 bg-linear-to-b ${card.gradient} pointer-events-none`} />

            <CardContent className="p-4 sm:p-5 space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeClass}`}>
                  {card.badge}
                </span>
                <div className="p-1.5 rounded-lg bg-muted/60">
                  <Icon className={`w-4 h-4 ${card.accent}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  {card.value}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-1 font-medium">
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
