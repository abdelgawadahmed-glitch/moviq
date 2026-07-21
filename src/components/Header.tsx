import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, Heart, ShoppingBag, Menu, X, Check, Award, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { LUXURY_BRANDS } from '../data/products';
import { Product } from '../types';
import AccountDashboardModal from './AccountDashboardModal';
import { useI18n } from '../lib/i18n';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedBrand: (brand: string) => void;
  products?: Product[];
  onQuickView?: (product: Product) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  searchQuery,
  setSearchQuery,
  setSelectedBrand,
  products = [],
  onQuickView
}: HeaderProps) {
  const { lang, setLang, t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  
  // Account Loyalty Sim States
  const [joinedLoyalty, setJoinedLoyalty] = useState(false);
  const [email, setEmail] = useState('');

  // Luxury Announcement Static Bar
  const announcements = [
    "FREE SHIPPING ACROSS EGYPT | 100% AUTHENTIC | 30 DAYS RETURNS"
  ];
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  useEffect(() => {
    // Single static announcement
  }, []);

  const navItems = [
    { label: t('Home'), value: 'Home' },
    { label: t('Men'), value: 'Men' },
    { label: t('Women'), value: 'Women' },
    { label: t('Brands'), value: 'Brands' },
    { label: t('New Arrivals'), value: 'New Arrivals' },
    { label: t('Best Sellers'), value: 'Best Sellers' },
    { label: t('Sale'), value: 'Sale' }
  ];

  const handleNavClick = (val: string) => {
    setActiveTab(val);
    setIsMobileMenuOpen(false);
    if (val !== 'Brands') {
      setIsBrandsDropdownOpen(false);
    }
    // Scroll to contact form if Contact is clicked
    if (val === 'Contact') {
      setTimeout(() => {
        document.getElementById('moviq-footer')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setActiveTab('Brands');
    setIsBrandsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLoyaltySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoinedLoyalty(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-neutral-200/80 transition-all duration-300 shadow-sm text-neutral-900" id="moviq-header">
      {/* Top Announcement Bar */}
      <div className="w-full bg-neutral-900 text-white py-2 px-4 relative overflow-hidden border-b border-neutral-800" id="announcement-bar">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-[10px] sm:text-[11px] font-medium text-neutral-200 tracking-[0.25em] uppercase select-none text-center">
          {t("Luxury Announcement Bar")}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
            id="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          {/* Logo */}
          <button
            onClick={() => {
              setActiveTab('Home');
              setSelectedBrand('');
            }}
            className="text-2xl sm:text-3xl font-serif font-black tracking-[0.2em] text-black select-none cursor-pointer hover:opacity-80 transition-opacity"
            id="logo-brand"
          >
            MOVIQ
          </button>
        </div>

        {/* Center: Improved Navigation Options with Luxury Layout */}
        <nav 
          className="hidden md:flex items-center gap-1 lg:gap-2.5 xl:gap-4 text-[15px] uppercase tracking-[0.08em] font-medium text-neutral-600" 
          id="desktop-nav"
        >
          {navItems.map((item) => {
            if (item.value === 'Brands') {
              return (
                <div 
                  key={item.value} 
                  className="relative"
                  onMouseEnter={() => setIsBrandsDropdownOpen(true)}
                  onMouseLeave={() => setIsBrandsDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setIsBrandsDropdownOpen(!isBrandsDropdownOpen);
                    }}
                    className={`px-3 py-2.5 flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer ${
                      activeTab === 'Brands' ? 'text-black font-bold' : ''
                    }`}
                    id={`nav-item-${item.value.toLowerCase()}`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isBrandsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Brands Mega Dropdown (3 Columns of pure luxury) */}
                  <AnimatePresence>
                    {isBrandsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.99 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] bg-white border border-neutral-200/90 shadow-luxury-lg p-6 rounded-[20px] z-50"
                      >
                        <div className="pb-3 border-b border-neutral-100 text-[10px] text-neutral-400 font-bold tracking-[0.15em] uppercase">
                          {t("Our Curated Fashion Houses")}
                        </div>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-2.5 pt-4">
                          {LUXURY_BRANDS.map((brand) => (
                            <button
                              key={brand}
                              onClick={() => handleBrandSelect(brand)}
                              className="text-left py-1 text-[11px] text-neutral-600 hover:text-black hover:translate-x-1.5 transition-all font-medium uppercase tracking-[0.12em]"
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive = activeTab === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`px-3 py-2.5 relative hover:text-black transition-colors cursor-pointer ${
                  isActive ? 'text-black font-bold' : ''
                }`}
                id={`nav-item-${item.value.toLowerCase()}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-black rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Icons: Added Search, Wishlist, Account, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-neutral-800" id="right-actions">
          {/* Premium Language Switcher (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mr-1 sm:mr-3 border-r border-neutral-200 pr-2 sm:pr-4" id="lang-switcher-desktop">
            <button
              onClick={() => setLang('en')}
              className={`hover:text-black transition-all cursor-pointer ${
                lang === 'en' ? 'text-black font-extrabold scale-105' : 'text-neutral-400 hover:scale-105'
              }`}
              id="lang-btn-en"
            >
              🇺🇸 English
            </button>
            <span className="text-neutral-300 font-normal">|</span>
            <button
              onClick={() => setLang('ar')}
              className={`hover:text-black transition-all cursor-pointer font-serif ${
                lang === 'ar' ? 'text-black font-extrabold scale-105' : 'text-neutral-400 hover:scale-105'
              }`}
              id="lang-btn-ar"
            >
              🇪🇬 العربية
            </button>
          </div>

          {/* Search Toggle Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 hover:text-black transition-all relative cursor-pointer hover:scale-105 active:scale-95 ${
              isSearchOpen ? 'text-black font-bold' : ''
            }`}
            aria-label="Toggle search bar"
            id="search-toggle"
          >
            <Search size={19} />
          </button>

          {/* Account Button */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="p-2 hover:text-black transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Account details"
            id="account-btn"
          >
            <User size={19} />
          </button>

          {/* Wishlist Button with Counter */}
          <button
            onClick={onWishlistClick}
            className="p-2 hover:text-black transition-all relative cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Open wishlist"
            id="wishlist-btn"
          >
            <Heart size={19} />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-black text-white rounded-full flex items-center justify-center text-[9px] font-extrabold shadow-sm"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Cart Button with Counter */}
          <button
            onClick={onCartClick}
            className="p-2 hover:text-black transition-all relative cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Open cart"
            id="cart-btn"
          >
            <ShoppingBag size={19} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-black text-white rounded-full flex items-center justify-center text-[9px] font-extrabold shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Dynamic Slide-down Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 overflow-hidden shadow-xl"
            id="search-panel"
          >
            <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-4">
              <Search className="text-neutral-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search 100% authentic sneakers from Nike, Jordan, Adidas, New Balance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search authentic sneakers"
                className="w-full bg-neutral-50 border-b border-neutral-200 focus:border-black py-2.5 px-3 text-sm outline-none text-neutral-900 tracking-wide placeholder:text-neutral-400 rounded-t-lg transition-colors"
                autoFocus
                id="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-semibold transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                }}
                className="p-1.5 hover:bg-neutral-100 text-neutral-700 transition-colors rounded-full cursor-pointer"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Search Suggestions and Matches Dropdown */}
            <div className="max-w-4xl mx-auto px-4 pb-6 pt-2 border-t border-neutral-100">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Suggestions Section - 4 columns */}
                <div className="md:col-span-4 space-y-3">
                  <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.15em]">
                    Suggestions
                  </h4>
                  <div className="flex flex-wrap md:flex-col gap-2">
                    {['Jordan Retro', 'Nike Dunk', 'Balenciaga', 'New Balance Grey', 'Dior Trainer'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="text-left text-xs text-neutral-600 hover:text-black hover:translate-x-1 transition-all py-1.5 px-3 md:px-0 bg-neutral-100 md:bg-transparent rounded-full md:rounded-none cursor-pointer"
                      >
                        🔎 {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Match Results Section - 8 columns */}
                <div className="md:col-span-8 space-y-3">
                  <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.15em]">
                    {searchQuery ? 'Live Matches' : 'Featured Grails'}
                  </h4>
                  <div className="space-y-2">
                    {((products || []).filter((p) => {
                      const query = searchQuery.toLowerCase().trim();
                      if (!query) return true; // Show first few when empty
                      return (
                        p.name.toLowerCase().includes(query) ||
                        p.brand.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query)
                      );
                    }).slice(0, 5)).length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">No matching luxury sneakers found.</p>
                    ) : (
                      ((products || []).filter((p) => {
                        const query = searchQuery.toLowerCase().trim();
                        if (!query) return true;
                        return (
                          p.name.toLowerCase().includes(query) ||
                          p.brand.toLowerCase().includes(query) ||
                          p.category.toLowerCase().includes(query) ||
                          p.description.toLowerCase().includes(query)
                        );
                      }).slice(0, 5)).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 transition-colors rounded-xl border border-neutral-200/80 group/item cursor-pointer shadow-sm"
                          onClick={() => {
                            if (onQuickView) {
                               onQuickView(p);
                               setIsSearchOpen(false);
                            } else {
                              setSearchQuery(p.name);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg border border-neutral-200 overflow-hidden flex items-center justify-center p-1 shadow-xs">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="max-w-full max-h-full object-contain group-hover/item:scale-110 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] tracking-wider text-neutral-500 font-bold uppercase block">
                                {p.brand}
                              </span>
                              <span className="text-xs text-neutral-900 font-medium line-clamp-1">
                                {p.name}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-xs font-bold font-serif text-neutral-900 block">
                                {p.salePrice.toLocaleString()} EGP
                              </span>
                              {p.discount > 0 && (
                                <span className="text-[9.5px] line-through text-neutral-400">
                                  {p.originalPrice.toLocaleString()} EGP
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 group-hover/item:text-black font-bold flex items-center gap-0.5 pl-1">
                              <span>View</span>
                              <ArrowRight size={10} className="group-hover/item:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            {searchQuery && (
              <div className="max-w-4xl mx-auto px-4 pb-4 border-t border-neutral-100 pt-3">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.15em]">
                  Filtering catalog by: &ldquo;{searchQuery}&rdquo;
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-50 flex flex-col p-6 shadow-2xl md:hidden"
              id="mobile-nav-drawer"
            >
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <span className="text-xl font-serif font-black tracking-[0.18em]">MOVIQ</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-black hover:bg-neutral-100"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Language Switcher */}
              <div className="py-4 border-b border-neutral-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-500" id="lang-switcher-mobile">
                <span>{lang === 'ar' ? 'اللغة' : 'Language'}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setLang('en');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 transition-all rounded-md text-[11px] ${
                      lang === 'en' ? 'bg-black text-white font-bold' : 'hover:bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => {
                      setLang('ar');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 transition-all rounded-md text-[11px] font-serif ${
                      lang === 'ar' ? 'bg-black text-white font-bold' : 'hover:bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    🇪🇬 العربية
                  </button>
                </div>
              </div>

              {/* Mobile links */}
              <div className="flex flex-col gap-5 pt-6 uppercase tracking-wider text-[13px] font-medium text-neutral-700">
                {navItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleNavClick(item.value)}
                    className={`text-left py-1 hover:text-black transition-colors ${
                      activeTab === item.value ? 'text-black font-bold pl-2 border-l-2 border-black' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-neutral-100">
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 pb-3 font-semibold">
                  Luxury Brands
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
                  {LUXURY_BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className="text-left py-1 hover:text-black transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upgraded Account Dashboard Modal */}
      <AnimatePresence>
        {isAccountOpen && (
          <AccountDashboardModal
            isOpen={isAccountOpen}
            onClose={() => setIsAccountOpen(false)}
            products={products}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
