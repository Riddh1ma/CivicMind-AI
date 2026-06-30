import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  User, 
  Brain, 
  Check, 
  Wrench, 
  MapPin
} from 'lucide-react';

export default function MunicipalCopilot() {
  const [messages, setMessages] = useState<Array<{ sender: 'officer' | 'ai', type: 'text' | 'card' | 'typing', content?: string }>>([]);
  const [workOrderCreated, setWorkOrderCreated] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Simulate conversation stream on viewport enter
  useEffect(() => {
    if (isInView) {
      // 1. Initial State
      setMessages([]);
      
      // 2. Add Officer Message after 500ms
      const t1 = setTimeout(() => {
        setMessages([{ sender: 'officer', type: 'text', content: 'What should my team repair today?' }]);
        
        // 3. Show AI Typing after 1.5s
        const t2 = setTimeout(() => {
          setIsTyping(true);
          
          // 4. Stream AI Response Card after 3.2s
          const t3 = setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              { sender: 'ai', type: 'card' }
            ]);
          }, 1800);
          
          return () => clearTimeout(t3);
        }, 1000);

        return () => clearTimeout(t2);
      }, 600);

      return () => clearTimeout(t1);
    }
  }, [isInView]);

  return (
    <section ref={containerRef} id="municipal-copilot" className="py-24 relative overflow-hidden bg-zinc-950/40 border-t border-zinc-900">
      {/* Background Glow */}
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-primary mb-3"
          >
            AI Copilot
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Municipal Copilot
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            AI decision support for city authorities.
          </motion.p>
        </div>

        {/* Chat Terminal Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[28px] border border-zinc-800 bg-[#0c0c10] overflow-hidden flex flex-col h-[520px] shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        >
          {/* Terminal Header */}
          <div className="px-6 py-4 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Brain className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="text-xs font-extrabold text-white">CivicMind Officer Terminal</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Secure Link Active</span>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 flex flex-col justify-start">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                if (msg.sender === 'officer') {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20, y: 5 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      className="flex items-start gap-3.5 justify-end"
                    >
                      <div className="max-w-md p-4 rounded-2xl rounded-tr-none bg-zinc-900 border border-zinc-800 text-sm text-zinc-250 text-left">
                        {msg.content}
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                        <User className="w-4.5 h-4.5" />
                      </div>
                    </motion.div>
                  );
                }

                // AI Response card
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20, y: 5 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-3.5 text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] flex-shrink-0">
                      <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center text-primary">
                        <Brain className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex-grow max-w-xl space-y-4">
                      {/* Response card container */}
                      <div className="p-5 rounded-2xl rounded-tl-none bg-zinc-950 border border-zinc-900 text-sm text-zinc-300 space-y-5">
                        
                        <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span>CivicMind AI Recommendation</span>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                          Based on real-time analysis, here is the top priority for repair crews:
                        </p>

                        {/* Priority Card Box */}
                        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-900 relative">
                          <div className="absolute right-4 top-4 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[8px] font-mono uppercase font-bold">
                            Priority 1
                          </div>
                          
                          <span className="text-xs font-mono font-bold text-white block mb-1">Target Infrastructure</span>
                          <span className="text-sm font-bold text-white flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary" /> School Road, Ward 5
                          </span>
                          <span className="text-[10px] text-zinc-500 block mt-1">Pothole / Road Damage</span>
                        </div>

                        {/* Priority reasoning lists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                          <div className="space-y-2.5">
                            <span className="text-[9px] font-extrabold uppercase text-zinc-550 block">Risk Factors</span>
                            <ul className="space-y-1.5 text-zinc-300">
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-rose-500" /> Heavy traffic path
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-rose-500" /> Rain expected within 24h
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-rose-500" /> 4 duplicate reports matched
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-extrabold uppercase text-zinc-550 block">Telemetry Stats</span>
                            <div className="text-[11px] text-zinc-350 space-y-1 font-mono">
                              <div>Est. Impact: <strong className="text-white">3,200/day</strong></div>
                              <div>Recommended: <strong className="text-rose-400">Repair within 24h</strong></div>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons drawer inside chat bubble */}
                        <div className="border-t border-zinc-900 pt-4 flex items-center gap-3">
                          {workOrderCreated ? (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" /> Work Order Created (WO-2983)
                            </motion.div>
                          ) : (
                            <button
                              onClick={() => setWorkOrderCreated(true)}
                              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-102"
                            >
                              <Wrench className="w-3.5 h-3.5" /> Create Work Order
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator bubble */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3.5 text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0 animate-pulse">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-zinc-950 border border-zinc-900 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mock prompt inputs bottom */}
          <div className="p-4 bg-zinc-950/80 border-t border-zinc-900 flex gap-3 items-center">
            <input
              type="text"
              readOnly
              placeholder="Ask another question..."
              className="flex-grow bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-zinc-400 focus:outline-none pointer-events-none"
            />
            <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
