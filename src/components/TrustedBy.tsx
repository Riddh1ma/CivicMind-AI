import { motion } from 'framer-motion';
import { Landmark, Building2, TowerControl, School, ShieldAlert } from 'lucide-react';

export default function TrustedBy() {
  const logos = [
    { name: 'City of Metroville', icon: Landmark },
    { name: 'Oakridge County', icon: Building2 },
    { name: 'Silverlake District', icon: TowerControl },
    { name: 'Pinecrest Town', icon: School },
    { name: 'Grandview Plaza', icon: ShieldAlert },
  ];

  return (
    <section className="py-12 border-y border-zinc-900 bg-[#09090B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Leading Text */}
        <div className="text-zinc-500 font-semibold text-xs uppercase tracking-widest text-center md:text-left">
          Trusted by pioneering municipal administrations
        </div>

        {/* Logo Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, idx) => {
            const Icon = logo.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.4, y: 0 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex items-center gap-2 text-white font-bold text-sm select-none cursor-pointer filter grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-primary" />
                <span className="tracking-tight text-zinc-300 font-extrabold">{logo.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
