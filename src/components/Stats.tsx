import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  delay: number;
}

function StatCard({ value, suffix, label, description, delay }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const end = value;
      if (start === end) return;

      const totalMiliseconds = duration;
      // For large numbers, step faster
      const stepFactor = end > 1000 ? Math.ceil(end / 100) : 1;
      const incrementTime = Math.max(Math.floor(totalMiliseconds / (end / stepFactor)), 15);
      
      const timer = setInterval(() => {
        start += stepFactor;
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative glass-card p-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/30 overflow-hidden group text-center"
    >
      {/* Background glow hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Stat Counter */}
      <div className="relative mb-2">
        <span className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
          {count.toLocaleString()}
        </span>
        <span className="text-4xl sm:text-5xl font-extrabold text-primary ml-0.5 group-hover:text-secondary transition-colors duration-300">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <h3 className="text-lg font-bold text-white mb-2 relative z-10">
        {label}
      </h3>
      
      {/* Description */}
      <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300 relative z-10 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  const statsData = [
    {
      value: 10000,
      suffix: '+',
      label: 'Issues Resolved',
      description: 'Fully audited infrastructure reports resolved across active municipalities.',
      delay: 0.1,
    },
    {
      value: 95,
      suffix: '%',
      label: 'AI Accuracy',
      description: 'Precision in target category classification and priority assessment.',
      delay: 0.2,
    },
    {
      value: 2,
      suffix: ' Million+',
      label: 'Citizens Protected',
      description: 'Living in urban zones managed by municipal AI deployment.',
      delay: 0.3,
    },
    {
      value: 500,
      suffix: '+',
      label: 'Authorities Connected',
      description: 'Verified federal, state, and local utility agencies linked on platform.',
      delay: 0.4,
    },
  ];

  return (
    <section id="statistics" className="py-24 relative overflow-hidden bg-[#09090B]">
      {/* Ambient backgrounds */}
      <div className="absolute top-[50%] left-[10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] right-[15%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, idx) => (
            <StatCard
              key={idx}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
