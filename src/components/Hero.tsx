import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useI18n } from '../lib/i18n';

import lvSneakerImg from '../assets/images/lv_sneaker_hero_1784813571004.jpg';
import diorSneakerImg from '../assets/images/dior_sneaker_hero_1784813586057.jpg';
import gucciSneakerImg from '../assets/images/gucci_sneaker_hero_1784813599903.jpg';

interface HeroProps {
  activeTab?: string;
  selectedBrand?: string;
  onScrollToCatalog?: () => void;
  onSelectBrand?: (brand: string) => void;
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  fallbackUrl?: string;
}

interface CardData {
  id: string;
  brandName: string;
  category: string;
  slug: string;
  imageUrl: string;
}

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  cards: CardData[];
}

const SLIDES: SlideData[] = [
  {
    id: 'luxury',
    title: 'LUXURY COLLECTION',
    subtitle: 'Luxury sneakers for timeless style.',
    tag: 'MOVIQ ATELIER • EXCLUSIVE SELECTION',
    cards: [
      {
        id: 'lv',
        brandName: 'Louis Vuitton',
        category: 'LUXURY',
        slug: 'louis-vuitton',
        imageUrl: lvSneakerImg
      },
      {
        id: 'dior',
        brandName: 'Dior',
        category: 'LUXURY',
        slug: 'dior',
        imageUrl: diorSneakerImg
      },
      {
        id: 'gucci',
        brandName: 'Gucci',
        category: 'LUXURY',
        slug: 'gucci',
        imageUrl: gucciSneakerImg
      }
    ]
  },
  {
    id: 'sport',
    title: 'SPORT COLLECTION',
    subtitle: 'Performance footwear for athletes and everyday movement.',
    tag: 'MOVIQ PERFORMANCE • ATHLETIC ATELIER',
    cards: [
      {
        id: 'nike',
        brandName: 'Nike',
        category: 'SPORT',
        slug: 'nike',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'adidas',
        brandName: 'Adidas',
        category: 'SPORT',
        slug: 'adidas',
        imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'new-balance',
        brandName: 'New Balance',
        category: 'SPORT',
        slug: 'new-balance',
        imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=85'
      }
    ]
  }
];

const BRANDS: BrandItem[] = [
  {
    id: 'nike',
    name: 'Nike',
    slug: 'nike',
    logoUrl: 'https://cdn.simpleicons.org/nike/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'
  },
  {
    id: 'adidas',
    name: 'Adidas',
    slug: 'adidas',
    logoUrl: 'https://cdn.simpleicons.org/adidas/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg'
  },
  {
    id: 'new-balance',
    name: 'New Balance',
    slug: 'new-balance',
    logoUrl: 'https://cdn.simpleicons.org/newbalance/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg'
  },
  {
    id: 'asics',
    name: 'ASICS',
    slug: 'asics',
    logoUrl: 'https://cdn.simpleicons.org/asics/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg'
  },
  {
    id: 'puma',
    name: 'Puma',
    slug: 'puma',
    logoUrl: 'https://cdn.simpleicons.org/puma/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.svg'
  },
  {
    id: 'converse',
    name: 'Converse',
    slug: 'converse',
    logoUrl: 'https://cdn.simpleicons.org/converse/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg'
  },
  {
    id: 'vans',
    name: 'Vans',
    slug: 'vans',
    logoUrl: 'https://cdn.simpleicons.org/vans/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Vans-logo.svg'
  },
  {
    id: 'salomon',
    name: 'Salomon',
    slug: 'salomon',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Salomon_logo.svg'
  },
  {
    id: 'under-armour',
    name: 'Under Armour',
    slug: 'under-armour',
    logoUrl: 'https://cdn.simpleicons.org/underarmour/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg'
  },
  {
    id: 'hoka',
    name: 'HOKA',
    slug: 'hoka',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Hoka_One_One_logo.svg'
  },
  {
    id: 'on',
    name: 'On Running',
    slug: 'on',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/On_running_logo.svg'
  },
  {
    id: 'jordan',
    name: 'Jordan',
    slug: 'jordan',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg'
  },
  {
    id: 'crocs',
    name: 'Crocs',
    slug: 'crocs',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Crocs_logo.svg'
  },
  {
    id: 'skechers',
    name: 'Skechers',
    slug: 'skechers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Skechers_logo.svg'
  },
  {
    id: 'timberland',
    name: 'Timberland',
    slug: 'timberland',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Timberland_logo.svg'
  },
  {
    id: 'reebok',
    name: 'Reebok',
    slug: 'reebok',
    logoUrl: 'https://cdn.simpleicons.org/reebok/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Reebok_2019_logo.svg'
  },
  {
    id: 'mizuno',
    name: 'Mizuno',
    slug: 'mizuno',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Mizuno_logo.svg'
  }
];

function BrandLogoDisplay({ brand }: { brand: BrandItem }) {
  const [imgState, setImgState] = useState<'primary' | 'fallback' | 'text'>(
    brand.logoUrl ? 'primary' : 'text'
  );

  if (imgState === 'text' || (imgState === 'primary' && !brand.logoUrl) || (imgState === 'fallback' && !brand.fallbackUrl)) {
    return (
      <span className="font-serif font-extrabold tracking-[0.25em] text-[14px] sm:text-[17px] text-neutral-900 group-hover:text-[#C9A227] transition-colors duration-300 uppercase whitespace-nowrap select-none">
        {brand.name}
      </span>
    );
  }

  const currentSrc = imgState === 'primary' ? brand.logoUrl : brand.fallbackUrl;

  return (
    <img
      src={currentSrc}
      alt={`${brand.name} official logo`}
      className="h-6 sm:h-7 w-auto max-w-[110px] object-contain filter [filter:brightness(0)] group-hover:[filter:invert(68%)_sepia(53%)_saturate(620%)_hue-rotate(6deg)_brightness(92%)_contrast(88%)] transition-all duration-300 pointer-events-none"
      onError={() => {
        if (imgState === 'primary' && brand.fallbackUrl) {
          setImgState('fallback');
        } else {
          setImgState('text');
        }
      }}
      loading="eager"
    />
  );
}

const slideVariants = {
  enter: {
    x: '100%',
    opacity: 0
  },
  center: {
    x: '0%',
    opacity: 1
  },
  exit: {
    x: '-100%',
    opacity: 0
  }
};

export default function Hero({ onScrollToCatalog, onSelectBrand }: HeroProps) {
  const { t } = useI18n();

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-play interval: 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Mobile Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
  };

  const handleShopClick = () => {
    if (onScrollToCatalog) {
      onScrollToCatalog();
    } else {
      const el = document.getElementById('catalog') || document.getElementById('products-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Alternate brands between top and bottom rows
  const topBrandsList = BRANDS.filter((_, idx) => idx % 2 === 0);
  const bottomBrandsList = BRANDS.filter((_, idx) => idx % 2 !== 0);

  // Duplicate each row array 3 times for a seamless infinite loop with zero jump
  const topMarqueeItems = [...topBrandsList, ...topBrandsList, ...topBrandsList];
  const bottomMarqueeItems = [...bottomBrandsList, ...bottomBrandsList, ...bottomBrandsList];

  const handleBrandClick = (brandName: string, slug: string) => {
    if (onSelectBrand) {
      onSelectBrand(brandName);
    } else {
      window.history.pushState({}, '', `/brands/${slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. WORLD-CLASS LUXURY SNEAKER HERO SLIDER */}
      <div 
        className="relative w-full overflow-hidden bg-[#0a0a0a] min-h-[600px] sm:min-h-[680px] lg:min-h-[740px] flex items-center justify-center select-none border-b border-neutral-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        id="hero-slider-banner"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={SLIDES[currentSlide].id}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            onClick={handleShopClick}
            className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group"
          >
            {/* Ambient Background & Gradients */}
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/75 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70 z-10" />

            {/* Slide Content Layout */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-8 sm:pt-10 pb-8 sm:pb-10 flex flex-col items-start gap-6 sm:gap-8">
              
              {/* Top Row: Title & Text Section (ABOVE image cards, aligned left) */}
              <div className="w-full text-left">
                {/* Atelier Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.35em] font-extrabold text-[#C9A227] uppercase mb-3 bg-black/80 backdrop-blur-md px-4 py-1.5 border border-[#C9A227]/40 shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{SLIDES[currentSlide].tag}</span>
                </motion.div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
                  <div>
                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white uppercase font-serif mb-2 leading-[1.05] drop-shadow-lg"
                    >
                      {t(SLIDES[currentSlide].title)}
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="text-neutral-300 text-sm sm:text-base tracking-wide font-light max-w-xl leading-relaxed drop-shadow"
                    >
                      {t(SLIDES[currentSlide].subtitle)}
                    </motion.p>
                  </div>

                  {/* Click Action Indicator Prompt */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="inline-flex items-center gap-3 text-[#C9A227] group-hover:text-white font-black uppercase tracking-[0.25em] text-xs sm:text-sm transition-colors duration-300 pb-1"
                  >
                    <span className="border-b-2 border-[#C9A227] pb-1 group-hover:border-white transition-colors whitespace-nowrap">
                      {SLIDES[currentSlide].id === 'luxury' ? 'EXPLORE LUXURY COLLECTION' : 'EXPLORE SPORT COLLECTION'}
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300 shrink-0" />
                  </motion.div>
                </div>
              </div>

              {/* Bottom Row: 3 Tall Side-by-Side Image Cards */}
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6"
                >
                  {SLIDES[currentSlide].cards.map((card, idx) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrandClick(card.brandName, card.slug);
                      }}
                      className="group/card relative w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[530px] rounded-[22px] overflow-hidden border border-white/10 hover:border-[#C9A227]/60 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)] transition-all duration-500 cursor-pointer bg-neutral-900"
                    >
                      {/* Card Image */}
                      <img
                        src={card.imageUrl}
                        alt={`${card.brandName} ${card.category} Sneaker`}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transform group-hover/card:scale-[1.04] transition-transform duration-700 ease-out"
                      />

                      {/* Ambient Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover/card:opacity-95 transition-opacity duration-500" />

                      {/* Content Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col justify-end text-left z-10 transform translate-y-1 group-hover/card:translate-y-0 transition-transform duration-300">
                        {/* Category Label */}
                        <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-extrabold text-[#C9A227] uppercase mb-1 drop-shadow">
                          {card.category}
                        </span>

                        {/* Editorial Brand Name */}
                        <h3 className="font-serif text-base sm:text-lg lg:text-xl font-extrabold tracking-widest text-white uppercase group-hover/card:text-[#C9A227] transition-colors duration-300 leading-tight drop-shadow-md">
                          {card.brandName}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 z-30 bg-black/60 hover:bg-[#C9A227] text-white hover:text-black border border-white/20 hover:border-[#C9A227] p-2.5 sm:p-3.5 transition-all duration-300 backdrop-blur-md cursor-pointer focus:outline-none"
          id="hero-slider-prev-btn"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 z-30 bg-black/60 hover:bg-[#C9A227] text-white hover:text-black border border-white/20 hover:border-[#C9A227] p-2.5 sm:p-3.5 transition-all duration-300 backdrop-blur-md cursor-pointer focus:outline-none"
          id="hero-slider-next-btn"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 sm:w-10 bg-[#C9A227] shadow-[0_0_10px_rgba(201,162,39,0.8)]'
                  : 'w-3 sm:w-4 bg-white/40 hover:bg-white/80'
              }`}
              id={`hero-slide-dot-${idx}`}
            />
          ))}
        </div>
      </div>

      {/* 2. EXPLORE OFFICIAL BRANDS SHOWCASE */}
      <div
        className="relative w-full bg-white text-neutral-900 border-b border-neutral-200/80 select-none py-12 sm:py-16 overflow-hidden"
        id="hero-banner"
      >
        {/* Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-[12px] tracking-[0.35em] font-extrabold text-[#C9A227] uppercase block mb-2.5">
            {t("MOVIQ ATELIER • CURATED HOUSES")}
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black uppercase">
            {t("Explore Official Brands")}
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm tracking-widest uppercase font-medium mt-2.5 max-w-xl mx-auto">
            {t("Authentic Footwear from the World's Premier Sneaker Ateliers")}
          </p>
        </div>

        {/* Dual-Layer Infinite Marquee Container */}
        <div className="relative w-full space-y-3 sm:space-y-4">
          {/* Left & Right Soft Fade Gradients */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-48 z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-48 z-10 bg-gradient-to-l from-white via-white/80 to-transparent" />

          {/* Top Row: Scrolls Left */}
          <div className="marquee-row-top relative w-full overflow-hidden py-1">
            <div className="marquee-track-left flex items-center">
              {topMarqueeItems.map((brand, idx) => (
                <button
                  key={`top-${brand.id}-${idx}`}
                  onClick={() => handleBrandClick(brand.name, brand.slug)}
                  className="group relative flex flex-col items-center justify-center min-w-[150px] sm:min-w-[190px] px-6 sm:px-8 py-5 cursor-pointer opacity-75 hover:opacity-100 transition-all duration-300 transform hover:scale-[1.08] select-none focus:outline-none"
                  id={`brand-showcase-top-${brand.id}-${idx}`}
                >
                  {/* Official Brand Logo or Premium Text Logo */}
                  <div className="h-9 sm:h-11 flex items-center justify-center mb-2.5">
                    <BrandLogoDisplay brand={brand} />
                  </div>

                  {/* Brand Name */}
                  <span className="text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.18em] text-neutral-900 group-hover:text-black transition-colors duration-300 whitespace-nowrap">
                    {brand.name}
                  </span>

                  {/* Gold Underline */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#C9A227] group-hover:w-12 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Scrolls Right */}
          <div className="marquee-row-bottom relative w-full overflow-hidden py-1">
            <div className="marquee-track-right flex items-center">
              {bottomMarqueeItems.map((brand, idx) => (
                <button
                  key={`bottom-${brand.id}-${idx}`}
                  onClick={() => handleBrandClick(brand.name, brand.slug)}
                  className="group relative flex flex-col items-center justify-center min-w-[150px] sm:min-w-[190px] px-6 sm:px-8 py-5 cursor-pointer opacity-75 hover:opacity-100 transition-all duration-300 transform hover:scale-[1.08] select-none focus:outline-none"
                  id={`brand-showcase-bottom-${brand.id}-${idx}`}
                >
                  {/* Official Brand Logo or Premium Text Logo */}
                  <div className="h-9 sm:h-11 flex items-center justify-center mb-2.5">
                    <BrandLogoDisplay brand={brand} />
                  </div>

                  {/* Brand Name */}
                  <span className="text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.18em] text-neutral-900 group-hover:text-black transition-colors duration-300 whitespace-nowrap">
                    {brand.name}
                  </span>

                  {/* Gold Underline */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#C9A227] group-hover:w-12 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

