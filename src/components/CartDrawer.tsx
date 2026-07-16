import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Percent } from 'lucide-react';
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
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <h3 className="font-serif text-lg font-bold tracking-wide uppercase">Shopping Bag</h3>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-neutral-50 rounded-full text-neutral-400">
                  <ShoppingBag size={38} className="stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-black">
                    Your shopping bag is empty
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed max-w-[240px] mx-auto">
                    Fill it with authentic premium sneakers and explore Nike, Jordan, and Balenciaga grails.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-[10.5px] uppercase tracking-widest py-3 px-6 rounded-none transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 aspect-[3/4] bg-neutral-50 border border-neutral-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Metadata */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] tracking-widest text-neutral-400 font-bold uppercase block">
                            {item.product.brand}
                          </span>
                          <h4 className="text-xs font-serif text-black font-semibold tracking-wide line-clamp-1">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-neutral-500 font-medium">
                              Size: <strong className="text-black uppercase">{item.selectedSize}</strong>
                            </span>
                            <span className="text-neutral-300">|</span>
                            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
                              Shade:
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-300"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <strong className="text-black">{item.selectedColor.name}</strong>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="p-1 text-neutral-400 hover:text-accent-red transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-neutral-200">
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-50 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2.5 text-xs font-bold font-mono text-black">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-50"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Price sum */}
                        <span className="text-xs font-bold font-serif text-black">
                          {(item.product.salePrice * item.quantity).toLocaleString()} EGP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer Calculations (Only if items exist) */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo (e.g. MOVIQLUXURY)"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 focus:border-black text-xs py-2.5 px-3 outline-none uppercase font-semibold tracking-wider text-black rounded-none"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-[10px] px-4 py-2.5 uppercase tracking-widest rounded-none transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>

              {appliedCode && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 border border-emerald-100">
                  <Tag size={12} />
                  <span>Voucher applied: {appliedCode}</span>
                  <button
                    onClick={() => {
                      setActiveDiscountRate(0);
                      setAppliedCode('');
                    }}
                    className="ml-auto text-[9px] uppercase tracking-wider text-neutral-400 hover:text-black font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <div className="text-[10px] text-accent-red font-medium pl-1">
                  {promoError}
                </div>
              )}

              {/* Subtotal, Shipping, Total */}
              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="text-black font-bold">{subtotal.toLocaleString()} EGP</span>
                </div>
                {activeDiscountRate > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Coupon ({activeDiscountRate * 100}%)</span>
                    <span>-{discountAmount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span>Express Private Delivery</span>
                    {shippingCost === 0 && (
                      <span className="bg-black text-white text-[8px] font-bold tracking-widest uppercase px-1 rounded-sm">
                        Complimentary
                      </span>
                    )}
                  </span>
                  <span className="text-black font-bold">
                    {shippingCost === 0 ? 'Free' : `${shippingCost} EGP`}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm text-black font-serif font-black uppercase">
                  <span>Total Due</span>
                  <span className="text-base text-accent-red">{finalTotal.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onCheckout(activeDiscountRate, appliedCode || 'NONE')}
                className="w-full bg-black hover:bg-neutral-800 text-white font-semibold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight size={14} />
              </button>
              
              <div className="text-center text-[9px] text-neutral-400 font-semibold tracking-wider uppercase">
                🔒 Secured by SSL &bull; Apple Pay &amp; Cards Accepted
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
