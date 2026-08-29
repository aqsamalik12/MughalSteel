import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECT_CATEGORIES_DATA } from '../data/seedData';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  ArrowRight, Sparkles, MessageCircle, Calculator, 
  Ruler, Eye, CheckCircle2, Filter, Compass
} from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { categorySlug, category: routeCategoryParam } = useParams<{ categorySlug?: string; category?: string }>();
  const activeSlugOrName = routeCategoryParam || categorySlug || '';
  const { products, getWhatsAppUrl, categories } = useData();
  const { formatPrice } = useCurrency();
  const [selectedItemFilter, setSelectedItemFilter] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSlugOrName]);

  const activeCategories = (categories && categories.length > 0) ? categories : PROJECT_CATEGORIES_DATA;
  const category = activeCategories.find(c => {
    const slugNorm = c.slug.toLowerCase().trim();
    const paramNorm = activeSlugOrName.toLowerCase().trim();
    const nameNorm = c.name.toLowerCase().trim();
    const nameSlug = nameNorm.replace(/\s+/g, '-');
    return slugNorm === paramNorm || nameSlug === paramNorm || nameNorm === paramNorm || c.id.toLowerCase() === paramNorm;
  }) || activeCategories[0];

  // 16 Standard Category Items
  const categoryItems = [
    { name: 'Front Gate', link: `/items?item=Front+Gates&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Front Balcony', link: `/items?item=Balcony+Railing&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Louver Pipes', link: `/items?item=Grills&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80' },
    { name: 'Duct Pipe Covers', link: `/items?item=Boundary+Wall+Grills&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80' },
    { name: 'Gate Gridding', link: `/items?item=Main+Gates&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Spiral Stairs', link: `/items?item=Stair+Railing&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=500&q=80' },
    { name: 'Indoor Iron Stairs', link: `/items?item=Stair+Railing&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Railings', link: `/items?item=Railing&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80' },
    { name: 'Front Shade', link: `/items?item=Sheds+%26+Canopies&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80' },
    { name: 'Top Roof Shade', link: `/items?item=Sheds+%26+Canopies&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80' },
    { name: 'Interior Partitions', link: `/items?item=Aluminum+%26+Glass+Partitions&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Pivot Doors', link: `/items?item=Doors&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=80' },
    { name: 'Garden Benches', link: `/items?item=Steel+Structures&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80' },
    { name: 'Rooftop Shed', link: `/items?item=Sheds+%26+Canopies&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Cladding Works', link: `/items?item=Steel+Structures&category=${encodeURIComponent(category.name)}`, image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=500&q=80' },
    { name: 'More Items', link: `/items?category=${encodeURIComponent(category.name)}`, isMoreButton: true }
  ];

  // Filter products by category
  const categoryProducts = products.filter(p => {
    const pCat = p.category.toLowerCase().trim();
    const cName = category.name.toLowerCase().trim();
    const cSlug = category.slug.toLowerCase().trim();
    return pCat === cName || pCat.includes(cName) || cName.includes(pCat) || pCat.replace(/\s+/g, '-') === cSlug;
  });
  
  // Filter by selected item if specified
  const filteredProducts = selectedItemFilter === 'all' 
    ? (categoryProducts.length > 0 ? categoryProducts : products.slice(0, 8))
    : categoryProducts.filter(p => p.item.toLowerCase() === selectedItemFilter.toLowerCase() || p.name.toLowerCase().includes(selectedItemFilter.toLowerCase()));

  const whatsappCategoryInquiry = getWhatsAppUrl(
    `*MUGHAL STEEL CATEGORY INQUIRY*\n` +
    `Collection: ${category.name}\n` +
    `Description: ${category.tagline}\n` +
    `🖼️ Category Image: ${category.heroImage}\n` +
    `🔗 Page Link: ${window.location.origin}/#/categories/${category.slug}\n\n` +
    `Hello Mughal Steel Fabrication, I am interested in your ${category.name} designs. Please share the catalogue and price estimates.`
  );



  return (
    <div className="bg-brand-dark min-h-screen text-stone-100 animate-fade-in">
      
      {/* 1. CATEGORY HEADER BANNER (LEFT TEXT + RIGHT VILLA PHOTO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-4">
        <div className="bg-brand-navy/90 border border-brand-gold/30 rounded-t-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl overflow-hidden relative">
          
          {/* Left Details */}
          <div className="space-y-3 max-w-xl z-10">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <Link to="/" className="hover:text-brand-gold">Home</Link>
              <span>&gt;</span>
              <Link to="/categories" className="hover:text-brand-gold">Project Categories</Link>
              <span>&gt;</span>
              <span className="text-brand-gold font-bold">{category.name}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
              {category.name}
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
              {category.tagline || 'Elegant & modern steel fabrication solutions for your dream home.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link 
                to={`/try-at-home?category=${encodeURIComponent(category.name)}`}
                className="btn-gold text-xs py-2 px-4"
              >
                <Eye className="w-4 h-4" />
                <span>Try on Your House Photo</span>
              </Link>

              <a 
                href={whatsappCategoryInquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs py-2 px-4"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Right Villa Elevation Photo */}
          <div className="w-full md:w-80 lg:w-96 aspect-[16/9] rounded overflow-hidden border border-brand-gold/40 shadow-xl shrink-0">
            <img 
              src={category.heroImage} 
              alt={category.name} 
              className="w-full h-full object-cover" 
            />
          </div>

        </div>
      </section>

      {/* 2. 16 ITEMS GRID IN WHITE PANEL (MATCHING BLUEPRINT IMAGE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12">
        <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-lg p-6 sm:p-8 shadow-inner space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-heading font-bold text-slate-800 uppercase tracking-wide">
              {category.name} Fabrication Items
            </h2>
            <span className="text-[11px] text-slate-500 font-sans">
              Click any item to view custom designs & size calculators
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {categoryItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="group flex flex-col items-center text-center space-y-2.5 p-2 rounded-lg hover:bg-slate-100/80 transition-all duration-300"
              >
                {item.isMoreButton ? (
                  <div className="w-full aspect-[4/3] rounded-xl border border-slate-300/80 bg-slate-100 flex flex-col items-center justify-center space-y-1 group-hover:border-brand-gold group-hover:bg-brand-navy/10 transition-all shadow-sm">
                    <div className="flex gap-1 text-slate-500 group-hover:text-brand-gold">
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-current"></span>
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-current"></span>
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-current"></span>
                    </div>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 group-hover:text-brand-dark pt-1">
                      More Items
                    </span>
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-brand-gold/60 transition-all">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}

                <span className="font-heading font-bold text-xs sm:text-[13px] text-slate-800 group-hover:text-brand-gold transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATALOG DESIGNS FOR THIS CATEGORY */}
      {filteredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-light pb-3">
            <h3 className="text-lg font-heading font-black text-stone-100 uppercase tracking-wide">
              Featured {category.name} Catalog Products
            </h3>
            <Link to="/items" className="text-xs text-brand-gold font-bold hover:underline">
              View Complete Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((prod) => (
              <div 
                key={prod.id}
                className="group bg-brand-medium border border-brand-light rounded-sm overflow-hidden hover:border-brand-gold/60 transition-all flex flex-col shadow-md"
              >
                <Link to={`/product/${prod.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-brand-dark block">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2.5 left-2.5 bg-brand-navy/90 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-gold/30">
                    {prod.productCode}
                  </div>
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-heading font-bold uppercase text-slate-400 block tracking-wider">
                      {prod.item}
                    </span>
                    <Link to={`/product/${prod.slug}`}>
                      <h4 className="font-heading font-bold text-xs text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1 uppercase">
                        {prod.name}
                      </h4>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-brand-light/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Rate:</span>
                      <span className="text-xs font-heading font-bold text-brand-gold font-mono">
                        {formatPrice(prod.pricePerSqFt)} / sq.ft
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/product/${prod.slug}`} className="btn-gold text-[10px] py-1.5 text-center">
                        <Calculator className="w-3 h-3" />
                        <span>Quote</span>
                      </Link>
                      <Link to={`/try-at-home?product=${prod.productCode}`} className="btn-outline text-[10px] py-1.5 text-center">
                        <Eye className="w-3 h-3 text-brand-gold" />
                        <span>Try On</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
