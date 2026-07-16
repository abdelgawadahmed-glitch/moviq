export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  image: string;
  gallery: string[];
  originalPrice: number;
  salePrice: number;
  discount: number;
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  details: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isLuxury?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface FilterState {
  brand: string;
  category: string;
  size: string;
  color: string;
  priceRange: [number, number];
  searchQuery: string;
  sortBy: 'featured' | 'bestselling' | 'low-high' | 'high-low' | 'newest';
}
