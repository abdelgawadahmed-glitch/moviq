import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useI18n } from '../lib/i18n';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onQuickView
}: ProductCardProps) {
  const { t } = useI18n();
  const [isHovered, setIsHovered] = useState(false);
  
  // Select first available size and color as default for quick-add
  const defaultSize = product.sizes[0] || '42';
  const defaultColor = product.colors[0] || { name: 'Noir Black', hex: '#000000' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, scale: 1.005 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-[20px] overflow-hidden shadow-luxury hover:shadow-luxury-lg border border-neutral-100 hover:border-neutral-200/80 transition-luxury flex flex-col h-full group relative"
      id={`product-card-${product.id}`}
    >
      {/* 1. Image & Action Overlay Container */}
      <div className="relative aspect-[4/5] bg-neutral-50/80 overflow-hidden flex items-center justify-center p-5 select-none border-b border-neutral-100">
        
        {/* Wishlist Toggle Button (Corners) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className={`absolute top-4 left-4 z-20 p-3 rounded-full transition-all duration-300 shadow-sm cursor-pointer hover:scale-110 active:scale-95 ${
            isWishlisted
              ? 'bg-black text-white'
              : 'bg-white/90 backdrop-blur-md text-neutral-600 hover:text-black border border-neutral-200/60'
          }`}
          aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? '#FFFFFF' : 'none'} 
            className={`transition-transform duration-300 ${isWishlisted ? 'scale-110' : 'group-hover:scale-110'}`} 
          />
        </button>

        {/* Discount Badge */}
        {product.discount > 0 ? (
          <span className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[10px] tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm">
            -{product.discount}% {t("OFF")}
          </span>
        ) : product.isNew ? (
          <span className="absolute top-4 right-4 z-20 bg-black text-white text-[10px] tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={9} className="animate-pulse text-amber-400" />
            {t("New")}
          </span>
        ) : null}

        {/* Large Product Image with Hover Zoom */}
        <div className="w-full h-full flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-4/5 h-4/5 object-contain transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-112 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Interactive Hover Action Panel */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5 z-10">
          <div className="flex flex-col gap-2.5 translate-y-6 group-hover:translate-y-0 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
            {/* Quick View Button */}
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-white/95 backdrop-blur-md hover:bg-white text-black font-semibold text-[16px] uppercase tracking-[0.12em] py-3 flex items-center justify-center gap-2 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] border border-neutral-200"
            >
              <Eye size={15} />
              <span>{t("View Detail")}</span>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product, defaultSize, defaultColor)}
              className="w-full bg-black hover:bg-neutral-800 text-white font-semibold text-[16px] uppercase tracking-[0.12em] py-3 flex items-center justify-center gap-2 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <ShoppingBag size={15} />
              <span>{t("Add to Bag")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Product Information Details */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        {/* Brand */}
        <span className="text-[12px] tracking-[0.25em] text-neutral-400 font-bold uppercase block mb-1">
          {t(product.brand)}
        </span>

        {/* Product Name */}
        <h3 className="text-[20px] sm:text-[22px] text-neutral-900 font-semibold tracking-tight mb-4 line-clamp-1 group-hover:text-black transition-colors leading-snug">
          {t(product.name)}
        </h3>

        {/* Available Sizes Showcase */}
        <div className="mb-5 pt-3 border-t border-neutral-100">
          <span className="text-[11px] tracking-[0.18em] text-neutral-400 font-semibold uppercase block mb-2">
            {t("Sizes")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-[12px] font-semibold text-neutral-600 border border-neutral-200 px-2.5 py-1 rounded-md bg-neutral-50 hover:bg-black hover:text-white hover:border-black transition-all cursor-default select-none animate-none"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[11px] font-bold text-neutral-400 self-center pl-1">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Prices Container */}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-neutral-900 font-bold text-[16px] tracking-wide">
              {product.salePrice.toLocaleString()} {t("EGP")}
            </span>
            {product.discount > 0 && (
              <span className="text-neutral-400 line-through text-[14px] font-normal">
                {product.originalPrice.toLocaleString()} {t("EGP")}
              </span>
            )}
          </div>

          {/* Quick-buy pill button for touch screen users */}
          <button
            onClick={() => onAddToCart(product, defaultSize, defaultColor)}
            className="md:hidden p-2 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
            aria-label="Add to bag"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
