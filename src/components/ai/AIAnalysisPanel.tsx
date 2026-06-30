import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ChevronRight } from 'lucide-react';

interface AIAnalysisPanelProps {
  reportId: string;
  category: string;
  onFinish: () => void;
}

interface Step {
  agent: string;
  log: string;
}

const CHECK_STEPS: Step[] = [
  { agent: 'Sentinel', log: 'Detecting issue parameters...' },
  { agent: 'Atlas', log: 'Reading spatial location coordinates...' },
  { agent: 'Pulse', log: 'Calculating public safety risk index...' },
  { agent: 'Dispatcher', log: 'Identifying optimal municipal department...' },
  { agent: 'Consensus', log: 'Scanning database registry for duplicate entries...' },
  { agent: 'Oracle', log: 'Predicting future structural and traffic impact...' },
];

export default function AIAnalysisPanel({ reportId, category, onFinish }: AIAnalysisPanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (activeStepIndex < CHECK_STEPS.length) {
      const timer = setTimeout(() => {
        setActiveStepIndex((prev) => prev + 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
    }
  }, [activeStepIndex]);

  // Determine dynamic details based on user selected category
  const getAIResult = () => {
    switch (category) {
      case 'Water Leakage':
        return {
          title: 'Main Pipeline Rupture',
          priority: 'High',
          confidence: '94%',
          department: 'Water & Utilities',
          impact: '420 households affected',
          recommendation: 'Shutoff valve and patch within 6 hours',
          reasons: ['Loss of pressure in grid', 'Severe erosion hazard', 'Basement flooding risks', 'Report matches nearby pressure drop'],
        };
      case 'Streetlight':
        return {
          title: 'Outage Node Failure',
          priority: 'Medium',
          confidence: '98%',
          department: 'Electrical Grid Services',
          impact: 'Pedestrian dark zones',
          recommendation: 'Replace ballast within 48 hours',
          reasons: ['Near pedestrian crosswalk', 'High crime corridor', 'Transit bus-stop zone', 'Auto-reported by segment sensors'],
        };
      case 'Garbage':
        return {
          title: 'Overflowing Sanitary Bin',
          priority: 'Medium',
          confidence: '95%',
          department: 'Sanitation & Refuse',
          impact: 'Biosecurity hazard index +12%',
          recommendation: 'Dispatch sanitary truck within 12 hours',
          reasons: ['Commercial zone path', 'Temperature above 25°C', 'Vector infestation risk', 'Duplicate community reports matched'],
        };
      default:
        return {
          title: 'Asphalt Pothole Failure',
          priority: 'Critical',
          confidence: '96%',
          department: 'Road Maintenance',
          impact: '3200 commuters / day',
          recommendation: 'Deploy patching team within 24 hours',
          reasons: ['Near primary school zone', 'Heavy peak hour transit', 'Imminent rainfall forecast', '4 duplicate citizen signals merged'],
        };
    }
  };

  const aiResult = getAIResult();

  return (
    <div className="glass-card rounded-[28px] border border-zinc-800 bg-[#0c0c10] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-left flex flex-col md:flex-row gap-8 items-stretch min-h-[500px]">
      
      {/* LEFT: Running Pipeline Simulator logs */}
      <div className="md:w-1/2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-900 pb-6 md:pb-0 md:pr-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Brain className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-primary tracking-widest block">Core AI Routing</span>
              <h3 className="text-base font-bold text-white">CivicMind AI Pipeline</h3>
            </div>
          </div>

          <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
            Classifying reported incident specifications, checking duplicates, and evaluating optimal authority dispatch parameters in real-time.
          </p>

          {/* Running pipeline steps logs */}
          <div className="space-y-3.5 font-mono text-xs">
            {CHECK_STEPS.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isChecked = idx < activeStepIndex;

              return (
                <div 
                  key={step.agent}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isActive 
                      ? 'bg-primary/5 border-primary/25 text-white' 
                      : isChecked
                        ? 'bg-zinc-900/30 border-zinc-900/60 text-zinc-400'
                        : 'border-transparent text-zinc-650'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-[9px] font-bold ${
                      isActive 
                        ? 'border-primary text-primary animate-pulse' 
                        : isChecked
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                          : 'border-zinc-800 text-zinc-700'
                    }`}>
                      {isChecked ? '✔' : idx + 1}
                    </div>
                    <div>
                      <span className={`font-bold block text-[10px] ${isActive ? 'text-primary' : isChecked ? 'text-zinc-350' : 'text-zinc-600'}`}>
                        {step.agent} Agent
                      </span>
                      <span className="text-[10px] text-zinc-500">{step.log}</span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-[10px] text-zinc-600 font-mono mt-6">
          Ticket UID Ref: <span className="text-zinc-450">{reportId}</span>
        </div>
      </div>

      {/* RIGHT: Final decision summary card */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="space-y-6 flex flex-col justify-between h-full"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase text-primary tracking-widest block">AI Classification</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{aiResult.title}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                    aiResult.priority === 'Critical' 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {aiResult.priority} Priority
                  </span>
                </div>

                {/* Details layout grids */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase text-zinc-550 block">Accuracy Match</span>
                    <span className="text-white text-sm font-bold block mt-1">{aiResult.confidence} Confidence</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase text-zinc-550 block">Target Department</span>
                    <span className="text-white text-sm font-bold block mt-1">{aiResult.department}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase text-zinc-550 block">Telemetry Impact</span>
                    <span className="text-rose-450 text-sm font-bold block mt-1">{aiResult.impact}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase text-zinc-550 block">Recommended Service</span>
                    <span className="text-white text-sm font-bold block mt-1">{aiResult.recommendation}</span>
                  </div>
                </div>

                {/* Reasoning listings */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-900 text-xs">
                  <span className="text-[9px] font-extrabold uppercase text-zinc-550 block mb-2">Core Dispatch Reasons</span>
                  <ul className="space-y-1.5 text-zinc-450 font-semibold">
                    {aiResult.reasons.map((reason, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary" /> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action buttons footer */}
              <button
                onClick={onFinish}
                className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-101"
              >
                Return to Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-grow text-zinc-650">
              <Sparkles className="w-8 h-8 animate-pulse text-zinc-600 mb-3" />
              <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Running Calculations...</span>
              <p className="text-[10px] text-zinc-500 max-w-[200px] mt-1.5 leading-relaxed">
                Staging Sentinel scanners, matching location matrices, and calculating community scores.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
