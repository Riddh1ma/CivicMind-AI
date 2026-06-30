import { useState } from 'react';
import { Brain, Github, Twitter, Linkedin, Youtube, Send, Heart } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Footer({ onScrollToSection }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    {
      title: 'Company',
      items: [
        { label: 'About', id: 'statistics' },
        { label: 'Careers', id: 'features' },
        { label: 'Contact', id: 'footer' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { label: 'Documentation', id: 'features' },
        { label: 'API Reference', id: 'dashboard-preview' },
        { label: 'Blog', id: 'features' },
        { label: 'Case Studies', id: 'statistics' },
      ],
    },
    {
      title: 'Developers',
      items: [
        { label: 'GitHub', id: 'footer' },
        { label: 'API Status', id: 'dashboard-preview' },
        { label: 'Roadmap', id: 'how-it-works' },
        { label: 'Changelog', id: 'how-it-works' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy', id: 'footer' },
        { label: 'Terms', id: 'footer' },
        { label: 'Cookies', id: 'footer' },
      ],
    },
  ];

  return (
    <footer id="footer" className="relative border-t border-zinc-900 bg-[#09090B] pt-24 pb-12 overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Brand Info & Newsletter (Lg: col-span-5) */}
          <div className="md:col-span-5 flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px]">
                <div className="w-full h-full rounded-xl bg-[#09090B] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                CivicMind <span className="text-primary font-black">AI</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-zinc-500 max-w-sm">
              Autonomous civic intelligence for the cities of tomorrow. Triage, route, and dispatch municipal services using explainable AI and live analytics.
            </p>

            {/* Newsletter Subscription */}
            <div className="max-w-sm mt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550 block mb-3">Stay Updated</span>
              <form onSubmit={handleSubscribe} className="relative flex items-center bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden p-1.5 focus-within:border-primary/45 transition-colors">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-transparent px-3 py-1.5 text-xs text-zinc-355 placeholder-zinc-700 focus:outline-none"
                />
                
                {subscribed ? (
                  <span className="px-3 text-[10px] font-bold text-emerald-500">Subscribed!</span>
                ) : (
                  <button type="submit" className="p-2 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Structured Mega Links (Lg: col-span-7) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left">
            {footerLinks.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-550">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <button
                        onClick={() => onScrollToSection(item.id)}
                        className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] bg-zinc-900/60 my-8" />

        {/* Bottom copyright & socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-zinc-650 tracking-wider">
            © {new Date().getFullYear()} CIVICMIND AI INC. ALL RIGHTS RESERVED.
          </p>

          {/* Socials Icons */}
          <div className="flex items-center gap-3.5">
            {[
              { icon: Linkedin, link: '#' },
              { icon: Github, link: '#' },
              { icon: Twitter, link: '#' },
              { icon: Youtube, link: '#' },
            ].map((soc, i) => (
              <a 
                key={i} 
                href={soc.link} 
                className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-550 hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <soc.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <p className="text-[10px] font-semibold text-zinc-600 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for smarter communities.
          </p>
        </div>

      </div>
    </footer>
  );
}
