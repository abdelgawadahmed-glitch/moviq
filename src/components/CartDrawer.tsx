import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Percent, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (discountRate: number, promoCode: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [activeDiscountRate, setActiveDiscountRate] = useState(0); // decimal rate e.g. 0.15 for 15%
  const [appliedCode, setAppliedCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');

    const formattedCode = promoCodeInput.trim().toUpperCase();

    // Check dynamic coupons from admin first
    try {
      const savedDiscountsStr = localStorage.getItem('moviq_discount_codes');
      if (savedDiscountsStr) {
        const savedDiscounts = JSON.parse(savedDiscountsStr);
        const match = savedDiscounts.find((d: any) => d.code === formattedCode && d.status === 'active');
        if (match) {
          if (subtotal < match.minSpend) {
            setPromoError(`Minimum spend of ${match.minSpend.toLocaleString()} EGP required for this code.`);
            return;
          }
          setActiveDiscountRate(match.discountRate);
          setAppliedCode(`${match.code} (${Math.round(match.discountRate * 100)}%)`);
          setPromoCodeInput('');
          
          // Increment usage count in localStorage
          match.usageCount = (match.usageCount || 0) + 1;
          localStorage.setItem('moviq_discount_codes', JSON.stringify(savedDiscounts));
          return;
        }
      }
    } catch (err) {
      console.error("Promo code parsing error: ", err);
    }

    if (formattedCode === 'MOVIQLUXURY') {
      setActiveDiscountRate(0.15);
      setAppliedCode('MOVIQLUXURY (15%)');
      setPromoCodeInput('');
    } else if (formattedCode === 'MOVIQ10OFF') {
      setActiveDiscountRate(0.10);
      setAppliedCode('MOVIQ10OFF (10%)');
      setPromoCodeInput('');
    } else {
      setPromoError('The promo code is invalid or has expired.');
    }
  };

  const discountAmount = subtotal * activeDiscountRate;
  const shippingCost = subtotal > 10000 || subtotal === 0 ? 0 : 250; // Complimentary express over 10,000 EGP
  const finalTotal = subtotal - discountAmount + shippingCost;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Dimmer backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 cursor-pointer backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-screen max-w-md bg-white text-black shadow-2xl flex flex-col h-full border-l border-neutral-100"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-black text-white rounded-none">
                <ShoppingBag size={16} />
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold tracking-widest uppercase text-black">Shopping Cart</h3>
                <p className="text-[10px] text-neutral-400 font-medium">Verify your luxury selections</p>
              </div>
              <span className="ml-2 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all rounded-full"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5 px-4">
                <div className="p-5 bg-neutral-50 rounded-full text-neutral-300 border border-neutral-100">
                  <ShoppingBag size={42} className="stroke-[1.2]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-black">
                    Your Shopping Bag is Empty
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-[250px] mx-auto font-light">
                    Add authentic curated sneakers from Nike, Jordan, Balenciaga, and Dior.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-black hover:bg-neutral-850 text-white font-bold text-[10px] uppercase tracking-widest py-3.5 px-8 rounded-none transition-all duration-300 shadow-sm cursor-pointer hover:tracking-[0.12em]"
                >
                  Explore Showcase
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 relative">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, idx) => (
                    <motion.div 
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="py-5 first:pt-0 last:pb-0 flex gap-4 group"
                      layout
                    >
                      {/* Item Image */}
                      <div className="w-22 aspect-[3/4] bg-neutral-50 border border-neutral-200/60 shrink-0 overflow-hidden flex items-center justify-center p-1.5 transition-all group-hover:border-neutral-400 duration-300 relative">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                        {item.product.discount > 0 && (
                          <span className="absolute top-1 left-1 bg-neutral-900 text-white text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5">
                            -{item.product.discount}%
                          </span>
                        )}
                      </div>

                      {/* Item Metadata */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] tracking-widest text-neutral-400 font-bold uppercase block">
                                {item.product.brand}
                              </span>
                              <h4 className="text-xs font-sans text-neutral-900 font-bold tracking-wide line-clamp-1">
                                {item.product.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => onRemoveItem(idx)}
                              className="p-1 text-neutral-300 hover:text-neutral-900 hover:bg-neutral-50 transition-all rounded-md shrink-0"
                              title="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                            <span className="text-[10px] text-neutral-500 font-semibold bg-neutral-100 px-2 py-0.5">
                              Size: <strong className="text-neutral-800 font-bold uppercase">{item.selectedSize}</strong>
                            </span>
                            <span className="text-neutral-300">|</span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold bg-neutral-100 px-2 py-0.5">
                              Shade:
                              <span
                                className="w-2 h-2 rounded-full inline-block border border-neutral-300/80"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <strong className="text-neutral-800 font-bold">{item.selectedColor.name}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between pt-3 border-t border-dashed border-neutral-100 mt-2">
                          {/* Editable Quantity controls */}
                          <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded-xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={10} />
                            </button>
                            
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={item.quantity === 0 ? '' : item.quantity}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >= 0) {
                                  onUpdateQuantity(idx, val);
                                }
                              }}
                              onBlur={() => {
                                if (item.quantity < 1) {
                                  onUpdateQuantity(idx, 1);
                                }
                              }}
                              className="w-9 text-center text-xs font-bold font-mono text-black bg-transparent border-none outline-none focus:ring-0 p-0"
                              style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                            />

                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          {/* Price sum */}
                          <div className="text-right">
                            <span className="text-xs font-bold font-sans text-neutral-900 block">
                              {(item.product.salePrice * item.quantity).toLocaleString()} EGP
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[9px] text-neutral-400 font-medium">
                                ({item.product.salePrice.toLocaleString()} each)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Drawer Footer Calculations (Only if items exist) */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-neutral-50 border-t border-neutral-200/80 space-y-4">
              {/* Promo code form */}
              <div className="space-y-1.5">
                <span className="text-[9px] tracking-widest text-neutral-400 font-bold uppercase block pl-0.5">
                  Promotional Voucher Code
                </span>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g. MOVIQLUXURY"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-white border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none uppercase font-semibold tracking-wider text-black rounded-none transition-all placeholder:text-neutral-300 placeholder:normal-case"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-neutral-850 text-white font-bold text-[10px] px-5 py-2.5 uppercase tracking-widest rounded-none transition-all shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                <p className="text-[9px] text-neutral-400 italic pl-1">
                  Try <strong className="text-neutral-600 font-bold">MOVIQLUXURY</strong> for 15% off, or <strong className="text-neutral-600 font-bold">MOVIQ10OFF</strong> for 10% off.
                </p>
              </div>

              {appliedCode && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-2 border border-emerald-200">
                  <Tag size={12} className="shrink-0" />
                  <span className="font-semibold">Voucher Applied: {appliedCode}</span>
                  <button
                    onClick={() => {
                      setActiveDiscountRate(0);
                      setAppliedCode('');
                    }}
                    className="ml-auto text-[9px] uppercase tracking-wider text-emerald-800 hover:text-black font-extrabold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <div className="text-[10px] text-neutral-800 bg-red-50 border border-red-100 px-3 py-1.5 font-medium rounded-xs">
                  ⚠️ {promoError}
                </div>
              )}

              {/* Subtotal, Shipping, Total */}
              <div className="space-y-2.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Selected Items Subtotal</span>
                  <span className="text-neutral-900 font-bold">{subtotal.toLocaleString()} EGP</span>
                </div>
                {activeDiscountRate > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50/50 px-2 py-1 rounded-sm">
                    <span className="flex items-center gap-1">
                      <Percent size={11} />
                      <span>Discount Coupon ({activeDiscountRate * 100}%)</span>
                    </span>
                    <span>-{discountAmount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="font-medium">Express Insured Courier</span>
                    {shippingCost === 0 && (
                      <span className="bg-emerald-600 text-white text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5">
                        Free
                      </span>
                    )}
                  </span>
                  <span className="text-neutral-900 font-bold">
                    {shippingCost === 0 ? 'Free Delivery' : `${shippingCost} EGP`}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-3.5 flex justify-between items-baseline text-black uppercase">
                  <span className="font-sans text-xs font-bold tracking-widest">Grand Total Due</span>
                  <span className="text-lg font-bold text-neutral-950 font-mono">
                    {finalTotal.toLocaleString()} <span className="text-xs font-semibold">EGP</span>
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onCheckout(activeDiscountRate, appliedCode || 'NONE')}
                className="w-full bg-black hover:bg-neutral-850 text-white font-bold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md cursor-pointer hover:gap-4 hover:tracking-[0.12em]"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight size={14} />
              </button>
              
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-neutral-400 font-bold uppercase tracking-wider text-center">
                <ShieldCheck size={11} className="text-emerald-600" />
                <span>SSL Encryption &bull; Authenticity Certificate Included</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
