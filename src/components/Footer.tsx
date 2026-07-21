import React, { useState } from 'react';
import { Mail, ArrowRight, Instagram, Twitter, Facebook, Check, Globe, HelpCircle } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-50 text-neutral-900 pt-16 pb-12 border-t border-neutral-200" id="moviq-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper footer bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-neutral-200">
          
          {/* Brand Col (lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-4" id="footer-about-col">
            <span className="text-2xl font-serif font-black tracking-[0.25em] text-black">
              MOVIQ
            </span>
            <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm">
              MOVIQ represents the convergence of premium sneaker culture and architectural minimalism. Specializing in 100% authentic luxury footwear from the world's leading brands, designed for those who appreciate high-end design, flawless details, and ultimate comfort.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="p-2.5 bg-white hover:bg-black hover:text-white border border-neutral-200 text-neutral-700 rounded-full transition-colors shadow-xs" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="#twitter" className="p-2.5 bg-white hover:bg-black hover:text-white border border-neutral-200 text-neutral-700 rounded-full transition-colors shadow-xs" aria-label="Twitter">
                <Twitter size={14} />
              </a>
              <a href="#facebook" className="p-2.5 bg-white hover:bg-black hover:text-white border border-neutral-200 text-neutral-700 rounded-full transition-colors shadow-xs" aria-label="Facebook">
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* About Us Col (lg: 2 cols) */}
          <div className="lg:col-span-2 space-y-4" id="footer-aboutus-links">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900">
              About Us
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 font-light">
              <li><a href="#flagships" className="hover:text-black transition-colors">Our Flagships</a></li>
              <li><a href="#authenticity-check" className="hover:text-black transition-colors">Authenticity Guarantee</a></li>
              <li><a href="#sustainability" className="hover:text-black transition-colors">Sustainability</a></li>
              <li><a href="#careers" className="hover:text-black transition-colors">Sneaker Careers</a></li>
            </ul>
          </div>

          {/* Customer Service (lg: 2 cols) */}
          <div className="lg:col-span-2 space-y-4" id="footer-customerservice-links">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 font-light">
              <li><a href="#support" className="hover:text-black transition-colors flex items-center gap-1"><span>Help &amp; FAQs</span> <HelpCircle size={11} className="text-neutral-400" /></a></li>
              <li><a href="#shipping" className="hover:text-black transition-colors">Shipping &amp; Returns</a></li>
              <li><a href="#order-tracking" className="hover:text-black transition-colors">Track Order</a></li>
              <li><a href="#size-guide" className="hover:text-black transition-colors">Sizing Advisors</a></li>
            </ul>
          </div>

          {/* Legal / Policy (lg: 2 cols) */}
          <div className="lg:col-span-2 space-y-4" id="footer-legal-links">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900">
              Company Policy
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 font-light">
              <li><a href="#privacy" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-black transition-colors">Terms of Use</a></li>
              <li><a href="#cookies" className="hover:text-black transition-colors">Cookie Preferences</a></li>
              <li><a href="#authenticity" className="hover:text-black transition-colors">Authenticity Guarantee</a></li>
            </ul>
          </div>

          {/* Newsletter / Subscription (lg: 2 cols) */}
          <div className="lg:col-span-2 space-y-4" id="footer-newsletter-col">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900">
              Newsletter
            </h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              Subscribe to unlock private sales and catalog releases.
            </p>

            {subscribed ? (
              <div className="bg-white border border-neutral-200 p-3 space-y-1.5 rounded-xl shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <Check size={12} />
                  <span>Subscribed</span>
                </div>
                <p className="text-[9px] text-neutral-500 leading-normal">
                  Copy code <strong className="text-black font-mono">MOVIQSNEAKER</strong> for 15% off.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    aria-label="Email address for newsletter"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="w-full bg-white border border-neutral-200 focus:border-black text-xs py-2.5 px-3 rounded-xl outline-none text-neutral-900 tracking-wider pr-9 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors p-1"
                    aria-label="Submit newsletter"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Lower footer copyright details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-medium tracking-wider uppercase gap-4" id="footer-copyright-row">
          <div>
            &copy; {new Date().getFullYear()} MOVIQ Luxury Sneakers. All Rights Reserved.
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1">
              <Globe size={11} />
              <span>Egypt / English</span>
            </span>
            <span className="text-neutral-300">|</span>
            <span>Cairo, Egypt</span>
            {onAdminClick && (
              <>
                <span className="text-neutral-300">|</span>
                <button
                  type="button"
                  onClick={onAdminClick}
                  className="hover:text-black text-neutral-500 transition-colors cursor-pointer text-[10px] font-black tracking-widest uppercase bg-transparent border-none p-0 outline-none"
                  id="footer-admin-link"
                >
                  Admin Portal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
