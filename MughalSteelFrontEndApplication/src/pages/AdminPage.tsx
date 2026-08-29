import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { Product, Quote, Order, CustomDesign, Testimonial, ContactMessage, ActivityLog, ProjectShowcase, ServiceItem } from '../types';
import { type CategoryInfo } from '../data/seedData';
import { 
  BarChart3, Box, ClipboardList, ShoppingCart, Users, 
  Plus, Edit, Trash2, Check, X, ArrowLeft,
  BookOpen, MessageSquare, Settings, History, MessageCircle,
  Database, RefreshCw, Download, HardDrive, Cloud, CloudOff, CheckCircle2, Globe, LogOut, 
  Image, ImagePlus, Eye, Layers, Phone, Mail, MapPin, Search, Filter, Shield, Calendar,
  DollarSign, CheckCircle, Clock, AlertCircle, Sparkles, SlidersHorizontal, ArrowUpRight,
  Hammer, Factory, Wrench, ShieldCheck, Maximize2, Upload, FolderUp, Camera, RotateCw, Building2
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, logout, user } = useAuth();
  const { 
    products, quotes, orders, savedDesigns, addProduct, updateProduct, deleteProduct, 
    updateQuoteStatus, updateOrderStatus,
    settings, updateSettings,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    services, addService, updateService, deleteService,
    projects, addProject, updateProject, deleteProject,
    categories, addCategory, updateCategory, deleteCategory,
    contactMessages, updateContactMessageStatus,
    activityLogs, addActivityLog,
    fetchQuotes, fetchOrders, fetchContactMessages
  } = useData();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Strict Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Tab State (including Services, Projects, Portfolio / Gallery, and Categories)
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'quotes' | 'orders' | 
    'designs' | 'customers' | 'services' | 'projects' | 'gallery' | 'testimonials' | 'messages' | 'settings' | 'logs'
  >('dashboard');

  // Fetch live quotes, orders, and messages on demand
  useEffect(() => {
    if (isAdmin) {
      fetchQuotes();
      fetchOrders();
      fetchContactMessages();
    }
  }, [isAdmin, fetchQuotes, fetchOrders, fetchContactMessages]);

  // Search & Filter state for catalog products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // -------------------------------------------------------------
  // REAL METRICS COMPUTATIONS
  // -------------------------------------------------------------
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'processing' || (o.orderStatus as string) === 'pending').length;
  const pendingQuotesCount = quotes.filter(q => q.status === 'Pending' || (q.status as string) === 'pending' || q.status === 'Reviewing').length;
  
  const totalSalesRevenue = orders.reduce((sum: number, ord: Order) => sum + (ord.total || 0), 0);
  const totalQuotationValue = quotes.reduce((sum: number, q: Quote) => sum + (q.estimatedPrice || 0), 0);
  const grossBusinessValue = totalSalesRevenue + totalQuotationValue;

  // Exact 10 Categories List defined by Mughal Steel
  const CATEGORY_NAMES_10 = [
    'Housing Society',
    'Modern Home',
    'Classical Home',
    'Commercial',
    'Modern Farmhouse',
    'Classical Farmhouse',
    'Village House',
    'Farm',
    'Small Villa',
    'Aluminum & Glass'
  ];

  interface CustomerEntry {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    ordersCount: number;
    quotesCount: number;
    totalSpent: number;
    lastActive: string;
    orderHistory: Order[];
    quoteHistory: Quote[];
  }

  // Aggregate Customer Database dynamically from Registered Users + Orders + Quotes
  const customerList = useMemo(() => {
    const map = new Map<string, CustomerEntry>();

    // 1. Registered users in local storage
    try {
      const reg = JSON.parse(localStorage.getItem('registered_users') || '[]');
      reg.forEach((u: any) => {
        const emailKey = (u.email || '').toLowerCase().trim();
        if (emailKey && !emailKey.startsWith('admin')) {
          map.set(emailKey, {
            id: u.id || `cust-${Math.random()}`,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Registered Client',
            email: u.email,
            phone: u.phone || '+92 300 0000000',
            city: u.city || 'Islamabad',
            address: u.address || 'Capital Territory',
            ordersCount: 0,
            quotesCount: 0,
            totalSpent: 0,
            lastActive: 'Registered Account',
            orderHistory: [],
            quoteHistory: []
          });
        }
      });
    } catch {}

    // 2. Orders customers
    orders.forEach(o => {
      const emailKey = (o.customerEmail || '').toLowerCase().trim() || `${(o.customerName || 'client').toLowerCase().replace(/\s+/g, '')}@lead.com`;
      const existing: CustomerEntry = map.get(emailKey) || {
        id: `cust-ord-${o.id}`,
        name: o.customerName || 'Client Order Lead',
        email: o.customerEmail || 'N/A',
        phone: o.customerPhone || o.customer?.phone || '+92 300 0000000',
        city: o.shippingAddress?.city || 'Pakistan',
        address: `${o.shippingAddress?.street || ''}, ${o.shippingAddress?.city || ''}`,
        ordersCount: 0,
        quotesCount: 0,
        totalSpent: 0,
        lastActive: o.createdAt || 'Recent',
        orderHistory: [],
        quoteHistory: []
      };
      existing.ordersCount += 1;
      existing.totalSpent += (o.total || 0);
      existing.orderHistory.push(o);
      map.set(emailKey, existing);
    });

    // 3. Quotes customers
    quotes.forEach(q => {
      const emailKey = (q.customer?.email || '').toLowerCase().trim() || `${(q.customer?.firstName || 'lead').toLowerCase().replace(/\s+/g, '')}@quote.com`;
      const existing: CustomerEntry = map.get(emailKey) || {
        id: `cust-q-${q.id}`,
        name: `${q.customer?.firstName || ''} ${q.customer?.lastName || ''}`.trim() || 'Quote Inquirer',
        email: q.customer?.email || 'N/A',
        phone: q.customer?.phone || '+92 300 0000000',
        city: q.customer?.city || 'Pakistan',
        address: q.customer?.address || `${q.customer?.city || ''}`,
        ordersCount: 0,
        quotesCount: 0,
        totalSpent: 0,
        lastActive: q.createdAt || 'Recent',
        orderHistory: [],
        quoteHistory: []
      };
      existing.quotesCount += 1;
      existing.quoteHistory.push(q);
      map.set(emailKey, existing);
    });

    return Array.from(map.values());
  }, [orders, quotes]);

  // -------------------------------------------------------------
  // MODALS STATE
  // -------------------------------------------------------------
  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [imageUploadTab, setImageUploadTab] = useState<'upload' | 'url'>('upload');
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Housing Society',
    subcategory: 'Front Gates',
    sku: '',
    price: 2800,
    description: '',
    frontImage: '',
    backImage: '',
    leftSideImage: '',
    rightSideImage: '',
    sideImage: '',
    detailImage: '',
    installationImage: '',
    additionalImages: [] as string[]
  });

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: 'Housing Society',
    slug: 'housing-society',
    tagline: '',
    description: '',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    itemsString: 'Main Gates, Boundary Wall Grills, Steel Structures, Sheds & Canopies, Railing'
  });

  // Project management states
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState('All');
  const [portfolioStatusFilter, setPortfolioStatusFilter] = useState('All');

  // Visual Gallery CMS states
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');
  const [gallerySearch, setGallerySearch] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectShowcase | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    category: 'Main Gates',
    shortDescription: '',
    projectType: 'Residential Luxury Villa',
    clientType: 'Private Residence',
    duration: '14 Days',
    materials: 'Grade A Mild Steel, CNC Laser Cut Sheet, Electrostatic Powder Coat',
    services: 'CAD Custom Design, CNC Laser Cutting, Structural Welding, On-Site Installation',
    location: 'Islamabad, Pakistan',
    completedDate: '2026',
    featured: true,
    displayOrder: 0,
    status: 'Completed' as string,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '',
    steelGrade: 'Grade A Structural Mild Carbon Steel',
    gauge: '14-Gauge (2.0mm) & 12-Gauge (2.5mm)',
    finish: 'Matte Black Electrostatic Powder Coating',
    automation: 'Italian Heavy-Duty 800KG Sliding Motor',
    span: '14ft Width × 7.5ft Height',
    deliverablesString: 'Main Grand Entrance Gate, Matching Boundary Wall Grills, Balcony Safety Railings, Laser Foundation Anchoring'
  });

  // Service modal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    icon: 'DoorClosed',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: '',
    featuresString: 'CNC Laser Cut Precision, Automation Motor Ready, Anti-Corrosion Zinc Undercoat, 10-Year Structural Integrity'
  });

  // Testimonial modal
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', location: '', rating: 5, text: '', featured: true, published: true });

  // Detail inspection modals
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<any | null>(null);

  // Quote Edit states
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [quoteStatusInput, setQuoteStatusInput] = useState<any>('Pending');
  const [quotePriceInput, setQuotePriceInput] = useState<number>(0);

  // Global Settings form state
  const [settingsForm, setSettingsForm] = useState<any>(null);

  useEffect(() => {
    if (settings && !settingsForm) {
      setSettingsForm(settings);
    }
  }, [settings, settingsForm]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // Helper for single side image file upload
  const handleSingleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: 'frontImage' | 'backImage' | 'leftSideImage' | 'rightSideImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        setProductForm(prev => ({
          ...prev,
          [field]: dataUrl
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper for batch uploading up to 4 images at once
  const handleBatch4SidesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const targetFields: ('frontImage' | 'backImage' | 'leftSideImage' | 'rightSideImage')[] = [
      'frontImage', 'backImage', 'leftSideImage', 'rightSideImage'
    ];

    Array.from(files).slice(0, 4).forEach((file, index) => {
      const targetField = targetFields[index];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        if (dataUrl) {
          setProductForm(prev => ({
            ...prev,
            [targetField]: dataUrl
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Housing Society',
      subcategory: 'Front Gates',
      sku: `MFG-${Math.floor(100 + Math.random() * 900)}`,
      price: 2800,
      description: 'Solid 14-gauge structural mild steel fabrication with CNC laser precision cutting and rust-proof powder coat finish.',
      frontImage: '',
      backImage: '',
      leftSideImage: '',
      rightSideImage: '',
      sideImage: '',
      detailImage: '',
      installationImage: '',
      additionalImages: []
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: any) => {
    setEditingProduct(p);
    const imgs = p.images || [];
    setProductForm({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || p.item || 'Front Gates',
      sku: p.sku || p.productCode,
      price: p.pricePerSqFt || p.price || 2800,
      description: p.description || '',
      frontImage: p.frontImage || p.galleryViews?.front || imgs[0] || '',
      backImage: p.backImage || p.galleryViews?.back || (imgs.length > 1 ? imgs[1] : ''),
      leftSideImage: p.leftSideImage || p.galleryViews?.leftSide || p.sideImage || p.galleryViews?.side || (imgs.length > 2 ? imgs[2] : ''),
      rightSideImage: p.rightSideImage || p.galleryViews?.rightSide || p.detailImage || (imgs.length > 3 ? imgs[3] : ''),
      sideImage: p.sideImage || (imgs.length > 2 ? imgs[2] : ''),
      detailImage: p.detailImage || (imgs.length > 3 ? imgs[3] : ''),
      installationImage: p.installationImage || (imgs.length > 4 ? imgs[4] : ''),
      additionalImages: imgs.slice(4)
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const front = (productForm.frontImage || '').trim();
    const back = (productForm.backImage || '').trim();
    const left = (productForm.leftSideImage || '').trim();
    const right = (productForm.rightSideImage || '').trim();

    const allImages = [
      front,
      back,
      left,
      right,
      productForm.installationImage?.trim(),
      ...(productForm.additionalImages || []).map(img => img.trim())
    ].filter(Boolean);

    if (allImages.length === 0) {
      allImages.push('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
    }

    const payload = {
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      productCode: productForm.sku || `MFG-${Math.floor(100 + Math.random() * 900)}`,
      sku: productForm.sku,
      category: productForm.category,
      item: productForm.subcategory || 'Front Gates',
      subcategory: productForm.subcategory || 'Front Gates',
      description: productForm.description,
      pricePerSqFt: productForm.price || 2800,
      price: productForm.price || 2800,
      images: allImages,
      frontImage: front || allImages[0],
      backImage: back || (allImages.length > 1 ? allImages[1] : undefined),
      leftSideImage: left || (allImages.length > 2 ? allImages[2] : undefined),
      rightSideImage: right || (allImages.length > 3 ? allImages[3] : undefined),
      sideImage: left || right || allImages[2] || undefined,
      galleryViews: {
        front: front || allImages[0],
        back: back || undefined,
        leftSide: left || undefined,
        rightSide: right || undefined,
        side: left || right || undefined
      },
      sizes: ['12ft x 7.5ft', '14ft x 8ft'],
      width: [12, 14],
      height: [7.5, 8],
      materials: ['14-Gauge MS Tube', 'Cold Rolled Steel Sheet', '8mm CNC Laser Plate'],
      finishes: ['Matte Charcoal Powder Coat', 'Metallic Gold Patina', 'Gloss Black'],
      glassOptions: ['Clear Low-E', 'Frosted Privacy'],
      hardwareOptions: ['Architectural Pull Handle', 'Heavy Duty Hinges'],
      availability: 'in-stock',
      featured: true,
      newArrival: true
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...payload });
      addActivityLog('PRODUCT_UPDATED', `Updated product: ${payload.name} (${payload.productCode})`);
    } else {
      addProduct(payload);
      addActivityLog('PRODUCT_CREATED', `Added new catalog product: ${payload.name} (${payload.productCode})`);
    }
    setShowProductModal(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const items = categoryForm.itemsString.split(',').map(s => s.trim()).filter(Boolean);
    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: categoryForm.name as any,
        slug: categoryForm.slug,
        tagline: categoryForm.tagline,
        description: categoryForm.description,
        heroImage: categoryForm.heroImage,
        items: items as any
      });
      addActivityLog('CATEGORY_UPDATED', `Updated category: ${categoryForm.name}`);
    } else {
      addCategory({
        name: categoryForm.name as any,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        tagline: categoryForm.tagline,
        description: categoryForm.description,
        heroImage: categoryForm.heroImage,
        items: items as any,
        popularProducts: []
      });
      addActivityLog('CATEGORY_CREATED', `Created new category: ${categoryForm.name}`);
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      addActivityLog('CATEGORY_DELETED', `Deleted category ID: ${id}`);
    }
  };

  const handlePortfolioImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        if (index !== undefined) {
          // Update specific gallery image
          setProjectForm(prev => {
            const nextGallery = [...prev.galleryImages];
            nextGallery[index] = dataUrl;
            return {
              ...prev,
              galleryImages: nextGallery,
              image: index === 0 ? dataUrl : prev.image
            };
          });
        } else {
          // Update main cover image
          setProjectForm(prev => ({
            ...prev,
            image: dataUrl,
            galleryImages: prev.galleryImages.length > 0 
              ? [dataUrl, ...prev.galleryImages.slice(1)]
              : [dataUrl]
          }));
        }
      }
      setIsUploadingImage(false);
    };
    reader.onerror = () => setIsUploadingImage(false);
    reader.readAsDataURL(file);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const deliverables = projectForm.deliverablesString.split(',').map(s => s.trim()).filter(Boolean);
    const slug = projectForm.slug || projectForm.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

    const projectPayload: any = {
      title: projectForm.title,
      slug,
      category: projectForm.category,
      shortDescription: projectForm.shortDescription,
      description: projectForm.description,
      projectType: projectForm.projectType,
      clientType: projectForm.clientType,
      duration: projectForm.duration,
      materials: projectForm.materials,
      services: projectForm.services,
      location: projectForm.location,
      completedDate: projectForm.completedDate,
      image: projectForm.image || projectForm.galleryImages[0] || '',
      coverImage: projectForm.image || projectForm.galleryImages[0] || '',
      mainImageUrl: projectForm.image || projectForm.galleryImages[0] || '',
      galleryImages: projectForm.galleryImages.filter(Boolean),
      featured: Boolean(projectForm.featured),
      displayOrder: Number(projectForm.displayOrder || 0),
      status: projectForm.status || 'Completed',
      specs: {
        steelGrade: projectForm.steelGrade,
        gauge: projectForm.gauge,
        finish: projectForm.finish,
        automation: projectForm.automation,
        span: projectForm.span
      },
      deliverables
    };

    if (editingProject) {
      updateProject({
        ...editingProject,
        ...projectPayload
      });
      addActivityLog('PORTFOLIO_UPDATED', `Updated portfolio project: ${projectForm.title}`);
    } else {
      addProject(projectPayload);
      addActivityLog('PORTFOLIO_CREATED', `Added new portfolio project: ${projectForm.title}`);
    }
    setShowProjectModal(false);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio project from database?')) {
      deleteProject(id);
      addActivityLog('PORTFOLIO_DELETED', `Deleted portfolio project ID: ${id}`);
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const feats = serviceForm.featuresString.split(',').map(s => s.trim()).filter(Boolean);
    if (editingService) {
      updateService({
        ...editingService,
        title: serviceForm.title,
        icon: serviceForm.icon,
        image: serviceForm.image,
        description: serviceForm.description,
        features: feats
      });
      addActivityLog('SERVICE_UPDATED', `Updated service: ${serviceForm.title}`);
    } else {
      addService({
        title: serviceForm.title,
        icon: serviceForm.icon,
        image: serviceForm.image,
        description: serviceForm.description,
        features: feats
      });
      addActivityLog('SERVICE_CREATED', `Added new service: ${serviceForm.title}`);
    }
    setShowServiceModal(false);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fabrication service?')) {
      deleteService(id);
      addActivityLog('SERVICE_DELETED', `Deleted service ID: ${id}`);
    }
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonial({
      name: testimonialForm.name,
      location: testimonialForm.location || 'Pakistan',
      projectType: 'Architectural Fabrication',
      rating: testimonialForm.rating,
      text: testimonialForm.text,
      featured: testimonialForm.featured,
      published: testimonialForm.published
    });
    addActivityLog('TESTIMONIAL_CREATED', `Added testimonial from: ${testimonialForm.name}`);
    setShowTestimonialModal(false);
  };

  const handleOpenEditQuote = (q: any) => {
    setEditingQuoteId(q.id);
    setQuoteStatusInput(q.status);
    setQuotePriceInput(q.estimatedPrice || 0);
  };

  const handleSaveQuoteStatus = (id: string) => {
    updateQuoteStatus(id, quoteStatusInput, quotePriceInput);
    addActivityLog('QUOTE_STATUS_UPDATED', `Updated quote #${id.slice(-6)} status to ${quoteStatusInput}`);
    setEditingQuoteId(null);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.productCode.toLowerCase().includes(productSearch.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  if (!isAdmin) return null;

  return (
    <div className="bg-[#070C15] min-h-screen text-stone-200 font-sans flex">
      
      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION (MODERN, PROFESSIONAL SEQUENCE) */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-64 bg-[#0A101D] border-r border-brand-light/60 flex flex-col justify-between p-5 shrink-0 min-h-screen">
        <div className="space-y-6">
          
          {/* Logo & Portal Branding */}
          <div className="border-b border-brand-light/50 pb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-gold/15 border border-brand-gold/60 flex items-center justify-center text-brand-gold font-heading font-black">
              MS
            </div>
            <div>
              <span className="font-heading font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-brand-gold to-yellow-500 tracking-wider uppercase block">
                MUGHAL STEEL
              </span>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                Admin Control Center
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1 text-xs font-semibold text-stone-400">
            
            {/* 1. Dashboard */}
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <BarChart3 className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Dashboard</span>
              </div>
            </button>

            {/* 2. Catalog Products */}
            <button 
              onClick={() => setActiveTab('products')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Box className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Catalog Products</span>
              </div>
              <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded font-mono font-bold">
                {products.length}
              </span>
            </button>

            {/* 3. Categories (10 Categories) */}
            <button 
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'categories' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Categories</span>
              </div>
              <span className="text-[10px] bg-white/5 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                {categories.length}
              </span>
            </button>

            {/* 4. Quote Requests */}
            <button 
              onClick={() => setActiveTab('quotes')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'quotes' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ClipboardList className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Quote Requests</span>
              </div>
              {pendingQuotesCount > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
                  {pendingQuotesCount} new
                </span>
              )}
            </button>

            {/* 5. Orders */}
            <button 
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShoppingCart className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Recent Orders</span>
              </div>
              <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded font-mono font-bold">
                {orders.length}
              </span>
            </button>

            {/* 6. Customer Designs / Customization Requests */}
            <button 
              onClick={() => setActiveTab('designs')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'designs' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Customization Requests</span>
              </div>
              <span className="text-[10px] bg-white/5 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                {savedDesigns.length}
              </span>
            </button>

            {/* 7. Customers */}
            <button 
              onClick={() => setActiveTab('customers')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'customers' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Customers</span>
              </div>
              <span className="text-[10px] bg-white/5 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                {customerList.length}
              </span>
            </button>

            {/* 8. Services Management */}
            <button 
              onClick={() => setActiveTab('services')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Wrench className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Services Management</span>
              </div>
              <span className="text-[10px] bg-white/5 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                {services.length}
              </span>
            </button>

            {/* 9. Projects (Case Studies) */}
            <button 
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Projects (Case Studies)</span>
              </div>
              <span className="text-[10px] bg-white/5 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                {projects.length}
              </span>
            </button>

            {/* 10. Portfolio & Visual Gallery */}
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'gallery' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Camera className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Portfolio & Gallery</span>
              </div>
              <span className="text-[10px] bg-white/5 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                {projects.length}
              </span>
            </button>

            {/* 10. Testimonials / Reviews */}
            <button 
              onClick={() => setActiveTab('testimonials')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Testimonials & Reviews</span>
              </div>
              <span className="text-[10px] bg-white/5 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                {testimonials.length}
              </span>
            </button>

            {/* 11. Client Messages / Inquiries */}
            <button 
              onClick={() => setActiveTab('messages')}
              className={`py-2 px-3 text-left rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'messages' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Client Messages</span>
              </div>
              {contactMessages.filter(m => m.status === 'unread').length > 0 && (
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {contactMessages.filter(m => m.status === 'unread').length} new
                </span>
              )}
            </button>

            {/* 12. Global Settings */}
            <button 
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-3 text-left rounded-lg flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <Settings className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Global Settings</span>
            </button>

            {/* 13. Activity Audit */}
            <button 
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-3 text-left rounded-lg flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeTab === 'logs' ? 'bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/40' : 'hover:bg-white/5 hover:text-stone-100'
              }`}
            >
              <History className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Activity Audit</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-brand-light/50 space-y-2">
          <Link 
            to="/" 
            className="text-stone-400 hover:text-brand-gold text-xs uppercase tracking-wider font-bold flex items-center space-x-2 transition-colors py-1 px-2 rounded hover:bg-white/5"
          >
            <Globe className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full text-left text-red-400 hover:text-red-300 text-xs uppercase tracking-wider font-bold flex items-center space-x-2 transition-colors py-1.5 px-2 rounded hover:bg-red-950/30 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN ADMIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto max-h-screen">
        
        {/* Top Header Bar */}
        <div className="flex justify-between items-center border-b border-brand-light/60 pb-4">
          <div>
            <h1 className="text-xl font-heading font-black uppercase tracking-wider text-stone-100">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'products' && 'Catalog Products'}
              {activeTab === 'categories' && 'Categories'}
              {activeTab === 'quotes' && 'Quote Requests'}
              {activeTab === 'orders' && 'Recent Orders'}
              {activeTab === 'designs' && 'Customer Designs / Customization Requests'}
              {activeTab === 'customers' && 'Customers'}
              {activeTab === 'services' && 'Services Management'}
              {activeTab === 'projects' && 'Projects / Portfolio'}
              {activeTab === 'testimonials' && 'Testimonials / Reviews'}
              {activeTab === 'messages' && 'Client Messages / Inquiries'}
              {activeTab === 'settings' && 'Global Settings'}
              {activeTab === 'logs' && 'Activity Audit'}
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Mughal Steel Architectural Fabrication &bull; Real Database Live Synchronization
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Logged in Admin Email Display */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#0C1322] border border-brand-gold/40 rounded-lg shadow-sm">
              <div className="w-6 h-6 rounded-full bg-brand-gold/15 border border-brand-gold/60 flex items-center justify-center text-brand-gold text-[10px] font-bold">
                A
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-brand-gold font-mono font-bold uppercase tracking-wider">Authorized Admin</span>
                <span className="text-xs text-stone-200 font-mono font-semibold">{user?.email || 'Administrator'}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/90 border border-red-500/50 hover:border-red-400 text-red-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
              title="Logout from Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DASHBOARD METRICS OVERVIEW */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* 6 Real Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              
              <div className="bg-[#0C1322] border border-brand-light/60 p-4 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Total Products</span>
                  <Box className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-2xl font-heading font-black text-stone-100 block">{totalProductsCount}</span>
                <span className="text-[10px] text-slate-500 font-mono">Active catalog items</span>
              </div>

              <div className="bg-[#0C1322] border border-brand-light/60 p-4 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Total Orders</span>
                  <ShoppingCart className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-2xl font-heading font-black text-stone-100 block">{totalOrdersCount}</span>
                <span className="text-[10px] text-slate-500 font-mono">Fabrication bookings</span>
              </div>

              <div className="bg-[#0C1322] border border-brand-light/60 p-4 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Pending Orders</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-2xl font-heading font-black text-amber-400 block">{pendingOrdersCount}</span>
                <span className="text-[10px] text-slate-500 font-mono">Processing in shop</span>
              </div>

              <div className="bg-[#0C1322] border border-brand-light/60 p-4 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Pending Quotes</span>
                  <ClipboardList className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-2xl font-heading font-black text-brand-gold block">{pendingQuotesCount}</span>
                <span className="text-[10px] text-slate-500 font-mono">Requires site quote</span>
              </div>

              <div className="bg-[#0C1322] border border-brand-light/60 p-4 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Total Customers</span>
                  <Users className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-2xl font-heading font-black text-stone-100 block">{customerList.length}</span>
                <span className="text-[10px] text-slate-500 font-mono">Verified client accounts</span>
              </div>

              <div className="bg-[#0C1322] border border-brand-light/60 p-4 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <span>Quotation Value</span>
                  <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <span className="text-xl font-heading font-black text-brand-gold block truncate">Rs. {grossBusinessValue.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 font-mono">Cumulative pipeline</span>
              </div>

            </div>

            {/* Status Breakdown Bar */}
            <div className="bg-[#0C1322] border border-brand-light/60 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="font-heading font-bold uppercase tracking-wider text-slate-300 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-gold" />
                <span>Fabrication Workflow Statuses:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded font-mono font-bold text-[11px]">
                  Pending Quotes ({pendingQuotesCount})
                </span>
                <span className="px-2.5 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded font-mono font-bold text-[11px]">
                  Processing Orders ({pendingOrdersCount})
                </span>
                <span className="px-2.5 py-1 bg-green-500/15 border border-green-500/30 text-green-400 rounded font-mono font-bold text-[11px]">
                  Dispatched / Delivered ({orders.filter(o => o.orderStatus === 'delivered' || o.orderStatus === 'shipped').length})
                </span>
              </div>
            </div>

            {/* Recent Tables (Quotes & Orders) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 1. Recent Quote Requests */}
              <div className="bg-[#0C1322] border border-brand-light/60 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
                  <h3 className="font-heading font-bold text-sm uppercase text-stone-100 tracking-wider flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-brand-gold" />
                    <span>Recent Quote Requests</span>
                  </h3>
                  <button onClick={() => setActiveTab('quotes')} className="text-brand-gold hover:underline text-xs font-semibold flex items-center gap-1">
                    <span>View All ({quotes.length})</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-brand-light/30">
                  {quotes.slice(0, 4).map(q => (
                    <div key={q.id} className="py-3 flex justify-between items-center gap-4">
                      <div>
                        <p className="font-heading font-bold text-stone-100 text-xs">
                          {q.customer?.firstName} {q.customer?.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {q.doorStyle || q.projectType || q.productCategory} &bull; {q.dimensions.width}' × {q.dimensions.height}' (Qty: {q.dimensions.qty})
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono">{q.customer?.phone || q.customer?.email}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-brand-gold text-xs block">
                          Rs. {(q.estimatedPrice || 0).toLocaleString()}
                        </span>
                        <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] font-bold uppercase border ${
                          q.status === 'Approved' ? 'bg-green-950/40 border-green-500/50 text-green-400' : 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {quotes.length === 0 && (
                    <p className="text-center py-6 text-slate-500 text-xs italic">No quotation inquiries logged yet.</p>
                  )}
                </div>
              </div>

              {/* 2. Recent Orders */}
              <div className="bg-[#0C1322] border border-brand-light/60 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
                  <h3 className="font-heading font-bold text-sm uppercase text-stone-100 tracking-wider flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-brand-gold" />
                    <span>Recent Orders</span>
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-brand-gold hover:underline text-xs font-semibold flex items-center gap-1">
                    <span>View All ({orders.length})</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-brand-light/30">
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id} className="py-3 flex justify-between items-center gap-4">
                      <div>
                        <p className="font-heading font-bold text-stone-100 text-xs">
                          Order #{o.id.slice(-6)} &bull; {o.customerName}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                          {o.items?.map(i => i.productName).join(', ') || 'Custom Steel Gate'}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono">{o.customerPhone || o.customer?.phone || o.customerEmail}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-brand-gold text-xs block">
                          Rs. {(o.total || 0).toLocaleString()}
                        </span>
                        <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] font-bold uppercase border ${
                          o.orderStatus === 'delivered' || o.orderStatus === 'shipped' ? 'bg-green-950/40 border-green-500/50 text-green-400' : 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center py-6 text-slate-500 text-xs italic">No orders logged yet.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: CATALOG PRODUCTS MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-light/40 pb-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Search product or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[#070C15] border border-stone-700 rounded-lg text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <select 
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#070C15] border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-brand-gold"
                >
                  <option value="All">All Categories ({categories.length})</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleOpenNewProduct}
                className="px-4 py-2 bg-brand-gold hover:brightness-110 text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow transition"
              >
                <Plus className="w-4 h-4 text-brand-dark" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left divide-y divide-brand-light/40">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="pb-3">Product Name & Photo</th>
                    <th className="pb-3">Code / SKU</th>
                    <th className="pb-3">Category & Type</th>
                    <th className="pb-3">Rate / Price</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/30 text-stone-300">
                  {filteredProducts.map((p: Product) => (
                    <tr key={p.id} className="hover:bg-white/5 transition">
                      <td className="py-3 flex items-center gap-3">
                        <img 
                          src={p.images?.[0] || p.frontImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'} 
                          alt={p.name} 
                          className="w-12 h-12 object-cover rounded-lg border border-brand-light/50 shrink-0" 
                        />
                        <div>
                          <span className="font-heading font-bold text-stone-100 text-xs block">{p.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{p.description}</span>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-bold text-brand-gold">{p.productCode || p.sku}</td>
                      <td className="py-3">
                        <span className="text-[11px] text-stone-200 block font-semibold">{p.category}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{p.subcategory || p.item}</span>
                      </td>
                      <td className="py-3 font-mono font-bold text-stone-100">
                        Rs. {(p.pricePerSqFt || p.price || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ sq.ft</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-green-500/15 border border-green-500/30 text-green-400 rounded text-[10px] font-bold uppercase font-mono">
                          Active
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 text-stone-400 hover:text-brand-gold inline-flex bg-white/5 rounded transition cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Delete product "${p.name}"?`)) {
                              deleteProduct(p.id);
                              addActivityLog('PRODUCT_DELETED', `Deleted product: ${p.name}`);
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-red-400 inline-flex bg-white/5 rounded transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 italic">No products match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: 10 CATEGORIES DIRECTORY MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">10 Architectural Categories</h3>
                <p className="text-slate-400 text-[11px]">Manage categories (Housing Society, Modern Home, Classical Home, Commercial, Farmhouse, etc.)</p>
              </div>
              <button 
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({
                    name: 'Housing Society',
                    slug: '',
                    tagline: '',
                    description: '',
                    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                    itemsString: 'Front Gates, Main Gates, Railing, Stair Railing, Doors'
                  });
                  setShowCategoryModal(true);
                }}
                className="px-3.5 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow hover:brightness-110"
              >
                <Plus className="w-4 h-4 text-brand-dark" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => (
                <div key={cat.id || idx} className="bg-[#070C15] border border-brand-light/60 rounded-xl overflow-hidden shadow flex flex-col justify-between">
                  <div>
                    <div className="h-36 relative overflow-hidden">
                      <img src={cat.heroImage} alt={cat.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070C15] via-transparent to-black/40"></div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-gold/90 text-brand-dark font-mono text-[9px] font-black uppercase rounded shadow">
                        #{idx + 1}
                      </span>
                      <span className="absolute bottom-2 left-3 font-heading font-black text-sm text-stone-100 uppercase">
                        {cat.name}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-[11px] text-brand-gold font-mono font-semibold">{cat.tagline}</p>
                      <p className="text-slate-400 text-[11px] line-clamp-2">{cat.description}</p>
                      <div className="pt-2 border-t border-brand-light/30 flex flex-wrap gap-1">
                        {cat.items?.map((it, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-stone-300">
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t border-brand-light/20 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">Slug: /{cat.slug}</span>
                    <div className="space-x-2">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryForm({
                            name: cat.name,
                            slug: cat.slug,
                            tagline: cat.tagline,
                            description: cat.description,
                            heroImage: cat.heroImage,
                            itemsString: (cat.items || []).join(', ')
                          });
                          setShowCategoryModal(true);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-gold inline-flex"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1 text-slate-500 hover:text-red-400 inline-flex"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: QUOTE REQUESTS QUEUE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'quotes' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Customer Quote Requests Queue</h3>
                <p className="text-slate-400 text-[11px]">Review dimensions, client contact coordinates, and issue verified cost estimates</p>
              </div>
              <span className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/40 text-brand-gold font-mono font-bold rounded-lg text-xs">
                Total: {quotes.length} Requests
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left divide-y divide-brand-light/40">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="pb-3">Customer Info</th>
                    <th className="pb-3">Design & Category</th>
                    <th className="pb-3">Dimensions</th>
                    <th className="pb-3">Quoted Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/30 text-stone-300">
                  {quotes.map(q => {
                    const isEditing = editingQuoteId === q.id;
                    return (
                      <tr key={q.id} className="hover:bg-white/5 transition align-top">
                        <td className="py-3.5">
                          <p className="font-heading font-bold text-stone-100 text-xs">
                            {q.customer?.firstName} {q.customer?.lastName}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{q.customer?.phone}</p>
                          <p className="text-[10px] text-slate-500">{q.customer?.email}</p>
                          {q.customer?.address && (
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{q.customer.address}</p>
                          )}
                        </td>
                        <td className="py-3.5 max-w-xs">
                          <p className="font-heading font-bold text-stone-100 text-xs">
                            {q.doorStyle || q.projectType || q.productCategory}
                          </p>
                          {q.productCode && (
                            <span className="text-[10px] text-brand-gold font-mono font-bold block">{q.productCode}</span>
                          )}
                          <p className="text-[10px] text-slate-400 leading-relaxed truncate mt-0.5">{q.notes || 'Standard specifications'}</p>
                        </td>
                        <td className="py-3.5 font-mono">
                          <p className="text-stone-100 font-bold">{q.dimensions.width}' × {q.dimensions.height}'</p>
                          <p className="text-[10px] text-slate-400">Qty: {q.dimensions.qty} Unit(s)</p>
                        </td>
                        <td className="py-3.5 font-mono font-bold text-brand-gold">
                          {isEditing ? (
                            <input 
                              type="number"
                              value={quotePriceInput}
                              onChange={(e) => setQuotePriceInput(Number(e.target.value))}
                              className="w-24 bg-[#070C15] border border-brand-gold rounded px-2 py-1 text-xs text-brand-gold font-bold focus:outline-none"
                            />
                          ) : (
                            <span>Rs. {(q.estimatedPrice || 0).toLocaleString()}</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          {isEditing ? (
                            <select 
                              value={quoteStatusInput}
                              onChange={(e) => setQuoteStatusInput(e.target.value)}
                              className="bg-[#070C15] border border-brand-gold text-stone-200 text-xs rounded px-2 py-1 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="Quoted">Quoted</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              q.status === 'Approved' ? 'bg-green-950/40 border-green-500/50 text-green-400' : 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                            }`}>
                              {q.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          {isEditing ? (
                            <div className="inline-flex gap-1">
                              <button onClick={() => handleSaveQuoteStatus(q.id)} className="p-1.5 bg-green-900/60 hover:bg-green-800 text-green-300 rounded" title="Save">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setEditingQuoteId(null)} className="p-1.5 bg-red-900/60 hover:bg-red-800 text-red-300 rounded" title="Cancel">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex gap-1.5">
                              <button 
                                onClick={() => setViewingQuote(q)}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-stone-300 rounded text-[10px] font-bold"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleOpenEditQuote(q)}
                                className="px-2 py-1 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark text-brand-gold border border-brand-gold/40 rounded text-[10px] font-bold transition"
                              >
                                Edit Status
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 italic">No quote requests recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: FABRICATION ORDERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Recent Orders & Dispatch</h3>
                <p className="text-slate-400 text-[11px]">Track fabrication stages, customer shipments, and final site delivery</p>
              </div>
              <span className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/40 text-brand-gold font-mono font-bold rounded-lg text-xs">
                Total: {orders.length} Bookings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left divide-y divide-brand-light/40">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="pb-3">Order Details</th>
                    <th className="pb-3">Customer Information</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Dispatch Status</th>
                    <th className="pb-3 text-right">Progress Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/30 text-stone-300">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-white/5 transition align-top">
                      <td className="py-3.5">
                        <p className="font-mono font-bold text-brand-gold text-xs">#Order {o.id.slice(-6)}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Purchased items ({o.items?.length || 1}):</p>
                        <ul className="list-disc pl-4 text-stone-400 text-[10px] mt-1 space-y-0.5">
                          {o.items?.map((item, idx) => (
                            <li key={idx}>{item.productName} (x{item.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3.5">
                        <p className="font-heading font-bold text-stone-100 text-xs">{o.customerName}</p>
                        <p className="text-[10px] text-slate-400">{o.customerEmail}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{o.customerPhone || o.customer?.phone || 'N/A'}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                          {o.shippingAddress?.street}, {o.shippingAddress?.city}
                        </p>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-brand-gold text-xs">
                        Rs. {(o.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          o.orderStatus === 'delivered' || o.orderStatus === 'shipped' 
                            ? 'bg-green-950/40 border-green-500/50 text-green-400' 
                            : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-1.5">
                        <button 
                          onClick={() => setViewingOrder(o)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-stone-300 rounded text-[10px] font-bold cursor-pointer"
                        >
                          Details
                        </button>
                        {o.orderStatus === 'processing' && (
                          <button 
                            onClick={() => {
                              updateOrderStatus(o.id, 'shipped');
                              addActivityLog('ORDER_DISPATCHED', `Marked order #${o.id.slice(-6)} as Shipped`);
                            }}
                            className="px-2.5 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Ship Order
                          </button>
                        )}
                        {o.orderStatus === 'shipped' && (
                          <button 
                            onClick={() => {
                              updateOrderStatus(o.id, 'delivered');
                              addActivityLog('ORDER_DELIVERED', `Marked order #${o.id.slice(-6)} as Delivered`);
                            }}
                            className="px-2.5 py-1 bg-green-900/60 hover:bg-green-800 text-green-200 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500 italic">No fabrication bookings logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: CUSTOMER DESIGNS / CUSTOMIZATION REQUESTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'designs' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Customer Designs / Customization Requests</h3>
                <p className="text-slate-400 text-[11px]">Bespoke configurations created via Custom Door Wizard & Virtual Try-On</p>
              </div>
              <span className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/40 text-brand-gold font-mono font-bold rounded-lg text-xs">
                Total: {savedDesigns.length} Custom Designs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesigns.map(d => (
                <div key={d.id} className="bg-[#070C15] border border-brand-light/60 p-5 rounded-xl space-y-3 flex flex-col justify-between shadow">
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-brand-gold font-mono font-bold uppercase">
                      <span>Config: {d.doorType || 'Main Entry'}</span>
                      <span>#{d.id.slice(-6)}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-stone-100 mt-2">
                      {d.width}"W × {d.height}"H Architectural Entry
                    </h4>
                    <div className="text-[11px] text-slate-400 space-y-1 mt-2.5 leading-relaxed font-sans">
                      <p><span className="text-slate-300 font-semibold">Finish:</span> {d.finish || 'Charcoal Powder Coat'}</p>
                      <p><span className="text-slate-300 font-semibold">Glass:</span> {d.glass || 'Low-E Tempered'}</p>
                      <p><span className="text-slate-300 font-semibold">Lock & Handle:</span> {d.hardware || 'Smart Digital Multi-point'}</p>
                    </div>
                  </div>
                  <div className="border-t border-brand-light/30 pt-3 flex justify-between items-center">
                    <span className="text-brand-gold font-bold font-mono text-sm">
                      Rs. {(d.estimatedPrice || d.price || 240000).toLocaleString()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-bold rounded uppercase">
                      Saved Layout
                    </span>
                  </div>
                </div>
              ))}
              {savedDesigns.length === 0 && (
                <div className="col-span-3 text-center py-12 text-slate-500 italic">
                  No customer customized wizard configurations submitted yet.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: CUSTOMERS DATABASE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'customers' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Customer Database & History</h3>
                <p className="text-slate-400 text-[11px]">Consolidated client records across account registrations, bookings, and inquiries</p>
              </div>
              <span className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/40 text-brand-gold font-mono font-bold rounded-lg text-xs">
                Total: {customerList.length} Verified Clients
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left divide-y divide-brand-light/40">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="pb-3">Client Name</th>
                    <th className="pb-3">Contact Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Site Location</th>
                    <th className="pb-3">Orders / Quotes</th>
                    <th className="pb-3">Total Value</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/30 text-stone-300">
                  {customerList.map(c => (
                    <tr key={c.id} className="hover:bg-white/5 transition">
                      <td className="py-3 font-heading font-bold text-stone-100 text-xs">{c.name}</td>
                      <td className="py-3 text-slate-300 font-mono text-[11px]">{c.email}</td>
                      <td className="py-3 text-slate-400 font-mono">{c.phone}</td>
                      <td className="py-3 text-slate-400">{c.city || 'Pakistan'}</td>
                      <td className="py-3">
                        <span className="text-[11px] font-bold text-stone-200">{c.ordersCount} Orders</span> &bull; <span className="text-brand-gold">{c.quotesCount} Quotes</span>
                      </td>
                      <td className="py-3 font-mono font-bold text-brand-gold">
                        Rs. {c.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => setViewingCustomer(c)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-brand-gold hover:text-brand-dark text-stone-200 border border-white/10 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: SERVICES MANAGEMENT (ADD / EDIT / DELETE) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'services' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Fabrication Services Management</h3>
                <p className="text-slate-400 text-[11px]">Add, edit, or remove fabrication and engineering expertise displayed on the website</p>
              </div>
              <button 
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({
                    title: '',
                    icon: 'DoorClosed',
                    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                    description: '',
                    featuresString: 'CNC Laser Cut Precision, Automation Motor Ready, Anti-Corrosion Zinc Undercoat, 10-Year Structural Integrity'
                  });
                  setShowServiceModal(true);
                }}
                className="px-3.5 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow hover:brightness-110"
              >
                <Plus className="w-4 h-4 text-brand-dark" />
                <span>Add Fabrication Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(serv => (
                <div key={serv.id} className="bg-[#070C15] border border-brand-light/60 rounded-xl overflow-hidden shadow flex flex-col justify-between">
                  <div>
                    <div className="h-40 relative overflow-hidden">
                      <img src={serv.image} alt={serv.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070C15] via-transparent to-black/30"></div>
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/70 border border-brand-gold/40 text-brand-gold font-mono text-[9px] font-bold uppercase rounded">
                        {serv.icon || 'Fabrication'}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-heading font-bold text-sm text-stone-100">{serv.title}</h4>
                      <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">{serv.description}</p>
                      <div className="pt-2 border-t border-brand-light/30 space-y-1">
                        {serv.features?.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-brand-gold shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t border-brand-light/20 flex justify-end items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingService(serv);
                        setServiceForm({
                          title: serv.title,
                          icon: serv.icon,
                          image: serv.image,
                          description: serv.description,
                          featuresString: (serv.features || []).join(', ')
                        });
                        setShowServiceModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-gold inline-flex bg-white/5 rounded cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(serv.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 inline-flex bg-white/5 rounded cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: PROJECTS / CASE STUDIES CMS (/projects & /projects/:slug) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            
            {/* Header & Add Project Trigger */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-brand-light/40 pb-4 gap-4">
              <div>
                <h3 className="font-heading font-black text-base uppercase text-stone-100 flex items-center gap-2">
                  <span>Projects & Architectural Case Studies</span>
                  <span className="text-[10px] bg-brand-gold/15 text-brand-gold border border-brand-gold/40 px-2 py-0.5 rounded font-mono font-bold">
                    {projects.length} Case Studies
                  </span>
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Manage client site installations, technical engineering specifications, deliverables, and full case study articles for <code className="text-brand-gold">/projects</code>.
                </p>
              </div>

              <button 
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({
                    title: '',
                    slug: '',
                    category: 'Main Gates',
                    shortDescription: '',
                    projectType: 'Residential Luxury Villa',
                    clientType: 'Private Residence',
                    duration: '14 Days',
                    materials: 'Grade A Mild Steel, CNC Laser Cut Sheet, Electrostatic Powder Coat',
                    services: 'CAD Custom Design, CNC Laser Cutting, Structural Welding, On-Site Installation',
                    location: 'Islamabad, Pakistan',
                    completedDate: '2026',
                    featured: true,
                    displayOrder: 0,
                    status: 'Completed',
                    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    galleryImages: [
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
                    ],
                    description: 'Custom fabricated heavy-duty architectural entrance with CNC fiber laser cut patterns and oven-baked powder coating.',
                    steelGrade: 'Grade A Structural Mild Carbon Steel',
                    gauge: '14-Gauge (2.0mm) & 12-Gauge (2.5mm)',
                    finish: 'Matte Black Electrostatic Powder Coating',
                    automation: 'Italian Heavy-Duty 800KG Sliding Motor',
                    span: '14ft Width × 7.5ft Height',
                    deliverablesString: 'Main Grand Entrance Gate, Boundary Wall Grills, Balcony Safety Railings, Laser Foundation Anchoring'
                  });
                  setShowProjectModal(true);
                }}
                className="px-4 py-2.5 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 shrink-0"
              >
                <Plus className="w-4 h-4 text-brand-dark" />
                <span>Add Project Case Study</span>
              </button>
            </div>

            {/* Search and Category + Status Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#070C15] p-3 rounded-lg border border-brand-light/40">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={portfolioSearch}
                  onChange={(e) => setPortfolioSearch(e.target.value)}
                  placeholder="Search projects by title, location, category..."
                  className="w-full bg-[#0C1322] border border-stone-700 rounded-md pl-9 pr-3 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <span className="text-slate-400 text-[11px] font-bold uppercase shrink-0">Filter:</span>
                
                {/* Status Filter */}
                <select
                  value={portfolioStatusFilter}
                  onChange={(e) => setPortfolioStatusFilter(e.target.value)}
                  className="bg-[#0C1322] border border-stone-700 rounded-md px-3 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-brand-gold font-bold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                </select>

                {/* Category Filter */}
                <select
                  value={portfolioCategoryFilter}
                  onChange={(e) => setPortfolioCategoryFilter(e.target.value)}
                  className="bg-[#0C1322] border border-stone-700 rounded-md px-3 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-brand-gold font-bold"
                >
                  <option value="All">All Categories ({projects.length})</option>
                  {['Main Gates', 'Steel Doors', 'Grills', 'Railings', 'Staircases', 'Steel Windows', 'Custom Fabrication', 'Commercial', 'Modern Home', 'Classical Home'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => {
                  const s = portfolioSearch.toLowerCase();
                  const matchesSearch = !s || 
                    p.title.toLowerCase().includes(s) || 
                    (p.location && p.location.toLowerCase().includes(s)) ||
                    p.category.toLowerCase().includes(s);
                  const matchesCat = portfolioCategoryFilter === 'All' || 
                    p.category.toLowerCase() === portfolioCategoryFilter.toLowerCase() ||
                    p.category.toLowerCase().includes(portfolioCategoryFilter.toLowerCase());
                  const matchesStatus = portfolioStatusFilter === 'All' ||
                    (p.status && p.status.toLowerCase() === portfolioStatusFilter.toLowerCase());
                  return matchesSearch && matchesCat && matchesStatus;
                })
                .map(proj => (
                  <div key={proj.id} className="bg-[#070C15] border border-brand-light/60 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-brand-gold/60 transition-all duration-300">
                    <div>
                      {/* Image Thumbnail with Featured & Status Badge */}
                      <div className="h-44 relative overflow-hidden bg-black">
                        <img 
                          src={proj.image || (proj as any).coverImage} 
                          alt={proj.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070C15] via-transparent to-black/30"></div>
                        
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-black/80 border border-brand-gold/50 text-brand-gold font-mono text-[9px] font-bold uppercase rounded">
                            {proj.category}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                          <span className={`px-2 py-0.5 font-mono text-[9px] font-black uppercase rounded shadow ${
                            proj.status?.toLowerCase() === 'in progress'
                              ? 'bg-amber-500 text-black'
                              : 'bg-emerald-500 text-white'
                          }`}>
                            {proj.status?.toUpperCase() || 'COMPLETED'}
                          </span>
                          {proj.featured && (
                            <span className="px-2 py-0.5 bg-brand-gold text-brand-dark font-mono text-[9px] font-black uppercase rounded shadow">
                              ★
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-heading font-black text-sm text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1">
                          {proj.title}
                        </h4>
                        
                        <p className="text-[10px] text-brand-gold font-mono">
                          {proj.projectType || 'Residential Project'} • {proj.clientType || 'Private Residence'}
                        </p>

                        <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                          {proj.shortDescription || proj.description}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-brand-light/20">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-gold" />
                            {proj.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brand-gold" />
                            {proj.completedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="p-4 pt-0 border-t border-brand-light/20 flex justify-between items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono text-slate-500">
                        {proj.galleryImages?.length || 1} Photos
                      </span>

                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingProject(proj);
                            const gallery = proj.galleryImages && proj.galleryImages.length > 0
                              ? proj.galleryImages
                              : [proj.image || (proj as any).coverImage || ''];

                            setProjectForm({
                              title: proj.title,
                              slug: proj.slug || '',
                              category: proj.category,
                              shortDescription: proj.shortDescription || '',
                              projectType: proj.projectType || 'Residential Luxury Villa',
                              clientType: proj.clientType || 'Private Residence',
                              duration: proj.duration || '14 Days',
                              materials: proj.materials || 'Grade A Mild Steel, CNC Laser Cut Sheet, Electrostatic Powder Coat',
                              services: proj.services || 'CAD Custom Design, CNC Laser Cutting, Structural Welding, On-Site Installation',
                              location: proj.location || 'Islamabad, Pakistan',
                              completedDate: proj.completedDate || '2026',
                              featured: Boolean(proj.featured),
                              displayOrder: proj.displayOrder || 0,
                              status: proj.status || 'Completed',
                              image: proj.image || (proj as any).coverImage || gallery[0],
                              galleryImages: gallery,
                              description: proj.description || '',
                              steelGrade: proj.specs?.steelGrade || 'Grade A Structural Mild Carbon Steel',
                              gauge: proj.specs?.gauge || '14-Gauge (2.0mm) & 12-Gauge (2.5mm)',
                              finish: proj.specs?.finish || 'Matte Black Electrostatic Powder Coating',
                              automation: proj.specs?.automation || 'Italian Heavy-Duty 800KG Sliding Motor',
                              span: proj.specs?.span || '14ft Width × 7.5ft Height',
                              deliverablesString: (proj.deliverables || []).join(', ') || 'Main Grand Entrance Gate, Boundary Wall Grills, Balcony Safety Railings'
                            });
                            setShowProjectModal(true);
                          }}
                          className="px-2.5 py-1 text-slate-300 hover:text-brand-gold bg-white/5 hover:bg-brand-gold/10 border border-brand-light/40 rounded flex items-center gap-1 cursor-pointer transition"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="px-2 py-1 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-brand-light/40 rounded flex items-center gap-1 cursor-pointer transition"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 10: PORTFOLIO & VISUAL GALLERY CMS (/gallery) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'gallery' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-brand-light/40 pb-4 gap-4">
              <div>
                <h3 className="font-heading font-black text-base uppercase text-stone-100 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-brand-gold" />
                  <span>Portfolio & Visual Gallery Media CMS</span>
                  <span className="text-[10px] bg-brand-gold/15 text-brand-gold border border-brand-gold/40 px-2 py-0.5 rounded font-mono font-bold">
                    Public Photo Explorer
                  </span>
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Curate high-definition multi-angle gallery photos and client visual showcase for <code className="text-brand-gold">/gallery</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/gallery"
                  target="_blank"
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-stone-200 border border-brand-light/60 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Preview Live Gallery</span>
                </Link>

                <button 
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: '',
                      slug: '',
                      category: 'Main Gates',
                      shortDescription: 'High-definition architectural steel fabrication and site installation photography.',
                      projectType: 'Residential Luxury Villa',
                      clientType: 'Private Residence',
                      duration: '14 Days',
                      materials: 'Grade A Mild Steel, CNC Laser Cut Sheet, Electrostatic Powder Coat',
                      services: 'CAD Custom Design, CNC Laser Cutting, Structural Welding, On-Site Installation',
                      location: 'Islamabad, Pakistan',
                      completedDate: '2026',
                      featured: true,
                      displayOrder: 0,
                      status: 'Completed',
                      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                      galleryImages: [
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
                      ],
                      description: 'High-resolution architectural photography showcasing custom fabricated metal gates, railings, and security grills.',
                      steelGrade: 'Grade A Structural Mild Carbon Steel',
                      gauge: '14-Gauge (2.0mm)',
                      finish: 'Matte Black Electrostatic Powder Coating',
                      automation: 'Italian Heavy-Duty 800KG Sliding Motor',
                      span: '14ft Width × 7.5ft Height',
                      deliverablesString: 'Grand Driveway Gate, Boundary Wall Grills, Balcony Safety Railings'
                    });
                    setShowProjectModal(true);
                  }}
                  className="px-4 py-2.5 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 shrink-0"
                >
                  <Plus className="w-4 h-4 text-brand-dark" />
                  <span>Add Portfolio Album</span>
                </button>
              </div>
            </div>

            {/* Gallery Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#070C15] p-3 rounded-lg border border-brand-light/40">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Search photo albums & projects..."
                  className="w-full bg-[#0C1322] border border-stone-700 rounded-md pl-9 pr-3 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-slate-400 text-[11px] font-bold uppercase shrink-0">Category:</span>
                <select
                  value={galleryCategoryFilter}
                  onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                  className="bg-[#0C1322] border border-stone-700 rounded-md px-3 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-brand-gold font-bold"
                >
                  <option value="All">All Categories</option>
                  {['Main Gates', 'Steel Doors', 'Grills', 'Railings', 'Staircases', 'Steel Windows', 'Custom Fabrication', 'Commercial', 'Modern Home', 'Classical Home'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gallery Albums Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => {
                  const s = gallerySearch.toLowerCase();
                  const matchesSearch = !s || p.title.toLowerCase().includes(s) || p.category.toLowerCase().includes(s);
                  const matchesCat = galleryCategoryFilter === 'All' || p.category.toLowerCase() === galleryCategoryFilter.toLowerCase();
                  return matchesSearch && matchesCat;
                })
                .map(proj => {
                  const gallery = proj.galleryImages && proj.galleryImages.length > 0
                    ? proj.galleryImages
                    : [proj.image || (proj as any).coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

                  return (
                    <div key={proj.id} className="bg-[#070C15] border border-brand-light/60 rounded-xl overflow-hidden shadow-xl space-y-3 p-3 group hover:border-brand-gold transition-all duration-300">
                      
                      {/* Main Cover */}
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black">
                        <img 
                          src={gallery[0]} 
                          alt={proj.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-brand-gold font-bold border border-brand-gold/40">
                          {proj.category}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-stone-300">
                          {gallery.length} High-Res Angles
                        </div>
                      </div>

                      {/* Multi-angle Thumbnails preview */}
                      {gallery.length > 1 && (
                        <div className="grid grid-cols-4 gap-1.5">
                          {gallery.slice(0, 4).map((img, idx) => (
                            <div key={idx} className="aspect-square rounded overflow-hidden border border-stone-800 bg-black">
                              <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Details & Quick Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-brand-light/20">
                        <div className="min-w-0 pr-2">
                          <h4 className="font-heading font-black text-xs text-stone-100 line-clamp-1 uppercase">
                            {proj.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {proj.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(proj);
                              setProjectForm({
                                title: proj.title,
                                slug: proj.slug || '',
                                category: proj.category,
                                shortDescription: proj.shortDescription || '',
                                projectType: proj.projectType || 'Residential Luxury Villa',
                                clientType: proj.clientType || 'Private Residence',
                                duration: proj.duration || '14 Days',
                                materials: proj.materials || 'Grade A Mild Steel, CNC Laser Cut Sheet, Electrostatic Powder Coat',
                                services: proj.services || 'CAD Custom Design, CNC Laser Cutting, Structural Welding, On-Site Installation',
                                location: proj.location || 'Islamabad, Pakistan',
                                completedDate: proj.completedDate || '2026',
                                featured: Boolean(proj.featured),
                                displayOrder: proj.displayOrder || 0,
                                status: proj.status || 'Completed',
                                image: proj.image || (proj as any).coverImage || gallery[0],
                                galleryImages: gallery,
                                description: proj.description || '',
                                steelGrade: proj.specs?.steelGrade || 'Grade A Structural Mild Carbon Steel',
                                gauge: proj.specs?.gauge || '14-Gauge (2.0mm) & 12-Gauge (2.5mm)',
                                finish: proj.specs?.finish || 'Matte Black Electrostatic Powder Coating',
                                automation: proj.specs?.automation || 'Italian Heavy-Duty 800KG Sliding Motor',
                                span: proj.specs?.span || '14ft Width × 7.5ft Height',
                                deliverablesString: (proj.deliverables || []).join(', ') || 'Main Grand Entrance Gate, Boundary Wall Grills, Balcony Safety Railings'
                              });
                              setShowProjectModal(true);
                            }}
                            className="px-2.5 py-1 bg-brand-gold/15 hover:bg-brand-gold hover:text-brand-dark text-brand-gold border border-brand-gold/40 rounded text-[10px] font-heading font-black uppercase transition cursor-pointer"
                          >
                            Manage
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-brand-light/40 rounded cursor-pointer transition"
                            title="Delete Portfolio Album"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 10: TESTIMONIALS & REVIEWS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'testimonials' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Testimonials & Reviews Moderation</h3>
                <p className="text-slate-400 text-[11px]">Moderate public customer satisfaction ratings and site feedback</p>
              </div>
              <button 
                onClick={() => {
                  setTestimonialForm({ name: '', location: '', rating: 5, text: '', featured: true, published: true });
                  setShowTestimonialModal(true);
                }}
                className="px-3.5 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow hover:brightness-110"
              >
                <Plus className="w-4 h-4 text-brand-dark" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left divide-y divide-brand-light/40">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="pb-3">Client Name</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Review Feedback</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/30 text-stone-300">
                  {testimonials.map(t => (
                    <tr key={t.id} className="hover:bg-white/5 transition align-top">
                      <td className="py-3 font-heading font-bold text-stone-100 text-xs">{t.name}</td>
                      <td className="py-3 text-slate-400">{t.location}</td>
                      <td className="py-3 text-brand-gold font-bold">{"★".repeat(t.rating)}</td>
                      <td className="py-3 max-w-sm text-slate-300 leading-relaxed italic text-[11px]">"{t.text}"</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          t.published !== false ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-stone-800 text-stone-400'
                        }`}>
                          {t.published !== false ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button 
                          onClick={() => {
                            updateTestimonial({ ...t, published: !(t.published !== false) });
                            addActivityLog('TESTIMONIAL_STATUS', `Toggled publish state for: ${t.name}`);
                          }}
                          className="px-2 py-1 bg-white/5 hover:bg-brand-gold hover:text-brand-dark text-stone-200 border border-white/10 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          {t.published !== false ? 'Hide' : 'Publish'}
                        </button>
                        <button 
                          onClick={() => {
                            deleteTestimonial(t.id);
                            addActivityLog('TESTIMONIAL_DELETED', `Deleted testimonial by: ${t.name}`);
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 inline-flex cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 11: CLIENT MESSAGES & INQUIRIES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'messages' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Client Messages & Inquiries</h3>
                <p className="text-slate-400 text-[11px]">Messages sent via Contact Consultation & Inquiry forms</p>
              </div>
              <span className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/40 text-brand-gold font-mono font-bold rounded-lg text-xs">
                Total: {contactMessages.length} Messages
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left divide-y divide-brand-light/40">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="pb-3">Client Contact</th>
                    <th className="pb-3">Subject</th>
                    <th className="pb-3">Message Content</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/30 text-stone-300">
                  {contactMessages.map(m => (
                    <tr key={m.id} className={`hover:bg-white/5 transition align-top ${m.status === 'unread' ? 'bg-brand-gold/5' : ''}`}>
                      <td className="py-3.5">
                        <p className="font-heading font-bold text-stone-100 text-xs">{m.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{m.email}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{m.phone}</p>
                      </td>
                      <td className="py-3.5 font-heading font-bold text-brand-gold uppercase text-[10px]">
                        {m.subject || 'Fabrication Inquiry'}
                      </td>
                      <td className="py-3.5 max-w-sm text-slate-300 leading-relaxed italic text-[11px]">
                        "{m.message}"
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                          m.status === 'unread' ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'bg-stone-800 text-stone-400'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {m.status === 'unread' ? (
                          <button 
                            onClick={() => {
                              updateContactMessageStatus(m.id, 'read');
                              addActivityLog('MESSAGE_READ', `Marked message from ${m.name} as read`);
                            }}
                            className="px-2.5 py-1 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark text-brand-gold border border-brand-gold/40 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Mark Read
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 uppercase font-mono">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {contactMessages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500 italic">No contact inquiries logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 12: GLOBAL WEBSITE SETTINGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && settingsForm && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings(settingsForm);
              addActivityLog('SETTINGS_UPDATED', 'Updated central company fabrication coordinates & rates');
              alert('Website settings updated successfully! Live website refreshed.');
            }}
            className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in"
          >
            <div className="border-b border-brand-light/40 pb-4 flex justify-between items-center">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">Central Website & Company Coordinates</h3>
                <p className="text-slate-400 text-[11px]">Update phone numbers, WhatsApp contact, workshop address, and standard fabrication rates</p>
              </div>
              <button 
                type="submit"
                className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider hover:brightness-110 transition shadow cursor-pointer"
              >
                Save Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-xs text-brand-gold uppercase tracking-wider">Company Identity</h4>
                
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Company Name</label>
                  <input 
                    type="text" 
                    value={settingsForm.companyName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Official Phone</label>
                    <input 
                      type="text" 
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">WhatsApp Direct Number</label>
                    <input 
                      type="text" 
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Business Email</label>
                  <input 
                    type="email" 
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Operating Hours</label>
                  <input 
                    type="text" 
                    value={settingsForm.businessHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-xs text-brand-gold uppercase tracking-wider">Physical Workshop Yard & Address</h4>
                
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Street Address</label>
                  <input 
                    type="text" 
                    value={settingsForm.streetAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, streetAddress: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">City / Territory</label>
                    <input 
                      type="text" 
                      value={settingsForm.city}
                      onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                      className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Province / State</label>
                    <input 
                      type="text" 
                      value={settingsForm.state}
                      onChange={(e) => setSettingsForm({ ...settingsForm, state: e.target.value })}
                      className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Google Maps Navigation Link</label>
                  <input 
                    type="url" 
                    value={settingsForm.googleMapsUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold text-xs font-mono"
                  />
                </div>
              </div>

            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 13: ACTIVITY AUDIT TRAIL */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'logs' && (
          <div className="bg-[#0C1322] border border-brand-light/60 p-6 rounded-xl space-y-6 text-xs text-stone-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-stone-100">System Activity & Audit Log</h3>
                <p className="text-slate-400 text-[11px]">Chronological record of administrator operations, status updates, and catalog changes</p>
              </div>
              <span className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/40 text-brand-gold font-mono font-bold rounded-lg text-xs">
                {activityLogs.length} Logged Events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left divide-y divide-brand-light/40 font-mono text-xs">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Action Type</th>
                    <th className="pb-3">Operator</th>
                    <th className="pb-3">Event Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/30 text-stone-300">
                  {activityLogs.map((log: ActivityLog) => (
                    <tr key={log.id} className="hover:bg-white/5 transition">
                      <td className="py-2.5 text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded text-[9px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 text-stone-300 text-[11px]">{log.user || user?.email || 'Admin User'}</td>
                      <td className="py-2.5 text-slate-300 text-[11px] font-sans">{log.details}</td>
                    </tr>
                  ))}
                  {activityLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-500 italic font-sans">No security events logged in current session.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PRODUCT ADD / EDIT */}
      {/* ------------------------------------------------------------- */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1322] border border-brand-gold/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Product Name</label>
                  <input 
                    type="text" 
                    required 
                    value={productForm.name} 
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Imperial CNC Laser Main Gate"
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">SKU / Product Code</label>
                  <input 
                    type="text" 
                    required 
                    value={productForm.sku} 
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="MFG-G001"
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Category ({categories.length} Available)</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-brand-gold"
                  >
                    {categories.map(cat => (
                      <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Subcategory / Item Type</label>
                  <select 
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Front Gates">Front Gates</option>
                    <option value="Main Gates">Main Gates</option>
                    <option value="Doors">Doors</option>
                    <option value="Railing">Railing</option>
                    <option value="Stair Railing">Stair Railing</option>
                    <option value="Balcony Railing">Balcony Railing</option>
                    <option value="Boundary Wall Grills">Boundary Wall Grills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Rate per Sq.Ft (PKR)</label>
                  <input 
                    type="number" 
                    required 
                    min={100}
                    value={productForm.price} 
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2.5 text-brand-gold font-bold focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
              </div>

              {/* 4-SIDE PRODUCT IMAGES UPLOAD SECTION */}
              <div className="bg-[#070C15] border border-stone-800 rounded-xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-brand-gold" />
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-200">
                        4-Side Product Photos (Front, Back & 2 Sides)
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Upload dedicated photos for all 4 angles. Customers can inspect all 4 views interactively.
                    </p>
                  </div>

                  {/* Batch Upload & Mode Switcher */}
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold rounded-lg text-xs font-mono font-bold cursor-pointer transition flex items-center gap-1.5">
                      <FolderUp className="w-3.5 h-3.5" />
                      <span>Batch Upload (All 4 Sides)</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleBatch4SidesUpload} 
                        className="hidden" 
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setImageUploadTab(prev => prev === 'upload' ? 'url' : 'upload')}
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 rounded-lg text-[11px] font-mono transition"
                    >
                      {imageUploadTab === 'upload' ? '🔗 URL Mode' : '📁 File Upload'}
                    </button>
                  </div>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* 1. FRONT VIEW */}
                  <div className="bg-[#0C1322] border border-brand-gold/40 rounded-xl p-3 flex flex-col justify-between space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-brand-gold uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                        1. Front View *
                      </span>
                      {productForm.frontImage ? (
                        <span className="text-[9px] text-emerald-400 font-mono">✓ Ready</span>
                      ) : (
                        <span className="text-[9px] text-amber-400 font-mono">Required</span>
                      )}
                    </div>

                    {productForm.frontImage ? (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-700 group bg-black">
                        <img src={productForm.frontImage} alt="Front View" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                          <label className="p-1.5 bg-brand-gold text-brand-dark rounded text-[10px] font-bold cursor-pointer hover:brightness-110">
                            Change
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleSingleImageUpload(e, 'frontImage')} 
                              className="hidden" 
                            />
                          </label>
                          <button 
                            type="button" 
                            onClick={() => setProductForm({ ...productForm, frontImage: '' })}
                            className="p-1.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-brand-gold/40 hover:border-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 transition flex flex-col items-center justify-center p-2 text-center cursor-pointer group">
                        <Upload className="w-5 h-5 text-brand-gold group-hover:scale-110 transition mb-1" />
                        <span className="text-[11px] font-bold text-stone-200 block">Upload Front Image</span>
                        <span className="text-[9px] text-stone-400 font-mono mt-0.5">Click or drag photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleSingleImageUpload(e, 'frontImage')} 
                          className="hidden" 
                        />
                      </label>
                    )}

                    {imageUploadTab === 'url' && (
                      <input 
                        type="url" 
                        value={productForm.frontImage} 
                        onChange={(e) => setProductForm({ ...productForm, frontImage: e.target.value })}
                        placeholder="Image URL..." 
                        className="w-full bg-[#070C15] border border-stone-700 rounded px-2 py-1 text-[10px] text-stone-100 font-mono"
                      />
                    )}
                  </div>

                  {/* 2. BACK VIEW */}
                  <div className="bg-[#0C1322] border border-stone-800 hover:border-stone-700 rounded-xl p-3 flex flex-col justify-between space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-stone-300 uppercase flex items-center gap-1">
                        <RotateCw className="w-3 h-3 text-stone-400" />
                        2. Back View
                      </span>
                      {productForm.backImage ? (
                        <span className="text-[9px] text-emerald-400 font-mono">✓ Ready</span>
                      ) : (
                        <span className="text-[9px] text-stone-500 font-mono">Optional</span>
                      )}
                    </div>

                    {productForm.backImage ? (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-700 group bg-black">
                        <img src={productForm.backImage} alt="Back View" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                          <label className="p-1.5 bg-brand-gold text-brand-dark rounded text-[10px] font-bold cursor-pointer hover:brightness-110">
                            Change
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleSingleImageUpload(e, 'backImage')} 
                              className="hidden" 
                            />
                          </label>
                          <button 
                            type="button" 
                            onClick={() => setProductForm({ ...productForm, backImage: '' })}
                            className="p-1.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-stone-700 hover:border-stone-500 bg-stone-900/40 hover:bg-stone-900/80 transition flex flex-col items-center justify-center p-2 text-center cursor-pointer group">
                        <Upload className="w-5 h-5 text-stone-400 group-hover:scale-110 transition mb-1" />
                        <span className="text-[11px] font-bold text-stone-300 block">Upload Back View</span>
                        <span className="text-[9px] text-stone-500 font-mono mt-0.5">Interior / reverse angle</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleSingleImageUpload(e, 'backImage')} 
                          className="hidden" 
                        />
                      </label>
                    )}

                    {imageUploadTab === 'url' && (
                      <input 
                        type="url" 
                        value={productForm.backImage} 
                        onChange={(e) => setProductForm({ ...productForm, backImage: e.target.value })}
                        placeholder="Image URL..." 
                        className="w-full bg-[#070C15] border border-stone-700 rounded px-2 py-1 text-[10px] text-stone-100 font-mono"
                      />
                    )}
                  </div>

                  {/* 3. LEFT SIDE VIEW */}
                  <div className="bg-[#0C1322] border border-stone-800 hover:border-stone-700 rounded-xl p-3 flex flex-col justify-between space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-stone-300 uppercase flex items-center gap-1">
                        <Layers className="w-3 h-3 text-stone-400" />
                        3. Left Side View
                      </span>
                      {productForm.leftSideImage ? (
                        <span className="text-[9px] text-emerald-400 font-mono">✓ Ready</span>
                      ) : (
                        <span className="text-[9px] text-stone-500 font-mono">Optional</span>
                      )}
                    </div>

                    {productForm.leftSideImage ? (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-700 group bg-black">
                        <img src={productForm.leftSideImage} alt="Left Side View" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                          <label className="p-1.5 bg-brand-gold text-brand-dark rounded text-[10px] font-bold cursor-pointer hover:brightness-110">
                            Change
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleSingleImageUpload(e, 'leftSideImage')} 
                              className="hidden" 
                            />
                          </label>
                          <button 
                            type="button" 
                            onClick={() => setProductForm({ ...productForm, leftSideImage: '' })}
                            className="p-1.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-stone-700 hover:border-stone-500 bg-stone-900/40 hover:bg-stone-900/80 transition flex flex-col items-center justify-center p-2 text-center cursor-pointer group">
                        <Upload className="w-5 h-5 text-stone-400 group-hover:scale-110 transition mb-1" />
                        <span className="text-[11px] font-bold text-stone-300 block">Upload Left Side</span>
                        <span className="text-[9px] text-stone-500 font-mono mt-0.5">Left profile & thickness</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleSingleImageUpload(e, 'leftSideImage')} 
                          className="hidden" 
                        />
                      </label>
                    )}

                    {imageUploadTab === 'url' && (
                      <input 
                        type="url" 
                        value={productForm.leftSideImage} 
                        onChange={(e) => setProductForm({ ...productForm, leftSideImage: e.target.value })}
                        placeholder="Image URL..." 
                        className="w-full bg-[#070C15] border border-stone-700 rounded px-2 py-1 text-[10px] text-stone-100 font-mono"
                      />
                    )}
                  </div>

                  {/* 4. RIGHT SIDE VIEW */}
                  <div className="bg-[#0C1322] border border-stone-800 hover:border-stone-700 rounded-xl p-3 flex flex-col justify-between space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-stone-300 uppercase flex items-center gap-1">
                        <Layers className="w-3 h-3 text-stone-400" />
                        4. Right Side View
                      </span>
                      {productForm.rightSideImage ? (
                        <span className="text-[9px] text-emerald-400 font-mono">✓ Ready</span>
                      ) : (
                        <span className="text-[9px] text-stone-500 font-mono">Optional</span>
                      )}
                    </div>

                    {productForm.rightSideImage ? (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-700 group bg-black">
                        <img src={productForm.rightSideImage} alt="Right Side View" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                          <label className="p-1.5 bg-brand-gold text-brand-dark rounded text-[10px] font-bold cursor-pointer hover:brightness-110">
                            Change
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleSingleImageUpload(e, 'rightSideImage')} 
                              className="hidden" 
                            />
                          </label>
                          <button 
                            type="button" 
                            onClick={() => setProductForm({ ...productForm, rightSideImage: '' })}
                            className="p-1.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-stone-700 hover:border-stone-500 bg-stone-900/40 hover:bg-stone-900/80 transition flex flex-col items-center justify-center p-2 text-center cursor-pointer group">
                        <Upload className="w-5 h-5 text-stone-400 group-hover:scale-110 transition mb-1" />
                        <span className="text-[11px] font-bold text-stone-300 block">Upload Right Side</span>
                        <span className="text-[9px] text-stone-500 font-mono mt-0.5">Right profile & hinges</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleSingleImageUpload(e, 'rightSideImage')} 
                          className="hidden" 
                        />
                      </label>
                    )}

                    {imageUploadTab === 'url' && (
                      <input 
                        type="url" 
                        value={productForm.rightSideImage} 
                        onChange={(e) => setProductForm({ ...productForm, rightSideImage: e.target.value })}
                        placeholder="Image URL..." 
                        className="w-full bg-[#070C15] border border-stone-700 rounded px-2 py-1 text-[10px] text-stone-100 font-mono"
                      />
                    )}
                  </div>

                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Description & Engineering Specifications</label>
                <textarea 
                  rows={3} 
                  required 
                  value={productForm.description} 
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-light/30">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-stone-300 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider hover:brightness-110 shadow cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CATEGORY ADD / EDIT */}
      {/* ------------------------------------------------------------- */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1322] border border-brand-gold/50 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Category Title</label>
                <input 
                  type="text" 
                  required 
                  value={categoryForm.name} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Modern Home"
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Tagline</label>
                <input 
                  type="text" 
                  value={categoryForm.tagline} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
                  placeholder="Clean lines, laser-cut geometry & architecture"
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Subcategory Items (Comma separated)</label>
                <input 
                  type="text" 
                  value={categoryForm.itemsString} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, itemsString: e.target.value })}
                  placeholder="Front Gates, Doors, Railing, Boundary Wall Grills"
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Hero Image (Photo or URL)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={categoryForm.heroImage} 
                      onChange={(e) => setCategoryForm({ ...categoryForm, heroImage: e.target.value })}
                      placeholder="https://... image URL"
                      className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-mono text-xs"
                    />
                    <label className="px-3 py-2 bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold rounded-lg font-mono text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (loadEvt) => {
                            const dataUrl = loadEvt.target?.result as string;
                            if (dataUrl) setCategoryForm(prev => ({ ...prev, heroImage: dataUrl }));
                          };
                          reader.readAsDataURL(file);
                        }} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {categoryForm.heroImage && (
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-stone-700 bg-black">
                      <img src={categoryForm.heroImage} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setCategoryForm(prev => ({ ...prev, heroImage: '' }))}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Description</label>
                <textarea 
                  rows={2} 
                  value={categoryForm.description} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-light/30">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 bg-white/5 text-stone-300 rounded-lg text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider hover:brightness-110">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PORTFOLIO PROJECT ADD / EDIT (COMPLETE MANAGEMENT) */}
      {/* ------------------------------------------------------------- */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0C1322] border-2 border-brand-gold/60 rounded-2xl w-full max-w-2xl p-6 sm:p-7 space-y-5 shadow-2xl animate-fade-in my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                    {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Supabase Storage & REST API Synchronized
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowProjectModal(false)} 
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3 bg-[#070C15] p-4 rounded-xl border border-brand-light/40">
                <span className="text-[11px] font-heading font-black text-brand-gold uppercase tracking-wider block">
                  1. Project Identification
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Project Title *</label>
                    <input 
                      type="text" 
                      required 
                      value={projectForm.title} 
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="DHA Phase 6 Luxury Villa Gate Elevation"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">URL Slug (SEO)</label>
                    <input 
                      type="text" 
                      value={projectForm.slug} 
                      onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                      placeholder="dha-phase-6-luxury-villa-gate"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Category *</label>
                    <select 
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-bold"
                    >
                      {['Main Gates', 'Steel Doors', 'Grills', 'Railings', 'Staircases', 'Steel Windows', 'Custom Fabrication', 'Commercial', 'Modern Home', 'Classical Home'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Project Type</label>
                    <input 
                      type="text" 
                      value={projectForm.projectType} 
                      onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                      placeholder="Residential Luxury Villa"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Client Type</label>
                    <input 
                      type="text" 
                      value={projectForm.clientType} 
                      onChange={(e) => setProjectForm({ ...projectForm, clientType: e.target.value })}
                      placeholder="Private Residence / Commercial"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Location *</label>
                    <input 
                      type="text" 
                      required
                      value={projectForm.location} 
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      placeholder="Islamabad, Pakistan"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Project Duration</label>
                    <input 
                      type="text" 
                      value={projectForm.duration} 
                      onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                      placeholder="14 Days / 3 Weeks"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Completion Year</label>
                    <input 
                      type="text" 
                      value={projectForm.completedDate} 
                      onChange={(e) => setProjectForm({ ...projectForm, completedDate: e.target.value })}
                      placeholder="2026"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Project Status *</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-bold"
                    >
                      <option value="Completed">Completed (Public)</option>
                      <option value="In Progress">In Progress (Active Project)</option>
                      <option value="Published">Published (Public)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-start gap-2 pt-5">
                    <input 
                      type="checkbox" 
                      id="featProj"
                      checked={projectForm.featured} 
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <label htmlFor="featProj" className="text-xs font-heading font-bold text-amber-400 uppercase cursor-pointer flex items-center gap-1">
                      <span>★ Featured on Homepage</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Short Description (Card Summary)</label>
                  <input 
                    type="text" 
                    value={projectForm.shortDescription} 
                    onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                    placeholder="Brief 1-line teaser for project card..."
                    className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Full Fabrication Description *</label>
                  <textarea 
                    rows={2.5} 
                    required 
                    value={projectForm.description} 
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Full fabrication package including 14ft CNC laser gate, rust-proof hot-dip zinc primer, and Italian automation motor..."
                    className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Materials Used</label>
                    <input 
                      type="text" 
                      value={projectForm.materials} 
                      onChange={(e) => setProjectForm({ ...projectForm, materials: e.target.value })}
                      placeholder="Grade A Mild Steel, CNC Laser Plate, Powder Coat"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Services Provided</label>
                    <input 
                      type="text" 
                      value={projectForm.services} 
                      onChange={(e) => setProjectForm({ ...projectForm, services: e.target.value })}
                      placeholder="CAD Design, CNC Laser Cutting, On-Site Installation"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: MULTI-ANGLE IMAGE GALLERY */}
              <div className="space-y-3 bg-[#070C15] p-4 rounded-xl border border-brand-light/40">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-heading font-black text-brand-gold uppercase tracking-wider block">
                    2. Multi-Angle Project Photography (Front, Detail, Side, Installed)
                  </span>
                  {isUploadingImage && (
                    <span className="text-[10px] text-brand-gold font-mono animate-pulse font-bold">
                      Uploading to Storage...
                    </span>
                  )}
                </div>

                {/* 4 Multi-View Gallery Slots */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: '1. Front View (Main)', index: 0 },
                    { label: '2. Close-up Detail', index: 1 },
                    { label: '3. Side Angle', index: 2 },
                    { label: '4. Installed View', index: 3 }
                  ].map(({ label, index }) => {
                    const currentImg = projectForm.galleryImages[index] || '';
                    return (
                      <div key={index} className="space-y-1.5 bg-[#0C1322] p-2.5 rounded-lg border border-brand-light/40 flex flex-col justify-between">
                        <span className="text-[9.5px] font-mono text-slate-300 font-bold uppercase block truncate">
                          {label}
                        </span>

                        <div className="relative aspect-[4/3] rounded overflow-hidden bg-black border border-stone-700">
                          {currentImg ? (
                            <>
                              <img src={currentImg} alt={label} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setProjectForm(prev => {
                                    const nextG = [...prev.galleryImages];
                                    nextG[index] = '';
                                    return { ...prev, galleryImages: nextG };
                                  });
                                }}
                                className="absolute top-1 right-1 p-0.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-[9px] cursor-pointer"
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-[10px]">
                              <Image className="w-5 h-5 mb-1" />
                              <span>No image</span>
                            </div>
                          )}
                        </div>

                        <label className="w-full py-1 px-2 bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold rounded text-[10px] font-mono font-bold cursor-pointer text-center flex items-center justify-center gap-1 transition">
                          <Upload className="w-3 h-3" />
                          <span>{currentImg ? 'Replace' : 'Upload'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handlePortfolioImageUpload(e, index)}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: ENGINEERING SPECIFICATIONS */}
              <div className="space-y-3 bg-[#070C15] p-4 rounded-xl border border-brand-light/40">
                <span className="text-[11px] font-heading font-black text-brand-gold uppercase tracking-wider block">
                  3. Certified Engineering Specifications & Deliverables
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Steel Material Grade</label>
                    <input 
                      type="text" 
                      value={projectForm.steelGrade} 
                      onChange={(e) => setProjectForm({ ...projectForm, steelGrade: e.target.value })}
                      placeholder="Grade A Structural Mild Carbon Steel"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Standard Gauge</label>
                    <input 
                      type="text" 
                      value={projectForm.gauge} 
                      onChange={(e) => setProjectForm({ ...projectForm, gauge: e.target.value })}
                      placeholder="14-Gauge (2.0mm) & 12-Gauge (2.5mm)"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Surface Coating / Finish</label>
                    <input 
                      type="text" 
                      value={projectForm.finish} 
                      onChange={(e) => setProjectForm({ ...projectForm, finish: e.target.value })}
                      placeholder="Matte Black Electrostatic Powder Coating"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Gate Automation</label>
                    <input 
                      type="text" 
                      value={projectForm.automation} 
                      onChange={(e) => setProjectForm({ ...projectForm, automation: e.target.value })}
                      placeholder="Italian Heavy-Duty 800KG Sliding Motor"
                      className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Executed Deliverables (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={projectForm.deliverablesString} 
                    onChange={(e) => setProjectForm({ ...projectForm, deliverablesString: e.target.value })}
                    placeholder="Main Entrance Gate, Boundary Wall Security Grills, Balcony Safety Railings"
                    className="w-full bg-[#0C1322] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-brand-light/40">
                <button 
                  type="button" 
                  onClick={() => setShowProjectModal(false)} 
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer"
                >
                  {editingProject ? 'Save Changes' : 'Publish Portfolio Project'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: SERVICE ADD / EDIT */}
      {/* ------------------------------------------------------------- */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1322] border border-brand-gold/50 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                {editingService ? 'Edit Fabrication Service' : 'Add Fabrication Service'}
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Service Title</label>
                <input 
                  type="text" 
                  required 
                  value={serviceForm.title} 
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. Custom Steel Gates & Automated Entrances"
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Icon Style</label>
                  <select 
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                  >
                    <option value="DoorClosed">DoorClosed (Gate / Door)</option>
                    <option value="Hammer">Hammer (Artisan Forge)</option>
                    <option value="Layers">Layers (Stairs / Floating)</option>
                    <option value="Shield">Shield (Stainless Balustrades)</option>
                    <option value="Maximize2">Maximize2 (Aluminum & Glass)</option>
                    <option value="Factory">Factory (Structural Trusses)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Cover Image URL</label>
                  <input 
                    type="url" 
                    required 
                    value={serviceForm.image} 
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Service Overview</label>
                <textarea 
                  rows={2.5} 
                  required 
                  value={serviceForm.description} 
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Detailed explanation of this fabrication expertise..."
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Key Highlights / Features (Comma separated)</label>
                <input 
                  type="text" 
                  value={serviceForm.featuresString} 
                  onChange={(e) => setServiceForm({ ...serviceForm, featuresString: e.target.value })}
                  placeholder="CNC Laser Cut, Automation Motor Ready, Anti-Corrosion Primer, 10-Year Warranty"
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-light/30">
                <button type="button" onClick={() => setShowServiceModal(false)} className="px-4 py-2 bg-white/5 text-stone-300 rounded-lg text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider hover:brightness-110">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TESTIMONIAL ADD */}
      {/* ------------------------------------------------------------- */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1322] border border-brand-gold/50 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                Add Verified Client Review
              </h3>
              <button onClick={() => setShowTestimonialModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Customer Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={testimonialForm.name} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  placeholder="e.g. Brig. Tariq Mehmood"
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">City / Location</label>
                  <input 
                    type="text" 
                    value={testimonialForm.location} 
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                    placeholder="DHA Islamabad"
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Rating (Stars)</label>
                  <select 
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold font-bold text-brand-gold"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Testimonial Text</label>
                <textarea 
                  rows={3} 
                  required 
                  value={testimonialForm.text} 
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  placeholder="Write the client's verified review..."
                  className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-light/30">
                <button type="button" onClick={() => setShowTestimonialModal(false)} className="px-4 py-2 bg-white/5 text-stone-300 rounded-lg text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider hover:brightness-110">
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW QUOTE FULL DETAIL */}
      {/* ------------------------------------------------------------- */}
      {viewingQuote && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1322] border border-brand-gold/50 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                Quote Request #{viewingQuote.id.slice(-6)}
              </h3>
              <button onClick={() => setViewingQuote(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="bg-[#070C15] p-3.5 rounded-lg border border-stone-800 space-y-1.5">
                <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider block">Customer Details</span>
                <p className="font-bold text-stone-100 text-sm">{viewingQuote.customer?.firstName} {viewingQuote.customer?.lastName}</p>
                <p className="text-slate-400 font-mono">📞 Phone: {viewingQuote.customer?.phone}</p>
                <p className="text-slate-400 font-mono">✉️ Email: {viewingQuote.customer?.email}</p>
                <p className="text-slate-400">📍 Address: {viewingQuote.customer?.address || `${viewingQuote.customer?.city || 'Pakistan'}`}</p>
              </div>

              <div className="bg-[#070C15] p-3.5 rounded-lg border border-stone-800 space-y-1.5">
                <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider block">Fabrication Specifications</span>
                <p className="font-bold text-stone-100">{viewingQuote.doorStyle || viewingQuote.projectType || viewingQuote.productCategory}</p>
                <p className="text-slate-300 font-mono">Dimensions: {viewingQuote.dimensions.width}' Width × {viewingQuote.dimensions.height}' Height</p>
                <p className="text-slate-300 font-mono">Quantity: {viewingQuote.dimensions.qty} Unit(s)</p>
                <p className="text-slate-300 font-mono">Quoted Amount: <span className="text-brand-gold font-bold">Rs. {(viewingQuote.estimatedPrice || 0).toLocaleString()}</span></p>
                <p className="text-slate-400 italic mt-1.5">Client Notes: "{viewingQuote.notes || 'No extra remarks'}"</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-brand-light/30">
              <button 
                onClick={() => setViewingQuote(null)}
                className="px-5 py-2 bg-brand-gold text-brand-dark font-heading font-black text-xs uppercase tracking-wider rounded-lg"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW ORDER FULL DETAIL */}
      {/* ------------------------------------------------------------- */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1322] border border-brand-gold/50 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                Fabrication Order #{viewingOrder.id.slice(-6)}
              </h3>
              <button onClick={() => setViewingOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="bg-[#070C15] p-3.5 rounded-lg border border-stone-800 space-y-1.5">
                <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider block">Client Details</span>
                <p className="font-bold text-stone-100 text-sm">{viewingOrder.customerName}</p>
                <p className="text-slate-400 font-mono">📞 Phone: {viewingOrder.customerPhone || viewingOrder.customer?.phone || 'N/A'}</p>
                <p className="text-slate-400 font-mono">✉️ Email: {viewingOrder.customerEmail}</p>
                <p className="text-slate-400">📍 Site Delivery: {viewingOrder.shippingAddress?.street}, {viewingOrder.shippingAddress?.city}</p>
              </div>

              <div className="bg-[#070C15] p-3.5 rounded-lg border border-stone-800 space-y-2">
                <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider block">Ordered Items</span>
                {viewingOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-stone-800 last:border-0">
                    <div>
                      <p className="font-bold text-stone-100">{item.productName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity} &bull; {item.width}ft × {item.height}ft</p>
                    </div>
                    <span className="font-mono font-bold text-brand-gold">Rs. {(item.totalPrice || 0).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-mono font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="text-brand-gold">Rs. {(viewingOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-brand-light/30">
              <button 
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2 bg-brand-gold text-brand-dark font-heading font-black text-xs uppercase tracking-wider rounded-lg"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW CUSTOMER HISTORY */}
      {/* ------------------------------------------------------------- */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C1322] border border-brand-gold/50 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <div>
                <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                  {viewingCustomer.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">{viewingCustomer.email} &bull; {viewingCustomer.phone}</p>
              </div>
              <button onClick={() => setViewingCustomer(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#070C15] p-3 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Orders</span>
                  <span className="text-lg font-heading font-black text-stone-100">{viewingCustomer.ordersCount}</span>
                </div>
                <div className="bg-[#070C15] p-3 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Quotes</span>
                  <span className="text-lg font-heading font-black text-brand-gold">{viewingCustomer.quotesCount}</span>
                </div>
                <div className="bg-[#070C15] p-3 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Spent</span>
                  <span className="text-sm font-heading font-black text-brand-gold">Rs. {viewingCustomer.totalSpent.toLocaleString()}</span>
                </div>
              </div>

              {/* Order History */}
              <div className="bg-[#070C15] p-4 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-gold block">
                  Fabrication Order History
                </span>
                {viewingCustomer.orderHistory?.length > 0 ? (
                  viewingCustomer.orderHistory.map((o: Order) => (
                    <div key={o.id} className="py-2 border-b border-stone-800 last:border-0 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-stone-100">Order #{o.id.slice(-6)}</p>
                        <p className="text-[10px] text-slate-400">{o.items?.map(i => i.productName).join(', ')}</p>
                      </div>
                      <span className="font-mono font-bold text-brand-gold">Rs. {(o.total || 0).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-[11px] italic">No completed orders yet.</p>
                )}
              </div>

              {/* Quote History */}
              <div className="bg-[#070C15] p-4 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-gold block">
                  Quote Requests Submitted
                </span>
                {viewingCustomer.quoteHistory?.length > 0 ? (
                  viewingCustomer.quoteHistory.map((q: Quote) => (
                    <div key={q.id} className="py-2 border-b border-stone-800 last:border-0 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-stone-100">{q.doorStyle || q.projectType || 'Custom Gate'}</p>
                        <p className="text-[10px] text-slate-400">{q.dimensions.width}' × {q.dimensions.height}' (Qty: {q.dimensions.qty})</p>
                      </div>
                      <span className="font-mono font-bold text-brand-gold">Rs. {(q.estimatedPrice || 0).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-[11px] italic">No quote requests recorded.</p>
                )}
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-brand-light/30">
              <button 
                onClick={() => setViewingCustomer(null)}
                className="px-5 py-2 bg-brand-gold text-brand-dark font-heading font-black text-xs uppercase tracking-wider rounded-lg"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
