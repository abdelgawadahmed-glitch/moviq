import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

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
      className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] border border-neutral-100/70 transition-all duration-500 flex flex-col h-full group relative"
      id={`product-card-${product.id}`}
    >
      {/* 1. Image & Action Overlay Container */}
      <div className="relative aspect-[4/5] bg-neutral-50/50 overflow-hidden flex items-center justify-center p-5 select-none">
        
        {/* Wishlist Toggle Button (Corners) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className={`absolute top-4 left-4 z-20 p-3 rounded-full transition-all duration-300 shadow-xs cursor-pointer hover:scale-110 active:scale-95 ${
            isWishlisted
              ? 'bg-black text-white'
              : 'bg-white/95 text-neutral-700 hover:text-black hover:bg-white'
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
          <span className="absolute top-4 right-4 z-20 bg-accent-red text-white text-[10px] tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm">
            -{product.discount}% OFF
          </span>
        ) : product.isNew ? (
          <span className="absolute top-4 right-4 z-20 bg-black text-white text-[10px] tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={9} className="animate-pulse" />
            NEW IN
          </span>
        ) : null}

        {/* Large Product Image with Hover Zoom */}
        <div className="w-full h-full flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-4/5 h-4/5 object-contain transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-112 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Interactive Hover Action Panel */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5 z-10">
          <div className="flex flex-col gap-2.5 translate-y-6 group-hover:translate-y-0 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
            {/* Quick View Button */}
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-black font-semibold text-[10.5px] uppercase tracking-[0.2em] py-3.5 flex items-center justify-center gap-2 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product, defaultSize, defaultColor)}
              className="w-full bg-black hover:bg-neutral-900 text-white font-semibold text-[10.5px] uppercase tracking-[0.2em] py-3.5 flex items-center justify-center gap-2 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <ShoppingBag size={13} />
              <span>Add To Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Product Information Details */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        {/* Brand */}
        <span className="text-[10px] tracking-[0.25em] text-neutral-400 font-bold uppercase block mb-1">
          {product.brand}
        </span>

        {/* Product Name */}
        <h3 className="font-serif text-[16px] text-black font-medium tracking-wide mb-2.5 line-clamp-1 group-hover:text-neutral-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating Stars with reviews count */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center text-amber-400 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                className="stroke-[2]"
              />
            ))}
          </div>
          <span className="text-[9.5px] text-neutral-400 font-bold tracking-wider ml-1">
            {product.rating.toFixed(1)} ({product.reviewsCount} reviews)
          </span>
        </div>

        {/* Available Sizes Showcase */}
        <div className="mb-5 pt-3 border-t border-neutral-100/70">
          <span className="text-[8.5px] tracking-[0.18em] text-neutral-400 font-bold uppercase block mb-2">
            Available Sizes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-[9px] font-semibold text-neutral-600 border border-neutral-200/60 px-2 py-1 rounded-md bg-neutral-50/50 hover:bg-black hover:text-white hover:border-black transition-all cursor-default select-none"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[9px] font-bold text-neutral-400 self-center pl-1">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Prices Container */}
        <div className="mt-auto pt-4 border-t border-neutral-100/70 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-black font-bold text-[14.5px] tracking-wide font-serif">
              {product.salePrice.toLocaleString()} EGP
            </span>
            {product.discount > 0 && (
              <span className="text-neutral-400 line-through text-[11px] font-light">
                {product.originalPrice.toLocaleString()} EGP
              </span>
            )}
          </div>

          {/* Quick-buy pill button for touch screen users */}
          <button
            onClick={() => onAddToCart(product, defaultSize, defaultColor)}
            className="md:hidden p-2 bg-neutral-900 text-white rounded-full hover:bg-black transition-colors"
            aria-label="Add to bag"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
