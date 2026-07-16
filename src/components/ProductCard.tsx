import React from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
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
  onQuickView,
  onAddToCart
}: ProductCardProps) {
  // Select first available size and color as default for quick-add
  const defaultSize = product.sizes[0] || 'M';
  const defaultColor = product.colors[0] || { name: 'Noir Black', hex: '#000000' };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-neutral-100 transition-shadow duration-300 flex flex-col h-full group"
      id={`product-card-${product.id}`}
    >
      {/* Image & Action Overlay Container */}
      <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden flex items-center justify-center p-4">
        {/* Wishlist toggle badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          className={`absolute top-4 left-4 z-10 p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
            isWishlisted
              ? 'bg-black text-white'
              : 'bg-white/80 hover:bg-white text-neutral-600 hover:text-black shadow-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={isWishlisted ? '#FFFFFF' : 'none'} className={isWishlisted ? 'scale-110' : ''} />
        </button>

        {/* Red discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-4 right-4 z-10 bg-accent-red text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm shadow-sm">
            -{product.discount}% OFF
          </span>
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Action Panel sliding/fading in on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            animate={{ y: 0 }}
            className="flex flex-col gap-2 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
          >
            {/* Quick View Button */}
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-black font-semibold text-[10.5px] uppercase tracking-widest py-3 flex items-center justify-center gap-2 rounded-none transition-all cursor-pointer shadow-md"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product, defaultSize, defaultColor)}
              className="w-full bg-black hover:bg-neutral-800 text-white font-semibold text-[10.5px] uppercase tracking-widest py-3 flex items-center justify-center gap-2 rounded-none transition-all cursor-pointer shadow-md"
            >
              <ShoppingBag size={13} />
              <span>Add To Cart</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Product Information Details */}
      <div className="p-5 flex flex-col flex-grow text-center">
        {/* Brand Name */}
        <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-bold uppercase block mb-1">
          {product.brand}
        </span>

        {/* Product Name */}
        <h3 className="font-serif text-[15px] text-black font-medium tracking-wide mb-2 line-clamp-1 group-hover:text-neutral-700 transition-colors">
          {product.name}
        </h3>

        {/* Stars Rating Preview */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                className="stroke-[2.5]"
              />
            ))}
          </div>
          <span className="text-[9px] text-neutral-400 font-semibold tracking-wider uppercase ml-1">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Prices container */}
        <div className="mt-auto pt-2 border-t border-neutral-50 flex items-center justify-center gap-3">
          {product.discount > 0 && (
            <span className="text-neutral-400 line-through text-xs font-light">
              {product.originalPrice.toLocaleString()} EGP
            </span>
          )}
          <span className="text-accent-red font-bold text-sm tracking-wide font-serif">
            {product.salePrice.toLocaleString()} EGP
          </span>
        </div>
      </div>
    </motion.div>
  );
}
