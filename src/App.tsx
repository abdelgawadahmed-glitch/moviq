import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight, ShieldCheck, HelpCircle, Eye, RefreshCw, Star } from 'lucide-react';

import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';

import { PRODUCTS } from './data/products';
import { Product, CartItem, FilterState, Review } from './types';

export default function App() {
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
    sortBy: 'featured'
  });

  // Drawer toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);

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
    setFilters((prev) => ({
      ...prev,
      brand,
      category: 'All Collections'
    }));
    setTimeout(handleScrollToCatalog, 150);
  };

  // Sync general nav tab changes
  const handleTabChange = (tab: string) => {
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

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white relative" id="moviq-app-root">
      
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
      />

      {/* 2. Hero Section */}
      <Hero
        activeTab={activeTab}
        selectedBrand={filters.brand}
        onScrollToCatalog={handleScrollToCatalog}
      />

      {/* 3. Editorial Spotlight Banners (Only on HOME tab for Dior/Apple style luxury storytelling) */}
      {activeTab === 'Home' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16" id="home-spotlight">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-neutral-50 p-8 sm:p-12 border border-neutral-100">
            <div className="space-y-4 max-w-md">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">
                Seasonal Spotlight
              </span>
              <h2 className="font-serif text-3xl sm:text-4.5xl font-extralight tracking-wide leading-tight text-black uppercase">
                AUTHENTIC SNEAKER COUTURE
              </h2>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Discover rare luxury trainers and limited-release retros. Every pair undergoes a rigorous multi-point verification audit by our experts, analyzing stitching, materials, and sole density to ensure you receive 100% authentic grail sneakers.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => handleTabChange('Luxury Collection')}
                  className="bg-black hover:bg-neutral-800 text-white font-semibold text-[10.5px] uppercase tracking-widest px-6 py-3 rounded-none transition-colors cursor-pointer"
                >
                  View Archive
                </button>
                <button
                  onClick={handleScrollToCatalog}
                  className="text-black hover:text-neutral-600 font-bold text-[10.5px] uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Browse Showcase</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            <div className="relative aspect-video sm:aspect-[4/3] max-h-[380px] overflow-hidden bg-white border border-neutral-100 p-2">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80"
                alt="Authenticity Vault"
                className="w-full h-full object-cover object-center transition-transform duration-[10s] hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-md px-3.5 py-1.5 text-[9px] uppercase font-bold tracking-widest text-white shadow-lg">
                100% Authentic
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Filter Panel & Catalog Showcase */}
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
                No matching luxury creations discovered in our inventory.
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
                    sortBy: 'featured'
                  })
                }
                className="bg-black hover:bg-neutral-800 text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3 rounded-none transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
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

      {/* 5. Luxury Brand Philosophy Accent Banner */}
      <section className="bg-neutral-50 py-16 border-t border-b border-neutral-100" id="brand-philosophy">
        <div className="max-w-3xl mx-auto text-center px-4 space-y-6">
          <span className="text-[10px] tracking-[0.3em] font-bold text-neutral-400 uppercase">
            Moviq Luxury Sneaker Philosophy
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-extralight tracking-wide leading-relaxed text-black italic">
            &ldquo;Luxury is not about standing out, but about being remembered. It lies in the purity of geometric proportions and the absolute honesty of materials.&rdquo;
          </p>
          <div className="flex justify-center items-center gap-1.5 text-neutral-400">
            <span className="w-6 h-[1.5px] bg-neutral-300" />
            <span className="text-[10px] tracking-widest uppercase font-bold text-black">Founder of MOVIQ</span>
            <span className="w-6 h-[1.5px] bg-neutral-300" />
          </div>
        </div>
      </section>

      {/* 6. Footer Links */}
      <Footer />

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
              {toastMessage}
            </span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white text-[10px] uppercase font-bold font-mono pl-2"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
