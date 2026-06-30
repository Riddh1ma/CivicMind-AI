import { Zap, Eye, ShieldCheck, Star } from 'lucide-react';

export default function AchievementsPanel() {

  const achievements = [
    {
      title: 'First Responder',
      desc: 'Submitted your first community incident report.',
      icon: Zap,
      unlocked: true,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Civic Spotter',
      desc: 'File 5 reports that match matching telemetry.',
      icon: Eye,
      unlocked: false,
      color: 'text-zinc-500 bg-zinc-900 border-zinc-800',
    },
    {
      title: 'Community Sentinel',
      desc: 'Verify resolution status of 10 nearby incidents.',
      icon: ShieldCheck,
      unlocked: false,
      color: 'text-zinc-500 bg-zinc-900 border-zinc-800',
    },
    {
      title: 'Star Citizen',
      desc: 'Earn a total community score above 50 points.',
      icon: Star,
      unlocked: false,
      color: 'text-zinc-500 bg-zinc-900 border-zinc-800',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Achievements & Impact</h2>
        <p className="text-xs text-zinc-500 mt-1">Track your reputation metrics and community credentials.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <span className="text-[10px] font-extrabold uppercase text-zinc-555 tracking-widest block mb-2">Community Score</span>
          <span className="text-3xl font-black text-white">0</span>
          <span className="text-[9px] text-zinc-600 block mt-1.5 uppercase font-bold">10 pts to level up</span>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <span className="text-[10px] font-extrabold uppercase text-zinc-555 tracking-widest block mb-2">Reports Submitted</span>
          <span className="text-3xl font-black text-white">0</span>
          <span className="text-[9px] text-zinc-650 block mt-1.5 uppercase font-bold">Filing active coordinates</span>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40">
          <span className="text-[10px] font-extrabold uppercase text-zinc-555 tracking-widest block mb-2">Reports Verified</span>
          <span className="text-3xl font-black text-white">0</span>
          <span className="text-[9px] text-zinc-650 block mt-1.5 uppercase font-bold">Patched verification queue</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <span className="text-[10px] font-extrabold uppercase text-primary tracking-widest block">Badges Locker</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => {
            const Icon = ach.icon;

            return (
              <div 
                key={ach.title}
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all hover:-translate-y-0.5 ${
                  ach.unlocked 
                    ? 'border-zinc-800 bg-zinc-950/40' 
                    : 'border-zinc-900/60 bg-zinc-950/10 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${ach.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                    {ach.unlocked && (
                      <span className="text-[8px] font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
