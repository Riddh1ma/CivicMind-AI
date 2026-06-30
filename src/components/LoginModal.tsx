import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Brain, Shield, CheckCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login success
    alert(`Successfully logged in as: ${email}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative w-full max-w-4xl h-[600px] rounded-3xl overflow-hidden glass-card border border-zinc-800 bg-[#09090B] flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Section: Branding & Graphics (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-zinc-950 via-primary/10 to-secondary/10 p-10 flex-col justify-between relative overflow-hidden border-r border-zinc-900">
          {/* Animated decorative glow */}
          <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-secondary/10 rounded-full blur-[60px] pointer-events-none" />
          
          {/* Top Brand */}
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary p-[1px]">
              <div className="w-full h-full rounded-lg bg-[#09090B] flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              CivicMind <span className="text-primary font-black">AI</span>
            </span>
          </div>

          {/* Graphic Middle Content */}
          <div className="my-auto relative z-10 flex flex-col items-center text-center">
            {/* Holographic Shield Art */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 border border-zinc-800 flex items-center justify-center mb-8 shadow-inner">
              <div className="absolute inset-2 rounded-full border border-primary/25 animate-pulse-slow" />
              <Shield className="w-16 h-16 text-primary filter drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Civic Intelligence</h3>
            <p className="text-xs text-zinc-500 max-w-[280px] leading-relaxed">
              Building smarter, safer, and more responsive cities together.
            </p>
          </div>

          {/* Core Values Footer */}
          <div className="flex items-center justify-center gap-6 text-[10px] uppercase font-bold text-zinc-500 relative z-10 tracking-widest border-t border-zinc-900 pt-6">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent" /> Secure</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent" /> Reliable</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent" /> Intelligent</span>
          </div>
        </div>

        {/* Right Section: Form Container */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#0d0d11]">
          <div className="max-w-sm w-full mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                Welcome Back <span className="wave-hand text-xl">👋</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Login to access your city console.</p>
            </div>

            {/* Social Authentication */}
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-sm font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Separator */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900" />
              </div>
              <span className="relative z-10 px-3 bg-[#0d0d11] text-[10px] uppercase font-bold text-zinc-650 tracking-wider">or</span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.gov"
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-zinc-500" /> Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl pl-4 pr-10 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password Link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-zinc-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-zinc-950 border-zinc-800 text-primary focus:ring-primary/20"
                  />
                  Remember me
                </label>
                <a href="#" className="text-primary hover:underline font-semibold">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all transform hover:-translate-y-0.5"
              >
                Login
              </button>
            </form>

            {/* Bottom Actions */}
            <p className="text-center text-xs text-zinc-500 mt-6">
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:underline font-semibold">Sign up</a>
            </p>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
