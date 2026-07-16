import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowDown } from 'lucide-react';

interface HeroProps {
  activeTab: string;
  selectedBrand: string;
  onScrollToCatalog: () => void;
}

export default function Hero({ activeTab, selectedBrand, onScrollToCatalog }: HeroProps) {
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
          title: 'Luxury Sneakers Collection',
          subtitle: '100% Authentic • Nike, Jordan, Balenciaga & More',
          category: 'Luxury Sneakers Collection',
          bgImage: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1600&q=80',
          quote: 'A great sneaker is an architectural piece that lives on the pavement.'
        };
    }
  };

  const { title, subtitle, category, bgImage, quote } = getHeroDetails();

  return (
    <div className="relative w-full h-[65vh] sm:h-[75vh] bg-black overflow-hidden flex flex-col justify-end text-white pb-12 sm:pb-20" id="hero-banner">
      {/* Background Image with Dark Premium Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Luxury Sneakers Hero Background"
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-95 animate-[pulse_8s_infinite_alternate]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-300 select-none" id="breadcrumb">
            <span className="hover:text-white transition-colors cursor-pointer">Home</span>
            <ChevronRight size={10} className="text-neutral-500" />
            <span className="hover:text-white transition-colors cursor-pointer">Shop</span>
            <ChevronRight size={10} className="text-neutral-500" />
            <span className="text-white font-medium">{category}</span>
          </nav>

          {/* Large Title */}
          <div className="space-y-2">
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-5xl md:text-6.5xl font-extralight tracking-wide leading-tight text-white uppercase"
              id="hero-title"
            >
              {title}
            </motion.h1>
            
            <motion.p
              key={subtitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm tracking-[0.25em] text-neutral-300 font-light uppercase"
              id="hero-subtitle"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Quote Accent */}
          <motion.div
            key={quote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="hidden sm:block border-l-2 border-white/30 pl-4 py-1 max-w-lg"
          >
            <p className="text-xs italic text-neutral-300 font-light tracking-wider font-serif">
              &ldquo;{quote}&rdquo;
            </p>
          </motion.div>

          {/* Action Button & Explore Cue */}
          <div className="pt-4 flex items-center gap-6">
            <button
              onClick={onScrollToCatalog}
              className="bg-white hover:bg-neutral-200 text-black font-semibold text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-none transition-all duration-300 flex items-center gap-2 group cursor-pointer"
              id="hero-shop-btn"
            >
              <span>Shop Now</span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
              <span className="w-8 h-[1px] bg-neutral-600" />
              <span>Nike, GOAT &amp; Dior Inspired Luxury Form</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
