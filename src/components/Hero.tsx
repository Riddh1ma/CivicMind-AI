import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, Shield, Sparkles, AlertTriangle, Activity, CheckCircle, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  // Particles array for drifting backdrops
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -10,
  }));

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-[#09090B]">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      {/* Floating Radial Glows */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[150px] pointer-events-none animate-pulse-slow" />

      {/* Light Particles drifting across hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/20 blur-[0.5px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -250, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column: Vision Content */}
        <div className="lg:col-span-7 flex flex-col text-left">
          {/* Badge Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md mb-8 text-xs font-semibold text-zinc-300 w-fit"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-zinc-400">Autonomous Civic Intelligence</span>
            <div className="w-[1px] h-3 bg-zinc-800" />
            <span className="flex items-center gap-1 text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Google Cloud Hackathon
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
          >
            Your City's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-primary to-secondary">
              Autonomous
            </span> <br />
            Intelligence Platform
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 font-medium"
          >
            Transforming community reports into intelligent city decisions using explainable AI, autonomous agents, and real-time analytics.
          </motion.p>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-fit"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto relative px-8 py-4 rounded-2xl font-bold text-base overflow-hidden group bg-primary text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_35px_rgba(37,99,235,0.55)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] group-hover:bg-right transition-all duration-550 opacity-90 group-hover:opacity-100" />
            </button>

            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border border-zinc-800 hover:border-primary/45 bg-zinc-950/40 hover:bg-zinc-900/60 backdrop-blur-md text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-103 group shadow-inner"
            >
              <Play className="w-4 h-4 fill-zinc-300 text-zinc-300 group-hover:rotate-12 transition-transform duration-300" />
              Watch Demo
            </button>
          </motion.div>

          {/* Floating Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex items-center gap-8 text-xs text-zinc-500 uppercase tracking-widest font-bold"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> Autonomous Routing
            </div>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" /> Secure Infra
            </div>
          </motion.div>
        </div>

        {/* Right Column: Holographic Illustration + Floating telemetry cards */}
        <div className="lg:col-span-5 relative w-full h-[550px] flex items-center justify-center">
          {/* Subtle blue and purple radial gradients behind the city illustration */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-secondary/15 to-transparent rounded-full blur-[80px] opacity-75 pointer-events-none" />

          {/* Smart City Schematic SVG Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-full max-w-[450px] aspect-square flex items-center justify-center pointer-events-none select-none"
          >
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-zinc-800/20">
              {/* Rotating Concentric Rings */}
              <motion.circle 
                cx="250" 
                cy="250" 
                r="180" 
                stroke="rgba(37,99,235,0.06)" 
                strokeWidth="2" 
                strokeDasharray="5 15" 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '250px 250px' }}
              />
              <motion.circle 
                cx="250" 
                cy="250" 
                r="130" 
                stroke="rgba(139,92,246,0.08)" 
                strokeWidth="1.5" 
                strokeDasharray="10 10"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '250px 250px' }}
              />
              <circle cx="250" cy="250" r="80" stroke="rgba(16,185,129,0.06)" strokeWidth="1" />

              {/* Iso Network Lines */}
              <path d="M70,250 L430,250" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <path d="M250,70 L250,430" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <path d="M120,120 L380,380" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <path d="M120,380 L380,120" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* SVG Smart City Grid Structure */}
              <g opacity="0.35">
                <polygon points="250,150 350,200 250,250 150,200" fill="rgba(37,99,235,0.02)" stroke="rgba(37,99,235,0.2)" strokeWidth="1" />
                <polygon points="250,250 350,300 250,350 150,300" fill="rgba(139,92,246,0.02)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
                
                {/* Connecting vertical pillars */}
                <line x1="250" y1="150" x2="250" y2="250" stroke="rgba(37,99,235,0.15)" strokeWidth="1" />
                <line x1="150" y1="200" x2="150" y2="300" stroke="rgba(37,99,235,0.15)" strokeWidth="1" />
                <line x1="350" y1="200" x2="350" y2="300" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
                <line x1="250" y1="250" x2="250" y2="350" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
              </g>

              {/* Pulsing Hotspots (Nodes) */}
              <g>
                <circle cx="250" cy="200" r="4" fill="#2563EB" />
                <circle cx="250" cy="200" r="12" stroke="#2563EB" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '250px 200px' }} />
                
                <circle cx="150" cy="250" r="3" fill="#10B981" />
                <circle cx="150" cy="250" r="9" stroke="#10B981" strokeWidth="1" className="animate-pulse" style={{ transformOrigin: '150px 250px' }} />
                
                <circle cx="350" cy="220" r="3.5" fill="#8B5CF6" />
                <circle cx="350" cy="220" r="10" stroke="#8B5CF6" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '350px 220px' }} />
                
                <circle cx="250" cy="250" r="6" fill="#8B5CF6" />
                <circle cx="250" cy="250" r="18" stroke="#2563EB" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: '250px 250px' }} />
              </g>
            </svg>
          </motion.div>

          {/* Overlapping Floating Glass Cards (slow multi-direction float loops) */}
          
          {/* Card 1: Critical Issue (Top-Left) */}
          <motion.div
            animate={{ y: [0, -8, 4, 0], x: [0, 4, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            className="absolute top-6 left-0 sm:left-4 max-w-[210px] glass-card p-4 rounded-2xl border border-rose-500/20 hover:border-rose-500/50 bg-zinc-950/60 backdrop-blur-lg flex gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] hover:scale-105 cursor-pointer transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-rose-400">Critical Issue</span>
              <span className="text-xs font-bold text-white mt-0.5">Road Damage</span>
              <span className="text-[10px] text-zinc-550 mt-1">Ward 5</span>
            </div>
          </motion.div>

          {/* Card 2: AI Analysis (Top-Right) */}
          <motion.div
            animate={{ y: [0, 10, -6, 0], x: [0, -6, 4, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-24 right-0 sm:right-4 max-w-[215px] glass-card p-4 rounded-2xl border border-primary/20 hover:border-primary/50 bg-zinc-950/60 backdrop-blur-lg flex gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] hover:scale-105 cursor-pointer transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-primary">AI Analysis</span>
              <span className="text-xs font-bold text-white mt-0.5">Priority: Critical</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">Confidence: 96%</span>
            </div>
          </motion.div>

          {/* Card 3: Resolved Today (Bottom-Left) */}
          <motion.div
            animate={{ y: [0, -6, 10, 0], x: [0, -8, 6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute bottom-20 left-2 sm:left-12 max-w-[200px] glass-card p-4 rounded-2xl border border-accent/20 hover:border-accent/50 bg-zinc-950/60 backdrop-blur-lg flex gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.2)] hover:scale-105 cursor-pointer transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-accent">Resolved Today</span>
              <span className="text-xs font-bold text-white mt-0.5">142 Issues</span>
              <span className="text-[10px] text-zinc-550 mt-0.5">+23% vs yesterday</span>
            </div>
          </motion.div>

          {/* Card 4: Community Verification (Bottom-Right) */}
          <motion.div
            animate={{ y: [0, 8, -8, 0], x: [0, 6, -4, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
            className="absolute bottom-8 right-2 sm:right-10 max-w-[220px] glass-card p-4 rounded-2xl border border-secondary/20 hover:border-secondary/50 bg-zinc-950/60 backdrop-blur-lg flex gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.25)] hover:scale-105 cursor-pointer transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-secondary">Community Verified</span>
              <span className="text-xs font-bold text-white mt-0.5">Crowd Match: 96.3%</span>
              <span className="text-[10px] text-zinc-550 mt-1">238 confirmations</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
