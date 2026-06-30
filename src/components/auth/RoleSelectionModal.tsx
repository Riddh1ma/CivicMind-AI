import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, ArrowRight, Sparkles } from 'lucide-react';

interface RoleSelectionModalProps {
  onSelectRole: (role: 'citizen' | 'authority') => void;
  isSubmitting: boolean;
}

export default function RoleSelectionModal({ onSelectRole, isSubmitting }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'authority' | null>(null);

  const handleSubmit = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  const roles = [
    {
      id: 'citizen',
      title: 'Citizen',
      icon: Users,
      desc: 'Report community issues, track resolutions, verify nearby incidents and earn community reputation.',
      glow: 'group-hover:border-blue-500/40 group-hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]',
      accentColor: 'text-primary bg-primary/10 border-primary/20',
      activeBorder: 'border-primary shadow-[0_0_30px_rgba(37,99,235,0.25)]',
    },
    {
      id: 'authority',
      title: 'Authority',
      icon: Shield,
      desc: 'Manage city infrastructure, monitor reports, dispatch teams and access AI Copilot.',
      glow: 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]',
      accentColor: 'text-secondary bg-secondary/10 border-secondary/20',
      activeBorder: 'border-secondary shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-2xl glass-card rounded-[28px] border border-zinc-800 bg-[#09090B] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden relative"
      >
        {/* Ambient backdrop glow */}
        <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Heading */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-extrabold uppercase text-primary tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Onboarding Setup
          </div>
          <h2 id="onboarding-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to CivicMind AI
          </h2>
          <p className="text-sm text-zinc-500 mt-2 font-medium">
            How will you use CivicMind?
          </p>
        </div>

        {/* Large Roles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => setSelectedRole(role.id as any)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedRole(role.id as any);
                  }
                }}
                className={`group glass-card p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left hover:-translate-y-1 ${
                  isSelected 
                    ? `bg-zinc-950 ${role.activeBorder}` 
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 border transition-all duration-300 group-hover:scale-115 ${
                    isSelected ? role.accentColor : 'text-zinc-500 bg-zinc-900 border-zinc-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-base font-bold text-white mb-2 transition-colors duration-300 group-hover:text-primary">
                    {role.title}
                  </h3>
                  
                  <p className="text-xs leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-600 group-hover:text-primary transition-colors">
                  <span>Select role</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions Button */}
        <div className="mt-8 relative z-10 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || isSubmitting}
            aria-disabled={!selectedRole || isSubmitting}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              selectedRole && !isSubmitting
                ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-102 cursor-pointer'
                : 'bg-zinc-900 text-zinc-600 border border-zinc-850 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Saving Configuration...
              </>
            ) : (
              <>
                Continue to Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Simple RefreshCw placeholder to avoid duplicate import warnings
function RefreshCw(props: any) {
  return (
    <svg 
      className={props.className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
