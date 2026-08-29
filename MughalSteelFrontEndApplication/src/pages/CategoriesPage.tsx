import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PROJECT_CATEGORIES_DATA } from '../data/seedData';
import { ArrowRight, Compass, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories: contextCategories } = useData();
  const activeCategories = (contextCategories && contextCategories.length > 0) ? contextCategories : PROJECT_CATEGORIES_DATA;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL PORTFOLIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            {activeCategories.length} PROJECT CATEGORIES
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
            Every property has distinct architectural requirements. Explore our dedicated categories to see custom fabrication systems engineered specifically for your building style.
          </p>
        </div>

        {/* Categories Grid - Dynamic & Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activeCategories.map((cat) => (
            <div 
              key={cat.id}
              className="bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-brand-gold/80 transition-all duration-300 shadow-lg hover:shadow-glow-gold/10"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img 
                  src={cat.heroImage} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-heading font-black text-stone-100 group-hover:text-brand-gold transition-colors uppercase leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-sans line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="pt-2 border-t border-brand-light/40">
                    <div className="flex flex-wrap gap-1">
                      {cat.items.slice(0, 4).map((it, i) => (
                        <span 
                          key={i} 
                          className="text-[9px] bg-brand-dark text-slate-300 px-2 py-0.5 rounded border border-brand-light/60 font-mono"
                        >
                          {it}
                        </span>
                      ))}
                      {cat.items.length > 4 && (
                        <span className="text-[9px] bg-brand-dark text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30 font-mono font-bold">
                          +{cat.items.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-light/40 flex items-center justify-between">
                  <Link 
                    to={`/try-at-home?category=${encodeURIComponent(cat.name)}`}
                    className="text-[11px] text-brand-gold hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Try on Home</span>
                  </Link>

                  <Link 
                    to={`/categories/${cat.slug}`}
                    className="btn-gold text-[10px] py-1.5 px-3 font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>View Category</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
