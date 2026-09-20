export type PlanId = 'basic' | 'premium';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type ThemeId =
  | 'emerald'
  | 'midnight'
  | 'sand'
  | 'coral'
  | 'noir'
  | 'royal'
  | 'rose'
  | 'nordic';

export type ProductLayout = 'grid' | 'list';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  images: string[];
  stock: number;
  sizes: string[];
  colors: ColorOption[];
  available: boolean;
  promo: boolean;
  featured: boolean;
  hidden: boolean;
  views: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
}

export type OrderStatus =
'nouvelle' |
'confirmee' |
'preparation' |
'expediee' |
'livree' |
'annulee';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  channel: 'whatsapp' | 'catalogue';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  city: string;
  ordersCount: number;
  spent: number;
  lastOrder: string;
}

export interface StoreAnalytics {
  visitors7d: number;
  visitors30d: number;
  daily: Array<{ date: string; visitors: number }>;
}

export interface Store {
  name: string;
  slug: string;
  category: string;
  description: string;
  logo: string;
  cover: string;
  coverMobile: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  theme: ThemeId;
  layout: ProductLayout;
  font: 'Geist' | 'Georgia' | 'Trebuchet MS';
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel: string;
  showBranding: boolean;
  plan: PlanId;
  newsletterAvailable: boolean;
  verificationStatus: VerificationStatus;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  plan: PlanId;
}

export interface CartLine extends OrderItem {
  lineId: string;
}

export interface ProductDraft {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  categoryId: string;
  images: string[];
  stock: string;
  sizes: string[];
  colors: ColorOption[];
  available: boolean;
  promo: boolean;
  featured: boolean;
  hidden: boolean;
}

export interface CheckoutDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  note: string;
}
