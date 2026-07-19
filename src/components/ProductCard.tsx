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
      className="bg-neutral-900/40 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] border border-neutral-800 transition-all duration-500 flex flex-col h-full group relative"
      id={`product-card-${product.id}`}
    >
      {/* 1. Image & Action Overlay Container */}
      <div className="relative aspect-[4/5] bg-neutral-950/40 overflow-hidden flex items-center justify-center p-5 select-none border-b border-neutral-800/50">
        
        {/* Wishlist Toggle Button (Corners) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className={`absolute top-4 left-4 z-20 p-3 rounded-full transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95 ${
            isWishlisted
              ? 'bg-white text-black'
              : 'bg-neutral-950/80 text-neutral-300 hover:text-white hover:bg-neutral-900'
          }`}
          aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? '#000000' : 'none'} 
            className={`transition-transform duration-300 ${isWishlisted ? 'scale-110' : 'group-hover:scale-110'}`} 
          />
        </button>

        {/* Discount Badge */}
        {product.discount > 0 ? (
          <span className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[10px] tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm">
            -{product.discount}% OFF
          </span>
        ) : product.isNew ? (
          <span className="absolute top-4 right-4 z-20 bg-white text-black text-[10px] tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={9} className="animate-pulse" />
            NEW IN
          </span>
        ) : null}

        {/* Large Product Image with Hover Zoom */}
        <div className="w-full h-full flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-4/5 h-4/5 object-contain transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-112 filter drop-shadow-[0_10px_35px_rgba(255,255,255,0.02)]"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Interactive Hover Action Panel */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5 z-10">
          <div className="flex flex-col gap-2.5 translate-y-6 group-hover:translate-y-0 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
            {/* Quick View Button */}
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-neutral-900/95 backdrop-blur-md hover:bg-neutral-800 text-white font-semibold text-[10.5px] uppercase tracking-[0.2em] py-3.5 flex items-center justify-center gap-2 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] border border-neutral-800"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product, defaultSize, defaultColor)}
              className="w-full bg-white hover:bg-neutral-200 text-black font-semibold text-[10.5px] uppercase tracking-[0.2em] py-3.5 flex items-center justify-center gap-2 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <ShoppingBag size={13} />
              <span>Add To Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Product Information Details */}
      <div className="p-6 flex flex-col flex-grow bg-neutral-900/20">
        {/* Brand */}
        <span className="text-[10px] tracking-[0.25em] text-neutral-500 font-bold uppercase block mb-1">
          {product.brand}
        </span>

        {/* Product Name */}
        <h3 className="font-serif text-[16px] text-white font-medium tracking-wide mb-2.5 line-clamp-1 group-hover:text-neutral-200 transition-colors">
          {product.name}
        </h3>

        {/* Rating Stars with reviews count */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center text-amber-500 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                className="stroke-[1.5]"
              />
            ))}
          </div>
          <span className="text-[9.5px] text-neutral-500 font-bold tracking-wider ml-1">
            {product.rating.toFixed(1)} ({product.reviewsCount} reviews)
          </span>
        </div>

        {/* Available Sizes Showcase */}
        <div className="mb-5 pt-3 border-t border-neutral-800/80">
          <span className="text-[8.5px] tracking-[0.18em] text-neutral-500 font-bold uppercase block mb-2">
            Available Sizes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-[9px] font-semibold text-neutral-400 border border-neutral-800 px-2 py-1 rounded-md bg-neutral-950/50 hover:bg-white hover:text-black hover:border-white transition-all cursor-default select-none animate-none"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[9px] font-bold text-neutral-500 self-center pl-1">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Prices Container */}
        <div className="mt-auto pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-white font-bold text-[14.5px] tracking-wide font-serif">
              {product.salePrice.toLocaleString()} EGP
            </span>
            {product.discount > 0 && (
              <span className="text-neutral-500 line-through text-[11px] font-light">
                {product.originalPrice.toLocaleString()} EGP
              </span>
            )}
          </div>

          {/* Quick-buy pill button for touch screen users */}
          <button
            onClick={() => onAddToCart(product, defaultSize, defaultColor)}
            className="md:hidden p-2 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors"
            aria-label="Add to bag"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
