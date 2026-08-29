import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { SEED_PROJECTS } from '../data/seedData';
import { 
  ArrowLeft, MapPin, Calendar, CheckCircle2, ShieldCheck, 
  Layers, Sparkles, MessageCircle, Eye, ArrowRight,
  X, ChevronLeft, ChevronRight, Clock, Building2, Wrench
} from 'lucide-react';
import type { PortfolioProject } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getWhatsAppUrl, projects } = useData();

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Scroll to top on load or slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const rawProjects = projects && projects.length > 0 ? projects : SEED_PROJECTS;

  // Enrich raw projects with consistent fields
  const enrichedProjects: PortfolioProject[] = (rawProjects as any[]).map((p, idx) => {
    let gallery = p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [];
    if (gallery.length === 0) {
      gallery = [
        p.image || p.coverImage || p.mainImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ];
    }

    const cleanSlug = p.slug || (p.title || `project-${p.id}`)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    return {
      id: p.id,
      title: p.title,
      slug: cleanSlug,
      category: p.category || 'Main Gates',
      shortDescription: p.shortDescription || p.description?.substring(0, 120) || 'Custom architectural steel fabrication and structural installation.',
      description: p.description || 'Custom engineered architectural steel fabrication completed with precision welding, chemical rust protection, and electrostatic powder coating.',
      location: p.location || 'Islamabad / Rawalpindi, Pakistan',
      projectType: p.projectType || (p.category?.includes('Commercial') ? 'Commercial Installation' : 'Residential Luxury Villa'),
      clientType: p.clientType || (p.category?.includes('Commercial') ? 'Commercial Developer' : 'Private Residence'),
      duration: p.duration || (idx % 2 === 0 ? '14 Days' : '21 Days'),
      materials: p.materials || 'Grade A Structural Mild Steel, CNC Laser Cut Sheet, Electrostatic Powder Coat',
      services: p.services || 'CAD Custom Design, CNC Laser Cutting, Structural Welding, On-Site Installation',
      image: p.image || p.coverImage || p.mainImageUrl || gallery[0],
      coverImage: p.coverImage || p.image || p.mainImageUrl || gallery[0],
      mainImageUrl: p.mainImageUrl || p.coverImage || p.image || gallery[0],
      galleryImages: gallery,
      completedDate: p.completedDate || '2026',
      status: p.status || (idx % 4 === 0 ? 'In Progress' : 'Completed'),
      featured: p.featured ?? true,
      specs: p.specs || {
        steelGrade: 'Grade A Structural Mild Carbon Steel',
        gauge: idx % 2 === 0 ? '14-Gauge (2.0mm) & 12-Gauge (2.5mm)' : '16-Gauge (1.6mm) High-Tensile',
        finish: idx % 2 === 0 ? 'Matte Black Electrostatic Powder Coating' : 'Antique Bronze Hand-Rubbed Patina',
        automation: idx % 3 === 0 ? 'Italian Heavy-Duty 800KG Sliding Motor' : 'Manual Concealed Roller Bearing',
        span: idx % 2 === 0 ? '14ft Width × 7.5ft Height' : '16ft Width × 8.5ft Height'
      },
      deliverables: p.deliverables || [
        'Main Driveway Grand Entrance Gate',
        'Matching Boundary Wall Security Grills',
        'Balcony Safety Railings / Balustrades',
        'Complete On-Site Laser Foundation Anchoring'
      ]
    };
  });

  // Find target project by slug or ID
  const project = enrichedProjects.find(p => 
    p.slug?.toLowerCase() === slug?.toLowerCase() || 
    p.id === slug
  );

  // Manage Lightbox Body Scroll Lock & Keyboard Events
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setLightboxOpen(false);
        } else if (e.key === 'ArrowLeft' && project?.galleryImages?.length) {
          setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : (project.galleryImages?.length || 1) - 1));
        } else if (e.key === 'ArrowRight' && project?.galleryImages?.length) {
          setActivePhotoIndex((prev) => (prev < (project.galleryImages?.length || 1) - 1 ? prev + 1 : 0));
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [lightboxOpen, project]);

  // Not Found State
  if (!project) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-brand-gold/10 text-brand-gold">
          <Building2 className="w-12 h-12" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-100 uppercase tracking-tight">
          Project Not Found
        </h1>
        <p className="text-slate-300 font-sans text-sm max-w-md mx-auto">
          The fabrication project case study you are looking for is unavailable or has been relocated.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn-gold text-xs py-3 px-6 font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </button>
        </div>
      </div>
    );
  }

  // Parse materials and services into chips if string
  const materialsList = project.materials 
    ? (Array.isArray(project.materials) ? project.materials : project.materials.split(',').map(s => s.trim()).filter(Boolean))
    : [];

  const servicesList = project.services 
    ? (Array.isArray(project.services) ? project.services : project.services.split(',').map(s => s.trim()).filter(Boolean))
    : [];

  const galleryImages = project.galleryImages && project.galleryImages.length > 0 
    ? project.galleryImages 
    : [project.image || project.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* 1. TOP BREADCRUMB / BACK NAVIGATION */}
      <div className="flex items-center justify-between gap-4 border-b border-brand-light/30 pb-4">
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-xs font-heading font-black text-brand-gold hover:text-white transition uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            Case Study Ref: <strong className="text-brand-gold">#{project.id}</strong>
          </span>
        </div>
      </div>

      {/* 2. HERO HEADER (TITLE, BADGES & LOCATION) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-brand-gold text-brand-dark text-[10px] font-mono font-black px-2.5 py-0.5 rounded uppercase">
            {project.category}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded flex items-center gap-1.5 ${
            project.status?.toLowerCase() === 'in progress'
              ? 'bg-amber-500 text-black font-black'
              : 'bg-emerald-500 text-white'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {project.status?.toUpperCase() || 'COMPLETED'}
          </span>
          {project.location && (
            <span className="text-xs text-brand-gold font-mono font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{project.location}</span>
            </span>
          )}
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-4xl text-stone-100 uppercase tracking-tight">
          {project.title}
        </h1>

        {project.shortDescription && (
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-3xl">
            {project.shortDescription}
          </p>
        )}
      </div>

      {/* 3. MAIN SHOWCASE IMAGE */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/8] w-full rounded-2xl overflow-hidden border border-brand-light/60 shadow-2xl bg-black group">
        <img 
          src={galleryImages[0]} 
          alt={`${project.title} - Main View`}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-mono font-bold text-brand-gold bg-brand-dark/95 px-3 py-1 rounded border border-brand-gold/40 shadow">
            Verified Mughal Steel Site Installation
          </span>
          <button 
            type="button"
            onClick={() => {
              setActivePhotoIndex(0);
              setLightboxOpen(true);
            }}
            className="pointer-events-auto bg-black/80 hover:bg-brand-gold hover:text-brand-dark text-stone-200 text-xs font-mono px-3 py-1 rounded transition flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Lightbox</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN CASE STUDY GRID (OVERVIEW, SPECS & INFO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Overview, Services, Materials, Deliverables */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Project Overview */}
          <div className="bg-[#080D18] p-6 rounded-2xl border border-brand-light/60 space-y-3 shadow-xl">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-brand-gold flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Project Overview & Scope</span>
            </h2>
            <p className="text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
              {project.description}
            </p>
          </div>

          {/* Services Provided (Render only if present) */}
          {servicesList.length > 0 && (
            <div className="bg-[#080D18] p-6 rounded-2xl border border-brand-light/60 space-y-3 shadow-xl">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-gold flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>Services Provided</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {servicesList.map((srv, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-[#05080E] border border-brand-light px-3 py-1.5 rounded-lg text-xs font-sans text-stone-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <span>{srv}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Materials Used (Render only if present) */}
          {materialsList.length > 0 && (
            <div className="bg-[#080D18] p-6 rounded-2xl border border-brand-light/60 space-y-3 shadow-xl">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-gold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Materials & Finishes Used</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {materialsList.map((mat, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-[#05080E] border border-brand-gold/40 px-3 py-1.5 rounded-lg text-xs font-sans text-brand-gold font-medium"
                  >
                    <span>•</span>
                    <span>{mat}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables Executed on Site (Render only if present) */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div className="bg-[#080D18] p-6 rounded-2xl border border-brand-light/60 space-y-3 shadow-xl">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-brand-gold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>On-Site Deliverables Executed</span>
              </h3>
              <ul className="space-y-2 text-slate-300 font-sans text-xs sm:text-sm">
                {project.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-gold font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Column (4 Cols): Structured Project Information Card */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#080D18] p-6 rounded-2xl border-2 border-brand-gold/40 space-y-4 shadow-xl">
            <h2 className="font-heading font-black text-xs uppercase tracking-wider text-brand-gold flex items-center gap-2 border-b border-brand-light/30 pb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Project Information</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm font-sans text-slate-300">
              {project.projectType && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Project Type:</span>
                  <span className="font-heading font-bold text-stone-100">{project.projectType}</span>
                </div>
              )}

              {project.category && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-heading font-bold text-brand-gold">{project.category}</span>
                </div>
              )}

              {project.location && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-stone-100">{project.location}</span>
                </div>
              )}

              {project.status && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-mono font-bold text-emerald-400">{project.status}</span>
                </div>
              )}

              {project.duration && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-mono font-bold text-stone-100">{project.duration}</span>
                </div>
              )}

              {project.completedDate && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Completed:</span>
                  <span className="font-mono font-bold text-brand-gold">{project.completedDate}</span>
                </div>
              )}

              {project.specs?.steelGrade && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Steel Material:</span>
                  <span className="font-mono text-stone-100 text-right">{project.specs.steelGrade}</span>
                </div>
              )}

              {project.specs?.gauge && (
                <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
                  <span className="text-slate-400">Standard Gauge:</span>
                  <span className="font-mono text-brand-gold font-bold">{project.specs.gauge}</span>
                </div>
              )}

              {project.specs?.finish && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Surface Coating:</span>
                  <span className="font-mono text-stone-100 text-right">{project.specs.finish}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mughal Steel Guarantee */}
          <div className="bg-brand-navy p-5 rounded-2xl border border-brand-gold/40 text-xs text-slate-300 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-brand-gold font-heading font-black uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>10-Year Structural Warranty</span>
            </div>
            <p className="leading-relaxed font-sans text-slate-300">
              Fabricated in full compliance with Pakistan Building Code (PBC) standards and backed by our official warranty certificate.
            </p>
          </div>

        </div>

      </div>

      {/* 5. PROJECT GALLERY (RESPONSIVE GRID: 3 cols desktop, 2 cols tablet, 1 col mobile) */}
      <div className="space-y-4 pt-4 border-t border-brand-light/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-heading font-black text-lg sm:text-xl text-stone-100 uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>Project Multi-Angle Gallery</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Click any photo to open high-resolution full screen image viewer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActivePhotoIndex(idx);
                setLightboxOpen(true);
              }}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-light/60 hover:border-brand-gold transition-all duration-300 bg-black cursor-pointer shadow-lg"
            >
              <img 
                src={imgUrl} 
                alt={`${project.title} - Angle ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-brand-gold text-brand-dark px-3 py-1.5 rounded text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Photo</span>
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-stone-300 pointer-events-none">
                Photo {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DISCUSS A SIMILAR PROJECT / CONSULTATION CTA (NO DIRECT BUY/ORDER) */}
      <div className="bg-gradient-to-r from-[#080D18] via-brand-navy to-[#080D18] border-2 border-brand-gold/50 p-8 sm:p-10 rounded-2xl text-center space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 text-brand-gold text-xs font-mono font-bold uppercase rounded-full">
          Custom Fabrication Consultation
        </div>
        <h3 className="font-heading text-xl sm:text-3xl font-black text-stone-100 uppercase tracking-tight">
          Have a similar project in mind?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
          Let's discuss your custom fabrication requirements. Our structural engineering team handles design, laser cutting, welding, powder coating, and turnkey installation.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href={getWhatsAppUrl(`Hello Mughal Steel Team, I am interested in discussing a similar project to:\n\nProject: ${project.title}\nCategory: ${project.category}\nLocation: ${project.location}\n\nPlease share details regarding design options and estimated quotation.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-navy text-xs py-3 px-6 font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Discuss a Similar Project</span>
          </a>

          <Link
            to="/quote"
            className="btn-gold text-xs py-3 px-6 font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <span>Request a Custom Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/try-at-home"
            className="btn-outline text-xs py-3 px-5 font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-brand-gold" />
            <span>Test on House Photo</span>
          </Link>
        </div>
      </div>

      {/* 7. LIGHTWEIGHT IMAGE LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button & Image Counter */}
            <div className="w-full flex items-center justify-between pb-3 text-stone-200">
              <span className="font-mono text-xs text-brand-gold font-bold">
                {project.title} • Photo {activePhotoIndex + 1} of {galleryImages.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Lightbox Image */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-brand-light/60 shadow-2xl">
              <img 
                src={galleryImages[activePhotoIndex]} 
                alt={`${project.title} view ${activePhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain" 
              />

              {/* Prev Button */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                  }}
                  className="absolute left-3 w-10 h-10 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white flex items-center justify-center transition cursor-pointer shadow-lg"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-3 w-10 h-10 rounded-full bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white flex items-center justify-center transition cursor-pointer shadow-lg"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-3 max-w-full">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activePhotoIndex === idx ? 'border-brand-gold scale-105 shadow-glow-gold' : 'border-stone-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
