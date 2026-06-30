import { motion } from 'framer-motion';
import { 
  Eye, 
  MessageSquare, 
  Zap, 
  Users, 
  Bot, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      icon: Eye,
      title: 'AI Vision',
      description: 'Advanced computer vision parses uploaded photos to detect potholes, graffiti, debris, or damage instantly and accurately.',
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      textColor: 'text-blue-400 group-hover:text-blue-300',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    },
    {
      icon: MessageSquare,
      title: 'Explainable AI',
      description: 'Generates transparent reasoning trees for decision-making. Citizens and authorities understand exactly why a report is categorized.',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      textColor: 'text-purple-400 group-hover:text-purple-300',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    },
    {
      icon: Zap,
      title: 'Smart Prioritization',
      description: 'Automatically ranks reports based on critical metrics: proximity to school zones, weather patterns, traffic density, and safety risk.',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      textColor: 'text-amber-400 group-hover:text-amber-300',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    },
    {
      icon: Users,
      title: 'Community Verification',
      description: 'Crowd-sourced validation that checks for duplicate issues and aggregates citizen reports to prevent system spam and abuse.',
      color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
      textColor: 'text-pink-400 group-hover:text-pink-300',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]',
    },
    {
      icon: Bot,
      title: 'Municipal Copilot',
      description: 'An AI assistant built for city staff. Pre-drafts work orders, suggests response teams, and writes public status updates in one click.',
      color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30',
      textColor: 'text-indigo-400 group-hover:text-indigo-300',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Intelligence',
      description: 'Analyzes historical data to predict infrastructure failures before they happen, allowing proactive instead of reactive budgeting.',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      textColor: 'text-emerald-400 group-hover:text-emerald-300',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as any,
      },
    },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#09090B]">
      {/* Background Gradients */}
      <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-primary mb-3"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Why CivicMind AI?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Traditional complaint forms are static. CivicMind runs autonomous analysis on the edge to triage, route, and explain every issue in real time.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group relative rounded-[24px] p-[1px] bg-zinc-900 overflow-hidden hover:bg-gradient-to-br hover:from-primary/30 hover:to-secondary/30 transition-all duration-500"
              >
                {/* Main Card Background with Glass Highlight */}
                <div className={`h-full w-full rounded-[23px] bg-zinc-950/80 backdrop-blur-md p-8 border border-zinc-900/50 flex flex-col justify-between transition-all duration-300 transform group-hover:-translate-y-1.5 ${feature.glowColor}`}>
                  
                  {/* Subtle hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px] pointer-events-none`} />

                  <div className="relative z-10">
                    {/* Icon Block with subtle glow */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-900/90 border border-zinc-800 ${feature.textColor} mb-6 transition-all duration-300 group-hover:scale-110 shadow-inner group-hover:shadow-[0_0_15px_rgba(37,99,235,0.15)]`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-350">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom link indicator with sliding arrow */}
                  <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold text-zinc-550 group-hover:text-primary transition-colors duration-300 cursor-pointer relative z-10 w-fit">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
