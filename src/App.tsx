import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight, ShieldCheck, HelpCircle, Eye, RefreshCw, Star } from 'lucide-react';

import Header from './components/Header';
import Hero from './components/Hero';
import BenefitsBar from './components/BenefitsBar';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import HomepageView from './components/HomepageView';
import AdminDashboard from './components/AdminDashboard';
import MoviqAssistant from './components/MoviqAssistant';
import BrandPage from './components/BrandPage';

import { PRODUCTS } from './data/products';
import { Product, CartItem, FilterState, Review } from './types';
import { useI18n } from './lib/i18n';

function SkeletonCard() {
  return (
    <div className="bg-neutral-900/50 rounded-3xl overflow-hidden border border-neutral-800/80 p-6 flex flex-col h-full space-y-4 shadow-2xl relative">
      {/* Image skeleton */}
      <div className="relative aspect-[4/5] bg-neutral-950 rounded-2xl overflow-hidden flex items-center justify-center p-5">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-800/45 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      </div>
      
      {/* Brand & Name skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-1/4 bg-neutral-800/80 rounded-md relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-800/45 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
        <div className="h-4.5 w-3/4 bg-neutral-800/80 rounded-md relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-800/45 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Stars rating skeleton */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-2.5 h-2.5 bg-neutral-800/60 rounded-full" />
        ))}
      </div>

      {/* Available sizes skeleton */}
      <div className="space-y-2 pt-3 border-t border-neutral-800/60">
        <div className="h-2 w-1/4 bg-neutral-800/85 rounded-md" />
        <div className="flex gap-1.5">
          <div className="h-5 w-8 bg-neutral-800/60 rounded-md" />
          <div className="h-5 w-8 bg-neutral-800/60 rounded-md" />
          <div className="h-5 w-8 bg-neutral-800/60 rounded-md" />
        </div>
      </div>

      {/* Price skeleton */}
      <div className="pt-4 border-t border-neutral-800/60 flex justify-between items-center mt-auto">
        <div className="h-4 w-20 bg-neutral-800/85 rounded-md" />
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useI18n();
  // --- STATE PERSISTENCE ---
  const [products, setProducts] = useState<Product[]>(() => {
    // Attempt to load products from session state to keep posted reviews persistent across clicks
    const saved = localStorage.getItem('moviq_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('moviq_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('moviq_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('moviq_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('moviq_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('moviq_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // --- CORE UI STATE ---
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [filters, setFilters] = useState<FilterState>({
    brand: '',
    category: 'All Collections',
    size: '',
    color: '',
    priceRange: [0, 50000],
    searchQuery: '',
    sortBy: 'featured',
    gender: 'all',
    availability: 'all'
  });

  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  // --- CLIENT ROUTING ENGINE ---
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'Home') return;
    setIsCatalogLoading(true);
    const timer = setTimeout(() => {
      setIsCatalogLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [
    activeTab,
    filters.brand,
    filters.category,
    filters.size,
    filters.color,
    filters.priceRange,
    filters.searchQuery,
    filters.sortBy,
    filters.gender,
    filters.availability
  ]);

  // Drawer toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  // Handle direct Admin URL checking and routing
  useEffect(() => {
    const checkAdminUrl = () => {
      const isHashAdmin = window.location.hash === '#admin';
      const params = new URLSearchParams(window.location.search);
      const isSearchAdmin = params.get('admin') === 'true' || params.get('view') === 'admin';
      
      if (isHashAdmin || isSearchAdmin) {
        setIsAdminView(true);
      }
    };

    window.addEventListener('hashchange', checkAdminUrl);
    checkAdminUrl();

    return () => {
      window.removeEventListener('hashchange', checkAdminUrl);
    };
  }, []);

  // Update hash dynamically based on admin view status
  useEffect(() => {
    if (isAdminView) {
      if (window.location.hash !== '#admin') {
        window.location.hash = 'admin';
      }
    } else {
      if (window.location.hash === '#admin') {
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
  }, [isAdminView]);

  // Discount code applied from Cart to Checkout
  const [activeDiscountRate, setActiveDiscountRate] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('NONE');

  // Interactive micro-toasts/notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'cart' | 'wishlist' | 'success'>('success');

  const catalogRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string, type: 'cart' | 'wishlist' | 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- FILTERING & GENDER DETECTOR LOGIC ---
  // Precise catalog segmenting to match header links (Dior & Chanel feel)
  const isProductForMen = (p: Product) => {
    // Distribute products stably so there's rich inventory in both tabs
    const charCodeSum = p.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return charCodeSum % 2 === 0 || charCodeSum % 3 === 0;
  };

  const isProductForWomen = (p: Product) => {
    // Rich overlapping set representing unisex premium footwear styles
    const charCodeSum = p.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return charCodeSum % 2 !== 0 || charCodeSum % 5 === 0;
  };

  const getFilteredProducts = () => {
    return products.filter((p) => {
      // 1. Navigation Tab Filtering
      if (activeTab === 'Men' && !isProductForMen(p)) return false;
      if (activeTab === 'Women' && !isProductForWomen(p)) return false;
      if (activeTab === 'New Arrivals' && !p.isNew) return false;
      if (activeTab === 'Best Sellers' && !p.isBestSeller) return false;
      if (activeTab === 'Luxury Collection' && !p.isLuxury) return false;

      // 2. Sidebar Filters
      if (filters.brand && p.brand !== filters.brand) return false;
      if (filters.category !== 'All Collections' && p.category !== filters.category) return false;
      if (filters.size && !p.sizes.includes(filters.size)) return false;
      if (filters.color && !p.colors.some((c) => c.name === filters.color)) return false;
      if (p.salePrice < filters.priceRange[0] || p.salePrice > filters.priceRange[1]) return false;

      // Gender filter
      if (filters.gender && filters.gender !== 'all') {
        if (filters.gender === 'men' && !isProductForMen(p)) return false;
        if (filters.gender === 'women' && !isProductForWomen(p)) return false;
      }

      // Availability filter
      if (filters.availability && filters.availability === 'in-stock') {
        // A product is out of stock if its id sum of chars is divisible by 9
        const charCodeSum = p.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const inStock = charCodeSum % 9 !== 0;
        if (!inStock) return false;
      }

      // 3. Search Bar Input
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchCategory && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      // 4. Sorting logic
      switch (filters.sortBy) {
        case 'bestselling':
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        case 'low-high':
          return a.salePrice - b.salePrice;
        case 'high-low':
          return b.salePrice - a.salePrice;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'featured':
        default:
          return b.rating - a.rating; // Sort by luxury ratings
      }
    });
  };

  const filteredProducts = getFilteredProducts();

  // --- ACTIONS ---

  const handleWishlistToggle = (productId: string) => {
    setWishlist((prev) => {
      const isAlreadySaved = prev.includes(productId);
      const prod = products.find((p) => p.id === productId);
      const name = prod ? prod.name : 'Garment';

      if (isAlreadySaved) {
        triggerToast(`Removed ${name} from your favorites`, 'wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        triggerToast(`Added ${name} to your favorites`, 'wishlist');
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    setCartItems((prev) => {
      // Check if exact variant (same size & same color) already exists in cart
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        triggerToast(`Increased ${product.name} quantity to ${updated[existingIdx].quantity}`, 'cart');
        return updated;
      } else {
        triggerToast(`Added ${product.name} (${size}) to your shopping bag`, 'cart');
        return [...prev, { product, selectedSize: size, selectedColor: color, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    const item = cartItems[index];
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
    triggerToast(`Removed ${item.product.name} from your bag`, 'cart');
  };

  const handleProceedToCheckout = (discountRate: number, promoCode: string) => {
    setActiveDiscountRate(discountRate);
    setAppliedPromoCode(promoCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]); // Flush shopping cart on order placement
    setActiveDiscountRate(0);
    setAppliedPromoCode('NONE');
    triggerToast('Secure transaction authorized successfully! Check email receipt.', 'success');
  };

  const handleAddProductReview = (productId: string, newReview: Review) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = parseFloat((totalRatingSum / updatedReviews.length).toFixed(1));

          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvgRating
          };
        }
        return p;
      })
    );

    // If modal is currently open, we must sync the modal view target as well!
    setSelectedQuickProduct((prev) => {
      if (prev && prev.id === productId) {
        const updatedReviews = [newReview, ...prev.reviews];
        const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvgRating = parseFloat((totalRatingSum / updatedReviews.length).toFixed(1));

        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newAvgRating
        };
      }
      return prev;
    });
  };

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync brand navigation action from header
  const handleSelectedBrandFromHeader = (brand: string) => {
    if (brand) {
      const slug = brand.toLowerCase().replace(/\s+/g, '-');
      navigateTo(`/brands/${slug}`);
    } else {
      navigateTo('/');
    }
  };

  // Sync general nav tab changes
  const handleTabChange = (tab: string) => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    setActiveTab(tab);
    // Reset secondary sub-filters on main tab changes to show full category collections
    setFilters((prev) => ({
      ...prev,
      category: 'All Collections',
      brand: tab === 'Brands' ? prev.brand : ''
    }));
    
    if (tab !== 'Home') {
      setTimeout(handleScrollToCatalog, 150);
    }
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (isAdminView) {
    return (
      <AdminDashboard
        onClose={() => setIsAdminView(false)}
        products={products}
        setProducts={setProducts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-white selection:text-black relative animate-none" id="moviq-app-root">
      
      {/* 1. Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        setSelectedBrand={handleSelectedBrandFromHeader}
        products={products}
        onQuickView={(pTarget) => setSelectedQuickProduct(pTarget)}
      />

      {/* 2. Hero Section */}
      {!currentPath.startsWith('/brands/') && (
        <Hero
          activeTab={activeTab}
          selectedBrand={filters.brand}
          onScrollToCatalog={handleScrollToCatalog}
        />
      )}

      {/* Luxury Brand Benefits Bar */}
      <BenefitsBar />

      {/* 3. Homepage Custom Premium Sections OR Catalog Showcase OR Brand Page */}
      {currentPath.startsWith('/brands/') ? (
        <BrandPage
          brandId={currentPath.split('/brands/')[1] || ''}
          products={products}
          wishlist={wishlist}
          onWishlistToggle={handleWishlistToggle}
          onQuickView={(pTarget) => setSelectedQuickProduct(pTarget)}
          onAddToCart={handleAddToCart}
          onNavigateTo={navigateTo}
        />
      ) : activeTab === 'Home' ? (
        <HomepageView
          products={products}
          wishlist={wishlist}
          onWishlistToggle={handleWishlistToggle}
          onQuickView={(pTarget) => setSelectedQuickProduct(pTarget)}
          onAddToCart={handleAddToCart}
          onSelectBrand={handleSelectedBrandFromHeader}
          onNavigateTab={handleTabChange}
        />
      ) : (
        <div className="scroll-mt-20 pt-16 pb-24" ref={catalogRef} id="showcase-catalog-container">
          {/* Sizing & Sorting Board */}
          <Filters
            filters={filters}
            setFilters={setFilters}
            totalProductsCount={products.length}
            filteredCount={filteredProducts.length}
          />

          {/* Catalog Grid Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <span className="text-neutral-400 text-sm block font-light italic">
                  {t("No matching luxury creations discovered in our inventory.")}
                </span>
                <button
                  onClick={() =>
                    setFilters({
                      brand: '',
                      category: 'All Collections',
                      size: '',
                      color: '',
                      priceRange: [0, 50000],
                      searchQuery: '',
                      sortBy: 'featured',
                      gender: 'all',
                      availability: 'all'
                    })
                  }
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3 rounded-none transition-colors cursor-pointer"
                >
                  {t("Reset Search Filters")}
                </button>
              </div>
            ) : isCatalogLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {Array.from({ length: Math.max(4, filteredProducts.length) }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ProductCard
                        product={p}
                        isWishlisted={wishlist.includes(p.id)}
                        onWishlistToggle={handleWishlistToggle}
                        onQuickView={(pTarget) => setSelectedQuickProduct(pTarget)}
                        onAddToCart={handleAddToCart}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Luxury Brand Philosophy Accent Banner */}
      <section className="bg-neutral-900/40 backdrop-blur-md py-20 border-t border-b border-neutral-900" id="brand-philosophy">
        <div className="max-w-3xl mx-auto text-center px-4 space-y-6">
          <span className="text-[10px] tracking-[0.3em] font-bold text-amber-500/80 uppercase">
            {t("Moviq Luxury Sneaker Philosophy")}
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-extralight tracking-wide leading-relaxed text-neutral-200 italic">
            &ldquo;{t("Philosophy Quote")}&rdquo;
          </p>
          <div className="flex justify-center items-center gap-1.5 text-neutral-500">
            <span className="w-6 h-[1.5px] bg-neutral-800" />
            <span className="text-[10px] tracking-widest uppercase font-bold text-white">{t("Founder of MOVIQ")}</span>
            <span className="w-6 h-[1.5px] bg-neutral-800" />
          </div>
        </div>
      </section>

      {/* 6. Footer Links */}
      <Footer onAdminClick={() => setIsAdminView(true)} />

      {/* --- SIDE DRAWERS & OVERLAYS --- */}

      {/* Cart Slider Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleProceedToCheckout}
          />
        )}
      </AnimatePresence>

      {/* Wishlist Slider Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlistedProducts={wishlistedProducts}
            onRemoveFromWishlist={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Quick View Details Modal */}
      <AnimatePresence>
        {selectedQuickProduct && (
          <QuickViewModal
            product={selectedQuickProduct}
            isOpen={!!selectedQuickProduct}
            onClose={() => setSelectedQuickProduct(null)}
            isWishlisted={wishlist.includes(selectedQuickProduct.id)}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            onAddReview={handleAddProductReview}
          />
        )}
      </AnimatePresence>

      {/* Multi-step Secure Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            discountRate={activeDiscountRate}
            appliedCode={appliedPromoCode}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>

      {/* --- COUTURE FEEDBACK NOTIFICATION TOAST --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3.5 rounded-none shadow-2xl border border-neutral-800 flex items-center gap-3.5 min-w-[320px] max-w-md"
            id="couture-toast"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent-red animate-ping" />
            <span className="text-xs uppercase tracking-wider font-semibold flex-1">
              {t(toastMessage)}
            </span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white text-[10px] uppercase font-bold font-mono pl-2"
            >
              {t("Dismiss")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic interactive AI mascot assistant */}
      <MoviqAssistant
        onApplyFilter={(action, category) => {
          if (action === 'apply_filter') {
            if (category === 'man') {
              handleTabChange('Men');
              setFilters((prev) => ({
                ...prev,
                gender: 'men'
              }));
            } else if (category === 'woman') {
              handleTabChange('Women');
              setFilters((prev) => ({
                ...prev,
                gender: 'women'
              }));
            }
          }
        }}
        onTriggerSizeFilter={() => {
          // If we are currently on the Home tab, switch to a collection tab so Catalog is rendered.
          const isHome = activeTab === 'Home';
          if (isHome) {
            handleTabChange('Men');
          }

          // Allow the tab transition to start rendering the Catalog
          setTimeout(() => {
            // If the filters section is collapsed/closed, trigger the toggle button
            const sizeFilterInit = document.getElementById('filter-sizes-section');
            if (!sizeFilterInit) {
              const toggleBtn = document.getElementById('filter-toggle-button');
              if (toggleBtn) {
                toggleBtn.click();
              }
            }

            // Allow short delay for the DOM to render the Filters board
            setTimeout(() => {
              const finalSizeFilter = document.getElementById('filter-sizes-section');
              if (finalSizeFilter) {
                // Determine if size filter is already in the viewport
                const rect = finalSizeFilter.getBoundingClientRect();
                const isAlreadyVisible = (
                  rect.top >= 0 &&
                  rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                );

                if (!isAlreadyVisible) {
                  finalSizeFilter.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Apply a highly-refined premium amber/gold glow and zoom effect
                finalSizeFilter.style.transition = 'all 0.5s ease-in-out';
                finalSizeFilter.style.boxShadow = '0 0 35px rgba(245, 158, 11, 0.75)';
                finalSizeFilter.style.borderColor = '#eab308'; // Luxury gold amber color
                finalSizeFilter.style.transform = 'scale(1.04)';
                finalSizeFilter.style.borderRadius = '12px';
                finalSizeFilter.style.padding = '14px';
                finalSizeFilter.style.backgroundColor = 'rgba(245, 158, 11, 0.04)';

                // Automatically focus on the first size button
                const sizeButtons = finalSizeFilter.querySelectorAll('button');
                if (sizeButtons && sizeButtons.length > 0) {
                  sizeButtons[0].focus();
                }

                // Gracefully fade out premium glow after 2.5 seconds
                setTimeout(() => {
                  finalSizeFilter.style.boxShadow = 'none';
                  finalSizeFilter.style.borderColor = 'transparent';
                  finalSizeFilter.style.transform = 'scale(1)';
                  finalSizeFilter.style.borderRadius = '0px';
                  finalSizeFilter.style.padding = '0px';
                  finalSizeFilter.style.backgroundColor = 'transparent';
                }, 2500);
              }
            }, 150);

          }, isHome ? 450 : 50);
        }}
      />
    </div>
  );
}
