import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Calculator, Sparkles, MessageCircle, Heart, CheckCircle2, 
  Ruler, ShieldCheck, Hammer, Award, Star, ArrowRight, Eye, 
  ChevronRight, Info, AlertCircle, Maximize2, ChevronLeft, 
  X, Layers, Compass, ZoomIn, Share2, Check, FileText,
  User, Phone, MapPin
} from 'lucide-react';
import { useSEO } from '../utils/useSEO';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, getWhatsAppUrl } = useData();
  const { formatPrice } = useCurrency();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const { user } = useAuth();

  // Find product by slug or code
  const product = products.find(p => 
    p.slug === slug || 
    p.productCode.toLowerCase() === slug?.toLowerCase() ||
    p.id === slug
  ) || products[0];

  useSEO({
    title: product ? `${product.name} | Mughal Steel Fabrication` : 'Product Details | Mughal Steel Fabrication',
    description: product?.description || 'Custom architectural steel fabrication, laser-cut specifications, and instant sizing calculator.',
    image: product?.images?.[0] || (product as any)?.image,
    url: product?.slug ? `/product/${product.slug}` : undefined,
    structuredData: product ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images?.[0] || (product as any)?.image,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: 'Mughal Steel Fabrication'
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: product.price || 0,
        availability: 'https://schema.org/InStock'
      }
    } : undefined
  });

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // Sizing Calculator inputs
  const [width, setWidth] = useState<number>(5);
  const [height, setHeight] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Customer Site & Contact Info for WhatsApp Order
  const [customerName, setCustomerName] = useState(user ? (user.displayName || `${user.firstName} ${user.lastName || ''}`.trim()) : '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(
    user?.addresses?.[0] ? `${user.addresses[0].street}, ${user.addresses[0].city}` : ''
  );
  const [customerError, setCustomerError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.displayName || `${user.firstName} ${user.lastName || ''}`.trim());
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (!customerAddress && user?.addresses?.[0]) {
        setCustomerAddress(`${user.addresses[0].street}, ${user.addresses[0].city}`);
      }
    }
  }, [user]);


  // Customization Checkboxes
  const [customSize, setCustomSize] = useState(false);
  const [customDesign, setCustomDesign] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const [automaticSystem, setAutomaticSystem] = useState(false);
  const [siteInstallation, setSiteInstallation] = useState(true);
  const [notes, setNotes] = useState<string>('');

  // Product specific client reviews
  const [productReviews, setProductReviews] = useState<{
    author: string;
    location: string;
    rating: number;
    comment: string;
    date: string;
  }[]>([
    {
      author: 'Ch. Tariq',
      location: 'Bahria Town Rawalpindi',
      rating: 5,
      comment: 'Installed this gate at our villa. Heavy 14-gauge steel and flawless powder coating finish. Highly recommended.',
      date: '2026-02-14'
    },
    {
      author: 'Malik Zeeshan',
      location: 'DHA Phase 2 Islamabad',
      rating: 5,
      comment: 'Laser cutting tolerances are clean and precise. Structural anchoring done with laser leveling.',
      date: '2026-02-08'
    }
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewScore, setNewReviewScore] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewAddedSuccess, setReviewAddedSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
    setValidationError(null);
  }, [slug]);

  // Sizing validation & dynamic calculations
  const validatedWidth = width > 0 ? width : 1;
  const validatedHeight = height > 0 ? height : 1;
  const validatedQty = quantity > 0 ? quantity : 1;

  const area = parseFloat((validatedWidth * validatedHeight).toFixed(2));
  const rate = product.pricePerSqFt || 2500;
  const totalArea = parseFloat((area * validatedQty).toFixed(2));
  const estimatedTotal = Math.round(totalArea * rate);

  const isSaved = wishlist.some(p => p.id === product.id);

  // Dedicated 4-Angle Product Views (Only authentic images added/edited by admin)
  const defaultImages = (product.images || []).filter(img => Boolean(img && img.trim()));
  const primaryFront = (product.frontImage || product.galleryViews?.front || defaultImages[0] || '').trim();
  const primaryBack = (product.backImage || product.galleryViews?.back || (defaultImages.length > 1 ? defaultImages[1] : '') || '').trim();
  const primaryLeft = (product.leftSideImage || product.galleryViews?.leftSide || (defaultImages.length > 2 ? defaultImages[2] : '') || '').trim();
  const primaryRight = (product.rightSideImage || product.galleryViews?.rightSide || (defaultImages.length > 3 ? defaultImages[3] : '') || '').trim();

  const fourSideViews = [
    {
      id: 'front',
      label: 'Front View',
      shortLabel: 'Front',
      fullTitle: 'Front Elevation & Face Profile',
      tag: 'Front View • 1/4',
      icon: '🌟',
      url: primaryFront
    },
    {
      id: 'back',
      label: 'Back View',
      shortLabel: 'Back',
      fullTitle: 'Rear / Interior View & Locking Framework',
      tag: 'Back View • 2/4',
      icon: '🔄',
      url: primaryBack
    },
    {
      id: 'left',
      label: 'Left Side',
      shortLabel: 'Left Side',
      fullTitle: 'Left Profile, Post & Frame Thickness',
      tag: 'Left Side • 3/4',
      icon: '📐',
      url: primaryLeft
    },
    {
      id: 'right',
      label: 'Right Side',
      shortLabel: 'Right Side',
      fullTitle: 'Right Profile, Hinges & Depth Alignment',
      tag: 'Right Side • 4/4',
      icon: '📐',
      url: primaryRight
    }
  ];

  // Extra images beyond 4 if present
  const extraImages = defaultImages.slice(4).map((url, idx) => ({
    id: `extra-${idx}`,
    label: `Detail ${idx + 1}`,
    shortLabel: `Detail ${idx + 1}`,
    fullTitle: `Craftsmanship & On-site Detail ${idx + 1}`,
    tag: `Detail • ${idx + 5}`,
    icon: '🔍',
    url: url.trim()
  }));

  const galleryViews = [...fourSideViews, ...extraImages].filter(v => Boolean(v.url && v.url.length > 5));

  const handleWhatsAppInquiry = () => {

    // Validate that Customer has entered their details
    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.trim();
    const cleanAddress = customerAddress.trim();

    if (!cleanName || !cleanPhone || !cleanAddress) {
      setCustomerError('⚠️ Please fill in your Full Name, Phone Number, and Delivery/Site Address before sending the WhatsApp order.');
      const elem = document.getElementById('customer-details-box');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setCustomerError(null);

    const selectedCustoms = [
      customSize ? 'Custom Sizing' : '',
      customDesign ? 'Custom Laser Motif' : '',
      colorChange ? 'Custom Color Coating' : '',
      automaticSystem ? 'German Motor Automation' : '',
      siteInstallation ? 'Turnkey Site Installation' : ''
    ].filter(Boolean).join(', ');

    const rawPhoto = galleryViews[activeImageIndex]?.url || galleryViews[0]?.url || product.frontImage || product.images?.[0] || '';
    const designPhoto = (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://')) ? rawPhoto : '';
    const productPageUrl = `${window.location.origin}/#/product/${product.slug}`;

    const msg = `*MUGHAL STEEL FABRICATION ORDER*\n\n` +
      `🖼️ *PRODUCT DESIGN PHOTO LINK:*\n` +
      `${designPhoto}\n\n` +
      `👤 *CUSTOMER DETAILS:*\n` +
      `• Client Name: ${cleanName}\n` +
      `• Contact Number: ${cleanPhone}\n` +
      `• Site / Delivery Address: ${cleanAddress}\n\n` +
      `📋 *FABRICATION SPECIFICATIONS:*\n` +
      `• Product Code: ${product.productCode}\n` +
      `• Design Name: ${product.name}\n` +
      `• Category: ${product.category} > ${product.item}\n` +
      `• Configured Dimensions: ${validatedWidth} ft (W) × ${validatedHeight} ft (H) = ${area} sq.ft\n` +
      `• Quantity: ${validatedQty} Unit(s)\n` +
      `• Rate per Sq.Ft: ${formatPrice(rate)}\n` +
      `• *Estimated Grand Total: ${formatPrice(estimatedTotal, true)}*\n` +
      (selectedCustoms ? `• Selected Customizations: ${selectedCustoms}\n` : '') +
      (notes ? `• Special Instructions: ${notes}\n` : '') +
      `\n🔗 *Product View Link:* ${productPageUrl}\n\n` +
      `Hello Admin, I want to order this design. Please check the design photo above and confirm site measurement.`;

    const url = getWhatsAppUrl(msg);
    window.open(url, '_blank');
  };

  const handleBuyNow = () => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productCode: product.productCode,
      productName: product.name,
      productImage: galleryViews[activeImageIndex]?.url || galleryViews[0]?.url || product.frontImage || product.images[0],
      category: product.category,
      item: product.item,
      width: validatedWidth,
      height: validatedHeight,
      area: area,
      pricePerSqFt: rate,
      customNotes: [
        notes,
        customSize ? 'Custom Driveway Size' : '',
        customDesign ? 'Custom CNC Laser Motif' : '',
        colorChange ? 'Custom Powder Color' : '',
        automaticSystem ? 'German Motor Automation' : '',
        siteInstallation ? 'Turnkey Site Installation' : ''
      ].filter(Boolean).join(', ')
    }, validatedQty);

    navigate('/checkout');
  };





  const handleProductReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;
    const newRev = {
      author: newReviewAuthor,
      location: newReviewCity || 'Rawalpindi / Islamabad',
      rating: newReviewScore,
      comment: newReviewText,
      date: new Date().toISOString().split('T')[0]
    };
    setProductReviews([newRev, ...productReviews]);
    setReviewAddedSuccess(true);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewText('');
    setTimeout(() => setReviewAddedSuccess(false), 4000);
  };

  // Related products from same category or item
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.item === product.item))
    .slice(0, 4);

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-8 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ======================================================== */}
        {/* 1. BREADCRUMBS NAVIGATION */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono border-b border-brand-light/40 pb-4">
          <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span>&gt;</span>
          <Link to="/categories" className="hover:text-brand-gold transition-colors">Projects</Link>
          <span>&gt;</span>
          <Link 
            to={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`} 
            className="hover:text-brand-gold transition-colors"
          >
            {product.category}
          </Link>
          <span>&gt;</span>
          <Link 
            to={`/items?item=${encodeURIComponent(product.item)}`} 
            className="hover:text-brand-gold transition-colors"
          >
            {product.item}
          </Link>
          <span>&gt;</span>
          <span className="text-brand-gold font-bold">{product.productCode}</span>
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN PRODUCT DETAIL GRID (LEFT GALLERY + RIGHT SPECS) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: MULTI-VIEW HIGH-RES GALLERY (6 COLS) */}
          <div className="lg:col-span-6 space-y-3.5">
            
            {/* 4-Angle Switcher Quick Control Bar */}
            <div className="bg-[#0C1322] border border-stone-800 rounded-xl p-2 flex items-center justify-between gap-1 shadow-lg">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-mono text-brand-gold uppercase tracking-wider font-bold">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span className="hidden sm:inline">4-Side View Inspection</span>
                <span className="sm:hidden">4 Angles</span>
              </div>
              
              <div className="flex items-center gap-1 overflow-x-auto">
                {galleryViews.slice(0, 4).map((view, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                      activeImageIndex === idx
                        ? 'bg-gradient-to-r from-amber-500 to-brand-gold text-brand-dark shadow-md font-black shadow-brand-gold/20 scale-[1.02]'
                        : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-700/60'
                    }`}
                  >
                    <span>{view.icon}</span>
                    <span>{view.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden border border-brand-gold/30 shadow-2xl group select-none">
              <img 
                src={galleryViews[activeImageIndex]?.url || galleryViews[0].url} 
                alt={`${product.name} - ${galleryViews[activeImageIndex]?.label}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              
              {/* Product Code & Active Side Badge */}
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-brand-gold/50 text-[10px] sm:text-xs font-mono text-brand-gold font-bold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                <span>{product.productCode}</span>
                <span className="text-stone-500">•</span>
                <span className="text-white uppercase font-sans font-bold">{galleryViews[activeImageIndex]?.tag || galleryViews[activeImageIndex]?.label}</span>
              </div>

              {/* Prev / Next Angle Flip Arrows */}
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + galleryViews.length) % galleryViews.length)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white border border-stone-700/80 hover:border-brand-gold transition flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 cursor-pointer"
                title="Previous Angle"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % galleryViews.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white border border-stone-700/80 hover:border-brand-gold transition flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 cursor-pointer"
                title="Next Angle"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Lightbox / Zoom Action */}
              <button 
                onClick={() => setFullscreenOpen(true)}
                className="absolute top-3 right-3 p-2 bg-black/80 hover:bg-brand-gold hover:text-brand-dark text-stone-200 rounded-lg transition-colors border border-stone-700 hover:border-brand-gold shadow-lg"
                title="View Fullscreen 4-Angle Inspection"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Try at Home Floating Ribbon */}
              <Link 
                to={`/try-at-home?product=${product.productCode}`}
                className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-brand-gold text-brand-dark hover:brightness-110 text-xs font-heading font-black px-3.5 py-2 rounded-lg shadow-xl transition flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Eye className="w-4 h-4" />
                <span>Try on House Photo →</span>
              </Link>
            </div>

            {/* 4 Dedicated Angle Cards Switcher Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {galleryViews.map((view, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative rounded-xl overflow-hidden border transition-all text-left group cursor-pointer p-1 bg-[#0C1322] ${
                    activeImageIndex === idx 
                      ? 'border-brand-gold ring-2 ring-brand-gold/50 shadow-lg shadow-brand-gold/10' 
                      : 'border-stone-800 hover:border-stone-600 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden relative bg-black">
                    <img src={view.url} alt={view.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-1 left-1 bg-black/80 text-[8px] text-brand-gold font-mono px-1 rounded">
                      {view.icon} {idx + 1}/4
                    </span>
                  </div>
                  <div className="p-1 text-center">
                    <span className={`block text-[10px] font-bold uppercase truncate ${activeImageIndex === idx ? 'text-brand-gold' : 'text-stone-300'}`}>
                      {view.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Workshop Quality & 4-View Assurance Seal */}
            <div className="p-3.5 bg-[#0C1322] border border-stone-800/90 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0" />
                <span>360° Structural Inspection & 10-Year Warranty</span>
              </div>
              <span className="font-mono text-brand-gold font-bold text-[10px] bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/30">
                Certified 14G MS
              </span>
            </div>

          </div>

          {/* RIGHT: SPECIFICATIONS, CALCULATOR & ACTIONS (6 COLS) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title, Category & Code */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold font-mono font-bold text-[10px] rounded uppercase">
                  {product.productCode}
                </span>
                <span className="text-slate-400 text-xs font-mono">• {product.category} • {product.item}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-stone-100 uppercase tracking-tight">
                {product.name}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-brand-navy border border-brand-light/60 rounded-lg text-xs">
              {product.materials && product.materials.length > 0 && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">Material Grade</span>
                  <span className="font-bold text-stone-200">{product.materials.join(', ')}</span>
                </div>
              )}
              {product.finishes && product.finishes.length > 0 && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">Finish Treatment</span>
                  <span className="font-bold text-stone-200">{product.finishes.join(', ')}</span>
                </div>
              )}
              {product.style && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">Architecture Style</span>
                  <span className="font-bold text-stone-200">{product.style}</span>
                </div>
              )}
              {product.application && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">Target Application</span>
                  <span className="font-bold text-stone-200">{product.application}</span>
                </div>
              )}
            </div>

            {/* SIZE & PRICE CALCULATOR */}
            <div className="p-5 bg-brand-navy border border-brand-gold/40 rounded-lg space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-brand-light/40 pb-2.5">
                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>Size & Price Calculator</span>
                </h3>
                <span className="font-mono text-xs text-stone-300 font-bold">
                  Rate: {formatPrice(rate)} / sq.ft
                </span>
              </div>

              {/* 3 Input Fields Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Width (ft)</label>
                  <input 
                    type="number" 
                    step={0.5} 
                    min={1} 
                    value={width} 
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full bg-brand-dark border border-brand-light/80 rounded p-2 text-xs text-center font-mono font-bold text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Height (ft)</label>
                  <input 
                    type="number" 
                    step={0.5} 
                    min={1} 
                    value={height} 
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-brand-dark border border-brand-light/80 rounded p-2 text-xs text-center font-mono font-bold text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-brand-dark border border-brand-light/80 rounded p-2 text-xs text-center font-mono font-bold text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-2.5 bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Price Calculation Metrics */}
              <div className="p-3 bg-brand-dark/90 rounded border border-brand-light/60 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Unit Area ({validatedWidth}ft × {validatedHeight}ft):</span>
                  <span className="font-bold text-stone-100">{area} sq.ft</span>
                </div>
                {validatedQty > 1 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Total Area ({area} sq.ft × {validatedQty}):</span>
                    <span className="font-bold text-stone-100">{totalArea} sq.ft</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-brand-light/40">
                  <span className="text-sm font-heading font-bold text-slate-200">Estimated Price:</span>
                  <span className="text-lg font-heading font-black text-brand-gold">
                    {formatPrice(estimatedTotal, true)}
                  </span>
                </div>
              </div>

              {/* Customization Options */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="font-heading font-bold text-slate-300 text-[11px] uppercase tracking-wide block">
                  Customization & Engineering Options
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={customSize} onChange={(e) => setCustomSize(e.target.checked)} className="rounded text-brand-gold" />
                    <span>Custom Driveway Size</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={customDesign} onChange={(e) => setCustomDesign(e.target.checked)} className="rounded text-brand-gold" />
                    <span>Custom CNC Laser Motif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={colorChange} onChange={(e) => setColorChange(e.target.checked)} className="rounded text-brand-gold" />
                    <span>Custom Powder Color</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={automaticSystem} onChange={(e) => setAutomaticSystem(e.target.checked)} className="rounded text-brand-gold" />
                    <span>German Motor Automation</span>
                  </label>
                </div>

                <div className="pt-2">
                  <input 
                    type="text" 
                    placeholder="Optional notes: e.g. Wicket gate location, delivery city..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light/80 rounded p-2 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Customer Contact & Site Delivery Address Box for WhatsApp Order */}
              <div 
                id="customer-details-box"
                className={`bg-[#0A101C] border transition-all duration-300 p-4 rounded-lg space-y-3 shadow-md ${
                  customerError ? 'border-red-500/80 ring-2 ring-red-500/30' : 'border-brand-gold/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-brand-gold text-xs font-heading font-bold uppercase tracking-wider">
                    <User className="w-4 h-4 text-brand-gold" />
                    <span>Customer Details (Name, Phone & Site Address)</span>
                  </span>
                  <span className="text-[10px] text-brand-gold/80 font-mono font-bold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/30">
                    Required for WhatsApp Order
                  </span>
                </div>

                {customerError && (
                  <div className="p-2.5 bg-red-950/60 border border-red-500/80 rounded text-red-200 text-xs flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-semibold">{customerError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-300 font-semibold mb-1 uppercase tracking-wide">
                      Your Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g. Muhammad Usman"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (customerError) setCustomerError(null);
                        }}
                        className={`w-full bg-brand-dark border rounded py-2 pl-8 pr-3 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                          customerError && !customerName.trim() ? 'border-red-500 bg-red-950/30' : 'border-brand-light/90'
                        }`}
                      />
                      <User className="w-3.5 h-3.5 text-brand-gold absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 font-semibold mb-1 uppercase tracking-wide">
                      Phone / WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="e.g. 0300-1234567"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (customerError) setCustomerError(null);
                        }}
                        className={`w-full bg-brand-dark border rounded py-2 pl-8 pr-3 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                          customerError && !customerPhone.trim() ? 'border-red-500 bg-red-950/30' : 'border-brand-light/90'
                        }`}
                      />
                      <Phone className="w-3.5 h-3.5 text-brand-gold absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 font-semibold mb-1 uppercase tracking-wide">
                    Site / Delivery Address & City <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. House 42, Street 12, Sector F-7/2, Islamabad"
                      value={customerAddress}
                      onChange={(e) => {
                        setCustomerAddress(e.target.value);
                        if (customerError) setCustomerError(null);
                      }}
                      className={`w-full bg-brand-dark border rounded py-2 pl-8 pr-3 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                        customerError && !customerAddress.trim() ? 'border-red-500 bg-red-950/30' : 'border-brand-light/90'
                      }`}
                    />
                    <MapPin className="w-3.5 h-3.5 text-brand-gold absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>


                {/* Attached Product Photo Indicator */}
                <div className="flex items-center gap-3 p-2 bg-brand-dark/90 border border-brand-gold/40 rounded-md">
                  <img 
                    src={galleryViews[activeImageIndex]?.url || galleryViews[0]?.url || product.frontImage || product.images[0]} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded border border-brand-gold/60 shrink-0 shadow" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-stone-100 truncate block">{product.name}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-bold shrink-0">
                        HD Photo Attached
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Code: {product.productCode} • Direct image link sent to WhatsApp
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS GRID */}
              <div className="space-y-2.5 pt-1">
                {/* Order Now / Proceed to Checkout Button */}
                <button 
                  onClick={handleBuyNow}
                  className="btn-gold w-full text-xs py-3.5 px-4 text-center justify-center font-bold shadow-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Order Now / Proceed to Checkout</span>
                </button>

                {/* Primary WhatsApp Order & Inquiry with Photo */}
                <button 
                  onClick={handleWhatsAppInquiry}
                  className="btn-whatsapp w-full text-xs py-3 px-4 text-center justify-center font-bold shadow-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order & Inquire on WhatsApp</span>
                </button>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link 
                    to={`/quote?productCode=${product.productCode}&category=${encodeURIComponent(product.category)}`}
                    className="p-2.5 bg-brand-navy hover:bg-brand-medium border border-brand-light text-slate-200 text-xs font-heading font-bold rounded text-center transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    <FileText className="w-4 h-4 text-brand-gold" />
                    <span>Request Official Quote</span>
                  </Link>

                  <Link 
                    to={`/try-at-home?product=${product.productCode}`}
                    className="p-2.5 bg-brand-dark hover:bg-brand-medium border border-brand-gold/60 text-brand-gold text-xs font-heading font-bold rounded text-center transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Try at Home Studio</span>
                  </Link>
                </div>
              </div>

            </div>


          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. VERIFIED PRODUCT REVIEWS */}
        {/* ======================================================== */}
        <div className="p-6 bg-brand-navy border border-brand-light/60 rounded-lg space-y-6">
          
          <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
            <div>
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                <span>Verified Client Reviews ({productReviews.length})</span>
              </h3>
              <span className="text-slate-400 text-xs">Customer feedback for {product.productCode}</span>
            </div>
            <span className="font-mono text-xs text-brand-gold font-bold">5.0 / 5.0 Rating</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productReviews.map((rev, idx) => (
              <div key={idx} className="p-4 bg-brand-dark/90 border border-brand-light/40 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-stone-100">{rev.author}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">{rev.location} • {rev.date}</span>
                <p className="text-xs text-slate-300 font-sans italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="p-4 bg-brand-dark border border-brand-light/60 rounded-lg space-y-3">
            <h4 className="font-heading font-bold text-xs text-slate-200 uppercase tracking-wider">
              Add Your Project Review
            </h4>

            {reviewAddedSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs rounded text-center">
                Thank you! Your feedback for {product.productCode} has been recorded.
              </div>
            ) : (
              <form onSubmit={handleProductReviewSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    required 
                    placeholder="Your Name *" 
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="bg-brand-navy border border-brand-light rounded p-2 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                  <input 
                    type="text" 
                    placeholder="City / Area (e.g. Islamabad)" 
                    value={newReviewCity}
                    onChange={(e) => setNewReviewCity(e.target.value)}
                    className="bg-brand-navy border border-brand-light rounded p-2 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <textarea 
                  rows={2} 
                  required 
                  placeholder="Share your experience with fabrication quality, gauge thickness, or installation..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-light rounded p-2 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                />
                <button type="submit" className="btn-gold text-[10px] py-2 px-4 uppercase font-bold">
                  Submit Review
                </button>
              </form>
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. RELATED PRODUCTS FROM SAME CATEGORY */}
        {/* ======================================================== */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-brand-light/40 pb-2">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-brand-gold">
                Related {product.category} Products
              </h3>
              <Link 
                to={`/items?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-mono text-brand-gold hover:underline uppercase"
              >
                View Full Category Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.slug}`}
                  className="group bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden hover:border-brand-gold transition-all duration-300 shadow-md flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] bg-black overflow-hidden relative">
                    <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 bg-black/80 text-[9px] font-mono text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30">
                      {rel.productCode}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <h4 className="font-heading font-bold text-xs text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1 uppercase">
                      {rel.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">{rel.item}</span>
                    <div className="flex items-center justify-between pt-2 border-t border-brand-light/40">
                      <span className="font-mono text-xs font-bold text-brand-gold">
                        {formatPrice(rel.pricePerSqFt || 2500)} / sq.ft
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-brand-gold transition-colors font-bold">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen 4-Angle Lightbox Modal */}
        {fullscreenOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10 w-full max-w-6xl mx-auto pb-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-mono font-bold rounded">
                  {product.productCode}
                </span>
                <span className="text-stone-200 font-bold text-sm uppercase">
                  {galleryViews[activeImageIndex]?.fullTitle || galleryViews[activeImageIndex]?.label}
                </span>
              </div>
              <button 
                onClick={() => setFullscreenOpen(false)}
                className="p-2 bg-stone-900 hover:bg-brand-gold hover:text-brand-dark text-stone-300 rounded-lg transition-colors border border-stone-800 hover:border-brand-gold cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center Main Stage Image with Prev / Next */}
            <div className="relative flex-grow flex items-center justify-center max-w-6xl w-full mx-auto my-2">
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + galleryViews.length) % galleryViews.length)}
                className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/80 hover:bg-brand-gold hover:text-brand-dark text-white border border-stone-700 hover:border-brand-gold transition flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <img 
                src={galleryViews[activeImageIndex]?.url || galleryViews[0].url} 
                alt={product.name} 
                className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl border border-stone-800"
              />

              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % galleryViews.length)}
                className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/80 hover:bg-brand-gold hover:text-brand-dark text-white border border-stone-700 hover:border-brand-gold transition flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>

            {/* Bottom 4-Side Angle Switcher */}
            <div className="w-full max-w-xl mx-auto flex items-center justify-center gap-3 pt-2">
              {galleryViews.map((view, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition border cursor-pointer ${
                    activeImageIndex === idx
                      ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-lg shadow-brand-gold/20 font-black'
                      : 'bg-stone-900/90 text-stone-300 border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <span>{view.icon}</span>
                  <span>{view.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
