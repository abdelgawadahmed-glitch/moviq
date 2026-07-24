import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, ShoppingBag, Box, Users, ShieldAlert, Tag, BarChart3, 
  DollarSign, Package, Calendar, Search, Filter, Plus, Edit3, Trash2, 
  Check, X, RefreshCw, Star, ArrowUpRight, ArrowDownRight, Award, 
  MapPin, Eye, Phone, ChevronRight, Sparkles, Sliders, PlayCircle
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Product } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface SavedOrder {
  id: string;
  date: string;
  items: {
    productName: string;
    brand: string;
    image: string;
    quantity: number;
    price: number;
    size: string;
    color: { name: string; hex: string };
  }[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  finalTotal: number;
  paymentMethod: 'visa' | 'mastercard' | 'meeza' | 'cod';
  status: string;
  fullName: string;
  email: string;
  address: string;
  governorate: string;
  phone: string;
}

interface AdminDiscountCode {
  code: string;
  discountRate: number; // e.g. 0.15 for 15%
  type: 'percentage' | 'fixed';
  minSpend: number;
  status: 'active' | 'inactive';
  usageCount: number;
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Platine Ambassador' | 'VIP Club Member' | 'Atelier Enthusiast';
  memberSince: string;
  totalSpent: number;
  ordersCount: number;
}

const MASCOT_POSES = [
  {
    id: 1,
    name: "Welcome Pose",
    description: "Friendly greeting wave with a warm inviting smile, introducing MOVIQ.",
    image: "/src/assets/images/moviq_welcome_1784469579694.jpg"
  },
  {
    id: 2,
    name: "Happy Smiling Pose",
    description: "Broad cheerful smile with eyes closed, expressing high-fashion satisfaction.",
    image: "/src/assets/images/moviq_happy_1784469599622.jpg"
  },
  {
    id: 3,
    name: "Thinking Pose",
    description: "Paw on chin, head tilted, looking up thoughtfully with a tiny glowing golden dot.",
    image: "/src/assets/images/moviq_thinking_1784469611990.jpg"
  },
  {
    id: 4,
    name: "Shopping Assistant Pose",
    description: "Proudly holding and presenting a luxury custom shoe box.",
    image: "/src/assets/images/moviq_shopping_1784469622342.jpg"
  },
  {
    id: 5,
    name: "Loading Animation Pose",
    description: "Floating inside a clean circle of glowing white dynamic loading lines.",
    image: "/src/assets/images/moviq_loading_1784469633154.jpg"
  },
  {
    id: 6,
    name: "Success Celebration Pose",
    description: "Jumping high in victory with wings wide open, surrounded by flying gold confetti.",
    image: "/src/assets/images/moviq_success_1784469649064.jpg"
  },
  {
    id: 7,
    name: "Error / Help Pose",
    description: "Slightly puzzled look, scratching head, looking with a supportive expression.",
    image: "/src/assets/images/moviq_error_1784469668612.jpg"
  },
  {
    id: 8,
    name: "Explaining Pose",
    description: "Presenting with polite open paws, demonstrating concierge details.",
    image: "/src/assets/images/moviq_explaining_1784469682249.jpg"
  },
  {
    id: 9,
    name: "Pointing Pose",
    description: "Pointing paws directly to the side, highlighting recommendations.",
    image: "/src/assets/images/moviq_pointing_1784469695805.jpg"
  },
  {
    id: 10,
    name: "Holding MOVIQ Logo",
    description: "Majestically holding a solid gold plaque embossed with the 'MOVIQ' logo.",
    image: "/src/assets/images/moviq_logo_1784469710465.jpg"
  },
  {
    id: 11,
    name: "Sitting Pose",
    description: "Relaxed on a white custom studio pedestal with tail wrapped neatly.",
    image: "/src/assets/images/moviq_sitting_1784469723110.jpg"
  },
  {
    id: 12,
    name: "Hero Marketing Pose",
    description: "Epic dynamic flying pose with wings spread fully and soft luxury golden aura.",
    image: "/src/assets/images/moviq_hero_1784469735754.jpg"
  }
];


export default function AdminDashboard({
  onClose,
  products,
  setProducts
}: AdminDashboardProps) {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('moviq_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_USERNAME = (import.meta as any).env?.VITE_ADMIN_USERNAME || 'Moviq22';
    const ADMIN_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'Moviq2026';

    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('moviq_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('moviq_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    onClose(); // Automatically exit the admin workspace back to the public catalog
  };

  // Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers' | 'inventory' | 'discounts' | 'analytics' | 'brand' | 'pending-imports'>('overview');

  // --- STATE MANAGERS ---
  const [adminOrders, setAdminOrders] = useState<SavedOrder[]>([]);
  const [discountCodes, setDiscountCodes] = useState<AdminDiscountCode[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [orderQuery, setOrderQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [customerQuery, setCustomerQuery] = useState('');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);

  // Product CRUD States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    brand: '',
    name: '',
    image: '',
    category: 'Sneakers',
    originalPrice: 12000,
    salePrice: 10800,
    discount: 10,
    description: '',
    sizes: '40,41,42,43,44',
    colors: 'Black:#000000,White:#ffffff',
    details: 'Handcrafted luxury leather, Designed in Italy, Limited edition capsule release',
    isNew: true,
    isBestSeller: false,
    isLuxury: true
  });

  // Discount Code Form States
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    code: '',
    discountRate: 15,
    minSpend: 0,
    status: 'active' as 'active' | 'inactive'
  });

  // Success messaging triggers
  const [actionSuccess, setActionSuccess] = useState('');

  // --- TELEGRAM WEBHOOK & BOT STATES ---
  const [telegramConfig, setTelegramConfig] = useState<{
    isConfigured: boolean;
    botTokenMasked: string;
    webhookUrl: string;
    autoPublish: boolean;
  }>({
    isConfigured: false,
    botTokenMasked: '',
    webhookUrl: 'https://moviq-sooty.vercel.app/api/telegram-webhook',
    autoPublish: false
  });

  const [showTgConfigModal, setShowTgConfigModal] = useState(false);
  const [botTokenInput, setBotTokenInput] = useState('');
  const [webhookUrlInput, setWebhookUrlInput] = useState('https://moviq-sooty.vercel.app/api/telegram-webhook');
  const [autoPublishInput, setAutoPublishInput] = useState(false);

  // Simulation test modal
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simPhotoUrl, setSimPhotoUrl] = useState('');
  const [simCaption, setSimCaption] = useState('Louis Vuitton Trainer Sneaker 14500 EGP - Size 40,41,42,43,44');

  // Edit pending import item
  const [editingPendingProduct, setEditingPendingProduct] = useState<Product | null>(null);
  const [editingPendingForm, setEditingPendingForm] = useState({
    name: '',
    brand: '',
    salePrice: 12500,
    category: 'Sneakers',
    sizes: '40,41,42,43,44',
    description: ''
  });

  // Fetch Telegram Config on mount
  useEffect(() => {
    fetch('/api/telegram/config')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setTelegramConfig({
            isConfigured: !!data.hasToken,
            botTokenMasked: data.botTokenMasked || '',
            webhookUrl: data.webhookUrl || 'https://moviq-sooty.vercel.app/api/telegram-webhook',
            autoPublish: !!data.autoPublish
          });
          setAutoPublishInput(!!data.autoPublish);
          if (data.webhookUrl) setWebhookUrlInput(data.webhookUrl);
        }
      })
      .catch(err => console.log('Telegram config fetch status:', err));
  }, []);

  const handleSaveTelegramConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: botTokenInput,
          webhookUrl: webhookUrlInput,
          autoPublish: autoPublishInput
        })
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (pErr) {
        throw new Error(text || 'Server returned invalid non-JSON response');
      }

      if (data.success) {
        triggerSuccess('Telegram bot configuration saved.');
        setTelegramConfig(prev => ({
          ...prev,
          isConfigured: !!botTokenInput || prev.isConfigured,
          webhookUrl: webhookUrlInput,
          autoPublish: autoPublishInput
        }));
        setShowTgConfigModal(false);
      } else {
        alert('Error saving config: ' + (data.error || 'Failed to save configuration'));
      }
    } catch (err: any) {
      alert('Error saving config: ' + err.message);
    }
  };

  const handleSetWebhookUrl = async () => {
    const targetUrl = webhookUrlInput || 'https://moviq-sooty.vercel.app/api/telegram-webhook';
    try {
      const res = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: targetUrl,
          botToken: botTokenInput
        })
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (pErr) {
        throw new Error(text || 'Server returned invalid non-JSON response');
      }

      if (data.success) {
        triggerSuccess('Telegram Webhook set successfully with Telegram API!');
        setTelegramConfig(prev => ({ ...prev, webhookUrl: targetUrl, isConfigured: true }));
      } else {
        alert('Telegram API error: ' + (data.error || 'Failed to set webhook'));
      }
    } catch (err: any) {
      alert('Error setting webhook: ' + err.message);
    }
  };

  const handleSimulatePhotoImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/telegram/test-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: simPhotoUrl,
          caption: simCaption
        })
      });
      const data = await res.json();
      if (data.success && data.product) {
        triggerSuccess(`Simulated Telegram photo import! New Pending Import created for "${data.product.name}".`);
        setProducts(prev => [data.product, ...prev]);
        setShowSimulateModal(false);
        setSimPhotoUrl('');
      }
    } catch (err: any) {
      alert('Simulation error: ' + err.message);
    }
  };

  const handleStartEditPendingProduct = (p: Product) => {
    setEditingPendingProduct(p);
    setEditingPendingForm({
      name: p.name,
      brand: p.brand,
      salePrice: p.salePrice,
      category: p.category,
      sizes: p.sizes ? p.sizes.join(',') : '40,41,42,43,44',
      description: p.description || ''
    });
  };

  const handleSavePendingProductUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPendingProduct) return;

    try {
      const formattedSizes = editingPendingForm.sizes.split(',').map(s => s.trim());
      const res = await fetch('/api/import/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPendingProduct.id,
          name: editingPendingForm.name,
          brand: editingPendingForm.brand,
          salePrice: Number(editingPendingForm.salePrice),
          category: editingPendingForm.category,
          sizes: formattedSizes,
          description: editingPendingForm.description
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(item => item.id === editingPendingProduct.id ? {
          ...item,
          name: editingPendingForm.name,
          brand: editingPendingForm.brand,
          salePrice: Number(editingPendingForm.salePrice),
          originalPrice: Number(editingPendingForm.salePrice),
          category: editingPendingForm.category,
          sizes: formattedSizes,
          description: editingPendingForm.description
        } : item));
        triggerSuccess(`Updated details for pending product "${editingPendingForm.name}".`);
        setEditingPendingProduct(null);
      }
    } catch (err: any) {
      alert('Error updating pending product: ' + err.message);
    }
  };

  // --- LOAD & SEED SYSTEM ---
  useEffect(() => {
    // 1. Orders
    const savedOrdersStr = localStorage.getItem('moviq_orders');
    let ordersData: SavedOrder[] = [];
    if (savedOrdersStr) {
      ordersData = JSON.parse(savedOrdersStr);
    } else {
      // Seed initial mock orders if none exist
      ordersData = [
        {
          id: 'MVQ-843201',
          date: 'Jul 2, 2026',
          items: [
            {
              productName: 'Air Jordan 1 Retro High Dior',
              brand: 'Jordan',
              image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=400&q=80',
              quantity: 1,
              price: 38500,
              size: '42.5',
              color: { name: 'Dior Oblique Grey', hex: '#b0b3b8' }
            }
          ],
          subtotal: 38500,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 38500,
          paymentMethod: 'visa',
          status: 'Delivered',
          fullName: 'Aly Ibrahim',
          email: 'aly.ibrahim@outlook.com',
          address: '15 El-Gezira St, Floor 4, Apt 12, Zamalek',
          governorate: 'Cairo',
          phone: '+20 100 123 4567'
        },
        {
          id: 'MVQ-721495',
          date: 'Jun 18, 2026',
          items: [
            {
              productName: 'Balenciaga Triple S Black White Red',
              brand: 'Balenciaga',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
              quantity: 1,
              price: 14500,
              size: '42',
              color: { name: 'Black Red', hex: '#111111' }
            }
          ],
          subtotal: 14500,
          discountAmount: 1450,
          shippingCost: 0,
          finalTotal: 13050,
          paymentMethod: 'mastercard',
          status: 'Delivered',
          fullName: 'Aly Ibrahim',
          email: 'aly.ibrahim@outlook.com',
          address: '15 El-Gezira St, Floor 4, Apt 12, Zamalek',
          governorate: 'Cairo',
          phone: '+20 100 123 4567'
        },
        {
          id: 'MVQ-918234',
          date: 'Jul 15, 2026',
          items: [
            {
              productName: 'Nike x Sacai VaporWaffle Tour Yellow',
              brand: 'Nike',
              image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=400&q=80',
              quantity: 2,
              price: 9500,
              size: '43',
              color: { name: 'Yellow Stadium', hex: '#ffcc00' }
            }
          ],
          subtotal: 19000,
          discountAmount: 1900,
          shippingCost: 0,
          finalTotal: 17100,
          paymentMethod: 'meeza',
          status: 'Approved & Dispatched',
          fullName: 'Youssef Mansour',
          email: 'youssef.mansour@gmail.com',
          address: '9 Al-Ahram St, Heliopolis',
          governorate: 'Cairo',
          phone: '+20 112 345 6789'
        },
        {
          id: 'MVQ-552391',
          date: 'Jul 19, 2026',
          items: [
            {
              productName: 'Prada Cloudbust Thunder Red Black',
              brand: 'Prada',
              image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80',
              quantity: 1,
              price: 21000,
              size: '41',
              color: { name: 'Scarlet Obsidian', hex: '#b31b1b' }
            }
          ],
          subtotal: 21000,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 21000,
          paymentMethod: 'cod',
          status: 'Pending Authenticity Audit',
          fullName: 'Farida El-Shamy',
          email: 'farida_shamy@outlook.com',
          address: 'Palm Hills Complex, Villa 42',
          governorate: 'Giza',
          phone: '+20 102 389 4422'
        }
      ];
      localStorage.setItem('moviq_orders', JSON.stringify(ordersData));
    }
    setAdminOrders(ordersData);

    // 2. Discount Codes
    const savedDiscountsStr = localStorage.getItem('moviq_discount_codes');
    let discountsData: AdminDiscountCode[] = [];
    if (savedDiscountsStr) {
      discountsData = JSON.parse(savedDiscountsStr);
    } else {
      discountsData = [
        { code: 'MOVIQLUXURY', discountRate: 0.15, type: 'percentage', minSpend: 0, status: 'active', usageCount: 41 },
        { code: 'MOVIQ10OFF', discountRate: 0.10, type: 'percentage', minSpend: 0, status: 'active', usageCount: 104 },
        { code: 'VIP20', discountRate: 0.20, type: 'percentage', minSpend: 15000, status: 'active', usageCount: 18 },
        { code: 'COUTURE30', discountRate: 0.30, type: 'percentage', minSpend: 30000, status: 'inactive', usageCount: 3 }
      ];
      localStorage.setItem('moviq_discount_codes', JSON.stringify(discountsData));
    }
    setDiscountCodes(discountsData);

    // 3. Customers
    const savedCustomersStr = localStorage.getItem('moviq_customers');
    let customersData: CustomerProfile[] = [];
    if (savedCustomersStr) {
      customersData = JSON.parse(savedCustomersStr);
    } else {
      customersData = [
        { id: 'c-1', name: 'Aly Ibrahim', email: 'aly.ibrahim@outlook.com', phone: '+20 100 123 4567', tier: 'Platine Ambassador', memberSince: 'Dec 2024', totalSpent: 51550, ordersCount: 2 },
        { id: 'c-2', name: 'Youssef Mansour', email: 'youssef.mansour@gmail.com', phone: '+20 112 345 6789', tier: 'VIP Club Member', memberSince: 'Mar 2025', totalSpent: 17100, ordersCount: 1 },
        { id: 'c-3', name: 'Farida El-Shamy', email: 'farida_shamy@outlook.com', phone: '+20 102 389 4422', tier: 'Atelier Enthusiast', memberSince: 'Jan 2026', totalSpent: 21000, ordersCount: 1 },
        { id: 'c-4', name: 'Sherif Fayed', email: 'sherif_fayed@gmail.com', phone: '+20 122 888 9911', tier: 'VIP Club Member', memberSince: 'Nov 2025', totalSpent: 28500, ordersCount: 2 },
        { id: 'c-5', name: 'Nour El-Sherif', email: 'nour_sherif@yahoo.com', phone: '+20 155 332 2110', tier: 'Atelier Enthusiast', memberSince: 'May 2026', totalSpent: 0, ordersCount: 0 }
      ];
      localStorage.setItem('moviq_customers', JSON.stringify(customersData));
    }
    setCustomers(customersData);
  }, []);

  const triggerSuccess = (message: string) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // --- DERIVED METRICS ---
  const totalRevenue = adminOrders
    .filter(o => o.status === 'Delivered' || o.status === 'Approved & Dispatched')
    .reduce((sum, o) => sum + o.finalTotal, 0);

  const averageOrderValue = adminOrders.length > 0 
    ? Math.round(adminOrders.reduce((sum, o) => sum + o.finalTotal, 0) / adminOrders.length) 
    : 0;

  const lowStockThreshold = 2; // Threshold for sizes in stock

  // Brand Distribution for Charts
  const brandStats = products.reduce((acc: { [key: string]: number }, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {});
  
  const brandChartData = Object.keys(brandStats).map(brand => ({
    name: brand,
    value: brandStats[brand]
  }));

  // Best Selling Products Analysis based on simulated sales + recent orders
  const bestSellersAnalysis = products
    .map(p => {
      // Count item appearances in recent orders
      const salesCount = adminOrders.reduce((total, ord) => {
        const matchingItem = ord.items.find(it => it.productName === p.name);
        return total + (matchingItem ? matchingItem.quantity : 0);
      }, 0);
      return {
        name: p.name,
        brand: p.brand,
        image: p.image,
        sales: p.isBestSeller ? salesCount + 12 : salesCount,
        price: p.salePrice,
        revenue: (p.isBestSeller ? salesCount + 12 : salesCount) * p.salePrice
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Revenue Over Time Trend (Past few months simulation with dynamic orders addition)
  const revenueTrendData = [
    { month: 'Feb 2026', revenue: 125000 },
    { month: 'Mar 2026', revenue: 182000 },
    { month: 'Apr 2026', revenue: 145000 },
    { month: 'May 2026', revenue: 298000 },
    { month: 'Jun 2026', revenue: totalRevenue > 60000 ? 210000 + totalRevenue * 0.4 : 340000 },
    { month: 'Jul 2026 (MTD)', revenue: totalRevenue }
  ];

  const categoryDistributionData = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: p.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#000000', '#404040', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5'];

  // --- ACTIONS HANDLERS ---
  
  // 1. Order Status Updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = adminOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setAdminOrders(updated);
    localStorage.setItem('moviq_orders', JSON.stringify(updated));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    triggerSuccess(`Order ${orderId} status successfully set to "${newStatus}"`);
    
    // Sync customer's total spent if delivered
    if (newStatus === 'Delivered') {
      const order = adminOrders.find(o => o.id === orderId);
      if (order) {
        updateCustomerSpend(order.email, order.finalTotal);
      }
    }
  };

  const updateCustomerSpend = (email: string, amount: number) => {
    const updated = customers.map(c => {
      if (c.email.toLowerCase() === email.toLowerCase()) {
        const newTotal = c.totalSpent + amount;
        let newTier = c.tier;
        if (newTotal > 50000) newTier = 'Platine Ambassador';
        else if (newTotal > 20000) newTier = 'VIP Club Member';
        return { 
          ...c, 
          totalSpent: newTotal,
          ordersCount: c.ordersCount + 1,
          tier: newTier
        };
      }
      return c;
    });
    setCustomers(updated);
    localStorage.setItem('moviq_customers', JSON.stringify(updated));
  };

  // 2. Product CRUD Add/Edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedSizes = productForm.sizes.split(',').map(s => s.trim());
    const formattedColors = productForm.colors.split(',').map(c => {
      const parts = c.split(':');
      return {
        name: parts[0]?.trim() || 'Custom',
        hex: parts[1]?.trim() || '#000000'
      };
    });
    const formattedDetails = productForm.details.split(',').map(d => d.trim());

    if (editingProduct) {
      // Edit
      const updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            brand: productForm.brand,
            name: productForm.name,
            image: productForm.image || p.image,
            category: productForm.category,
            originalPrice: Number(productForm.originalPrice),
            salePrice: Number(productForm.salePrice),
            discount: Number(productForm.discount),
            description: productForm.description,
            sizes: formattedSizes,
            colors: formattedColors,
            details: formattedDetails,
            isNew: productForm.isNew,
            isBestSeller: productForm.isBestSeller,
            isLuxury: productForm.isLuxury
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      triggerSuccess(`Successfully updated designer sneaker "${productForm.name}"`);
    } else {
      // Add new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        brand: productForm.brand,
        name: productForm.name,
        image: productForm.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
        gallery: [productForm.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'],
        originalPrice: Number(productForm.originalPrice),
        salePrice: Number(productForm.salePrice),
        discount: Number(productForm.discount),
        category: productForm.category,
        sizes: formattedSizes,
        colors: formattedColors,
        description: productForm.description,
        details: formattedDetails,
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        isNew: productForm.isNew,
        isBestSeller: productForm.isBestSeller,
        isLuxury: productForm.isLuxury
      };
      setProducts([newProduct, ...products]);
      triggerSuccess(`Successfully registered new creation "${productForm.name}" to showcase`);
    }

    // Reset Form
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductForm({
      brand: '',
      name: '',
      image: '',
      category: 'Sneakers',
      originalPrice: 12000,
      salePrice: 10800,
      discount: 10,
      description: '',
      sizes: '40,41,42,43,44',
      colors: 'Black:#000000,White:#ffffff',
      details: 'Handcrafted luxury leather, Designed in Italy, Limited edition capsule release',
      isNew: true,
      isBestSeller: false,
      isLuxury: true
    });
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      brand: p.brand,
      name: p.name,
      image: p.image,
      category: p.category,
      originalPrice: p.originalPrice,
      salePrice: p.salePrice,
      discount: p.discount,
      description: p.description,
      sizes: p.sizes.join(','),
      colors: p.colors.map(c => `${c.name}:${c.hex}`).join(','),
      details: p.details.join(','),
      isNew: !!p.isNew,
      isBestSeller: !!p.isBestSeller,
      isLuxury: !!p.isLuxury
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (pId: string, pName: string) => {
    if (confirm(`Are you absolutely sure you want to retire "${pName}" from the luxury catalogue?`)) {
      setProducts(products.filter(p => p.id !== pId));
      triggerSuccess(`Retired "${pName}" successfully.`);
    }
  };

  const handlePublishProduct = (pId: string, pName: string) => {
    const updatedProducts = products.map(p => {
      if (p.id === pId) {
        return { ...p, status: 'published' as const };
      }
      return p;
    });
    setProducts(updatedProducts);

    // Sync publish to server
    fetch('/api/import/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pId })
    }).catch(err => console.error('Error syncing publish state:', err));

    triggerSuccess(`Successfully published "${pName}" to the luxury storefront.`);
  };

  const handleDeletePendingProduct = (pId: string, pName: string) => {
    if (confirm(`Are you absolutely sure you want to delete pending import "${pName}"?`)) {
      setProducts(products.filter(p => p.id !== pId));

      // Sync delete to server
      fetch('/api/import/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pId })
      }).catch(err => console.error('Error syncing delete state:', err));

      triggerSuccess(`Deleted pending import "${pName}".`);
    }
  };

  // 3. Discount Code Handlers
  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = discountForm.code.trim().toUpperCase();
    if (!cleanCode) return;

    const existingIdx = discountCodes.findIndex(d => d.code === cleanCode);
    const codeObj: AdminDiscountCode = {
      code: cleanCode,
      discountRate: Number(discountForm.discountRate) / 100,
      type: 'percentage',
      minSpend: Number(discountForm.minSpend),
      status: discountForm.status,
      usageCount: existingIdx > -1 ? discountCodes[existingIdx].usageCount : 0
    };

    let updated = [...discountCodes];
    if (existingIdx > -1) {
      updated[existingIdx] = codeObj;
    } else {
      updated.unshift(codeObj);
    }

    setDiscountCodes(updated);
    localStorage.setItem('moviq_discount_codes', JSON.stringify(updated));
    setIsAddingDiscount(false);
    setDiscountForm({ code: '', discountRate: 15, minSpend: 0, status: 'active' });
    triggerSuccess(`Promo privilege code "${cleanCode}" saved successfully.`);
  };

  const handleDeleteDiscount = (code: string) => {
    const updated = discountCodes.filter(d => d.code !== code);
    setDiscountCodes(updated);
    localStorage.setItem('moviq_discount_codes', JSON.stringify(updated));
    triggerSuccess(`Promo privilege code "${code}" deleted.`);
  };

  const handleToggleDiscountStatus = (code: string) => {
    const updated = discountCodes.map(d => {
      if (d.code === code) {
        return { ...d, status: d.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' };
      }
      return d;
    });
    setDiscountCodes(updated);
    localStorage.setItem('moviq_discount_codes', JSON.stringify(updated));
  };

  // 4. Customer tier change
  const handleUpgradeCustomerTier = (cId: string, currentTier: string) => {
    const tiers: CustomerProfile['tier'][] = ['Atelier Enthusiast', 'VIP Club Member', 'Platine Ambassador'];
    const currentIdx = tiers.indexOf(currentTier as any);
    const nextIdx = (currentIdx + 1) % tiers.length;
    const nextTier = tiers[nextIdx];

    const updated = customers.map(c => {
      if (c.id === cId) {
        return { ...c, tier: nextTier };
      }
      return c;
    });
    setCustomers(updated);
    localStorage.setItem('moviq_customers', JSON.stringify(updated));
    triggerSuccess(`Customer status upgraded to "${nextTier}"`);
  };

  const handleAddCustomer = (name: string, email: string, phone: string) => {
    const newCust: CustomerProfile = {
      id: `c-${Date.now()}`,
      name,
      email,
      phone,
      tier: 'Atelier Enthusiast',
      memberSince: 'Jul 2026',
      totalSpent: 0,
      ordersCount: 0
    };
    const updated = [newCust, ...customers];
    setCustomers(updated);
    localStorage.setItem('moviq_customers', JSON.stringify(updated));
    triggerSuccess(`Registered VIP client "${name}" successfully.`);
  };

  // --- FILTERS FOR LISTS ---
  const filteredOrders = adminOrders.filter(o => 
    o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.fullName.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.email.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(orderQuery.toLowerCase())
  );

  const filteredProductsList = products
    .filter(p => p.status !== 'pending')
    .filter(p => 
      p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(productQuery.toLowerCase())
    );

  const pendingProductsList = products
    .filter(p => p.status === 'pending')
    .filter(p => 
      p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(productQuery.toLowerCase())
    );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(customerQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(customerQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 font-sans selection:bg-white selection:text-black animate-none" id="admin-login-portal">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 md:p-10 flex flex-col space-y-6 relative"
        >
          {/* Logo / Title */}
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-[0.3em] font-bold text-amber-500 uppercase block">
              SECURE WORKSPACE
            </span>
            <h2 className="text-3xl font-serif font-black tracking-[0.2em] text-white">
              MOVIQ
            </h2>
            <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
              Verify your administrative credentials to enter the Atelier Control Portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 text-center font-medium"
              >
                {loginError}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter admin username"
                required
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white text-xs py-3 px-4 outline-none rounded-none font-medium text-white placeholder:text-neutral-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter secure password"
                required
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white text-xs py-3 px-4 outline-none rounded-none font-medium text-white placeholder:text-neutral-600 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-neutral-200 text-black font-black text-xs py-3.5 px-6 uppercase tracking-widest rounded-none transition-all duration-300 shadow-md cursor-pointer hover:tracking-[0.12em] block mt-2"
            >
              Sign In
            </button>
          </form>

          {/* Security Notice */}
          <div className="border-t border-neutral-800/60 pt-4 text-[9px] text-neutral-500 leading-normal space-y-1.5 text-center">
            <p className="font-bold uppercase tracking-wider text-amber-500/60">
              Development Notice
            </p>
            <p className="font-light">
              This portal utilizes client-side environment protection. For production environments, it is recommended to manage administrative access via an isolated backend or standard auth service.
            </p>
          </div>

          {/* Close/Exit */}
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] uppercase font-black tracking-widest text-neutral-400 hover:text-white transition-all text-center block w-full pt-2 cursor-pointer"
          >
            Return to Catalog
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans" id="premium-admin-dashboard-container">
      {/* Dynamic Header */}
      <header className="bg-neutral-950 border-b border-neutral-900 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white text-black rounded-none">
            <Sliders size={18} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.25em] uppercase text-white flex items-center gap-1.5">
              <span>MOVIQ ATELIER CONTROL</span>
              <span className="bg-neutral-800 text-[8px] font-black px-1.5 py-0.5 border border-neutral-700 text-neutral-300">ADMIN</span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-light">E-Commerce Intelligence & Inventory Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
          >
            Logout
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
          >
            Exit Workspace
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        
        {/* SIDEBAR NAVIGATION (Col-span-2) */}
        <aside className="lg:col-span-2 bg-neutral-950 border-b lg:border-b-0 lg:border-r border-neutral-900 p-4 md:p-6 flex flex-row lg:flex-col gap-1 lg:gap-1.5 overflow-x-auto lg:overflow-x-visible scrollbar-none shrink-0" id="admin-sidebar">
          
          <div className="hidden lg:block mb-6">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-500 block mb-2.5">MANAGEMENT CHANNELS</span>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <TrendingUp size={14} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <BarChart3 size={14} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Orders</span>
            {adminOrders.filter(o => o.status.includes('Pending')).length > 0 && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse hidden lg:block" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Box size={14} />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('pending-imports')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer relative ${
              activeTab === 'pending-imports'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <RefreshCw size={14} className={products.filter(p => p.status === 'pending').length > 0 ? "animate-spin" : ""} style={{ animationDuration: '8s' }} />
            <span>Pending Imports</span>
            {products.filter(p => p.status === 'pending').length > 0 && (
              <span className="ml-auto bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {products.filter(p => p.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Package size={14} />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Users size={14} />
            <span>Customers</span>
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'discounts'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Tag size={14} />
            <span>Discount Codes</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'brand'
                ? 'bg-white text-black font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span>Mascot & Brand Book</span>
          </button>
        </aside>

        {/* WORKSPACE AREA (Col-span-10) */}
        <main className="lg:col-span-10 p-6 md:p-8 overflow-y-auto bg-neutral-950 min-h-0" id="admin-workspace">
          
          {actionSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs uppercase tracking-wider font-extrabold flex items-center gap-2.5 rounded-none"
            >
              <Check size={16} />
              <span>{actionSuccess}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            
            {/* ==================== 1. OVERVIEW SCREEN ==================== */}
            {activeTab === 'overview' && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight text-white">Workspace Overview</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-light">Real-time luxury e-commerce transactional statistics</p>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-board-grid">
                  <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
                    <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest block">Total Revenue (Dispatched/Delivered)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-black tracking-wide text-white">{totalRevenue.toLocaleString()} EGP</span>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center"><ArrowUpRight size={12} /> +12.4%</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
                    <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest block">Average Ticket Size (AOV)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-black tracking-wide text-white">{averageOrderValue.toLocaleString()} EGP</span>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center"><ArrowUpRight size={12} /> +4.8%</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
                    <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest block">Total Orders Registered</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-black tracking-wide text-white">{adminOrders.length}</span>
                      <span className="text-[10px] text-neutral-400 font-bold">Egyptian Courier</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
                    <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest block">Active Showcase Inventory</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-black tracking-wide text-white">{products.length} Designs</span>
                      <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                        <ShieldAlert size={11} /> {products.filter(p => p.sizes.length < 3).length} Limited Sizes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout: Quick Charts + Recent Orders / Best Sellers */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  
                  {/* Left Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-6">
                    {/* Sales trend chart */}
                    <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs uppercase tracking-widest font-black text-white">Revenue Timeline Growth</h3>
                        <span className="text-[10px] text-neutral-400">Past 6 months</span>
                      </div>
                      <div className="h-[260px] w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueTrendData}>
                            <defs>
                              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                            <XAxis dataKey="month" stroke="#737373" />
                            <YAxis stroke="#737373" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#ffffff' }}
                              formatter={(value) => [`${Number(value).toLocaleString()} EGP`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Recent Orders Overview */}
                    <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs uppercase tracking-widest font-black text-white">Recent Purchases</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-[10px] uppercase font-extrabold text-neutral-400 hover:text-white flex items-center gap-1">
                          <span>All Orders</span> <ChevronRight size={12} />
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                              <th className="pb-3 font-semibold">Order ID</th>
                              <th className="pb-3 font-semibold">Client</th>
                              <th className="pb-3 font-semibold">Couture items</th>
                              <th className="pb-3 font-semibold">Total Price</th>
                              <th className="pb-3 font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800/40">
                            {adminOrders.slice(0, 4).map(o => (
                              <tr key={o.id} className="hover:bg-neutral-900/30">
                                <td className="py-3.5 font-mono font-bold text-white">{o.id}</td>
                                <td className="py-3.5">
                                  <div className="font-bold text-neutral-200">{o.fullName}</div>
                                  <div className="text-[9.5px] text-neutral-500">{o.governorate}</div>
                                </td>
                                <td className="py-3.5 text-neutral-400">
                                  {o.items.map(it => `${it.brand} ${it.productName} (EU ${it.size})`).join(', ')}
                                </td>
                                <td className="py-3.5 font-mono text-white font-extrabold">{o.finalTotal.toLocaleString()} EGP</td>
                                <td className="py-3.5">
                                  <span className={`text-[8.5px] px-2 py-0.5 border font-extrabold ${
                                    o.status === 'Delivered' 
                                      ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900' 
                                      : o.status.includes('Pending')
                                      ? 'bg-amber-950/50 text-amber-400 border-amber-900'
                                      : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (xl:col-span-4) */}
                  <div className="xl:col-span-4 space-y-6">
                    {/* Brand Distribution Chart */}
                    <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                      <h3 className="text-xs uppercase tracking-widest font-black text-white">Brand Portfolio Share</h3>
                      <div className="h-[200px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={brandChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {brandChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#ffffff' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400">
                        {brandChartData.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span className="truncate">{entry.name} ({entry.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Selling Products */}
                    <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                      <h3 className="text-xs uppercase tracking-widest font-black text-white">Top Performing Sneaker Designs</h3>
                      <div className="space-y-4">
                        {bestSellersAnalysis.map((p, idx) => (
                          <div key={idx} className="flex gap-3 items-center text-xs">
                            <div className="w-10 h-12 bg-neutral-950 border border-neutral-800 p-0.5 flex items-center justify-center shrink-0">
                              <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block">{p.brand}</span>
                              <h5 className="font-bold text-neutral-200 line-clamp-1">{p.name}</h5>
                              <span className="text-neutral-400 text-[10px] font-mono">{p.sales} verified sales</span>
                            </div>
                            <span className="font-extrabold text-white font-mono">{p.revenue.toLocaleString()} EGP</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ==================== 2. ANALYTICS & REVENUE ==================== */}
            {activeTab === 'analytics' && (
              <motion.div
                key="tab-analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight text-white">Business Intelligence</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-light">Deep analytics on brand distribution, revenue and item traction</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category bar chart */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-black text-white">Products count by category</h3>
                    <div className="h-[260px] w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                          <XAxis dataKey="name" stroke="#737373" />
                          <YAxis stroke="#737373" />
                          <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#ffffff' }} />
                          <Bar dataKey="value" fill="#ffffff" radius={[2, 2, 0, 0]}>
                            {categoryDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Brand bar chart (Performance) */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-black text-white">Simulated Brand revenue distribution</h3>
                    <div className="h-[260px] w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={brandChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                          <XAxis dataKey="name" stroke="#737373" />
                          <YAxis stroke="#737373" />
                          <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#ffffff' }} />
                          <Bar dataKey="value" fill="#737373" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Performance table */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-black text-white">Comprehensive Brand Performance Index</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                          <th className="pb-3 font-semibold">Brand Label</th>
                          <th className="pb-3 font-semibold">Designs Registered</th>
                          <th className="pb-3 font-semibold">Avg. Retail Value</th>
                          <th className="pb-3 font-semibold">Top Seller Selection</th>
                          <th className="pb-3 font-semibold">Aesthetic Integrity Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/40">
                        {Object.keys(brandStats).map((b, idx) => {
                          const brandProds = products.filter(p => p.brand === b);
                          const avgPrice = Math.round(brandProds.reduce((sum, p) => sum + p.salePrice, 0) / brandProds.length);
                          const topSeller = brandProds.sort((x, y) => y.rating - x.rating)[0]?.name || 'N/A';
                          return (
                            <tr key={b} className="hover:bg-neutral-900/30">
                              <td className="py-3.5 font-bold text-white uppercase tracking-wider">{b}</td>
                              <td className="py-3.5 font-mono text-neutral-300">{brandProds.length} styles</td>
                              <td className="py-3.5 font-mono text-white">{avgPrice.toLocaleString()} EGP</td>
                              <td className="py-3.5 text-neutral-400 italic font-light">{topSeller}</td>
                              <td className="py-3.5 text-neutral-200">
                                <div className="flex items-center gap-1">
                                  <Star size={11} className="text-amber-400 fill-amber-400" />
                                  <span className="font-bold text-[11px]">4.9 / 5.0</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 3. ORDERS MANAGEMENT ==================== */}
            {activeTab === 'orders' && (
              <motion.div
                key="tab-orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white">Egyptian Courier Orders Ledger</h2>
                    <p className="text-xs text-neutral-400 mt-1 font-light">Monitor, filter, and audit status of pending custom deliveries</p>
                  </div>
                  
                  {/* Search orders */}
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search Order ID, client, status..."
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-xs py-2 pl-9 pr-4 text-white outline-none focus:border-neutral-700"
                    />
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-neutral-950 p-4 text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                          <th className="p-4 font-semibold">Order ID</th>
                          <th className="p-4 font-semibold">Date</th>
                          <th className="p-4 font-semibold">Client Detail</th>
                          <th className="p-4 font-semibold">Destination City</th>
                          <th className="p-4 font-semibold">Payment Type</th>
                          <th className="p-4 font-semibold">Total Invoice</th>
                          <th className="p-4 font-semibold">Fulfillment status</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/40">
                        {filteredOrders.map(o => (
                          <tr key={o.id} className="hover:bg-neutral-900/30">
                            <td className="p-4 font-mono font-bold text-white">{o.id}</td>
                            <td className="p-4 text-neutral-400 whitespace-nowrap">{o.date}</td>
                            <td className="p-4">
                              <div className="font-bold text-neutral-200">{o.fullName}</div>
                              <div className="text-[10px] text-neutral-500">{o.email}</div>
                            </td>
                            <td className="p-4 text-neutral-300 font-semibold">{o.governorate}</td>
                            <td className="p-4">
                              <span className="font-mono text-neutral-400 font-bold uppercase">{o.paymentMethod}</span>
                            </td>
                            <td className="p-4 font-mono text-white font-extrabold">{o.finalTotal.toLocaleString()} EGP</td>
                            <td className="p-4">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className={`bg-neutral-950 border border-neutral-800 text-[10px] uppercase font-black tracking-wider px-2 py-1 outline-none text-white cursor-pointer ${
                                  o.status === 'Delivered' 
                                    ? 'text-emerald-400 border-emerald-950' 
                                    : o.status.includes('Pending')
                                    ? 'text-amber-400 border-amber-950'
                                    : 'text-neutral-400'
                                }`}
                              >
                                <option value="Pending Authenticity Audit">Pending Audit</option>
                                <option value="Approved & Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Returned & Cancelled">Returned/Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="text-[10px] uppercase font-extrabold tracking-wider bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1.5 border border-neutral-700 cursor-pointer"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 4. PRODUCTS MANAGEMENT ==================== */}
            {activeTab === 'products' && (
              <motion.div
                key="tab-products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white">Design & Couture Catalog</h2>
                    <p className="text-xs text-neutral-400 mt-1 font-light">Add, update prices, manage tags, and edit specifications for luxury sneakers</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-56">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search sneakers..."
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs py-2 pl-9 pr-4 text-white outline-none focus:border-neutral-700"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddingProduct(true);
                      }}
                      className="px-4 py-2 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Plus size={13} />
                      <span>Add Sneaker</span>
                    </button>
                  </div>
                </div>

                {isAddingProduct ? (
                  <form onSubmit={handleSaveProduct} className="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">
                        {editingProduct ? `Edit ${editingProduct.name} Configuration` : 'Register New Curated Sneaker Design'}
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingProduct(false)} 
                        className="text-neutral-400 hover:text-white p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Brand Label</label>
                        <input
                          type="text"
                          required
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          placeholder="e.g. Nike, Balenciaga, Jordan"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Sneaker Model Name</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g. Air Jordan 1 Retro High OG"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Category Tag</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white cursor-pointer"
                        >
                          <option value="Sneakers">Sneakers</option>
                          <option value="Luxury Run">Luxury Run</option>
                          <option value="Limited Release">Limited Release</option>
                          <option value="Atelier Couture">Atelier Couture</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Original Price (EGP)</label>
                        <input
                          type="number"
                          required
                          value={productForm.originalPrice}
                          onChange={(e) => {
                            const orig = Number(e.target.value);
                            const disc = productForm.discount;
                            const sale = Math.round(orig * (1 - disc / 100));
                            setProductForm({ ...productForm, originalPrice: orig, salePrice: sale });
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Discount rate (%)</label>
                        <input
                          type="number"
                          required
                          value={productForm.discount}
                          onChange={(e) => {
                            const disc = Number(e.target.value);
                            const orig = productForm.originalPrice;
                            const sale = Math.round(orig * (1 - disc / 100));
                            setProductForm({ ...productForm, discount: disc, salePrice: sale });
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Sale Price (EGP - Calculated)</label>
                        <input
                          type="number"
                          required
                          value={productForm.salePrice}
                          onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black text-neutral-400">Product Image Link</label>
                      <input
                        type="url"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black text-neutral-400">Aesthetic Narrative Description</label>
                      <textarea
                        required
                        rows={3}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Crafted from buttery smooth premium calfskin leather..."
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Sizes List (Comma separated)</label>
                        <input
                          type="text"
                          required
                          value={productForm.sizes}
                          onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                          placeholder="40,41,42,43,44,45"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Colors (Format: Name:HexCode, Comma separated)</label>
                        <input
                          type="text"
                          required
                          value={productForm.colors}
                          onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                          placeholder="Obsidian Black:#1a1a1a,Silver Metallic:#c0c0c0"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black text-neutral-400">Atelier Details Points (Comma separated)</label>
                      <input
                        type="text"
                        value={productForm.details}
                        onChange={(e) => setProductForm({ ...productForm, details: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 outline-none focus:border-neutral-700 text-white"
                      />
                    </div>

                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="form-is-new"
                          checked={productForm.isNew}
                          onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                          className="w-3.5 h-3.5 accent-white cursor-pointer"
                        />
                        <label htmlFor="form-is-new" className="text-[10px] uppercase font-black tracking-wider text-neutral-300">Set as New Arrival</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="form-is-best"
                          checked={productForm.isBestSeller}
                          onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                          className="w-3.5 h-3.5 accent-white cursor-pointer"
                        />
                        <label htmlFor="form-is-best" className="text-[10px] uppercase font-black tracking-wider text-neutral-300">Set as Best Seller</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="form-is-lux"
                          checked={productForm.isLuxury}
                          onChange={(e) => setProductForm({ ...productForm, isLuxury: e.target.checked })}
                          className="w-3.5 h-3.5 accent-white cursor-pointer"
                        />
                        <label htmlFor="form-is-lux" className="text-[10px] uppercase font-black tracking-wider text-neutral-300">Set as Luxury Private Stock</label>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingProduct(false)}
                        className="flex-1 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 font-bold text-xs py-3.5 uppercase tracking-widest rounded-none transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold text-xs py-3.5 uppercase tracking-widest rounded-none transition-all cursor-pointer"
                      >
                        {editingProduct ? 'Save Sneaker Specifications' : 'Submit Design to Showcase'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProductsList.map(p => (
                      <div key={p.id} className="bg-neutral-900 border border-neutral-800 p-4 flex gap-4 hover:border-neutral-700 transition-colors relative">
                        <div className="w-20 h-24 bg-neutral-950 border border-neutral-800 flex items-center justify-center p-1 shrink-0">
                          <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block">{p.brand}</span>
                            <h4 className="font-bold text-xs text-white truncate">{p.name}</h4>
                            <p className="text-[10px] text-neutral-400 mt-1">{p.category}</p>
                          </div>

                          <div className="flex items-end justify-between">
                            <span className="font-serif font-black text-xs text-neutral-200">{p.salePrice.toLocaleString()} EGP</span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStartEditProduct(p)}
                                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-none cursor-pointer"
                                title="Edit specs"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 bg-neutral-800 hover:bg-red-950/50 hover:text-red-400 text-neutral-500 rounded-none cursor-pointer"
                                title="Retire product"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Attribute Badges */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          {p.isBestSeller && (
                            <span className="bg-amber-500 text-black text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5">Top</span>
                          )}
                          {p.isNew && (
                            <span className="bg-neutral-100 text-black text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5">New</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== PENDING IMPORTS WORKFLOW ==================== */}
            {activeTab === 'pending-imports' && (
              <motion.div
                key="tab-pending-imports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header & Controls */}
                <div className="flex flex-wrap justify-between items-start lg:items-center gap-4 bg-neutral-900 border border-neutral-800 p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold uppercase tracking-tight text-white">Pending Telegram Imports Queue</h2>
                      <span className={`text-[9px] px-2 py-0.5 border font-extrabold uppercase tracking-widest ${
                        telegramConfig.isConfigured 
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80' 
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/80'
                      }`}>
                        {telegramConfig.isConfigured ? 'Bot Webhook Active' : 'Bot Config Needed'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 font-light">
                      Photos sent to your Telegram bot are automatically downloaded, saved to local storage, and staged here for approval.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowTgConfigModal(true)}
                      className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer border border-neutral-700 flex items-center gap-1.5"
                    >
                      <span>Bot & Webhook Settings</span>
                    </button>

                    <button
                      onClick={() => setShowSimulateModal(true)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={12} />
                      <span>Simulate Photo Submission</span>
                    </button>

                    <button
                      onClick={() => {
                        fetch('/api/import')
                          .then(res => res.json())
                          .then(data => {
                            if (Array.isArray(data)) {
                              setProducts(prev => {
                                const published = prev.filter(p => p.status !== 'pending');
                                return [...data, ...published];
                              });
                              triggerSuccess('Refreshed Pending Imports queue');
                            }
                          });
                      }}
                      className="px-3 py-2 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-bold text-[10px] uppercase tracking-widest cursor-pointer"
                      title="Refresh Queue"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>

                {/* Webhook Endpoint Info Bar */}
                <div className="bg-neutral-950 border border-neutral-800/80 p-4 text-xs font-mono text-neutral-400 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 shrink-0">Webhook URL:</span>
                    <span className="text-amber-400 truncate bg-neutral-900 px-2 py-1 border border-neutral-800">
                      {telegramConfig.webhookUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/telegram-webhook`}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-sans">
                    {pendingProductsList.length} item{pendingProductsList.length !== 1 ? 's' : ''} awaiting review
                  </span>
                </div>

                {pendingProductsList.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 p-12 text-center space-y-3">
                    <RefreshCw size={24} className="mx-auto text-neutral-600 animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Queue is Clear</h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                      All imported items have been approved or processed. Send new photos to your Telegram bot or click &quot;Simulate Photo Submission&quot; above to test the pipeline.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {pendingProductsList.map((p) => {
                      const gallery = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
                      return (
                        <div
                          key={p.id}
                          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between overflow-hidden group"
                        >
                          {/* Image & Gallery Header */}
                          <div className="relative bg-neutral-950 border-b border-neutral-800 p-3 flex flex-col items-center justify-center">
                            <div className="w-full h-48 flex items-center justify-center relative">
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                              />
                            </div>

                            {/* Multiple photos gallery strip if album */}
                            {gallery.length > 1 && (
                              <div className="w-full pt-2 flex gap-1.5 overflow-x-auto border-t border-neutral-900/80 mt-2">
                                {gallery.map((imgUrl, gIdx) => (
                                  <button
                                    key={gIdx}
                                    onClick={() => {
                                      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, image: imgUrl } : item));
                                    }}
                                    className={`w-10 h-10 bg-neutral-900 border shrink-0 overflow-hidden cursor-pointer ${
                                      p.image === imgUrl ? 'border-amber-400 ring-1 ring-amber-400' : 'border-neutral-800 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <img src={imgUrl} alt={`Thumb ${gIdx}`} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Badge */}
                            <span className="absolute top-2 left-2 bg-amber-500 text-black text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5">
                              Pending Import ({gallery.length} Photo{gallery.length > 1 ? 's' : ''})
                            </span>
                          </div>

                          {/* Content Body */}
                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">{p.brand}</span>
                                <span className="text-[9px] text-neutral-500 font-mono">ID: {p.id.replace('prod-tg-', '')}</span>
                              </div>
                              <h4 className="font-bold text-sm text-white mt-0.5">{p.name}</h4>

                              <div className="flex items-center gap-2 mt-2 font-mono text-[11px] font-bold text-amber-400">
                                <span>{p.salePrice.toLocaleString()} EGP</span>
                                <span className="text-neutral-600">•</span>
                                <span className="text-neutral-400 text-[10px] font-sans uppercase">{p.category}</span>
                              </div>

                              {/* Available sizes */}
                              {p.sizes && p.sizes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2.5">
                                  {p.sizes.map(sz => (
                                    <span key={sz} className="bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono font-bold text-[8.5px] px-1.5 py-0.5">
                                      {sz}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Caption quote */}
                              {p.description && (
                                <p className="text-[10px] text-neutral-400 font-light bg-neutral-950/60 p-2.5 border border-neutral-800/80 mt-3 line-clamp-3 leading-snug">
                                  &ldquo;{p.description}&rdquo;
                                </p>
                              )}

                              {/* Telegram Metadata */}
                              <div className="mt-3 text-[9.5px] text-neutral-500 space-y-0.5 font-mono border-t border-neutral-800/60 pt-2">
                                <div><span className="text-neutral-600 font-sans uppercase">Sender:</span> {p.telegramSender || p.supplierName || 'Telegram User'}</div>
                                {p.createdAt && <div><span className="text-neutral-600 font-sans uppercase">Received:</span> {new Date(p.createdAt).toLocaleString()}</div>}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-neutral-800 flex flex-wrap gap-2">
                              <button
                                onClick={() => handlePublishProduct(p.id, p.name)}
                                className="flex-1 px-3 py-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Check size={12} />
                                <span>Approve &amp; Publish</span>
                              </button>

                              <button
                                onClick={() => handleStartEditPendingProduct(p)}
                                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                                title="Edit specs before approving"
                              >
                                <Edit3 size={12} />
                              </button>

                              <button
                                onClick={() => handleDeletePendingProduct(p.id, p.name)}
                                className="px-3 py-2 bg-neutral-950 hover:bg-red-950/50 border border-neutral-800 hover:border-red-900 text-neutral-400 hover:text-red-400 font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                                title="Reject and delete import"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== 5. INVENTORY MONITOR ==================== */}
            {activeTab === 'inventory' && (
              <motion.div
                key="tab-inventory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight text-white">Inventory & Sizing Matrix</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-light">Monitor sizing stock levels and instantly restock sneakers size allocations</p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                          <th className="pb-3 font-semibold">Curated Sneaker Design</th>
                          <th className="pb-3 font-semibold">Brand</th>
                          <th className="pb-3 font-semibold">Category</th>
                          <th className="pb-3 font-semibold">Available Sizing Range (EU)</th>
                          <th className="pb-3 font-semibold">Total Stock Value</th>
                          <th className="pb-3 font-semibold text-right">Inventory Allocation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/40">
                        {products.map(p => {
                          const estimatedStock = p.sizes.length;
                          return (
                            <tr key={p.id} className="hover:bg-neutral-900/30">
                              <td className="py-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-10 bg-neutral-950 border border-neutral-800 p-0.5 flex items-center justify-center shrink-0">
                                    <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-neutral-200 line-clamp-1 text-xs">{p.name}</span>
                                    <span className="text-[9.5px] text-neutral-500 font-mono">ID: {p.id}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 font-bold text-white uppercase tracking-wider">{p.brand}</td>
                              <td className="py-4 text-neutral-400">{p.category}</td>
                              <td className="py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {p.sizes.map(sz => (
                                    <span key={sz} className="bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono font-bold text-[9px] px-1.5 py-0.5">
                                      {sz}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 font-mono font-bold text-white text-[11px]">
                                {(p.salePrice * estimatedStock).toLocaleString()} EGP
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      // Add another size allocation
                                      const nextSize = String(Math.max(...p.sizes.map(Number)) + 1);
                                      const updatedSizes = [...p.sizes, isNaN(Number(nextSize)) ? '45' : nextSize];
                                      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, sizes: updatedSizes } : item));
                                      triggerSuccess(`Added Size allocation to ${p.name}`);
                                    }}
                                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-[9px] uppercase tracking-wider cursor-pointer"
                                  >
                                    + Add Size Allocation
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (p.sizes.length <= 1) {
                                        alert('Cannot reduce allocation below 1 size variant. Please edit product details instead.');
                                        return;
                                      }
                                      const updatedSizes = p.sizes.slice(0, -1);
                                      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, sizes: updatedSizes } : item));
                                      triggerSuccess(`Reduced Size allocation for ${p.name}`);
                                    }}
                                    className="px-2.5 py-1 bg-neutral-800 hover:bg-red-950/40 hover:text-red-400 text-neutral-400 font-extrabold text-[9px] uppercase tracking-wider cursor-pointer"
                                  >
                                    - Reduce Size
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 6. CUSTOMERS MANAGEMENT ==================== */}
            {activeTab === 'customers' && (
              <motion.div
                key="tab-customers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white">Private VIP Clients Registry</h2>
                    <p className="text-xs text-neutral-400 mt-1 font-light">Audit spend behavior, lifetime collection value and upgrade privilege tiers</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-56">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={customerQuery}
                        onChange={(e) => setCustomerQuery(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs py-2 pl-9 pr-4 text-white outline-none focus:border-neutral-700"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        const name = prompt('Enter New Client Name:');
                        const email = prompt('Enter Client Email:');
                        const phone = prompt('Enter Client Telephone:');
                        if (name && email) {
                          handleAddCustomer(name, email, phone || '');
                        }
                      }}
                      className="px-4 py-2 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Plus size={13} />
                      <span>Register Client</span>
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                          <th className="pb-3 font-semibold">Client Name</th>
                          <th className="pb-3 font-semibold">Email Contact</th>
                          <th className="pb-3 font-semibold">Telephone</th>
                          <th className="pb-3 font-semibold">Privilege Tier</th>
                          <th className="pb-3 font-semibold">Member Since</th>
                          <th className="pb-3 font-semibold">Lifetime Purchases</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/40">
                        {filteredCustomers.map(c => (
                          <tr key={c.id} className="hover:bg-neutral-900/30">
                            <td className="py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[11px] font-black text-white font-mono uppercase">
                                  {c.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="font-bold text-neutral-200 text-xs">{c.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-neutral-400 font-mono">{c.email}</td>
                            <td className="py-4 text-neutral-400 font-mono">{c.phone || 'N/A'}</td>
                            <td className="py-4">
                              <span className={`text-[8.5px] px-2 py-0.5 border font-extrabold whitespace-nowrap ${
                                c.tier === 'Platine Ambassador' 
                                  ? 'bg-amber-950/50 text-amber-400 border-amber-900' 
                                  : c.tier === 'VIP Club Member'
                                  ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                                  : 'bg-neutral-950 text-neutral-400 border-neutral-800/80'
                              }`}>
                                {c.tier}
                              </span>
                            </td>
                            <td className="py-4 text-neutral-500">{c.memberSince}</td>
                            <td className="py-4 font-mono font-bold text-white text-[11px]">
                              {c.totalSpent.toLocaleString()} EGP <span className="text-neutral-500 font-light font-sans text-[10px]">({c.ordersCount} orders)</span>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => handleUpgradeCustomerTier(c.id, c.tier)}
                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-[9px] uppercase tracking-wider cursor-pointer"
                              >
                                Toggle Tier Privilege
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 7. DISCOUNT CODES MANAGEMENT ==================== */}
            {activeTab === 'discounts' && (
              <motion.div
                key="tab-discounts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white">Privilege Promo Campaigns</h2>
                    <p className="text-xs text-neutral-400 mt-1 font-light">Configure e-commerce coupons, percentage rates, and minimum order requirements</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsAddingDiscount(true);
                      setDiscountForm({ code: '', discountRate: 15, minSpend: 0, status: 'active' });
                    }}
                    className="px-4 py-2 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Plus size={13} />
                    <span>Create Code</span>
                  </button>
                </div>

                {isAddingDiscount && (
                  <form onSubmit={handleSaveDiscount} className="bg-neutral-900 border border-neutral-800 p-5 space-y-4">
                    <span className="text-[10px] font-black tracking-widest text-white uppercase block border-b border-neutral-800 pb-2">
                      New Promo campaign specifications
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Coupon Code</label>
                        <input
                          type="text"
                          required
                          value={discountForm.code}
                          onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value })}
                          placeholder="e.g. SUMMER25"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2 px-3 outline-none focus:border-neutral-700 text-white font-mono uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Discount rate (%)</label>
                        <input
                          type="number"
                          required
                          value={discountForm.discountRate}
                          onChange={(e) => setDiscountForm({ ...discountForm, discountRate: Number(e.target.value) })}
                          placeholder="e.g. 15"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2 px-3 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Min. Purchase (EGP)</label>
                        <input
                          type="number"
                          value={discountForm.minSpend}
                          onChange={(e) => setDiscountForm({ ...discountForm, minSpend: Number(e.target.value) })}
                          placeholder="e.g. 10000"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2 px-3 outline-none focus:border-neutral-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black text-neutral-400">Campaign Status</label>
                        <select
                          value={discountForm.status}
                          onChange={(e) => setDiscountForm({ ...discountForm, status: e.target.value as 'active' | 'inactive' })}
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2 px-3 outline-none focus:border-neutral-700 text-white cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingDiscount(false)}
                        className="flex-1 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 font-bold text-xs py-2.5 uppercase tracking-widest cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold text-xs py-2.5 uppercase tracking-widest cursor-pointer"
                      >
                        Deploy Campaign
                      </button>
                    </div>
                  </form>
                )}

                <div className="bg-neutral-900 border border-neutral-800 p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                          <th className="pb-3 font-semibold">Promo code</th>
                          <th className="pb-3 font-semibold">Privilege rate</th>
                          <th className="pb-3 font-semibold">Min Spend Required</th>
                          <th className="pb-3 font-semibold">Campaign Status</th>
                          <th className="pb-3 font-semibold">Simulated Usages</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/40">
                        {discountCodes.map(d => (
                          <tr key={d.code} className="hover:bg-neutral-900/30">
                            <td className="py-4 font-mono font-bold text-white uppercase tracking-widest text-xs">
                              {d.code}
                            </td>
                            <td className="py-4 font-bold text-neutral-100">{d.discountRate * 100}% Off</td>
                            <td className="py-4 text-neutral-400">
                              {d.minSpend > 0 ? `${d.minSpend.toLocaleString()} EGP` : 'None'}
                            </td>
                            <td className="py-4">
                              <button
                                onClick={() => handleToggleDiscountStatus(d.code)}
                                className={`text-[8.5px] px-2 py-0.5 border font-extrabold uppercase tracking-wider cursor-pointer ${
                                  d.status === 'active' 
                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900' 
                                    : 'bg-red-950/40 text-red-400 border-red-900'
                                }`}
                              >
                                {d.status}
                              </button>
                            </td>
                            <td className="py-4 text-neutral-500 font-mono">{d.usageCount} checkouts</td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => handleDeleteDiscount(d.code)}
                                className="p-1.5 hover:text-red-400 text-neutral-500 cursor-pointer"
                                title="Delete privilege code"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 8. MOVIQ ASSISTANT BRAND BOOK ==================== */}
            {activeTab === 'brand' && (
              <motion.div
                key="tab-brand"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 text-white"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 uppercase tracking-widest font-bold flex items-center gap-1">
                      <Sparkles size={10} className="animate-spin" /> Official Asset System
                    </span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1.5">3D Brand Character System</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-light">The complete 3D design guidelines and interactive poses for the official mascot &ldquo;MOVIQ Assistant&rdquo;.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Identity card */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4 md:col-span-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-800/80 pb-2">Character Profile</h3>
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-neutral-500 block uppercase text-[9px] font-bold">Mascot Name</span>
                        <span className="text-white font-bold font-mono">MOVIQ Assistant</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[9px] font-bold">Species Archetype</span>
                        <span className="text-white font-bold">Futuristic Winged Snow Leopard</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[9px] font-bold">Brand Persona</span>
                        <span className="text-white">Luxury couture concierge, friendly, refined, tech-forward, helping users select high-fashion streetwear.</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[9px] font-bold">Material Definition</span>
                        <span className="text-white">Smooth premium 3D matte finish, soft metallic-golden wing highlights, expressive LCD eyes.</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block uppercase text-[9px] font-bold">Color Palette</span>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="flex items-center gap-1 bg-neutral-950 px-2 py-1 border border-neutral-800 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-700 block" /> White</span>
                          <span className="flex items-center gap-1 bg-neutral-950 px-2 py-1 border border-neutral-800 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-neutral-800 block" /> Slate Gray</span>
                          <span className="flex items-center gap-1 bg-neutral-950 px-2 py-1 border border-neutral-800 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] block" /> Gold Accent</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Character Specs */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4 md:col-span-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-800/80 pb-2">Guidelines &amp; System Purpose</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Designed to serve as the friendly, recognizable face of the MOVIQ ecosystem. These 12 official high-fidelity 3D renders maintain consistent body proportions, feline-athletic anatomy, and golden-winged accents across all e-commerce channels, mobile apps, and marketing banners.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div className="border border-neutral-800 p-3 bg-neutral-950/30">
                        <span className="font-bold text-white block uppercase text-[10px] tracking-wide text-yellow-400 mb-1">Consistency Key</span>
                        <span className="text-neutral-400 leading-normal">Ensures identical face morphology, fur patterns, and wings in all digital formats.</span>
                      </div>
                      <div className="border border-neutral-800 p-3 bg-neutral-950/30">
                        <span className="font-bold text-white block uppercase text-[10px] tracking-wide text-yellow-400 mb-1">Digital Concierge</span>
                        <span className="text-neutral-400 leading-normal">Interactive floating mascot reacts on hover, assists in size picking, and celebrates orders.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 12 Poses Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">The 12 Poses &amp; Expressions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {MASCOT_POSES.map((pose) => (
                      <div key={pose.id} className="bg-neutral-900 border border-neutral-800 overflow-hidden group hover:border-neutral-700 transition-all">
                        <div className="aspect-square bg-neutral-950 relative overflow-hidden flex items-center justify-center border-b border-neutral-800">
                          <img
                            src={pose.image}
                            alt={pose.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-[9px] font-mono text-neutral-400 px-2 py-0.5 border border-neutral-800 font-bold">
                            POSE {pose.id}
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">{pose.name}</h4>
                          <p className="text-[10px] text-neutral-400 font-light leading-snug">{pose.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* ==================== ORDER DETAILS MODAL (OVERLAY) ==================== */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 text-white w-full max-w-2xl border border-neutral-800 p-6 md:p-8 relative space-y-6"
            >
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="border-b border-neutral-800 pb-3">
                <span className="text-[9px] uppercase tracking-wider font-black text-neutral-500">Egyptian Courier Audit</span>
                <h3 className="text-sm font-black tracking-widest uppercase text-white font-mono">ORDER DETAIL {selectedOrder.id}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Client contacts */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-black uppercase text-neutral-400 tracking-widest border-b border-neutral-800/80 pb-1">Client Information</h4>
                  <div className="space-y-1.5 font-medium">
                    <p className="text-white font-bold">{selectedOrder.fullName}</p>
                    <p className="text-neutral-400">{selectedOrder.email}</p>
                    <p className="text-neutral-400">{selectedOrder.phone}</p>
                    <p className="text-neutral-500 font-mono text-[10px]">Registered date: {selectedOrder.date}</p>
                  </div>
                </div>

                {/* Delivery coordinates */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-black uppercase text-neutral-400 tracking-widest border-b border-neutral-800/80 pb-1">Courier Destination</h4>
                  <div className="space-y-1.5 text-neutral-300 font-medium">
                    <p>{selectedOrder.address}</p>
                    <p className="font-bold text-white">{selectedOrder.governorate}, Egypt</p>
                    <p className="text-neutral-500 text-[10px]">Method: Complimentary Premium Air Freight</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-neutral-400 tracking-widest border-b border-neutral-800/80 pb-1">Order Items ({selectedOrder.items.length})</h4>
                <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex gap-3 items-center text-xs bg-neutral-950 p-2 border border-neutral-800">
                      <div className="w-10 h-12 bg-neutral-900 border border-neutral-800 p-0.5 flex items-center justify-center shrink-0">
                        <img src={it.image} alt={it.productName} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold block">{it.brand}</span>
                        <h5 className="font-bold text-neutral-200 truncate">{it.productName}</h5>
                        <span className="text-neutral-500 text-[9.5px] font-semibold">
                          Size: EU {it.size} &bull; Qty: {it.quantity} &bull; {it.color.name}
                        </span>
                      </div>
                      <span className="font-bold font-mono text-white text-[11px] whitespace-nowrap">{it.price.toLocaleString()} EGP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-neutral-950 p-4 border border-neutral-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>{selectedOrder.subtotal.toLocaleString()} EGP</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Discount Privilege:</span>
                    <span>-{selectedOrder.discountAmount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Premium Air Freight:</span>
                  <span>{selectedOrder.shippingCost > 0 ? `${selectedOrder.shippingCost} EGP` : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm border-t border-neutral-800 pt-2">
                  <span>Total Settled:</span>
                  <span>{selectedOrder.finalTotal.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-[10px] uppercase font-black tracking-wider px-3 py-2 outline-none text-white cursor-pointer"
                >
                  <option value="Pending Authenticity Audit">Pending Audit</option>
                  <option value="Approved & Dispatched">Approved & Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Returned & Cancelled">Returned & Cancelled</option>
                </select>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer ml-auto"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== TELEGRAM BOT CONFIG MODAL ==================== */}
      <AnimatePresence>
        {showTgConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 text-white w-full max-w-lg border border-neutral-800 p-6 relative space-y-5"
            >
              <button 
                onClick={() => setShowTgConfigModal(false)} 
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="border-b border-neutral-800 pb-3">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-500">Telegram Bot Integration</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Bot Token &amp; Webhook Setup</h3>
              </div>

              <form onSubmit={handleSaveTelegramConfig} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                    Telegram Bot Token (from @BotFather)
                  </label>
                  <input
                    type="password"
                    placeholder={telegramConfig.botTokenMasked ? `Currently set (${telegramConfig.botTokenMasked})` : "e.g. 7123456789:AAE..."}
                    value={botTokenInput}
                    onChange={(e) => setBotTokenInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white font-mono text-xs focus:border-amber-400 outline-none"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Create a bot with @BotFather on Telegram and paste your Bot Token here.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                    Webhook Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-amber-400 font-mono text-xs focus:border-amber-400 outline-none"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    This is the public URL Telegram will send photo events to.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="autoPublishCheck"
                    checked={autoPublishInput}
                    onChange={(e) => setAutoPublishInput(e.target.checked)}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <label htmlFor="autoPublishCheck" className="text-neutral-300 font-medium text-xs cursor-pointer">
                    Auto-Publish imports immediately to website catalog
                  </label>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSetWebhookUrl}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest transition-all border border-neutral-700 cursor-pointer"
                  >
                    Set Webhook via Telegram API
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer ml-auto"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SIMULATE TELEGRAM PHOTO IMPORT MODAL ==================== */}
      <AnimatePresence>
        {showSimulateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 text-white w-full max-w-lg border border-neutral-800 p-6 relative space-y-5"
            >
              <button 
                onClick={() => setShowSimulateModal(false)} 
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="border-b border-neutral-800 pb-3">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-500">Testing &amp; Demo Mode</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Simulate Telegram Photo Webhook</h3>
              </div>

              <form onSubmit={handleSimulatePhotoImport} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                    Image URL (Leave empty for default luxury sneaker sample)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={simPhotoUrl}
                    onChange={(e) => setSimPhotoUrl(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white font-mono text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                    Message Caption (Include Brand, Price, Size range)
                  </label>
                  <textarea
                    rows={3}
                    value={simCaption}
                    onChange={(e) => setSimCaption(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white font-mono text-xs focus:border-amber-400 outline-none"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Example: &quot;Louis Vuitton Trainer Sneaker 14500 EGP - Size 40,41,42,43,44&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSimulateModal(false)}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 font-extrabold text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all cursor-pointer"
                  >
                    Send Test Webhook
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== EDIT PENDING PRODUCT MODAL ==================== */}
      <AnimatePresence>
        {editingPendingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 text-white w-full max-w-xl border border-neutral-800 p-6 relative space-y-5"
            >
              <button 
                onClick={() => setEditingPendingProduct(null)} 
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="border-b border-neutral-800 pb-3">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-500">Pending Import Specs</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Edit Product Details Before Approval</h3>
              </div>

              <form onSubmit={handleSavePendingProductUpdate} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={editingPendingForm.brand}
                      onChange={(e) => setEditingPendingForm({ ...editingPendingForm, brand: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Retail Price (EGP)</label>
                    <input
                      type="number"
                      value={editingPendingForm.salePrice}
                      onChange={(e) => setEditingPendingForm({ ...editingPendingForm, salePrice: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-amber-400 font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editingPendingForm.name}
                    onChange={(e) => setEditingPendingForm({ ...editingPendingForm, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white font-bold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingPendingForm.category}
                      onChange={(e) => setEditingPendingForm({ ...editingPendingForm, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Sizes (comma-separated)</label>
                    <input
                      type="text"
                      value={editingPendingForm.sizes}
                      onChange={(e) => setEditingPendingForm({ ...editingPendingForm, sizes: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Description / Notes</label>
                  <textarea
                    rows={3}
                    value={editingPendingForm.description}
                    onChange={(e) => setEditingPendingForm({ ...editingPendingForm, description: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPendingProduct(null)}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 font-extrabold text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
