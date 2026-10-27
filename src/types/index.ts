export interface ProductColor {
  name: string;
  nameFr: string;
  hex: string;
  inStock: boolean;
}

export interface ProductSpecs {
  capacity: string;
  laptopSize: string;
  waterproof: boolean;
  weight: string;
  dimensions: string;
  material: string;
}

export interface Product {
  id: string;
  name: string;
  nameFr: string;
  category: string;
  categoryFr: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  images?: string[];
  badges: string[];
  badgesFr?: string[];
  specBadge: string;
  specBadgeFr?: string;
  featureBadge: string;
  featureBadgeFr?: string;
  description: string;
  descriptionFr: string;
  stock: number;
  colors: ProductColor[];
  specs: ProductSpecs;
  featured?: boolean;
  bestSeller?: boolean;
  active?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  color: string;
  price: number;
  image: string;
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  storeName: string;
  storeNameFr: string;
  slogan: string;
  sloganFr: string;
  announcementText: string;
  announcementTextFr: string;
  whatsappNumber: string;
  supportEmail: string;
  freeShippingThreshold: number;
  heroTitle: string;
  heroTitleFr: string;
  heroSubtitle: string;
  heroSubtitleFr: string;
  visibleSections: {
    announcement: boolean;
    hero: boolean;
    categories: boolean;
    featured: boolean;
    bestSellers: boolean;
    promoBanner: boolean;
    testimonials: boolean;
    faq: boolean;
    guarantees: boolean;
  };
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  approved?: boolean;
  reply?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  active: boolean;
  usageCount: number;
  expiresAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'backpacks' | 'banners' | 'icons' | 'branding';
  size: string;
  createdAt: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  titleFr?: string;
  content: string;
  contentFr?: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  label: string;
  labelFr?: string;
  url: string;
  target?: '_self' | '_blank';
}

export interface NavigationMenus {
  headerMenu: MenuItem[];
  footerMenu: MenuItem[];
}

export interface SectionStyle {
  paddingY?: string;
  paddingX?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: string;
  textAlign?: 'right' | 'center' | 'left';
  animation?: 'none' | 'fade' | 'slide-up' | 'pulse';
}

export type SectionType =
  | 'announcement'
  | 'header'
  | 'hero'
  | 'guarantees'
  | 'categories'
  | 'grid'
  | 'banner_duo'
  | 'testimonials'
  | 'faq'
  | 'footer'
  | 'custom_banner'
  | 'rich_text';

export interface BuilderSection {
  id: string;
  type: SectionType;
  name: string;
  visible: boolean;
  content: Record<string, any>;
  styles: SectionStyle;
}

export interface ThemeConfig {
  primaryGold: string;
  brightGold: string;
  bgMain: string;
  bgCard: string;
  textWhite: string;
  textMuted: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  cardStyle: 'bordered-gold' | 'minimal' | 'solid-dark' | 'glow';
  gridColumnsDesktop: number;
  animationSpeed: 'slow' | 'normal' | 'fast';
  mobileSpacing: 'compact' | 'normal' | 'spacious';
}

export interface ThemeDraft {
  version: number;
  sections: BuilderSection[];
  theme: ThemeConfig;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'manager';
  email: string;
  lastLogin?: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  defaultFee: number;
  deliveryEstimateMajor: string;
  deliveryEstimateOther: string;
  cities: { name: string; fee: number; enabled: boolean }[];
}

export interface PaymentSettings {
  codEnabled: boolean;
  codTitle: string;
  codInstructions: string;
  whatsappOrdersEnabled: boolean;
  bankTransferEnabled: boolean;
  ribBankDetails: string;
}
