import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { AlertOctagon, Sparkles } from 'lucide-react';

interface MetricProps {
  label: string;
  value: number;
  suffix?: string;
  changeText: string;
  isIncrease: boolean;
  colorClass: string;
}

function MetricWidget({ label, value, suffix = '', changeText, isIncrease, colorClass }: MetricProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1000;
      if (start === end) {
        setCount(end);
        return;
      }
      const inc = Math.max(Math.floor(duration / end), 15);
      const timer = setInterval(() => {
        start += 1;
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, inc);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 text-left relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
      
      <span className="text-[10px] font-extrabold uppercase text-zinc-550 tracking-widest block mb-3">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-white">{count}</span>
        <span className="text-sm font-bold text-zinc-500">{suffix}</span>
      </div>
      
      <div className="flex items-center justify-between border-t border-zinc-900 pt-3 mt-4 text-[10px] font-bold">
        <span className={isIncrease ? 'text-rose-500' : 'text-emerald-500'}>
          {changeText}
        </span>
        <span className={colorClass}>Active SLA</span>
      </div>
    </div>
  );
}

export default function CityPulsePanel() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Today's City Pulse</h2>
        <p className="text-xs text-zinc-500 mt-1">Real-time status diagnostics of municipal infrastructure telemetry.</p>
      </div>

      {/* Grid widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricWidget 
          label="Today's Reports" 
          value={42} 
          changeText="+18% vs yesterday" 
          isIncrease={true} 
          colorClass="text-primary" 
        />
        <MetricWidget 
          label="SLA Resolved" 
          value={18} 
          changeText="-8% response time" 
          isIncrease={false} 
          colorClass="text-emerald-500" 
        />
        <MetricWidget 
          label="Critical Tickets" 
          value={3} 
          changeText="Urgent dispatcher queue" 
          isIncrease={true} 
          colorClass="text-rose-500" 
        />
        
        {/* Highest Risk Ward card */}
        <div className="p-6 rounded-2xl border border-rose-500/20 bg-zinc-950/30 text-left flex flex-col justify-between group">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-widest block mb-3">Highest Risk Zone</span>
            <span className="text-3xl font-black text-white block">Ward 5</span>
            <p className="text-[10px] text-zinc-550 mt-1 uppercase font-extrabold tracking-wider">Sector Road Damage</p>
          </div>
          <div className="flex items-center gap-1 mt-4 border-t border-zinc-900 pt-3 text-[10px] font-bold text-rose-500">
            <AlertOctagon className="w-3.5 h-3.5" /> Heavily Degraded
          </div>
        </div>
      </div>

      {/* Mini telemetry sparkline table mock */}
      <div className="p-6 rounded-[24px] border border-zinc-900 bg-zinc-950/40 text-left">
        <div className="flex items-center gap-1.5 mb-5 text-white">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold">Diagnostics Operations Map Feed</span>
        </div>

        <div className="space-y-4">
          {[
            { area: 'Sector 5 Primary School Road', type: 'Asphalt Pothole', load: 'Heavy commuter path', status: 'Dispatched' },
            { area: 'Lincoln Boulevard, Ward 3', type: 'Main Leakage', load: 'Water pressure drop 8%', status: 'Assigned' },
            { area: 'Oak Avenue, Ward 7', type: 'Sanitary Overflow', load: 'Commercial trash bins', status: 'Pending' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900/60 gap-3 text-xs font-semibold text-zinc-400">
              <div>
                <span className="text-white font-bold block">{item.area}</span>
                <span className="text-[10px] text-zinc-500">{item.type} • {item.load}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-primary/10 border border-primary/20 text-primary self-start sm:self-auto">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
