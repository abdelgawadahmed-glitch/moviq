import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles } from 'lucide-react';
// @ts-ignore
import mascotSheet from '../assets/images/moviq_mascot_sheet_1784491257940.jpg';

type MascotState = 'idle' | 'welcome' | 'pointing' | 'thinking' | 'celebration' | 'heart';

const HOMEPAGE_MESSAGES = [
  "Welcome to MOVIQ 👋",
  "Discover authentic sneakers.",
  "Need help choosing?",
  "Today's best deals are waiting."
];

// Map mascot states to CSS sprite background-positions (3x3 grid)
const getSpritePosition = (state: MascotState) => {
  switch (state) {
    case 'idle':
      return '0% 0%';         // Row 1, Col 1
    case 'welcome':
      return '50% 0%';        // Row 1, Col 2
    case 'pointing':
      return '100% 0%';       // Row 1, Col 3
    case 'thinking':
      return '0% 50%';        // Row 2, Col 1
    case 'celebration':
      return '50% 50%';       // Row 2, Col 2
    case 'heart':
      return '100% 50%';      // Row 2, Col 3
    default:
      return '0% 0%';
  }
};

export default function MoviqAssistant() {
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const lastMessageTime = useRef<number>(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stateResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoveredCardIdRef = useRef<string | null>(null);
  const wasCheckoutOpen = useRef<boolean>(false);

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
      // Revert back to idle after the speech bubble hides
      setMascotState('idle');
    }, durationMs);
  };

  // 1. Lazy load check & mounting to protect initial page speed
  useEffect(() => {
    const img = new Image();
    img.src = mascotSheet;
    img.onload = () => {
      // Small delay for buttery smooth entryway
      setTimeout(() => setIsLoaded(true), 600);
    };
  }, []);

  // 2. LocalStorage Cart & Wishlist Add Interceptor (zero modifications to other files)
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
          }
          lastWishlistLength = newLength;
        } catch (e) {}
      }

      originalSetItem.apply(this, [key, value]);
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // 3. Dynamic DOM Mutation Observer to detect Checkout opening instantly
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isCheckout = !!document.getElementById('checkout-modal-container');

      if (isCheckout && !wasCheckoutOpen.current) {
        wasCheckoutOpen.current = true;
        const checkoutMessages = ["You're almost done.", "Fast delivery across Egypt."];
        const msg = checkoutMessages[Math.floor(Math.random() * checkoutMessages.length)];
        triggerActionState('thinking', msg, true);
      } else if (!isCheckout) {
        wasCheckoutOpen.current = false;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

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
          setMascotState('idle');
          setSpeechBubble(null);
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // 5. Background automated scheduling and 30s throttle
  useEffect(() => {
    // Initial friendly greeting shortly after landing
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

    // Dynamic scheduling every 30 seconds
    const interval = setInterval(() => {
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
  }, []);

  // Click handler to cycle thoughts on interaction
  const handleMascotClick = () => {
    const isHomepage = !!document.getElementById('homepage-custom-view');
    const messages = isHomepage ? HOMEPAGE_MESSAGES : ["Discover authentic sneakers.", "Need help choosing?", "Couture kicks await!"];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const pose = msg.includes("Welcome") ? 'welcome' : msg.includes("help") ? 'thinking' : 'idle';
    triggerActionState(pose, msg, true);
  };

  if (!isLoaded) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none"
      id="moviq-assistant-container"
    >
      {/* 1. LUXURY GLASS SPEECH BUBBLE */}
      <AnimatePresence>
        {speechBubble && (
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

      {/* 2. DYNAMIC FLOATING/BREATHING ASSISTANT CONTAINER */}
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

          {/* Left Wing */}
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
              fill="url(#goldGradMascot)"
              stroke="#8B6508"
              strokeWidth="1"
            />
            <path
              d="M 78,73 C 45,52 30,68 20,90 C 40,90 60,82 78,73 Z"
              fill="#f3e5ab"
              opacity="0.85"
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
              fill="url(#goldGradMascot)"
              stroke="#8B6508"
              strokeWidth="1"
            />
            <path
              d="M 22,73 C 55,52 70,68 80,90 C 60,90 40,82 22,73 Z"
              fill="#f3e5ab"
              opacity="0.85"
            />
          </motion.svg>

          {/* Sprite Poses with Framer Motion transitions */}
          <div className="w-[88%] h-[88%] flex items-center justify-center relative overflow-hidden bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-neutral-100 rounded-full">
            <AnimatePresence>
              <motion.div
                key={mascotState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-no-repeat rounded-full"
                style={{
                  backgroundImage: `url(${mascotSheet})`,
                  backgroundSize: '300% 300%',
                  backgroundPosition: getSpritePosition(mascotState),
                  x: bgShiftX,
                  y: bgShiftY,
                }}
              />
            </AnimatePresence>

            {/* Eyelids for blinking - locked to the gaze tracking translation */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"
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
        </defs>
      </svg>
    </div>
  );
}

