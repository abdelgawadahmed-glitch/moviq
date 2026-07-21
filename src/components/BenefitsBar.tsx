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
    <div className="bg-white border-b border-neutral-200/80 py-8 select-none" id="luxury-benefits-bar">
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
                className="flex items-start gap-4 p-4 hover:bg-neutral-50 transition-all duration-300 rounded-2xl group border border-transparent hover:border-neutral-200/80"
              >
                {/* Icon Shield */}
                <div className="relative p-3 bg-neutral-50 rounded-2xl border border-neutral-200 shrink-0 group-hover:border-[#C9A227]/60 group-hover:bg-amber-50/50 transition-colors duration-300 shadow-xs">
                  <IconComponent size={20} className="text-neutral-900 group-hover:text-[#C9A227] transition-colors duration-300 relative z-10" />
                </div>
                
                {/* Text Context */}
                <div className="space-y-1.5 text-left">
                  <h4 className="text-[16px] font-semibold uppercase tracking-wide text-neutral-900">
                    {t(b.title)}
                  </h4>
                  <p className="text-[14px] text-neutral-500 font-normal leading-relaxed tracking-wide">
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
