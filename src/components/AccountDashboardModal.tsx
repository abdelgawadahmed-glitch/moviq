import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, ShoppingBag, Heart, MapPin, Settings, LogOut, 
  Check, Save, Edit2, Plus, Trash2, ShieldCheck, Mail, Phone, 
  Calendar, Star, CreditCard, ChevronRight, Bell, Sparkles, KeyRound
} from 'lucide-react';
import { Product } from '../types';

interface AccountDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

interface SavedAddress {
  id: string;
  name: string;
  address: string;
  governorate: string;
  zip: string;
  phone: string;
  isDefault: boolean;
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

const EGYPT_GOVERNORATES = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Dakahlia', 'Gharbia', 
  'Monufia', 'Sharqia', 'Beheira', 'Damietta', 'Port Said', 'Ismailia', 
  'Suez', 'Kafr El Sheikh', 'Fayoum', 'Beni Suef', 'Minya', 'Assiut', 
  'Sohag', 'Qena', 'Luxor', 'Aswan', 'Red Sea', 'New Valley', 'Matrouh', 
  'North Sinai', 'South Sinai'
];

export default function AccountDashboardModal({
  isOpen,
  onClose,
  products
}: AccountDashboardModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('profile');

  // Profile States
  const [profile, setProfile] = useState({
    name: 'Aly Ibrahim',
    email: 'aly.ibrahim@outlook.com',
    phone: '+20 100 123 4567',
    birthday: '1994-04-12',
    shoeSize: '42',
    tier: 'Platine Ambassador',
    memberSince: 'December 2024'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Orders State
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  // Addresses States
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form State
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrGov, setAddrGov] = useState('Cairo');
  const [addrZip, setAddrZip] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  // Wishlist list
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Settings State
  const [settings, setSettings] = useState({
    orderUpdates: true,
    newsletter: false,
    exclusiveInvites: true,
    twoFactor: false
  });
  const [passwordState, setPasswordState] = useState({ current: '', new: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Logout confirm modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load user data from LocalStorage
  useEffect(() => {
    // 1. Profile
    const savedProfile = localStorage.getItem('moviq_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      localStorage.setItem('moviq_profile', JSON.stringify(profile));
    }

    // 2. Orders with high-end luxury default mock history
    const savedOrders = localStorage.getItem('moviq_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const defaultOrders: SavedOrder[] = [
        {
          id: 'MVQ-843201',
          date: 'July 2, 2026',
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
          date: 'June 18, 2026',
          items: [
            {
              productName: 'Balenciaga Triple S Black White Red',
              brand: 'Balenciaga',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
              quantity: 1,
              price: 14500,
              size: '42',
              color: { name: 'Black Red', hex: '#111' }
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
        }
      ];
      setOrders(defaultOrders);
      localStorage.setItem('moviq_orders', JSON.stringify(defaultOrders));
    }

    // 3. Addresses with defaults
    const savedAddresses = localStorage.getItem('moviq_addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      const defaultAddresses: SavedAddress[] = [
        {
          id: 'addr-1',
          name: 'Zamalek Residence (Home)',
          address: '15 El-Gezira St, Floor 4, Apt 12',
          governorate: 'Cairo',
          zip: '11211',
          phone: '+20 100 123 4567',
          isDefault: true
        },
        {
          id: 'addr-2',
          name: 'Arkan Office (Work)',
          address: 'Arkan Plaza, Building 4, Floor 2',
          governorate: 'Giza',
          zip: '12588',
          phone: '+20 102 987 6543',
          isDefault: false
        }
      ];
      setAddresses(defaultAddresses);
      localStorage.setItem('moviq_addresses', JSON.stringify(defaultAddresses));
    }
  }, []);

  // Sync Wishlist from storage
  useEffect(() => {
    if (isOpen) {
      const savedWishlistStr = localStorage.getItem('moviq_wishlist') || '[]';
      try {
        const savedWishlistIds: string[] = JSON.parse(savedWishlistStr);
        const filtered = products.filter(p => savedWishlistIds.includes(p.id));
        setWishlistItems(filtered);
      } catch (err) {
        console.error(err);
      }
    }
  }, [isOpen, products]);

  // Handle saving profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('moviq_profile', JSON.stringify(profile));
    setIsEditingProfile(false);
    setSaveSuccessMessage('Atelier profile updated successfully.');
    setTimeout(() => setSaveSuccessMessage(''), 4000);
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrName('');
    setAddrStreet('');
    setAddrGov('Cairo');
    setAddrZip('');
    setAddrPhone('');
    setAddrDefault(addresses.length === 0);
    setIsAddingAddress(true);
  };

  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name);
    setAddrStreet(addr.address);
    setAddrGov(addr.governorate);
    setAddrZip(addr.zip);
    setAddrPhone(addr.phone);
    setAddrDefault(addr.isDefault);
    setIsAddingAddress(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: SavedAddress[];

    const freshAddress: SavedAddress = {
      id: editingAddressId || `addr-${Date.now()}`,
      name: addrName.trim(),
      address: addrStreet.trim(),
      governorate: addrGov,
      zip: addrZip.trim(),
      phone: addrPhone.trim(),
      isDefault: addrDefault
    };

    if (addrDefault) {
      // Set all others to false first
      updated = addresses.map(a => ({ ...a, isDefault: false }));
    } else {
      updated = [...addresses];
    }

    if (editingAddressId) {
      updated = updated.map(a => a.id === editingAddressId ? freshAddress : a);
    } else {
      updated.push(freshAddress);
    }

    // Make sure we have at least one default if list is not empty
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }

    setAddresses(updated);
    localStorage.setItem('moviq_addresses', JSON.stringify(updated));
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id: string) => {
    let updated = addresses.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    localStorage.setItem('moviq_addresses', JSON.stringify(updated));
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem('moviq_addresses', JSON.stringify(updated));
  };

  // Remove from wishlist directly
  const handleRemoveFromWishlist = (pId: string) => {
    const savedWishlistStr = localStorage.getItem('moviq_wishlist') || '[]';
    try {
      let wishlistIds: string[] = JSON.parse(savedWishlistStr);
      wishlistIds = wishlistIds.filter(id => id !== pId);
      localStorage.setItem('moviq_wishlist', JSON.stringify(wishlistIds));
      
      // Dispatch storage event to keep other UI elements in sync
      window.dispatchEvent(new Event('storage'));
      
      // Refresh current visual tab
      setWishlistItems(prev => prev.filter(p => p.id !== pId));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle settings checkbox changes
  const handleToggleSetting = (key: keyof typeof settings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
  };

  // Handle password submission
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordState.new.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordState.new !== passwordState.confirm) {
      setPasswordError('Confirmation password does not match.');
      return;
    }

    setPasswordSuccess('Password secured and updated successfully.');
    setPasswordState({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  // Reset all states and close
  const handleLogout = () => {
    localStorage.removeItem('moviq_profile');
    localStorage.removeItem('moviq_orders');
    localStorage.removeItem('moviq_addresses');
    localStorage.removeItem('moviq_wishlist');
    localStorage.removeItem('moviq_cart');

    // Trigger full app reload to completely clean guest environment
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" id="account-dashboard-portal">
      {/* Dimmed glass overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 cursor-pointer backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Main Glass Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
        className="relative bg-white text-black w-full max-w-5xl rounded-none z-10 grid grid-cols-1 md:grid-cols-12 h-[85vh] md:h-[75vh] max-h-[800px] overflow-hidden shadow-2xl border border-neutral-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black hover:bg-neutral-150 transition-all rounded-full cursor-pointer"
          aria-label="Close Account Dashboard"
        >
          <X size={18} />
        </button>

        {/* LEFT COLUMN: Sidebar Navigation & Member Card (md:col-span-4) */}
        <div className="md:col-span-4 bg-neutral-950 text-white p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800" id="account-sidebar">
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="flex items-center gap-3.5 border-b border-neutral-800 pb-5">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-tr from-stone-800 to-neutral-700 border-2 border-stone-500 rounded-full flex items-center justify-center text-lg font-serif font-black tracking-widest text-stone-200">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1 rounded-full text-black" title="Platinum Member">
                  <Sparkles size={10} />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black tracking-widest uppercase text-stone-300">{profile.tier}</h4>
                <p className="text-sm font-sans font-bold text-white line-clamp-1">{profile.name}</p>
                <p className="text-[10px] text-neutral-400 font-medium italic">{profile.email}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none" id="dashboard-nav-tabs">
              <button
                onClick={() => { setActiveSubTab('profile'); setIsAddingAddress(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeSubTab === 'profile'
                    ? 'bg-white text-black font-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <User size={13} />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => { setActiveSubTab('orders'); setIsAddingAddress(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeSubTab === 'orders'
                    ? 'bg-white text-black font-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <ShoppingBag size={13} />
                <span>Order History</span>
                {orders.length > 0 && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-auto ${activeSubTab === 'orders' ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveSubTab('wishlist'); setIsAddingAddress(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeSubTab === 'wishlist'
                    ? 'bg-white text-black font-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Heart size={13} />
                <span>My Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-auto ${activeSubTab === 'wishlist' ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveSubTab('addresses'); setIsAddingAddress(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeSubTab === 'addresses'
                    ? 'bg-white text-black font-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <MapPin size={13} />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => { setActiveSubTab('settings'); setIsAddingAddress(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-extrabold transition-all shrink-0 cursor-pointer ${
                  activeSubTab === 'settings'
                    ? 'bg-white text-black font-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Settings size={13} />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Logout Action Area */}
          <div className="pt-4 border-t border-neutral-800 hidden md:block">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-3 w-full px-4 py-3 text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300 hover:bg-neutral-900/40 transition-colors cursor-pointer text-left"
            >
              <LogOut size={13} />
              <span>Logout Account</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Dynamic Action Content Area (md:col-span-8) */}
        <div className="md:col-span-8 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between scrollbar-thin bg-white text-black h-full" id="account-content-side">
          
          <AnimatePresence mode="wait">
            
            {/* 1. PROFILE SUBTAB */}
            {activeSubTab === 'profile' && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-neutral-100 pb-4 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-400">Atelier Membership</span>
                    <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-black">Private Identity Profile</h3>
                  </div>
                  
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-neutral-500 hover:text-black hover:bg-neutral-50 px-2.5 py-1.5 border border-neutral-200"
                    >
                      <Edit2 size={11} />
                      <span>Edit Info</span>
                    </button>
                  )}
                </div>

                {saveSuccessMessage && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-none font-semibold">
                    <Check size={14} />
                    <span>{saveSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Full Atelier Name
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-semibold disabled:opacity-60 disabled:bg-neutral-50/50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Atelier Registered Email
                      </label>
                      <input
                        type="email"
                        disabled={!isEditingProfile}
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-semibold disabled:opacity-60 disabled:bg-neutral-50/50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Mobile Telephone Contact
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-semibold disabled:opacity-60 disabled:bg-neutral-50/50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Birthday Calendar Date
                      </label>
                      <input
                        type="date"
                        disabled={!isEditingProfile}
                        value={profile.birthday}
                        onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-semibold disabled:opacity-60 disabled:bg-neutral-50/50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Shoe Size (EU Standard Sizing)
                      </label>
                      <select
                        disabled={!isEditingProfile}
                        value={profile.shoeSize}
                        onChange={(e) => setProfile({ ...profile, shoeSize: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-3 px-4 outline-none rounded-none font-semibold disabled:opacity-60 disabled:bg-neutral-50/50 disabled:cursor-not-allowed"
                      >
                        {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'].map((sz) => (
                          <option key={sz} value={sz}>EU {sz}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Membership Joined
                      </label>
                      <div className="w-full bg-neutral-50/30 border border-neutral-200/50 text-neutral-500 text-xs py-3 px-4 font-semibold select-none">
                        {profile.memberSince}
                      </div>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold text-xs py-3 uppercase tracking-widest rounded-none transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3 uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save size={13} />
                        <span>Save Atelier Profile</span>
                      </button>
                    </div>
                  )}
                </form>

                {/* Platinum Perks Section */}
                <div className="bg-neutral-50 p-4 border border-neutral-200/50 space-y-2.5">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-black flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-stone-700" />
                    <span>Platine Privé Ambassador Perks</span>
                  </h4>
                  <ul className="text-[11px] text-neutral-600 space-y-1.5 font-medium pl-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-black rounded-full" />
                      <span>Complimentary private armored air freight shipping with zero minimum purchase order</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-black rounded-full" />
                      <span>Atelier early notification for limited release Nike, Jordan and Balenciaga sneaker collaborations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-black rounded-full" />
                      <span>Invitation invitations to annual luxury lounge exhibitions in Giza, Egypt</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* 2. ORDER HISTORY SUBTAB */}
            {activeSubTab === 'orders' && (
              <motion.div
                key="tab-orders"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-400">Atelier Ledger</span>
                  <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-black">Private Order History</h3>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mx-auto text-neutral-300 border border-neutral-150">
                      <ShoppingBag size={20} />
                    </div>
                    <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
                      No orders recorded. Complete checkouts to securely register your sneaker collection here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin" id="orders-list-scroll">
                    {orders.map((ord) => (
                      <div key={ord.id} className="border border-neutral-200 p-4 space-y-3 hover:border-neutral-300 transition-colors">
                        {/* Order info header */}
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-neutral-100 pb-2 text-[10px] font-bold uppercase">
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-500">Order ID:</span>
                            <span className="font-mono text-black font-extrabold">{ord.id}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-500">Placed:</span>
                            <span className="text-neutral-800">{ord.date}</span>
                          </div>
                          <div>
                            <span className={`text-[8.5px] px-2 py-0.5 border font-extrabold ${
                              ord.status === 'Delivered' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                                : 'bg-neutral-50 text-neutral-800 border-neutral-200'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items list */}
                        <div className="space-y-2.5">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex gap-3 items-center text-xs">
                              <div className="w-11 aspect-[3/4] bg-neutral-50 border border-neutral-100 p-0.5 flex items-center justify-center shrink-0">
                                <img src={it.image} alt={it.productName} className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[8px] tracking-wider text-neutral-400 uppercase font-bold block">{it.brand}</span>
                                <h5 className="font-bold text-neutral-900 line-clamp-1">{it.productName}</h5>
                                <span className="text-neutral-500 text-[9.5px] font-semibold">
                                  Size: EU {it.size} &bull; Qty: {it.quantity} &bull; {it.color.name}
                                </span>
                              </div>
                              <span className="font-bold font-mono text-neutral-900">{it.price.toLocaleString()} EGP</span>
                            </div>
                          ))}
                        </div>

                        {/* Totals */}
                        <div className="flex justify-between items-center border-t border-dashed border-neutral-150 pt-2.5 text-[11px]">
                          <div className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px]">
                            Paid via: <strong className="text-neutral-800 uppercase font-mono">{ord.paymentMethod === 'cod' ? 'Cash On Delivery' : ord.paymentMethod}</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-neutral-500 font-medium mr-1.5">Total Amount Paid:</span>
                            <span className="font-bold text-neutral-950 font-mono text-xs">
                              {ord.finalTotal.toLocaleString()} EGP
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. MY WISHLIST SUBTAB */}
            {activeSubTab === 'wishlist' && (
              <motion.div
                key="tab-wishlist"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-400">Atelier Desires</span>
                  <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-black">Private Sneaker Wishlist</h3>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mx-auto text-neutral-300 border border-neutral-150">
                      <Heart size={20} />
                    </div>
                    <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
                      Your wishlist is empty. Add luxurious designer sneakers from our homepage or collections showcase.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin" id="wishlist-grid-scroll">
                    {wishlistItems.map((p) => (
                      <div key={p.id} className="border border-neutral-200 p-3.5 flex gap-3 hover:border-neutral-300 transition-colors relative group">
                        {/* Image */}
                        <div className="w-16 h-20 bg-neutral-50 border border-neutral-100 flex items-center justify-center p-1 relative overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                        </div>

                        {/* Meta */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <span className="text-[8px] tracking-wider text-neutral-400 font-bold uppercase block">{p.brand}</span>
                            <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{p.name}</h4>
                            <span className="font-serif font-black text-xs text-neutral-900 block mt-1">
                              {p.salePrice.toLocaleString()} EGP
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2">
                            <button
                              onClick={() => handleRemoveFromWishlist(p.id)}
                              className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1 px-1.5 border border-transparent transition-all rounded-xs"
                              title="Delete from wishlist"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. SAVED ADDRESSES SUBTAB */}
            {activeSubTab === 'addresses' && (
              <motion.div
                key="tab-addresses"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="border-b border-neutral-100 pb-3 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-400">Atelier Destinations</span>
                    <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-black">Delivery Addresses</h3>
                  </div>
                  
                  {!isAddingAddress && (
                    <button
                      onClick={handleOpenAddAddress}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-white bg-black hover:bg-neutral-800 px-3 py-2 transition-all cursor-pointer"
                    >
                      <Plus size={11} />
                      <span>Add Address</span>
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4 bg-neutral-50 p-5 border border-neutral-200">
                    <span className="text-[10px] font-black tracking-widest text-black uppercase block">
                      {editingAddressId ? 'Edit saved address' : 'Create new courier destination'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          Address Label Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          placeholder="e.g. Home (Zamalek), Work Office"
                          className="w-full bg-white border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-semibold text-black placeholder:text-neutral-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          Mobile Contact *
                        </label>
                        <input
                          type="text"
                          required
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          placeholder="e.g. +20 100 123 4567"
                          className="w-full bg-white border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-semibold text-black placeholder:text-neutral-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Full Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        placeholder="e.g. 15 El-Gezira St, Floor 4, Apt 12"
                        className="w-full bg-white border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-semibold text-black placeholder:text-neutral-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          Governorate *
                        </label>
                        <select
                          value={addrGov}
                          onChange={(e) => setAddrGov(e.target.value)}
                          className="w-full bg-white border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-semibold text-black cursor-pointer"
                        >
                          {EGYPT_GOVERNORATES.map(gov => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          ZIP / Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={addrZip}
                          onChange={(e) => setAddrZip(e.target.value)}
                          placeholder="e.g. 11211"
                          className="w-full bg-white border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-semibold text-black placeholder:text-neutral-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1.5">
                      <input
                        type="checkbox"
                        id="default-check"
                        checked={addrDefault}
                        onChange={(e) => setAddrDefault(e.target.checked)}
                        className="w-3.5 h-3.5 border-neutral-300 rounded-none text-black focus:ring-black cursor-pointer"
                      />
                      <label htmlFor="default-check" className="text-[10px] text-neutral-600 uppercase font-bold tracking-wider cursor-pointer">
                        Set as Default Delivery Destination
                      </label>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="flex-1 border border-neutral-200 hover:bg-neutral-100 text-neutral-600 font-bold text-xs py-3 uppercase tracking-widest rounded-none transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3 uppercase tracking-widest rounded-none transition-all cursor-pointer"
                      >
                        {editingAddressId ? 'Save Changes' : 'Save Destination'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin" id="addresses-list-scroll">
                    {addresses.length === 0 ? (
                      <div className="text-center py-16 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mx-auto text-neutral-300 border border-neutral-150">
                          <MapPin size={20} />
                        </div>
                        <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
                          No saved addresses. Add dynamic Egyptian courier addresses here.
                        </p>
                      </div>
                    ) : (
                      addresses.map((a) => (
                        <div key={a.id} className={`border p-4 space-y-2 relative transition-all ${a.isDefault ? 'border-neutral-950 bg-neutral-50/20' : 'border-neutral-200 hover:border-neutral-300'}`}>
                          
                          {/* Label badge */}
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-neutral-900">{a.name}</span>
                            {a.isDefault && (
                              <span className="bg-black text-white text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5">
                                Default Destination
                              </span>
                            )}
                          </div>

                          {/* Address details */}
                          <div className="text-xs text-neutral-600 space-y-1 font-medium pt-1">
                            <p>{a.address}</p>
                            <p>{a.governorate} &bull; Postal Code: {a.zip}</p>
                            <p className="flex items-center gap-1.5 text-[10.5px] text-neutral-500 pt-0.5">
                              <Phone size={10} />
                              <span>{a.phone}</span>
                            </p>
                          </div>

                          {/* Actions bar */}
                          <div className="flex gap-4 border-t border-neutral-100 pt-3 mt-3.5 text-[9px] uppercase tracking-widest font-extrabold text-neutral-400">
                            {!a.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(a.id)}
                                className="hover:text-black transition-colors cursor-pointer"
                              >
                                Set default
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEditAddress(a)}
                              className="hover:text-black transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(a.id)}
                              className="hover:text-red-600 transition-colors cursor-pointer ml-auto text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. SETTINGS SUBTAB */}
            {activeSubTab === 'settings' && (
              <motion.div
                key="tab-settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-neutral-400">Atelier Control Panel</span>
                  <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-black">Account Settings</h3>
                </div>

                {/* Notifications segment */}
                <div className="space-y-3.5 border-b border-neutral-100 pb-5">
                  <span className="text-[10px] font-black tracking-widest text-black uppercase block border-b border-neutral-50 pb-1.5">
                    Atelier Communication Preferences
                  </span>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">Order Courier Status Alerts</h4>
                        <p className="text-[10px] text-neutral-500 font-light mt-0.5 leading-relaxed">
                          Receive real-time automated SMS and emails regarding leather texture audits and courier dispatch.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.orderUpdates}
                        onChange={() => handleToggleSetting('orderUpdates')}
                        className="w-4 h-4 border-neutral-300 rounded-none text-black focus:ring-black cursor-pointer shrink-0"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4 pt-1.5">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">Atelier Seasonal Newsletters</h4>
                        <p className="text-[10px] text-neutral-500 font-light mt-0.5 leading-relaxed">
                          Get luxury styling tips, shoe lookbooks and editorial profiles about Dior and Jordan design directors.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.newsletter}
                        onChange={() => handleToggleSetting('newsletter')}
                        className="w-4 h-4 border-neutral-300 rounded-none text-black focus:ring-black cursor-pointer shrink-0"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4 pt-1.5">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">Private Privé Invitations</h4>
                        <p className="text-[10px] text-neutral-500 font-light mt-0.5 leading-relaxed">
                          Receive custom digital invitation credentials for private seasonal sales and limited-edition sneakers.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.exclusiveInvites}
                        onChange={() => handleToggleSetting('exclusiveInvites')}
                        className="w-4 h-4 border-neutral-300 rounded-none text-black focus:ring-black cursor-pointer shrink-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Password segment */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black tracking-widest text-black uppercase block border-b border-neutral-50 pb-1.5">
                    Update Security Password
                  </span>

                  {passwordSuccess && (
                    <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 font-semibold rounded-none">
                      ✓ {passwordSuccess}
                    </div>
                  )}
                  {passwordError && (
                    <div className="text-xs text-red-800 bg-red-50 border border-red-100 p-3 font-semibold rounded-none">
                      ⚠️ {passwordError}
                    </div>
                  )}

                  <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        Current Account Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordState.current}
                        onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-mono text-black placeholder:text-neutral-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          New Secure Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordState.new}
                          onChange={(e) => setPasswordState({ ...passwordState, new: e.target.value })}
                          placeholder="At least 6 chars"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-mono text-black placeholder:text-neutral-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordState.confirm}
                          onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                          placeholder="Re-type password"
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black text-xs py-2.5 px-3.5 outline-none rounded-none font-mono text-black placeholder:text-neutral-300"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3 px-6 uppercase tracking-widest rounded-none transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <KeyRound size={13} />
                      <span>Update Credentials</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          
          {/* Mobile visible logout button */}
          <div className="border-t border-neutral-100 pt-4 mt-6 block md:hidden">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center gap-2.5 w-full bg-red-50 text-red-600 font-extrabold text-xs py-3 uppercase tracking-widest rounded-none border border-red-100 transition-colors"
            >
              <LogOut size={13} />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. LOGOUT CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 cursor-pointer backdrop-blur-xs"
              onClick={() => setShowLogoutConfirm(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-sm w-full bg-white p-6 shadow-2xl border border-neutral-200 text-center space-y-4 z-20 rounded-none"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-500">
                <LogOut size={20} />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-black">Confirm Logout</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  Are you sure you want to log out of your Moviq Club Privé account? This will clear all stored local configurations, order histories, and addresses.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 border border-neutral-200 hover:bg-neutral-100 text-neutral-600 font-bold text-xs py-2.5 uppercase tracking-widest rounded-none transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 uppercase tracking-widest rounded-none transition-all cursor-pointer"
                >
                  Confirm Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
