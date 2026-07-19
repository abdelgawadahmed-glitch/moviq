import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, MoveRight, Sparkles } from 'lucide-react';
// @ts-ignore
import mascotSheet from '../assets/images/moviq_mascot_sheet_15pose_1784494483953.jpg';

interface HeroProps {
  activeTab: string;
  selectedBrand: string;
  onScrollToCatalog: () => void;
}

export default function Hero({ activeTab, selectedBrand, onScrollToCatalog }: HeroProps) {
  // Parallax Scroll State
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine dynamic details based on selected section or brand
  const getHeroDetails = () => {
    if (activeTab === 'Brands' && selectedBrand) {
      return {
        title: selectedBrand,
        subtitle: '100% Certified Authentic Sneaker Legacy',
        category: `Brands / ${selectedBrand}`,
        sneakerImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
        quote: 'Simplicity is the ultimate sophistication.'
      };
    }
    
    switch (activeTab) {
      case 'Men':
        return {
          title: "Men's Sneaker Vault",
          subtitle: 'Rare Silhouettes & Premium Street Elements',
          category: 'Men',
          sneakerImage: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80',
          quote: 'Style is a way to say who you are without having to speak.'
        };
      case 'Women':
        return {
          title: "Women's Sneaker Suite",
          subtitle: 'Elegance Meets Architectural Comfort',
          category: 'Women',
          sneakerImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
          quote: 'Design is not just what it looks like and feels like. Design is how it works.'
        };
      case 'New Arrivals':
        return {
          title: 'New Releases',
          subtitle: 'Fresh Off the Production & Atelier Lines',
          category: 'New Arrivals',
          sneakerImage: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80',
          quote: "We're always trying to create something that doesn't exist yet."
        };
      case 'Best Sellers':
        return {
          title: 'Grail Status',
          subtitle: 'Our Most Coveted Sneaker Masterpieces',
          category: 'Best Sellers',
          sneakerImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
          quote: 'Some people want it to happen, some wish it would happen, others make it happen.'
        };
      case 'Sale':
        return {
          title: 'Exclusive Sneaker Sale',
          subtitle: 'Limited-Time Egyptian Offers up to 25% Off',
          category: 'Sale',
          sneakerImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
          quote: 'Value is defined by authenticity and scarcity.'
        };
      case 'Home':
      default:
        return {
          title: 'Luxury Sneakers For Every Style',
          subtitle: "Discover authentic sneakers from the world's leading brands.",
          category: 'Luxury Sneakers Collection',
          sneakerImage: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', // Centered masterpiece
          quote: 'A great sneaker is an architectural piece that lives on the pavement.'
        };
    }
  };

  const { title, subtitle, category, sneakerImage, quote } = getHeroDetails();

  return (
    <div className="relative w-full h-[85vh] sm:h-[90vh] bg-black overflow-hidden flex items-center justify-between text-white border-b border-neutral-900" id="hero-banner">
      
      {/* 1. SMOKY SPOTLIGHT BACKDROP */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Deep background spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neutral-900/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        
        {/* Moving smoke particles / light beams */}
        <div className="absolute -top-10 left-[20%] w-[400px] h-[400px] bg-neutral-900/10 rounded-full blur-[100px] animate-bounce" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-[10%] right-[25%] w-[500px] h-[500px] bg-neutral-800/15 rounded-full blur-[140px] animate-bounce" style={{ animationDuration: '25s' }} />
        
        {/* Pure solid black linear top/bottom block shadows */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Main 16:9 Responsive Split Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* LEFT COLUMN: HIGH-CONTRAST LUXURY TYPOGRAPHY & CTA BUTTONS */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              key={`meta-${activeTab}`}
              className="space-y-4"
            >
              <span className="text-[10px] tracking-[0.4em] font-extrabold text-neutral-500 uppercase block">
                {category}
              </span>
              
              <h1 className="font-serif text-3.5xl sm:text-5.5xl font-extralight tracking-wide leading-[1.1] text-white uppercase" id="hero-title">
                {title}
              </h1>
              
              <p className="text-xs sm:text-[13px] tracking-[0.25em] text-neutral-400 font-light uppercase leading-relaxed font-sans" id="hero-subtitle">
                {subtitle}
              </p>
            </motion.div>

            {/* Custom Quote Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="border-l border-neutral-800 pl-4 py-1"
            >
              <p className="text-xs italic text-neutral-400 font-serif tracking-wider">
                &ldquo;{quote}&rdquo;
              </p>
            </motion.div>

            {/* CTA BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
            >
              <button
                onClick={onScrollToCatalog}
                className="bg-white hover:bg-neutral-200 text-black font-semibold text-[10.5px] uppercase tracking-[0.25em] px-8 py-4.5 rounded-none transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_15px_45px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95"
                id="hero-shop-btn"
              >
                <span>SHOP NOW</span>
                <ArrowDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onScrollToCatalog}
                className="bg-transparent hover:bg-white/5 border border-neutral-700 hover:border-white text-white font-semibold text-[10.5px] uppercase tracking-[0.25em] px-8 py-4.5 rounded-none transition-all duration-300 flex items-center gap-2 group cursor-pointer hover:scale-[1.02] active:scale-95"
                id="hero-explore-btn"
              >
                <span>EXPLORE COLLECTION</span>
                <MoveRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* CENTER COLUMN: FLOATING ADVERTISEMENT SNEAKER WITH RADIAL GLOW */}
          <div className="lg:col-span-4 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-radial-gradient from-neutral-900/40 via-transparent to-transparent blur-2xl rounded-full scale-150 -z-10" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              key={`sneaker-${activeTab}`}
              className="relative w-full max-w-[360px] h-[360px] flex items-center justify-center select-none"
            >
              {/* Spinning spotlight smoky ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-neutral-800/60 scale-110"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              
              <motion.img
                src={sneakerImage}
                alt="Luxury Masterpiece Sneaker"
                className="max-w-[100%] max-h-[100%] object-contain filter drop-shadow-[0_15px_50px_rgba(255,255,255,0.04)] rotate-[-12deg]"
                animate={{
                  y: [0, -10, 0],
                  rotate: [-12, -10, -12]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                referrerPolicy="no-referrer"
              />
              
              {/* Product Badge tag */}
              <div className="absolute bottom-4 right-4 bg-neutral-950/85 border border-neutral-800 backdrop-blur-md px-3 py-1.5 flex items-center gap-1.5 rounded-full">
                <Sparkles size={10} className="text-amber-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-300">DEADSTOCK</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE 3D EAGLE MASCOT ON PEDESTAL */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center relative min-h-[380px]">
            {/* Ambient gold aura backing */}
            <div className="absolute top-[25%] w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full -z-10" />
            
            {/* Pedestal & Mascot Wrap */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.0 }}
              className="relative flex flex-col items-center justify-center"
            >
              {/* Mascot Floating Character */}
              <motion.div
                className="relative w-44 h-44 flex items-center justify-center mb-2 select-none"
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Gold Wings behind Mascot */}
                <motion.svg
                  className="absolute right-[55%] top-[5%] w-[45%] h-[45%] pointer-events-none -z-10 overflow-visible"
                  viewBox="0 0 100 100"
                  style={{ originX: '85%', originY: '75%' }}
                  animate={{ rotate: [-4, 6, -4] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M 85,75 C 50,45 20,60 10,85 C 35,90 60,82 85,75 Z" fill="url(#heroGoldGrad)" opacity="0.85" />
                </motion.svg>
                
                <motion.svg
                  className="absolute left-[55%] top-[5%] w-[45%] h-[45%] pointer-events-none -z-10 overflow-visible"
                  viewBox="0 0 100 100"
                  style={{ originX: '15%', originY: '75%' }}
                  animate={{ rotate: [4, -6, 4] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M 15,75 C 50,45 80,60 90,85 C 65,90 40,82 15,75 Z" fill="url(#heroGoldGrad)" opacity="0.85" />
                </motion.svg>

                {/* Cropped Sprite Sheet Mascot Pose: Welcome (25% 0%) */}
                <div
                  className="w-[120px] h-[120px] bg-no-repeat bg-cover bg-black border border-neutral-800 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                  style={{
                    backgroundImage: `url(${mascotSheet})`,
                    backgroundSize: '500% 300%',
                    backgroundPosition: '25% 0%', // Welcome pose
                  }}
                />
              </motion.div>

              {/* Obsidian Stone Pedestal */}
              <div className="relative w-40 h-8 flex flex-col items-center justify-center">
                {/* Pedestal shadow/reflection */}
                <div className="absolute -bottom-8 w-32 h-4 bg-black/80 blur-md rounded-full" />
                
                {/* 3D-styled top face */}
                <div className="w-full h-3 bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-t-xl" />
                {/* 3D front face with golden trim */}
                <div className="w-[98%] h-4 bg-neutral-950 border-x border-b border-neutral-800 rounded-b-xl shadow-2xl flex items-center justify-center relative">
                  <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                  <span className="text-[8px] tracking-[0.3em] font-extrabold text-neutral-500 uppercase">MOVIQ PATRON</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Embedded Hero SVG Gold Gradient definition */}
      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F3E5AB" />
            <stop offset="100%" stopColor="#AA7C11" />
          </linearGradient>
        </defs>
      </svg>
      
    </div>
  );
}
