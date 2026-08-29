import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  ShieldCheck, Shield, Calculator, ArrowRight, Star, 
  Sparkles, CheckCircle2, CheckCircle, MessageCircle, MessageSquare, Play, Pause,
  Sliders, RefreshCw, X, Video, Award, Clock, 
  MapPin, Check, Heart, Eye, Globe, Compass, 
  Layers, Package, Cog, User as UserIcon, Factory, Hammer,
  Send, Mail, SkipForward, SkipBack
} from 'lucide-react';
import { PROJECT_CATEGORIES_DATA, SEED_PROJECTS } from '../data/seedData';
import { useSEO } from '../utils/useSEO';

// Merged Architectural 3D & Fabrication Background Animation Videos (Excluding on-site reviews/projects)
const HERO_BG_VIDEOS = [
  {
    title: 'Architectural Perspective & Fabrication Space',
    src: '/videos/vecteezy_rotation-and-panoramic-view-in-empty-modern-hall-with_21600063.mp4'
  },
  {
    title: 'Modern Architectural Interiors & Framing',
    src: '/videos/vecteezy_green-interior-of-a-large-office_2016164.mp4'
  },
  {
    title: 'Contemporary Metal & Glass Space',
    src: '/videos/The Interior of A Large Office 2016989 Stock Video at Vecteezy.mp4'
  }
];

export const HomePage: React.FC = () => {
  useSEO({
    title: 'Mughal Steel Fabrication | Steel Doors, Gates & Custom Fabrication',
    description: 'Premier architectural steel fabrication in Islamabad & Rawalpindi. Modern CNC laser-cut main gates, luxury wrought iron, safety grills, and stainless stairs.',
    keywords: 'Mughal Steel Fabrication, steel gates Islamabad, laser cut main gate, wrought iron railing, stainless stairs, Pakistan steel workshop',
    url: '/'
  });

  const location = useLocation();
  const { products, testimonials, addTestimonial, getWhatsAppUrl, categories, projects } = useData();
  const { formatPrice } = useCurrency();
  const activeCategories = (categories && categories.length > 0) ? categories : PROJECT_CATEGORIES_DATA;

  // Lightweight Hardware-Accelerated Video Player
  const [currentHeroVideoIndex, setCurrentHeroVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleNextVideo = () => {
    setCurrentHeroVideoIndex(prev => (prev + 1) % HERO_BG_VIDEOS.length);
  };

  const handlePrevVideo = () => {
    setCurrentHeroVideoIndex(prev => (prev - 1 + HERO_BG_VIDEOS.length) % HERO_BG_VIDEOS.length);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  // Sync play state on video change
  useEffect(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentHeroVideoIndex, isVideoPlaying]);

  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    videoUrl: string;
    description: string;
  } | null>(null);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);

  // Dedicated Active Service Modal State with Full Engineering Info
  const [activeServiceModal, setActiveServiceModal] = useState<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    desc?: string;
    fullDescription: string;
    specs: string[];
    deliverables: string[];
    process: string[];
    categoryLink: string;
    categoryLabel: string;
  } | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewProject, setNewReviewProject] = useState('Modern Front Gate');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  // Projects filter tab
  const [projectCategoryTab, setProjectCategoryTab] = useState<'All' | 'Modern Home' | 'Commercial' | 'Society' | 'Farm'>('All');

  // Quick Quote Form
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteCategory, setQuoteCategory] = useState('Modern Home');
  const [quoteItem, setQuoteItem] = useState('Front Gates');
  const [quoteWidth, setQuoteWidth] = useState(12);
  const [quoteHeight, setQuoteHeight] = useState(7.5);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Handle hash scrolling on landing/route change with accurate navbar offset
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const timeoutId = setTimeout(() => {
          const headerOffset = 90;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: id === 'home' ? 0 : offsetPosition,
            behavior: 'smooth'
          });
        }, 120);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [location.hash, location.pathname]);

  const whatsappDirect = getWhatsAppUrl(
    'Hello Mughal Steel Fabrication, I am interested in steel fabrication and would like to get a quotation.'
  );

  const handleQuickQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const area = parseFloat((quoteWidth * quoteHeight).toFixed(2));
    const est = area * 2500;
    const msg = `*MUGHAL STEEL DIRECT QUOTE INQUIRY*\n` +
      `Name: ${quoteName}\n` +
      `Phone: ${quotePhone}\n` +
      `Project Category: ${quoteCategory}\n` +
      `Fabrication Item: ${quoteItem}\n` +
      `Approx Size: ${quoteWidth}ft (W) × ${quoteHeight}ft (H) = ${area} sq.ft\n` +
      `Estimated Base Rate: Rs. 2,500 / sq.ft\n` +
      `Estimated Base Total: Rs. ${est.toLocaleString()}\n\n` +
      `Please schedule an on-site laser survey and send an official CAD drawing.`;

    setQuoteSuccess(true);
    setTimeout(() => {
      window.open(getWhatsAppUrl(msg), '_blank');
      setQuoteSuccess(false);
    }, 1200);
  };

  const videoShowcases = [
    {
      id: 'vid-commercial',
      title: '1 Kanal House Project',
      subtitle: 'Faisalabad - Complete Villa Steel Work',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      videoUrl: '/videos/1 Kanal House Steel Fabrication Project - Faisalabad - Mughal Steel Fabrication.mp4',
      description: 'Comprehensive walkthrough of 1 Kanal luxury house steel fabrication in Faisalabad executed by Mughal Steel Fabrication. Featuring custom main entrance gate, boundary security grills, balcony railings, and interior stairs.'
    },
    {
      id: 'vid-showcase',
      title: 'Completed Project Overview',
      subtitle: 'Heavy Structural Steel Work & Railings',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      videoUrl: '/videos/Overview of completed project Mughal steel fabrication, Steel Work, Railing.mp4',
      description: 'Overview of completed site installation showcasing heavy-gauge steel fabrication, precision laser cutting, forge-welded balustrades, and powder-coated boundary walls.'
    },
    {
      id: 'vid-feedback',
      title: 'Customer Review & Feedback',
      subtitle: 'NDU Islamabad Project Handover',
      thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      videoUrl: '/videos/Customer Review, NDU Islamabad, Project completed by Mughal Steel Fab.mp4',
      description: 'Verified client review and project handover at National Defence University (NDU) Islamabad. Client shares detailed feedback on structural craftsmanship, timely delivery, and professional installation standards.',
      rating: 5
    }
  ];

  const scopeSteps = [
    { step: '01', title: 'Consultation & Measurement', desc: 'On-site laser survey, tolerance checking & elevation verification.' },
    { step: '02', title: 'Design & 3D Approval', desc: 'Custom CAD engineering drawings and 3D visual preview prepared for your home.' },
    { step: '03', title: 'Material Selection', desc: 'Client reviews and approves exact gauge (14/16G MS), pipes, and hardware.' },
    { step: '04', title: 'Fabrication & Quality Check', desc: 'CNC fiber laser cutting, precision forge-bending, and certified structural welding.' },
    { step: '05', title: 'Finishing & Coating', desc: 'Multi-stage sandblasting, active hot-zinc chemical anti-rust primer & powder coat.' },
    { step: '06', title: 'Delivery & Installation', desc: 'Turnkey on-site laser alignment, heavy structural anchoring & motor calibration.' },
    { step: '07', title: 'After-Sales Support', desc: 'Comprehensive 10-year structural warranty and lifetime support.' },
  ];

  const aboutStats = [
    { value: '30+', label: 'Years of Metal Heritage' },
    { value: '5,000+', label: 'Gates & Railings Fabricated' },
    { value: '10-Year', label: 'Anti-Sag Structural Warranty' },
    { value: '100%', label: 'Certified 14G/16G MS Steel' }
  ];

  return (
    <div className="w-full bg-[#05080E] text-stone-100 font-sans">
      
      {/* ======================================================== */}
      {/* 1. HOME SECTION: HERO & 60FPS SEAMLESS BACKGROUND VIDEO LOOP */}
      {/* ======================================================== */}
      <section id="home" className="relative scroll-mt-24 w-full border-b border-brand-light/40 py-12 md:py-16 overflow-hidden">
        
        {/* 60 FPS Dual-Buffer Seamless Background Video Loop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Single Hardware-Accelerated Seamless Video Player */}
          <video
            ref={videoRef}
            key={HERO_BG_VIDEOS[currentHeroVideoIndex].src}
            src={HERO_BG_VIDEOS[currentHeroVideoIndex].src}
            autoPlay
            muted
            playsInline
            disablePictureInPicture
            onEnded={handleNextVideo}
            onError={handleNextVideo}
            className="absolute inset-0 w-full h-full object-cover scale-105 opacity-85 transition-opacity duration-700 pointer-events-none"
            style={{
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}
          />

          {/* Clean hardware-accelerated cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070C15]/50 via-[#05080E]/35 to-[#080D17]/65 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070C15]/15 to-[#070C15]/50 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Top Banner Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-heading font-black uppercase tracking-widest rounded-sm backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span>Premier Architectural Steel Fabrication</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-stone-100 uppercase tracking-tight leading-[1.1] drop-shadow-md">
                  MUGHAL STEEL <br />
                  <span className="text-gradient-gold">FABRICATION</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-200 font-sans max-w-xl leading-relaxed drop-shadow">
                  Engineered entrance gates, classical hand-forged wrought iron, custom stair railings, and modern aluminum & glass systems built with 10-year structural integrity.
                </p>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1.5 text-brand-gold font-bold">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  30+ Years Craftsmanship
                </span>
                <span>•</span>
                <span>±0.1mm CNC Fiber Laser</span>
                <span>•</span>
                <span>Rawalpindi & Islamabad</span>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link 
                  to="/items" 
                  className="btn-gold text-xs py-3.5 px-6 uppercase tracking-wider font-bold shadow-lg hover:shadow-glow-gold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Products</span>
                </Link>

                <Link 
                  to="/try-at-home" 
                  className="bg-brand-navy/90 hover:bg-brand-medium text-stone-100 border border-brand-gold/60 text-xs py-3.5 px-6 uppercase tracking-wider font-bold shadow-lg flex items-center gap-2 transition-colors backdrop-blur-sm"
                >
                  <Eye className="w-4 h-4 text-brand-gold" />
                  <span>Try at Home</span>
                </Link>

                <Link 
                  to="/quote" 
                  className="btn-outline text-xs py-3.5 px-6 uppercase tracking-wider font-bold"
                >
                  <span>Request a Quote</span>
                </Link>
              </div>

            </div>

            {/* Right Hero Image Showcase (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-lg overflow-hidden border-2 border-brand-gold/60 shadow-2xl bg-black group">
                <img 
                  src="/image/mughal-steel-team.png" 
                  alt="Mughal Steel Fabrication Rawalpindi Team & Engineers" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 shadow-2xl" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/mughal-steel-team.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 inset-x-4 text-center">
                  <span className="inline-block bg-brand-navy/95 text-brand-gold border border-brand-gold/50 text-[11px] font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded shadow">
                    Master Fabricators & Engineers • Mughal Steel Workshop Rawalpindi
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom 3 Video Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {videoShowcases.map((vid) => (
              <div 
                key={vid.id}
                onClick={() => setActiveVideoModal({
                  title: vid.title,
                  videoUrl: vid.videoUrl,
                  description: vid.description
                })}
                className="group relative h-48 rounded-lg overflow-hidden border border-brand-light/60 hover:border-brand-gold/80 cursor-pointer shadow-xl transition-all duration-300 bg-brand-navy backdrop-blur-sm"
              >
                <img 
                  src={vid.thumbnail} 
                  alt={vid.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.4]" 
                />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center space-y-2.5">
                  <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-glow-gold group-hover:scale-125 transition-transform">
                    <Play className="w-5 h-5 fill-brand-dark ml-0.5" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-black text-sm text-stone-100 uppercase tracking-wide group-hover:text-brand-gold transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-sans line-clamp-1">
                      {vid.subtitle}
                    </p>
                  </div>

                  {vid.rating && (
                    <div className="flex text-amber-400 gap-0.5 pt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-black/80 text-brand-gold text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-brand-gold/30 flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>PLAY VIDEO</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. ABOUT SECTION: 30+ YEARS HERITAGE & WORKFLOW */}
      {/* ======================================================== */}
      <section id="about" className="scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                ABOUT MUGHAL STEEL FABRICATION
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Three decades of master metallurgy, high-tensile structural engineering, and artisan blacksmith heritage.
              </p>
            </div>
            <Link to="/about" className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1">
              <span>Read Full Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {aboutStats.map((s, idx) => (
              <div key={idx} className="bg-brand-navy border border-brand-light/60 p-6 rounded-lg space-y-1 shadow-lg hover:border-brand-gold/60 transition-all">
                <p className="text-3xl sm:text-4xl font-heading font-black text-brand-gold">{s.value}</p>
                <p className="text-slate-300 text-xs uppercase tracking-wider font-semibold font-mono">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Story & Philosophy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-brand-gold text-xs font-mono font-bold uppercase tracking-widest block">
                ENGINEERING EXCELLENCE
              </span>
              <h3 className="text-xl sm:text-3xl font-heading font-black text-stone-100 uppercase tracking-tight">
                Precision Fiber Laser Cutting with Hand-Forged Durability
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                Mughal Steel Fabrication elevates standard security metalwork into architectural statements. We fabricate structural steel solutions for prestigious housing societies, luxury modern residences, and commercial complexes across Pakistan.
              </p>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                Every gate, railing, staircase, and partition is constructed from heavy-gauge structural carbon steel (minimum 14-gauge certified), treated with active hot-zinc anti-corrosion primer, and cured in high-bake powder coating ovens.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>±0.1mm CNC Tolerances</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Electrostatic Powder Coat</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>German Motor Automation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>On-Site Laser Leveling</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-lg overflow-hidden border border-brand-gold/50 shadow-2xl bg-black aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80" 
                  alt="Master fabricators at Mughal Steel" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <span className="text-xs font-mono font-bold text-brand-gold bg-brand-navy/90 px-3 py-1 rounded border border-brand-gold/40">
                    Industrial CNC Fiber Laser Line • Rawalpindi Workshop
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Step Workflow */}
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider">
                TURNKEY EXECUTION PROCESS
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-stone-100 uppercase">
                7-Step Fabrication & Delivery Workflow
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {scopeSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className="bg-brand-navy border border-brand-light/60 p-3.5 rounded-lg flex flex-col justify-between space-y-2 shadow-md group hover:border-brand-gold transition-all"
                >
                  <div className="flex items-center justify-between border-b border-brand-light/40 pb-1.5">
                    <span className="text-sm font-mono font-black text-brand-gold">
                      {step.step}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60"></div>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-bold text-[11px] text-stone-100 uppercase line-clamp-1">
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SERVICES SECTION: 6 CORE CAPABILITIES */}
      {/* ======================================================== */}
      <section id="services" className="scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                OUR SPECIALIZED SERVICES
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Full-spectrum structural steel, decorative wrought iron, and architectural glass solutions.
              </p>
            </div>
            <Link to="/services" className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1">
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'srv-1',
                title: 'Steel Fabrication & CNC Laser Works',
                subtitle: 'High-Tensile Structural Mild Steel (14G / 16G Certified) & Millimeter CNC Laser Precision',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                desc: 'High-tensile CNC laser cut gates, security boundary grills, and heavy structural warehouse trusses.',
                fullDescription: 'Mughal Steel Fabrication delivers turnkey architectural steel fabrication solutions combining heavy structural carbon steel box channels with ±0.1mm fiber laser-cut steel sheets. Every assembly is precision welded, anti-rust zinc-primed, and oven-baked with electrostatic polyester powder coat for extreme longevity.',
                icon: (
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 6h16M4 18h16M8 6v12M16 6v12M6 10h12M6 14h12" strokeLinecap="round" />
                    <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.5" />
                  </svg>
                ),
                specs: [
                  '14-Gauge (2.0mm) & 12-Gauge (2.5mm) Certified MS Frame',
                  'High-Speed CNC Fiber Laser Tolerance: ±0.1mm',
                  'Hot-Zinc Anti-Rust Primer & Electrostatic Powder Oven Bake (200°C)',
                  'Italian / German Automated Gate Motor Compatibility',
                  'Heavy-Duty Ball-Bearing Hinges & High-Tensile Ground Anchor Bolts'
                ],
                deliverables: [
                  'Main Villa Driveway Sliding & Swing Gates',
                  'Telescopic & Bi-Fold High-Clearance Gates',
                  'Security Window Grills & French Sliding Frames',
                  'Boundary Wall Security Panels & Decorative Spikes',
                  'Architectural Facade Louver Cladding'
                ],
                process: [
                  '1. On-Site Digital Laser Survey & Sizing',
                  '2. 3D CAD Shop Drawing & Motif Blueprint Approval',
                  '3. CNC Fiber Laser Plate Cutting',
                  '4. Precision TIG/MIG Structural Welding',
                  '5. 7-Stage Anti-Corrosion Treatment & Oven Bake',
                  '6. On-Site Precision Laser Leveling & Installation'
                ],
                categoryLink: '/categories/modern-home',
                categoryLabel: 'View Modern Home Category Designs'
              },
              {
                id: 'srv-2',
                title: 'Wrought Iron & Classical Artisan Work',
                subtitle: 'Master Hand-Forged Solid Carbon Steel Scrolls, Haveli Archways & Antique Patinas',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                desc: 'Hand-forged ornamental scrolls, haveli gates, and antique gold balustrades.',
                fullDescription: 'Preserving centuries of Mughal and European blacksmith artistry, our master artisans hand-forge solid carbon steel bars on heavy anvils to craft bespoke ornamental scrolls, acanthus leaves, classical rosettes, and antique brass accents.',
                icon: (
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" />
                  </svg>
                ),
                specs: [
                  'Solid Heavy Carbon Steel Bars (16mm to 25mm solid forged)',
                  'Hand-Hammered Ornamental Scrolls & Cast Monograms',
                  'Triple-Coat Antique Patina (Spanish Gold, Roman Bronze, Copper Rust-Proof)',
                  'Concealed Heavy Anchor Bolts for Masonry Pillars',
                  '10-Year Structural & Anti-Corrosion Guarantee'
                ],
                deliverables: [
                  'Grand Classical Entrance Gates with Family Monograms',
                  'Majestic Curved Balcony Railings & Terrace Barriers',
                  'Artisan Wrought Iron Double Front Doors',
                  'Spiral Staircases with Ornate Gold Balusters',
                  'Garden Estate Gazebos & Classical Pergolas'
                ],
                process: [
                  '1. Heritage Motif Consultation & Elevation Study',
                  '2. Full-Scale 1:1 Scale Blacksmith Template Drawing',
                  '3. Traditional Forge Heating & Hand-Hammering',
                  '4. Structural Framework Joinery & Grind Finishing',
                  '5. Hand-Rubbed Antique Metallic Patina Application',
                  '6. White-Glove On-Site Erection & Leveling'
                ],
                categoryLink: '/categories/classical-home',
                categoryLabel: 'View Classical Home Category Designs'
              },
              {
                id: 'srv-3',
                title: 'Aluminum & Glass Works',
                subtitle: 'Architectural Pivot Doors, Thermally Isolated Facades & Acoustic Laminated Glass Systems',
                image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
                desc: 'Thermally isolated pivot doors, glass balustrades, and soundproof partitions.',
                fullDescription: 'Ultra-slim architectural aluminum framing paired with high-performance 12mm tempered or acoustic double-glazed glass. Engineered for modern villa pivot entrance doors, office glass partitions, frameless balcony balustrades, and expansive sliding patio enclosures.',
                icon: (
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                    <path d="M3 9h18M9 21V9" strokeWidth="1.5" />
                  </svg>
                ),
                specs: [
                  'Commercial-Grade 6063-T6 Thermal-Break Aluminum Extrusions',
                  '12mm / 16mm Laminated Toughened Safety Glass (EN 12150 Certified)',
                  'German Concealed Hydraulic Floor Springs (Up to 350kg Capacity)',
                  'Acoustic Soundproofing Rating: Up to 42dB Noise Isolation',
                  'Weather-Sealed EPDM Gaskets & Multi-Point Security Locks'
                ],
                deliverables: [
                  'Oversized Frameless Glass Pivot Entrance Doors',
                  'Floor-to-Ceiling Acoustic Office Partitions',
                  'Frameless Balcony Tempered Glass Balustrades',
                  'Commercial Showroom & Storefront Glass Facades',
                  'Double-Glazed Soundproof French Windows'
                ],
                process: [
                  '1. Precision Optical Laser Alignment Survey',
                  '2. Architectural Glass Specification & Thickness Engineering',
                  '3. CNC Aluminum Profile Milling & Thermal Isolator Assembly',
                  '4. High-Temperature Glass Tempering & Edge Polishing',
                  '5. Hydraulic Floor Spring Anchoring',
                  '6. Turnkey On-Site Glazing & Weatherproofing'
                ],
                categoryLink: '/categories/aluminum-glass',
                categoryLabel: 'View Aluminum & Glass Category Designs'
              },
              {
                id: 'srv-4',
                title: 'Structural & Commercial Steel Solutions',
                subtitle: 'Heavy Industrial Trusses, Mezzanine Floors, Warehouse Sheds & Fire-Escape Spines',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                desc: 'Mezzanine platforms, fire-escape spiral stairs, automated sliding barrier frames, and industrial sheds.',
                fullDescription: 'Heavy structural steel engineering designed to meet Pakistan Building Code (PBC) standards. From large-span warehouse portal frames and industrial mezzanine storage decks to commercial exterior spiral escape stairs.',
                icon: (
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 21h18M6 21V7l6-4 6 4v14M10 11h4M10 15h4M10 19h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                ),
                specs: [
                  'Heavy I-Beam, H-Beam & Hollow Structural Section (HSS) Steel',
                  'Certified Coded Structural Welders (ASME / AWS D1.1 Standard)',
                  'High-Tensile Grade 8.8 Structural Foundation Anchor Bolts',
                  'Structural Load Proof Tested up to 1500 kg/m²',
                  'Fire-Retardant Intumescent Paint Coating Option'
                ],
                deliverables: [
                  'Industrial Warehouse & Factory Portal Frame Sheds',
                  'Multi-Tier Mezzanine Steel Storage Decks',
                  'Commercial Exterior Fire-Escape Spiral Staircases',
                  'Commercial Tensile Parking Canopies & Walkways',
                  'High-Rise Building Steel Sub-Frames & Trusses'
                ],
                process: [
                  '1. Structural Load & Wind Velocity Calculations',
                  '2. Coded Steel Fabrication in Industrial Workshop',
                  '3. Full Ultrasonic Weld Testing & Primer Application',
                  '4. On-Site Heavy Crane Hoisting & Bolt Tensioning',
                  '5. Structural Safety Certification & Load Sign-off'
                ],
                categoryLink: '/categories/commercial',
                categoryLabel: 'View Commercial Category Designs'
              },
              {
                id: 'srv-5',
                title: 'Farm & Agricultural Solutions',
                subtitle: 'Hot-Dip Galvanized Cattle Barriers, Heavy Equipment Sheds & Estate Perimeter Security',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
                desc: 'Hot-dip galvanized cattle barriers, heavy equipment shed trusses, and durable agrarian estate fencing.',
                fullDescription: 'Robust, heavy-gauge weather-proof steel fabrication built to withstand harsh outdoor agrarian environments, animal livestock pressure, and heavy tractor/harvester machinery.',
                icon: (
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" strokeWidth="1.5" />
                    <path d="M9 21V12h6v9" strokeWidth="1.5" />
                    <line x1="3" y1="12" x2="9" y2="12" strokeWidth="1.2" />
                    <line x1="15" y1="12" x2="21" y2="12" strokeWidth="1.2" />
                  </svg>
                ),
                specs: [
                  'Hot-Dip Galvanized Steel Coating (ISO 1461 Certified, 85+ Microns)',
                  'High-Yield Schedule 40 Seamless Round & Square Tubular Pipes',
                  'Livestock-Safe Smooth Finished Radiused Welds',
                  'Heavy-Duty Ground Anchors & Locking Slam-Latches',
                  'Weatherproof Galvanized Corrugated Roofing Profiles'
                ],
                deliverables: [
                  'Estate Main Entrance Farmhouse Grand Gates',
                  'Livestock Corrals, Cattle Crushes & Feeding Barriers',
                  'Heavy Tractor & Agricultural Machinery Sheds',
                  'Perimeter Chain-Link & Tubular Steel Security Fencing',
                  'Farmhouse Shaded Steel Porches & Pergolas'
                ],
                process: [
                  '1. Agricultural Terrain & Livestock Flow Survey',
                  '2. Heavy Schedule 40 Pipe Bending & Framing',
                  '3. Deep-Dip Molten Zinc Hot Galvanization',
                  '4. On-Site Deep Foundation Excavation & Concreting',
                  '5. Heavy Hinge & Motor Alignment Setup'
                ],
                categoryLink: '/categories/farm',
                categoryLabel: 'View Farm Category Designs'
              },
              {
                id: 'srv-6',
                title: 'Custom Design & Turnkey Installation',
                subtitle: 'Turnkey 3D CAD Modeling, Laser Leveling, Structural Foundation Anchoring & Motor Setup',
                image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
                desc: 'Turnkey 3D CAD modeling, laser leveling, structural foundation anchoring, and automated motor setup.',
                fullDescription: 'Complete end-to-end bespoke design and engineering consultancy. We take your architectural blueprints or site measurements, generate detailed 3D CAD elevations with virtual try-on previews, and manage complete on-site crane and laser installation with warranty certification.',
                icon: (
                  <svg className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" strokeWidth="1.5" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                ),
                specs: [
                  'Detailed 3D CAD & Structural Elevation Shop Drawings',
                  '±0.5mm Precision On-Site Digital Laser Leveling',
                  'Heavy Core Drilling & High-Strength Chemical Epoxy Anchoring',
                  'Complete German / Italian Automation Setup & Wiring',
                  'Mughal Steel Official 10-Year Fabrication Warranty Certificate'
                ],
                deliverables: [
                  'Turnkey 3D CAD Visualizer & Blueprint Service',
                  'Custom House Elevation Gate & Door Fitting',
                  'Automated Sliding & Swing Roller Motor Setup',
                  'On-Site Core Drilling & Structural Pillar Anchoring',
                  '10-Year Warranty & Annual Maintenance Support'
                ],
                process: [
                  '1. Free On-Site Digital Survey in Twin Cities',
                  '2. 3D Elevation Simulation & Material Quotation',
                  '3. Dedicated Fabrication in Rawalpindi Industrial Yard',
                  '4. Quality Inspection & Multi-Stage Powder Coat',
                  '5. Complete On-Site Crane Installation & Testing',
                  '6. Delivery of Official Warranty Certificate'
                ],
                categoryLink: '/quote',
                categoryLabel: 'Request Custom Elevation & Quote'
              }
            ].map((srv) => (
              <div 
                key={srv.id}
                onClick={() => setActiveServiceModal(srv)}
                className="group bg-brand-navy border border-brand-light/60 rounded-lg p-6 hover:border-brand-gold transition-all duration-300 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer hover:bg-brand-medium/60"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-brand-gold/15 border border-brand-gold/40 shrink-0 group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </div>
                  <h3 className="font-heading font-black text-base text-stone-100 group-hover:text-brand-gold transition-colors uppercase">
                    {srv.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {srv.desc}
                </p>

                <div className="pt-2 border-t border-brand-light/40 flex items-center justify-between text-xs font-heading font-bold text-brand-gold uppercase tracking-wider">
                  <span className="group-hover:underline">Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* PRODUCTS SECTION: FRONT GATES & MODERN HOME ITEMS */}
      {/* ======================================================== */}
      <section id="products" className="scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                FRONT GATES & CUSTOM FABRICATIONS
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Precision CNC laser-cut sheets, heavy structural pipes, and imported roller automation options.
              </p>
            </div>
            <Link to="/items" className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1">
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((prod) => (
              <div 
                key={prod.id} 
                className="group bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden hover:border-brand-gold transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <Link to={`/product/${prod.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-black block">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/80 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-gold/40">
                    {prod.productCode}
                  </div>
                </Link>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {prod.category} • {prod.item}
                    </span>
                    <Link to={`/product/${prod.slug}`}>
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1 uppercase">
                        {prod.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-brand-light/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Rate:</span>
                      <span className="text-xs font-mono font-bold text-brand-gold">
                        {formatPrice(prod.pricePerSqFt || 2500)} / sq.ft
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/product/${prod.slug}`} className="btn-gold text-[10px] py-2 text-center justify-center font-bold">
                        <span>Details</span>
                      </Link>
                      <Link to={`/try-at-home?product=${prod.productCode}`} className="btn-outline text-[10px] py-2 text-center justify-center font-bold">
                        <span>Try on Photo</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 16 Modern Home Items Row */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
              <h3 className="font-heading font-black text-lg text-stone-100 uppercase">
                16 Modern Home Fabrication Items
              </h3>
              <Link to="/categories/modern-home" className="text-xs text-brand-gold font-bold hover:underline">
                Explore Category →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {[
                { name: 'Front Gate', link: '/items?item=Front+Gates', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
                { name: 'Balcony', link: '/items?item=Balcony+Railing', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=300&q=80' },
                { name: 'Louvers', link: '/items?item=Grills', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80' },
                { name: 'Duct Covers', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80' },
                { name: 'Spiral Stairs', link: '/items?item=Stair+Railing', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=300&q=80' },
                { name: 'Railings', link: '/items?item=Railing', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=300&q=80' },
                { name: 'Front Shade', link: '/items?item=Sheds+%26+Canopies', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80' },
                { name: 'Pivot Doors', link: '/items?item=Doors', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80' }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  className="group bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden p-2 space-y-1.5 hover:border-brand-gold transition-all shadow-md text-center block"
                >
                  <div className="aspect-[4/3] rounded overflow-hidden bg-black">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <h4 className="font-heading font-bold text-[11px] text-stone-100 group-hover:text-brand-gold transition-colors truncate uppercase">
                    {item.name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Try at Home Live Visualizer Studio Strip */}
          <div className="bg-gradient-to-r from-[#0B1320] via-brand-navy to-[#0B1320] border border-brand-gold/50 rounded-lg p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/20 text-brand-gold text-[10px] font-heading font-bold uppercase tracking-widest rounded border border-brand-gold/40">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Elevation Studio
              </span>
              <h3 className="text-xl sm:text-3xl font-heading font-black text-stone-100 uppercase">
                Test Gates & Doors on Your House Photo
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Upload your house elevation picture, overlay any gate or door model, adjust scaling and perspective, and get instant square footage pricing directly on WhatsApp.
              </p>
              <div className="pt-1">
                <Link to="/try-at-home" className="btn-gold text-xs py-3 px-6 inline-flex items-center gap-2 shadow-lg hover:shadow-glow-gold uppercase font-bold tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Launch Live Elevation Studio</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="relative rounded-lg overflow-hidden border border-brand-gold/50 aspect-video shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" 
                  alt="Live visualizer tool" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="btn-gold text-[10px] py-1.5 px-3 font-bold uppercase">
                    Open Studio
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* PORTFOLIO SECTION: 10 ARCHITECTURAL CATEGORIES */}
      {/* ======================================================== */}
      <section id="portfolio" className="scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                10 PROJECT CATEGORIES
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Select your property type to view tailored fabrication designs, gauges, and installation standards.
              </p>
            </div>
            <Link to="/categories" className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1">
              <span>View All {activeCategories.length} Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Categories Grid - Dynamic & Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {activeCategories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/categories/${cat.slug}`}
                className="group bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden hover:border-brand-gold transition-all duration-300 shadow-md flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <img 
                    src={cat.heroImage} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="p-3 text-center space-y-1">
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1 uppercase">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {cat.items.length} Items
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* FEATURED WORK / PROJECTS SHOWCASE */}
      {/* ======================================================== */}
      <section id="projects" className="scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded">
                09. FEATURED WORK
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                FEATURED PORTFOLIO PROJECTS
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Explore real completed site installations across Islamabad, Rawalpindi, DHA, Bahria Town, and commercial plazas.
              </p>
            </div>
            
            <Link 
              to="/portfolio"
              className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>Explore All {projects.length} Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 6 Featured Portfolio Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {((projects && projects.length > 0 ? projects.slice(0, 6) : SEED_PROJECTS.slice(0, 6)) as any[]).map((project: any) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.slug || project.id}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-light/60 hover:border-brand-gold transition-all duration-300 shadow-2xl bg-black flex flex-col justify-between"
              >
                <img 
                  src={project.image || (project as any).coverImage} 
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-brand-dark/90 backdrop-blur-md border border-brand-gold/40 text-brand-gold text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-5 flex flex-col justify-end">
                  <span className="text-[10px] text-brand-gold font-mono font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {project.location || 'Islamabad, Pakistan'}
                  </span>
                  <h3 className="text-sm sm:text-base font-heading font-black text-white group-hover:text-brand-gold transition-colors uppercase leading-tight mt-1">
                    {project.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-1 font-sans">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              to="/portfolio"
              className="btn-gold text-xs py-3 px-8 uppercase font-bold tracking-wider shadow-lg"
            >
              <span>View Complete Portfolio Gallery</span>
            </Link>

            <a
              href={getWhatsAppUrl('Hello Mughal Steel Team, I am viewing your Featured Portfolio and would like to discuss a custom fabrication project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-navy text-xs py-3 px-6 uppercase font-bold tracking-wider flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* REVIEWS SECTION: VERIFIED FEEDBACK & CLIENT REVIEWS */}
      {/* ======================================================== */}
      <section id="reviews" className="scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                CLIENT REVIEWS & TESTIMONIALS
              </h2>
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span>5.0 Rating Across 500+ Fabrication Projects in Pakistan</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-gold text-xs py-2.5 px-4 uppercase font-bold tracking-wider flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-brand-dark" />
              <span>+ Add Your Project Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ch. Tariq Mehmood',
                location: 'Bahria Town Phase 7, Rawalpindi',
                project: '14-Gauge CNC Laser Gate (MFG-001)',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
                rating: 5,
                text: 'The laser-cut precision on our 14ft main gate and electrostatic matte charcoal powder coating has zero flaws. Flawless execution from laser surveying to final installation.'
              },
              {
                name: 'Engr. Bilal Aslam',
                location: 'Sector F-7/2, Islamabad',
                project: 'Oversized Pivot Entrance Door (MFD-004)',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
                rating: 5,
                text: 'The 5x10 ft pivot door swings effortlessly with a single finger touch. Structural anchoring completed with laser leveling and heavy duty German hinges. Exceptional quality.'
              },
              {
                name: 'Malik Faisal',
                location: 'DHA Phase 2, Islamabad',
                project: 'Frameless Glass & Steel Railing (MFR-002)',
                image: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=600&q=80',
                rating: 5,
                text: 'Master craftsmanship and durable powder coating. The entire villa boundary grills, spiral stairs, and 60 running feet of tempered glass railings were installed right on schedule.'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden flex flex-col justify-between shadow-xl group hover:border-brand-gold/60 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] bg-black overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.project} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2 bg-brand-dark/90 text-brand-gold border border-brand-gold/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    VERIFIED INSTALLATION
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-heading font-bold truncate">
                    {item.project}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed flex-1 italic">
                    &ldquo;{item.text}&rdquo;
                  </p>

                  <div className="pt-3 border-t border-brand-light/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-black text-xs text-stone-100 uppercase">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-sans block">
                        {item.location}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      100% Certified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Link 
              to="/reviews"
              className="btn-outline text-xs py-3 px-8 uppercase font-bold tracking-wider"
            >
              <span>View All Verified Client Reviews</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. CONTACT SECTION: WORKSHOP LIVE LOCATION & DIRECT INQUIRY */}
      {/* ======================================================== */}
      <section id="contact" className="scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>Workshop & Fabrication Yard</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
              CONTACT & LIVE LOCATION
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              Visit our fabrication yard in Sector I-9 Industrial Area or send project dimensions for an immediate estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Quick Quote & Consultation Form */}
            <div className="lg:col-span-6">
              <form onSubmit={handleQuickQuoteSubmit} className="bg-brand-navy border border-brand-gold/40 p-6 sm:p-8 rounded-lg space-y-4 shadow-2xl">
                <div className="border-b border-brand-light pb-3 flex items-center justify-between">
                  <h3 className="font-heading font-black text-base text-stone-100 uppercase tracking-wider">
                    Instant Price Quotation
                  </h3>
                  <span className="text-[10px] font-mono text-brand-gold font-bold">15-Min Response</span>
                </div>

                {quoteSuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500 rounded text-emerald-300 text-xs">
                    Generating quotation and connecting to project estimator...
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Your Name *</label>
                    <input 
                      type="text" required placeholder="e.g. Ali Khan"
                      value={quoteName} onChange={(e) => setQuoteName(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light px-3 py-2.5 text-stone-100 rounded focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Phone Number *</label>
                    <input 
                      type="tel" required placeholder="e.g. 0300 1234567"
                      value={quotePhone} onChange={(e) => setQuotePhone(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light px-3 py-2.5 text-stone-100 rounded focus:border-brand-gold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Project Category</label>
                    <select 
                      value={quoteCategory} onChange={(e) => setQuoteCategory(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light px-3 py-2.5 text-stone-100 rounded focus:border-brand-gold outline-none"
                    >
                      {activeCategories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Fabrication Item</label>
                    <select 
                      value={quoteItem} onChange={(e) => setQuoteItem(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light px-3 py-2.5 text-stone-100 rounded focus:border-brand-gold outline-none"
                    >
                      <option value="Front Gates">Main / Front Gate</option>
                      <option value="Doors">Pivot / Steel Door</option>
                      <option value="Railing">Stair / Balcony Railing</option>
                      <option value="Grills">Security Window Grills</option>
                      <option value="Sheds & Canopies">Car Porch / Terrace Shed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Width (Feet)</label>
                    <input 
                      type="number" step="0.5" min="2" max="50"
                      value={quoteWidth} onChange={(e) => setQuoteWidth(parseFloat(e.target.value) || 0)}
                      className="w-full bg-brand-dark border border-brand-light px-3 py-2.5 text-stone-100 rounded focus:border-brand-gold outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Height (Feet)</label>
                    <input 
                      type="number" step="0.5" min="2" max="30"
                      value={quoteHeight} onChange={(e) => setQuoteHeight(parseFloat(e.target.value) || 0)}
                      className="w-full bg-brand-dark border border-brand-light px-3 py-2.5 text-stone-100 rounded focus:border-brand-gold outline-none font-mono"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="btn-gold w-full py-3.5 text-center justify-center font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Quotation Request</span>
                </button>
              </form>
            </div>

            {/* Right: Live Interactive Google Maps & Workshop Information */}
            <div className="lg:col-span-6 bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
                <h3 className="font-heading text-sm font-black uppercase tracking-wider text-brand-gold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>Mughal Steel Workshop Complex</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                  ● Live Map Pin
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300 font-sans">
                <p className="font-bold text-stone-100">Plot 42, Sector I-9 Industrial Area</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-brand-gold font-mono font-bold text-[11px]">
                  <a href="tel:03268575643" className="hover:underline flex items-center gap-1">📞 0326-8575643</a>
                  <a href="tel:03464277539" className="hover:underline flex items-center gap-1">📞 0346-4277539</a>
                  <a href="https://wa.me/923239898317" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-emerald-400">💬 0323-9898317</a>
                  <a 
                    href="mailto:mughalsteelfabrication51@gmail.com?subject=Website%20Inquiry%20%E2%80%93%20Mughal%20Steel%20Fabrication" 
                    className="hover:underline flex items-center gap-1 text-stone-200 hover:text-brand-gold transition-colors"
                    title="Send Email to Mughal Steel"
                  >
                    ✉️ mughalsteelfabrication51@gmail.com
                  </a>
                </div>
              </div>

              {/* Google Map Iframe */}
              <div className="relative h-60 sm:h-64 bg-brand-dark border-2 border-brand-gold/40 rounded-lg overflow-hidden shadow-xl">
                <iframe
                  title="Mughal Steel Fabrication Live Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13284.184347209772!2d73.03608145!3d33.65934525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df957778b40efd%3A0xcda6b0559f2a969!2sSector%20I-9%20Industrial%20Area%2C%20Islamabad%2C%20Rawalpindi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Map CTA Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Mughal+Steel+Fabrication+I-9+Industrial+Area+Islamabad+Rawalpindi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-xs py-2.5 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>

                <a 
                  href="mailto:mughalsteelfabrication51@gmail.com?subject=Website%20Inquiry%20%E2%80%93%20Mughal%20Steel%20Fabrication"
                  className="btn-outline text-xs py-2.5 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5"
                  title="Click to Email Directly"
                >
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span>Email Us Directly</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Video Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-brand-navy border border-brand-gold/50 rounded-lg max-w-3xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-brand-light pb-3">
              <h3 className="font-heading font-black text-lg text-stone-100 uppercase">
                {activeVideoModal.title}
              </h3>
              <button 
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-brand-medium"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded overflow-hidden bg-black">
              <video 
                src={activeVideoModal.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {activeVideoModal.description}
            </p>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-navy border border-brand-gold/50 rounded-lg max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-brand-light pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                <h3 className="font-heading text-base font-black text-stone-100 uppercase">
                  Write a Client Review
                </h3>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-brand-medium"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmittedToast ? (
              <div className="p-6 bg-emerald-950 border border-emerald-500 rounded text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-heading text-sm font-bold text-emerald-200 uppercase">Thank You!</h4>
                <p className="text-xs text-emerald-300">Your review has been published.</p>
              </div>
            ) : (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newReviewName.trim() || !newReviewText.trim()) return;
                  await addTestimonial({
                    name: newReviewName,
                    location: newReviewCity || 'Islamabad / Rawalpindi',
                    projectType: newReviewProject,
                    rating: newReviewRating,
                    text: newReviewText,
                    featured: true,
                    published: true
                  });
                  setReviewSubmittedToast(true);
                  setTimeout(() => {
                    setReviewSubmittedToast(false);
                    setShowReviewModal(false);
                    setNewReviewName('');
                    setNewReviewCity('');
                    setNewReviewText('');
                  }, 2000);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Name *</label>
                  <input 
                    type="text" required value={newReviewName} onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="e.g. Farhan Tariq"
                    className="w-full bg-brand-dark border border-brand-light rounded p-2.5 text-stone-100 focus:border-brand-gold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">City / Location</label>
                    <input 
                      type="text" value={newReviewCity} onChange={(e) => setNewReviewCity(e.target.value)}
                      placeholder="e.g. Rawalpindi / DHA"
                      className="w-full bg-brand-dark border border-brand-light rounded p-2.5 text-stone-100 focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Rating</label>
                    <div className="flex items-center gap-1 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button" key={star} onClick={() => setNewReviewRating(star)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Feedback *</label>
                  <textarea 
                    rows={3} required value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Share your experience with fabrication quality, timeline or installation..."
                    className="w-full bg-brand-dark border border-brand-light rounded p-2.5 text-stone-100 focus:border-brand-gold outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="btn-gold w-full py-3 text-center justify-center font-bold text-xs uppercase tracking-wider"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* VIDEO SHOWCASE MODAL PLAYER (SMOOTH 60 FPS BUFFERED) */}
      {/* ======================================================== */}
      {activeVideoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            setActiveVideoModal(null);
            setIsVideoBuffering(false);
          }}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#080D18] border border-brand-gold/50 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold border border-brand-gold/40">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm sm:text-base text-stone-100 uppercase tracking-wide">
                    {activeVideoModal.title}
                  </h3>
                  <p className="text-[11px] text-brand-gold font-mono uppercase font-bold tracking-wider">
                    Mughal Steel Verified On-Site Fabrication Video
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveVideoModal(null);
                  setIsVideoBuffering(false);
                }}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Smooth Buffered Video Player */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-stone-800 shadow-inner flex items-center justify-center">
              {isVideoBuffering && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs gap-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-brand-gold" />
                  <span className="text-xs text-brand-gold font-mono uppercase tracking-wider font-bold">Buffering 60 FPS Stream...</span>
                </div>
              )}

              <video
                key={activeVideoModal.videoUrl}
                src={activeVideoModal.videoUrl}
                controls
                autoPlay
                preload="auto"
                playsInline
                disablePictureInPicture={false}
                onWaiting={() => setIsVideoBuffering(true)}
                onPlaying={() => setIsVideoBuffering(false)}
                onCanPlay={() => setIsVideoBuffering(false)}
                onCanPlayThrough={() => setIsVideoBuffering(false)}
                className="w-full h-full object-contain"
                style={{
                  willChange: 'transform',
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden'
                }}
              />
            </div>

            {/* Video Description */}
            <div className="bg-[#05080E] p-3.5 rounded-xl border border-stone-800/80 text-xs text-stone-300 leading-relaxed font-sans">
              <p>{activeVideoModal.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COMPREHENSIVE PROFESSIONAL SERVICE DETAIL MODAL (COMPACT & CENTERED) */}
      {/* ======================================================== */}
      {activeServiceModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveServiceModal(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-[#0A101D] border border-brand-gold/50 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-brand-light/40 px-4 py-3 bg-[#070D18] shrink-0 gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-gold text-brand-dark text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase">
                    Certified Capability
                  </span>
                  <span className="text-[11px] text-brand-gold font-mono font-bold">
                    Pakistan Building Code Compliant
                  </span>
                </div>
                <h3 className="font-heading font-black text-sm sm:text-base text-stone-100 uppercase tracking-tight truncate">
                  {activeServiceModal.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveServiceModal(null)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                aria-label="Close Service Info"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              
              {/* Service Banner Image */}
              <div className="relative h-44 sm:h-56 w-full rounded-lg overflow-hidden border border-brand-light shadow-lg">
                <img 
                  src={activeServiceModal.image} 
                  alt={activeServiceModal.title}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] via-black/30 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-heading font-bold text-brand-gold uppercase tracking-wider bg-brand-dark/90 px-2.5 py-0.5 rounded border border-brand-gold/40">
                    On-Site Mughal Steel Installation Standard
                  </span>
                  <span className="text-[10px] text-stone-200 font-mono hidden sm:inline-block">
                    Rawalpindi & Islamabad Turnkey Service
                  </span>
                </div>
              </div>

              {/* Engineering Specs & Deliverables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-200">
                
                {/* Left Column: Full Description & Turnkey Workflow */}
                <div className="space-y-3">
                  <div className="bg-[#05080E] p-3 rounded-lg border border-brand-light/60 space-y-1.5">
                    <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Engineering Overview</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed font-sans text-xs">
                      {activeServiceModal.fullDescription}
                    </p>
                  </div>

                  <div className="bg-[#05080E] p-3 rounded-lg border border-brand-light/60 space-y-1.5">
                    <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>6-Step Execution Workflow</span>
                    </h4>
                    <ul className="space-y-1 text-slate-300 font-sans text-[11px]">
                      {activeServiceModal.process.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Key Technical Specs & Deliverables */}
                <div className="space-y-3">
                  <div className="bg-[#05080E] p-3 rounded-lg border border-brand-light/60 space-y-1.5">
                    <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Material & Fabrication Specs</span>
                    </h4>
                    <ul className="space-y-1 text-slate-300 font-sans text-[11px]">
                      {activeServiceModal.specs.map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-brand-gold font-bold">✓</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#05080E] p-3 rounded-lg border border-brand-light/60 space-y-1.5">
                    <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Key Deliverables</span>
                    </h4>
                    <ul className="space-y-1 text-slate-300 font-sans text-[11px]">
                      {activeServiceModal.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-brand-gold font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Direct Actions */}
            <div className="px-4 py-2.5 bg-[#070D18] border-t border-brand-light/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <Link
                to={activeServiceModal.categoryLink}
                onClick={() => setActiveServiceModal(null)}
                className="text-[11px] font-heading font-bold text-brand-gold hover:underline flex items-center gap-1 uppercase"
              >
                <span>{activeServiceModal.categoryLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppUrl(`*MUGHAL STEEL SERVICE INQUIRY*\nService: ${activeServiceModal.title}\nSubtitle: ${activeServiceModal.subtitle}\n\nHello Mughal Steel Engineering Team, I want to discuss a fabrication project for this service.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-navy text-[11px] py-1.5 px-3 font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Engg</span>
                </a>

                <Link
                  to="/quote"
                  onClick={() => setActiveServiceModal(null)}
                  className="btn-gold text-[11px] py-1.5 px-3 font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hidden Background Preloaders for Section Showcase Videos */}
      <div className="hidden" aria-hidden="true">
        {videoShowcases.map((v) => (
          <video key={`preload-${v.id}`} src={v.videoUrl} preload="metadata" muted playsInline />
        ))}
      </div>

    </div>
  );
};
