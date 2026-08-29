import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { PROJECT_CATEGORIES_DATA } from '../data/seedData';
import { 
  Search, Filter, SlidersHorizontal, ArrowUpDown, 
  Sparkles, Eye, Calculator, ArrowRight, X, CheckCircle, MessageCircle 
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, getWhatsAppUrl, categories } = useData();
  const { formatPrice } = useCurrency();
  const activeCategories = (categories && categories.length > 0) ? categories : PROJECT_CATEGORIES_DATA;


  // URL state sync
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || '';
  const queryItem = searchParams.get('item') || '';

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedItem, setSelectedItem] = useState(queryItem);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (querySearch) setSearchTerm(querySearch);
    if (queryCategory) setSelectedCategory(queryCategory);
    if (queryItem) setSelectedItem(queryItem);
  }, [querySearch, queryCategory, queryItem]);

  // Extract unique materials
  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.materials?.forEach(m => set.add(m)));
    return Array.from(set);
  }, [products]);

  // Item types
  const allItemTypes = [
    'Front Gates', 'Main Gates', 'Railing', 'Stair Railing', 
    'Balcony Railing', 'Grills', 'Doors', 'Windows', 
    'Boundary Wall Grills', 'Aluminum & Glass Partitions'
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCode = p.productCode.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesItem = p.item.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDesc && !matchesCat && !matchesItem) {
          return false;
        }
      }

      // Category
      if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Item
      if (selectedItem && p.item.toLowerCase() !== selectedItem.toLowerCase()) {
        return false;
      }

      // Material
      if (selectedMaterial && !p.materials.includes(selectedMaterial)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerSqFt - b.pricePerSqFt;
      if (sortBy === 'price-desc') return b.pricePerSqFt - a.pricePerSqFt;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchTerm, selectedCategory, selectedItem, selectedMaterial, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedItem('');
    setSelectedMaterial('');
    setSearchParams({});
  };

  return (
    <div className="bg-brand-dark min-h-screen text-stone-100 py-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Link to="/" className="hover:text-brand-gold">Home</Link>
          <span>&gt;</span>
          <span className="text-brand-gold font-bold">Products & Catalog</span>
          {selectedCategory && (
            <>
              <span>&gt;</span>
              <span className="text-stone-300 font-bold">{selectedCategory}</span>
            </>
          )}
          {selectedItem && (
            <>
              <span>&gt;</span>
              <span className="text-brand-gold font-bold">{selectedItem}</span>
            </>
          )}
        </div>

        {/* Page Header Banner */}
        <div className="bg-gradient-to-r from-brand-medium via-brand-navy to-brand-medium border border-brand-light p-6 md:p-10 rounded-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-bold uppercase tracking-widest rounded-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mughal Steel Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight text-stone-100">
            Steel Fabrication Items & Products
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Browse our comprehensive selection of CNC laser-cut gates, wrought iron scrollwork, floating staircases, and frameless glass railings. Configure custom dimensions for instant price estimates.
          </p>
        </div>

        {/* Search & Top Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-brand-navy/80 border border-brand-light p-4 rounded-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Search by code (MFG-001) or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-dark border border-brand-light px-4 py-2.5 pr-10 text-xs text-stone-100 placeholder-slate-500 rounded focus:border-brand-gold focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({[selectedCategory, selectedItem, selectedMaterial].filter(Boolean).length})</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-brand-dark border border-brand-light text-stone-200 text-xs px-3 py-2 rounded focus:border-brand-gold focus:outline-none"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Rate: Low to High</option>
                <option value="price-desc">Rate: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} bg-brand-medium/70 border border-brand-light p-6 rounded-sm space-y-6 shadow-md`}>
            <div className="flex items-center justify-between border-b border-brand-light pb-3">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-brand-gold flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter Products
              </h3>
              {(selectedCategory || selectedItem || selectedMaterial || searchTerm) && (
                <button 
                  onClick={clearAllFilters}
                  className="text-[10px] text-slate-400 hover:text-red-400 underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold uppercase text-stone-200 block">
                Project Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-brand-dark border border-brand-light text-xs text-stone-200 p-2.5 rounded focus:border-brand-gold focus:outline-none"
              >
                <option value="">All Categories ({activeCategories.length})</option>
                {activeCategories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Item Filter */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold uppercase text-stone-200 block">
                Fabrication Item
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full bg-brand-dark border border-brand-light text-xs text-stone-200 p-2.5 rounded focus:border-brand-gold focus:outline-none"
              >
                <option value="">All Items</option>
                {allItemTypes.map((it, idx) => (
                  <option key={idx} value={it}>{it}</option>
                ))}
              </select>
            </div>

            {/* Material Filter */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold uppercase text-stone-200 block">
                Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-brand-dark border border-brand-light text-xs text-stone-200 p-2.5 rounded focus:border-brand-gold focus:outline-none"
              >
                <option value="">All Materials</option>
                {allMaterials.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Try At Home Promo inside Filter */}
            <div className="p-4 bg-brand-gold/10 border border-brand-gold/30 rounded space-y-2">
              <span className="text-[10px] font-heading font-bold text-brand-gold uppercase tracking-wider block">
                Visual Tool
              </span>
              <p className="text-xs text-slate-300">
                Want to test these gate and railing designs directly on your house facade?
              </p>
              <Link 
                to="/try-at-home" 
                className="inline-flex items-center gap-1.5 text-xs text-brand-gold font-bold uppercase hover:underline pt-1"
              >
                <span>Launch Try at Home</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing <strong>{filteredProducts.length}</strong> steel fabrication products</span>
              {(selectedCategory || selectedItem || selectedMaterial || searchTerm) && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategory && (
                    <span className="bg-brand-medium text-[11px] px-2 py-0.5 rounded border border-brand-light text-brand-gold flex items-center gap-1">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedItem && (
                    <span className="bg-brand-medium text-[11px] px-2 py-0.5 rounded border border-brand-light text-brand-gold flex items-center gap-1">
                      Item: {selectedItem}
                      <button onClick={() => setSelectedItem('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="bg-brand-medium text-[11px] px-2 py-0.5 rounded border border-brand-light text-brand-gold flex items-center gap-1">
                      Query: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-brand-medium/40 border border-brand-light rounded-sm space-y-4">
                <h3 className="text-xl font-heading font-bold text-stone-200">No Matching Products Found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try clearing your search query or adjusting your category/item filters to view available steel designs.
                </p>
                <button onClick={clearAllFilters} className="btn-gold text-xs">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(prod => (
                  <div 
                    key={prod.id}
                    className="bg-brand-medium border border-brand-light rounded-sm overflow-hidden flex flex-col justify-between group hover:border-brand-gold/60 transition-all duration-300 shadow-premium"
                  >
                    {/* Image */}
                    <div className="relative h-60 overflow-hidden bg-brand-dark">
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-brand-navy/90 border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                        {prod.productCode}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 text-slate-300 text-[10px] font-heading font-semibold px-2 py-0.5 rounded">
                        {prod.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {prod.item}
                        </span>
                        <h3 className="font-heading text-sm font-bold text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                          {prod.shortDescription}
                        </p>
                        <div className="text-[11px] text-slate-300 pt-1">
                          <span className="text-slate-500">Material:</span> {prod.materials.slice(0, 2).join(', ')}
                        </div>
                      </div>

                      {/* Pricing & CTAs */}
                      <div className="pt-3 border-t border-brand-light/60 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono uppercase">Estimated Rate</span>
                            <span className="text-sm font-heading font-black text-brand-gold">
                              {formatPrice(prod.pricePerSqFt)} <span className="text-[10px] font-normal text-slate-400 font-sans">/ sq.ft</span>
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Certified 14G+
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link 
                            to={`/product/${prod.slug}`}
                            className="btn-gold text-[10px] py-2 text-center flex items-center justify-center gap-1"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>Configure</span>
                          </Link>

                          <Link 
                            to={`/try-at-home?product=${prod.productCode}`}
                            className="btn-outline text-[10px] py-2 text-center flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Try at Home</span>
                          </Link>
                        </div>

                        {/* WhatsApp Direct Inquiry Button with Image Link */}
                        <button
                          onClick={() => {
                            const rawImage = prod.frontImage || prod.images?.[0] || '';
                            const imageUrl = (rawImage.startsWith('http://') || rawImage.startsWith('https://')) ? rawImage : '';
                            const productUrl = `${window.location.origin}/#/product/${prod.slug}`;
                            const msg = `*MUGHAL STEEL PRODUCT INQUIRY*\n` +
                              `Product Code: ${prod.productCode}\n` +
                              `Name: ${prod.name}\n` +
                              `Category: ${prod.category} • ${prod.item}\n` +
                              `Estimated Rate: Rs. ${(prod.pricePerSqFt || prod.price || 0).toLocaleString()} / sq.ft\n` +
                              (imageUrl ? `🖼️ Design Photo Link: ${imageUrl}\n` : '') +
                              `🔗 Product Page: ${productUrl}\n\n` +
                              `Hello Admin, I am interested in this design. Please share details and custom quotation.`;
                            window.open(getWhatsAppUrl(msg), '_blank');
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 hover:border-emerald-400 text-[11px] font-heading font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200 rounded transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Inquire on WhatsApp (with Photo)</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
