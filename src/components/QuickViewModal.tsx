import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, MessageSquare } from 'lucide-react';
import { Product, Review } from '../types';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onWishlistToggle: (id: string) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onAddReview: (productId: string, review: Review) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onAddReview
}: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Noir Black', hex: '#000000' });
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // New review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  React.useEffect(() => {
    setActiveImage(product.image);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0] || { name: 'Noir Black', hex: '#000000' });
    setActiveTab('details');
    setShowSuccessMsg(false);
  }, [product]);

  if (!isOpen) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setIsSubmittingReview(true);

    // Simulate luxury API response lag
    setTimeout(() => {
      const newReview: Review = {
        id: `rev-sim-${Date.now()}`,
        author: reviewName,
        rating: reviewRating,
        date: 'Today',
        comment: reviewComment
      };

      onAddReview(product.id, newReview);
      setIsSubmittingReview(false);
      setShowSuccessMsg(true);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Background Dimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={onClose}
      />

      {/* Main Glass/White Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.15 }}
        className="relative bg-white text-black shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-none z-10 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100"
        id="quick-view-modal-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all rounded-full cursor-pointer"
          aria-label="Close details"
          id="close-modal-btn"
        >
          <X size={20} />
        </button>

        {/* Column 1: Gallery & Images (md: 5 cols) */}
        <div className="md:col-span-5 p-6 sm:p-8 flex flex-col gap-4 bg-neutral-50" id="modal-gallery-side">
          <div className="aspect-[3/4] w-full bg-white flex items-center justify-center overflow-hidden border border-neutral-100 p-2">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Thumbnails list */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-square bg-white border p-1 overflow-hidden transition-all duration-200 cursor-pointer ${
                    activeImage === imgUrl ? 'border-black ring-1 ring-black' : 'border-neutral-200 hover:border-black'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail preview" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Buy Details & Forms (md: 7 cols) */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col overflow-y-auto" id="modal-details-side">
          <span className="text-[11px] tracking-[0.25em] text-neutral-400 font-bold uppercase mb-1.5 block">
            {product.brand}
          </span>
          <h2 className="font-serif text-2xl sm:text-3.5xl font-extralight tracking-wide text-black mb-3 leading-tight uppercase">
            {product.name}
          </h2>

          {/* Ratings Summary */}
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-neutral-100">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  className="stroke-[2.5]"
                />
              ))}
            </div>
            <span className="text-xs text-neutral-600 font-semibold">
              {product.rating} / 5.0
            </span>
            <span className="text-neutral-300">|</span>
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              {product.reviewsCount} Client Reviews
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xl font-bold font-serif text-accent-red">
              {product.salePrice.toLocaleString()} EGP
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-neutral-400 line-through">
                  {product.originalPrice.toLocaleString()} EGP
                </span>
                <span className="bg-accent-red/10 text-accent-red text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Tabs header */}
          <div className="flex border-b border-neutral-200 mb-6 text-xs uppercase tracking-widest font-semibold text-neutral-500">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 pr-6 border-b-2 transition-all cursor-pointer ${
                activeTab === 'details' ? 'border-black text-black font-bold' : 'border-transparent hover:text-black'
              }`}
            >
              Overview &amp; Materials
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-6 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews' ? 'border-black text-black font-bold' : 'border-transparent hover:text-black'
              }`}
            >
              <span>Client Reviews</span>
              <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {product.reviews.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-6 flex-grow">
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Sizing grid */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Select Sizing
                  </span>
                  <span className="text-[10px] text-neutral-500 underline uppercase tracking-wider font-medium cursor-pointer hover:text-black">
                    Sizing Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 text-xs uppercase font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Select Shade: <span className="text-black font-semibold uppercase">{selectedColor.name}</span>
                </span>
                <div className="flex gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className="group flex items-center justify-center relative cursor-pointer"
                        title={color.name}
                      >
                        <span
                          className="w-8 h-8 rounded-full border border-neutral-300 block transition-transform group-hover:scale-105 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        {isSelected && (
                          <span className="absolute inset-0 border-2 border-black rounded-full scale-110" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Materials list */}
              <div className="bg-neutral-50 p-4 border border-neutral-100">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest block mb-2">
                  Atelier Specifications
                </span>
                <ul className="text-xs text-neutral-600 font-light space-y-1.5 list-disc pl-4">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 pt-5 text-center text-[10px] text-neutral-500 tracking-wider uppercase font-semibold">
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck size={16} className="text-neutral-400" />
                  <span>100% Certified</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Truck size={16} className="text-neutral-400" />
                  <span>Express Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RefreshCw size={16} className="text-neutral-400" />
                  <span>15-Day Returns</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedSize, selectedColor);
                  }}
                  className="flex-1 bg-black hover:bg-neutral-800 text-white font-semibold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-all duration-300 flex items-center justify-center gap-3.5 group cursor-pointer shadow-md"
                >
                  <ShoppingBag size={15} />
                  <span>Add To Shopping Bag</span>
                </button>
                
                <button
                  onClick={() => onWishlistToggle(product.id)}
                  className={`px-5 py-4 border text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-black text-white border-black'
                      : 'border-neutral-200 text-neutral-700 hover:border-black hover:text-black'
                  }`}
                >
                  <Heart size={14} fill={isWishlisted ? '#FFFFFF' : 'none'} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Reviews and Submitting live reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 flex-grow">
              {/* Existing Reviews List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {product.reviews.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic py-6 text-center">
                    No client reviews recorded yet. Be the first to express opinion.
                  </p>
                ) : (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-neutral-100 pb-3.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-black">{rev.author}</span>
                        <span className="text-neutral-400 text-[10px]">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            fill={i < rev.rating ? 'currentColor' : 'none'}
                            className="stroke-[2]"
                          />
                        ))}
                      </div>
                      <p className="text-neutral-600 font-light leading-relaxed pl-1">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add simulated Review Form */}
              <div className="border-t border-neutral-100 pt-5">
                <span className="text-[11px] tracking-wider text-black font-semibold uppercase block mb-3.5 flex items-center gap-2">
                  <MessageSquare size={14} />
                  <span>Share Your Experience</span>
                </span>

                {showSuccessMsg ? (
                  <div className="bg-neutral-50 p-4 border border-neutral-100 text-center space-y-1.5">
                    <span className="text-xs font-bold text-black uppercase tracking-wider block">
                      Review Logged Authentically
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Thank you. Your couture review has been incorporated and the average rating recalculated.
                    </p>
                    <button
                      onClick={() => setShowSuccessMsg(false)}
                      className="text-[10px] text-black underline uppercase font-semibold tracking-wider pt-2 block mx-auto"
                    >
                      Post Another Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Marie Dupont"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:bg-white text-xs py-2.5 px-3 outline-none rounded-none font-medium text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                          Rating Score
                        </label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(parseInt(e.target.value))}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:bg-white text-xs py-2.5 px-3 outline-none rounded-none font-semibold text-black"
                        >
                          <option value="5">5 Stars (Excellent)</option>
                          <option value="4">4 Stars (Great)</option>
                          <option value="3">3 Stars (Average)</option>
                          <option value="2">2 Stars (Poor)</option>
                          <option value="1">1 Star (Terrible)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-1">
                        Review Detail
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="The garment structure, texture and packaging are impeccable..."
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:bg-white text-xs py-2.5 px-3 outline-none rounded-none font-light text-black resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-bold text-[10px] py-3 uppercase tracking-widest rounded-none transition-colors"
                    >
                      {isSubmittingReview ? 'Submitting Couture Review...' : 'Publish Couture Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
