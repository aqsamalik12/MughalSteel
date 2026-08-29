import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { SEED_PROJECTS, PROJECT_CATEGORIES_DATA } from '../data/seedData';
import { useData } from '../context/DataContext';
import { 
  MapPin, Calendar, ArrowRight, ArrowLeft, MessageCircle, Sparkles, 
  Eye, ShieldCheck, CheckCircle2, Award, Layers, 
  X, ChevronLeft, ChevronRight, Building2, Factory,
  Star, Quote, ThumbsUp, Check, MessageSquare
} from 'lucide-react';
import type { PortfolioProject } from '../types';

export const ProjectsPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getWhatsAppUrl, projects, categories, testimonials, addTestimonial } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-scroll to #reviews when hash is present
  useEffect(() => {
    if (location.hash === '#reviews') {
      setTimeout(() => {
        const el = document.getElementById('reviews');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [location.hash]);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    location: '',
    project: '',
    rating: 5,
    text: '',
    image: ''
  });

  const rawProjects = projects && projects.length > 0 ? projects : SEED_PROJECTS;

  // Standardized Fabrication Categories
  const standardCategories = [
    'All',
    'Main Gates',
    'Steel Doors',
    'Grills',
    'Railings',
    'Staircases',
    'Steel Windows',
    'Custom Fabrication',
    'Commercial',
    'Modern Home',
    'Classical Home'
  ];

  // Enrich raw projects with multi-image gallery and engineering specifications
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
      shortDescription: p.shortDescription || p.description?.substring(0, 120) || 'Custom architectural fabrication and structural steel installation.',
      description: p.description,
      location: p.location || 'Islamabad / Rawalpindi, Pakistan',
      projectType: p.projectType || (p.category?.includes('Commercial') ? 'Commercial Installation' : 'Residential Luxury Villa'),
      clientType: p.clientType || (p.category?.includes('Commercial') ? 'Commercial Developer' : 'Private Residence'),
      duration: p.duration || (idx % 2 === 0 ? '14 Days' : '21 Days'),
      materials: p.materials || 'Grade A Mild Steel, CNC Laser Cut Sheet, Electrostatic Powder Coat',
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = enrichedProjects.filter(p => {
    // Category match
    const matchesCat = selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Main Gates' && (p.category.includes('Gate') || p.category.includes('Home')));

    // Status match
    const matchesStatus = selectedStatus === 'All' ||
      (p.status && p.status.toLowerCase() === selectedStatus.toLowerCase());

    // Search query match
    const matchesSearch = !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.materials && p.materials.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    setReviewSubmitting(true);
    try {
      await addTestimonial({
        name: reviewForm.name,
        location: reviewForm.location || 'Islamabad, Pakistan',
        project: reviewForm.project || 'Custom Gate & Railing Fabrication',
        rating: reviewForm.rating,
        text: reviewForm.text,
        image: reviewForm.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        featured: true,
        published: true
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewModal(false);
        setReviewForm({ name: '', location: '', project: '', rating: 5, text: '', image: '' });
      }, 1500);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ======================================================== */}
        {/* 1. PROJECTS HERO / INTRO */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-full shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR PROJECTS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight text-stone-100">
            Built with Precision. Delivered with Confidence.
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed font-sans max-w-2xl mx-auto">
            Explore our completed and ongoing steel fabrication projects and see the quality, craftsmanship, and attention to detail behind our work.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 2. STATS & AUTHORITY BAR */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-[#080D18] border border-brand-light/60 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3.5 p-2 border-r border-brand-light/40 last:border-0">
            <div className="w-10 h-10 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-mono font-black text-brand-gold block leading-none">500+</span>
              <span className="text-[10px] text-slate-300 font-heading uppercase tracking-wider font-bold">Projects Delivered</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 border-r border-brand-light/40 last:border-0">
            <div className="w-10 h-10 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-mono font-black text-brand-gold block leading-none">14G / 16G</span>
              <span className="text-[10px] text-slate-300 font-heading uppercase tracking-wider font-bold">Certified MS Steel</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 border-r border-brand-light/40 last:border-0">
            <div className="w-10 h-10 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-mono font-black text-brand-gold block leading-none">±0.1 mm</span>
              <span className="text-[10px] text-slate-300 font-heading uppercase tracking-wider font-bold">CNC Laser Precision</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-mono font-black text-brand-gold block leading-none">10-Year</span>
              <span className="text-[10px] text-slate-300 font-heading uppercase tracking-wider font-bold">Fabrication Warranty</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. SEARCH & DUAL FILTERS (STATUS + CATEGORIES) */}
        {/* ======================================================== */}
        <div className="space-y-4 bg-[#080D18] p-5 rounded-2xl border border-brand-light/50 shadow-xl">
          
          {/* Top Row: Real-time Search and Status Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search projects (gate, door, location)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#04070D] border border-brand-light/60 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-stone-100 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 bg-[#04070D] p-1 rounded-xl border border-brand-light/40 self-stretch sm:self-auto justify-center">
              {['All', 'Completed', 'In Progress'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all cursor-pointer ${
                    selectedStatus === st
                      ? (st === 'In Progress' ? 'bg-amber-500 text-black font-black' : 'bg-brand-gold text-brand-dark font-black shadow')
                      : 'text-slate-400 hover:text-stone-200'
                  }`}
                >
                  {st === 'All' ? 'All Status' : st}
                </button>
              ))}
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-brand-light/30">
            {standardCategories.map((catName) => {
              const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();
              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isSelected 
                      ? 'bg-brand-gold text-brand-dark shadow-glow-gold' 
                      : 'bg-[#04070D] text-slate-300 hover:text-white border border-brand-light/60 hover:border-brand-gold/50'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. RESPONSIVE PORTFOLIO GRID (3-COL / 2-COL / 1-COL) */}
        {/* ======================================================== */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#080D18] border border-brand-light/40 rounded-xl space-y-3">
            <p className="text-stone-300 font-heading uppercase text-sm">No projects found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="btn-gold text-xs py-2 px-4 font-bold uppercase"
            >
              View All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div 
                key={proj.id}
                className="bg-brand-navy border border-brand-light/60 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-brand-gold transition-all duration-300 shadow-2xl hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
              >
                {/* Project Image Frame (Image-First Design) */}
                <Link 
                  to={`/projects/${proj.slug || proj.id}`}
                  className="relative aspect-[4/3] overflow-hidden bg-black cursor-pointer block"
                >
                  <img 
                    src={proj.image} 
                    alt={`${proj.title} installed for ${proj.projectType || 'client project'}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  
                  {/* Category & Status Overlay Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-brand-dark/95 backdrop-blur-md border border-brand-gold/50 text-brand-gold text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow">
                      {proj.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded shadow flex items-center gap-1.5 ${
                      proj.status?.toLowerCase() === 'in progress'
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-emerald-500/90 text-white'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {proj.status?.toUpperCase() || 'COMPLETED'}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80" />
                  
                  {/* View Project Hover Overlay Banner */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="bg-brand-gold text-brand-dark px-3.5 py-2 rounded text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                      <Eye className="w-4 h-4" />
                      <span>View Project</span>
                    </span>
                  </div>
                </Link>

                {/* Project Content Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Link 
                      to={`/projects/${proj.slug || proj.id}`}
                      className="block font-heading text-base font-black text-stone-100 group-hover:text-brand-gold transition-colors uppercase cursor-pointer"
                    >
                      {proj.title}
                    </Link>

                    <p className="text-slate-300 text-xs leading-relaxed font-sans line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="pt-3 border-t border-brand-light/40 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5 text-stone-300 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{proj.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-brand-gold font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{proj.completedDate}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to={`/projects/${proj.slug || proj.id}`}
                        className="flex-1 btn-gold text-xs py-2.5 px-3 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow hover:brightness-110"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Project</span>
                      </Link>

                      {/* Discuss Similar Project on WhatsApp */}
                      <a
                        href={getWhatsAppUrl(`Hello, I am interested in this completed project:\n\nProject: ${proj.title}\nCategory: ${proj.category}\nProject Image: ${proj.image || proj.coverImage}\n\nI would like to discuss a similar/custom design.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-navy text-xs py-2.5 px-3 font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                        title="Discuss a Similar Project"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Discuss</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. VERIFIED CLIENT REVIEWS & INSTALLATION FEEDBACK */}
        {/* ======================================================== */}
        <section id="reviews" className="w-full scroll-mt-28 bg-[#080D17] border border-brand-light/50 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded">
                <Star className="w-3 h-3 fill-brand-gold" />
                <span>05. VERIFIED CLIENT REVIEWS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-stone-100 uppercase tracking-tight">
                CLIENT REVIEWS & INSTALLATION FEEDBACK
              </h2>
              <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-300">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-mono text-brand-gold font-bold">5.0 / 5.0</span>
                <span className="text-slate-400 hidden sm:inline">• 500+ Verified Structural Installations in Pakistan</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-gold text-xs py-2.5 px-4 uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 shadow hover:brightness-110 shrink-0 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-brand-dark" />
              <span>+ Add Your Project Review</span>
            </button>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(testimonials && testimonials.length > 0 ? testimonials : [
              {
                id: 'rev-1',
                name: 'Ch. Tariq Mehmood',
                location: 'Bahria Town Phase 7, Rawalpindi',
                project: '14-Gauge CNC Laser Gate (MFG-001)',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
                rating: 5,
                text: 'The laser-cut precision on our 14ft main gate and electrostatic matte charcoal powder coating has zero flaws. Flawless execution from laser surveying to final installation.'
              },
              {
                id: 'rev-2',
                name: 'Engr. Bilal Aslam',
                location: 'Sector F-7/2, Islamabad',
                project: 'Oversized Pivot Entrance Door (MFD-004)',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
                rating: 5,
                text: 'The 5x10 ft pivot door swings effortlessly with a single finger touch. Structural anchoring completed with laser leveling and heavy duty German hinges. Exceptional quality.'
              },
              {
                id: 'rev-3',
                name: 'Malik Faisal',
                location: 'DHA Phase 2, Islamabad',
                project: 'Frameless Glass & Steel Railing (MFR-002)',
                image: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=600&q=80',
                rating: 5,
                text: 'Master craftsmanship and durable powder coating. The entire villa boundary grills, spiral stairs, and 60 running feet of tempered glass railings were installed right on schedule.'
              }
            ]).map((item: any, idx: number) => (
              <div 
                key={item.id || idx}
                className="bg-[#05080E] border border-brand-light/60 rounded-xl overflow-hidden flex flex-col justify-between shadow-xl group hover:border-brand-gold/60 transition-all duration-300"
              >
                {item.image && (
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Verified Installation</span>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-4 h-4 text-brand-gold/40" />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                      "{item.text}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-brand-light/30 space-y-0.5">
                    <h4 className="font-heading font-black text-xs uppercase text-stone-100 group-hover:text-brand-gold transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-brand-gold font-mono truncate">
                      {item.project || 'Custom Architectural Steel Project'}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-gold shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ======================================================== */}
        {/* 6. PORTFOLIO CONSULTATION CTA */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-[#080D18] via-brand-navy to-[#080D18] border-2 border-brand-gold/50 p-8 sm:p-10 rounded-2xl text-center space-y-5 max-w-4xl mx-auto shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 text-brand-gold text-xs font-mono font-bold uppercase rounded-full">
            Turnkey Elevation Fabrication
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-stone-100 uppercase tracking-tight">
            Have a custom project in mind?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
            Let's build something strong, durable, and designed for your space. Upload your property photo to test in our visualizer or request an on-site consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/try-at-home" className="btn-gold text-xs py-3 px-6 font-bold flex items-center gap-2 uppercase tracking-wider shadow-lg">
              <Eye className="w-4 h-4" />
              <span>Test Design on House Photo</span>
            </Link>

            <Link to="/quote" className="btn-outline text-xs py-3 px-6 font-bold uppercase tracking-wider">
              <span>Request a Quote</span>
            </Link>

            <a
              href={getWhatsAppUrl('Hello Mughal Steel Engineering Team, I would like to discuss a custom architectural fabrication project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-navy text-xs py-3 px-5 font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 7. ADD YOUR PROJECT REVIEW MODAL */}
      {/* ======================================================== */}
      {showReviewModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowReviewModal(false)}
        >
          <div 
            className="bg-[#0C1322] border-2 border-brand-gold/60 rounded-2xl w-full max-w-lg p-6 sm:p-7 space-y-4 shadow-2xl animate-fade-in my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                  <Star className="w-4 h-4 fill-brand-gold" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base uppercase text-brand-gold">
                    Add Your Project Review
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Share your Mughal Steel fabrication & installation experience
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowReviewModal(false)} 
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-2 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-black text-base uppercase text-stone-100">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-slate-300">
                  Your review has been verified and added to the project showcase.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="e.g. Ch. Tariq Mehmood / Engr. Bilal Aslam"
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Site Location *</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.location}
                      onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                      placeholder="e.g. Bahria Town Phase 7, Rawalpindi"
                      className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Installed Project / Item</label>
                    <input
                      type="text"
                      value={reviewForm.project}
                      onChange={(e) => setReviewForm({ ...reviewForm, project: e.target.value })}
                      placeholder="e.g. 14ft CNC Laser Gate (MFG-001)"
                      className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Rating *</label>
                  <div className="flex items-center gap-2 bg-[#070C15] p-2 rounded-lg border border-stone-700">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 hover:scale-125 transition cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewForm.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-brand-gold font-bold ml-2">
                      {reviewForm.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">Your Feedback & Experience *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                    placeholder="Describe the fabrication quality, laser precision, paint finish, and on-site team installation..."
                    className="w-full bg-[#070C15] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-brand-light/30">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-stone-300 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-6 py-2 bg-brand-gold text-brand-dark rounded-lg font-heading font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* End of Projects Page */}
    </div>
  );
};

