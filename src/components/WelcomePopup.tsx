import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Copy, Gift, ShieldCheck } from 'lucide-react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if popup was already dismissed/submitted within 30 days
    const dismissedTime = localStorage.getItem('moviq_welcome_popup_dismissed');
    if (dismissedTime) {
      const now = new Date().getTime();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (now - parseInt(dismissedTime, 10) < thirtyDays) {
        return; // Don't show
      }
    }

    // Trigger popup 2 seconds after load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Save dismiss timestamp for 30 days
    localStorage.setItem('moviq_welcome_popup_dismissed', new Date().getTime().toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Save subscriber info locally (Future-ready for Mailchimp / Klaviyo API integration)
    try {
      const existingSubscribers = JSON.parse(localStorage.getItem('moviq_subscribers') || '[]');
      existingSubscribers.push({
        firstName,
        lastName,
        email: email.trim(),
        mobile,
        createdAt: new Date().toISOString(),
        coupon: 'MOVIQ10'
      });
      localStorage.setItem('moviq_subscribers', JSON.stringify(existingSubscribers));
    } catch (err) {
      console.error('Failed to save subscriber info:', err);
    }

    // Mark as submitted & save dismiss state in localStorage
    setIsSubmitted(true);
    localStorage.setItem('moviq_welcome_popup_dismissed', new Date().getTime().toString());
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('MOVIQ10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
          {/* Blurred & Light Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md transition-opacity"
            id="welcome-popup-backdrop"
          />

          {/* Modal Container: Luxury White (#FFFFFF), Thin Light Gray Border (#EAEAEA), Rounded 20px */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white text-neutral-900 rounded-[20px] border border-[#EAEAEA] shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden z-10 my-auto"
            id="welcome-popup-modal"
          >
            {/* Top Gold Accent Line (#C8A45D) */}
            <div className="h-1 w-full bg-[#C8A45D]" />

            {/* Small Elegant Close "×" Button */}
            <button
              onClick={handleClose}
              aria-label="Close popup"
              className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all duration-200 focus:outline-none cursor-pointer"
              id="welcome-popup-close-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 lg:p-10">
              {!isSubmitted ? (
                /* --- FORM VIEW --- */
                <div className="flex flex-col items-center text-center">
                  {/* Luxury Atelier Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-[#C8A45D]/40 text-[#C8A45D] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-4 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>EXCLUSIVE ATELIER ACCESS</span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-black uppercase mb-2">
                    Welcome to MOVIQ
                  </h2>

                  {/* Subheadline */}
                  <p className="text-lg sm:text-xl font-bold text-[#C8A45D] tracking-wide mb-3">
                    Enjoy 10% OFF Your First Order
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-md mb-6">
                    Join the MOVIQ community to receive exclusive offers, early access to new collections, and premium sneaker releases.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Louis"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-[#C8A45D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none transition-all"
                          id="welcome-popup-firstname"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Vuitton"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-[#C8A45D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none transition-all"
                          id="welcome-popup-lastname"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1.5">
                        Email Address <span className="text-[#C8A45D]">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="yourname@luxury.com"
                        required
                        className={`w-full bg-neutral-50 border ${
                          emailError ? 'border-red-500' : 'border-neutral-200 focus:border-[#C8A45D] focus:bg-white'
                        } rounded-xl px-4 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none transition-all`}
                        id="welcome-popup-email"
                      />
                      {emailError && (
                        <p className="text-[11px] text-red-500 font-medium mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1.5">
                        Mobile Number <span className="text-neutral-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-[#C8A45D] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none transition-all"
                        id="welcome-popup-mobile"
                      />
                    </div>

                    {/* Primary Button: White BG, Black 1.5px border, Black text, Hover Black BG / White Text */}
                    <button
                      type="submit"
                      className="w-full mt-3 bg-white text-black border-[1.5px] border-black hover:bg-black hover:text-white font-extrabold uppercase tracking-[0.2em] text-xs py-3.5 px-6 rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
                      id="welcome-popup-submit-btn"
                    >
                      Unlock My 10% Discount
                    </button>

                    {/* Secondary Link */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-neutral-500 hover:text-black text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                        id="welcome-popup-nothanks-btn"
                      >
                        No Thanks
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* --- SUCCESS VIEW --- */
                <div className="flex flex-col items-center text-center py-2">
                  {/* Success Icon */}
                  <div className="w-14 h-14 rounded-full bg-[#C8A45D]/15 border border-[#C8A45D] flex items-center justify-center text-[#C8A45D] mb-5 shadow-sm">
                    <Gift className="w-7 h-7" />
                  </div>

                  {/* Success Title */}
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-black uppercase tracking-wider mb-2">
                    Success!
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 font-light max-w-sm mb-6">
                    Your exclusive 10% discount code is:
                  </p>

                  {/* Coupon Display Box */}
                  <div className="w-full bg-neutral-50 border border-[#C8A45D]/60 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4 shadow-sm">
                    <div className="text-left">
                      <span className="block text-[9px] uppercase tracking-widest font-extrabold text-neutral-500">
                        10% OFF COUPON CODE
                      </span>
                      <span className="text-2xl font-mono font-black text-[#C8A45D] tracking-widest">
                        MOVIQ10
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-2 bg-black hover:bg-[#C8A45D] text-white font-extrabold uppercase text-[11px] tracking-wider px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                      id="welcome-popup-copy-btn"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sent to email notice */}
                  <div className="flex items-center gap-2 text-neutral-500 text-xs mb-7">
                    <ShieldCheck className="w-4 h-4 text-[#C8A45D]" />
                    <span>The code has also been sent to your email.</span>
                  </div>

                  {/* Start Shopping CTA */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full bg-white text-black border-[1.5px] border-black hover:bg-black hover:text-white font-extrabold uppercase tracking-[0.2em] text-xs py-3.5 px-6 rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
                    id="welcome-popup-start-shopping-btn"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

