import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Activity, 
  Search, 
  CloudRain, 
  Users, 
  Compass, 
  Zap 
} from 'lucide-react';

export default function LiveAIAnalysis() {
  // Demo states: 'idle' | 'uploading' | 'analyzing' | 'completed'
  const [demoState, setDemoState] = useState<'idle' | 'uploading' | 'analyzing' | 'completed'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeCheckIndex, setActiveCheckIndex] = useState(-1);
  const [reasoningVisible, setReasoningVisible] = useState(false);

  const analysisChecks = [
    { text: 'Detecting road damage...', icon: Search },
    { text: 'Reading GPS coordinates...', icon: Compass },
    { text: 'Checking weather forecast...', icon: CloudRain },
    { text: 'Searching duplicate reports...', icon: Users },
    { text: 'Calculating traffic impact...', icon: Activity },
    { text: 'Estimating public safety risk...', icon: ShieldAlert },
    { text: 'Selecting responsible department...', icon: Zap },
    { text: 'Generating recommendation...', icon: Check },
  ];

  // ShieldAlert placeholder inside the local array to avoid duplicate imports
  function ShieldAlert(props: any) {
    return <AlertTriangle {...props} />;
  }

  // Trigger Demo on component render / viewport inView
  useEffect(() => {
    if (demoState === 'idle') {
      setDemoState('uploading');
    }
  }, [demoState]);

  // Handle uploading progress state
  useEffect(() => {
    let timer: any;
    if (demoState === 'uploading') {
      setUploadProgress(0);
      timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setDemoState('analyzing');
            return 100;
          }
          return prev + 4;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [demoState]);

  // Handle step-by-step checks progression
  useEffect(() => {
    let timer: any;
    if (demoState === 'analyzing') {
      setActiveCheckIndex(0);
      timer = setInterval(() => {
        setActiveCheckIndex((prev) => {
          if (prev >= analysisChecks.length - 1) {
            clearInterval(timer);
            setTimeout(() => {
              setDemoState('completed');
            }, 800);
            return analysisChecks.length;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [demoState]);

  // Trigger sequential reasoning reveal on completed
  useEffect(() => {
    if (demoState === 'completed') {
      setReasoningVisible(false);
      const timer = setTimeout(() => {
        setReasoningVisible(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [demoState]);

  const restartDemo = () => {
    setDemoState('uploading');
    setUploadProgress(0);
    setActiveCheckIndex(-1);
    setReasoningVisible(false);
  };

  return (
    <section id="ai-showcase" className="py-24 relative overflow-hidden bg-[#09090B] border-t border-zinc-900">
      {/* Background gradients */}
      <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

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
            Live Demonstration
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 animate-glow-pulse"
          >
            Live AI Analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Watch CivicMind AI autonomously understand and prioritize a real civic issue.
          </motion.p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT: Upload Simulation Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-[28px] overflow-hidden border border-zinc-800 bg-zinc-950/40 p-6 flex-grow flex flex-col justify-between min-h-[480px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-extrabold tracking-wider uppercase text-zinc-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Image Upload Interface
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">PIPELINE_INIT</span>
                </div>

                <AnimatePresence mode="wait">
                  {/* UPLOADING STATE */}
                  {demoState === 'uploading' && (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20"
                    >
                      <UploadCloud className="w-12 h-12 text-zinc-600 mb-4 animate-bounce" />
                      <span className="text-sm font-bold text-white mb-2">Uploading image...</span>
                      
                      {/* Circular or horizontal progress bar */}
                      <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-3">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-secondary" 
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ ease: 'easeInOut' }}
                        />
                      </div>
                      <span className="text-xs font-mono text-zinc-500 mt-2">{uploadProgress}% Complete</span>
                    </motion.div>
                  )}

                  {/* ANALYZING & COMPLETED STATE */}
                  {(demoState === 'analyzing' || demoState === 'completed') && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner group">
                        <img
                          src="/pothole.png"
                          alt="Citizen pothole report"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        
                        {/* Scanning beam */}
                        {demoState === 'analyzing' && (
                          <motion.div
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#2563EB] pointer-events-none"
                          />
                        )}

                        {demoState === 'analyzing' && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5">
                            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                            <span className="text-xs font-extrabold tracking-widest text-white uppercase">Analyzing Context...</span>
                          </div>
                        )}
                      </div>

                      {/* Photo details summary */}
                      <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-5 text-left text-zinc-400">
                        <div className="text-xs flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-550" />
                          <span>40.7128° N, 74.0060° W</span>
                        </div>
                        <div className="text-xs flex items-center gap-1.5 justify-end">
                          <Clock className="w-3.5 h-3.5 text-zinc-550" />
                          <span>1.4 min ago</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reset controls */}
              {demoState === 'completed' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <button
                    onClick={restartDemo}
                    className="w-full py-3.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-350 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 hover:scale-102"
                  >
                    <RefreshCw className="w-4 h-4" /> Replay Live Demo
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* RIGHT: AI Thinking Console & Final Decision Card */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-[28px] overflow-hidden border border-zinc-800 bg-zinc-950/40 p-8 flex-grow flex flex-col justify-between min-h-[480px]"
            >
              <AnimatePresence mode="wait">
                {/* STATE 1: UPLOADING INITIAL CONSOLE */}
                {demoState === 'uploading' && (
                  <motion.div
                    key="console-idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-center text-zinc-650"
                  >
                    <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                    <span className="text-xs font-mono">Awaiting image stream confirmation...</span>
                  </motion.div>
                )}

                {/* STATE 2: STEP-BY-STEP CHECK LIST */}
                {demoState === 'analyzing' && (
                  <motion.div
                    key="console-checking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 flex-grow flex flex-col justify-center text-left"
                  >
                    <span className="text-[10px] font-mono text-zinc-550 block mb-2 uppercase tracking-widest">Autonomous Pipeline Log</span>
                    <div className="space-y-3 font-mono text-xs text-zinc-300">
                      {analysisChecks.map((check, idx) => {
                        const CheckIcon = check.icon;
                        const isFinished = idx < activeCheckIndex;

                        if (idx > activeCheckIndex) return null;

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/30 border border-zinc-900/50"
                          >
                            <div className="flex items-center gap-3">
                              {isFinished ? (
                                <span className="text-emerald-500 font-bold">✔</span>
                              ) : (
                                <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                              )}
                              <span className={isFinished ? 'text-zinc-400' : 'text-white font-semibold'}>
                                {check.text}
                              </span>
                            </div>
                            <CheckIcon className={`w-3.5 h-3.5 ${isFinished ? 'text-zinc-600' : 'text-primary'}`} />
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STATE 3: FINAL DECISION CARD */}
                {demoState === 'completed' && (
                  <motion.div
                    key="console-completed"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-grow flex flex-col justify-between text-left space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                        <span className="text-[10px] font-extrabold uppercase text-primary tracking-widest">Decision Matrix</span>
                        <span className="px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Critical Dispatch
                        </span>
                      </div>

                      {/* Specs grids */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900">
                          <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-1">Issue Type</span>
                          <span className="text-xs font-bold text-white">Pothole</span>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900">
                          <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-1">Priority</span>
                          <span className="text-xs font-bold text-rose-500">Critical</span>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900">
                          <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-1">Confidence</span>
                          <span className="text-xs font-bold text-accent">96%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 col-span-2 sm:col-span-1">
                          <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-1">Department</span>
                          <span className="text-xs font-bold text-white truncate block">Road Maintenance</span>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 col-span-2">
                          <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-1">Estimated Impact</span>
                          <span className="text-xs font-bold text-white">3200 commuters/day</span>
                        </div>
                      </div>
                    </div>

                    {/* Sequential Reasoning Bullets */}
                    <AnimatePresence>
                      {reasoningVisible && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-900 space-y-3"
                        >
                          <span className="text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider block">Explainable AI Reasoning</span>
                          <div className="space-y-2.5 text-xs text-zinc-300">
                            {[
                              'Located near school zone',
                              'Heavy traffic density collector road',
                              'Rain forecast triggers sub-base wash risk',
                              'Four duplicate reports automatically clustered',
                            ].map((bullet, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.25 }}
                                className="flex items-center gap-2.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{bullet}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Final Recommendation Box */}
                    <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
                      <span className="text-[9px] font-extrabold uppercase text-primary tracking-widest block mb-1">Action SLA recommendation</span>
                      <span className="text-base font-extrabold text-white">Repair within 24 hours</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
