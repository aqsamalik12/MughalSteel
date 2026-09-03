export type ProjectCategory = 
  | 'Housing Society'
  | 'Modern Home'
  | 'Classical Home'
  | 'Commercial'
  | 'Modern Farmhouse'
  | 'Classical Farmhouse'
  | 'Village House'
  | 'Farm'
  | 'Small Villa'
  | 'Aluminum & Glass';

export type ProductItemType = 
  | 'Front Gates'
  | 'Main Gates'
  | 'Railing'
  | 'Stair Railing'
  | 'Balcony Railing'
  | 'Grills'
  | 'Doors'
  | 'Windows'
  | 'Boundary Wall Grills'
  | 'Aluminum & Glass Partitions'
  | 'Steel Structures'
  | 'Sheds & Canopies';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'customer';
  isAdmin?: boolean;
  phone?: string;
  address?: Address;
  addresses?: Address[];
}

export interface ProductGalleryViews {
  front: string;
  back?: string;
  leftSide?: string;
  rightSide?: string;
  side?: string; // legacy alias for left/right
  detail?: string;
  installation?: string;
}

export interface Product {
  id: string;
  productCode: string; // e.g. MFG-001
  name: string;
  slug: string;
  sku?: string;
  category: ProjectCategory | string;
  subcategory?: string;
  item: ProductItemType | string;
  description: string;
  shortDescription?: string;
  pricePerSqFt: number; // Base rate in PKR (e.g. 2800)
  price?: number; // legacy alias
  salePrice?: number;
  featured?: boolean;
  newArrival?: boolean;
  sale?: boolean;
  images: string[];
  frontImage?: string;
  backImage?: string;
  leftSideImage?: string;
  rightSideImage?: string;
  sideImage?: string;
  detailImage?: string;
  installationImage?: string;
  galleryViews?: ProductGalleryViews;
  isDemoVisual?: boolean;
  materials: string[];
  finishes: string[];
  glassOptions?: string[];
  hardwareOptions?: string[];
  customization?: string[];
  availableSizes?: string[];
  relatedProducts?: string[];
  rating?: number;
  stock?: number;
  tags?: string[];
  width?: number[];
  height?: number[];
  sizes?: string[];
  availability?: string;
  style?: string;
  application?: string;
  createdAt?: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  city?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productImage: string;
  category: string;
  item: string;
  width: number; // in feet
  height: number; // in feet
  area: number; // sq.ft
  pricePerSqFt: number;
  price?: number;
  quantity: number;
  totalPrice: number;
  material?: string;
  finish?: string;
  glass?: string;
  customNotes?: string;
  sku?: string;
  couponCode?: string;
  selectedOptions?: {
    width?: number;
    height?: number;
    finish?: string;
    glass?: string;
    hardware?: string;
    sidelights?: string;
    transom?: string;
  };
}

export interface Quote {
  id: string;
  quoteNumber?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city: string;
    state?: string;
    zip?: string;
  };
  projectType: string;
  productCategory: string;
  productItem?: string;
  productCode?: string;
  doorStyle?: string;
  dimensions: {
    width: number | string;
    height: number | string;
    qty: number;
    area?: number;
  };
  configuration?: string;
  finish?: string;
  glass?: string;
  hardware?: string;
  ratePerSqFt?: number;
  estimatedPrice?: number;
  requirements?: string;
  notes?: string;
  attachments: string[];
  status: 'pending' | 'reviewed' | 'quoted' | 'approved' | 'rejected' | string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customer?: {

    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  items: CartItem[];
  subtotal?: number;
  total: number;
  status: string;
  orderStatus?: string;
  createdAt: string;
  paymentMethod?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CustomDesign {
  id: string;
  doorType: string;
  width: number;
  height: number;
  configuration: string;
  swingDirection?: string;
  finish: string;
  glass: string;
  hardware: string;
  handle?: string;
  threshold?: string;
  price?: number;
  estimatedPrice?: number;
  createdAt: string;
}

export interface Discount {
  id: string;
  code: string;
  percent?: number;
  description?: string;
  active: boolean;
  type?: string;
  value?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  projectCategory?: string;
  message: string;
  createdAt: string;
  status?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details?: string;
  timestamp: string;
  type?: string;
  user?: string;
  adminEmail?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  heroImage: string;
  items: string[];
  popularProducts?: string[];
}

export type CategoryData = Category;

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  projectType?: string;
  project?: string;
  image?: string;
  rating: number;
  text: string;
  featured: boolean;
  published: boolean;
}

export interface PortfolioProjectSpecs {
  steelGrade?: string;
  gauge?: string;
  finish?: string;
  automation?: string;
  span?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription?: string;
  description: string;
  location: string;
  projectType?: string;
  clientType?: string;
  duration?: string;
  materials?: string;
  services?: string;
  image: string;
  coverImage?: string;
  mainImageUrl?: string;
  galleryImages?: string[];
  specs?: PortfolioProjectSpecs;
  deliverables?: string[];
  completedDate: string;
  featured?: boolean;
  displayOrder?: number;
  status?: 'Completed' | 'In Progress' | 'Published' | 'Draft' | string;
  createdAt?: string;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  slug?: string;
  category: string;
  shortDescription?: string;
  description: string;
  location: string;
  projectType?: string;
  clientType?: string;
  duration?: string;
  materials?: string;
  services?: string;
  image: string;
  coverImage?: string;
  mainImageUrl?: string;
  galleryImages?: string[];
  completedDate: string;
  featured?: boolean;
  displayOrder?: number;
  status?: 'Completed' | 'In Progress' | 'Published' | 'Draft' | string;
  specs?: PortfolioProjectSpecs;
  deliverables?: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  featuredImage?: string;
  image?: string;
  author: string;
  category: string;
  readTime?: string;
  publishedAt?: string;
  date?: string;
  tags?: string[];
  relatedPosts?: any[];
}

export interface WebsiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  supportEmail?: string;
  streetAddress: string;
  suite: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessHours: string;
  googleMapsUrl?: string;
  shippingCharge?: number;
  freeShippingThreshold?: number;
  taxRate?: number;
  showEmergencyBanner?: boolean;
  emergencyBannerText?: string;
  logoUrl?: string;
  footerLogoUrl?: string;
  faviconUrl?: string;
  heroBackgroundUrl?: string;
  videoUrl?: string;
  currency?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    pinterest?: string;
    twitter?: string;
  };
  formspreeEndpoint?: string;
}
