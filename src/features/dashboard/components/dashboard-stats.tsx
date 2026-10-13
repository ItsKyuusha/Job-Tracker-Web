import { Card, CardContent } from "@/components/ui/card";
import {
  Bookmark,
  Send,
  MessageSquare,
  Trophy,
  XCircle,
  Layers,
} from "lucide-react";

type Stats = {
  total: number;
  saved: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
};

type StatCard = {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
};

export function DashboardStats({ stats }: { stats: Stats }) {
  const cards: StatCard[] = [
    {
      label: "Total Lamaran",
      value: stats.total,
      icon: Layers,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      label: "Disimpan",
      value: stats.saved,
      icon: Bookmark,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      label: "Dilamar",
      value: stats.applied,
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Interview",
      value: stats.interview,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Offer",
      value: stats.offer,
      icon: Trophy,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Ditolak",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="gap-0">
            <CardContent className="p-4">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-md ${card.bg} mb-3`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
