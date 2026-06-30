import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BarChart3, 
  Users2, 
  Settings, 
  Bell, 
  Sparkles, 
  Check, 
  RotateCw, 
  Activity
} from 'lucide-react';

export default function PlatformPreview() {
  const sidebarItems = [
    { icon: LayoutDashboard, active: true },
    { icon: MapIcon, active: false },
    { icon: BarChart3, active: false },
    { icon: Users2, active: false },
    { icon: Settings, active: false },
  ];

  const statMetrics = [
    { label: 'Total Reports', val: '1,248', change: '+18%', isPos: true },
    { label: 'Active Issues', val: '342', change: '+12%', isPos: true },
    { label: 'Resolved Today', val: '142', change: '+23%', isPos: true },
    { label: 'Avg. Response', val: '2.4 hrs', change: '-8%', isPos: false },
  ];

  const tableIssues = [
    { id: '#4893', type: 'Asphalt Failure', ward: 'Ward 5', status: 'Assigned', verification: '96%', priority: 'Critical' },
    { id: '#4892', type: 'Water Leakage', ward: 'Ward 3', status: 'Dispatched', verification: '92%', priority: 'High' },
    { id: '#4891', type: 'Garbage Overflow', ward: 'Ward 7', status: 'Pending', verification: '88%', priority: 'Medium' },
  ];

  const activityFeed = [
    { time: '12m ago', text: 'AI auto-routed incident #4893 to Road Division.' },
    { time: '34m ago', text: 'Citizen report #4892 verification match 92%.' },
    { time: '1h ago', text: 'Crew B marked pipeline #4878 as fully resolved.' },
  ];

  return (
    <section id="dashboard-preview" className="py-24 relative overflow-hidden bg-[#09090B] border-t border-zinc-900">
      {/* Background Glows */}
      <div className="absolute top-[30%] left-[5%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[5%] w-[450px] h-[450px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-primary mb-3"
          >
            Dashboard Console
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Authority Console Preview
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Explore the flagship SaaS interface utilized by city dispatchers and emergency operations managers.
          </motion.p>
        </div>

        {/* Dashboard Main Mock Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[28px] border border-zinc-800 bg-[#07070a] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.6)] flex flex-col md:flex-row h-[660px]"
        >
          {/* LEFT Sidebar */}
          <div className="hidden sm:flex flex-col items-center justify-between py-6 px-4 border-r border-zinc-900 bg-zinc-950/80 w-16">
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4.5 w-full">
                {sidebarItems.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                      item.active 
                        ? 'bg-zinc-900 text-white border border-zinc-800' 
                        : 'text-zinc-550 hover:text-zinc-300'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-zinc-600 hover:text-zinc-400 cursor-pointer relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <Bell className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* RIGHT Dashboard Area */}
          <div className="flex-grow flex flex-col h-full overflow-hidden bg-zinc-950/20">
            {/* Top Stats Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-zinc-900 bg-zinc-950/40">
              {statMetrics.map((stat, i) => (
                <div key={i} className="text-left">
                  <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-1">{stat.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white">{stat.val}</span>
                    <span className={`text-[9px] font-bold ${stat.isPos ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Grid Layout */}
            <div className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto sm:overflow-hidden">
              
              {/* Map & Table widget (Lg: col-span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* SVG Maps grid mockup */}
                <div className="relative rounded-2xl bg-zinc-950 border border-zinc-900 h-[220px] overflow-hidden flex items-center justify-center p-4">
                  <svg viewBox="0 0 600 220" fill="none" className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
                    <path d="M 0 40 L 600 40 M 0 100 L 600 100 M 0 160 L 600 160" stroke="#FFFFFF" strokeWidth="0.5" />
                    <path d="M 120 0 L 120 220 M 280 0 L 280 220 M 440 0 L 440 220" stroke="#FFFFFF" strokeWidth="0.5" />
                    <path d="M 40 0 C 120 80, 200 120, 260 220" stroke="#FFFFFF" strokeWidth="1" />
                    <path d="M 460 0 C 400 80, 480 160, 500 220" stroke="#FFFFFF" strokeWidth="1" />
                  </svg>

                  {/* Incident markers */}
                  <div className="absolute top-[35%] left-[28%] flex items-center gap-1.5 bg-zinc-950/90 border border-rose-500/20 px-2 py-1 rounded-lg shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[9px] font-mono font-bold text-zinc-350">INC-4893</span>
                  </div>
                  <div className="absolute top-[60%] left-[62%] flex items-center gap-1.5 bg-zinc-950/90 border border-amber-500/20 px-2 py-1 rounded-lg shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-zinc-350">INC-4892</span>
                  </div>

                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-zinc-900/80 border border-zinc-800 text-[9px] text-zinc-450 uppercase font-bold">
                    GIS Heatmap overlay active
                  </div>
                </div>

                {/* Issues Table Mockup */}
                <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-5 flex flex-col justify-start overflow-x-auto">
                  <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-3 text-left">Incident Registry Table</span>
                  <table className="w-full text-left text-xs font-semibold text-zinc-400">
                    <thead>
                      <tr className="border-b border-zinc-900 pb-2 text-zinc-500 text-[10px] uppercase font-bold">
                        <th className="py-2">Incident ID</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Ward</th>
                        <th className="py-2">Verification</th>
                        <th className="py-2">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableIssues.map((issue) => (
                        <tr key={issue.id} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 transition-all">
                          <td className="py-3 font-mono text-[10px] text-zinc-500">{issue.id}</td>
                          <td className="py-3 text-white">{issue.type}</td>
                          <td className="py-3">{issue.ward}</td>
                          <td className="py-3 text-accent">{issue.verification} Match</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              issue.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {issue.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Sidebar AI Copilot & Activity (Lg: col-span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-6 h-full justify-between overflow-y-auto">
                {/* AI recommendation Dispatcher widget */}
                <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-5 text-left flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" /> AI Dispatch Planner
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Auto-routing <strong className="text-white">INC-4893</strong> to Road Division. Heavy rainfall risk warrants immediate 24h patching crew Unit C dispatch.
                  </p>

                  <div className="flex gap-2.5 mt-4">
                    <button className="flex-grow py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-extrabold flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> Execute Route
                    </button>
                    <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notifications & Activity Feed logs */}
                <div className="rounded-2xl bg-zinc-950 border border-zinc-900 p-5 text-left flex-grow">
                  <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-4">Live Activity Log</span>
                  <div className="space-y-4">
                    {activityFeed.map((act, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-[11px] leading-relaxed text-zinc-400 border-b border-zinc-900/60 pb-3 last:border-b-0 last:pb-0">
                        <div className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center flex-shrink-0 text-zinc-500">
                          <Activity className="w-3 h-3" />
                        </div>
                        <div>
                          <p>{act.text}</p>
                          <span className="text-[9px] text-zinc-600 block mt-0.5">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
