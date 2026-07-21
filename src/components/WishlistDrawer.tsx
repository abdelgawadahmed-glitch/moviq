import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useI18n } from '../lib/i18n';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveFromWishlist,
  onAddToCart
}: WishlistDrawerProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="wishlist-drawer-container">
      {/* Dimmer backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-screen max-w-md bg-white text-black shadow-2xl flex flex-col h-full"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={18} fill="#000" />
              <h3 className="font-serif text-lg font-bold tracking-wide uppercase">{t("Wishlist")}</h3>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {wishlistedProducts.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-neutral-50 rounded-full text-neutral-400">
                  <Heart size={38} className="stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-black">
                    {t("Your Wishlist is Empty")}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed max-w-[240px] mx-auto">
                    {t("Your Wishlist is Empty")}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-[10.5px] uppercase tracking-widest py-3 px-6 rounded-none transition-colors"
                >
                  {t("Go Back to Catalog")}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 relative">
                <AnimatePresence mode="popLayout">
                  {wishlistedProducts.map((product) => {
                    const defaultSize = product.sizes[0] || 'M';
                    const defaultColor = product.colors[0] || { name: 'Noir Black', hex: '#000000' };

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="py-4 first:pt-0 last:pb-0 flex gap-4"
                        layout
                      >
                        {/* Product Image */}
                        <div className="w-16 aspect-[3/4] bg-neutral-50 border border-neutral-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        {/* Info and action */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] tracking-widest text-neutral-400 font-bold uppercase block">
                                {t(product.brand)}
                              </span>
                              <h4 className="text-xs font-serif text-black font-semibold tracking-wide line-clamp-1">
                                {t(product.name)}
                              </h4>
                              <span className="text-accent-red font-bold text-xs font-serif mt-1 block">
                                {product.salePrice.toLocaleString()} {t("EGP")}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => onRemoveFromWishlist(product.id)}
                              className="p-1 text-neutral-400 hover:text-black transition-colors"
                              title="Remove favorite"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Move/Add to Cart Button */}
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                onAddToCart(product, defaultSize, defaultColor);
                                onRemoveFromWishlist(product.id);
                              }}
                              className="w-full bg-black hover:bg-neutral-800 text-white font-semibold text-[9.5px] uppercase tracking-widest py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
                            >
                              <ShoppingBag size={11} />
                              <span>{t("Add to Bag")}</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
