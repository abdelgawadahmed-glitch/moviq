import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShoppingBag, Truck, CheckCircle, ArrowLeft, Loader, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { useI18n } from '../lib/i18n';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountRate: number;
  appliedCode: string;
  onOrderSuccess: () => void;
}

const EGYPT_GOVERNORATES = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Qalyubia',
  'Dakahlia',
  'Gharbia',
  'Monufia',
  'Sharqia',
  'Beheira',
  'Damietta',
  'Port Said',
  'Ismailia',
  'Suez',
  'Kafr El Sheikh',
  'Fayoum',
  'Beni Suef',
  'Minya',
  'Assiut',
  'Sohag',
  'Qena',
  'Luxor',
  'Aswan',
  'Red Sea',
  'New Valley',
  'Matrouh',
  'North Sinai',
  'South Sinai'
];

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountRate,
  appliedCode,
  onOrderSuccess
}: CheckoutModalProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'mastercard' | 'meeza' | 'cod'>('visa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('Cairo');
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
      const generatedId = `MVQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      
      try {
        const savedOrdersStr = localStorage.getItem('moviq_orders');
        const savedOrders = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
        const newOrder = {
          id: generatedId,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          items: cartItems.map(item => ({
            productName: item.product.name,
            brand: item.product.brand,
            image: item.product.image,
            quantity: item.quantity,
            price: item.product.salePrice,
            size: item.selectedSize,
            color: item.selectedColor
          })),
          subtotal,
          discountAmount,
          shippingCost,
          finalTotal,
          paymentMethod,
          status: 'Pending Authenticity Audit',
          fullName,
          email,
          address,
          governorate,
          phone
        };
        savedOrders.unshift(newOrder);
        localStorage.setItem('moviq_orders', JSON.stringify(savedOrders));
      } catch (err) {
        console.error('Error saving order', err);
      }

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
    setGovernorate('Cairo');
    setZip('');
    setPhone('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" id="checkout-modal-container">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 cursor-pointer backdrop-blur-sm"
        onClick={step !== 3 ? onClose : undefined}
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className="relative bg-white text-black shadow-2xl w-full max-w-5xl rounded-none z-10 grid grid-cols-1 lg:grid-cols-12 max-h-[92vh] sm:max-h-[85vh] md:max-h-[90vh] overflow-hidden border border-neutral-100"
      >
        {/* Close button (disable during confirmation step or processing) */}
        {step !== 3 && !isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all rounded-full cursor-pointer"
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        )}

        {/* Left Side: Dynamic Form Panel (lg: 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 overflow-y-auto flex flex-col justify-between scrollbar-thin" id="checkout-form-side">
          {/* Progress Indicators */}
          {step !== 3 && (
            <div className="flex items-center gap-4 mb-6 text-[10px] uppercase tracking-[0.2em] font-extrabold text-neutral-400 border-b border-neutral-100 pb-4">
              <span className={step === 1 ? 'text-black font-black pb-1 border-b border-black' : 'text-neutral-500'}>
                {t("01. Shipping Information")}
              </span>
              <span className="h-[1px] w-6 bg-neutral-200" />
              <span className={step === 2 ? 'text-black font-black pb-1 border-b border-black' : 'text-neutral-500'}>
                {t("02. Luxury Payment")}
              </span>
              <span className="h-[1px] w-6 bg-neutral-200" />
              <span className="text-neutral-300">
                {t("03. Confirmation")}
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Shipping Form */}
            {step === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onSubmit={handleNextStep}
                className="space-y-4"
                id="shipping-form"
              >
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-black text-neutral-400 block">{t("Secure Atelier Order")}</span>
                  <h3 className="font-sans text-xl font-bold tracking-tight uppercase text-black">{t("Delivery Details")}</h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {t("Check out our luxury selection")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                      {t("Recipient Name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aly Ibrahim"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-medium text-black placeholder:text-neutral-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                      {t("Email Address")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aly.ibrahim@outlook.com"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-medium text-black placeholder:text-neutral-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                    {t("Delivery Address")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="15 El-Gezira St, Zamalek"
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-medium text-black placeholder:text-neutral-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Governorate Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                      {t("Governorate")} *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-semibold text-black appearance-none cursor-pointer"
                      >
                        {EGYPT_GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov}>
                            {t(gov)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                      {t("ZIP Code")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="11211"
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-medium text-black placeholder:text-neutral-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                    {t("Phone Number")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 123 4567"
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-medium text-black placeholder:text-neutral-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-850 text-white font-bold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-all duration-300 pt-4 mt-6 shadow-md cursor-pointer hover:tracking-[0.12em]"
                >
                  {t("Proceed to Payment")}
                </button>
              </motion.form>
            )}

            {/* Step 2: Payment Form */}
            {step === 2 && (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onSubmit={handlePlaceOrder}
                className="space-y-5"
                id="payment-form"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors rounded-full"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="space-y-0.5">
                    <h3 className="font-sans text-lg font-bold tracking-tight uppercase text-black">{t("Atelier Secure Payment")}</h3>
                    <p className="text-xs text-neutral-400 font-light">
                      {t("Select payment method")}
                    </p>
                  </div>
                </div>

                {/* Grid selection for 4 Payment Options */}
                <div className="grid grid-cols-2 gap-2 text-center text-[9px] uppercase font-extrabold tracking-widest">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('visa')}
                    className={`py-3 px-2 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'visa'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black bg-neutral-50'
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>{t("Visa")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mastercard')}
                    className={`py-3 px-2 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'mastercard'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black bg-neutral-50'
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>{t("MasterCard")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('meeza')}
                    className={`py-3 px-2 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'meeza'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black bg-neutral-50'
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>{t("Meeza")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-3 px-2 border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black bg-neutral-50'
                    }`}
                  >
                    <Truck size={13} />
                    <span>{t("Cash On Delivery")}</span>
                  </button>
                </div>

                {/* Credit Card Details Inputs */}
                {paymentMethod !== 'cod' && (
                  <div className="space-y-4 pt-2">
                    {/* Real-time Card Mockup Graphic */}
                    <div className={`w-full max-w-sm mx-auto aspect-[1.586/1] rounded-xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-500 bg-gradient-to-br ${
                      paymentMethod === 'visa' 
                        ? 'from-blue-900 via-indigo-900 to-slate-900' 
                        : paymentMethod === 'mastercard' 
                        ? 'from-neutral-900 via-stone-800 to-neutral-950' 
                        : 'from-emerald-900 via-teal-950 to-neutral-900'
                    }`}>
                      <div className="absolute right-6 top-6 flex flex-col items-end">
                        <span className="text-xs uppercase tracking-widest font-extrabold italic opacity-90">
                          {paymentMethod === 'visa' ? t("Visa") : paymentMethod === 'mastercard' ? t("MasterCard") : t("Meeza")}
                        </span>
                        <div className="flex gap-1.5 mt-1">
                          {paymentMethod === 'visa' && (
                            <div className="w-8 h-4 bg-white/20 rounded-xs flex items-center justify-center text-[7px] font-black italic">VISA</div>
                          )}
                          {paymentMethod === 'mastercard' && (
                            <div className="flex -space-x-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full opacity-90" />
                              <div className="w-4 h-4 bg-amber-500 rounded-full opacity-90" />
                            </div>
                          )}
                          {paymentMethod === 'meeza' && (
                            <div className="w-10 h-4 bg-emerald-500/30 border border-emerald-500/50 rounded-xs flex items-center justify-center text-[6.5px] font-black tracking-widest text-emerald-300">MEEZA</div>
                          )}
                        </div>
                      </div>

                      {/* Chip */}
                      <div className="w-10 h-7 bg-amber-300/60 rounded-md border border-amber-400/30 flex items-center justify-center p-1">
                        <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-60">
                          <div className="border border-amber-500/30" />
                          <div className="border border-amber-500/30" />
                          <div className="border border-amber-500/30" />
                        </div>
                      </div>

                      {/* Number */}
                      <div className="text-lg font-mono tracking-[0.12em] font-bold text-center py-2 text-shadow-sm">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[7px] uppercase tracking-wider text-neutral-400 block">{t("Cardholder Name")}</span>
                          <span className="text-[11px] font-mono tracking-wider font-semibold uppercase line-clamp-1 max-w-[150px]">
                            {cardName || 'Aly Ibrahim'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[7px] uppercase tracking-wider text-neutral-400 block">{t("Expiry Date")}</span>
                          <span className="text-xs font-mono font-bold tracking-widest">
                            {cardExpiry || 'MM/YY'}
                          </span>
                        </div>
                        <div className="text-right pl-3">
                          <span className="text-[7px] uppercase tracking-wider text-neutral-400 block">{t("CVV")}</span>
                          <span className="text-xs font-mono font-bold">
                            {cardCvv ? '•••' : '•••'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      <div className="space-y-1">
                        <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                          {t("Cardholder Name")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Aly Ibrahim"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-4 outline-none rounded-none font-semibold uppercase text-black"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                          {t("Card Number")} *
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
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-4 outline-none rounded-none font-mono font-bold text-black"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                            {t("Expiry Date")} *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) {
                                val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                              }
                              setCardExpiry(val);
                            }}
                            placeholder="12/28"
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-4 outline-none rounded-none font-mono font-bold text-black"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                            {t("CVV")} *
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-4 outline-none rounded-none font-mono font-bold text-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cash On Delivery Option Details */}
                {paymentMethod === 'cod' && (
                  <div className="bg-neutral-50 p-6 border border-neutral-200 text-center py-8 space-y-4 rounded-none">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full mx-auto shadow-sm">
                      <Truck size={20} />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-black uppercase tracking-widest block">
                        {t("Cash On Delivery")}
                      </span>
                      <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed font-light">
                        {t("Cash On Delivery")}: <strong className="text-neutral-900 font-semibold font-mono">{finalTotal.toLocaleString()} {t("EGP")}</strong>
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black hover:bg-neutral-850 disabled:bg-neutral-400 text-white font-bold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-all duration-300 mt-6 shadow-md flex items-center justify-center gap-3 cursor-pointer hover:tracking-[0.12em]"
                >
                  {isProcessing ? (
                    <>
                      <Loader size={15} className="animate-spin text-white" />
                      <span>{t("Authorizing Secure Gateway...")}</span>
                    </>
                  ) : (
                    <span>{t("Place Order")} ({finalTotal.toLocaleString()} {t("EGP")})</span>
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
                className="text-center py-4 space-y-5"
                id="receipt-success"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 text-white rounded-full shadow-inner relative">
                  <CheckCircle size={24} />
                  <span className="absolute -top-1 -right-1 text-amber-400">
                    <Sparkles size={14} className="animate-pulse" />
                  </span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-black text-emerald-600">{t("Verification Pending") || "Verification Pending"}</span>
                  <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-neutral-950">{t("Atelier Order Confirmed")}</h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
                    {t("A confirmation transmission has been sent. Welcome to the Syndicate.")}
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 p-5 text-left space-y-3.5 rounded-none text-xs">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-200/40 pb-2">
                    <span>{t("Order Reference")}</span>
                    <span className="font-mono font-bold text-black">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-200/40 pb-2">
                    <span>{t("Governorate")}</span>
                    <span className="font-semibold text-black">{t(governorate)}</span>
                  </div>
                  <div className="flex justify-between items-start text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-200/40 pb-2">
                    <span>{t("Delivery Address")}</span>
                    <span className="font-semibold text-black text-right line-clamp-1 max-w-[200px]">{address}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-neutral-500">
                    <span>{t("Tracking Status")}</span>
                    <span className="text-emerald-700 font-extrabold uppercase tracking-widest text-[8.5px] bg-emerald-50 px-2 py-0.5 border border-emerald-100">
                      {t("Preparing Authenticity Audit") || "Preparing Authenticity Audit"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCompleteAndClose}
                  className="w-full bg-black hover:bg-neutral-850 text-white font-bold text-xs py-4 px-6 uppercase tracking-widest rounded-none transition-colors shadow-md cursor-pointer hover:tracking-[0.12em]"
                >
                  {t("Return to Catalog")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Order Summary Panel (lg: 5 cols) */}
        <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-neutral-100 flex flex-col justify-between" id="checkout-summary-side">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5 mb-4">
              <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-bold uppercase block">
                {t("Order Summary")}
              </span>
              <span className="text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 font-bold rounded-full font-mono">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} {t("Items")}
              </span>
            </div>

            {/* List of checkout items with scrollbar */}
            <div className="space-y-4 max-h-[220px] sm:max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-center text-xs group">
                  <div className="w-14 aspect-[3/4] bg-white border border-neutral-200 p-1 shrink-0 overflow-hidden flex items-center justify-center relative">
                    <img src={item.product.image} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] tracking-wider text-neutral-400 uppercase font-black block">
                      {t(item.product.brand)}
                    </span>
                    <h4 className="font-bold text-neutral-900 line-clamp-1 text-xs">{t(item.product.name)}</h4>
                    <span className="text-neutral-500 text-[10px] font-medium block mt-0.5">
                      {t("Quantity")}: {item.quantity} &bull; {t("Sizes")}: {item.selectedSize} &bull; {t(item.selectedColor.name)}
                    </span>
                  </div>
                  <span className="font-bold font-sans text-neutral-900 shrink-0">
                    {(item.product.salePrice * item.quantity).toLocaleString()} {t("EGP")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations footer */}
          <div className="border-t border-neutral-200 pt-5 mt-5 space-y-3 text-xs text-neutral-600">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t("Subtotal")}</span>
              <span className="text-neutral-900 font-bold">{subtotal.toLocaleString()} {t("EGP")}</span>
            </div>
            {discountRate > 0 && (
              <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2.5 py-1.5 border border-emerald-100 font-semibold rounded-xs">
                <span>{t("Code applied!")} {appliedCode && `(${appliedCode})`}</span>
                <span>-{discountAmount.toLocaleString()} {t("EGP")}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-medium">{t("Shipping")}</span>
              <span className="text-neutral-900 font-bold">
                {shippingCost === 0 ? t("Free Shipping") : `${shippingCost} ${t("EGP")}`}
              </span>
            </div>

            <div className="border-t border-neutral-200 pt-3.5 flex justify-between items-baseline text-black uppercase">
              <span className="font-sans text-xs font-bold tracking-widest">{t("Total")}</span>
              <span className="text-lg font-bold text-neutral-950 font-mono">
                {finalTotal.toLocaleString()} <span className="text-xs font-semibold">{t("EGP")}</span>
              </span>
            </div>

            <div className="bg-white p-3.5 border border-neutral-200/60 flex items-start gap-2.5 text-[9px] text-neutral-400 font-semibold uppercase tracking-wider pt-3 rounded-xs mt-3">
              <ShieldCheck size={14} className="text-neutral-800 shrink-0 mt-0.5" />
              <span>{t("Secure SSL encrypted gateway")}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
