import { motion } from 'framer-motion';
import { User, ShieldAlert, Hammer, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "Reporting a dangerous pothole near my daughter's school took exactly 10 seconds. I received a notification showing the AI classification, and the next morning a repair crew was physically patching it. The transparency is incredible.",
      author: "Sarah Jenkins",
      role: "Citizen",
      icon: User,
      borderGlow: "group-hover:border-blue-500/30",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    },
    {
      quote: "CivicMind transformed how we handle dispatch. Instead of dealing with thousands of angry duplicate phone calls, we receive grouped, verified work recommendations. AI routes issues to the right department automatically, cutting resolution SLA by 70%.",
      author: "Director Marcus Vance",
      role: "Municipal Operations Officer",
      icon: ShieldAlert,
      borderGlow: "group-hover:border-purple-500/30",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    },
    {
      quote: "The navigation and recommendation engine tells us exactly what materials and tools we need before we drive out to a site. It prevents second trips, maps out the best route, and handles photo verification once the work is completed.",
      author: "Robert Kowalski",
      role: "Field Infrastructure Worker",
      icon: Hammer,
      borderGlow: "group-hover:border-emerald-500/30",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#09090B]">
      {/* Background Glow */}
      <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-primary mb-3"
          >
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Voice of the Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Hear how CivicMind is driving collaboration between citizens, operations teams, and field crews.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => {
            const Icon = rev.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`group glass-card p-8 rounded-[24px] relative overflow-hidden transition-all duration-300 border border-zinc-800 bg-zinc-950/20 backdrop-blur-md flex flex-col justify-between hover:-translate-y-1.5 ${rev.borderGlow} ${rev.glowColor}`}
              >
                {/* Quote Icon Background */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-zinc-850 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                
                <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 text-left mb-8 relative z-10 font-medium">
                  "{rev.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 border-t border-zinc-900 pt-5 mt-auto relative z-10 text-left">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-300">{rev.author}</span>
                    <span className="text-[11px] font-semibold text-zinc-550">{rev.role}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
