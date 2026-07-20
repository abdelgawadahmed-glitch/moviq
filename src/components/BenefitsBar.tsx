import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, RefreshCw, MessageSquare } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export default function BenefitsBar() {
  const { t } = useI18n();
  const benefits = [
    {
      icon: ShieldCheck,
      title: "100% Authentic Guarantee",
      desc: "Every pair physically verified by experts. Tagged for absolute security."
    },
    {
      icon: Truck,
      title: "Free Shipping in Egypt",
      desc: "Complimentary premium courier to Cairo, Alexandria, and all governorates."
    },
    {
      icon: RefreshCw,
      title: "15-Day Luxury Returns",
      desc: "Hassle-free size exchanges and returns on unworn deadstock inventory."
    },
    {
      icon: MessageSquare,
      title: "Atelier Concierge",
      desc: "Instant styling help and sizing consults via our responsive virtual guide."
    }
  ];

  return (
    <div className="bg-neutral-950 border-b border-neutral-900 py-8 select-none" id="luxury-benefits-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
          {benefits.map((b, i) => {
            const IconComponent = b.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="flex items-start gap-4 p-4 hover:bg-neutral-900/30 transition-colors duration-300 rounded-2xl group border border-transparent hover:border-neutral-900"
              >
                {/* Glowing Icon Shield */}
                <div className="relative p-3 bg-neutral-900 rounded-xl border border-neutral-800 shrink-0 group-hover:border-amber-500/40 transition-colors duration-300">
                  <div className="absolute inset-0 bg-amber-500/5 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <IconComponent size={20} className="text-white group-hover:text-amber-400 transition-colors duration-300 relative z-10" />
                </div>
                
                {/* Text Context */}
                <div className="space-y-1.5 text-left">
                  <h4 className="font-serif text-[13px] font-semibold uppercase tracking-wider text-white">
                    {t(b.title)}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light leading-relaxed tracking-wide">
                    {t(b.desc)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
