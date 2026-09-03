import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Product, Quote, Order, CustomDesign, Review,
  Discount, ContactMessage, ActivityLog, Testimonial, WebsiteSettings, BlogPost,
  ServiceItem, ProjectShowcase
} from '../types';
import { SEED_PRODUCTS, SEED_TESTIMONIALS, SEED_BLOGS, SEED_SERVICES, SEED_PROJECTS, PROJECT_CATEGORIES_DATA, type CategoryInfo } from '../data/seedData';
import { apiRequest } from '../utils/api';
import { dbService, type DbStats } from '../services/indexedDb';

interface DataContextType {
  products: Product[];
  quotes: Quote[];
  orders: Order[];
  savedDesigns: CustomDesign[];
  reviews: Review[];
  settings: WebsiteSettings;
  updateSettings: (settings: WebsiteSettings) => Promise<void>;
  discounts: Discount[];
  addDiscount: (discount: Omit<Discount, 'id'>) => Promise<Discount>;
  updateDiscount: (discount: Discount) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  blogs: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'date'>) => Promise<BlogPost>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, 'id'>) => Promise<Testimonial>;
  updateTestimonial: (test: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<ServiceItem>;
  updateService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  projects: ProjectShowcase[];
  addProject: (project: Omit<ProjectShowcase, 'id'>) => Promise<ProjectShowcase>;
  updateProject: (project: ProjectShowcase) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  categories: CategoryInfo[];
  addCategory: (category: Omit<CategoryInfo, 'id'>) => Promise<CategoryInfo>;
  updateCategory: (category: CategoryInfo) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<ContactMessage>;
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => Promise<void>;
  activityLogs: ActivityLog[];
  addActivityLog: (action: string, details?: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'rating'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'status'>) => Promise<Quote>;
  updateQuoteStatus: (id: string, status: Quote['status'], estimatedPrice?: number) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['orderStatus']) => Promise<void>;
  addCustomDesign: (design: Omit<CustomDesign, 'id' | 'createdAt'>) => Promise<CustomDesign>;
  deleteCustomDesign: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  getWhatsAppUrl: (message: string) => string;
  refreshFromApi: () => Promise<void>;
  fetchQuotes: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchContactMessages: () => Promise<void>;
  dbStats: DbStats | null;
  isOnline: boolean;
  isSyncing: boolean;
  exportDatabase: () => Promise<string>;
}


const DEFAULT_SETTINGS: WebsiteSettings = {
  companyName: 'Mughal Steel Fabrication',
  tagline: 'Premium Architectural Steel Fabrication & CNC Laser Works',
  phone: '03268575643',
  whatsappNumber: '03239898317',
  email: 'mughalsteelfabrication51@gmail.com',
  supportEmail: 'mughalsteelfabrication51@gmail.com',

  streetAddress: 'Main Workshop & Yard, Plot 42, Sector I-9 Industrial Area',
  suite: 'Mughal Steel Fabrication Complex',
  city: 'Rawalpindi / Islamabad',
  state: 'Punjab / ICT',
  zipCode: '46000',
  country: 'Pakistan',
  businessHours: 'Monday - Saturday: 8:30 AM - 8:30 PM, Sunday: On-Call Survey',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mughal+Steel+Fabrication+I-9+Industrial+Area+Islamabad+Rawalpindi',
  shippingCharge: 5000,
  freeShippingThreshold: 500000,
  taxRate: 0.0,
  socialLinks: {
    facebook: 'https://www.facebook.com/101947381864652?ref=PROFILE_EDIT_xav_ig_profile_page_web',
    instagram: 'https://www.instagram.com/mughalsteelfabrication/',
    linkedin: 'https://linkedin.com/company/mughalsteelfabrication',
    pinterest: 'https://pinterest.com/mughalsteelfabrication',
    twitter: 'https://twitter.com/mughalsteel',
    youtube: 'https://youtube.com/playlist?list=PLIY_NugRLGiBoPBJd6qhjl3Ra5QqTCb-f&si=rJY9tie1xTRH59SU'
  },
  logoUrl: '/image/logo.png',
  currency: 'PKR',
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mppzrorn'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<CustomDesign[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>(SEED_BLOGS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(SEED_TESTIMONIALS);
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('mfg_services');
      return saved ? JSON.parse(saved) : SEED_SERVICES;
    } catch {
      return SEED_SERVICES;
    }
  });
  const [projects, setProjects] = useState<ProjectShowcase[]>(() => {
    try {
      const saved = localStorage.getItem('mfg_projects');
      return saved ? JSON.parse(saved) : SEED_PROJECTS;
    } catch {
      return SEED_PROJECTS;
    }
  });
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem('mfg_categories');
      return saved ? JSON.parse(saved) : PROJECT_CATEGORIES_DATA;
    } catch {
      return PROJECT_CATEGORIES_DATA;
    }
  });
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Helper for WhatsApp Link with accurate Pakistan country code 92 normalization
  const getWhatsAppUrl = (message: string): string => {
    let rawNumber = (settings.whatsappNumber || settings.phone || '03239898317').replace(/[^0-9]/g, '');
    
    // Convert 03239898317 -> 923239898317 or 0092... -> 92...
    if (rawNumber.startsWith('0092')) {
      rawNumber = rawNumber.substring(2);
    } else if (rawNumber.startsWith('0')) {
      rawNumber = '92' + rawNumber.substring(1);
    } else if (!rawNumber.startsWith('92') && rawNumber.length === 10) {
      rawNumber = '92' + rawNumber;
    }
    
    // Sanitize message: Remove any base64 image strings (data:image/...;base64,...) to prevent URL truncation or errors
    const sanitizedMessage = message
      .replace(/data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+/g, '')
      .replace(/\n\s*🖼️\s*\*PRODUCT DESIGN PHOTO LINK:\*\s*\n(?=\n|$)/g, '')
      .replace(/\n\s*🖼️\s*\*Design Photo Link:\*\s*\n(?=\n|$)/g, '');

    const encoded = encodeURIComponent(sanitizedMessage);
    return `https://wa.me/${rawNumber}?text=${encoded}`;
  };

  const updateStats = async () => {
    try {
      const stats = await dbService.getStats();
      setDbStats(stats);
    } catch (_) {}
  };

  // 1. Initial Load from IndexedDB (Instant local state recovery)
  const loadFromIndexedDB = async () => {
    try {
      const [
        cachedProducts,
        cachedReviews,
        cachedBlogs,
        cachedTestimonials,
        cachedSettings,
        cachedLogs
      ] = await Promise.all([
        dbService.getProducts(),
        dbService.getReviews(),
        dbService.getBlogs(),
        dbService.getTestimonials(),
        dbService.getSettings(),
        dbService.getActivityLogs()
      ]);

      // Seed local database with SEED_PRODUCTS if empty, otherwise load cached
      if (cachedProducts.length > 0) {
        setProducts(cachedProducts);
      } else {
        await dbService.saveProducts(SEED_PRODUCTS);
        setProducts(SEED_PRODUCTS);
      }

      // Customer info (Quotes, Orders, Designs, Messages) are NOT stored in IndexedDB.
      setQuotes([]);
      setOrders([]);
      setSavedDesigns([]);
      setContactMessages([]);

      if (cachedReviews.length > 0) setReviews(cachedReviews);
      
      // Seed local database with SEED_BLOGS if empty, otherwise load cached
      if (cachedBlogs.length > 0) {
        setBlogs(cachedBlogs);
      } else {
        await dbService.saveBlogs(SEED_BLOGS);
        setBlogs(SEED_BLOGS);
      }

      // Seed local database with SEED_TESTIMONIALS if empty or outdated
      if (cachedTestimonials.length >= SEED_TESTIMONIALS.length) {
        setTestimonials(cachedTestimonials);
      } else {
        await dbService.saveTestimonials(SEED_TESTIMONIALS);
        setTestimonials(SEED_TESTIMONIALS);
      }

      if (cachedSettings) {
        setSettings(prev => ({ ...prev, ...cachedSettings }));
      } else {
        await dbService.saveSettings(DEFAULT_SETTINGS);
      }

      if (cachedLogs.length > 0) setActivityLogs(cachedLogs);

      await updateStats();
    } catch (err) {
      console.warn('Error reading from IndexedDB:', err);
    }
  };

  // 2. Fetch fresh data from Backend API & sync into IndexedDB
  const syncWithBackend = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [
        settingsRes,
        productsRes,
        reviewsRes,
        categoriesRes,
        blogsRes,
        testimonialsRes,
        portfolioRes
      ] = await Promise.allSettled([
        apiRequest('/api/settings'),
        apiRequest('/api/product'),
        apiRequest('/api/review'),
        apiRequest('/api/category'),
        apiRequest('/api/blog'),
        apiRequest('/api/testimonials'),
        apiRequest('/api/portfolio')
      ]);

      // 1. Live Settings
      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        const s = settingsRes.value;
        const liveSettings = s.data || s;
        if (liveSettings && (liveSettings.companyName || liveSettings.phone)) {
          const mergedSettings: WebsiteSettings = {
            ...DEFAULT_SETTINGS,
            ...liveSettings,
            whatsappNumber: liveSettings.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber
          };
          setSettings(mergedSettings);
          dbService.saveSettings(mergedSettings).catch(() => {});
        }
      }

      // 2. Live Products
      if (productsRes.status === 'fulfilled' && productsRes.value) {
        const raw = productsRes.value;
        const prods = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
        if (prods && prods.length > 0) {
          setProducts(prods);
          dbService.saveProducts(prods).catch(() => {});
        }
      }

      // 3. Live Reviews
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value) {
        const raw = reviewsRes.value;
        const revs = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
        if (revs && revs.length > 0) {
          setReviews(revs);
          dbService.saveReviews(revs).catch(() => {});
        }
      }

      // 4. Live Categories
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value) {
        const raw = categoriesRes.value;
        const cats = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      }

      // 5. Live Blogs
      if (blogsRes.status === 'fulfilled' && blogsRes.value) {
        const raw = blogsRes.value;
        const blogsList = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
        if (blogsList && blogsList.length > 0) {
          setBlogs(blogsList);
          dbService.saveBlogs(blogsList).catch(() => {});
        }
      }

      // 6. Live Testimonials
      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value) {
        const raw = testimonialsRes.value;
        const testsList = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
        if (testsList && testsList.length > 0) {
          setTestimonials(testsList);
          dbService.saveTestimonials(testsList).catch(() => {});
        }
      }

      // 7. Live Portfolio Projects
      if (portfolioRes.status === 'fulfilled' && portfolioRes.value) {
        const raw = portfolioRes.value;
        const portList = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
        if (portList && portList.length > 0) {
          const mapped = portList.map((p: any) => {
            let parsedSpecs = p.specs;
            if (p.specsJson && typeof p.specsJson === 'string') {
              try { parsedSpecs = JSON.parse(p.specsJson); } catch {}
            }
            let parsedGallery = p.galleryImages;
            if (p.imagesList && typeof p.imagesList === 'string') {
              try { parsedGallery = JSON.parse(p.imagesList); } catch {
                parsedGallery = p.imagesList.split(',').map((s: string) => s.trim()).filter(Boolean);
              }
            }
            let parsedDeliverables = p.deliverables;
            if (p.deliverablesJson && typeof p.deliverablesJson === 'string') {
              try { parsedDeliverables = JSON.parse(p.deliverablesJson); } catch {}
            }

            return {
              id: p.id,
              title: p.title,
              slug: p.slug || p.id,
              category: p.category || 'Main Gates',
              image: p.coverImage || p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              coverImage: p.coverImage || p.image,
              galleryImages: parsedGallery || [p.coverImage || p.image],
              description: p.description,
              location: p.location || 'Islamabad, Pakistan',
              projectType: p.projectType || 'Residential Project',
              completedDate: p.completedDate || '2026',
              featured: Boolean(p.featured),
              displayOrder: Number(p.displayOrder || 0),
              status: p.status || 'Published',
              specs: parsedSpecs,
              deliverables: parsedDeliverables
            };
          });
          setProjects(mapped);
          localStorage.setItem('mfg_projects', JSON.stringify(mapped));
        }
      }

      setIsOnline(true);
      await updateStats();
    } catch (err) {
      console.warn('Backend API sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await apiRequest('/api/quote');
      const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : null);
      if (list) {
        setQuotes(list);
      }
    } catch (err) {
      console.warn('Failed to fetch quotes from API:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await apiRequest('/api/order');
      const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : null);
      if (list) {
        setOrders(list);
      }
    } catch (err) {
      console.warn('Failed to fetch orders from API:', err);
    }
  }, []);

  const fetchContactMessages = useCallback(async () => {
    try {
      const res = await apiRequest('/api/contact');
      const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : null);
      if (list) {
        setContactMessages(list);
      }
    } catch (err) {
      console.warn('Failed to fetch contact messages from API:', err);
    }
  }, []);


  useEffect(() => {
    // 1. Instant local IndexedDB load
    loadFromIndexedDB().then(() => {
      // 2. Fetch live data from backend API
      syncWithBackend();
    });

    const handleOnline = () => {
      setIsOnline(true);
      syncWithBackend();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncWithBackend]);

  const updateSettings = async (s: WebsiteSettings) => {
    setSettings(s);
    await dbService.saveSettings(s);
    await updateStats();
    try {
      await apiRequest('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(s)
      });
    } catch (_) {
      await dbService.enqueueSync('/api/settings', 'PUT', s);
    }
  };

  const addDiscount = async (d: Omit<Discount, 'id'>): Promise<Discount> => {
    const newDisc: Discount = { ...d, id: `disc-${Date.now()}` };
    setDiscounts(prev => [...prev, newDisc]);
    return newDisc;
  };

  const updateDiscount = async (discount: Discount) => {
    setDiscounts(prev => prev.map(d => d.id === discount.id ? discount : d));
  };

  const deleteDiscount = async (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
  };

  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> => {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setBlogs(prev => [newPost, ...prev]);
    await dbService.saveBlog(newPost);
    await updateStats();
    try {
      await apiRequest('/api/admin/blog', {
        method: 'POST',
        body: JSON.stringify(post)
      });
    } catch (_) {
      await dbService.enqueueSync('/api/admin/blog', 'POST', post);
    }
    return newPost;
  };

  const updateBlogPost = async (post: BlogPost) => {
    setBlogs(prev => prev.map(b => b.id === post.id ? post : b));
    await dbService.saveBlog(post);
    try {
      await apiRequest(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(post)
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/admin/blog/${post.id}`, 'PUT', post);
    }
  };

  const deleteBlogPost = async (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    await dbService.deleteBlog(id);
    await updateStats();
    try {
      await apiRequest(`/api/admin/blog/${id}`, {
        method: 'DELETE'
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/admin/blog/${id}`, 'DELETE');
    }
  };

  const addTestimonial = async (test: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    const newTest: Testimonial = { ...test, id: `test-${Date.now()}` };
    setTestimonials(prev => [...prev, newTest]);
    await dbService.saveTestimonial(newTest);
    await updateStats();
    try {
      await apiRequest('/api/admin/testimonials', {
        method: 'POST',
        body: JSON.stringify(test)
      });
    } catch (_) {
      await dbService.enqueueSync('/api/admin/testimonials', 'POST', test);
    }
    return newTest;
  };

  const updateTestimonial = async (test: Testimonial) => {
    setTestimonials(prev => prev.map(t => t.id === test.id ? test : t));
    await dbService.saveTestimonial(test);
    try {
      await apiRequest(`/api/admin/testimonials/${test.id}`, {
        method: 'PUT',
        body: JSON.stringify(test)
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/admin/testimonials/${test.id}`, 'PUT', test);
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await dbService.deleteTestimonial(id);
    await updateStats();
    try {
      await apiRequest(`/api/admin/testimonials/${id}`, {
        method: 'DELETE'
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/admin/testimonials/${id}`, 'DELETE');
    }
  };

  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage> => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    setContactMessages(prev => [newMsg, ...prev]);
    try {
      await apiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(msg)
      });
    } catch (_) {
      await dbService.enqueueSync('/api/contact', 'POST', msg);
    }
    return newMsg;
  };

  const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    try {
      await apiRequest(`/api/admin/messages/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(status)
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/admin/messages/${id}/status`, 'PUT', status);
    }
  };

  const addActivityLog = async (action: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'Admin'
    };
    setActivityLogs(prev => [newLog, ...prev]);
    await dbService.saveActivityLog(newLog);
    await updateStats();
  };

  const addProduct = async (p: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'rating'>): Promise<Product> => {
    const imgList = (p.images && p.images.length > 0)
      ? p.images.filter(Boolean)
      : [p.frontImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'];

    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      images: imgList,
      frontImage: p.frontImage || imgList[0],
      backImage: p.backImage || (imgList.length > 1 ? imgList[1] : undefined),
      sideImage: p.sideImage || (imgList.length > 2 ? imgList[2] : undefined),
      detailImage: p.detailImage || (imgList.length > 3 ? imgList[3] : undefined),
      installationImage: p.installationImage || (imgList.length > 4 ? imgList[4] : undefined),
      rating: 5,
      reviews: []
    };
    setProducts(prev => [newProd, ...prev]);
    await dbService.saveProduct(newProd);
    await updateStats();

    try {
      const res = await apiRequest('/api/product', {
        method: 'POST',
        body: JSON.stringify({
          name: p.name,
          productCode: p.productCode,
          slug: p.slug,
          categoryName: p.category,
          item: p.item,
          description: p.description,
          pricePerSqFt: p.pricePerSqFt,
          basePrice: p.price,
          frontImage: newProd.frontImage,
          backImage: newProd.backImage || '',
          sideImage: newProd.sideImage || '',
          detailImage: newProd.detailImage || '',
          installationImage: newProd.installationImage || '',
          material: (p.materials || []).join(', '),
          finishesList: (p.finishes || []).join(', ')
        })
      });
      if (res && res.id) {
        newProd.id = res.id;
        await dbService.saveProduct(newProd);
      }
    } catch (_) {
      await dbService.enqueueSync('/api/product', 'POST', p);
    }
    return newProd;
  };

  const updateProduct = async (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    await dbService.saveProduct(product);
    try {
      await apiRequest(`/api/product/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/product/${product.id}`, 'PUT', product);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await dbService.deleteProduct(id);
    await updateStats();
    try {
      await apiRequest(`/api/product/${id}`, {
        method: 'DELETE'
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/product/${id}`, 'DELETE');
    }
  };

  const addQuote = async (quote: Omit<Quote, 'id' | 'createdAt' | 'status'>): Promise<Quote> => {
    const newQuote: Quote = {
      ...quote,
      id: `quote-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setQuotes(prev => [newQuote, ...prev]);

    try {
      const payload = {
        customerName: `${quote.customer.firstName} ${quote.customer.lastName}`.trim(),
        customerPhone: quote.customer.phone,
        customerEmail: quote.customer.email,
        city: quote.customer.city,
        projectCategory: quote.productCategory || quote.projectType,
        itemType: quote.productItem || 'Front Gates',
        productCode: quote.productCode,
        productName: quote.productCode,
        width: typeof quote.dimensions.width === 'number' ? quote.dimensions.width : parseFloat(quote.dimensions.width as string) || 12,
        height: typeof quote.dimensions.height === 'number' ? quote.dimensions.height : parseFloat(quote.dimensions.height as string) || 7.5,
        quantity: quote.dimensions.qty || 1,
        notes: quote.notes || quote.requirements,
        referenceImages: quote.attachments
      };

      const res = await apiRequest('/api/quote', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.id) {
        newQuote.id = res.id;
        newQuote.quoteNumber = res.quoteNumber;
      }
    } catch (_) {
      await dbService.enqueueSync('/api/quote', 'POST', quote);
    }
    return newQuote;
  };

  const updateQuoteStatus = async (id: string, status: Quote['status'], estimatedPrice?: number) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status, estimatedPrice: estimatedPrice || q.estimatedPrice } : q));
    try {
      await apiRequest(`/api/quote/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, estimatedPrice })
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/quote/${id}/status`, 'PUT', { status, estimatedPrice });
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);

    try {
      const payload = {
        email: order.customerEmail || order.customer?.email || 'customer@mughalsteel.com',
        firstName: order.customer?.firstName || 'Customer',
        lastName: order.customer?.lastName || 'Valued',
        phone: order.customer?.phone || '',
        street: order.shippingAddress.street,
        city: order.shippingAddress.city,
        items: order.items.map(i => ({
          productId: i.productId || '00000000-0000-0000-0000-000000000000',
          productName: i.productName,
          sku: i.productCode,
          price: i.totalPrice,
          quantity: i.quantity,
          selectedWidth: i.width.toString(),
          selectedHeight: i.height.toString(),
          selectedFinish: i.finish || 'Standard'
        }))
      };

      const res = await apiRequest('/api/order', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.id) {
        newOrder.id = res.id;
        newOrder.orderNumber = res.orderNumber;
      }
    } catch (_) {
      await dbService.enqueueSync('/api/order', 'POST', order);
    }
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status, status: status || o.status } : o));
    try {
      await apiRequest(`/api/order/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(status)
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/order/${id}/status`, 'PUT', status);
    }
  };

  const addCustomDesign = async (design: Omit<CustomDesign, 'id' | 'createdAt'>): Promise<CustomDesign> => {
    const newDesign: CustomDesign = {
      ...design,
      id: `design-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSavedDesigns(prev => [newDesign, ...prev]);
    return newDesign;
  };

  const deleteCustomDesign = async (id: string) => {
    setSavedDesigns(prev => prev.filter(d => d.id !== id));
  };

  const addReview = async (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);
    await dbService.saveReview(newRev);
    await updateStats();

    try {
      await apiRequest('/api/review', {
        method: 'POST',
        body: JSON.stringify({
          productId: review.productId,
          customerName: review.userName,
          email: `${review.userName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          rating: review.rating,
          comment: review.comment
        })
      });
    } catch (_) {
      await dbService.enqueueSync('/api/review', 'POST', review);
    }
  };

  const addService = async (service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> => {
    const newServ: ServiceItem = {
      ...service,
      id: `serv-${Date.now()}`
    };
    const updated = [newServ, ...services];
    setServices(updated);
    localStorage.setItem('mfg_services', JSON.stringify(updated));
    return newServ;
  };

  const updateService = async (service: ServiceItem) => {
    const updated = services.map(s => s.id === service.id ? service : s);
    setServices(updated);
    localStorage.setItem('mfg_services', JSON.stringify(updated));
  };

  const deleteService = async (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('mfg_services', JSON.stringify(updated));
  };

  const addProject = async (project: Omit<ProjectShowcase, 'id'>): Promise<ProjectShowcase> => {
    const slug = (project.title || 'project')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const newProj: ProjectShowcase = {
      ...project,
      id: `proj-${Date.now()}`,
      slug: project.slug || slug
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('mfg_projects', JSON.stringify(updated));

    try {
      const res = await apiRequest('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: newProj.title,
          slug: newProj.slug,
          category: newProj.category,
          shortDescription: newProj.shortDescription || '',
          description: newProj.description,
          location: newProj.location,
          projectType: newProj.projectType || 'Residential Project',
          clientType: newProj.clientType || 'Private Residence',
          duration: newProj.duration || '',
          materials: newProj.materials || '',
          services: newProj.services || '',
          coverImage: newProj.coverImage || newProj.image || newProj.mainImageUrl,
          mainImageUrl: newProj.mainImageUrl || newProj.coverImage || newProj.image,
          imagesList: JSON.stringify(newProj.galleryImages || []),
          specsJson: JSON.stringify(newProj.specs || {}),
          deliverablesJson: JSON.stringify(newProj.deliverables || []),
          completedDate: newProj.completedDate,
          featured: newProj.featured,
          displayOrder: newProj.displayOrder,
          status: newProj.status || 'Completed'
        })
      });
      if (res && (res.id || res.data?.id)) {
        const liveId = res.id || res.data?.id;
        newProj.id = liveId;
        const finalized = [newProj, ...projects.filter(p => p.id !== newProj.id)];
        setProjects(finalized);
        localStorage.setItem('mfg_projects', JSON.stringify(finalized));
      }
    } catch (_) {
      await dbService.enqueueSync('/api/admin/projects', 'POST', newProj);
    }

    return newProj;
  };

  const updateProject = async (project: ProjectShowcase) => {
    const updated = projects.map(p => p.id === project.id ? project : p);
    setProjects(updated);
    localStorage.setItem('mfg_projects', JSON.stringify(updated));

    try {
      await apiRequest(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: project.title,
          slug: project.slug,
          category: project.category,
          shortDescription: project.shortDescription || '',
          description: project.description,
          location: project.location,
          projectType: project.projectType,
          clientType: project.clientType,
          duration: project.duration,
          materials: project.materials,
          services: project.services,
          coverImage: project.coverImage || project.image || project.mainImageUrl,
          mainImageUrl: project.mainImageUrl || project.coverImage || project.image,
          imagesList: JSON.stringify(project.galleryImages || []),
          specsJson: JSON.stringify(project.specs || {}),
          deliverablesJson: JSON.stringify(project.deliverables || []),
          completedDate: project.completedDate,
          featured: project.featured,
          displayOrder: project.displayOrder,
          status: project.status || 'Completed'
        })
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/admin/projects/${project.id}`, 'PUT', project);
    }
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('mfg_projects', JSON.stringify(updated));

    try {
      await apiRequest(`/api/admin/projects/${id}`, {
        method: 'DELETE'
      });
    } catch (_) {
      await dbService.enqueueSync(`/api/admin/projects/${id}`, 'DELETE', { id });
    }
  };

  const addCategory = async (category: Omit<CategoryInfo, 'id'>): Promise<CategoryInfo> => {
    const newCat: CategoryInfo = {
      ...category,
      id: `cat-${Date.now()}`
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('mfg_categories', JSON.stringify(updated));
    return newCat;
  };

  const updateCategory = async (category: CategoryInfo) => {
    const updated = categories.map(c => c.id === category.id ? category : c);
    setCategories(updated);
    localStorage.setItem('mfg_categories', JSON.stringify(updated));
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    localStorage.setItem('mfg_categories', JSON.stringify(updated));
  };

  const exportDatabase = async (): Promise<string> => {
    return dbService.exportDatabase();
  };

  return (
    <DataContext.Provider value={{
      products,
      quotes,
      orders,
      savedDesigns,
      reviews,
      settings,
      updateSettings,
      discounts,
      addDiscount,
      updateDiscount,
      deleteDiscount,
      blogs,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      testimonials,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      services,
      addService,
      updateService,
      deleteService,
      projects,
      addProject,
      updateProject,
      deleteProject,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      contactMessages,

      addContactMessage,
      updateContactMessageStatus,
      activityLogs,
      addActivityLog,
      addProduct,
      updateProduct,
      deleteProduct,
      addQuote,
      updateQuoteStatus,
      addOrder,
      updateOrderStatus,
      addCustomDesign,
      deleteCustomDesign,
      addReview,
      getWhatsAppUrl,
      refreshFromApi: syncWithBackend,
      fetchQuotes,
      fetchOrders,
      fetchContactMessages,
      dbStats,
      isOnline,
      isSyncing,
      exportDatabase
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
