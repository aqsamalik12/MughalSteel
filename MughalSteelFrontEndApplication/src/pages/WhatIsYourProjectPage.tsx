import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  ArrowRight, Sparkles, MessageCircle, Calculator, 
  Ruler, Eye, CheckCircle2, Filter, MapPin, ShieldCheck, 
  Layers, ShoppingBag, ArrowLeft, ChevronRight, Check
} from 'lucide-react';
import { useSEO } from '../utils/useSEO';
import { handleImageError, FALLBACK_IMAGE_URL } from '../utils/imageFallback';
import type { ProjectDesignItem, WhatIsYourProjectItem } from '../types';

export const WhatIsYourProjectPage: React.FC = () => {
  const { category: routeParam } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { whatIsYourProject, products, getWhatsAppUrl } = useData();
  const { formatPrice } = useCurrency();

  // Active category selection
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(() => {
    if (routeParam) return routeParam;
    const queryCat = searchParams.get('category');
    if (queryCat) return queryCat;
    return whatIsYourProject[0]?.category || 'Modern Home';
  });

  // Filter by design within category
  const [selectedDesignId, setSelectedDesignId] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategoryName]);

  useEffect(() => {
    if (routeParam) {
      setSelectedCategoryName(routeParam);
    }
  }, [routeParam]);

  // Find active category item
  const activeCategory: WhatIsYourProjectItem = useMemo(() => {
    const norm = selectedCategoryName.toLowerCase().replace(/[-_]/g, ' ').trim();
    const found = whatIsYourProject.find(w => {
      const cNorm = w.category.toLowerCase().trim();
      const idNorm = w.id.toLowerCase().trim();
      const cSlug = cNorm.replace(/[\s&]+/g, '-');
      return cNorm === norm || cSlug === norm || idNorm === norm || cNorm.includes(norm) || norm.includes(cNorm);
    });
    return found || whatIsYourProject[0] || {
      id: 'wip-modern-home',
      category: 'Modern Home',
      title: 'Modern Architecture & CNC Laser Gates',
      tagline: 'Clean lines, laser-cut geometry & minimalist architecture',
      description: 'Sleek architectural steelwork tailored for contemporary residences.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      itemsCount: 5,
      primaryItem: 'Front Gates',
      designs: []
    };
  }, [whatIsYourProject, selectedCategoryName]);

  const categoryDesigns: ProjectDesignItem[] = useMemo(() => {
    return activeCategory.designs || [];
  }, [activeCategory]);

  useSEO({
    title: `${activeCategory.category} Designs & Projects | Mughal Steel Fabrication`,
    description: activeCategory.description || activeCategory.tagline || 'Explore custom fabricated project designs and calculate pricing.',
    image: activeCategory.image,
    url: `/what-is-your-project/${encodeURIComponent(activeCategory.category)}`
  });

  // Filtered designs
  const displayedDesigns = useMemo(() => {
    if (selectedDesignId === 'all') return categoryDesigns;
    return categoryDesigns.filter(d => d.id === selectedDesignId);
  }, [categoryDesigns, selectedDesignId]);

  // Associated products for design collection grid
  const getAssociatedProduct = (design: ProjectDesignItem) => {
    if (design.associatedProductId) {
      const match = products.find(p => 
        p.id === design.associatedProductId || 
        p.slug === design.associatedProductId ||
        p.productCode === design.associatedProductId
      );
      if (match) return match;
    }
    if (design.associatedProductCode) {
      const match = products.find(p => 
        p.productCode.toLowerCase() === design.associatedProductCode?.toLowerCase()
      );
      if (match) return match;
    }
    // Search by category + item
    const matchCatItem = products.find(p => 
      p.category.toLowerCase().includes(activeCategory.category.toLowerCase()) &&
      design.itemType && p.item.toLowerCase() === design.itemType.toLowerCase()
    );
    if (matchCatItem) return matchCatItem;

    const matchCat = products.find(p => 
      p.category.toLowerCase().includes(activeCategory.category.toLowerCase())
    );
    return matchCat || products[0];
  };

  return (
    <div className="bg-[#05080E] min-h-screen text-stone-100 font-sans pb-20">
      
      {/* 1. Breadcrumb & Top Bar */}
      <div className="bg-[#080E1A] border-b border-brand-light/40 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Link to="/" className="hover:text-brand-gold transition">Home</Link>
            <span>/</span>
            <span className="text-slate-300">What Is Your Project?</span>
            <span>/</span>
            <span className="text-brand-gold font-bold">{activeCategory.category}</span>
          </div>

          <Link 
            to="/" 
            className="text-slate-400 hover:text-brand-gold flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Category Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-gradient-to-r from-[#0C1527] to-[#070D18] border border-brand-gold/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded-full">
                <Sparkles className="w-3 h-3 text-brand-gold" />
                <span>What Is Your Project — Ordering Flow</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-wide text-stone-100">
                {activeCategory.category}
              </h1>

              <p className="text-stone-300 text-xs sm:text-sm font-sans leading-relaxed">
                {activeCategory.description || activeCategory.tagline}
              </p>

              {/* Specs Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeCategory.gaugeSpec && (
                  <span className="text-[10px] font-mono bg-black/60 border border-brand-gold/30 px-2.5 py-1 rounded text-stone-300">
                    <strong className="text-brand-gold">Gauge:</strong> {activeCategory.gaugeSpec}
                  </span>
                )}
                {activeCategory.finishSpec && (
                  <span className="text-[10px] font-mono bg-black/60 border border-brand-gold/30 px-2.5 py-1 rounded text-stone-300">
                    <strong className="text-brand-gold">Finish:</strong> {activeCategory.finishSpec}
                  </span>
                )}
                {activeCategory.location && (
                  <span className="text-[10px] font-mono bg-black/60 border border-brand-gold/30 px-2.5 py-1 rounded text-stone-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-gold" />
                    <span>{activeCategory.location}</span>
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={getWhatsAppUrl(`*WHAT IS YOUR PROJECT INQUIRY*\nI am interested in project designs for: ${activeCategory.category} (${activeCategory.title}).\nPlease share technical specifications and current rates.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Category WhatsApp Inquiry</span>
                </a>

                <Link
                  to={`/try-at-home?category=${encodeURIComponent(activeCategory.category)}`}
                  className="btn-gold text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Try on House Photo</span>
                </Link>

                <Link
                  to="/quote"
                  className="btn-navy text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                >
                  <Calculator className="w-4 h-4 text-brand-gold" />
                  <span>Get Custom Quote</span>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden border border-brand-gold/50 shadow-2xl bg-black">
                <img 
                  src={activeCategory.image || FALLBACK_IMAGE_URL} 
                  alt={activeCategory.category} 
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-stone-200">
                  <span className="text-[11px] font-mono font-bold text-brand-gold bg-black/70 px-2 py-0.5 rounded border border-brand-gold/30">
                    {categoryDesigns.length} Project Designs Available
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    Live Ordering Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Switcher Horizontal Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="space-y-2">
          <span className="text-[11px] font-heading font-black uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Select Another Project Category:</span>
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {whatIsYourProject.map((cat) => {
              const isActive = cat.category.toLowerCase() === activeCategory.category.toLowerCase();
              return (
                <button
                  key={`pill-${cat.id || cat.category}`}
                  onClick={() => {
                    setSelectedCategoryName(cat.category);
                    setSelectedDesignId('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-gold text-brand-dark shadow-md'
                      : 'bg-[#0B1322] hover:bg-[#101B30] text-stone-300 border border-slate-700/60 hover:border-brand-gold/60'
                  }`}
                >
                  <span>{cat.category}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-black/20 text-brand-dark' : 'bg-black/60 text-brand-gold'}`}>
                    {cat.designs?.length || cat.itemsCount || 5}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Designs Listing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light/40 pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-brand-gold uppercase tracking-wider block">
              Step 2 &amp; 3: Choose Design &amp; Order
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-black uppercase text-stone-100">
              Designs for {activeCategory.category}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {selectedDesignId !== 'all' && (
              <button
                onClick={() => setSelectedDesignId('all')}
                className="text-xs text-brand-gold hover:underline font-bold"
              >
                Show All Designs ({categoryDesigns.length})
              </button>
            )}
          </div>
        </div>

        {displayedDesigns.length === 0 ? (
          <div className="bg-[#0A101D] border border-brand-light/60 rounded-xl p-12 text-center space-y-4">
            <Layers className="w-12 h-12 mx-auto text-slate-500" />
            <h3 className="font-heading font-bold text-base uppercase text-stone-200">
              No Designs Uploaded Yet for {activeCategory.category}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You can browse our regular product catalog or request a custom architectural fabrication quote for this project.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/products" className="btn-gold text-xs py-2.5 px-4 font-bold">
                Browse All Products
              </Link>
              <Link to="/quote" className="btn-navy text-xs py-2.5 px-4 font-bold">
                Request Custom Quote
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedDesigns.map((design) => {
              const matchedProduct = getAssociatedProduct(design);
              const rate = design.pricePerSqFt || matchedProduct?.pricePerSqFt || 2500;
              const productSlug = matchedProduct?.slug || matchedProduct?.id || 'prod-mfg-g001';
              const productCode = design.associatedProductCode || matchedProduct?.productCode || 'MFG-001';

              return (
                <div 
                  key={`des-card-${design.id}`}
                  className="group bg-[#060A12] border border-brand-light/60 hover:border-brand-gold rounded-xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between card-interactive"
                >
                  {/* Design Image with Badges */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                    <img 
                      src={design.image || matchedProduct?.images?.[0] || FALLBACK_IMAGE_URL} 
                      alt={design.title} 
                      loading="lazy"
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold bg-black/80 text-brand-gold border border-brand-gold/40 px-2 py-0.5 rounded shadow">
                        {design.itemType || 'Fabrication Item'}
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded shadow">
                        Code: {productCode}
                      </span>
                    </div>

                    {/* Bottom Rate Badge */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-stone-200">
                      <span className="text-xs font-mono font-black text-brand-gold bg-black/70 px-2 py-0.5 rounded border border-brand-gold/30">
                        {formatPrice(rate)} / sq.ft
                      </span>
                      <Link 
                        to={`/try-at-home?product=${productCode}`}
                        className="text-[10px] font-bold text-stone-300 hover:text-brand-gold bg-black/70 px-2 py-0.5 rounded border border-white/20 flex items-center gap-1"
                        title="Visualize on house photo"
                      >
                        <Eye className="w-3 h-3 text-brand-gold" />
                        <span>Try on House</span>
                      </Link>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-heading font-black text-sm text-stone-100 group-hover:text-brand-gold transition-colors uppercase leading-snug line-clamp-1">
                        {design.title}
                      </h3>
                      
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                        {design.description || `${activeCategory.category} custom fabrication engineered with high-strength steel.`}
                      </p>

                      {/* Specs Box */}
                      <div className="bg-black/60 border border-brand-light/40 p-2.5 rounded-lg space-y-1 text-[11px] font-mono">
                        {(design.gaugeSpec || activeCategory.gaugeSpec) && (
                          <div className="flex items-start justify-between text-stone-300 text-[10px]">
                            <span className="text-brand-gold">Steel Gauge:</span>
                            <span className="text-slate-300 truncate max-w-[65%]">
                              {design.gaugeSpec || activeCategory.gaugeSpec}
                            </span>
                          </div>
                        )}
                        {(design.finishSpec || activeCategory.finishSpec) && (
                          <div className="flex items-start justify-between text-stone-300 text-[10px]">
                            <span className="text-brand-gold">Finishing:</span>
                            <span className="text-slate-300 truncate max-w-[65%]">
                              {design.finishSpec || activeCategory.finishSpec}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Connects to Existing Ordering System */}
                    <div className="pt-2 border-t border-brand-light/40 space-y-2">
                      {/* 1. Primary Order & Customize Button (Opens Product Detail with Calculator) */}
                      <Link
                        to={`/product/${productSlug}`}
                        className="btn-gold text-xs py-2 px-3 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 w-full shadow-lg"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Size &amp; Price Calculator</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* 2. Secondary View Collection & WhatsApp Links */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`/items?item=${encodeURIComponent(design.itemType || 'Front Gates')}&category=${encodeURIComponent(activeCategory.category)}`}
                          className="btn-navy text-[10px] py-1.5 px-2 font-bold uppercase text-center flex items-center justify-center gap-1"
                          title="View all designs in this collection"
                        >
                          <Layers className="w-3 h-3 text-brand-gold" />
                          <span>Collection</span>
                        </Link>

                        <a
                          href={getWhatsAppUrl(`*WHAT IS YOUR PROJECT ORDER INQUIRY*\nCategory: ${activeCategory.category}\nDesign: ${design.title}\nProduct Code: ${productCode}\nEstimated Rate: Rs. ${rate.toLocaleString()} / sq.ft\nImage: ${design.image}\n\nHello Mughal Steel, I want to order this project design. Please confirm site measurement and quote.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-whatsapp text-[10px] py-1.5 px-2 font-bold uppercase text-center flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Inquire</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. How The Ordering Flow Works Help Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-[#0A101C] border border-brand-gold/30 rounded-xl p-6 sm:p-8">
          <h3 className="font-heading font-black text-sm uppercase text-brand-gold flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span>How What Is Your Project Ordering Works</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="bg-black/50 border border-brand-light/40 p-3.5 rounded-lg space-y-1">
              <span className="font-mono font-bold text-brand-gold text-[10px]">STEP 1</span>
              <h4 className="font-bold text-stone-200">Select Project Category</h4>
              <p className="text-slate-400 text-[11px]">Choose Modern Home, Housing Society, Commercial, or other architecture style.</p>
            </div>

            <div className="bg-black/50 border border-brand-light/40 p-3.5 rounded-lg space-y-1">
              <span className="font-mono font-bold text-brand-gold text-[10px]">STEP 2</span>
              <h4 className="font-bold text-stone-200">Choose Design</h4>
              <p className="text-slate-400 text-[11px]">Browse front gates, balcony railings, spiral stairs, or security grilles.</p>
            </div>

            <div className="bg-black/50 border border-brand-light/40 p-3.5 rounded-lg space-y-1">
              <span className="font-mono font-bold text-brand-gold text-[10px]">STEP 3</span>
              <h4 className="font-bold text-stone-200">Calculate Price &amp; Size</h4>
              <p className="text-slate-400 text-[11px]">Enter your custom width &amp; height in feet for instant square foot and total price calculation.</p>
            </div>

            <div className="bg-black/50 border border-brand-light/40 p-3.5 rounded-lg space-y-1">
              <span className="font-mono font-bold text-brand-gold text-[10px]">STEP 4</span>
              <h4 className="font-bold text-stone-200">Shared Cart &amp; WhatsApp</h4>
              <p className="text-slate-400 text-[11px]">Add to cart alongside any products and send full inquiry directly on WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
