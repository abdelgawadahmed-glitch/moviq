import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowDown, MoveRight } from 'lucide-react';

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
        bgImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80',
        quote: 'Simplicity is the ultimate sophistication.'
      };
    }
    
    switch (activeTab) {
      case 'Men':
        return {
          title: "Men's Sneaker Vault",
          subtitle: 'Rare Silhouettes & Premium Street Elements',
          category: 'Men',
          bgImage: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=1600&q=80',
          quote: 'Style is a way to say who you are without having to speak.'
        };
      case 'Women':
        return {
          title: "Women's Sneaker Suite",
          subtitle: 'Elegance Meets Architectural Comfort',
          category: 'Women',
          bgImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&q=80',
          quote: 'Design is not just what it looks like and feels like. Design is how it works.'
        };
      case 'New Arrivals':
        return {
          title: 'New Releases',
          subtitle: 'Fresh Off the Production & Atelier Lines',
          category: 'New Arrivals',
          bgImage: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1600&q=80',
          quote: "We're always trying to create something that doesn't exist yet."
        };
      case 'Best Sellers':
        return {
          title: 'Grail Status',
          subtitle: 'Our Most Coveted Sneaker Masterpieces',
          category: 'Best Sellers',
          bgImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1600&q=80',
          quote: 'Some people want it to happen, some wish it would happen, others make it happen.'
        };
      case 'Sale':
        return {
          title: 'Exclusive Sneaker Sale',
          subtitle: 'Limited-Time Egyptian Offers up to 25% Off',
          category: 'Sale',
          bgImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1600&q=80',
          quote: 'Value is defined by authenticity and scarcity.'
        };
      case 'Home':
      default:
        return {
          title: 'Luxury Sneakers For Every Style',
          subtitle: "Discover authentic sneakers from the world's leading brands.",
          category: 'Luxury Sneakers Collection',
          bgImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80',
          quote: 'A great sneaker is an architectural piece that lives on the pavement.'
        };
    }
  };

  const { title, subtitle, category, bgImage, quote } = getHeroDetails();

  // Animation variants for staggered inputs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] bg-black overflow-hidden flex flex-col justify-end text-white pb-14 sm:pb-24" id="hero-banner">
      {/* Background Image with Dark Premium Overlay & Parallax effect */}
      <div 
        className="absolute inset-0 z-0 select-none will-change-transform"
        style={{ 
          transform: `translateY(${scrollY * 0.35}px) scale(${1 + scrollY * 0.00045})` 
        }}
      >
        <img
          src={bgImage}
          alt="Luxury Sneakers Hero Background"
          className="w-full h-full object-cover object-center opacity-45 filter brightness-90 transition-opacity duration-700"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Hero Content Area with Parallax displacement */}
      <div 
        className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 will-change-transform"
        style={{
          transform: `translateY(${scrollY * -0.08}px)`
        }}
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeTab + (selectedBrand || '')} // Re-triggers staggered entrance when navigation shifts
          className="max-w-4xl space-y-5 sm:space-y-7"
        >
          {/* Breadcrumbs */}
          <motion.nav 
            variants={itemVariants}
            className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-300/95 select-none" 
            id="breadcrumb"
          >
            <span className="hover:text-white transition-colors cursor-pointer">Home</span>
            <ChevronRight size={10} className="text-neutral-500" />
            <span className="hover:text-white transition-colors cursor-pointer">Shop</span>
            <ChevronRight size={10} className="text-neutral-500" />
            <span className="text-white font-medium">{category}</span>
          </motion.nav>

          {/* Headline & Subtitle */}
          <div className="space-y-3 sm:space-y-4">
            <motion.h1
              variants={itemVariants}
              className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wide leading-[1.1] text-white uppercase max-w-3xl"
              id="hero-title"
            >
              {title}
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm md:text-base tracking-[0.28em] text-neutral-200/90 font-light uppercase leading-relaxed max-w-2xl font-sans"
              id="hero-subtitle"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Quote Accent - only shown when there's space */}
          <motion.div
            variants={itemVariants}
            className="hidden sm:block border-l-[1.5px] border-white/20 pl-5 py-1 max-w-xl"
          >
            <p className="text-xs italic text-neutral-300 font-light tracking-widest font-serif leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </motion.div>

          {/* Dual Action Buttons & Branding Cue */}
          <motion.div 
            variants={itemVariants}
            className="pt-3 sm:pt-5 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            {/* Primary Shop Now Button */}
            <button
              onClick={onScrollToCatalog}
              className="bg-white hover:bg-neutral-100 text-black font-semibold text-[11px] uppercase tracking-[0.25em] px-8 py-4 rounded-none transition-all duration-300 flex items-center gap-2.5 group cursor-pointer shadow-lg hover:shadow-white/10"
              id="hero-shop-btn"
            >
              <span>Shop Now</span>
              <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform duration-300" />
            </button>
            
            {/* Secondary Explore Collection Button */}
            <button
              onClick={onScrollToCatalog}
              className="border border-white/45 hover:border-white bg-transparent hover:bg-white/5 text-white font-semibold text-[11px] uppercase tracking-[0.25em] px-8 py-4 rounded-none transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
              id="hero-explore-btn"
            >
              <span>Explore Collection</span>
              <MoveRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            {/* Micro Branding Cue */}
            <div className="hidden lg:flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold pl-4">
              <span className="w-8 h-[1px] bg-neutral-700" />
              <span>Nike, Jordan &amp; Atelier Designs</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
