import { Sparkles, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

export function AuthSideHero() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white relative overflow-hidden border-r border-zinc-800/80">
      {/* Background ambient glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Top branding */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white text-zinc-950 shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">CareerSync</span>
      </div>

      {/* Center value prop */}
      <div className="relative z-10 space-y-6 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>V2 Job Tracker Suite</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
          Kelola setiap proses lamaran pekerjaan dalam satu kendali.
        </h2>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Dari tahap berkas tersimpan, interview teknis, hingga offering letter. Pantau deadline dan aktivitas secara real-time.
        </p>

        {/* Feature list pills */}
        <div className="space-y-3 pt-2 text-xs text-zinc-300 font-medium">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pelacakan alur lamaran dengan Kanban & Grid view</span>
          </div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Bento-grid metrik konversi dan riwayat progres</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Database aman dengan PostgreSQL Row Level Security</span>
          </div>
        </div>
      </div>

      {/* Bottom testimonial/tagline */}
      <div className="relative z-10 pt-8 border-t border-zinc-900 text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} CareerSync. Dibangun untuk developer & profesional modern.</p>
      </div>
    </div>
  );
}
