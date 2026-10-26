import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, Sparkles, MessageCircle, Calculator, 
  Ruler, Eye, CheckCircle2, MapPin, ShieldCheck, 
  Layers, ArrowLeft, ChevronRight, Check, AlertCircle,
  Maximize2, X, Phone, User, Info, FileText, ChevronLeft,
  ShoppingBag
} from 'lucide-react';
import { useSEO } from '../utils/useSEO';
import { handleImageError, FALLBACK_IMAGE_URL } from '../utils/imageFallback';
import { useCart } from '../context/CartContext';
import type { ProjectDesignItem, ProjectSubcategoryItem, WhatIsYourProjectItem } from '../types';

export const WhatIsYourProjectPage: React.FC = () => {
  const { category: routeCat, subcategory: routeSub, designId: routeDes } = useParams<{ 
    category?: string; 
    subcategory?: string; 
    designId?: string;
  }>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { whatIsYourProject, products, settings, getWhatsAppUrl } = useData();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { addToCart, setCartOpen } = useCart();
  const [addedDesignId, setAddedDesignId] = useState<string | null>(null);
  const [calculatorAdded, setCalculatorAdded] = useState<boolean>(false);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [routeCat, routeSub, routeDes]);

  // Normalize string helper
  const normalize = (str?: string) => (str || '').toLowerCase().replace(/[-_]/g, ' ').trim();

  // 1. Resolve Active Main Category
  const activeCategory: WhatIsYourProjectItem | null = useMemo(() => {
    const target = routeCat || searchParams.get('category');
    if (!target) return null;
    const targetNorm = normalize(target);

    return whatIsYourProject.find(cat => {
      const cNorm = normalize(cat.category);
      const idNorm = normalize(cat.id);
      const slugNorm = normalize(cat.category.replace(/[\s&]+/g, '-'));
      return cNorm === targetNorm || idNorm === targetNorm || slugNorm === targetNorm;
    }) || null;
  }, [whatIsYourProject, routeCat, searchParams]);

  // 2. Resolve Active Subcategories for the Category
  const categorySubcategories: ProjectSubcategoryItem[] = useMemo(() => {
    if (!activeCategory) return [];
    if (activeCategory.subcategories && activeCategory.subcategories.length > 0) {
      return activeCategory.subcategories.filter(s => s.active !== false);
    }
    // Fallback if subcategories not populated: synthesize from designs
    if (activeCategory.designs && activeCategory.designs.length > 0) {
      const grouped = new Map<string, ProjectDesignItem[]>();
      activeCategory.designs.forEach(d => {
        const key = d.subcategory || d.itemType || 'General Designs';
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(d);
      });
      return Array.from(grouped.entries()).map(([title, designs], idx) => ({
        id: `synth-sub-${idx}`,
        title,
        slug: title.toLowerCase().replace(/[\s&]+/g, '-'),
        description: `Explore custom fabricated ${title.toLowerCase()} designs for ${activeCategory.category}.`,
        image: designs[0]?.image || activeCategory.image,
        displayOrder: idx + 1,
        active: true,
        designs
      }));
    }
    return [];
  }, [activeCategory]);

  // 3. Resolve Active Subcategory
  const activeSubcategory: ProjectSubcategoryItem | null = useMemo(() => {
    const target = routeSub || searchParams.get('subcategory');
    if (!target || !categorySubcategories.length) return null;
    const targetNorm = normalize(target);

    return categorySubcategories.find(sub => {
      const sNorm = normalize(sub.title);
      const slugNorm = normalize(sub.slug || sub.title.replace(/[\s&]+/g, '-'));
      const idNorm = normalize(sub.id);
      return sNorm === targetNorm || slugNorm === targetNorm || idNorm === targetNorm;
    }) || null;
  }, [categorySubcategories, routeSub, searchParams]);

  // 4. Resolve Active Designs in the Subcategory
  const subcategoryDesigns: ProjectDesignItem[] = useMemo(() => {
    if (!activeSubcategory) return [];
    if (activeSubcategory.designs && activeSubcategory.designs.length > 0) {
      return activeSubcategory.designs.filter(d => d.active !== false);
    }
    // Fallback: look in activeCategory designs
    if (activeCategory?.designs) {
      return activeCategory.designs.filter(d => 
        (d.subcategoryId && d.subcategoryId === activeSubcategory.id) ||
        (d.subcategory && normalize(d.subcategory) === normalize(activeSubcategory.title)) ||
        (d.itemType && normalize(d.itemType) === normalize(activeSubcategory.title))
      );
    }
    return [];
  }, [activeSubcategory, activeCategory]);

  // 5. Resolve Active Design for Step 4
  const activeDesign: ProjectDesignItem | null = useMemo(() => {
    const target = routeDes || searchParams.get('design') || searchParams.get('designId');
    if (!target) return null;
    const targetNorm = normalize(target);

    // Search in current subcategory designs first
    const inSub = subcategoryDesigns.find(d => 
      normalize(d.id) === targetNorm || 
      normalize(d.productCode) === targetNorm ||
      normalize(d.title) === targetNorm ||
      normalize(d.title.replace(/[\s&]+/g, '-')) === targetNorm
    );
    if (inSub) return inSub;

    // Search across all designs in category
    if (activeCategory?.designs) {
      const inCat = activeCategory.designs.find(d => 
        normalize(d.id) === targetNorm || 
        normalize(d.productCode) === targetNorm ||
        normalize(d.title) === targetNorm ||
        normalize(d.title.replace(/[\s&]+/g, '-')) === targetNorm
      );
      if (inCat) return inCat;
    }

    return null;
  }, [subcategoryDesigns, activeCategory, routeDes, searchParams]);

  // SEO configuration
  useSEO({
    title: activeDesign 
      ? `${activeDesign.title} (${activeDesign.productCode || 'Custom'}) | What Is Your Project`
      : activeSubcategory
        ? `${activeSubcategory.title} Designs — ${activeCategory?.category} | Mughal Steel Fabrication`
        : activeCategory
          ? `${activeCategory.category} Subcategories & Designs | What Is Your Project`
          : 'What Is Your Project? | Mughal Steel Architectural Fabrication',
    description: activeDesign?.description || activeSubcategory?.description || activeCategory?.description || 'Explore custom architectural steel designs, calculate estimated prices, and order directly on WhatsApp.',
    image: activeDesign?.image || activeSubcategory?.image || activeCategory?.image || FALLBACK_IMAGE_URL,
    url: window.location.pathname
  });

  // =========================================================================
  // STEP 4: INTERACTIVE SIZING & PRICING CALCULATOR STATE
  // =========================================================================
  const [width, setWidth] = useState<number>(14);
  const [height, setHeight] = useState<number>(7.5);
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Customization Checkboxes
  const [customSize, setCustomSize] = useState<boolean>(false);
  const [customDesign, setCustomDesign] = useState<boolean>(false);
  const [colorChange, setColorChange] = useState<boolean>(false);
  const [automation, setAutomation] = useState<boolean>(false);
  const [antiClimbSpikes, setAntiClimbSpikes] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // Customer Contact for Inquiry
  const [customerName, setCustomerName] = useState<string>(
    user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  );
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '');
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Image Gallery for Active Design
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Reset calculator when design changes
  useEffect(() => {
    if (activeDesign) {
      setActiveGalleryIndex(0);
      setValidationError(null);
      setCustomerError(null);
    }
  }, [activeDesign]);

  // Associated Product helper if design links to one
  const matchedProduct = useMemo(() => {
    if (!activeDesign) return null;
    if (activeDesign.associatedProductCode) {
      return products.find(p => p.productCode.toLowerCase() === activeDesign.associatedProductCode?.toLowerCase()) || null;
    }
    if (activeDesign.associatedProductId) {
      return products.find(p => p.id === activeDesign.associatedProductId || p.slug === activeDesign.associatedProductId) || null;
    }
    return null;
  }, [activeDesign, products]);

  // Rate determination (from design or matched product)
  const ratePerSqFt = activeDesign?.pricePerSqFt || matchedProduct?.pricePerSqFt || 2500;

  // Real-time calculations
  const unitArea = useMemo(() => {
    const w = Number(width);
    const h = Number(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return 0;
    return Math.round(w * h * 100) / 100;
  }, [width, height]);

  const totalArea = useMemo(() => {
    const q = Math.max(1, Number(quantity) || 1);
    return Math.round(unitArea * q * 100) / 100;
  }, [unitArea, quantity]);

  const estimatedTotal = useMemo(() => {
    if (totalArea <= 0 || ratePerSqFt <= 0) return 0;
    let base = totalArea * ratePerSqFt;
    if (automation) base += 45000;
    if (antiClimbSpikes) base += totalArea * 250;
    return Math.round(base);
  }, [totalArea, ratePerSqFt, automation, antiClimbSpikes]);

  // Gallery images array
  const galleryImages = useMemo(() => {
    if (!activeDesign) return [];
    const list: string[] = [];
    if (activeDesign.image) list.push(activeDesign.image);
    if (activeDesign.images && activeDesign.images.length > 0) {
      activeDesign.images.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (matchedProduct?.images) {
      matchedProduct.images.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : [FALLBACK_IMAGE_URL];
  }, [activeDesign, matchedProduct]);

  // Quick Add to Cart for Design Cards
  const handleQuickAddToCart = (e: React.MouseEvent, design: ProjectDesignItem) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultWidth = 10;
    const defaultHeight = 5;
    const defaultArea = 50;
    const rate = design.pricePerSqFt || 2500;
    const code = design.productCode || design.associatedProductCode || 'MSF-001';

    addToCart({
      id: `project-${design.id}-${Date.now()}`,
      productId: design.id,
      productCode: code,
      productName: design.title,
      productImage: design.image || FALLBACK_IMAGE_URL,
      category: activeCategory?.category || 'Project Fabrication',
      item: activeSubcategory?.title || design.subcategory || 'Fabrication',
      width: defaultWidth,
      height: defaultHeight,
      area: defaultArea,
      pricePerSqFt: rate,
      material: 'Mild Steel',
      finish: design.finishSpec || 'Matte Powder Coating',
      gauge: design.gaugeSpec || '14-Gauge'
    }, 1);

    setAddedDesignId(design.id);
    setCartOpen(true);
    setTimeout(() => setAddedDesignId(null), 2000);
  };

  // Add Configured Design to Cart from Interactive Calculator
  const handleAddConfiguredToCart = () => {
    if (!width || isNaN(width) || width <= 0) {
      setValidationError('Please enter a valid width in feet (greater than 0).');
      return;
    }
    if (!height || isNaN(height) || height <= 0) {
      setValidationError('Please enter a valid height in feet (greater than 0).');
      return;
    }
    setValidationError(null);

    const designCode = activeDesign?.productCode || activeDesign?.associatedProductCode || 'MSF-CUSTOM';
    const selectedCustomizations: string[] = [];
    if (customSize) selectedCustomizations.push('Custom Driveway Size');
    if (customDesign) selectedCustomizations.push('Custom CNC Motif');
    if (colorChange) selectedCustomizations.push('Custom Powder Coat Color');
    if (automation) selectedCustomizations.push('Motor Automation (+45K)');
    if (antiClimbSpikes) selectedCustomizations.push('Anti-Climb Spikes');

    const notesSummary = [
      selectedCustomizations.length > 0 ? `Customizations: ${selectedCustomizations.join(', ')}` : '',
      notes.trim() ? `Note: ${notes.trim()}` : ''
    ].filter(Boolean).join(' | ');

    if (!activeDesign) return;

    addToCart({
      id: `project-calc-${activeDesign.id}-${Date.now()}`,
      productId: activeDesign.id,
      productCode: designCode,
      productName: activeDesign.title,
      productImage: galleryImages[activeGalleryIndex] || activeDesign.image || FALLBACK_IMAGE_URL,
      category: activeCategory?.category || 'Project Fabrication',
      item: activeSubcategory?.title || 'Custom Fabrication',
      width: Number(width),
      height: Number(height),
      area: unitArea,
      pricePerSqFt: ratePerSqFt,
      material: 'Mild Steel',
      finish: activeDesign.finishSpec || 'Matte Powder Coating',
      gauge: activeDesign.gaugeSpec || '14-Gauge',
      customNotes: notesSummary
    }, quantity || 1);

    setCalculatorAdded(true);
    setCartOpen(true);
    setTimeout(() => setCalculatorAdded(false), 2000);
  };

  // =========================================================================
  // STEP 6: DIRECT WHATSAPP ORDERING HANDLER
  // =========================================================================
  const handleOrderOnWhatsApp = () => {
    // 1. Validate dimensions
    if (!width || isNaN(width) || width <= 0) {
      setValidationError('Please enter a valid width in feet (greater than 0).');
      return;
    }
    if (!height || isNaN(height) || height <= 0) {
      setValidationError('Please enter a valid height in feet (greater than 0).');
      return;
    }
    if (!quantity || isNaN(quantity) || quantity < 1) {
      setValidationError('Please specify a valid quantity of at least 1.');
      return;
    }
    setValidationError(null);

    // 2. Validate customer contact info
    if (!customerName.trim()) {
      setCustomerError('Please enter your full name so our fabrication engineer can address you.');
      const elem = document.getElementById('customer-contact-box');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setCustomerError('Please provide a valid 11-digit phone or WhatsApp number.');
      const elem = document.getElementById('customer-contact-box');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setCustomerError(null);

    // 3. Assemble customization notes
    const selectedCustomizations: string[] = [];
    if (customSize) selectedCustomizations.push('Custom Driveway Opening Size');
    if (customDesign) selectedCustomizations.push('Custom Laser Motif Modification');
    if (colorChange) selectedCustomizations.push('Custom Powder Coat Color Specification');
    if (automation) selectedCustomizations.push('Italian/German Motor Automation System (+Rs. 45,000)');
    if (antiClimbSpikes) selectedCustomizations.push('Heavy Anti-Climb Wall Teeth & Security Spikes');

    // 4. Construct WhatsApp Message
    const designCode = activeDesign?.productCode || activeDesign?.associatedProductCode || 'MSF-CUSTOM';
    const subcatName = activeSubcategory?.title || activeDesign?.subcategory || 'Fabrication Item';
    const catName = activeCategory?.category || 'Custom Project';

    const lines: string[] = [
      '*MUGHAL STEEL FABRICATION — NEW PROJECT INQUIRY*',
      '',
      '*Customer Details:*',
      `• Name: ${customerName.trim()}`,
      `• Phone/WhatsApp: ${customerPhone.trim()}`,
      '',
      '*Selected Project Details:*',
      `• Main Category: ${catName}`,
      `• Subcategory: ${subcatName}`,
      `• Design Name: ${activeDesign?.title}`,
      `• Design/Product Code: ${designCode}`,
      '',
      '*Measurement & Price Calculation:*',
      `• Dimensions: ${width} ft Width × ${height} ft Height`,
      `• Single Unit Area: ${unitArea} sq.ft`,
      `• Total Area (${quantity} unit${quantity > 1 ? 's' : ''}): ${totalArea} sq.ft`,
      `• Configured Rate: Rs. ${ratePerSqFt.toLocaleString()} / sq.ft`,
      `• Estimated Total Amount: Rs. ${estimatedTotal.toLocaleString()}`,
      '  _(Base fabrication estimate subject to on-site laser survey confirmation)_'
    ];

    if (selectedCustomizations.length > 0) {
      lines.push('');
      lines.push('*Selected Customizations:*');
      selectedCustomizations.forEach(c => lines.push(`• ${c}`));
    }

    if (notes.trim()) {
      lines.push('');
      lines.push('*Customer Site Notes:*');
      lines.push(`• ${notes.trim()}`);
    }

    if (activeDesign?.image && !activeDesign.image.startsWith('data:')) {
      lines.push('');
      lines.push(`• Design Photo Reference: ${activeDesign.image}`);
    }

    lines.push('');
    lines.push('Hello Mughal Steel team, I want to proceed with this project design. Please review my dimensions and schedule a site measurement survey.');

    const message = lines.join('\n');
    const waUrl = getWhatsAppUrl(message);

    // Open WhatsApp directly without any cart interaction
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // =========================================================================
  // VIEW RENDERERS
  // =========================================================================

  // Helper for Category Card Navigation
  const handleSelectCategory = (cat: WhatIsYourProjectItem) => {
    const slug = cat.category.toLowerCase().replace(/[\s&]+/g, '-');
    navigate(`/what-is-your-project/${slug}`);
  };

  // Helper for Subcategory Card Navigation
  const handleSelectSubcategory = (sub: ProjectSubcategoryItem) => {
    if (!activeCategory) return;
    const catSlug = activeCategory.category.toLowerCase().replace(/[\s&]+/g, '-');
    const subSlug = (sub.slug || sub.title).toLowerCase().replace(/[\s&]+/g, '-');
    navigate(`/what-is-your-project/${catSlug}/${subSlug}`);
  };

  // Helper for Design Card Navigation
  const handleSelectDesign = (des: ProjectDesignItem) => {
    if (!activeCategory || !activeSubcategory) return;
    const catSlug = activeCategory.category.toLowerCase().replace(/[\s&]+/g, '-');
    const subSlug = (activeSubcategory.slug || activeSubcategory.title).toLowerCase().replace(/[\s&]+/g, '-');
    const desSlug = (des.productCode || des.title).toLowerCase().replace(/[\s&]+/g, '-');
    navigate(`/what-is-your-project/${catSlug}/${subSlug}/${desSlug}`);
  };

  return (
    <div className="bg-[#05080E] min-h-screen text-stone-100 font-sans pb-24 selection:bg-brand-gold selection:text-brand-dark">

      {/* ===================================================================== */}
      {/* 1. TOP BREADCRUMB & CONTEXT BAR */}
      {/* ===================================================================== */}
      <div className="bg-[#080E1A] border-b border-brand-light/30 py-3 sticky top-0 z-30 backdrop-blur-md bg-opacity-95 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-mono">
          
          {/* Breadcrumbs Trail */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-slate-400">
            <Link to="/" className="hover:text-brand-gold transition shrink-0">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            
            <Link 
              to="/what-is-your-project" 
              className={`hover:text-brand-gold transition shrink-0 ${!activeCategory ? 'text-brand-gold font-bold' : ''}`}
            >
              What Is Your Project?
            </Link>

            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                <Link 
                  to={`/what-is-your-project/${activeCategory.category.toLowerCase().replace(/[\s&]+/g, '-')}`}
                  className={`hover:text-brand-gold transition shrink-0 ${!activeSubcategory ? 'text-brand-gold font-bold' : ''}`}
                >
                  {activeCategory.category}
                </Link>
              </>
            )}

            {activeSubcategory && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                <Link 
                  to={`/what-is-your-project/${activeCategory?.category.toLowerCase().replace(/[\s&]+/g, '-')}/${(activeSubcategory.slug || activeSubcategory.title).toLowerCase().replace(/[\s&]+/g, '-')}`}
                  className={`hover:text-brand-gold transition shrink-0 ${!activeDesign ? 'text-brand-gold font-bold' : ''}`}
                >
                  {activeSubcategory.title}
                </Link>
              </>
            )}

            {activeDesign && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                <span className="text-brand-gold font-bold truncate max-w-[180px] sm:max-w-[260px] shrink-0">
                  {activeDesign.title}
                </span>
              </>
            )}
          </div>

          {/* Quick Back Action */}
          <div className="shrink-0 ml-3">
            {activeDesign ? (
              <button 
                onClick={() => {
                  if (activeCategory && activeSubcategory) {
                    const catSlug = activeCategory.category.toLowerCase().replace(/[\s&]+/g, '-');
                    const subSlug = (activeSubcategory.slug || activeSubcategory.title).toLowerCase().replace(/[\s&]+/g, '-');
                    navigate(`/what-is-your-project/${catSlug}/${subSlug}`);
                  } else {
                    navigate(-1);
                  }
                }}
                className="text-slate-300 hover:text-brand-gold flex items-center gap-1 transition font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Designs</span>
                <span className="sm:hidden">Back</span>
              </button>
            ) : activeSubcategory ? (
              <button 
                onClick={() => {
                  if (activeCategory) {
                    const catSlug = activeCategory.category.toLowerCase().replace(/[\s&]+/g, '-');
                    navigate(`/what-is-your-project/${catSlug}`);
                  } else {
                    navigate('/what-is-your-project');
                  }
                }}
                className="text-slate-300 hover:text-brand-gold flex items-center gap-1 transition font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Subcategories</span>
                <span className="sm:hidden">Back</span>
              </button>
            ) : activeCategory ? (
              <Link 
                to="/what-is-your-project" 
                className="text-slate-300 hover:text-brand-gold flex items-center gap-1 transition font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Categories</span>
              </Link>
            ) : (
              <Link 
                to="/" 
                className="text-slate-300 hover:text-brand-gold flex items-center gap-1 transition font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW LEVEL 1: NO CATEGORY SELECTED -> DISPLAY ALL PROJECT CATEGORIES */}
      {/* ===================================================================== */}
      {!activeCategory && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
          
          {/* Header Hero */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>Step 1: Select Your Project Type</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase text-stone-100 tracking-wide">
              What Is Your Project?
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Choose your project category below to discover specialized subcategories, browse real certified steel designs, calculate instant square foot pricing, and order directly on WhatsApp.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {whatIsYourProject.map((cat) => {
              const subCount = cat.subcategories?.length || 0;
              const desCount = cat.designs?.length || 0;
              return (
                <div
                  key={cat.id || cat.category}
                  onClick={() => handleSelectCategory(cat)}
                  className="group bg-[#0A111F] border border-brand-light/50 hover:border-brand-gold rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-brand-gold/10 hover:-translate-y-1"
                >
                  {/* Category Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <img
                      src={cat.image || FALLBACK_IMAGE_URL}
                      alt={cat.category}
                      loading="lazy"
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A111F] via-[#0A111F]/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono font-bold bg-brand-gold text-brand-dark px-2.5 py-0.5 rounded shadow uppercase">
                        {cat.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono font-bold bg-black/80 text-brand-gold border border-brand-gold/40 px-2 py-0.5 rounded shadow">
                        {subCount > 0 ? `${subCount} Subcategories` : `${desCount} Designs`}
                      </span>
                    </div>

                    {cat.location && (
                      <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[10px] font-mono text-slate-300">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        <span>{cat.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-heading font-black text-base text-stone-100 group-hover:text-brand-gold transition-colors uppercase">
                        {cat.title || cat.category}
                      </h3>
                      
                      <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                        {cat.tagline || cat.description}
                      </p>

                      {/* Specs */}
                      {(cat.gaugeSpec || cat.finishSpec) && (
                        <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                          {cat.gaugeSpec && (
                            <span className="bg-black/60 border border-brand-light/40 px-2 py-0.5 rounded">
                              Gauge: <strong className="text-brand-gold">{cat.gaugeSpec.split(' ')[0]}</strong>
                            </span>
                          )}
                          {cat.finishSpec && (
                            <span className="bg-black/60 border border-brand-light/40 px-2 py-0.5 rounded">
                              Finish: <strong className="text-brand-gold">{cat.finishSpec.split(' ')[0]}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-brand-light/40 flex items-center justify-between text-xs font-bold text-brand-gold">
                      <span>Explore Subcategories</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW LEVEL 2: CATEGORY SELECTED, NO SUBCATEGORY -> SUBCATEGORIES GRID */}
      {/* ===================================================================== */}
      {activeCategory && !activeSubcategory && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-fade-in">

          {/* Category Banner Hero */}
          <div className="bg-gradient-to-r from-[#0C1527] to-[#070D18] border border-brand-gold/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                  <Sparkles className="w-3 h-3 text-brand-gold" />
                  <span>Step 2: Choose Project Subcategory</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase text-stone-100 tracking-wide">
                  {activeCategory.category}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
                  {activeCategory.description || activeCategory.tagline}
                </p>

                {/* Specs Tags */}
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                  {activeCategory.gaugeSpec && (
                    <span className="bg-black/60 border border-brand-gold/30 px-2.5 py-1 rounded text-stone-300">
                      <strong className="text-brand-gold">Gauge:</strong> {activeCategory.gaugeSpec}
                    </span>
                  )}
                  {activeCategory.finishSpec && (
                    <span className="bg-black/60 border border-brand-gold/30 px-2.5 py-1 rounded text-stone-300">
                      <strong className="text-brand-gold">Finish:</strong> {activeCategory.finishSpec}
                    </span>
                  )}
                  {activeCategory.location && (
                    <span className="bg-black/60 border border-brand-gold/30 px-2.5 py-1 rounded text-stone-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      <span>{activeCategory.location}</span>
                    </span>
                  )}
                </div>

                {/* Direct Category Actions */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={getWhatsAppUrl(`*WHAT IS YOUR PROJECT INQUIRY*\nI am inquiring about the ${activeCategory.category} category.\nPlease share catalogue and current square foot rates.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  <Link
                    to={`/quote?category=${encodeURIComponent(activeCategory.category)}`}
                    className="btn-navy text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                  >
                    <Calculator className="w-4 h-4 text-brand-gold" />
                    <span>Request Custom Quote</span>
                  </Link>
                </div>
              </div>

              {/* Right Hero Image */}
              <div className="lg:col-span-4">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden border border-brand-gold/40 shadow-2xl bg-black">
                  <img
                    src={activeCategory.image || FALLBACK_IMAGE_URL}
                    alt={activeCategory.category}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-brand-gold">
                    <span>{categorySubcategories.length} Subcategories</span>
                    <span className="text-emerald-400">Direct WhatsApp Ordering</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Switcher Horizontal Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Switch Project Category:</span>
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {whatIsYourProject.map((cat) => {
                const isActive = cat.id === activeCategory.id || cat.category.toLowerCase() === activeCategory.category.toLowerCase();
                return (
                  <button
                    key={cat.id || cat.category}
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-brand-gold text-brand-dark shadow-md font-black'
                        : 'bg-[#0B1322] hover:bg-[#101B30] text-stone-300 border border-slate-700/60 hover:border-brand-gold/60'
                    }`}
                  >
                    <span>{cat.category}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-black/20 text-brand-dark' : 'bg-black/60 text-brand-gold'}`}>
                      {cat.subcategories?.length || cat.designs?.length || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories Heading */}
          <div className="border-b border-brand-light/40 pb-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-brand-gold uppercase tracking-wider block">
                Subcategories
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-black uppercase text-stone-100">
                Choose a Subcategory under {activeCategory.category}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {categorySubcategories.length} Subcategories Available
            </span>
          </div>

          {/* Subcategories Grid */}
          {categorySubcategories.length === 0 ? (
            <div className="bg-[#0A101D] border border-brand-light/60 rounded-2xl p-12 text-center space-y-4">
              <Layers className="w-12 h-12 mx-auto text-slate-500" />
              <h3 className="font-heading font-bold text-base uppercase text-stone-200">
                No Subcategories Uploaded Yet for {activeCategory.category}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Our workshop fabricates all custom steel requirements for this project type. Contact our engineering desk directly or request a custom quotation.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={getWhatsAppUrl(`*CUSTOM FABRICATION INQUIRY*\nI need custom steel fabrication under ${activeCategory.category}. Please advise on design options.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <Link to="/quote" className="btn-navy text-xs py-2.5 px-4 font-bold">
                  Request Custom Quote
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorySubcategories.map((sub) => {
                const designCount = sub.designs?.length || 0;
                return (
                  <div
                    key={sub.id || sub.title}
                    onClick={() => handleSelectSubcategory(sub)}
                    className="group bg-[#0A111F] border border-brand-light/50 hover:border-brand-gold rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-brand-gold/10 hover:-translate-y-1"
                  >
                    {/* Subcategory Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                      <img
                        src={sub.image || activeCategory.image || FALLBACK_IMAGE_URL}
                        alt={sub.title}
                        loading="lazy"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A111F] via-[#0A111F]/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-mono font-bold bg-black/85 text-brand-gold border border-brand-gold/40 px-2.5 py-0.5 rounded shadow">
                          {activeCategory.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-mono font-bold bg-brand-gold text-brand-dark px-2 py-0.5 rounded shadow">
                          {designCount} {designCount === 1 ? 'Design' : 'Designs'}
                        </span>
                      </div>
                    </div>

                    {/* Subcategory Body */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="font-heading font-black text-base text-stone-100 group-hover:text-brand-gold transition-colors uppercase">
                          {sub.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                          {sub.description || `Explore certified ${sub.title.toLowerCase()} designs crafted for ${activeCategory.category}.`}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-brand-light/40 flex items-center justify-between text-xs font-bold text-brand-gold">
                        <span>View Design Collection</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW LEVEL 3: SUBCATEGORY SELECTED, NO DESIGN -> DESIGN COLLECTION    */}
      {/* ===================================================================== */}
      {activeCategory && activeSubcategory && !activeDesign && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-fade-in">

          {/* Subcategory Banner */}
          <div className="bg-[#0C1527] border border-brand-gold/30 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                  <span>Step 3: Browse Designs &amp; Calculate</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-stone-100">
                  {activeSubcategory.title}
                </h1>
                <p className="text-xs text-slate-300 font-sans max-w-xl">
                  {activeSubcategory.description || `Browse available ${activeSubcategory.title.toLowerCase()} designs for ${activeCategory.category}. Click any design to calculate dimensions, pricing, and order directly on WhatsApp.`}
                </p>
              </div>

              {/* Subcategory Switcher in Same Category */}
              {categorySubcategories.length > 1 && (
                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Other Subcategories in {activeCategory.category}:
                  </span>
                  <div className="flex sm:justify-end gap-1.5 flex-wrap">
                    {categorySubcategories.map(s => {
                      const isCurrent = s.id === activeSubcategory.id || s.title.toLowerCase() === activeSubcategory.title.toLowerCase();
                      return (
                        <button
                          key={s.id || s.title}
                          onClick={() => handleSelectSubcategory(s)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                            isCurrent
                              ? 'bg-brand-gold text-brand-dark font-black'
                              : 'bg-black/50 text-slate-300 hover:text-white border border-brand-light/50'
                          }`}
                        >
                          {s.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Designs Grid */}
          {subcategoryDesigns.length === 0 ? (
            <div className="bg-[#0A101D] border border-brand-light/60 rounded-2xl p-12 text-center space-y-4">
              <Layers className="w-12 h-12 mx-auto text-slate-500" />
              <h3 className="font-heading font-bold text-base uppercase text-stone-200">
                No Designs Uploaded Yet for {activeSubcategory.title}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You can request custom fabrication for {activeSubcategory.title} or inquire directly with our workshop engineers on WhatsApp.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={getWhatsAppUrl(`*CUSTOM INQUIRY — ${activeSubcategory.title.toUpperCase()}*\nCategory: ${activeCategory.category}\nSubcategory: ${activeSubcategory.title}\n\nHello Mughal Steel, I would like to inquire about designs and rates for this item.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
                <Link to="/quote" className="btn-navy text-xs py-2.5 px-4 font-bold">
                  Request Custom Quote
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategoryDesigns.map((design) => {
                const rate = design.pricePerSqFt || 2500;
                const code = design.productCode || design.associatedProductCode || 'MSF-001';

                return (
                  <div
                    key={design.id}
                    className="group bg-[#0A111F] border border-brand-light/50 hover:border-brand-gold rounded-xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between card-interactive"
                  >
                    {/* Design Image */}
                    <div 
                      onClick={() => handleSelectDesign(design)}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-black cursor-pointer"
                    >
                      <img
                        src={design.image || FALLBACK_IMAGE_URL}
                        alt={design.title}
                        loading="lazy"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold bg-black/85 text-brand-gold border border-brand-gold/40 px-2 py-0.5 rounded shadow">
                          {activeSubcategory.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded shadow">
                          Code: {code}
                        </span>
                      </div>

                      {/* Bottom Rate Badge */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-stone-200">
                        <span className="text-xs font-mono font-black text-brand-gold bg-black/80 px-2 py-0.5 rounded border border-brand-gold/30">
                          {formatPrice(rate)} / sq.ft
                        </span>
                        
                        <Link
                          to={`/try-at-home?designId=${encodeURIComponent(design.id)}&category=${encodeURIComponent(activeCategory.category)}&subcategory=${encodeURIComponent(activeSubcategory.title)}&code=${encodeURIComponent(code)}&from=what-is-your-project`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-bold text-stone-300 hover:text-brand-gold bg-black/80 px-2 py-0.5 rounded border border-white/20 flex items-center gap-1 shadow"
                          title="Preview on your house photo"
                        >
                          <Eye className="w-3 h-3 text-brand-gold" />
                          <span>Try at Home</span>
                        </Link>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 
                          onClick={() => handleSelectDesign(design)}
                          className="font-heading font-black text-sm text-stone-100 group-hover:text-brand-gold transition-colors uppercase leading-snug line-clamp-1 cursor-pointer"
                        >
                          {design.title}
                        </h3>

                        <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                          {design.description || `${activeSubcategory.title} architectural steelwork fabricated by Mughal Steel.`}
                        </p>

                        {/* Specs Box */}
                        {(design.gaugeSpec || design.finishSpec) && (
                          <div className="bg-black/60 border border-brand-light/30 p-2 rounded text-[10px] space-y-0.5 font-mono">
                            {design.gaugeSpec && (
                              <div className="flex items-center justify-between text-stone-300">
                                <span className="text-brand-gold">Gauge:</span>
                                <span className="text-slate-300 truncate max-w-[65%]">{design.gaugeSpec}</span>
                              </div>
                            )}
                            {design.finishSpec && (
                              <div className="flex items-center justify-between text-stone-300">
                                <span className="text-brand-gold">Finish:</span>
                                <span className="text-slate-300 truncate max-w-[65%]">{design.finishSpec}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: Add to Cart & Calculator */}
                      <div className="pt-2 border-t border-brand-light/40 space-y-2">
                        {/* Quick Add to Cart Button */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAddToCart(e, design)}
                          className={`w-full py-2.5 px-3 text-xs font-heading font-black uppercase tracking-wider rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                            addedDesignId === design.id
                              ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-900/30'
                              : 'bg-gradient-to-r from-amber-400 via-brand-gold to-amber-500 hover:from-amber-300 hover:to-amber-400 text-brand-dark border border-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                          }`}
                        >
                          {addedDesignId === design.id ? (
                            <>
                              <Check className="w-4 h-4 text-white animate-bounce" />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectDesign(design)}
                          className="btn-navy text-xs py-2 px-3 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 w-full shadow cursor-pointer border border-brand-gold/30 hover:border-brand-gold hover:text-brand-gold transition"
                        >
                          <Calculator className="w-3.5 h-3.5 text-brand-gold" />
                          <span>Customize &amp; Calculate</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW LEVEL 4: DESIGN DETAILS, DIMENSIONS & PRICE CALCULATOR           */}
      {/* (COMPLETELY ISOLATED ORDERING FLOW — ZERO CART PAGE)                  */}
      {/* ===================================================================== */}
      {activeCategory && activeSubcategory && activeDesign && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-fade-in">

          {/* Main Product Detail Grid: Left Media Gallery + Right Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: MULTI-IMAGE GALLERY & DESIGN SPECS (6 COLS) */}
            <div className="lg:col-span-6 space-y-5">

              {/* Main Image Stage */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-brand-gold/40 shadow-2xl group select-none">
                <img
                  src={galleryImages[activeGalleryIndex] || activeDesign.image || FALLBACK_IMAGE_URL}
                  alt={`${activeDesign.title} - View ${activeGalleryIndex + 1}`}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Product Code Badge */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-brand-gold/50 text-xs font-mono text-brand-gold font-bold flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                  <span>Code: {activeDesign.productCode || activeDesign.associatedProductCode || 'MSF-CUSTOM'}</span>
                </div>

                {/* Subcategory Badge */}
                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/20 text-[10px] font-mono text-slate-200">
                  <span>{activeSubcategory.title}</span>
                </div>

                {/* Lightbox Trigger */}
                <button
                  type="button"
                  onClick={() => setFullscreenImage(galleryImages[activeGalleryIndex] || activeDesign.image)}
                  className="absolute bottom-3 left-3 p-2 rounded-lg bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white border border-stone-700 transition cursor-pointer shadow-lg"
                  title="View full resolution"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Try at Home Floating Button */}
                <Link
                  to={`/try-at-home?designId=${encodeURIComponent(activeDesign.id)}&category=${encodeURIComponent(activeCategory.category)}&subcategory=${encodeURIComponent(activeSubcategory.title)}&code=${encodeURIComponent(activeDesign.productCode || 'MSF')}&from=what-is-your-project`}
                  className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-brand-gold text-brand-dark hover:brightness-110 text-xs font-heading font-black px-3.5 py-2 rounded-lg shadow-xl transition flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Eye className="w-4 h-4" />
                  <span>Try on House Photo →</span>
                </Link>

                {/* Prev / Next Arrows if multiple images */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveGalleryIndex((activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white flex items-center justify-center transition border border-stone-700 cursor-pointer shadow"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGalleryIndex((activeGalleryIndex + 1) % galleryImages.length)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white flex items-center justify-center transition border border-stone-700 cursor-pointer shadow"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative aspect-[4/3] w-20 rounded-lg overflow-hidden border transition cursor-pointer shrink-0 ${
                        activeGalleryIndex === idx
                          ? 'border-brand-gold ring-2 ring-brand-gold/50'
                          : 'border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" onError={handleImageError} />
                    </button>
                  ))}
                </div>
              )}

              {/* Detailed Technical Specifications Panel */}
              <div className="bg-[#0A101C] border border-brand-light/50 rounded-xl p-5 space-y-4 shadow-lg">
                <h4 className="font-heading font-black text-xs uppercase tracking-wider text-brand-gold flex items-center gap-2 border-b border-brand-light/40 pb-2">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span>Technical Engineering Specifications</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-black/50 p-2.5 rounded border border-brand-light/30">
                    <span className="text-slate-400 block text-[10px] uppercase">Steel Gauge / Profile</span>
                    <strong className="text-stone-100 text-xs mt-0.5 block">
                      {activeDesign.gaugeSpec || activeCategory.gaugeSpec || '14-Gauge Cold-Rolled MS'}
                    </strong>
                  </div>

                  <div className="bg-black/50 p-2.5 rounded border border-brand-light/30">
                    <span className="text-slate-400 block text-[10px] uppercase">Protective Finishing</span>
                    <strong className="text-stone-100 text-xs mt-0.5 block">
                      {activeDesign.finishSpec || activeCategory.finishSpec || 'Electrostatic Powder Coat (200°C)'}
                    </strong>
                  </div>

                  <div className="bg-black/50 p-2.5 rounded border border-brand-light/30">
                    <span className="text-slate-400 block text-[10px] uppercase">Fabrication Standard</span>
                    <strong className="text-stone-100 text-xs mt-0.5 block">
                      ±0.1mm CNC Fiber Laser &amp; CO2 MIG Welded
                    </strong>
                  </div>

                  <div className="bg-black/50 p-2.5 rounded border border-brand-light/30">
                    <span className="text-slate-400 block text-[10px] uppercase">Execution &amp; Warranty</span>
                    <strong className="text-stone-100 text-xs mt-0.5 block">
                      Mughal Steel 5-Year Structural Guarantee
                    </strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 font-sans">
                  <p>• Free on-site laser survey and measurement verification across Islamabad and Rawalpindi.</p>
                  <p>• 3D CAD fabrication drawing shared with client prior to workshop cutting.</p>
                  <p>• Delivery, hoisting, and on-site anchor erection included with direct fabrication orders.</p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: DESIGN INFO & SIZING / PRICING CALCULATOR (6 COLS) */}
            <div className="lg:col-span-6 space-y-5">

              {/* Title & Badge Strip */}
              <div className="space-y-2 border-b border-brand-light/40 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-brand-gold/15 text-brand-gold border border-brand-gold/40 px-2.5 py-0.5 rounded uppercase">
                    {activeCategory.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">/</span>
                  <span className="text-[10px] font-mono font-bold bg-white/5 text-slate-200 border border-brand-light/50 px-2.5 py-0.5 rounded">
                    {activeSubcategory.title}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-stone-100 tracking-wide">
                  {activeDesign.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {activeDesign.description || `Premium custom ${activeSubcategory.title.toLowerCase()} fabricated to your exact site dimensions.`}
                </p>

                {/* Base Rate Ribbon */}
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-heading font-black text-brand-gold font-mono">
                    {formatPrice(ratePerSqFt)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-semibold">
                    per square foot (base fabrication rate)
                  </span>
                </div>
              </div>

              {/* CALCULATOR CARD */}
              <div className="bg-[#0A101C] border border-brand-gold/40 rounded-xl p-5 space-y-5 shadow-2xl">
                
                <div className="flex items-center justify-between border-b border-brand-light/30 pb-3">
                  <span className="font-heading font-black text-xs uppercase tracking-wider text-stone-100 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-brand-gold" />
                    <span>Enter Your Dimensions for Instant Estimate</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                    Live Calculator
                  </span>
                </div>

                {/* Dimensions Inputs Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Width */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 mb-1">
                      Width (Feet) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={1}
                      max={60}
                      value={width}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setWidth(val);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-[#05080E] border border-brand-light/80 focus:border-brand-gold rounded-lg p-2.5 text-center font-mono font-bold text-stone-100 text-sm outline-none transition"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 mb-1">
                      Height (Feet) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={1}
                      max={40}
                      value={height}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setHeight(val);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-[#05080E] border border-brand-light/80 focus:border-brand-gold rounded-lg p-2.5 text-center font-mono font-bold text-stone-100 text-sm outline-none transition"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 mb-1">
                      Quantity <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(val);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-[#05080E] border border-brand-light/80 focus:border-brand-gold rounded-lg p-2.5 text-center font-mono font-bold text-stone-100 text-sm outline-none transition"
                    />
                  </div>
                </div>

                {/* Validation Error Message */}
                {validationError && (
                  <div className="p-3 bg-red-950/70 border border-red-500/80 rounded-lg text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Calculation Breakdown & Total Box */}
                <div className="bg-[#05080E] border border-brand-light/60 rounded-lg p-3.5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Unit Area ({width}ft × {height}ft):</span>
                    <strong className="text-stone-100">{unitArea} sq.ft</strong>
                  </div>

                  {quantity > 1 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Total Area ({unitArea} sq.ft × {quantity}):</span>
                      <strong className="text-stone-100">{totalArea} sq.ft</strong>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-300">
                    <span>Configured Rate per Sq.Ft:</span>
                    <strong className="text-brand-gold">{formatPrice(ratePerSqFt)}</strong>
                  </div>

                  {automation && (
                    <div className="flex justify-between text-amber-400">
                      <span>Motor Automation Kit:</span>
                      <strong>+Rs. 45,000</strong>
                    </div>
                  )}

                  <div className="pt-2 border-t border-brand-light/40 flex items-center justify-between">
                    <span className="font-heading font-black text-stone-200 uppercase text-xs">
                      Estimated Total Price:
                    </span>
                    <span className="text-xl sm:text-2xl font-heading font-black text-emerald-400">
                      {formatPrice(estimatedTotal, true)}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-brand-light/20">
                    *Estimated base fabrication cost. Final written quotation confirmed upon official on-site laser survey.
                  </p>
                </div>

                {/* Customization Options */}
                <div className="space-y-2.5 pt-1">
                  <span className="font-heading font-bold text-xs uppercase tracking-wide text-brand-gold block">
                    Customization &amp; Engineering Options:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <label className="flex items-center gap-2 p-2 rounded bg-black/40 border border-brand-light/30 cursor-pointer hover:border-brand-gold/60 transition">
                      <input 
                        type="checkbox" 
                        checked={customSize} 
                        onChange={(e) => setCustomSize(e.target.checked)} 
                        className="rounded text-brand-gold accent-amber-500" 
                      />
                      <span>Custom Driveway Size</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded bg-black/40 border border-brand-light/30 cursor-pointer hover:border-brand-gold/60 transition">
                      <input 
                        type="checkbox" 
                        checked={customDesign} 
                        onChange={(e) => setCustomDesign(e.target.checked)} 
                        className="rounded text-brand-gold accent-amber-500" 
                      />
                      <span>Custom CNC Motif</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded bg-black/40 border border-brand-light/30 cursor-pointer hover:border-brand-gold/60 transition">
                      <input 
                        type="checkbox" 
                        checked={colorChange} 
                        onChange={(e) => setColorChange(e.target.checked)} 
                        className="rounded text-brand-gold accent-amber-500" 
                      />
                      <span>Custom Powder Color</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded bg-black/40 border border-brand-light/30 cursor-pointer hover:border-brand-gold/60 transition">
                      <input 
                        type="checkbox" 
                        checked={automation} 
                        onChange={(e) => setAutomation(e.target.checked)} 
                        className="rounded text-brand-gold accent-amber-500" 
                      />
                      <span>Motor Automation (+45K)</span>
                    </label>
                  </div>

                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Additional notes: e.g. Wicket gate location, delivery city (Islamabad/Rawalpindi)..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#05080E] border border-brand-light/70 focus:border-brand-gold rounded-lg p-2.5 text-xs text-stone-100 placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Customer Contact Box */}
                <div 
                  id="customer-contact-box"
                  className={`bg-[#05080E] border p-3.5 rounded-lg space-y-3 transition ${
                    customerError ? 'border-red-500 ring-2 ring-red-500/30' : 'border-brand-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold uppercase tracking-wider text-stone-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Your Contact Information</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/30">
                      Pre-filled for WhatsApp
                    </span>
                  </div>

                  {customerError && (
                    <div className="p-2 bg-red-950/70 border border-red-500 rounded text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{customerError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Muhammad Usman"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (customerError) setCustomerError(null);
                        }}
                        className="w-full bg-[#080E1A] border border-brand-light/80 focus:border-brand-gold rounded p-2 text-xs text-stone-100 placeholder-slate-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">
                        Phone / WhatsApp <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 03239898317"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (customerError) setCustomerError(null);
                        }}
                        className="w-full bg-[#080E1A] border border-brand-light/80 focus:border-brand-gold rounded p-2 text-xs text-stone-100 placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* PRIMARY ACTIONS */}
                <div className="space-y-2.5 pt-2">
                  
                  {/* ADD CONFIGURED DESIGN TO CART BUTTON */}
                  <button
                    type="button"
                    onClick={handleAddConfiguredToCart}
                    className={`w-full py-3.5 px-4 font-heading font-black uppercase tracking-wider text-xs sm:text-sm rounded transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-xl active:scale-[0.99] ${
                      calculatorAdded
                        ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-900/30'
                        : 'bg-gradient-to-r from-amber-400 via-brand-gold to-amber-500 hover:from-amber-300 hover:to-amber-400 text-brand-dark border border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    }`}
                  >
                    {calculatorAdded ? (
                      <>
                        <Check className="w-5 h-5 text-white animate-bounce" />
                        <span>Configured Design Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart ({formatPrice(estimatedTotal, true)})</span>
                      </>
                    )}
                  </button>

                  {/* DIRECT WHATSAPP ORDER BUTTON */}
                  <button
                    type="button"
                    onClick={handleOrderOnWhatsApp}
                    className="btn-whatsapp w-full py-3 px-4 font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl hover:brightness-105 active:scale-[0.99] transition cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Order on WhatsApp (Direct Inquiry)</span>
                  </button>

                  {/* Secondary Actions Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      to={`/try-at-home?designId=${encodeURIComponent(activeDesign.id)}&category=${encodeURIComponent(activeCategory.category)}&subcategory=${encodeURIComponent(activeSubcategory.title)}&code=${encodeURIComponent(activeDesign.productCode || 'MSF')}&from=what-is-your-project`}
                      className="btn-gold text-xs py-2.5 px-3 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Try at Home</span>
                    </Link>

                    <Link
                      to={`/quote?productCode=${encodeURIComponent(activeDesign.productCode || 'MSF-001')}&category=${encodeURIComponent(activeCategory.category)}`}
                      className="btn-navy text-xs py-2.5 px-3 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-center"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Official Quote</span>
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* FULLSCREEN LIGHTBOX MODAL                                             */}
      {/* ===================================================================== */}
      {fullscreenImage && (
        <div 
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
        >
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 p-2 text-white hover:text-brand-gold bg-white/10 rounded-full transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen Inspection"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg border border-brand-gold/40 shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};
