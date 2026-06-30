import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Clock, 
  RefreshCw, 
  ArrowRight, 
  Code,
  Terminal,
  Layers
} from 'lucide-react';

export default function AIShowcase() {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'json'>('summary');
  const [diagnosticState, setDiagnosticState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);

  const reasoningPoints = [
    'Located near school',
    'Heavy traffic zone detected',
    'Multiple duplicate reports aggregated',
    'Rain forecast increases risk of expansion'
  ];

  const mockJson = `{
  "id": "rep_9x8f2d1a",
  "status": "classified",
  "incident": {
    "type": "Pothole",
    "confidence": 0.96
  },
  "prioritization": {
    "urgency": "critical",
    "estimated_impact": "3200 commuters/day"
  },
  "routing": {
    "department": "Road Maintenance Division",
    "action": "Repair within 24 hours",
    "factors": [
      "near_school_zone",
      "heavy_traffic",
      "multiple_duplicates",
      "rain_forecast_risk"
    ]
  }
}`;

  useEffect(() => {
    let interval: any;
    if (diagnosticState === 'scanning') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDiagnosticState('complete');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [diagnosticState]);

  // Simulate typing effect for reasoning logs
  useEffect(() => {
    if (diagnosticState === 'complete') {
      setTypingIndex(0);
      const timer = setInterval(() => {
        setTypingIndex((prev) => {
          if (prev >= reasoningPoints.length) {
            clearInterval(timer);
            return reasoningPoints.length;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(timer);
    }
  }, [diagnosticState]);

  const handleStartDiagnostic = () => {
    setDiagnosticState('scanning');
    setProgress(0);
  };

  return (
    <section id="ai-showcase" className="py-24 relative overflow-hidden bg-[#09090B]">
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[150px] pointer-events-none animate-pulse-slow" />

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
            Live Agent Demo
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Explainable AI Showcase
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Watch CivicMind AI analyze a street-level report, assign priorities, and output explainable city-dispatch reasoning logs.
          </motion.p>
        </div>

        {/* Dynamic Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Report File Preview */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-[28px] overflow-hidden border border-zinc-805 bg-zinc-950/40 p-6 flex-grow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold tracking-wider uppercase text-zinc-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Report Telemetry
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">REF_9X8F2D1A</span>
                </div>

                {/* Pothole Image Container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <img
                    src="/pothole.png"
                    alt="Pothole Incident"
                    className="w-full h-full object-cover select-none"
                  />
                  
                  {/* Scanning HUD overlay */}
                  {diagnosticState === 'scanning' && (
                    <motion.div
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#2563EB] pointer-events-none"
                    />
                  )}

                  {/* Processing blur overlay */}
                  {diagnosticState === 'scanning' && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-xs font-bold tracking-widest text-white">AI CLASSIFYING...</span>
                    </div>
                  )}
                </div>

                {/* Report Meta Details */}
                <div className="mt-6 space-y-3.5 border-t border-zinc-900 pt-5 text-zinc-400">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-zinc-500" /> GPS Location</span>
                    <span className="font-mono text-zinc-300">40.7128° N, 74.0060° W</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-zinc-500" /> Upload Time</span>
                    <span className="text-zinc-300">Today, 18:42:05 EST</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Audit Pipeline Status</span>
                    {diagnosticState === 'idle' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-bold uppercase">Pending Analysis</span>
                    )}
                    {diagnosticState === 'scanning' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase">Processing</span>
                    )}
                    {diagnosticState === 'complete' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-[10px] font-bold uppercase flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Fully Audited
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action dispatch button */}
              <div className="mt-8">
                {diagnosticState === 'idle' && (
                  <button
                    onClick={handleStartDiagnostic}
                    className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    Run AI Diagnostics <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {diagnosticState === 'scanning' && (
                  <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                      <span>Reasoning engine audit...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {diagnosticState === 'complete' && (
                  <button
                    onClick={handleStartDiagnostic}
                    className="w-full py-4 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-sm bg-zinc-950/60 hover:bg-zinc-900/60 transition-all flex items-center justify-center gap-2"
                  >
                    Re-run Diagnostics <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Intelligent City Decision Panel (Gemini style) */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card rounded-[28px] overflow-hidden border border-zinc-800/80 bg-zinc-950/40 flex-grow flex flex-col justify-between"
            >
              {/* Tabs header */}
              <div className="border-b border-zinc-900 bg-zinc-950/60 px-6 py-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'summary' 
                        ? 'bg-zinc-900 text-white border border-zinc-800' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Executive Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'details' 
                        ? 'bg-zinc-900 text-white border border-zinc-800' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" /> Reasoning Logs
                  </button>
                  <button
                    onClick={() => setActiveTab('json')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'json' 
                        ? 'bg-zinc-900 text-white border border-zinc-800' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" /> Dev JSON
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Explainable AI</span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-8 flex-grow flex flex-col justify-center">
                {diagnosticState === 'idle' && (
                  <div className="text-center py-20">
                    <Terminal className="w-12 h-12 text-zinc-700 mx-auto mb-4 animate-bounce" />
                    <h4 className="text-white font-bold mb-2">Awaiting Diagnostic Input</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      Click the "Run AI Diagnostics" button on the telemetry card to analyze the image and inspect decision outputs.
                    </p>
                  </div>
                )}

                {diagnosticState === 'scanning' && (
                  <div className="flex flex-col gap-6 items-center justify-center py-16">
                    <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                    <div className="text-center space-y-2">
                      <h4 className="text-white font-bold">Executing Multi-Agent Reasoning</h4>
                      <p className="text-xs text-zinc-500 max-w-sm">
                        Calculating spatial proximity to safety structures, traffic statistics, rain index, and matching municipal dispatch queues.
                      </p>
                    </div>
                  </div>
                )}

                {diagnosticState === 'complete' && (
                  <div className="flex-grow flex flex-col justify-between h-full">
                    <AnimatePresence mode="wait">
                      {/* Summary Tab */}
                      {activeTab === 'summary' && (
                        <motion.div
                          key="summary"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6 text-left"
                        >
                          {/* 5 Metadata Items Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900">
                              <span className="text-[9px] font-extrabold uppercase text-zinc-500 block mb-1">Issue</span>
                              <span className="text-xs font-bold text-white">Pothole</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900">
                              <span className="text-[9px] font-extrabold uppercase text-zinc-500 block mb-1">Priority</span>
                              <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 fill-rose-500/10" /> Critical
                              </span>
                            </div>
                            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900">
                              <span className="text-[9px] font-extrabold uppercase text-zinc-500 block mb-1">Confidence</span>
                              <span className="text-xs font-bold text-accent">96%</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900 col-span-2 sm:col-span-1">
                              <span className="text-[9px] font-extrabold uppercase text-zinc-500 block mb-1">Department</span>
                              <span className="text-xs font-bold text-white truncate block">Road Maintenance</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-900 col-span-2">
                              <span className="text-[9px] font-extrabold uppercase text-zinc-500 block mb-1">Estimated Impact</span>
                              <span className="text-xs font-bold text-white">3200 commuters/day</span>
                            </div>
                          </div>

                          {/* Reasoning Bullets List */}
                          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-900">
                            <span className="text-[9px] font-extrabold uppercase text-zinc-500 block mb-3">AI Reasoning Audit</span>
                            <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Located near school zone
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> High-volume traffic collector
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Multiple duplicate reports aggregated
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Heavy rain forecast increases risk
                              </li>
                            </ul>
                          </div>

                          {/* Recommendation */}
                          <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden">
                            <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">AI Recommendation</h4>
                            <p className="text-base font-extrabold text-white">Repair within 24 hours</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Details (Reasoning Logs) Tab */}
                      {activeTab === 'details' && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 text-left"
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Autonomous Telemetry Audit:</h4>
                          <ul className="space-y-3 font-mono text-[11px] text-zinc-300">
                            {reasoningPoints.slice(0, typingIndex).map((point, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-start gap-3"
                              >
                                <span className="text-primary font-bold">●</span>
                                <span>{point}</span>
                              </motion.li>
                            ))}
                          </ul>
                          {typingIndex < reasoningPoints.length && (
                            <span className="inline-block w-2 h-4 bg-zinc-650 animate-pulse ml-6 mt-1" />
                          )}
                        </motion.div>
                      )}

                      {/* Developer JSON Tab */}
                      {activeTab === 'json' && (
                        <motion.div
                          key="json"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full"
                        >
                          <pre className="font-mono text-[11px] text-zinc-400 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 overflow-x-auto text-left leading-relaxed">
                            <code>{mockJson}</code>
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
