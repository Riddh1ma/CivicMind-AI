import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface CTAProps {
  onGetStarted: () => void;
}

export default function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-28 relative overflow-hidden bg-[#09090B] border-t border-zinc-900">
      {/* Radial Blue-Purple Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] sm:w-[800px] sm:h-[500px] rounded-full bg-gradient-to-tr from-primary/10 to-secondary/15 blur-[140px] pointer-events-none animate-pulse-slow" />

      {/* Grid overlay mask */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-extrabold uppercase text-primary tracking-widest mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" /> Deploy Intelligence Today
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]"
        >
          Build Smarter Cities <br />
          with CivicMind AI
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-10 font-semibold"
        >
          Equip your municipal agency and citizen groups with real-time autonomous diagnostics, spatial routing, and explainable AI.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-fit mx-auto"
        >
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto relative px-8 py-4 rounded-2xl font-bold text-sm overflow-hidden group bg-primary text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] group-hover:bg-right transition-all duration-500" />
          </button>

          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-zinc-850 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/60 backdrop-blur-md text-zinc-300 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 fill-zinc-400 text-zinc-400" />
            View Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
