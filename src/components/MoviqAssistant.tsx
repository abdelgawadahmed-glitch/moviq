import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Send, X, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
// @ts-ignore
import mascotSheet from '../assets/images/moviq_mascot_sheet_15pose_1784494483953.jpg';

type MascotState =
  | 'idle'
  | 'welcome'
  | 'pointing'
  | 'thinking'
  | 'celebration'
  | 'heart'
  | 'happy'
  | 'excited'
  | 'sleeping'
  | 'look-left'
  | 'look-right'
  | 'surprised'
  | 'thumbs-up'
  | 'shopping'
  | 'waiting';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const HOMEPAGE_MESSAGES = [
  "Welcome to MOVIQ 👋",
  "Discover authentic sneakers.",
  "Need help choosing?",
  "Today's best deals are waiting."
];

// Map mascot states to CSS sprite background-positions (5x3 grid)
const getSpritePosition = (state: MascotState) => {
  switch (state) {
    case 'idle':
      return '0% 0%';          // 01 - Idle
    case 'welcome':
      return '25% 0%';         // 02 - Welcome
    case 'pointing':
      return '50% 0%';         // 03 - Pointing
    case 'thinking':
      return '75% 0%';         // 04 - Thinking
    case 'celebration':
      return '100% 0%';        // 05 - Celebration
    case 'heart':
      return '0% 50%';         // 06 - Heart
    case 'happy':
      return '25% 50%';        // 07 - Happy
    case 'excited':
      return '50% 50%';        // 08 - Excited
    case 'sleeping':
      return '75% 50%';        // 09 - Sleeping
    case 'look-left':
      return '100% 50%';       // 10 - Look Left
    case 'look-right':
      return '0% 100%';        // 11 - Look Right
    case 'surprised':
      return '25% 100%';       // 12 - Surprised
    case 'thumbs-up':
      return '50% 100%';       // 13 - Thumbs Up
    case 'shopping':
      return '75% 100%';       // 14 - Shopping
    case 'waiting':
      return '100% 100%';      // 15 - Waiting
    default:
      return '0% 0%';
  }
};

export default function MoviqAssistant() {
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Chat panel state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Welcome to the MOVIQ Atelier. I am your luxury concierge. How can I assist you with your sneaker selection today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const lastMessageTime = useRef<number>(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoveredCardIdRef = useRef<string | null>(null);
  const wasCheckoutOpen = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- EYE TRACKING & 3D PARALLAX SPRINGS ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Translate background slightly to make eyes look towards cursor (parallax eye-movement)
  const bgShiftX = useTransform(smoothX, [-0.5, 0.5], [-2.5, 2.5]);
  const bgShiftY = useTransform(smoothY, [-0.5, 0.5], [-2.5, 2.5]);

  // Translate container to pull slightly towards the mouse (magnetic pull)
  const pullX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const pullY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  // 3D Perspective tilt angles
  const tiltX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const tiltY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Track cursor location relative to the mascot
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('moviq-assistant-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - mascotCenterX;
      const dy = e.clientY - mascotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxDistance = 600;
      if (distance < maxDistance) {
        const influence = (maxDistance - distance) / maxDistance;
        mouseX.set((dx / maxDistance) * influence);
        mouseY.set((dy / maxDistance) * influence);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Automatic random blinking
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
      const nextDelay = 2200 + Math.random() * 4000;
      timer = setTimeout(triggerBlink, nextDelay);
    };
    timer = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Helper to trigger custom action states with automated self-hiding bubbles
  const triggerActionState = (state: MascotState, text: string, bypassThrottle = true, durationMs = 4000) => {
    // If chatbot is open, log the speech bubble to the chat logs and update state instead of showing annoying popup bubbles
    if (isOpen) {
      setMascotState(state);
      return;
    }

    // If not bypassing the 30-second throttle, check time constraint
    if (!bypassThrottle && Date.now() - lastMessageTime.current < 30000) {
      return;
    }

    setMascotState(state);
    setSpeechBubble(text);
    lastMessageTime.current = Date.now();

    // Automatically hide messages after durationMs
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setSpeechBubble(null);
      setMascotState('idle');
    }, durationMs);
  };

  // 1. Lazy load check & mounting
  useEffect(() => {
    const img = new Image();
    img.src = mascotSheet;
    img.onload = () => {
      setTimeout(() => setIsLoaded(true), 600);
    };
  }, []);

  // 2. LocalStorage Cart & Wishlist Add Interceptor
  useEffect(() => {
    const originalSetItem = localStorage.setItem;

    let lastCartStr = localStorage.getItem('moviq_cart');
    let lastTotalQty = 0;
    try {
      const cart = lastCartStr ? JSON.parse(lastCartStr) : [];
      lastTotalQty = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    } catch (e) {}

    let lastWishlistStr = localStorage.getItem('moviq_wishlist');
    let lastWishlistLength = 0;
    try {
      const wishlist = lastWishlistStr ? JSON.parse(lastWishlistStr) : [];
      lastWishlistLength = wishlist.length;
    } catch (e) {}

    localStorage.setItem = function (key: string, value: string) {
      if (key === 'moviq_cart') {
        try {
          const newCart = JSON.parse(value);
          const newTotalQty = newCart.reduce((acc: number, item: any) => acc + item.quantity, 0);

          if (newTotalQty > lastTotalQty) {
            triggerActionState('celebration', "Excellent choice!\nAdded successfully!", true, 3000);
            if (isOpen) {
              setMessages(prev => [
                ...prev,
                {
                  id: `cart-add-${Date.now()}`,
                  sender: 'assistant',
                  text: "Excellent choice! You have successfully added that premium pair to your bag. Ready to checkout?",
                  timestamp: new Date()
                }
              ]);
            }
          }
          lastTotalQty = newTotalQty;
        } catch (e) {}
      }

      if (key === 'moviq_wishlist') {
        try {
          const newWishlist = JSON.parse(value);
          const newLength = newWishlist.length;

          if (newLength > lastWishlistLength) {
            triggerActionState('heart', "Added to your favorites! ❤️", true);
            if (isOpen) {
              setMessages(prev => [
                ...prev,
                {
                  id: `wish-add-${Date.now()}`,
                  sender: 'assistant',
                  text: "Excellent choice! I've saved that masterpiece directly to your personal wishlist.",
                  timestamp: new Date()
                }
              ]);
            }
          }
          lastWishlistLength = newLength;
        } catch (e) {}
      }

      originalSetItem.apply(this, [key, value]);
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, [isOpen]);

  // 3. Dynamic DOM Mutation Observer to detect Checkout opening instantly
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isCheckout = !!document.getElementById('checkout-modal-container');

      if (isCheckout && !wasCheckoutOpen.current) {
        wasCheckoutOpen.current = true;
        const checkoutMessages = ["You're almost done.", "Fast delivery across Egypt."];
        const msg = checkoutMessages[Math.floor(Math.random() * checkoutMessages.length)];
        triggerActionState('thinking', msg, true);
        if (isOpen) {
          setMessages(prev => [
            ...prev,
            {
              id: `checkout-msg-${Date.now()}`,
              sender: 'assistant',
              text: "You are on the checkout desk. We offer cash on delivery and secure online card transactions across all Egypt governorates with premium, custom monogram packaging.",
              timestamp: new Date()
            }
          ]);
        }
      } else if (!isCheckout) {
        wasCheckoutOpen.current = false;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isOpen]);

  // 4. Product Card Hover Listeners
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('[id^="product-card-"]');
      if (card) {
        const cardId = card.id;
        if (hoveredCardIdRef.current !== cardId) {
          hoveredCardIdRef.current = cardId;

          const productMessages = [
            "🔥 Trending",
            "⭐ Best Seller",
            "💎 Excellent Choice",
            "❤️ Staff Favorite"
          ];

          const msg = productMessages[Math.floor(Math.random() * productMessages.length)];
          triggerActionState('pointing', msg, true);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('[id^="product-card-"]');
      if (card) {
        const related = e.relatedTarget as HTMLElement;
        if (!related || !related.closest('[id^="product-card-"]')) {
          hoveredCardIdRef.current = null;
          if (!isOpen) {
            setMascotState('idle');
            setSpeechBubble(null);
          }
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isOpen]);

  // 5. Background speech and scheduling
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      const isHomepage = !!document.getElementById('homepage-custom-view');
      const isCheckout = !!document.getElementById('checkout-modal-container');

      if (isCheckout) {
        triggerActionState('thinking', "You're almost done.", false);
      } else if (isHomepage) {
        triggerActionState('welcome', "Welcome to MOVIQ 👋", false);
      } else {
        triggerActionState('idle', "Discover authentic sneakers.", false);
      }
    }, 2200);

    const interval = setInterval(() => {
      if (isOpen) return; // Halt background popups if the interactive chatbot is open

      const isHomepage = !!document.getElementById('homepage-custom-view');
      const isCheckout = !!document.getElementById('checkout-modal-container');

      if (isCheckout) {
        const checkoutMessages = ["You're almost done.", "Fast delivery across Egypt."];
        const msg = checkoutMessages[Math.floor(Math.random() * checkoutMessages.length)];
        triggerActionState('thinking', msg, false);
      } else if (isHomepage) {
        const randomMsg = HOMEPAGE_MESSAGES[Math.floor(Math.random() * HOMEPAGE_MESSAGES.length)];
        const pose = randomMsg.includes("Welcome") ? 'welcome' : randomMsg.includes("help") ? 'thinking' : 'idle';
        triggerActionState(pose, randomMsg, false);
      } else {
        const generalMessages = [
          "Discover authentic sneakers.",
          "Need help choosing?",
          "Today's best deals are waiting."
        ];
        const randomMsg = generalMessages[Math.floor(Math.random() * generalMessages.length)];
        const pose = randomMsg.includes("help") ? 'thinking' : 'idle';
        triggerActionState(pose, randomMsg, false);
      }
    }, 30000);

    return () => {
      clearTimeout(welcomeTimer);
      clearInterval(interval);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isOpen]);

  const handleMascotClick = () => {
    setIsOpen(!isOpen);
    setSpeechBubble(null);
    setMascotState('welcome');
  };

  // Concierge responses engine
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setMascotState('thinking');
    setIsTyping(true);

    // Context reply engine
    setTimeout(() => {
      const query = userText.toLowerCase();
      let responseText = "";
      let responsePose: MascotState = 'thumbs-up';

      if (query.includes('authentic') || query.includes('fake') || query.includes('original') || query.includes('legit')) {
        responseText = "Rest assured! At MOVIQ, authenticity is our golden standard. Every single pair is checked by our expert procurement authenticators and comes with our custom, tamper-proof MOVIQ physical verification tag. We offer a 100% money-back guarantee.";
        responsePose = 'happy';
      } else if (query.includes('shipping') || query.includes('delivery') || query.includes('egypt') || query.includes('cairo') || query.includes('alexandria') || query.includes('arrive')) {
        responseText = "We provide white-glove, secure hand-delivered shipping to all governorates in Egypt! Deliveries to Cairo, Giza, and New Cairo arrive in 2-3 business days, while Alexandria and other governorates take 3-5 business days. Premium shipping is completely free.";
        responsePose = 'welcome';
      } else if (query.includes('return') || query.includes('exchange') || query.includes('refund')) {
        responseText = "We offer a flawless 30-day returns and size exchange policy! The pair must be returned unworn in original brand packaging with the MOVIQ verification tag completely intact. Just click our service chat or reach out to arrange a complimentary return courier.";
        responsePose = 'shopping';
      } else if (query.includes('brand') || query.includes('nike') || query.includes('adidas') || query.includes('jordan') || query.includes('balance') || query.includes('balenciaga') || query.includes('dior')) {
        responseText = "We curate elite models from Nike, Air Jordan, Adidas, New Balance, Balenciaga, and Dior. If you're looking for a specific premium drop, let me know! You can also click brand tags above to filter selections instantly.";
        responsePose = 'pointing';
      } else if (query.includes('size') || query.includes('sizing') || query.includes('fit') || query.includes('tight')) {
        responseText = "Most luxury silhouettes fit true-to-size. However, Jordan retro releases have structural high-tops that feel slightly snug, and Balenciaga models typically fit oversized (we suggest sizing down). Let me know the exact sneaker you are considering!";
        responsePose = 'thinking';
      } else if (query.includes('price') || query.includes('cost') || query.includes('egp') || query.includes('discount')) {
        responseText = "All our pricing is transparently listed in Egyptian Pounds (EGP). We run exclusive seasonal offers and markdown drops which are already calculated in the product cards. Checkout now to capture these allocations!";
        responsePose = 'excited';
      } else {
        responseText = "I'm on it! As your private MOVIQ concierge, I can assist you with sneaker authentications, custom Egyptian courier tracking, sizing, or finding the hottest trending grails. Tell me what color or style you're matching!";
        responsePose = 'idle';
      }

      setMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'assistant',
          text: responseText,
          timestamp: new Date()
        }
      ]);
      setMascotState(responsePose);
      setIsTyping(false);
    }, 1200);
  };

  if (!isLoaded) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none"
      id="moviq-assistant-container"
    >
      {/* 1. INTERACTIVE CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="mb-4 mr-2 bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-3xl p-5 w-[340px] sm:w-[380px] h-[480px] flex flex-col justify-between shadow-[0_24px_50px_rgba(0,0,0,0.6)] pointer-events-auto"
            id="moviq-assistant-chat-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-bold tracking-wide text-white uppercase">
                    MOVIQ Assistant
                  </h3>
                  <p className="text-[9px] text-neutral-500 tracking-wider uppercase">
                    Elite Sneaker Concierge
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 my-4 overflow-y-auto pr-1 space-y-4 custom-scrollbar text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed font-light tracking-wide ${
                      msg.sender === 'user'
                        ? 'bg-white text-black rounded-tr-none'
                        : 'bg-neutral-900 text-neutral-200 border border-neutral-800/60 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8.5px] text-neutral-500 mt-1 uppercase tracking-wider">
                    {msg.sender === 'user' ? 'You' : 'MOVIQ Concierge'}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-neutral-900 text-neutral-400 border border-neutral-800/60 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-neutral-900">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about authentic items, Egypt shipping..."
                className="flex-grow bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 text-xs py-3 px-4 rounded-xl font-light tracking-wide"
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-200 text-black p-3 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                aria-label="Send Message"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SPEECH BUBBLE FOR BACKGROUND PROMPTS */}
      <AnimatePresence>
        {speechBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="absolute bottom-full mb-4 right-2 bg-white/95 backdrop-blur-md text-black border border-neutral-200/50 px-4.5 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.15)] rounded-2xl pointer-events-auto max-w-[240px] select-none text-left"
            id="moviq-speech-bubble"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-lg bg-black flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-900 leading-snug whitespace-pre-line">
                {speechBubble}
              </p>
            </div>
            {/* Small speech tail */}
            <div className="absolute top-full right-8 w-3 h-3 bg-white/95 border-r border-b border-neutral-200/50 rotate-45 -translate-y-[6px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. DYNAMIC FLOATING/BREATHING ASSISTANT CONTAINER */}
      <motion.div
        className="pointer-events-auto flex flex-col items-end relative"
        style={{
          x: pullX,
          y: pullY,
        }}
      >
        <motion.button
          onClick={handleMascotClick}
          className="relative w-[72px] h-[72px] sm:w-[82px] sm:h-[82px] lg:w-[92px] lg:h-[92px] bg-transparent flex items-center justify-center outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer border-none select-none rounded-full"
          aria-label="Interact with MOVIQ Assistant"
          style={{
            WebkitTapHighlightColor: 'transparent',
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
            perspective: 800,
          }}
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.025, 1],
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
        >
          {/* Subtle soft glowing aura */}
          <motion.div
            className="absolute inset-2 bg-neutral-200/20 blur-xl rounded-full -z-20"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Left Wing (Sleek Silver/Gold Dual Tone) */}
          <motion.svg
            className="absolute right-[65%] top-[12%] w-[45%] h-[45%] pointer-events-none -z-10 overflow-visible"
            viewBox="0 0 100 100"
            style={{ originX: '85%', originY: '75%' }}
            animate={{
              rotate: [-4, 8, -4],
              y: [0, -1, 0]
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              d="M 85,75 C 50,45 20,60 10,85 C 35,90 60,82 85,75 Z"
              fill="url(#silverGradMascot)"
              stroke="#D1D5DB"
              strokeWidth="0.75"
            />
            <path
              d="M 78,73 C 45,52 30,68 20,90 C 40,90 60,82 78,73 Z"
              fill="url(#goldGradMascot)"
              opacity="0.8"
            />
          </motion.svg>

          {/* Right Wing */}
          <motion.svg
            className="absolute left-[65%] top-[12%] w-[45%] h-[45%] pointer-events-none -z-10 overflow-visible"
            viewBox="0 0 100 100"
            style={{ originX: '15%', originY: '75%' }}
            animate={{
              rotate: [4, -8, 4],
              y: [0, -1, 0]
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              d="M 15,75 C 50,45 80,60 90,85 C 65,90 40,82 15,75 Z"
              fill="url(#silverGradMascot)"
              stroke="#D1D5DB"
              strokeWidth="0.75"
            />
            <path
              d="M 22,73 C 55,52 70,68 80,90 C 60,90 40,82 22,73 Z"
              fill="url(#goldGradMascot)"
              opacity="0.8"
            />
          </motion.svg>

          {/* Sprite Poses with Framer Motion transitions */}
          <div className="w-[88%] h-[88%] flex items-center justify-center relative overflow-hidden bg-black shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-neutral-800 rounded-full">
            <AnimatePresence>
              <motion.div
                key={mascotState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-no-repeat rounded-full animate-none"
                style={{
                  backgroundImage: `url(${mascotSheet})`,
                  backgroundSize: '500% 300%',
                  backgroundPosition: getSpritePosition(mascotState),
                  x: bgShiftX,
                  y: bgShiftY,
                }}
              />
            </AnimatePresence>

            {/* Eyelids for blinking - locked to the gaze tracking translation */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-20 animate-none"
              style={{
                x: bgShiftX,
                y: bgShiftY,
              }}
            >
              {/* Left lid */}
              <motion.div
                className="absolute w-[11%] h-[11%] bg-white rounded-full border-t border-neutral-100"
                style={{
                  left: '42%',
                  top: '38.5%',
                  transformOrigin: 'top',
                }}
                animate={{
                  scaleY: isBlinking ? 1 : 0,
                }}
                transition={{
                  duration: 0.08,
                  ease: 'easeInOut',
                }}
              />
              {/* Right lid */}
              <motion.div
                className="absolute w-[11%] h-[11%] bg-white rounded-full border-t border-neutral-100"
                style={{
                  left: '55.5%',
                  top: '38.5%',
                  transformOrigin: 'top',
                }}
                animate={{
                  scaleY: isBlinking ? 1 : 0,
                }}
                transition={{
                  duration: 0.08,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* Embedded Global Gradient Definitions */}
      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <linearGradient id="goldGradMascot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F3E5AB" />
            <stop offset="100%" stopColor="#AA7C11" />
          </linearGradient>
          <linearGradient id="silverGradMascot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

