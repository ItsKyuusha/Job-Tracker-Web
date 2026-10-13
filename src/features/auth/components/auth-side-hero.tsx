import { CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export function AuthSideHero() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-b from-[#0a0d17] via-[#0e1322] to-[#07090e] text-white relative overflow-hidden border-r border-indigo-500/20">
      {/* Background ambient glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#6366f115_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top branding */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
          <Zap className="w-5 h-5 fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white">CareerSync</span>
          <span className="text-[11px] text-indigo-300 font-medium">Job Tracker Intelligence</span>
        </div>
      </div>

      {/* Center value prop */}
      <div className="relative z-10 space-y-6 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
          <span>Personal Job Tracker Suite</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
          Kendalikan alur pencarian karirmu dengan rapi dan terukur.
        </h2>

        <p className="text-xs sm:text-sm text-indigo-100/70 leading-relaxed font-normal">
          Catat lowongan dari LinkedIn, Glints, atau relasi. Pantau jadwal interview teknis, offering letter, dan riwayat status secara real-time.
        </p>

        {/* Feature list pills */}
        <div className="space-y-3 pt-2 text-xs text-indigo-100 font-medium">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dual View: Grid Cards & Trello-style Kanban Board</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Funnel konversi alur lamaran & pengingat deadline otomatis</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Supabase PostgreSQL + Row Level Security per akun</span>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-indigo-200/50">
        <p>&copy; {new Date().getFullYear()} CareerSync. Dibangun untuk efisiensi profesional masa kini.</p>
      </div>
    </div>
  );
}
