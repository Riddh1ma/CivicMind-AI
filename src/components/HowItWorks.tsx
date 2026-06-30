import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, 
  Cpu, 
  BrainCircuit, 
  Wrench, 
  Users, 
  CheckCircle2 
} from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: UploadCloud,
      title: 'Citizen Reports',
      desc: 'Citizen uploads an incident photo (e.g. pothole, outage) with auto-captured coordinates.',
      color: 'from-blue-600 to-blue-400',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
    },
    {
      icon: Cpu,
      title: 'AI Understands',
      desc: 'Computer vision validates the image, detects details, and flags duplicate entries.',
      color: 'from-cyan-600 to-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.35)]',
    },
    {
      icon: BrainCircuit,
      title: 'AI Reasons',
      desc: 'Cognitive engine calculates safety risk, maps constraints, and routes to correct agency.',
      color: 'from-purple-600 to-purple-400',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    },
    {
      icon: Wrench,
      title: 'Authority Acts',
      desc: 'Municipal dispatch receives structured recommendations, routes, and auto work-orders.',
      color: 'from-amber-600 to-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    },
    {
      icon: Users,
      title: 'Community Confirms',
      desc: 'Local feedback loops verify resolution status, preventing system gaps.',
      color: 'from-pink-600 to-pink-400',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
    },
    {
      icon: CheckCircle2,
      title: 'Issue Resolved',
      desc: 'SLA is signed off, notifications dispatch to reporter, and registry registers resolution.',
      color: 'from-emerald-600 to-emerald-400',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    },
  ];

  // Energy pulse cycle loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-zinc-950/40 border-t border-zinc-900">
      {/* Background Gradients */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

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
            Workflow
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            How CivicMind AI Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            From reporting to physical repair, discover the fully autonomous path that accelerates civic operations.
          </motion.p>
        </div>

        {/* Timeline Desktop Layout */}
        <div className="hidden lg:block relative mt-24">
          {/* Main Connector Line */}
          <div className="absolute top-[52px] left-[5%] right-[5%] h-[2px] bg-zinc-800 pointer-events-none" />
          
          {/* Active Progress Connector */}
          <motion.div
            animate={{ width: `${(activeStep / (steps.length - 1)) * 90}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute top-[52px] left-[5%] h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] pointer-events-none"
          />

          {/* Energy pulse bead traveling along timeline */}
          <motion.div
            animate={{ left: ['5%', '95%'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[49px] w-6.5 h-[8px] bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full blur-[1px] shadow-[0_0_15px_rgba(59,130,246,0.9)] pointer-events-none"
          />

          <div className="grid grid-cols-6 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLit = idx === activeStep;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center relative group cursor-pointer"
                  onClick={() => setActiveStep(idx)}
                >
                  {/* Step Node */}
                  <motion.div 
                    animate={{ scale: isLit ? 1.12 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative mb-8 z-10"
                  >
                    {/* Ring glow background */}
                    <div className="absolute inset-0 rounded-2xl bg-zinc-950 scale-105" />
                    
                    {/* Glowing outer border wrapper */}
                    <div className={`absolute inset-0 rounded-2xl p-[1px] blur-[0.5px] transition-all duration-500 bg-gradient-to-tr ${
                      isLit 
                        ? 'from-primary to-secondary' 
                        : 'from-zinc-800 to-zinc-900 group-hover:from-primary/50 group-hover:to-secondary/50'
                    }`} />
                    
                    {/* Node Container */}
                    <div className={`relative w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isLit 
                        ? `bg-zinc-950 text-white ${step.glow} border border-primary/25` 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-zinc-350'
                    }`}>
                      <Icon className={`w-10 h-10 transition-transform duration-300 ${isLit ? 'scale-110' : 'group-hover:scale-105'}`} />
                    </div>

                    {/* Step Number Tag */}
                    <div className={`absolute -top-3 -right-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide border transition-colors ${
                      isLit 
                        ? `${step.badgeColor} border-primary/25` 
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}>
                      0{idx + 1}
                    </div>
                  </motion.div>

                  {/* Step Title */}
                  <h3 className={`text-base font-bold mb-3 transition-colors duration-300 ${
                    isLit ? 'text-primary' : 'text-white group-hover:text-zinc-300'
                  }`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[170px] transition-opacity duration-300">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-12 relative before:absolute before:top-4 before:bottom-4 before:left-8 before:w-[2px] before:bg-zinc-800">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLit = idx === activeStep;
            return (
              <div
                key={idx}
                className="flex items-start gap-6 relative cursor-pointer"
                onClick={() => setActiveStep(idx)}
              >
                {/* Node */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border ${
                    isLit 
                      ? 'bg-zinc-950 text-white border-primary shadow-[0_0_15px_rgba(37,99,235,0.25)]' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${
                    isLit ? `${step.badgeColor} border-primary/20` : 'bg-zinc-900 text-zinc-500 border-zinc-850'
                  }`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-2 text-left">
                  <h3 className={`text-xl font-bold mb-2 ${isLit ? 'text-primary' : 'text-white'}`}>{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
