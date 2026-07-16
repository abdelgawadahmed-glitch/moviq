import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, Heart, ShoppingBag, Menu, X, Check, Award, ChevronDown } from 'lucide-react';
import { LUXURY_BRANDS } from '../data/products';

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
  setSelectedBrand
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  
  // Account Loyalty Sim States
  const [joinedLoyalty, setJoinedLoyalty] = useState(false);
  const [email, setEmail] = useState('');

  const navItems = [
    { label: 'Home', value: 'Home' },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'New Arrivals', value: 'New Arrivals' },
    { label: 'Best Sellers', value: 'Best Sellers' },
    { label: 'Brands', value: 'Brands' },
    { label: 'Sale', value: 'Sale' },
    { label: 'Contact', value: 'Contact' }
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
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100" id="moviq-header">
      {/* Black Top Announcement Bar */}
      <div className="w-full bg-black py-2.5 px-4 text-center text-[11px] tracking-[0.2em] font-medium text-white uppercase select-none" id="announcement-bar">
        Free Shipping Across Egypt | 100% Authentic Sneakers
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-black hover:text-neutral-600 transition-colors"
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
            className="text-2xl sm:text-3xl font-serif font-black tracking-[0.18em] text-black select-none cursor-pointer hover:opacity-90 transition-opacity"
            id="logo-brand"
          >
            MOVIQ
          </button>
        </div>

        {/* Center: Navigation Options */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-5 text-[12.5px] uppercase tracking-[0.15em] font-medium text-neutral-600" id="desktop-nav">
          {navItems.map((item) => {
            if (item.value === 'Brands') {
              return (
                <div key={item.value} className="relative group">
                  <button
                    onClick={() => {
                      setIsBrandsDropdownOpen(!isBrandsDropdownOpen);
                    }}
                    className={`px-3 py-2 flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer ${
                      activeTab === 'Brands' ? 'text-black font-semibold' : ''
                    }`}
                    id={`nav-item-${item.value.toLowerCase()}`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isBrandsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Brands Dropdown */}
                  <AnimatePresence>
                    {(isBrandsDropdownOpen || activeTab === 'Brands') && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white border border-neutral-100 shadow-2xl py-3 px-1 rounded-none z-50 grid grid-cols-1 divide-y divide-neutral-50">
                        <div className="pb-1.5 px-3 text-[10px] text-neutral-400 font-bold tracking-[0.12em] uppercase">
                          Our Fashion Houses
                        </div>
                        {LUXURY_BRANDS.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => handleBrandSelect(brand)}
                            className="w-full text-left px-3 py-2 text-[11px] text-neutral-700 hover:text-black hover:bg-neutral-50 transition-all font-medium uppercase tracking-[0.12em]"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
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
                className={`px-3 py-2 relative hover:text-black transition-colors cursor-pointer ${
                  isActive ? 'text-black font-semibold' : ''
                }`}
                id={`nav-item-${item.value.toLowerCase()}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-black"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2 sm:gap-4 text-black" id="right-actions">
          {/* Search Toggle Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 hover:text-neutral-500 transition-colors relative cursor-pointer ${
              isSearchOpen ? 'text-neutral-500' : ''
            }`}
            aria-label="Toggle search bar"
            id="search-toggle"
          >
            <Search size={20} />
          </button>

          {/* Account Button */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="p-2 hover:text-neutral-500 transition-colors cursor-pointer"
            aria-label="Account details"
            id="account-btn"
          >
            <User size={20} />
          </button>

          {/* Wishlist Button with Counter */}
          <button
            onClick={onWishlistClick}
            className="p-2 hover:text-neutral-500 transition-colors relative cursor-pointer"
            aria-label="Open wishlist"
            id="wishlist-btn"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-black text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button with Counter */}
          <button
            onClick={onCartClick}
            className="p-2 hover:text-neutral-500 transition-colors relative cursor-pointer"
            aria-label="Open cart"
            id="cart-btn"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-black text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                {cartCount}
              </span>
            )}
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
            className="bg-neutral-50 border-b border-neutral-200 overflow-hidden"
            id="search-panel"
          >
            <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-4">
              <Search className="text-neutral-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search 100% authentic sneakers from Nike, Jordan, Adidas, New Balance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 focus:border-black py-2 text-sm outline-none text-black tracking-wide"
                autoFocus
                id="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                }}
                className="p-1.5 hover:bg-neutral-200 transition-colors rounded-full"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
            {searchQuery && (
              <div className="max-w-4xl mx-auto px-4 pb-4">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.1em]">
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

      {/* Account / Loyalty Modal */}
      <AnimatePresence>
        {isAccountOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 cursor-pointer"
              onClick={() => setIsAccountOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-md w-full bg-white text-black p-8 shadow-2xl border border-neutral-100 z-10"
              id="account-loyalty-modal"
            >
              <button
                onClick={() => setIsAccountOpen(false)}
                className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="text-center pb-6 border-b border-neutral-100">
                <span className="inline-flex p-3 bg-neutral-50 rounded-full text-black mb-3">
                  <Award size={28} />
                </span>
                <h3 className="font-serif text-2xl font-semibold tracking-wide">MOVIQ Club Privé</h3>
                <p className="text-xs text-neutral-500 mt-1.5 tracking-wider uppercase">
                  Luxury Loyalty & Couture Access
                </p>
              </div>

              {!joinedLoyalty ? (
                <div className="pt-6">
                  <p className="text-xs text-neutral-600 leading-relaxed text-center mb-6">
                    Join MOVIQ Club Privé to experience complimentary private shipping, exclusive seasonal previews of Chanel & Dior ateliers, and dynamic invitation-only sales.
                  </p>
                  
                  <form onSubmit={handleLoyaltySubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2">
                        Your Couture Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="couture@example.com"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:bg-white text-sm py-3 px-4 outline-none transition-all rounded-none font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-black hover:bg-neutral-800 text-white font-medium text-xs py-3.5 px-6 uppercase tracking-widest rounded-none transition-colors"
                    >
                      Request Membership
                    </button>
                  </form>
                </div>
              ) : (
                <div className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-full mb-4">
                    <Check size={22} />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-black">Welcome to Club Privé</h4>
                  <p className="text-xs text-neutral-500 mt-2">
                    Membership active for <strong>{email}</strong>
                  </p>
                  
                  <div className="bg-neutral-50 p-4 mt-6 border border-neutral-100 text-left space-y-3">
                    <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
                      <span>Tier Level</span>
                      <span className="font-bold text-black">Platine Ambassador</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
                      <span>Privé Reward Code</span>
                      <span className="font-mono font-bold text-accent-red">MOVIQ10OFF</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-neutral-600">
                      <span>Private Shipping</span>
                      <span className="font-semibold text-black">Active (Complimentary)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAccountOpen(false)}
                    className="w-full bg-black hover:bg-neutral-800 text-white font-medium text-xs py-3.5 px-6 uppercase tracking-widest rounded-none mt-6 transition-colors"
                  >
                    Enter Private Lounge
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
