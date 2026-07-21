import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldCheck, Heart, Eye, ShoppingBag, Send, ArrowRight, Sparkles, Truck, Lock, Gift, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useI18n } from '../lib/i18n';

interface HomepageViewProps {
  products: Product[];
  wishlist: string[];
  onWishlistToggle: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onSelectBrand: (brand: string) => void;
  onNavigateTab: (tab: string) => void;
}

export default function HomepageView({
  products,
  wishlist,
  onWishlistToggle,
  onQuickView,
  onAddToCart,
  onSelectBrand,
  onNavigateTab
}: HomepageViewProps) {
  const { t } = useI18n();
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  // Curated premium brands with photos & quotes
  const BRANDS_SHOWCASE = [
    {
      name: 'Nike',
      tagline: 'The Pinnacle of Innovation',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    },
    {
      name: 'Jordan',
      tagline: 'High-Top Royalty',
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80',
    },
    {
      name: 'Adidas',
      tagline: 'Classics Perfected',
      image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
    },
    {
      name: 'New Balance',
      tagline: 'The Grey Standard',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    },
    {
      name: 'Balenciaga',
      tagline: 'Architectural Rebellion',
      image: 'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=600&q=80',
    },
    {
      name: 'Dior',
      tagline: 'High Couture Footwear',
      image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80',
    }
  ];

  // Filtering products for different sections (showing 5 items for 5-card row layouts)
  const newArrivals = products.filter(p => p.isNew).slice(0, 5);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 5);
  const luxuryCollection = products.filter(p => p.isLuxury).slice(0, 5);

  // Trending this week: items with rating >= 4.8
  const trendingThisWeek = products
    .filter(p => p.rating >= 4.8)
    .sort((a, b) => b.reviewsCount - a.reviewsCount)
    .slice(0, 3);

  // Curated Egyptian Luxury Reviews
  const REVIEWS = [
    {
      id: 'r1',
      name: 'Kareem El-Shafei',
      location: 'Zamalek, Cairo',
      quote: "MOVIQ has completely elevated the luxury shopping experience in Egypt. The Dior B22s I ordered were checked meticulously. Hand-delivered in absolute pristine condition with their verification tag.",
      rating: 5,
      product: 'Dior B22 Trainer',
      date: 'July 12, 2026'
    },
    {
      id: 'r2',
      name: 'Yasmine Mansour',
      location: 'New Cairo',
      quote: "Absolute gold standard. Finding authentic high-end Jordans is a nightmare in Egypt, but MOVIQ's multi-step authentication process gives absolute peace of mind. Exceptional customer care.",
      rating: 5,
      product: "Air Jordan 4 Retro Black",
      date: 'June 28, 2026'
    },
    {
      id: 'r3',
      name: 'Sherif Abdel-Nour',
      location: 'Gleem, Alexandria',
      quote: "From the premium wrapping paper to the hand-delivered delivery box, the attention to detail is remarkable. Definitely my trusted atelier for sneakers.",
      rating: 5,
      product: 'New Balance 990v6',
      date: 'May 19, 2026'
    }
  ];

  return (
    <div className="space-y-32 pb-24" id="homepage-custom-view">
      
      {/* Brand Section: Minimal Black Background with Horizontal Logos */}
      <section className="bg-black py-10 border-b border-neutral-900" id="horizontal-brand-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6 text-neutral-500 font-sans tracking-[0.25em] text-xs sm:text-sm font-black select-none">
            {['Nike', 'Jordan', 'Adidas', 'New Balance', 'Puma', 'Asics', 'Converse', 'Vans'].map((brand) => (
              <button
                key={brand}
                onClick={() => onSelectBrand(brand)}
                className="hover:text-white transition-colors uppercase font-bold text-center flex-1 min-w-[90px] cursor-pointer"
              >
                {t(brand)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Featured Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20" id="featured-brands-section">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[12px] tracking-[0.3em] font-bold text-neutral-500 uppercase">
            {t("Curated Fashion Houses")}
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight text-white uppercase">
            {t("Featured Brands")}
          </h2>
          <div className="w-12 h-[1px] bg-white/20 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BRANDS_SHOWCASE.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectBrand(brand.name)}
              className="group relative h-[320px] sm:h-[380px] bg-neutral-900 rounded-[20px] overflow-hidden cursor-pointer border border-neutral-800 shadow-luxury hover:shadow-luxury-lg transition-luxury"
              id={`brand-card-${brand.name.toLowerCase()}`}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover object-center opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-[1.2s] ease-out"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end text-white">
                <span className="text-[11px] tracking-[0.25em] text-neutral-400 font-bold uppercase mb-2">
                  {t("Explore Atelier")}
                </span>
                <h3 className="text-[20px] font-semibold tracking-wide uppercase mb-1">
                  {t(brand.name)}
                </h3>
                <p className="text-[14px] text-neutral-300 font-normal tracking-wide italic mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  {t(brand.tagline)}
                </p>
                <div className="flex items-center gap-2 text-white text-[14px] font-semibold tracking-[0.15em] uppercase border-b border-white/20 pb-1 w-fit group-hover:border-white transition-colors">
                  <span>{t("Browse House")}</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20" id="new-arrivals-section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[12px] tracking-[0.3em] font-bold text-neutral-500 uppercase block">
              {t("The Latest Releases")}
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight text-white uppercase">
              {t("New Arrivals")}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('New Arrivals')}
            className="text-white hover:text-neutral-300 font-semibold text-[16px] uppercase tracking-[0.15em] flex items-center gap-2 border-b border-white/10 pb-1 hover:border-white transition-all cursor-pointer"
          >
            <span>{t("View Full Collection")}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
          {newArrivals.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: idx * 0.1 }}
            >
              <ProductCard
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onWishlistToggle={onWishlistToggle}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20" id="best-sellers-section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[12px] tracking-[0.3em] font-bold text-neutral-500 uppercase block">
              {t("The Most Coveted Grails")}
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight text-white uppercase">
              {t("Best Sellers")}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('Best Sellers')}
            className="text-white hover:text-neutral-300 font-semibold text-[16px] uppercase tracking-[0.15em] flex items-center gap-2 border-b border-white/10 pb-1 hover:border-white transition-all duration-300 cursor-pointer"
          >
            <span>{t("View All Bestsellers")}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
          {bestSellers.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: idx * 0.1 }}
            >
              <ProductCard
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onWishlistToggle={onWishlistToggle}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Trending This Week Section (Premium Bento / Staggered Layout) */}
      <section className="bg-neutral-900 py-20 lg:py-28 text-white overflow-hidden relative" id="trending-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_45%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <span className="text-[12px] tracking-[0.3em] font-bold text-neutral-400 uppercase block">
              {t("Global Street Couture")}
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight text-white uppercase">
              {t("Trending This Week")}
            </h2>
            <div className="w-12 h-[1px] bg-white/20 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Featured Trending Item - Left 5 Columns */}
            {trendingThisWeek[0] && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 bg-black/60 border border-neutral-800/80 p-8 sm:p-10 flex flex-col justify-between space-y-8 relative group overflow-hidden rounded-[20px] shadow-luxury"
              >
                <div className="absolute top-0 right-0 bg-white/10 px-4 py-1 text-[8.5px] uppercase font-semibold tracking-widest text-neutral-300 rounded-bl-[12px]">
                  {t("Must Have")}
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.25em] text-neutral-400 font-bold uppercase block">
                    {t(trendingThisWeek[0].brand)}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-white uppercase">
                    {t(trendingThisWeek[0].name)}
                  </h3>
                  <p className="text-[14px] text-neutral-400 font-normal leading-relaxed line-clamp-3">
                    {t(trendingThisWeek[0].description)}
                  </p>
                </div>

                <div className="relative h-64 sm:h-72 w-full flex items-center justify-center p-4">
                  <img
                    src={trendingThisWeek[0].image}
                    alt={trendingThisWeek[0].name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                  <span className="text-lg font-bold text-neutral-200">
                    {trendingThisWeek[0].salePrice.toLocaleString()} {t("EGP")}
                  </span>
                  <button
                    onClick={() => onQuickView(trendingThisWeek[0])}
                    className="bg-white hover:bg-neutral-200 text-black text-[14px] uppercase font-semibold tracking-widest px-6 py-3 transition-colors duration-300 rounded-full cursor-pointer"
                  >
                    {t("Acquire Now")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Other Trending Items - Right 7 Columns */}
            <div className="lg:col-span-7 flex flex-col gap-8 justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
                {trendingThisWeek.slice(1, 3).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.15 }}
                    className="bg-black/40 border border-neutral-800/60 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative group rounded-[20px] shadow-luxury"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] tracking-[0.25em] text-neutral-400 font-bold uppercase block">
                        {t(item.brand)}
                      </span>
                      <h4 className="text-lg font-semibold tracking-tight text-white uppercase line-clamp-1">
                        {t(item.name)}
                      </h4>
                    </div>

                    <div className="relative h-44 w-full flex items-center justify-center p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80">
                      <span className="text-sm font-bold text-neutral-300">
                        {item.salePrice.toLocaleString()} {t("EGP")}
                      </span>
                      <button
                        onClick={() => onQuickView(item)}
                        className="text-white hover:text-neutral-400 text-[12px] uppercase font-semibold tracking-widest flex items-center gap-1.5 transition-colors duration-300 cursor-pointer"
                      >
                        <span>{t("Details")}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Informational luxury slogan card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-neutral-800/20 border border-neutral-800/35 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 rounded-[20px]"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] tracking-[0.25em] text-neutral-400 font-bold uppercase block">
                    {t("Exclusive Egyptian Allocation")}
                  </span>
                  <p className="text-xs text-neutral-300 font-normal max-w-lg leading-relaxed">
                    {t("syndicate_pitch")}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('Luxury Collection')}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-[12px] uppercase font-semibold tracking-widest px-6 py-3 border border-neutral-700/60 transition-colors duration-300 cursor-pointer w-full sm:w-auto rounded-full"
                >
                  {t("View Collection")}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Luxury Collection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20" id="luxury-collection-section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[12px] tracking-[0.3em] font-bold text-neutral-500 uppercase block">
              {t("Atelier Couture Selection")}
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight text-white uppercase">
              {t("Luxury Collection")}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('Luxury Collection')}
            className="text-white hover:text-neutral-300 font-semibold text-[16px] uppercase tracking-[0.15em] flex items-center gap-2 border-b border-white/10 pb-1 hover:border-white transition-all duration-300 cursor-pointer"
          >
            <span>{t("Explore High-End Pairs")}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
          {luxuryCollection.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: idx * 0.1 }}
            >
              <ProductCard
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onWishlistToggle={onWishlistToggle}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Why Choose MOVIQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-b border-neutral-900 py-20 lg:py-24" id="why-choose-section">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[12px] tracking-[0.3em] font-bold text-neutral-500 uppercase block">
            {t("Our Core Pillars")}
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight text-white uppercase">
            {t("Why Choose MOVIQ")}
          </h2>
          <div className="w-12 h-[1px] bg-white/20 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {/* Pillar 1 */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="p-4 bg-neutral-900 rounded-full border border-neutral-800 text-white">
              <ShieldCheck size={28} className="stroke-[1.25]" />
            </div>
            <h3 className="text-[20px] tracking-wide font-semibold uppercase text-white">
              {t("100% Certified Verification")}
            </h3>
            <p className="text-[16px] text-neutral-400 font-normal leading-relaxed max-w-xs">
              {t("Every single pair undergoes a rigorous multi-point physical verification audit by our expert authenticators prior to dispatch.")}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="p-4 bg-neutral-900 rounded-full border border-neutral-800 text-white">
              <Truck size={28} className="stroke-[1.25]" />
            </div>
            <h3 className="text-[20px] tracking-wide font-semibold uppercase text-white">
              {t("White-Glove Egyptian Delivery")}
            </h3>
            <p className="text-[16px] text-neutral-400 font-normal leading-relaxed max-w-xs">
              {t("Hand-delivered directly to your doorstep in Cairo, Giza, Alexandria, and all major Egyptian Governorates with premium security.")}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="p-4 bg-neutral-900 rounded-full border border-neutral-800 text-white">
              <Lock size={28} className="stroke-[1.25]" />
            </div>
            <h3 className="text-[20px] tracking-wide font-semibold uppercase text-white">
              {t("Encrypted Luxury Checkout")}
            </h3>
            <p className="text-[16px] text-neutral-400 font-normal leading-relaxed max-w-xs">
              {t("State-of-the-art secure payment structures. Safe cash on delivery options or direct card handling for stress-free shopping.")}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="p-4 bg-neutral-900 rounded-full border border-neutral-800 text-white">
              <Gift size={28} className="stroke-[1.25]" />
            </div>
            <h3 className="text-[20px] tracking-wide font-semibold uppercase text-white">
              {t("Bespoke Custom Packaging")}
            </h3>
            <p className="text-[16px] text-neutral-400 font-normal leading-relaxed max-w-xs">
              {t("Your sneakers are packaged inside customized archival box protectors, wrapped meticulously in soft luxury monogram tissue paper.")}
            </p>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24" id="customer-reviews-section">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[12px] tracking-[0.3em] font-bold text-neutral-500 uppercase block">
            {t("Client Testimonials")}
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight text-white uppercase">
            {t("Customer Reviews")}
          </h2>
          <div className="w-12 h-[1px] bg-white/20 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-neutral-900/40 border border-neutral-800 p-8 sm:p-10 flex flex-col justify-between space-y-8 relative rounded-[20px] shadow-luxury"
              id={`review-card-${idx}`}
            >
              {/* Gold Stars */}
              <div className="flex items-center text-amber-500 gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                ))}
              </div>

              {/* Review Quote text */}
              <p className="text-[16px] text-neutral-300 font-normal leading-relaxed italic">
                &ldquo;{t(review.id === 'r1' ? 'review_1_quote' : review.id === 'r2' ? 'review_2_quote' : 'review_3_quote')}&rdquo;
              </p>

              {/* Reviewer Meta Details */}
              <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                <div>
                  <span className="text-[14px] uppercase tracking-[0.12em] text-white font-semibold block">
                    {t(review.name)}
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-normal">
                    {t(review.location)}
                  </span>
                </div>
                
                <div className="text-right">
                  <span className="bg-neutral-800 text-neutral-300 text-[10px] uppercase tracking-[0.18em] font-bold px-2.5 py-1 block w-fit ml-auto rounded-sm">
                    {t("VERIFIED BUYER")}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-semibold uppercase mt-1 block">
                    {t(review.product)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28" id="newsletter-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black text-white py-16 px-6 sm:px-12 md:px-20 text-center relative overflow-hidden border border-neutral-800 rounded-[20px] shadow-luxury-lg"
        >
          {/* Luxury Abstract Ambient Vector Backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_50%)]" />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/[0.01] rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-[12px] tracking-[0.35em] text-neutral-400 font-bold uppercase block">
              {t("Join The MOVIQ Syndicate")}
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight uppercase leading-tight">
              {t("Newsletter")}
            </h2>
            <p className="text-[16px] text-neutral-300 font-normal tracking-wide uppercase leading-relaxed max-w-lg mx-auto">
              {t("Subscribe to unlock privileged allocations, private drop notifications, and luxury sneaker insights.")}
            </p>

            <AnimatePresence mode="wait">
              {!newsletterSubscribed ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleNewsletterSubmit}
                  className="pt-6 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    required
                    aria-label="Email address for newsletter subscription"
                    placeholder={t("ENTER YOUR EMAIL FOR COUTURE ACCESS")}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-grow bg-neutral-900 border border-neutral-800 focus:border-white text-white text-[14px] tracking-widest uppercase placeholder:text-neutral-500 px-6 py-4 focus:outline-none transition-colors duration-300 rounded-full"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-black text-[15px] font-semibold tracking-[0.15em] uppercase px-8 py-4 transition-all duration-300 flex items-center justify-center gap-2 rounded-full cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>{t("Subscribe")}</span>
                    <Send size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-8 text-neutral-200 space-y-2 text-center"
                >
                  <div className="inline-flex p-3 bg-neutral-900 rounded-full border border-neutral-800 text-white mb-2 animate-bounce">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-serif text-lg tracking-wider font-light uppercase text-white">
                    {t("Privileged Access Granted")}
                  </h3>
                  <p className="text-[10px] text-neutral-400 tracking-[0.18em] uppercase font-light">
                    {t("A confirmation transmission has been sent. Welcome to the Syndicate.")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
