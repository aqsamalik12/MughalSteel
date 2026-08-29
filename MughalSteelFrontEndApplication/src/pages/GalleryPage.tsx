import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEED_PROJECTS, PROJECT_CATEGORIES_DATA } from '../data/seedData';
import { useData } from '../context/DataContext';
import { Sparkles, MapPin, Eye, MessageCircle, ArrowRight, Filter } from 'lucide-react';
import { useSEO } from '../utils/useSEO';

export const GalleryPage: React.FC = () => {
  useSEO({
    title: 'Steel Fabrication Portfolio & Visual Gallery | Mughal Steel Fabrication',
    description: 'Explore high-resolution multi-angle photography of completed luxury gates, stainless steel railings, boundary grills, and custom architectural fabrication.',
    keywords: 'Steel fabrication gallery, metalwork portfolio Pakistan, modern gate pictures, railing designs gallery',
    url: '/gallery'
  });

  const { getWhatsAppUrl, categories, projects } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const allProjects = (projects && projects.length > 0) ? projects : SEED_PROJECTS;
  const activeCategories = (categories && categories.length > 0) ? categories : PROJECT_CATEGORIES_DATA;
  const [lightboxProject, setLightboxProject] = useState<any | null>(null);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? allProjects
    : allProjects.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-brand-dark min-h-screen text-stone-100 py-12 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-bold uppercase tracking-widest rounded-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fabrication Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            Architectural Project Gallery
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Browse our photo gallery of CNC laser cut gates, wrought iron scrollwork, floating stairs, and glass balustrades installed in luxury residences and commercial properties across Pakistan.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-brand-light pb-6">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-sm text-xs font-heading font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-brand-gold text-brand-dark font-bold shadow-glow-gold'
                : 'bg-brand-medium text-slate-300 hover:text-white border border-brand-light'
            }`}
          >
            All Projects ({allProjects.length})
          </button>

          {activeCategories.map((cat) => {
            const count = allProjects.filter(p => p.category === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-sm text-xs font-heading font-semibold transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-brand-gold text-brand-dark font-bold shadow-glow-gold'
                    : 'bg-brand-medium text-slate-300 hover:text-white border border-brand-light'
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <div 
              key={proj.id}
              onClick={() => setLightboxProject(proj)}
              className="bg-brand-medium border border-brand-light rounded-sm overflow-hidden flex flex-col justify-between group hover:border-brand-gold/60 transition-all duration-300 shadow-premium cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden bg-brand-dark">
                <img 
                  src={proj.image} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-3 left-3 bg-brand-navy/90 border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                  {proj.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-brand-gold font-heading font-bold flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>View Project Details</span>
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-stone-100 group-hover:text-brand-gold transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mt-1">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-light/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-brand-gold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{proj.location}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{proj.completedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxProject && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-brand-medium border border-brand-light rounded-sm max-w-2xl w-full overflow-hidden space-y-4 shadow-2xl">
              <div className="relative h-80 bg-brand-dark">
                <img src={lightboxProject.image} alt={lightboxProject.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setLightboxProject(null)}
                  className="absolute top-3 right-3 p-2 bg-black/80 hover:bg-black text-stone-200 hover:text-white rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-brand-gold font-bold">{lightboxProject.category}</span>
                  <h3 className="font-heading text-xl font-bold text-stone-100">{lightboxProject.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{lightboxProject.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-brand-light/60 text-xs">
                  <span className="text-slate-400">Location: <strong>{lightboxProject.location}</strong></span>
                  <div className="flex gap-2">
                    <a 
                      href={getWhatsAppUrl(`Hello Mughal Steel, I am interested in a design similar to your completed project: ${lightboxProject.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp text-xs py-2 px-3"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Quote</span>
                    </a>
                    <Link to="/try-at-home" className="btn-gold text-xs py-2 px-3">
                      <span>Try on Home</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
