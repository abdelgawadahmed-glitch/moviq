import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShoppingBag, Truck, CheckCircle, ArrowLeft, Loader, ShieldCheck, Landmark } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountRate: number;
  appliedCode: string;
  onOrderSuccess: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountRate,
  appliedCode,
  onOrderSuccess
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'visa_master' | 'meeza' | 'apple_google' | 'cod'>('visa_master');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const shippingCost = subtotal > 10000 ? 0 : 250;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate secure 2-second bank authorization lag
    setTimeout(() => {
      setIsProcessing(false);
      setOrderId(`MVQ-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep(3);
    }, 2000);
  };

  const handleCompleteAndClose = () => {
    onOrderSuccess(); // Clears cart in parent
    onClose();
    setStep(1);
    setFullName('');
    setEmail('');
    setAddress('');
    setCity('');
    setZip('');
    setPhone('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black cursor-pointer"
        onClick={step !== 3 ? onClose : undefined}
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-white text-black shadow-2xl w-full max-w-4xl rounded-none z-10 grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-hidden"
        id="checkout-modal-container"
      >
        {/* Close button (disable during confirmation step or processing) */}
        {step !== 3 && !isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black transition-all rounded-full"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        )}

        {/* Left Side: Dynamic Form Panel (lg: 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 overflow-y-auto flex flex-col justify-between" id="checkout-form-side">
          {/* Progress Indicators */}
          {step !== 3 && (
            <div className="flex items-center gap-4 mb-8 text-[11px] uppercase tracking-widest font-semibold text-neutral-400">
              <span className={step === 1 ? 'text-black font-bold pb-1 border-b-2 border-black' : 'text-neutral-500'}>
                01. Shipping
              </span>
              <span className="h-[1px] w-8 bg-neutral-200" />
              <span className={step === 2 ? 'text-black font-bold pb-1 border-b-2 border-black' : 'text-neutral-500'}>
                02. Payment
              </span>
              <span className="h-[1px] w-8 bg-neutral-200" />
              <span className="text-neutral-300">
                03. Receipt
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Shipping Form */}
            {step === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleNextStep}
                className="space-y-4"
                id="shipping-form"
              >
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-light tracking-wide uppercase">Private Delivery Address</h3>
                  <p className="text-xs text-neutral-500 font-light">
                    100% authentic sneakers delivered. Next-day to Cairo, Giza &amp; Alexandria. 2-3 days to all other Egypt governorates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Amr Fahmy"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                      Couture Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amr.fahmy@moviq.com"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                    Street Address, Building &amp; Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building 12, El-Nasr St, Maadi"
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                      City / Governorate *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cairo"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="11728"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                    Private Courier Phone Contact *
                    </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 123 4567"
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-colors pt-4 mt-6 shadow-md cursor-pointer"
                >
                  Proceed To Payment
                </button>
              </motion.form>
            )}

            {/* Step 2: Payment Form */}
            {step === 2 && (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handlePlaceOrder}
                className="space-y-5"
                id="payment-form"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-light tracking-wide uppercase">Couture Billing</h3>
                    <p className="text-xs text-neutral-500 font-light">
                      All transaction interfaces are encrypted and stored in strict privacy.
                    </p>
                  </div>
                </div>

                {/* Tab selections */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[9px] uppercase font-bold tracking-widest">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('visa_master')}
                    className={`py-3 px-1 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'visa_master'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>Visa / MasterCard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('meeza')}
                    className={`py-3 px-1 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'meeza'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>Meeza Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_google')}
                    className={`py-3 px-1 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'apple_google'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    <Landmark size={13} />
                    <span>Apple / Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-3 px-1 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    <Truck size={13} />
                    <span>Cash On Delivery</span>
                  </button>
                </div>

                {paymentMethod === 'visa_master' && (
                  <div className="space-y-3.5 pt-3">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      Pay with Visa or MasterCard
                    </span>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        Cardholder Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="AMR FAHMY"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                          Expiry Date (MM/YY) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/29"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-mono font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                          Security CVV Code *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-mono font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'meeza' && (
                  <div className="space-y-3.5 pt-3">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                      Pay with Meeza National Debit/Credit Card
                    </span>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        Cardholder Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="AMR FAHMY"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-medium uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        Meeza Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        placeholder="5078 1234 5678 9012"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                          Expiry Date (MM/YY) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/29"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-mono font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                          Security CVV Code *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black text-sm py-3 px-4 outline-none rounded-none font-mono font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple_google' && (
                  <div className="bg-neutral-50 p-6 border border-neutral-100 text-center py-10 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      Apple / Google Express Wallet
                    </span>
                    <p className="text-[11px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Confirm via Touch ID, Face ID, or your Google Wallet passcode. Order credentials will sync instantly and securely.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="bg-neutral-50 p-6 border border-neutral-200 text-center py-10 space-y-3">
                    <span className="text-xs font-bold text-black uppercase tracking-wider block">
                      Cash On Delivery (COD) Egypt
                    </span>
                    <p className="text-[11px] text-neutral-600 max-w-sm mx-auto leading-relaxed">
                      Please prepare exactly <strong className="text-accent-red font-serif">{finalTotal.toLocaleString()} EGP</strong> to hand to the delivery courier. No extra administration or delivery collection fees apply.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-bold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-all duration-300 mt-6 shadow-md flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader size={16} className="animate-spin text-white" />
                      <span>Authorizing Egyptian Gateway...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Place Order ({finalTotal.toLocaleString()} EGP)</span>
                  )}
                </button>
              </motion.form>
            )}

            {/* Step 3: Success Confirmation */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
                id="receipt-success"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-50 text-black rounded-full shadow-inner">
                  <CheckCircle size={32} className="stroke-[1.5]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-light uppercase tracking-wide">Moviq Order Confirmed</h3>
                  <p className="text-xs text-neutral-500">
                    Thank you, {fullName || 'Valued Client'}. Your premium sneaker order is registered successfully.
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 p-6 text-left space-y-4">
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-2">
                    <span>Order Reference</span>
                    <span className="font-mono font-bold text-black">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-2">
                    <span>Courier Delivery Address</span>
                    <span className="font-semibold text-black text-right line-clamp-1">{address}, {city}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-neutral-500">
                    <span>Tracking Status</span>
                    <span className="text-emerald-600 font-bold uppercase tracking-widest text-[9.5px]">
                      Atelier Verification (Preparing)
                    </span>
                  </div>

                  {/* Order Progress Timeline */}
                  <div className="relative pl-6 pt-3 space-y-5 text-xs text-neutral-500 before:absolute before:left-2 before:top-4 before:bottom-2 before:w-[1px] before:bg-neutral-300">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-black ring-4 ring-black/10" />
                      <p className="font-bold text-black">Authenticity Verification &amp; Audit</p>
                      <span className="text-[10px] text-neutral-400">Moviq experts are verifying 100% authentic leather, stitching &amp; product tags</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-300" />
                      <p className="font-semibold text-neutral-400">Double-Box Premium Packing</p>
                      <span className="text-[10px] text-neutral-400">Premium double-box shielding to protect original sneaker box</span>
                    </div>
                    <div className="relative text-neutral-300">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-200" />
                      <p className="font-semibold">Express Domestic Dispatch</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCompleteAndClose}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs py-4.5 px-6 uppercase tracking-widest rounded-none transition-colors shadow-md cursor-pointer"
                >
                  Return To Sneaker Showcase
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Order Summary Panel (lg: 5 cols) */}
        <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 border-t lg:border-t-0 border-neutral-100 flex flex-col justify-between" id="checkout-summary-side">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-bold uppercase block mb-4">
              Your Selection ({cartItems.length})
            </span>

            {/* List of checkout items */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-center text-xs">
                  <div className="w-12 aspect-[3/4] bg-white border border-neutral-200 p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] tracking-wider text-neutral-400 uppercase font-bold block">
                      {item.product.brand}
                    </span>
                    <h4 className="font-semibold text-black line-clamp-1">{item.product.name}</h4>
                    <span className="text-neutral-500 text-[10px]">
                      {item.quantity} &times; {item.selectedSize} / {item.selectedColor.name}
                    </span>
                  </div>
                  <span className="font-bold font-serif text-black shrink-0">
                    {(item.product.salePrice * item.quantity).toLocaleString()} EGP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations footer */}
          <div className="border-t border-neutral-200 pt-6 mt-6 space-y-2.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Selection Subtotal</span>
              <span className="text-black font-bold">{subtotal.toLocaleString()} EGP</span>
            </div>
            {discountRate > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Moviq Promo Code {appliedCode && `(${appliedCode})`}</span>
                <span>-{discountAmount.toLocaleString()} EGP</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Premium Express Air Freight</span>
              <span className="text-black font-bold">
                {shippingCost === 0 ? 'Free' : `${shippingCost} EGP`}
              </span>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm text-black font-serif font-black uppercase">
              <span>Order Total</span>
              <span className="text-base text-accent-red">{finalTotal.toLocaleString()} EGP</span>
            </div>

            <div className="bg-white/80 p-3 border border-neutral-100 flex items-start gap-2.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider pt-4 mt-2">
              <ShieldCheck size={16} className="text-black shrink-0" />
              <span>Complimentary authenticity certification, original brand tags, and Moviq custom dust-bags included.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
