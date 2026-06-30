import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Map as MapIcon, 
  AlertTriangle, 
  Radio, 
  Layers,
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function CityIntelligenceMap() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>('pothole-1');

  const markers = [
    {
      id: 'pothole-1',
      title: 'Critical Pothole',
      priority: 'Critical',
      ward: 'Ward 5',
      status: 'Assigned',
      verification: '96%',
      type: 'pothole',
      x: 180,
      y: 110,
    },
    {
      id: 'leakage-1',
      title: 'Main Pipe Rupture',
      priority: 'High',
      ward: 'Ward 3',
      status: 'In Progress',
      verification: '92%',
      type: 'leakage',
      x: 380,
      y: 70,
    },
    {
      id: 'garbage-1',
      title: 'Overflowing Bin',
      priority: 'Medium',
      ward: 'Ward 7',
      status: 'Dispatched',
      verification: '88%',
      type: 'garbage',
      x: 290,
      y: 190,
    },
    {
      id: 'signal-1',
      title: 'Broken Signal',
      priority: 'Low',
      ward: 'Ward 2',
      status: 'Pending',
      verification: '78%',
      type: 'signal',
      x: 110,
      y: 210,
    },
  ];

  return (
    <section id="city-intelligence-map" className="py-24 relative overflow-hidden bg-[#09090B] border-t border-zinc-900">
      {/* Background ambient lighting */}
      <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-primary mb-3"
          >
            Spatial Analysis
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Real-Time City Intelligence Map
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Autonomous geographic routing showing clustered sensor telemetry and active incident queues.
          </motion.p>
        </div>

        {/* Interactive Map Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: The Map Visual Canvas (col-span-8) */}
          <div className="lg:col-span-8 relative rounded-[28px] border border-zinc-800 bg-zinc-950 overflow-hidden min-h-[440px] flex items-center justify-center">
            
            {/* Google Map Dark Network Overlay */}
            <svg viewBox="0 0 600 300" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" fill="none">
              {/* Roads grid network */}
              <path d="M 0 60 L 600 60 M 0 130 L 600 130 M 0 200 L 600 200 M 0 260 L 600 260" stroke="#FFFFFF" strokeWidth="0.75" />
              <path d="M 120 0 L 120 300 M 240 0 L 240 300 M 360 0 L 360 300 M 480 0 L 480 300" stroke="#FFFFFF" strokeWidth="0.75" />
              
              {/* Highway arteries */}
              <path d="M 50 0 C 180 120, 250 150, 320 300" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
              <path d="M 500 0 C 450 110, 300 200, 100 300" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
              <path d="M 0 160 Q 300 160, 600 120" stroke="#10b981" strokeWidth="1.75" opacity="0.5" />
            </svg>

            {/* Traffic Density Highlights / Heatmap glows */}
            <div className="absolute top-[35%] left-[25%] w-32 h-32 rounded-full bg-rose-500/10 blur-[25px] pointer-events-none animate-pulse" />
            <div className="absolute top-[60%] left-[55%] w-24 h-24 rounded-full bg-amber-500/10 blur-[20px] pointer-events-none" />

            {/* Render Pins coordinates */}
            {markers.map((marker) => {
              const isSelected = selectedMarker === marker.id;

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker.id)}
                  style={{ left: `${(marker.x / 600) * 100}%`, top: `${(marker.y / 300) * 100}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-20 group"
                >
                  <div className={`p-2 rounded-full border transition-all duration-300 ${
                    isSelected 
                      ? 'scale-125 bg-zinc-950 border-primary shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:scale-110 shadow-lg'
                  }`}>
                    <MapPin className={`w-4 h-4 ${
                      marker.priority === 'Critical' ? 'text-rose-500' : marker.priority === 'High' ? 'text-amber-500' : 'text-primary'
                    }`} />
                  </div>

                  {/* Marker mini pulse tag */}
                  <span className="flex h-2 w-2 absolute -top-1 -right-1">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      marker.priority === 'Critical' ? 'bg-rose-500' : 'bg-primary'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      marker.priority === 'Critical' ? 'bg-rose-500' : 'bg-primary'
                    }`}></span>
                  </span>
                </button>
              );
            })}

            {/* Google-Style Map HUD / Floating controls */}
            <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md text-left text-xs font-bold space-y-1">
              <div className="flex items-center gap-1.5 text-white">
                <MapIcon className="w-3.5 h-3.5 text-primary" /> Metroville Sector 5
              </div>
              <span className="text-[9px] text-zinc-500 block">GPS Active: 1.4s delay</span>
            </div>

            <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md flex gap-2">
              <div className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400 cursor-pointer hover:text-white">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400 cursor-pointer hover:text-white">
                <Radio className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* RIGHT: Detail Drawer & Interactive Legend (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            
            {/* Pop-up Info drawer */}
            <div className="glass-card rounded-[24px] border border-zinc-800 bg-zinc-950/40 p-6 flex-grow flex flex-col justify-between text-left">
              <AnimatePresence mode="wait">
                {selectedMarker ? (
                  (() => {
                    const marker = markers.find((m) => m.id === selectedMarker)!;
                    let badgeColor = 'text-primary bg-primary/10 border-primary/20';
                    if (marker.priority === 'Critical') badgeColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
                    if (marker.priority === 'High') badgeColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';

                    return (
                      <motion.div
                        key={marker.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5"
                      >
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                          <div>
                            <h4 className="text-sm font-bold text-white">{marker.title}</h4>
                            <span className="text-[10px] text-zinc-550 block mt-0.5">{marker.ward}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${badgeColor}`}>
                            {marker.priority}
                          </span>
                        </div>

                        {/* Specs list details */}
                        <div className="space-y-3.5 text-xs text-zinc-400 font-semibold">
                          <div className="flex items-center justify-between">
                            <span>Status</span>
                            <span className="text-white flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {marker.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Community Match</span>
                            <span className="text-accent flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" /> {marker.verification} Match
                            </span>
                          </div>
                        </div>

                        {/* Extra analysis box */}
                        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-900 flex items-start gap-2.5">
                          <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            marker.priority === 'Critical' ? 'text-rose-500' : 'text-primary'
                          }`} />
                          <div className="text-[11px] leading-relaxed text-zinc-400">
                            <strong>AI Routing Note:</strong> Dispatch order generated. SLA monitoring window active. Duplicate signals merged.
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-600 text-center flex-grow">
                    <Sparkles className="w-8 h-8 animate-pulse mb-3" />
                    <span className="text-xs font-bold uppercase tracking-wider">Select a Marker Pin</span>
                    <p className="text-[10px] text-zinc-500 mt-1 max-w-[180px]">
                      Click any marker pin on the map to inspect live dispatch data and cluster details.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Legend categories */}
            <div className="glass-card rounded-[24px] border border-zinc-800 bg-zinc-950/40 p-6 text-left">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-550 block mb-4">Legend / Status</span>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                    <span className="text-zinc-300">Pothole / Road Defects</span>
                  </div>
                  <span className="text-zinc-600 text-[10px] font-mono">Critical priority</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                    <span className="text-zinc-300">Water / Utility Leakages</span>
                  </div>
                  <span className="text-zinc-600 text-[10px] font-mono">High priority</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                    <span className="text-zinc-300">Sanitation / Refuse</span>
                  </div>
                  <span className="text-zinc-600 text-[10px] font-mono">Medium priority</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
