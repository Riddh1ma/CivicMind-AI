import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Navbar({ onScrollToSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('hero');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, role, login, logout } = useAuth();

  const navItems = [
    { name: 'Features', id: 'features' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'AI Agents', id: 'ai-showcase' },
    { name: 'Dashboard', id: 'dashboard-preview' },
    { name: 'About', id: 'statistics' },
    { name: 'Contact', id: 'footer' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer scroll spy to auto-update active underline
  useEffect(() => {
    const sections = ['hero', 'features', 'how-it-works', 'ai-showcase', 'dashboard-preview', 'statistics', 'footer'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveItem(id);
          }
        },
        { threshold: 0.3, rootMargin: '-10% 0px -70% 0px' }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onScrollToSection(id);
    setActiveItem(id);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-[#09090B]/80 backdrop-blur-xl border-b border-zinc-800/40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveItem('hero');
          }}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px]">
            <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
              <Brain className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-primary to-secondary opacity-0 group-hover:opacity-75 blur-md transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
            CivicMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-black">AI</span>
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                activeItem === item.id ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.name}
              {activeItem === item.id && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* CTA Actions / Profile Avatar */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <div className="relative flex items-center gap-4">
              {/* Notification Bell (Mock) */}
              <button className="p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-zinc-350 relative transition-all cursor-pointer">
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <Bell className="w-4.5 h-4.5" />
              </button>

              {/* Avatar button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-primary/50 transition-all flex items-center justify-center cursor-pointer shadow-md"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-zinc-400" />
                )}
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Click backdrop to close */}
                    <div className="fixed inset-0 z-20" onClick={() => setIsDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-56 glass-card rounded-2xl border border-zinc-800 bg-[#0c0c10] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-30 text-left space-y-3"
                    >
                      <div className="border-b border-zinc-900 pb-2.5">
                        <span className="text-xs font-bold text-white block truncate">{user.displayName || 'CivicMind User'}</span>
                        <span className="text-[10px] text-zinc-500 block truncate mt-0.5">{user.email}</span>
                        {role && (
                          <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider block mt-1.5">
                            Role: {role}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            // Scroll will capture context routing triggers
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all text-left"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all text-left flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button 
                onClick={login}
                className="text-sm font-semibold text-zinc-350 hover:text-white transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={login}
                className="relative px-5 py-2.5 rounded-xl font-bold text-sm overflow-hidden group bg-primary text-white shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_30px_rgba(37,99,235,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-nav border-t border-zinc-800 border-opacity-50 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4 bg-[#09090B] bg-opacity-95">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2 transition-colors font-medium ${
                    activeItem === item.id ? 'text-primary font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="h-[1px] bg-zinc-800 my-2" />
              <div className="flex flex-col gap-3 pb-2">
                {user ? (
                  <button 
                    onClick={logout}
                    className="py-2.5 rounded-xl border border-zinc-800 text-rose-500 hover:bg-rose-500/10 text-center font-bold transition-all"
                  >
                    Logout ({user.displayName || user.email})
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); login(); }}
                      className="py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white text-center font-medium transition-colors"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); login(); }}
                      className="py-2.5 rounded-xl bg-primary text-white text-center font-semibold transition-colors shadow-lg shadow-primary/20"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
