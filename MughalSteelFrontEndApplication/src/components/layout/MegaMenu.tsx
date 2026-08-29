import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { PROJECT_CATEGORIES_DATA } from '../../data/seedData';
import { 
  ArrowRight, Sparkles, Calculator, ShieldCheck, 
  DoorClosed, Grid, Layers, Eye, CheckCircle2, 
  Phone, MessageCircle, FileText, HelpCircle, Star, X,
  Cog, Package, Shield, Wrench, Home, Building2, Landmark,
  Warehouse, Trees, Hammer, Compass, Award
} from 'lucide-react';

interface MegaMenuProps {
  type: 'categories' | 'items' | 'services' | 'more' | null;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ type, onClose, onMouseEnter, onMouseLeave }) => {
  const { categories: contextCategories } = useData();
  const activeCategories = (contextCategories && contextCategories.length > 0) ? contextCategories : PROJECT_CATEGORIES_DATA;

  if (!type) return null;

  return (
    <div 
      className="absolute top-full left-0 right-0 w-full bg-[#080D16] border-b-2 border-brand-gold shadow-[0_25px_50px_rgba(0,0,0,0.95)] z-[100] text-stone-100 animate-fade-in before:absolute before:-top-3 before:h-3 before:w-full before:left-0 before:content-['']"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave || onClose}
      style={{ backgroundColor: '#080D16', opacity: 1 }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        
        {/* ======================================================== */}
        {/* 1. PORTFOLIO / 10 PROJECT CATEGORIES (SOLID OPAQUE & TEXT-FOCUSED) */}
        {/* ======================================================== */}
        {type === 'categories' && (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-brand-gold" />
                <span className="font-heading font-black text-xs sm:text-sm text-brand-gold uppercase tracking-wider">
                  PROJECT CATEGORIES DIRECTORY
                </span>
                <span className="hidden sm:inline text-slate-300 text-xs font-sans">
                  • {activeCategories.length} Dedicated Architectural Categories
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link 
                  to="/categories" 
                  onClick={onClose}
                  className="text-[11px] font-heading font-bold text-brand-gold hover:underline flex items-center gap-1 uppercase tracking-wide"
                >
                  <span>View All {activeCategories.length} Categories</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button 
                  type="button"
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  aria-label="Close directory"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Solid Opaque Category Cards (Dynamic Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {activeCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  onClick={onClose}
                  className="group bg-[#0D1524] border border-slate-700 hover:border-brand-gold rounded-md p-2.5 transition-all duration-200 shadow-md flex flex-col justify-between hover:bg-[#121D32]"
                  style={{ backgroundColor: '#0D1524' }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-heading font-bold text-stone-100 group-hover:text-brand-gold transition-colors uppercase truncate">
                        {cat.name}
                      </h4>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-300 font-sans line-clamp-1">
                      {cat.tagline || 'Custom architectural fabrication'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-700/80 text-[9.5px] font-mono">
                    <span className="text-brand-gold font-bold">{cat.items.length} Items</span>
                    <span className="text-slate-400 truncate max-w-[90px]">{cat.items[0]}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Compact Solid Action Strip */}
            <div 
              className="px-3.5 py-2 bg-[#0A101C] rounded border border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs"
              style={{ backgroundColor: '#0A101C' }}
            >
              <span className="text-slate-200 text-[11px] font-sans font-medium">
                Want to see custom fabrication elevations engineered for your home?
              </span>
              <div className="flex items-center gap-3">
                <Link 
                  to="/try-at-home" 
                  onClick={onClose}
                  className="text-brand-gold hover:underline font-bold flex items-center gap-1 uppercase tracking-wider text-[11px]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Try on House Photo →</span>
                </Link>
                <span className="text-slate-600">|</span>
                <Link 
                  to="/quote" 
                  onClick={onClose}
                  className="text-white hover:text-brand-gold font-bold uppercase tracking-wider text-[11px]"
                >
                  <span>Fast Quote →</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. PRODUCTS / COMPLETE CATALOG (SOLID OPAQUE & TEXT-FOCUSED) */}
        {/* ======================================================== */}
        {type === 'items' && (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-gold" />
                <span className="font-heading font-black text-xs sm:text-sm text-brand-gold uppercase tracking-wider">
                  PRODUCTS CATALOG
                </span>
                <span className="hidden sm:inline text-slate-300 text-xs font-sans">
                  • 30+ Heavy Gauge Masterpieces
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link 
                  to="/items" 
                  onClick={onClose}
                  className="btn-gold text-[10px] py-1 px-2.5 font-bold uppercase"
                >
                  <span>Browse All Products</span>
                </Link>
                <button 
                  type="button"
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  aria-label="Close catalog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5 Solid Product Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              
              {/* Column 1: Gates */}
              <div className="bg-[#0D1524] border border-slate-700 rounded-md p-2.5 space-y-1.5" style={{ backgroundColor: '#0D1524' }}>
                <h4 className="font-heading font-bold text-xs text-brand-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1">
                  <Grid className="w-3 h-3" />
                  <span>Gates</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-200 font-sans font-medium">
                  <li><Link to="/items?item=Main+Gates" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Main Driveway Gates</Link></li>
                  <li><Link to="/items?item=Front+Gates" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Front Security Gates</Link></li>
                  <li><Link to="/items?item=Main+Gates" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Automated Sliding Gates</Link></li>
                  <li><Link to="/items?category=Modern+Home" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ CNC Laser Villa Gates</Link></li>
                  <li><Link to="/items?category=Farm" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Heavy Estate Gates</Link></li>
                </ul>
              </div>

              {/* Column 2: Doors */}
              <div className="bg-[#0D1524] border border-slate-700 rounded-md p-2.5 space-y-1.5" style={{ backgroundColor: '#0D1524' }}>
                <h4 className="font-heading font-bold text-xs text-brand-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1">
                  <DoorClosed className="w-3 h-3" />
                  <span>Doors</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-200 font-sans font-medium">
                  <li><Link to="/items?item=Doors" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Steel Security Doors</Link></li>
                  <li><Link to="/items?category=Classical+Home" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Wrought Iron Doors</Link></li>
                  <li><Link to="/items?item=Doors" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Heavy Pivot Entrance Doors</Link></li>
                  <li><Link to="/items?item=Doors" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Decorative Laser Doors</Link></li>
                  <li><Link to="/items?item=Doors" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Double Leaf Doors</Link></li>
                </ul>
              </div>

              {/* Column 3: Windows & Grills */}
              <div className="bg-[#0D1524] border border-slate-700 rounded-md p-2.5 space-y-1.5" style={{ backgroundColor: '#0D1524' }}>
                <h4 className="font-heading font-bold text-xs text-brand-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1">
                  <Grid className="w-3 h-3" />
                  <span>Windows & Grills</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-200 font-sans font-medium">
                  <li><Link to="/items?item=Windows" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Architectural Windows</Link></li>
                  <li><Link to="/items?item=Grills" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Window Security Grills</Link></li>
                  <li><Link to="/items?item=Boundary+Wall+Grills" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Boundary Wall Grills</Link></li>
                  <li><Link to="/items?item=Windows" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ French Sliding Windows</Link></li>
                  <li><Link to="/items?item=Grills" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Louver Pipe Grills</Link></li>
                </ul>
              </div>

              {/* Column 4: Railings & Stairs */}
              <div className="bg-[#0D1524] border border-slate-700 rounded-md p-2.5 space-y-1.5" style={{ backgroundColor: '#0D1524' }}>
                <h4 className="font-heading font-bold text-xs text-brand-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1">
                  <Layers className="w-3 h-3" />
                  <span>Railings & Stairs</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-200 font-sans font-medium">
                  <li><Link to="/items?item=Balcony+Railing" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Balcony Railings</Link></li>
                  <li><Link to="/items?item=Stair+Railing" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Stair Safety Railings</Link></li>
                  <li><Link to="/items?item=Stair+Railing" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Spiral Steel Stairs</Link></li>
                  <li><Link to="/items?item=Railing" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Tempered Glass Balustrades</Link></li>
                  <li><Link to="/items?item=Railing" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Classical Gold Crest Railings</Link></li>
                </ul>
              </div>

              {/* Column 5: Partitions, Sheds & Glass */}
              <div className="bg-[#0D1524] border border-slate-700 rounded-md p-2.5 space-y-1.5" style={{ backgroundColor: '#0D1524' }}>
                <h4 className="font-heading font-bold text-xs text-brand-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Partitions & Sheds</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-200 font-sans font-medium">
                  <li><Link to="/items?item=Aluminum+%26+Glass+Partitions" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Soundproof Partitions</Link></li>
                  <li><Link to="/categories/aluminum-glass" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Frameless Pivot Glass Doors</Link></li>
                  <li><Link to="/items?item=Sheds+%26+Canopies" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Car Porch Pergolas</Link></li>
                  <li><Link to="/items?item=Sheds+%26+Canopies" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Rooftop Steel Sheds</Link></li>
                  <li><Link to="/categories/aluminum-glass" onClick={onClose} className="hover:text-brand-gold transition-colors flex items-center gap-1">▸ Commercial Store Facades</Link></li>
                </ul>
              </div>

            </div>

            {/* Compact Solid Action Strip */}
            <div 
              className="px-3.5 py-2 bg-[#0A101C] rounded border border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs"
              style={{ backgroundColor: '#0A101C' }}
            >
              <div className="flex items-center gap-1.5 font-mono text-slate-300 text-[11px]">
                <Calculator className="w-3.5 h-3.5 text-brand-gold" />
                <span>Price Formula: Area (Width × Height) × Rate/sq.ft = Estimate</span>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/try-at-home" onClick={onClose} className="text-brand-gold hover:underline font-bold uppercase text-[11px]">
                  <span>Try on House Photo →</span>
                </Link>
                <span className="text-slate-600">|</span>
                <Link to="/cart" onClick={onClose} className="text-white hover:text-brand-gold font-bold uppercase text-[11px]">
                  <span>View Quotation Cart →</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}


        {/* ======================================================== */}
        {/* 4. COMPANY & ASSURANCE (SOLID OPAQUE & TEXT-FOCUSED) */}
        {/* ======================================================== */}
        {type === 'more' && (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-gold" />
                <span className="font-heading font-black text-xs sm:text-sm text-brand-gold uppercase tracking-wider">
                  COMPANY & ASSURANCE
                </span>
                <span className="hidden sm:inline text-slate-300 text-xs font-sans">
                  • Mughal Steel Fabrication • Rawalpindi & Islamabad
                </span>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Solid Columns Wide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <Link to="/about" onClick={onClose} className="p-2.5 bg-[#0D1524] border border-slate-700 hover:border-brand-gold rounded-md transition-all group space-y-1 hover:bg-[#121D32]" style={{ backgroundColor: '#0D1524' }}>
                <span className="text-[9px] font-mono text-brand-gold font-bold uppercase">Heritage</span>
                <h4 className="font-heading font-bold text-xs text-stone-100 group-hover:text-brand-gold uppercase">About Mughal Steel</h4>
                <p className="text-[10.5px] text-slate-300 font-sans">30+ years workshop heritage and engineering excellence.</p>
              </Link>

              <Link to="/reviews" onClick={onClose} className="p-2.5 bg-[#0D1524] border border-slate-700 hover:border-brand-gold rounded-md transition-all group space-y-1 hover:bg-[#121D32]" style={{ backgroundColor: '#0D1524' }}>
                <span className="text-[9px] font-mono text-brand-gold font-bold uppercase flex items-center gap-1"><Star className="w-3 h-3 fill-brand-gold" /> Verified</span>
                <h4 className="font-heading font-bold text-xs text-stone-100 group-hover:text-brand-gold uppercase">Client Reviews</h4>
                <p className="text-[10.5px] text-slate-300 font-sans">5.0-star rating across 500+ residential & commercial builds.</p>
              </Link>

              <Link to="/warranty" onClick={onClose} className="p-2.5 bg-[#0D1524] border border-slate-700 hover:border-brand-gold rounded-md transition-all group space-y-1 hover:bg-[#121D32]" style={{ backgroundColor: '#0D1524' }}>
                <span className="text-[9px] font-mono text-brand-gold font-bold uppercase">Assurance</span>
                <h4 className="font-heading font-bold text-xs text-stone-100 group-hover:text-brand-gold uppercase">10-Year Warranty</h4>
                <p className="text-[10.5px] text-slate-300 font-sans">Structural guarantee and active zinc primer coverage.</p>
              </Link>

              <Link to="/terms" onClick={onClose} className="p-2.5 bg-[#0D1524] border border-slate-700 hover:border-brand-gold rounded-md transition-all group space-y-1 hover:bg-[#121D32]" style={{ backgroundColor: '#0D1524' }}>
                <span className="text-[9px] font-mono text-brand-gold font-bold uppercase">Standards</span>
                <h4 className="font-heading font-bold text-xs text-stone-100 group-hover:text-brand-gold uppercase">Transparent Rates</h4>
                <p className="text-[10.5px] text-slate-300 font-sans">Square footage calculation and laser surveying invariants.</p>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
