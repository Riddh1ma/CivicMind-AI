import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Activity, 
  CheckCircle, 
  AlertOctagon, 
  TrendingUp, 
  TrendingDown, 
  Droplet, 
  Trash2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: string;
  isPositive?: boolean;
  sparkline?: 'up' | 'down' | 'moderate';
  colorClass?: string;
  icon: any;
}

function MetricPulseCard({ title, value, suffix = '', trend, isPositive, sparkline, colorClass = 'text-primary', icon: Icon }: MetricCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1200; // 1.2s
      if (start === end) {
        setCount(end);
        return;
      }
      const incrementTime = Math.max(Math.floor(duration / end), 15);
      const timer = setInterval(() => {
        start += 1;
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-[24px] p-6 border border-zinc-800 bg-zinc-950/30 hover:border-zinc-700/60 shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550">{title}</span>
        <div className={`w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-3xl font-black text-white">{count}</span>
        <span className="text-lg font-bold text-zinc-550">{suffix}</span>
      </div>

      {trend && (
        <div className="flex items-center justify-between mt-4 border-t border-zinc-900/60 pt-3 relative z-10">
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isPositive ? 'text-rose-500' : 'text-emerald-500'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend}
          </span>

          {/* SVG Sparklines */}
          {sparkline === 'up' && (
            <svg className="w-20 h-6 text-rose-500" viewBox="0 0 100 30" fill="none">
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                d="M0,25 Q20,20 40,15 T80,8 T100,2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
            </svg>
          )}
          {sparkline === 'down' && (
            <svg className="w-20 h-6 text-emerald-500" viewBox="0 0 100 30" fill="none">
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                d="M0,2 Q20,8 40,12 T80,22 T100,28" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
            </svg>
          )}
          {sparkline === 'moderate' && (
            <svg className="w-20 h-6 text-amber-500" viewBox="0 0 100 30" fill="none">
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                d="M0,22 Q25,12 50,18 T100,6" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
            </svg>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function CityPulse() {
  return (
    <section id="city-pulse" className="py-24 relative overflow-hidden bg-[#09090B] border-t border-zinc-900">
      {/* Background elements */}
      <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-primary mb-3"
          >
            Diagnostics Hub
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Today's City Pulse
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Real-time AI overview of city infrastructure health.
          </motion.p>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: 42 New Reports */}
          <MetricPulseCard 
            title="New Reports" 
            value={42} 
            suffix=" incidents" 
            trend="+18% vs last week" 
            isPositive={true} 
            sparkline="up" 
            colorClass="text-blue-500" 
            icon={Activity} 
          />

          {/* Card 2: 18 Resolved Today */}
          <MetricPulseCard 
            title="Resolved Today" 
            value={18} 
            suffix=" resolved" 
            trend="-23% SLA duration" 
            isPositive={false} 
            sparkline="down" 
            colorClass="text-emerald-500" 
            icon={CheckCircle} 
          />

          {/* Card 3: Highest Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-[24px] p-6 border border-rose-500/20 bg-zinc-950/30 hover:border-rose-500/40 shadow-lg transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 block mb-3">Highest Risk Area</span>
              <span className="text-3xl font-black text-white">Ward 5</span>
              <p className="text-[11px] text-zinc-500 mt-2 font-semibold uppercase tracking-wider">Critical Infrastructure Zone</p>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-900 pt-3 mt-4 text-[10px] font-bold text-rose-500">
              <span className="flex items-center gap-1"><AlertOctagon className="w-3.5 h-3.5" /> Road Damage Zone</span>
            </div>
          </motion.div>

          {/* Card 4: Emergency Alerts */}
          <MetricPulseCard 
            title="Emergency Alerts" 
            value={3} 
            suffix=" critical" 
            trend="Active dispatch queues" 
            isPositive={true} 
            colorClass="text-rose-500" 
            icon={AlertOctagon} 
          />

        </div>

        {/* 3 Secondary Pulse Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <MetricPulseCard 
            title="Road Damage Index" 
            value={23} 
            suffix="%" 
            trend="+23% road degradation" 
            isPositive={true} 
            sparkline="up" 
            colorClass="text-rose-400" 
            icon={Activity} 
          />

          <MetricPulseCard 
            title="Water Leakage Index" 
            value={8} 
            suffix="%" 
            trend="-8% water pressure drop" 
            isPositive={false} 
            sparkline="down" 
            colorClass="text-blue-400" 
            icon={Droplet} 
          />

          <MetricPulseCard 
            title="Garbage Overflow Index" 
            value={12} 
            suffix="%" 
            trend="+12% sanitary alerts" 
            isPositive={true} 
            sparkline="moderate" 
            colorClass="text-amber-400" 
            icon={Trash2} 
          />

        </div>

        {/* AI Recommendation Card (Stripe styled layout) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-card rounded-[28px] overflow-hidden border border-primary/20 bg-zinc-950/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-left flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Accent glow corner */}
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -mr-12 -mb-12 pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase text-primary tracking-widest">AI Dispatch Prompt</span>
                <span className="text-[9px] font-bold text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded-full uppercase">Optimal Action</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deploy Team A to Ward 5</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl font-medium">
                <strong className="text-white">Reason:</strong> Rapid increase in localized road damage reports combined with heavy rainfall forecasts within the next 24 hours. Early intervention avoids sub-base erosion and reduces emergency repair costs by 82%.
              </p>
            </div>
          </div>

          <button className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all flex-shrink-0 group hover:scale-102">
            Execute Dispatch <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
