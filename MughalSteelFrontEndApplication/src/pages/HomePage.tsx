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
  Send, Mail, Phone, ChevronLeft, ChevronRight, Quote, Volume2, VolumeX
} from 'lucide-react';
import { PROJECT_CATEGORIES_DATA, SEED_PROJECTS } from '../data/seedData';
import { useSEO } from '../utils/useSEO';
import { openDirectEmail } from '../utils/emailHelper';
import { handleImageError, FALLBACK_IMAGE_URL } from '../utils/imageFallback';
import { CountUp } from '../components/common/CountUp';


export const HomePage: React.FC = () => {
  useSEO({
    title: 'Mughal Steel Fabrication | Steel Doors, Gates & Custom Fabrication',
    description: 'Premier architectural steel fabrication in Islamabad & Rawalpindi. Modern CNC laser-cut main gates, luxury wrought iron, safety grills, and stainless stairs.',
    keywords: 'Mughal Steel Fabrication, steel gates Islamabad, laser cut main gate, wrought iron railing, stainless stairs, Pakistan steel workshop',
    url: '/'
  });

  const location = useLocation();
  const { products, testimonials, addTestimonial, getWhatsAppUrl, categories, projects, settings } = useData();
  const { formatPrice } = useCurrency();
  const activeCategories = (categories && categories.length > 0) ? categories : PROJECT_CATEGORIES_DATA;


  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    videoUrl: string;
    description: string;
  } | null>(null);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isHeroMuted, setIsHeroMuted] = useState(true);

  // Interactive "What Is Your Project?" selector state
  const [selectedProjectType, setSelectedProjectType] = useState<string>('all');

  // Portfolio Completed vs Ongoing status filter state
  const [portfolioStatusTab, setPortfolioStatusTab] = useState<'all' | 'completed' | 'ongoing'>('all');

  // Active Service Tab for Large Image Showcase
  const [activeServiceTab, setActiveServiceTab] = useState<number>(0);

  // Products horizontal slider state & controls
  const productsSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkProductScroll = () => {
    if (productsSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = productsSliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollProducts = (direction: 'left' | 'right') => {
    if (productsSliderRef.current) {
      const scrollAmount = Math.max(productsSliderRef.current.clientWidth * 0.75, 300);
      productsSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Marquee manual scroll ref
  const marqueeSliderRef = useRef<HTMLDivElement>(null);
  const scrollMarquee = (direction: 'left' | 'right') => {
    if (marqueeSliderRef.current) {
      const scrollAmount = 320;
      marqueeSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Client Reviews Slider state
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isReviewsPaused, setIsReviewsPaused] = useState(false);

  // =========================================================================
  // HERO SLIDER CONFIGURATION (Full-Width Cinematic Carousel)
  // Slide 0: Mughal Steel Rawalpindi Fabrication Team Photo (Uploaded by User)
  // Slides 1-6: 6 Official Mughal Steel YouTube Showcase Videos
  // =========================================================================
  interface HeroSlideItem {
    id: string;
    type: 'video' | 'image';
    src?: string;
    videoSrc?: string;
    poster?: string;
    youtubeId?: string;
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    secondaryText: string;
    secondaryLink: string;
  }

  const heroSlides: HeroSlideItem[] = [
    {
      id: 'slide-intro-video',
      type: 'video',
      videoSrc: '/videos/video1.mp4',
      badge: 'Mughal Steel Workshop • High Court Road Yard',
      title: 'Specializing in Heavy Fabrication & Custom Solutions',
      description: 'Delivering high-tensile architectural CNC laser gates, luxury balustrades, and certified structural steel engineering across Islamabad & Rawalpindi.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'Explore Products',
      secondaryLink: '/items'
    },
    {
      id: 'slide-vid-1',
      type: 'video' as const,
      videoSrc: '/videos/hero_video_1.mp4',
      poster: '/videos/hero_poster_1.jpg',
      youtubeId: 'YHK1SWPQpoA',
      badge: 'Completed Project • Gulberg Greens Farmhouse',
      title: 'COMPLETED PROJECT: GULBERG GREENS FARMHOUSE',
      description: 'Executed Entirely by Mughal Steel Fabrication: Grand entrance gates, custom fencing & ornamental details, high-strength structural framework & heavy-duty fabrication, elegant architectural custom staircases, and premium-grade aluminum windows and fittings.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'View Project Details',
      secondaryLink: '/portfolio/gulberg-greens-farmhouse'
    },
    {
      id: 'slide-vid-2',
      type: 'video' as const,
      videoSrc: '/videos/hero_video_2.mp4',
      poster: '/videos/hero_poster_2.jpg',
      youtubeId: '2bw7KK7sVFg',
      badge: 'Luxury Villa • Arched Gate & Balcony Railings',
      title: 'Luxury Residence Arched Gate & Balcony Railings',
      description: 'Bespoke classical wrought iron installation featuring arched driveway entrance gate, boundary security grills, and matching upper balcony balustrades.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'Custom Design',
      secondaryLink: '/custom-design'
    },
    {
      id: 'slide-vid-3',
      type: 'video' as const,
      videoSrc: '/videos/hero_video_3.mp4',
      poster: '/videos/hero_poster_3.jpg',
      youtubeId: 'fTgElLgHO1s',
      badge: 'DHA Islamabad • Cast Iron & Steel Work',
      title: 'Crafting Excellence in Steel & Cast Iron at DHA',
      description: 'Premium estate metalwork completed at DHA Islamabad: classical cast iron balustrades, modern steel gates, and multi-stage powder coating.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'View Projects',
      secondaryLink: '/projects'
    },
    {
      id: 'slide-vid-4',
      type: 'video' as const,
      videoSrc: '/videos/hero_video_4.mp4',
      poster: '/videos/hero_poster_4.jpg',
      youtubeId: '9ccCSDyRn4Q',
      badge: 'Cast Iron Railings & Custom Iron Doors',
      title: 'Luxury Cast Iron Railings & Custom Iron Doors',
      description: 'Custom hand-forged cast iron balustrades, heavy structural entrance doors, and ornamental architectural metal decor completed Alhamdulillah.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'Explore Doors',
      secondaryLink: '/items'
    },
    {
      id: 'slide-vid-5',
      type: 'video' as const,
      videoSrc: '/videos/hero_video_5.mp4',
      poster: '/videos/hero_poster_5.jpg',
      youtubeId: 'tdK_xYFThrI',
      badge: 'Spanish Villa • Custom Balcony Railings & Gate',
      title: 'Spanish Villa Balcony Railings & Main Entrance Gate',
      description: 'Aerial drone survey of a premium Spanish villa featuring ornate laser-cut black balustrades, arched window ironwork, and automated main entrance gate.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'View Stairs',
      secondaryLink: '/items'
    }
  ];

  // Continuous Right-to-Left News Ticker tape highlights ("Why Choose Us")
  const whyChooseUsTickerItems = [
    {
      title: 'Nationwide Service',
      text: 'Delivering premium steel fabrication and structural solutions all across Pakistan.'
    },
    {
      title: 'Tailored for Every Structure',
      text: "Whether it's a modern house, a classic villa, or a commercial plaza, customized to your exact architectural style."
    },
    {
      title: 'Precision & Gauge Standards',
      text: 'Guaranteed structural strength using certified material gauges (14G / 12G) and accurate fabrication standards.'
    },
    {
      title: 'Expert Craftsmanship',
      text: 'Backed by professional expertise and precision MS projects nationwide since 1994.'
    },
    {
      title: '10-Year Warranty',
      text: 'Official structural weld strength & anti-corrosion chemical guarantee.'
    },
    {
      title: 'Free Laser Survey & Estimation',
      text: 'Twin Cities (Islamabad / Rawalpindi) & Nationwide Site Support • Call 0300-5197825'
    }
  ];

  const [previousSlide, setPreviousSlide] = useState<number | null>(null);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper to transition to a target slide with smooth crossfade
  const goToSlide = (nextIndex: number) => {
    if (nextIndex === currentSlide) return;
    setPreviousSlide(currentSlide);
    setCurrentSlide(nextIndex);
    setSlideProgress(0);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  };

  // Hero auto-slider controller:
  // - On Image slide (Slide 0): exactly 10-second timer gives the visitor time to read before advancing
  // - On Video slides (Slides 1-6): Video plays fully; onEnded event triggers nextSlide automatically
  useEffect(() => {
    // When active slide is a video, let the video's onEnded event trigger nextSlide
    if (heroSlides[currentSlide].type === 'video') {
      // Safety watchdog: in case video duration is long or blocked, advance after 70 seconds
      const watchdog = setTimeout(() => {
        nextSlide();
      }, 70000);
      return () => clearTimeout(watchdog);
    }

    // For image slide (Slide 0), exactly 10 seconds:
    const timer = setTimeout(() => {
      nextSlide();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentSlide, heroSlides.length]);

  // If a YouTube video is active, automatically advance to next slide as soon as it finishes (playerState === 0)
  useEffect(() => {
    const handleYouTubeMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const data = JSON.parse(e.data);
          if (data.event === 'infoDelivery' && data.info?.playerState === 0) {
            nextSlide();
          }
        }
      } catch {
        // ignore non-json messages
      }
    };

    window.addEventListener('message', handleYouTubeMessage);
    return () => window.removeEventListener('message', handleYouTubeMessage);
  }, [currentSlide]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
        slideTimerRef.current = null;
      }
    };
  }, []);

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

    // Forward to Formspree endpoint in background for email tracking
    const formspreeUrl = settings?.formspreeEndpoint || import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mppzrorn';
    fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Quick Quote Inquiry: ${quoteName} (${quoteCategory} - ${quoteItem})`,
        name: quoteName,
        phone: quotePhone,
        projectCategory: quoteCategory,
        fabricationItem: quoteItem,
        width: `${quoteWidth} ft`,
        height: `${quoteHeight} ft`,
        area: `${area} sq.ft`,
        estimatedPrice: `Rs. ${est.toLocaleString()}`,
        submittedAt: new Date().toLocaleString()
      })
    }).catch(err => console.warn('Formspree quick quote dispatch warning:', err));

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
      videoUrl: 'https://res.cloudinary.com/dfh28zk9/video/upload/q_auto,vc_h264/v1788502166/1_Kanal_House_Steel_Fabrication_Project_-_Faisalabad_-_Mughal_Steel_Fabrication.mp4',
      description: 'Comprehensive walkthrough of 1 Kanal luxury house steel fabrication in Faisalabad executed by Mughal Steel Fabrication. Featuring custom main entrance gate, boundary security grills, balcony railings, and interior stairs.'
    },
    {
      id: 'vid-showcase',
      title: 'Completed Project Overview',
      subtitle: 'Heavy Structural Steel Work & Railings',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://res.cloudinary.com/dfh28zk9/video/upload/q_auto,vc_h264/v1788502145/Overview_of_completed_project_Mughal_steel_fabrication_Steel_Work_Railing.mp4',
      description: 'Overview of completed site installation showcasing heavy-gauge steel fabrication, precision laser cutting, forge-welded balustrades, and powder-coated boundary walls.'
    },
    {
      id: 'vid-feedback',
      title: 'Customer Review & Feedback',
      subtitle: 'NDU Islamabad Project Handover',
      thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://res.cloudinary.com/dfh28zk9/video/upload/q_auto,vc_h264/v1788502154/Customer_Review_NDU_Islamabad_Project_completed_by_Mughal_Steel_Fab.mp4',
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
    { value: 'Muhammad Qasim', label: 'Owner & Operator' },
    { value: 'High Court Road', label: 'Rawalpindi, Pakistan' },
    { value: '30+', label: 'Years Metal Heritage' },
    { value: '100%', label: 'Heavy Structural Steel' }
  ];

  return (
    <div className="page-home-root w-full bg-[#05080E] text-stone-100 font-sans">
            {/* ======================================================== */}
      {/* 1. HOME SECTION: FULL-WIDTH CINEMATIC HERO SLIDER        */}
      {/* Slide 0: Glowing Hot Steel Rolling Mill Image            */}
      {/* Slides 1-4: 4 Workshop Fabrication Videos Sequentially  */}
      {/* ======================================================== */}
      <section 
        id="home" 
        className="relative scroll-mt-24 w-full min-h-[660px] sm:min-h-[720px] lg:min-h-[760px] xl:h-[88vh] xl:max-h-[890px] overflow-hidden bg-[#05080E] flex flex-col justify-between select-none"
        role="region"
        aria-roledescription="carousel"
        aria-label="Mughal Steel Production & Fabrication Showcase"
      >
        {/* Full-Width Slide Track: Edge-to-Edge Image & Videos with Smooth Crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            const isPrev = idx === previousSlide;

            return (
              <div 
                key={slide.id}
                aria-hidden={!isActive}
                aria-label={`Slide ${idx + 1} of ${heroSlides.length}: ${slide.title}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                  isActive 
                    ? 'opacity-100 z-10' 
                    : isPrev 
                      ? 'opacity-0 z-0 pointer-events-none' 
                      : 'opacity-0 -z-10 pointer-events-none'
                }`}
              >
                {slide.type === 'image' ? (
                  <div className="relative w-full h-full overflow-hidden bg-[#05080E]">
                    <img 
                      src={slide.src}
                      alt={slide.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover object-top sm:object-[center_25%] filter brightness-[0.92] contrast-[1.06]"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center pointer-events-none select-none">
                    {/* Native Hardware-Accelerated Smooth MP4 Stream */}
                    {slide.videoSrc ? (
                      isActive ? (
                        <video
                          key={`hero-vid-${slide.id}`}
                          src={slide.videoSrc}
                          poster={slide.poster}
                          autoPlay
                          muted={isHeroMuted}
                          playsInline
                          preload="auto"
                          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
                          onEnded={() => {
                            nextSlide();
                          }}
                          onError={() => {
                            setTimeout(nextSlide, 3000);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-black">
                          {slide.poster && (
                            <img 
                              src={slide.poster} 
                              alt="" 
                              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]" 
                            />
                          )}
                        </div>
                      )
                    ) : (
                      isActive && (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${slide.youtubeId}?autoplay=1&mute=1&loop=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&cc_load_policy=0&cc_lang_pref=none`}
                          title={slide.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          tabIndex={-1}
                          aria-hidden="true"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] min-w-full min-h-full border-0 object-cover pointer-events-none z-0 select-none scale-105"
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Cinematic Dark Gradient Overlays:
              - Left side gradient: Guarantees 100% crisp typography legibility matching reference
              - Top & bottom vignettes: Seamless blend with navigation header and credential ribbons */}
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#05080E] via-[#05080E]/95 sm:via-[#05080E]/90 to-transparent w-full sm:w-[70%] md:w-[55%] lg:w-[48%] pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05080E] via-[#05080E]/50 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#05080E]/90 via-[#05080E]/40 to-transparent pointer-events-none z-10" />
        </div>

        {/* Desktop Previous / Next Navigation Arrows */}
        <button 
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/75 border border-white/20 hover:border-brand-gold text-white hover:text-brand-gold items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/75 border border-white/20 hover:border-brand-gold text-white hover:text-brand-gold items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hero Content Area: Left-Aligned within Dark Shadow Boundary (never crosses to the right) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:pl-6 lg:pr-12 flex-1 flex flex-col justify-center py-6 sm:py-8 lg:py-10">
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-[420px] xl:max-w-[440px] text-left -ml-1 sm:-ml-2">
            
            {currentSlide === 0 ? (
              // Intro Video Slide: Clean Left Column Layout bounded by black shadow
              <div className="border-l-2 sm:border-l-[3px] border-[#cca04b] pl-3 sm:pl-4 space-y-2 sm:space-y-2.5">
                
                {/* Brand Hero Heading */}
                <div className="space-y-0.5">
                  <p className="text-white text-sm sm:text-base lg:text-lg font-heading font-medium tracking-wide drop-shadow">
                    Welcome to
                  </p>
                  <h1 className="flex flex-col items-start gap-0.5 font-heading font-black tracking-wider drop-shadow-2xl">
                    <span className="text-3xl sm:text-4xl lg:text-[48px] text-[#cca04b] border-b-2 sm:border-b-4 border-[#cca04b] pb-0.5 leading-none font-black inline-block">
                      Mughal
                    </span>
                    <span className="text-2xl sm:text-3xl lg:text-[36px] text-white leading-tight font-black">
                      Steel Fabrication.
                    </span>
                  </h1>
                </div>

                {/* Tagline / Subtitle */}
                <p className="text-[11px] sm:text-xs text-stone-200 font-sans font-semibold drop-shadow-md leading-snug">
                  Premium Steel &amp; Metal Fabrication Solutions <span className="text-[#cca04b] font-bold mx-1">|</span> Serving All Over Pakistan
                </p>

                {/* Action Buttons: Explore Projects & Get a Free Quote */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center justify-center bg-[#cca04b] hover:bg-[#d8ad56] text-stone-950 font-heading font-bold text-xs px-4 sm:px-5 py-2 rounded-md shadow-lg hover:shadow-[0_0_20px_rgba(204,160,75,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Explore Projects</span>
                  </Link>

                  <Link 
                    to="/quote" 
                    className="inline-flex items-center justify-center bg-black/60 hover:bg-black/85 text-white border border-stone-400/80 hover:border-white font-heading font-medium text-xs px-4 sm:px-5 py-2 rounded-md backdrop-blur-md shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Get a Free Quote</span>
                  </Link>
                </div>

                {/* Direct Call Number Placed Directly UNDER the Explore Projects Buttons Section */}
                <div className="pt-0.5">
                  <a 
                    href="tel:03005197825"
                    className="inline-flex items-center gap-1.5 text-white hover:text-[#cca04b] font-heading font-bold text-xs tracking-wider py-0.5 transition-colors drop-shadow group"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#cca04b]/20 flex items-center justify-center group-hover:bg-[#cca04b]/30 transition-colors">
                      <Phone className="w-3 h-3 text-[#cca04b]" />
                    </div>
                    <span className="font-mono font-bold text-stone-100 text-xs">0300-5197825</span>
                  </a>
                </div>

                {/* 4 Architectural Fabrication Specialties */}
                <div className="pt-1 space-y-1.5 text-left">
                  <div>
                    <h2 className="text-xs font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 decoration-[#cca04b]">
                      WROUGHT &amp; CAST IRON WORK,
                    </h2>
                    <p className="text-[11px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Custom double-height main entrance doors, heavy-duty security gates, and ornamental window panels crafted to perfection.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 decoration-[#cca04b]">
                      MODERN STAIRCASES,
                    </h2>
                    <p className="text-[11px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Precision-engineered spiral stairs, L-shaped staircases, and single-beam structures with marble-topped steel steps.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 decoration-[#cca04b]">
                      GLASS RAILINGS &amp; CNC GRILLS,
                    </h2>
                    <p className="text-[11px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Tempered glass balcony railings, architectural fences, and intricate CNC laser-cut metal panels.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 decoration-[#cca04b]">
                      SHADE PERGOLAS &amp; CANOPIES,
                    </h2>
                    <p className="text-[11px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Durable outdoor fencing systems and modern retractable shade pergolas with tensile fabric.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              // Video Slides: Active Project Headline & Dynamic Info
              <div className="border-l-2 sm:border-l-[3px] border-[#cca04b] pl-3 sm:pl-4 space-y-2 sm:space-y-3">
                
                {/* Project Header Tag & Byline */}
                <div className="space-y-0.5">
                  <p className="text-xs font-heading font-black uppercase tracking-wider text-[#cca04b] drop-shadow">
                    COMPLETE RESIDENTIAL FABRICATION PROJECT
                  </p>
                  <p className="text-[11px] font-heading font-medium text-white tracking-wide drop-shadow">
                    Crafted With Perfection By
                  </p>
                </div>

                <div className="space-y-0.5">
                  <h1 className="flex flex-col items-start gap-0.5 font-heading font-black tracking-wider drop-shadow-2xl">
                    <span className="text-3xl sm:text-4xl lg:text-[48px] text-[#cca04b] border-b-2 sm:border-b-4 border-[#cca04b] pb-0.5 leading-none font-black inline-block">
                      Mughal
                    </span>
                    <span className="text-2xl sm:text-3xl lg:text-[36px] text-white leading-tight font-black">
                      Steel Fabrication.
                    </span>
                  </h1>

                  {/* Golden Subtitle directly under Mughal Steel Fabrication */}
                  <p className="text-[11px] sm:text-xs font-heading font-bold text-[#cca04b] uppercase tracking-wide drop-shadow pt-0.5">
                    Featuring custom wrought iron gates, security Grills and premium aluminum windows
                  </p>

                  <p className="text-xs sm:text-sm font-heading font-bold text-stone-200 uppercase tracking-wide drop-shadow pt-0.5">
                    {heroSlides[currentSlide].title}
                  </p>
                </div>

                <p className="text-[11px] sm:text-xs text-stone-300/95 font-sans font-normal leading-relaxed drop-shadow-md">
                  {heroSlides[currentSlide].description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center justify-center bg-[#cca04b] hover:bg-[#d8ad56] text-stone-950 font-heading font-bold text-xs px-4 sm:px-5 py-2 rounded-md shadow-lg hover:shadow-[0_0_20px_rgba(204,160,75,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Explore Projects</span>
                  </Link>

                  <Link 
                    to="/quote" 
                    className="inline-flex items-center justify-center bg-black/50 hover:bg-black/80 text-white border border-stone-500/70 hover:border-stone-300 font-heading font-medium text-xs px-4 sm:px-5 py-2 rounded-md backdrop-blur-md shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Get a Free Quote</span>
                  </Link>
                </div>

                {/* Direct Call Number Placed Directly UNDER the Explore Projects Buttons Section */}
                <div className="pt-0.5">
                  <a 
                    href="tel:03005197825"
                    className="inline-flex items-center gap-1.5 text-white hover:text-[#cca04b] font-heading font-bold text-xs tracking-wider py-0.5 transition-colors drop-shadow group"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#cca04b]/20 flex items-center justify-center group-hover:bg-[#cca04b]/30 transition-colors">
                      <Phone className="w-3 h-3 text-[#cca04b]" />
                    </div>
                    <span className="font-mono font-bold text-stone-100 text-xs">0300-5197825</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Hero Controls Bar: Online Badge (Left) | Circular Pagination (Center) | Unmute Audio (Right) */}
        <div className="relative z-30 w-full pb-2 sm:pb-2.5 px-3 sm:px-6 flex items-center justify-between">
          {/* Left: Floating Online Badge */}
          <div className="w-28 sm:w-36 flex justify-start">
            <a 
              href={whatsappDirect}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex bg-[#f38300] hover:bg-[#ff9514] text-white font-heading font-black text-xs px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-t-lg shadow-2xl items-center gap-1.5 sm:gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <span>Online</span>
            </a>
          </div>

          {/* Center: Circular Pagination Dots • • ⦿ • • */}
          <div className="flex items-center justify-center gap-2 sm:gap-3" role="tablist" aria-label="Slider Pagination">
            {heroSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={`dot-${slide.id}`}
                  onClick={() => goToSlide(idx)}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  className="relative p-1.5 flex items-center justify-center focus:outline-none group cursor-pointer"
                >
                  {isActive ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform scale-110">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-white/50 group-hover:bg-white group-hover:scale-125 transition-all shadow-md" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Unmute Audio Toggle Button */}
          <div className="w-28 sm:w-36 flex justify-end">
            <button
              onClick={() => setIsHeroMuted(!isHeroMuted)}
              aria-label={isHeroMuted ? "Unmute Video" : "Mute Video"}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 border border-white/25 hover:border-brand-gold text-white hover:text-brand-gold text-xs font-heading font-medium backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer select-none"
            >
              {isHeroMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Unmute Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Audio On</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Continuous News Ticker Tape (Black Strip with White Text Moving Right-to-Left) */}
        <div className="relative z-30 w-full bg-black border-t border-b border-[#cca04b]/40 py-2 sm:py-2.5 overflow-hidden flex items-center shadow-2xl">
          {/* Static Left Badge */}
          <div className="shrink-0 bg-gradient-to-r from-[#cca04b] via-[#e6c87a] to-[#cca04b] text-brand-dark font-heading font-black text-[11px] sm:text-xs uppercase px-3 sm:px-4 py-1.5 flex items-center gap-1.5 z-20 shadow-md ml-0 select-none">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="tracking-wider">WHY CHOOSE US</span>
          </div>

          {/* Marquee Viewport with Infinite Right-to-Left Gliding Track */}
          <div className="overflow-hidden w-full flex items-center select-none py-0.5">
            <div className="news-ticker-track flex items-center gap-8 whitespace-nowrap pl-4">
              {/* Set 1 */}
              {whyChooseUsTickerItems.map((item, idx) => (
                <div key={`ticker-item-1-${idx}`} className="inline-flex items-center gap-2">
                  <span className="text-[#cca04b] font-heading font-black text-xs sm:text-[13px] uppercase tracking-wider">
                    {item.title}:
                  </span>
                  <span className="text-white font-medium text-xs sm:text-[13px] tracking-wide">
                    {item.text}
                  </span>
                  <span className="text-[#cca04b] font-bold text-sm px-2 select-none">✦</span>
                </div>
              ))}
              {/* Set 2 (Duplicate for Seamless Infinite Marquee Loop) */}
              {whyChooseUsTickerItems.map((item, idx) => (
                <div key={`ticker-item-2-${idx}`} className="inline-flex items-center gap-2" aria-hidden="true">
                  <span className="text-[#cca04b] font-heading font-black text-xs sm:text-[13px] uppercase tracking-wider">
                    {item.title}:
                  </span>
                  <span className="text-white font-medium text-xs sm:text-[13px] tracking-wide">
                    {item.text}
                  </span>
                  <span className="text-[#cca04b] font-bold text-sm px-2 select-none">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtle Fade Gradient on Right Edge */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10" />
        </div>
      </section>

      {/* Floating Live Workshop & Engineering Credentials Ribbon */}
      <div className="w-full bg-[#080D17] border-b border-brand-light/50 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Active Workshop Floor */}
          <div className="bg-brand-navy/60 hover:bg-brand-navy border border-brand-light/70 hover:border-brand-gold/60 p-4 rounded-xl shadow-lg flex items-center gap-3.5 transition-all group">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
              <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-heading font-black text-brand-gold uppercase tracking-wide">
                Active Workshop Floor
              </div>
              <div className="text-[11px] text-slate-200 font-sans drop-shadow-sm">
                Rawalpindi Industrial Fabrication Yard • Live On-Site
              </div>
            </div>
          </div>

          {/* Card 2: Heritage & Client Rating */}
          <div className="bg-brand-navy/60 hover:bg-brand-navy border border-brand-light/70 hover:border-brand-gold/60 p-4 rounded-xl shadow-lg flex items-center gap-3.5 transition-all group">
            <Award className="w-5 h-5 text-brand-gold shrink-0" />
            <div className="space-y-0.5">
              <div className="text-xs font-heading font-black text-stone-100 uppercase tracking-wide flex items-center gap-1.5 drop-shadow-sm">
                <span>30+ Years Heritage</span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
              <div className="text-[11px] text-slate-200 font-sans drop-shadow-sm">
                5,000+ Precision MS Projects in Twin Cities
              </div>
            </div>
          </div>

          {/* Card 3: Engineering Assurance */}
          <div className="bg-brand-navy/60 hover:bg-brand-navy border border-brand-light/70 hover:border-brand-gold/60 p-4 rounded-xl shadow-lg flex items-center gap-3.5 transition-all group">
            <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0" />
            <div className="space-y-0.5">
              <div className="text-xs font-heading font-black text-stone-100 uppercase tracking-wide drop-shadow-sm">
                10-Year Warranty
              </div>
              <div className="text-[11px] text-slate-200 font-sans drop-shadow-sm">
                Anti-Sag Structural Warranty & Multi-Stage Primer
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PRODUCTS SECTION: FRONT GATES & MODERN HOME ITEMS     */}
      {/* ======================================================== */}
      <section id="products" className="cv-auto scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ======================================================== */}
          {/* INTERACTIVE "WHAT IS YOUR PROJECT?" SELECTOR             */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-b from-brand-navy/90 to-[#070D18] border border-brand-gold/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-light/40 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded-full shadow-sm">
                  <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" />
                  <span>Interactive Project Finder</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-stone-100 uppercase tracking-wider flex flex-wrap items-center gap-2">
                  <span>WHAT IS</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-300 to-brand-gold drop-shadow">
                    YOUR PROJECT?
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl">
                  Select what you are fabricating. We automatically match certified structural steel gauges, CNC laser patterns, and instant square footage rates.
                </p>
              </div>

              {selectedProjectType !== 'all' && (
                <button
                  onClick={() => setSelectedProjectType('all')}
                  className="self-start md:self-auto text-xs font-mono font-bold text-brand-gold hover:text-white flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-brand-gold/30 hover:border-brand-gold transition cursor-pointer"
                >
                  <span>Reset Filter ({products.length} Products)</span>
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Project Category Selection Pills / Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  id: 'all',
                  title: 'All Projects',
                  badge: 'Full Catalog',
                  icon: '✨',
                  desc: 'All custom fabrication'
                },
                {
                  id: 'modern',
                  title: 'Modern Villa',
                  badge: '14G CNC Laser',
                  icon: '🏡',
                  desc: 'Laser gates & glass rails'
                },
                {
                  id: 'classical',
                  title: 'Classical Kothi',
                  badge: 'Solid Wrought Iron',
                  icon: '🏛️',
                  desc: 'Arched gates & scrolls'
                },
                {
                  id: 'commercial',
                  title: 'Commercial Plaza',
                  badge: 'Heavy Structural',
                  icon: '🏢',
                  desc: 'Glass facades & pivot doors'
                },
                {
                  id: 'farm',
                  title: 'Farmhouse Estate',
                  badge: 'Heavy MS Pipes',
                  icon: '🌾',
                  desc: 'Perimeter fence & pergolas'
                },
                {
                  id: 'aluminum-glass',
                  title: 'Aluminum & Glass',
                  badge: 'Acoustic / Pivot',
                  icon: '🪟',
                  desc: '12mm tempered pivot doors'
                }
              ].map((proj) => {
                const isSelected = selectedProjectType === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectType(proj.id)}
                    className={`relative p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer card-interactive ${
                      isSelected
                        ? 'bg-gradient-to-b from-brand-medium to-brand-navy border-brand-gold shadow-[0_0_25px_rgba(204,160,75,0.35)] scale-[1.02]'
                        : 'bg-black/40 border-brand-light/50 hover:border-brand-gold/60 hover:bg-black/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl">{proj.icon}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isSelected 
                          ? 'bg-brand-gold text-brand-dark' 
                          : 'bg-stone-800 text-stone-300'
                      }`}>
                        {proj.badge}
                      </span>
                    </div>

                    <div className="pt-2.5 space-y-0.5">
                      <h4 className={`font-heading font-black text-xs uppercase tracking-wider line-clamp-1 ${
                        isSelected ? 'text-brand-gold' : 'text-stone-100'
                      }`}>
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-sans line-clamp-1">
                        {proj.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Project Match Alert Banner */}
            {selectedProjectType !== 'all' && (() => {
              const activeProjObj = [
                { id: 'modern', name: 'Modern Villa & Luxury Home', gauge: '14-Gauge (2.0mm) Certified Mild Steel', finishing: 'Electrostatic Matte Charcoal / Jet Black Powder Coat (200°C Oven Bake)', highlight: '±0.1mm Fiber Laser CNC Cut Motifs, Concealed Heavy Ball-Bearing Hinges & Frameless 12mm Tempered Glass' },
                { id: 'classical', name: 'Classical Villa & Spanish Kothi', gauge: 'Solid Hand-Forged Carbon Steel Bars (16mm-25mm)', finishing: 'Multi-Stage Hot-Zinc Anti-Rust Primer with Hand-Rubbed Antique Gold & Copper Patina', highlight: 'Master Blacksmith Acanthus Leaves, Majestic Arched Driveway Gates & Classical Balustrades' },
                { id: 'commercial', name: 'Commercial Plaza & Offices', gauge: 'Heavy I-Beam & Structural Carbon Steel Channels', finishing: 'High-Durability Industrial Epoxy & Polyurethane Weather Coating', highlight: 'Acoustic Soundproof Facades, Concealed Hydraulic Floor-Spring Pivot Doors & Fire Spiral Stairs' },
                { id: 'farm', name: 'Farmhouse & Agrarian Estate', gauge: 'Hot-Dip Galvanized Heavy MS Pipes (Schedule 40)', finishing: '85+ Micron Hot-Dip Molten Zinc Galvanization (ISO 1461)', highlight: 'Heavy Automated Sliding Ranch Gates, Anti-Rust Perimeter Fencing & Shaded Steel Pergolas' },
                { id: 'aluminum-glass', name: 'Architectural Aluminum & Glass Systems', gauge: 'Commercial 6063-T6 Architectural Extrusions', finishing: 'AkzoNobel Architectural Powder Coating / Anodized Finish', highlight: 'German Hydraulic Floor Springs (350kg load), 12mm Toughened Safety Glass & Weatherproof EPDM' }
              ].find(x => x.id === selectedProjectType);

              if (!activeProjObj) return null;

              return (
                <div className="bg-black/60 border border-brand-gold/60 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-black text-brand-gold uppercase tracking-wider">
                        Tailored Fabrication Standard for: {activeProjObj.name}
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                        Recommended Standards
                      </span>
                    </div>
                    <p className="text-xs text-stone-200 font-sans">
                      <strong className="text-brand-gold">Steel Standard:</strong> {activeProjObj.gauge} • <strong className="text-brand-gold">Finish:</strong> {activeProjObj.finishing}
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {activeProjObj.highlight}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={getWhatsAppUrl(`Hello Mughal Steel, I am planning a project: ${activeProjObj.name}. Please send recommended designs, gauge specifications, and quotation.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold text-[11px] py-2 px-4 uppercase font-bold tracking-wider flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-brand-dark" />
                      <span>Inquire This Project</span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section Header with Slider Navigation Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded">
                <span>Certified Gauges &amp; CNC Laser Work</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-wider flex flex-wrap items-center gap-2">
                <span>FRONT GATES &amp;</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold drop-shadow">
                  CUSTOM FABRICATIONS
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Precision CNC laser-cut sheets, heavy structural pipes, and imported roller automation options.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Previous / Next Arrow Controls */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => scrollProducts('left')} 
                  aria-label="Previous products"
                  className="p-2 rounded-full border border-brand-gold/40 bg-brand-navy hover:bg-brand-gold hover:text-brand-dark text-brand-gold transition-all duration-300 shadow-md cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollProducts('right')} 
                  aria-label="Next products"
                  className="p-2 rounded-full border border-brand-gold/40 bg-brand-navy hover:bg-brand-gold hover:text-brand-dark text-brand-gold transition-all duration-300 shadow-md cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <Link to="/items" className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1">
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Product Cards Interactive Horizontal Slider */}
          <div 
            ref={productsSliderRef}
            onScroll={checkProductScroll}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 slider-snap scroll-smooth no-scrollbar"
          >
            {(() => {
              const filteredProds = selectedProjectType === 'all'
                ? products
                : products.filter(p => {
                    const catMap: Record<string, string> = {
                      modern: 'Modern Home',
                      classical: 'Classical Home',
                      commercial: 'Commercial',
                      farm: 'Farm',
                      'aluminum-glass': 'Aluminum & Glass'
                    };
                    const targetCat = catMap[selectedProjectType];
                    if (!targetCat) return true;
                    return (p.category && p.category.toLowerCase().includes(targetCat.toLowerCase())) ||
                           (p.name && p.name.toLowerCase().includes(targetCat.toLowerCase()));
                  });
              const prodsToRender = (filteredProds.length > 0 ? filteredProds : products).slice(0, 14);

              return prodsToRender.map((prod) => (
              <div 
                key={prod.id} 
                className="w-[280px] sm:w-[310px] md:w-[320px] shrink-0 group bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden hover:border-brand-gold transition-all duration-300 flex flex-col justify-between shadow-xl card-interactive"
              >
                <Link to={`/product/${prod.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-black block">
                  <img 
                    src={prod.images?.[0] || prod.frontImage || FALLBACK_IMAGE_URL} 
                    alt={prod.name} 
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/80 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-gold/40 shadow badge-pulse-loop">
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
                      <span className="text-xs font-mono font-bold text-brand-gold product-price-loop">
                        {formatPrice(prod.pricePerSqFt || 2500)} / sq.ft
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/product/${prod.slug}`} className="btn-gold btn-shimmer text-[10px] py-2 text-center justify-center font-bold">
                        <span>Details</span>
                      </Link>
                      <Link to={`/try-at-home?product=${prod.productCode}`} className="btn-outline text-[10px] py-2 text-center justify-center font-bold">
                        <span>Try on Photo</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ));
            })()}
          </div>

          {/* 16 Modern Home Items Row with Infinite Smooth Marquee & Controls */}
          <div className="space-y-6 pt-6 border-t border-brand-light/30">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-light/40 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-2.5 py-0.5 rounded border border-brand-gold/30 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                    <span>Continuous Gliding Gallery</span>
                  </span>
                </div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-stone-100 uppercase tracking-wider flex flex-wrap items-center gap-2">
                  <span>16 MODERN HOME</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold drop-shadow">
                    FABRICATION ITEMS
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  Smooth gliding architectural elements • Hover mouse over any item to pause and inspect specifications
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => scrollMarquee('left')}
                    aria-label="Scroll left"
                    className="p-1.5 rounded-full border border-brand-gold/40 bg-brand-navy hover:bg-brand-gold hover:text-brand-dark text-brand-gold transition-all text-xs cursor-pointer shadow active:scale-95"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => scrollMarquee('right')}
                    aria-label="Scroll right"
                    className="p-1.5 rounded-full border border-brand-gold/40 bg-brand-navy hover:bg-brand-gold hover:text-brand-dark text-brand-gold transition-all text-xs cursor-pointer shadow active:scale-95"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link to="/categories/modern-home" className="text-xs text-brand-gold font-bold hover:underline">
                  Explore Category →
                </Link>
              </div>
            </div>

            {/* Continuous Infinite Marquee Track with Double Buffer */}
            <div 
              ref={marqueeSliderRef}
              className="overflow-x-auto no-scrollbar scroll-smooth relative py-2"
            >
              <div className="flex gap-4 w-max marquee-track hover:[animation-play-state:paused] animate-marquee">
                {[
                  { name: 'Front Gate', subtitle: 'CNC Laser & Heavy MS', link: '/items?item=Front+Gates', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Balcony Railing', subtitle: 'Stainless & Tempered Glass', link: '/items?item=Balcony+Railing', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Boundary Wall Grills', subtitle: 'Anti-Climb Security Grills', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Window Grills', subtitle: 'Designer Security Frames', link: '/items?item=Grills', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Pivot Front Door', subtitle: 'Heavy Structural Pivot', link: '/items?item=Doors', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Spiral Staircase', subtitle: 'Cantilever & Spiral Steps', link: '/items?item=Stair+Railing', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Stair Railings', subtitle: 'TIG Welded MS & SS 304', link: '/items?item=Railing', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Car Porch Shed', subtitle: 'Heavy Cantilever Canopy', link: '/items?item=Sheds+%26+Canopies', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
                  { name: 'AC Outdoor Cage', subtitle: 'Security & Anti-Theft Guard', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Architectural Louvers', subtitle: 'Sunshade Airflow Panels', link: '/items?item=Grills', image: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Steel Pergola', subtitle: 'Rooftop & Garden Pergola', link: '/items?item=Sheds+%26+Canopies', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Frameless Glass Balustrade', subtitle: '12mm Tempered Core', link: '/items?item=Railing', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Modern Duct Covers', subtitle: 'Laser Cut Floor Trench Grates', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Planters & Trellis', subtitle: 'Vertical Garden Steel Work', link: '/items?item=Grills', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Boundary Spikes', subtitle: 'Laser Precision Security Spikes', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Automated Gate Motors', subtitle: 'Italian Heavy-Duty Automation', link: '/items?item=Front+Gates', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80' },
                  // Buffer duplicate for infinite loop
                  { name: 'Front Gate', subtitle: 'CNC Laser & Heavy MS', link: '/items?item=Front+Gates', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Balcony Railing', subtitle: 'Stainless & Tempered Glass', link: '/items?item=Balcony+Railing', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Boundary Wall Grills', subtitle: 'Anti-Climb Security Grills', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Window Grills', subtitle: 'Designer Security Frames', link: '/items?item=Grills', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Pivot Front Door', subtitle: 'Heavy Structural Pivot', link: '/items?item=Doors', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Spiral Staircase', subtitle: 'Cantilever & Spiral Steps', link: '/items?item=Stair+Railing', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Stair Railings', subtitle: 'TIG Welded MS & SS 304', link: '/items?item=Railing', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Car Porch Shed', subtitle: 'Heavy Cantilever Canopy', link: '/items?item=Sheds+%26+Canopies', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
                  { name: 'AC Outdoor Cage', subtitle: 'Security & Anti-Theft Guard', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Architectural Louvers', subtitle: 'Sunshade Airflow Panels', link: '/items?item=Grills', image: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Steel Pergola', subtitle: 'Rooftop & Garden Pergola', link: '/items?item=Sheds+%26+Canopies', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Frameless Glass Balustrade', subtitle: '12mm Tempered Core', link: '/items?item=Railing', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Modern Duct Covers', subtitle: 'Laser Cut Floor Trench Grates', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Planters & Trellis', subtitle: 'Vertical Garden Steel Work', link: '/items?item=Grills', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Boundary Spikes', subtitle: 'Laser Precision Security Spikes', link: '/items?item=Boundary+Wall+Grills', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Automated Gate Motors', subtitle: 'Italian Heavy-Duty Automation', link: '/items?item=Front+Gates', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80' }
                ].map((item, idx) => (
                  <Link
                    key={`${item.name}-${idx}`}
                    to={item.link}
                    className="group w-40 sm:w-48 shrink-0 bg-brand-navy border border-brand-light/60 hover:border-brand-gold rounded-lg overflow-hidden p-2.5 space-y-2 transition-all duration-300 shadow-md text-center block card-interactive"
                  >
                    <div className="aspect-[4/3] rounded overflow-hidden bg-black relative">
                      <img 
                        src={item.image || FALLBACK_IMAGE_URL} 
                        alt={item.name} 
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-heading font-bold text-xs text-stone-100 group-hover:text-brand-gold transition-colors truncate uppercase">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
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
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
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
      {/* 3. OUR PROJECTS: COMPLETED & ONGOING SITES PORTFOLIO     */}
      {/* Shows Since 1994, 1,500+ Projects, and Active Sites      */}
      {/* ======================================================== */}
      <section id="projects" className="cv-auto scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-light/40 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded-full shadow-sm">
                <Factory className="w-3.5 h-3.5 text-brand-gold" />
                <span>Established 1994 • 30+ Years Metal Heritage</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black text-stone-100 uppercase tracking-wider flex flex-wrap items-center gap-2">
                <span>OUR PROJECTS &amp;</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold drop-shadow">
                  SITE EXECUTION
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl">
                Over 1,500+ luxury residential villas, commercial plazas, and society entrances executed across Pakistan. Explore our recently completed handovers alongside live on-site installations.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link 
                to="/portfolio"
                className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1.5 uppercase tracking-wider bg-black/60 px-4 py-2.5 rounded-lg border border-brand-gold/40 shadow-md hover:border-brand-gold transition"
              >
                <span>Complete Portfolio ({projects.length} Works)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Company Heritage & Milestone Statistics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-brand-navy to-[#060A12] border border-brand-light/60 p-5 rounded-xl space-y-1 shadow-lg hover:border-brand-gold transition-all card-interactive">
              <div className="flex items-center justify-between text-brand-gold">
                <span className="text-xs font-mono font-bold uppercase">Experience</span>
                <Award className="w-4 h-4" />
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-black text-white">
                <CountUp end={1994} duration={1000} prefix="Since " />
              </p>
              <p className="text-[11px] text-slate-400 font-sans">30+ Years of Metalworking &amp; Structural Heritage</p>
            </div>

            <div className="bg-gradient-to-br from-brand-navy to-[#060A12] border border-brand-light/60 p-5 rounded-xl space-y-1 shadow-lg hover:border-brand-gold transition-all card-interactive">
              <div className="flex items-center justify-between text-brand-gold">
                <span className="text-xs font-mono font-bold uppercase">Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-black text-white">
                <CountUp end={1500} duration={1000} suffix="+ Projects" separator={true} />
              </p>
              <p className="text-[11px] text-slate-400 font-sans">Delivered Nationwide with Zero Defect Rate</p>
            </div>

            <div className="bg-gradient-to-br from-brand-navy to-[#060A12] border border-brand-light/60 p-5 rounded-xl space-y-1 shadow-lg hover:border-brand-gold transition-all card-interactive">
              <div className="flex items-center justify-between text-brand-gold">
                <span className="text-xs font-mono font-bold uppercase">Certified Standard</span>
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-black text-white">
                <CountUp end={100} duration={1000} suffix="% Gauge" />
              </p>
              <p className="text-[11px] text-slate-400 font-sans">14G / 12G Certified High-Tensile Mild Steel</p>
            </div>

            <div className="bg-gradient-to-br from-brand-navy to-[#060A12] border border-brand-light/60 p-5 rounded-xl space-y-1 shadow-lg hover:border-brand-gold transition-all card-interactive">
              <div className="flex items-center justify-between text-brand-gold">
                <span className="text-xs font-mono font-bold uppercase">Warranty</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-black text-white">
                <CountUp end={10} duration={1000} suffix="-Year Cover" />
              </p>
              <p className="text-[11px] text-slate-400 font-sans">Official Structural Strength &amp; Anti-Rust Guarantee</p>
            </div>
          </div>

          {/* Interactive Status Filter Tabs: All vs Completed vs Ongoing Sites */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {[
              { id: 'all', label: 'All Projects (8)', badge: 'Overview' },
              { id: 'completed', label: 'Completed & Handed Over (5)', badge: '100% Verified', color: 'text-emerald-400' },
              { id: 'ongoing', label: 'Active On-Site Installations (3)', badge: 'Live Erection', color: 'text-amber-400' }
            ].map((tab) => {
              const isActive = portfolioStatusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPortfolioStatusTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer card-interactive ${
                    isActive
                      ? 'bg-brand-gold text-brand-dark shadow-[0_0_20px_rgba(204,160,75,0.4)] scale-105'
                      : 'bg-brand-navy/80 border border-brand-light/60 text-stone-300 hover:border-brand-gold/60 hover:text-brand-gold'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tab.id === 'ongoing' ? 'bg-amber-400 animate-pulse' : tab.id === 'completed' ? 'bg-emerald-400' : 'bg-brand-gold'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Projects Showcase Cards Grid */}
          {(() => {
            const allPortfolioProjects = [
              {
                id: 'proj-comp-1',
                status: 'completed',
                statusLabel: 'Completed & Handed Over',
                title: '1 Kanal Luxury Residence - Faisalabad',
                location: 'Canal Road, Faisalabad',
                clientType: 'Private Luxury Villa',
                gaugeSpec: '14-Gauge MS & ±0.1mm CNC Fiber Laser',
                finishSpec: 'Matte Jet-Black Electrostatic Powder Coat (200°C)',
                deliverables: 'Main Driveway Gate, Boundary Wall Grills, Balcony Railings, Spiral Stairs',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/1-kanal-house-steel-fabrication'
              },
              {
                id: 'proj-comp-2',
                status: 'completed',
                statusLabel: 'Completed & Handed Over',
                title: 'Gulberg Greens Modern Farmhouse',
                location: 'Gulberg Greens, Islamabad',
                clientType: 'Country Estate & Farmhouse',
                gaugeSpec: 'Schedule 40 Galvanized Heavy MS Pipes',
                finishSpec: 'Triple Hot-Zinc Chemical Primer & Protective Powder Coat',
                deliverables: 'Grand Entrance Gate, 1,200 RFT Security Fencing, Custom Porch Pergola',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/gulberg-greens-farmhouse'
              },
              {
                id: 'proj-comp-3',
                status: 'completed',
                statusLabel: 'Completed & Handed Over',
                title: 'National Defence University (NDU) Handover',
                location: 'Sector E-9, Islamabad',
                clientType: 'Institutional & High-Security',
                gaugeSpec: '12-Gauge Heavy Mild Steel Structural Channels',
                finishSpec: 'Anti-Rust Zinc-Rich Epoxy Coating',
                deliverables: 'Heavy Guarded Security Gates, Pedestrian Turnstiles, Automated Barriers',
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/ndu-islamabad'
              },
              {
                id: 'proj-comp-4',
                status: 'completed',
                statusLabel: 'Completed & Handed Over',
                title: 'Bahria Town Modern Villa Main Gate',
                location: 'Bahria Town Phase 7, Rawalpindi',
                clientType: 'Residential Bungalow',
                gaugeSpec: '14-Gauge CNC Geometric Laser Cut MS',
                finishSpec: 'Charcoal Grey Electrostatic Powder Coat',
                deliverables: 'Automated Sliding Gate with Italian Motor, Frameless Glass Balconies',
                image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/bahria-town-villa'
              },
              {
                id: 'proj-comp-5',
                status: 'completed',
                statusLabel: 'Completed & Handed Over',
                title: 'Classical Arch Spanish Kothi',
                location: 'DHA Phase 2, Islamabad',
                clientType: 'Classical Heritage Villa',
                gaugeSpec: 'Solid Hand-Forged Carbon Steel (20mm solid bars)',
                finishSpec: 'Hand-Rubbed Antique Roman Bronze & Gold Leaf Accents',
                deliverables: 'Arched Double Wrought Iron Driveway Gate, Curved Balustrades',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/classical-arch-residence'
              },
              {
                id: 'proj-ong-1',
                status: 'ongoing',
                statusLabel: 'Active On-Site Erection (85%)',
                title: 'Oversized Pivot Door Installation',
                location: 'Sector F-7/2, Islamabad',
                clientType: 'Contemporary Architect Villa',
                gaugeSpec: '6063-T6 Thermal-Break Profile with 12mm Acoustic Glass',
                finishSpec: 'Deep Matte Anodized Architectural Black',
                deliverables: '5x10 ft Hydraulic Floor-Spring Pivot Entrance Door & Laser Leveling',
                image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/sector-f7-pivot-door'
              },
              {
                id: 'proj-ong-2',
                status: 'ongoing',
                statusLabel: 'Active On-Site Erection (60%)',
                title: 'Commercial Plaza Glass & Steel Sub-Frame',
                location: 'Sector G-13 Markaz, Islamabad',
                clientType: 'Commercial Corporate Plaza',
                gaugeSpec: 'Heavy I-Beam & Structural Channel Portal Trusses',
                finishSpec: 'AkzoNobel High-Endurance Powder Coat',
                deliverables: 'Multi-Storey Glass Curtain Sub-Frame, Fire Spiral Escape Stairs',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/commercial-plaza-g13'
              },
              {
                id: 'proj-ong-3',
                status: 'ongoing',
                statusLabel: 'Fabrication Yard Stage (45%)',
                title: 'High-Security Double Gate & Perimeter Spikes',
                location: 'Naval Anchorage, Islamabad',
                clientType: 'Private Residence Estate',
                gaugeSpec: '12-Gauge Thick Cold-Rolled Mild Steel',
                finishSpec: '7-Stage Chemical Pre-Treatment & Powder Oven Baked',
                deliverables: 'Heavy Automated Swing Gate, 180 RFT Laser Precision Anti-Climb Spikes',
                image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
                link: '/portfolio/naval-anchorage-residence'
              }
            ];

            const filteredProjects = portfolioStatusTab === 'all'
              ? allPortfolioProjects
              : allPortfolioProjects.filter(p => p.status === portfolioStatusTab);

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredProjects.map((proj) => {
                  const isOngoing = proj.status === 'ongoing';
                  return (
                    <div 
                      key={proj.id}
                      className="group bg-brand-navy border border-brand-light/60 rounded-xl overflow-hidden hover:border-brand-gold transition-all duration-300 shadow-2xl flex flex-col justify-between card-interactive"
                    >
                      {/* Image Header with Status Tag */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                        <img 
                          src={proj.image || FALLBACK_IMAGE_URL} 
                          alt={proj.title}
                          loading="lazy"
                          decoding="async"
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Live Status Tag */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                            isOngoing
                              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                          }`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isOngoing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                            {proj.statusLabel}
                          </span>
                        </div>

                        {/* Location Tag */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-stone-200">
                          <span className="text-[11px] font-mono font-bold text-brand-gold flex items-center gap-1 drop-shadow">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{proj.location}</span>
                          </span>
                          <span className="text-[10px] font-mono bg-black/60 px-2 py-0.5 rounded text-stone-300 border border-white/10">
                            {proj.clientType}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="font-heading font-black text-sm sm:text-base text-stone-100 group-hover:text-brand-gold transition-colors uppercase leading-snug">
                            {proj.title}
                          </h3>
                          
                          {/* Specs Box */}
                          <div className="bg-black/50 border border-brand-light/40 p-2.5 rounded-lg space-y-1 text-[11px] font-sans">
                            <div className="flex items-start gap-1.5 text-stone-200">
                              <strong className="text-brand-gold shrink-0">Steel Gauge:</strong>
                              <span className="text-slate-300 truncate">{proj.gaugeSpec}</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-stone-200">
                              <strong className="text-brand-gold shrink-0">Finishing:</strong>
                              <span className="text-slate-300 truncate">{proj.finishSpec}</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-stone-200">
                              <strong className="text-brand-gold shrink-0">Scope:</strong>
                              <span className="text-slate-300 truncate">{proj.deliverables}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-brand-light/40 flex items-center justify-between gap-2">
                          <a
                            href={getWhatsAppUrl(`*PROJECT INQUIRY*\nI am interested in project: ${proj.title} located at ${proj.location}.\nPlease share complete technical drawing, material specifications, and quotation.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-navy text-[10px] py-2 px-3.5 font-bold uppercase tracking-wider flex items-center gap-1.5 w-full justify-center"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Inquire On Site</span>
                          </a>

                          <Link
                            to="/quote"
                            className="btn-gold text-[10px] py-2 px-3.5 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                          >
                            <span>Get Rate</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Bottom Action Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-brand-light/30">
            <Link 
              to="/portfolio"
              className="btn-gold text-xs py-3 px-8 uppercase font-bold tracking-wider shadow-lg"
            >
              <span>View All 10 Architectural Categories</span>
            </Link>

            <a
              href={getWhatsAppUrl('Hello Mughal Steel Fabrication, I want to schedule a site laser survey for my upcoming house project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs py-3 px-6 uppercase font-bold tracking-wider flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>Book Site Laser Survey</span>
            </a>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. REVIEWS SECTION: VERIFIED FEEDBACK & CLIENT REVIEWS   */}
      {/* Placed Directly Below Projects as Requested             */}
      {/* ======================================================== */}
      <section id="reviews" className="cv-auto scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-light/40 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded-full shadow-sm">
                <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                <span>5.0 Star Rating Across 500+ Projects in Pakistan</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black text-stone-100 uppercase tracking-wider flex flex-wrap items-center gap-2">
                <span>CLIENT REVIEWS &amp;</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold drop-shadow">
                  HANDOVER FEEDBACK
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl">
                Read real verified feedback from homeowners, commercial developers, overseas Pakistanis, and architects who trusted Mughal Steel Fabrication for their architectural metalwork.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-gold text-xs py-2.5 px-4 uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-brand-dark" />
                <span>+ Add Your Project Review</span>
              </button>
            </div>
          </div>

          {/* Active Review Spotlight Card & Slider Controls */}
          {(() => {
            const clientReviews = [
              {
                name: 'Ch. Tariq Mehmood',
                location: 'Bahria Town Phase 7, Rawalpindi',
                project: '14-Gauge CNC Laser Gate (MFG-001)',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                rating: 5,
                text: 'The laser-cut precision on our 14ft main gate and electrostatic matte charcoal powder coating has zero flaws. Flawless execution from laser surveying to final installation.'
              },
              {
                name: 'Engr. Bilal Aslam',
                location: 'Sector F-7/2, Islamabad',
                project: 'Oversized Pivot Entrance Door (MFD-004)',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                rating: 5,
                text: 'The 5x10 ft pivot door swings effortlessly with a single finger touch. Structural anchoring completed with laser leveling and heavy duty German hinges. Exceptional quality.'
              },
              {
                name: 'Malik Faisal',
                location: 'DHA Phase 2, Islamabad',
                project: 'Frameless Glass & Steel Railing (MFR-002)',
                image: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80',
                rating: 5,
                text: 'Master craftsmanship and durable powder coating. The entire villa boundary grills, spiral stairs, and 60 running feet of tempered glass railings were installed right on schedule.'
              },
              {
                name: 'Col. (R) Tariq Niazi',
                location: 'Naval Anchorage, Islamabad',
                project: 'Double-Leaf Heavy Security Gate',
                image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
                rating: 5,
                text: 'Impeccable structural rigidity with 12-gauge mild steel. Mughal Steel delivered on time and ensured automated Italian motor syncing without any vibration.'
              },
              {
                name: 'Dr. Shahzad Mir',
                location: 'Gulberg Greens, Islamabad',
                project: 'Architectural Louvers & Spiral Stairs',
                image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
                rating: 5,
                text: 'The spiral staircase in our central atrium is an absolute work of art. Certified weld quality and zero-flex load capacity even with 6 people on it.'
              }
            ];

            const currentRev = clientReviews[activeReviewIndex % clientReviews.length];

            return (
              <div 
                className="space-y-8"
                onMouseEnter={() => setIsReviewsPaused(true)}
                onMouseLeave={() => setIsReviewsPaused(false)}
              >
                {/* Spotlight Featured Testimonial Card */}
                <div className="relative bg-brand-navy border border-brand-light/70 hover:border-brand-gold/60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 card-interactive">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                    
                    {/* Left: Project Installation Photo with Overlay */}
                    <div className="lg:col-span-5 relative aspect-[16/11] lg:aspect-auto lg:h-full min-h-[260px] bg-black overflow-hidden">
                      <img 
                        src={currentRev.image || FALLBACK_IMAGE_URL} 
                        alt={currentRev.project} 
                        onError={handleImageError}
                        className="w-full h-full object-cover animate-fade-in filter contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                      <div className="absolute top-3 left-3 bg-brand-dark/90 text-brand-gold border border-brand-gold/40 text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow">
                        VERIFIED ON-SITE INSTALLATION
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-heading font-bold truncate">
                        {currentRev.project}
                      </div>
                    </div>

                    {/* Right: Feedback Details with Quote & Author */}
                    <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(currentRev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                          100% Client Verified
                        </span>
                      </div>

                      <div className="relative">
                        <Quote className="w-10 h-10 text-brand-gold/20 absolute -top-4 -left-2 pointer-events-none" />
                        <p className="text-sm sm:text-base text-stone-200 font-sans leading-relaxed italic pl-6 animate-fade-in">
                          &ldquo;{currentRev.text}&rdquo;
                        </p>
                      </div>

                      <div className="pt-4 border-t border-brand-light/50 flex items-center justify-between">
                        <div>
                          <h4 className="font-heading font-black text-sm text-stone-100 uppercase">
                            {currentRev.name}
                          </h4>
                          <span className="text-xs text-brand-gold font-mono block">
                            {currentRev.location}
                          </span>
                        </div>

                        {/* Slide Navigation Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveReviewIndex((prev) => (prev - 1 + clientReviews.length) % clientReviews.length)}
                            aria-label="Previous review"
                            className="p-2 rounded-full border border-brand-gold/40 bg-brand-medium hover:bg-brand-gold hover:text-brand-dark text-brand-gold transition-all cursor-pointer shadow active:scale-95"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-mono font-bold text-slate-400 px-1">
                            {activeReviewIndex + 1} / {clientReviews.length}
                          </span>
                          <button
                            onClick={() => setActiveReviewIndex((prev) => (prev + 1) % clientReviews.length)}
                            aria-label="Next review"
                            className="p-2 rounded-full border border-brand-gold/40 bg-brand-medium hover:bg-brand-gold hover:text-brand-dark text-brand-gold transition-all cursor-pointer shadow active:scale-95"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Thumbnail Strip: Click any review to jump directly */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {clientReviews.map((rev, idx) => {
                    const isActive = idx === activeReviewIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveReviewIndex(idx)}
                        className={`text-left p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? 'bg-brand-medium border-brand-gold shadow-glow-gold' 
                            : 'bg-brand-navy/60 border-brand-light/50 hover:border-brand-gold/50 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <p className={`text-xs font-heading font-bold truncate ${isActive ? 'text-brand-gold' : 'text-stone-200'}`}>
                          {rev.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {rev.project}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Video Feedback Spotlight Banner */}
          <div className="bg-gradient-to-r from-[#0B1320] via-brand-navy to-[#0B1320] border border-brand-gold/40 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded border border-brand-gold/30">
                Official Project Handover Video
              </span>
              <h3 className="text-lg sm:text-xl font-heading font-black text-white uppercase">
                Customer Review: NDU Islamabad Project Handover
              </h3>
              <p className="text-xs text-slate-300 font-sans max-w-xl">
                Watch verified on-camera client feedback upon final laser inspection, gate motor calibration, and official handover.
              </p>
            </div>

            <button
              onClick={() => setActiveVideoModal({
                title: 'Customer Review & Feedback - NDU Islamabad Project',
                videoUrl: 'https://res.cloudinary.com/dfh28zk9/video/upload/q_auto,vc_h264/v1788502154/Customer_Review_NDU_Islamabad_Project_completed_by_Mughal_Steel_Fab.mp4',
                description: 'Verified client review and project handover at National Defence University (NDU) Islamabad. Client shares detailed feedback on structural craftsmanship, timely delivery, and professional installation standards.'
              })}
              className="btn-gold text-xs py-3 px-6 uppercase font-bold tracking-wider flex items-center gap-2 shrink-0 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-brand-dark" />
              <span>Watch Video Review</span>
            </button>
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
      {/* 5. OUR SPECIALIZED SERVICES (WITH LARGE PROMINENT PHOTOS) */}
      {/* Placed Below Client Reviews with Big Image Showcase     */}
      {/* ======================================================== */}
      <section id="services" className="cv-auto scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-light/40 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded-full shadow-sm">
                <Hammer className="w-3.5 h-3.5 text-brand-gold" />
                <span>Full-Spectrum Fabrication Capabilities</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black text-stone-100 uppercase tracking-wider flex flex-wrap items-center gap-2">
                <span>OUR SPECIALIZED</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold drop-shadow">
                  FABRICATION SERVICES
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl">
                Precision mild steel fabrication, hand-forged wrought iron, and architectural glass systems accompanied by dedicated on-site engineering and certified 10-year structural warranty.
              </p>
            </div>

            <Link 
              to="/services" 
              className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1.5 uppercase tracking-wider bg-black/60 px-4 py-2.5 rounded-lg border border-brand-gold/40 shadow-md hover:border-brand-gold transition shrink-0"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Service Switcher Tabs */}
          {(() => {
            const allServicesList = [
              {
                id: 'srv-1',
                title: 'Steel Fabrication & CNC Laser Works',
                shortTitle: 'CNC Laser & Mild Steel',
                subtitle: 'High-Tensile Structural Mild Steel (14G / 16G Certified) & Millimeter CNC Laser Precision',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                desc: 'High-tensile CNC laser cut gates, security boundary grills, and heavy structural warehouse trusses.',
                fullDescription: 'Mughal Steel Fabrication delivers turnkey architectural steel fabrication solutions combining heavy structural carbon steel box channels with ±0.1mm fiber laser-cut steel sheets. Every assembly is precision welded, anti-rust zinc-primed, and oven-baked with electrostatic polyester powder coat for extreme longevity.',
                badge: '14G/16G Certified MS',
                specs: [
                  '14-Gauge (2.0mm) & 12-Gauge (2.5mm) Certified Mild Steel Frame',
                  'High-Speed CNC Fiber Laser Tolerance: ±0.1mm',
                  'Hot-Zinc Anti-Rust Primer & Electrostatic Powder Oven Bake (200°C)',
                  'Italian / German Automated Gate Motor Compatibility',
                  'Heavy-Duty Ball-Bearing Hinges & High-Tensile Ground Anchor Bolts'
                ],
                deliverables: [
                  'Main Villa Driveway Sliding & Swing Gates',
                  'Telescopic & Bi-Fold High-Clearance Driveway Gates',
                  'Security Window Grills & French Sliding Frames',
                  'Boundary Wall Security Panels & Anti-Climb Spikes',
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
                shortTitle: 'Wrought Iron Artisan',
                subtitle: 'Master Hand-Forged Solid Carbon Steel Scrolls, Haveli Archways & Antique Patinas',
                image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                desc: 'Hand-forged ornamental scrolls, haveli gates, and antique gold balustrades.',
                fullDescription: 'Preserving centuries of Mughal and European blacksmith artistry, our master artisans hand-forge solid carbon steel bars on heavy anvils to craft bespoke ornamental scrolls, acanthus leaves, classical rosettes, and antique brass accents.',
                badge: 'Hand-Forged Solid MS',
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
                title: 'Aluminum & Glass Pivot Systems',
                shortTitle: 'Aluminum & Glass Systems',
                subtitle: 'Architectural Pivot Doors, Thermally Isolated Facades & Acoustic Laminated Glass Systems',
                image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
                desc: 'Thermally isolated pivot doors, glass balustrades, and soundproof partitions.',
                fullDescription: 'Ultra-slim architectural aluminum framing paired with high-performance 12mm tempered or acoustic double-glazed glass. Engineered for modern villa pivot entrance doors, office glass partitions, frameless balcony balustrades, and expansive sliding patio enclosures.',
                badge: 'German Hydraulic Pivot',
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
                shortTitle: 'Structural Steel & Sheds',
                subtitle: 'Heavy Industrial Trusses, Mezzanine Floors, Warehouse Sheds & Fire-Escape Spines',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                desc: 'Mezzanine platforms, fire-escape spiral stairs, automated sliding barrier frames, and industrial sheds.',
                fullDescription: 'Heavy structural steel engineering designed to meet Pakistan Building Code (PBC) standards. From large-span warehouse portal frames and industrial mezzanine storage decks to commercial exterior spiral escape stairs.',
                badge: 'I-Beam Portal Frame',
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
                shortTitle: 'Farm & Agricultural',
                subtitle: 'Hot-Dip Galvanized Cattle Barriers, Heavy Equipment Sheds & Estate Perimeter Security',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
                desc: 'Hot-dip galvanized cattle barriers, heavy equipment shed trusses, and durable agrarian estate fencing.',
                fullDescription: 'Robust, heavy-gauge weather-proof steel fabrication built to withstand harsh outdoor agrarian environments, animal livestock pressure, and heavy tractor/harvester machinery.',
                badge: 'Hot-Dip Galvanized',
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
                shortTitle: 'Turnkey 3D CAD & Setup',
                subtitle: 'Turnkey 3D CAD Modeling, Laser Leveling, Structural Foundation Anchoring & Motor Setup',
                image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
                desc: 'Turnkey 3D CAD modeling, laser leveling, structural foundation anchoring, and automated motor setup.',
                fullDescription: 'Complete end-to-end bespoke design and engineering consultancy. We take your architectural blueprints or site measurements, generate detailed 3D CAD elevations with virtual try-on previews, and manage complete on-site crane and laser installation with warranty certification.',
                badge: 'Laser Survey & Erection',
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
            ];

            const activeService = allServicesList[activeServiceTab % allServicesList.length];

            return (
              <div className="space-y-8">
                
                {/* 6 Tabs for Quick Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {allServicesList.map((srv, idx) => {
                    const isSelected = activeServiceTab === idx;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setActiveServiceTab(idx)}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer card-interactive ${
                          isSelected
                            ? 'bg-gradient-to-b from-brand-medium to-brand-navy border-brand-gold shadow-[0_0_20px_rgba(204,160,75,0.3)]'
                            : 'bg-black/40 border-brand-light/40 hover:border-brand-gold/50 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded self-start ${
                          isSelected ? 'bg-brand-gold text-brand-dark' : 'bg-stone-800 text-stone-300'
                        }`}>
                          {srv.badge}
                        </span>
                        <span className={`font-heading font-black text-xs uppercase tracking-wider mt-2 line-clamp-1 ${
                          isSelected ? 'text-brand-gold' : 'text-stone-200'
                        }`}>
                          {srv.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* FEATURED SERVICE PROMINENT LARGE PICTURE SHOWCASE (Split-Screen Layout) */}
                <div className="bg-gradient-to-br from-brand-navy/95 to-[#060A12] border border-brand-gold/60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 card-interactive">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    
                    {/* LEFT / TOP: LARGE HIGH-RESOLUTION ARCHITECTURAL PHOTOGRAPH */}
                    <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[360px] sm:min-h-[440px] bg-black overflow-hidden group">
                      <img 
                        src={activeService.image} 
                        alt={activeService.title} 
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                        <span className="bg-brand-dark/95 text-brand-gold border border-brand-gold/60 text-[10px] font-mono font-bold px-3 py-1 rounded shadow-lg uppercase">
                          Featured Capability
                        </span>
                        <span className="bg-black/80 text-stone-200 border border-white/20 text-[10px] font-mono px-2.5 py-1 rounded shadow">
                          {activeService.badge}
                        </span>
                      </div>

                      {/* Bottom Image Caption */}
                      <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-gold bg-black/85 px-3 py-1 rounded border border-brand-gold/40">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mughal Steel On-Site Execution Standard</span>
                        </div>
                        <p className="text-xs text-stone-200 font-sans drop-shadow-md">
                          Executed with certified gauges, digital laser leveling, and multi-stage anti-rust treatment.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: IN-DEPTH ENGINEERING DETAILS, SPECS & WORKFLOW */}
                    <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-mono font-bold text-brand-gold uppercase tracking-wider block">
                            Service 0{activeServiceTab + 1} of 0{allServicesList.length}
                          </span>
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-stone-100 uppercase tracking-wider">
                            {activeService.title}
                          </h3>
                          <p className="text-xs font-mono text-brand-gold/90 font-medium">
                            {activeService.subtitle}
                          </p>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                          {activeService.fullDescription}
                        </p>

                        {/* Specs & Deliverables Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="bg-black/50 border border-brand-light/50 p-3.5 rounded-xl space-y-2">
                            <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5" />
                              <span>Material Standards</span>
                            </h4>
                            <ul className="space-y-1 text-slate-300 font-sans text-[11px]">
                              {activeService.specs.slice(0, 3).map((spec, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-brand-gold font-bold">✓</span>
                                  <span>{spec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/50 border border-brand-light/50 p-3.5 rounded-xl space-y-2">
                            <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" />
                              <span>Key Deliverables</span>
                            </h4>
                            <ul className="space-y-1 text-slate-300 font-sans text-[11px]">
                              {activeService.deliverables.slice(0, 3).map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-brand-gold font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Bottom CTAs */}
                      <div className="pt-4 border-t border-brand-light/40 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setActiveServiceModal(activeService as any)}
                            className="btn-outline text-xs py-2.5 px-4 font-bold uppercase tracking-wider cursor-pointer"
                          >
                            <span>View Full Specifications</span>
                          </button>
                          
                          <Link
                            to={activeService.categoryLink}
                            className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1 uppercase"
                          >
                            <span>Browse Catalog</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        <a
                          href={getWhatsAppUrl(`*SERVICE INQUIRY*\nService: ${activeService.title}\nSubtitle: ${activeService.subtitle}\n\nHello Mughal Steel Team, I am planning a project and would like to discuss engineering details and receive a quotation.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold text-xs py-2.5 px-5 font-bold uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-4 h-4 text-brand-dark" />
                          <span>Get Quote on WhatsApp</span>
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 6-Card Summary Grid with Large Pictures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {allServicesList.map((srv, idx) => {
                    const isSelected = activeServiceTab === idx;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => {
                          setActiveServiceTab(idx);
                          // smooth scroll to top of service showcase
                          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`group bg-brand-navy border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer card-interactive ${
                          isSelected ? 'border-brand-gold shadow-glow-gold' : 'border-brand-light/60 hover:border-brand-gold/60'
                        }`}
                      >
                        {/* Service Large Image Thumbnail */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                          <img 
                            src={srv.image} 
                            alt={srv.title}
                            loading="lazy"
                            decoding="async"
                            onError={handleImageError}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute top-2.5 left-2.5 bg-black/80 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-gold/40">
                            {srv.badge}
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 border-2 border-brand-gold pointer-events-none" />
                          )}
                        </div>

                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h4 className="font-heading font-bold text-sm sm:text-base text-stone-100 group-hover:text-brand-gold transition-colors uppercase leading-snug">
                              {srv.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-sans line-clamp-2">
                              {srv.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-brand-light/40 flex items-center justify-between text-xs font-heading font-bold text-brand-gold uppercase tracking-wider">
                            <span>{isSelected ? 'Currently Viewing' : 'Inspect Service'}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. ABOUT SECTION: 30+ YEARS HERITAGE & WORKFLOW           */}
      {/* ======================================================== */}
      <section 
        id="about" 
        className="cv-auto scroll-mt-24 w-full relative border-b border-brand-light/40 py-20 md:py-28 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,8,14,0.30), rgba(5,8,14,0.45)), url('/mughal-luxury-architectural-villa.jpg')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/20 pb-5 bg-black/55 backdrop-blur-md p-6 rounded-2xl border">
            <div className="space-y-1">
              <span className="text-brand-gold text-xs font-mono font-bold uppercase tracking-widest block drop-shadow">
                HIGH COURT ROAD, RAWALPINDI • MUHAMMAD QASIM
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider drop-shadow-2xl">
                ABOUT MUGHAL STEEL FABRICATION
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 font-sans max-w-3xl drop-shadow-md">
                Premier metal fabrication business located on High Court Road in Rawalpindi, Pakistan, owned and operated by Muhammad Qasim. Recognized for combining traditional craftsmanship with modern engineering and digital workflows.
              </p>
            </div>
            <Link to="/about" className="text-xs font-heading font-bold text-brand-gold hover:text-white hover:underline flex items-center gap-1.5 shrink-0 bg-black/60 px-4 py-2.5 rounded-lg border border-brand-gold/50 shadow-md">
              <span>Read Full Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {aboutStats.map((s, idx) => (
              <div key={idx} className="bg-black/70 backdrop-blur-md border border-brand-gold/40 p-6 rounded-xl space-y-1 shadow-2xl hover:border-brand-gold transition-all duration-300 card-interactive">
                <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-brand-gold truncate drop-shadow">{s.value}</p>
                <p className="text-stone-300 text-xs uppercase tracking-wider font-semibold font-mono">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Story & Philosophy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 bg-black/70 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl">
              <span className="text-brand-gold text-xs font-mono font-bold uppercase tracking-widest block drop-shadow">
                TRADITIONAL CRAFTSMANSHIP & DIGITAL WORKFLOWS
              </span>
              <h3 className="text-xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider drop-shadow-md">
                Dedicated Yard in Rawalpindi with Modern 3D & AI Design
              </h3>
              <p className="text-stone-200 text-xs sm:text-sm leading-relaxed font-sans drop-shadow">
                Mughal Steel Fabrication is a premier metal fabrication business located on High Court Road in Rawalpindi, Pakistan, owned and operated by Muhammad Qasim. The enterprise is recognized for combining traditional craftsmanship with modern engineering and digital workflows.
              </p>
              <p className="text-stone-200 text-xs sm:text-sm leading-relaxed font-sans drop-shadow">
                Operating a dedicated fabrication yard in Rawalpindi equipped with modern machinery and tools, powered by skilled steel fabricators, welders, and operational managers who ensure high structural standards and precision.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Custom Ironwork & Doors</span>
                </div>
                <div className="flex items-center gap-2 text-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Staircase Engineering</span>
                </div>
                <div className="flex items-center gap-2 text-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Architectural Railings</span>
                </div>
                <div className="flex items-center gap-2 text-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>AI & 3D Visual Previews</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-brand-gold/60 shadow-2xl bg-black aspect-[16/10] group">
                <img 
                  src="/mughal-steel-workshop-master.jpg" 
                  alt="Mughal Steel Dedicated Fabrication Yard - High Court Road Rawalpindi" 
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent flex flex-col justify-end p-5 sm:p-6">
                  <span className="text-xs font-mono font-bold text-brand-gold bg-black/90 px-3 py-1 rounded border border-brand-gold/50 self-start">
                    High Court Road Fabrication Yard • Muhammad Qasim & Team
                  </span>
                  <span className="text-xs text-slate-200 font-sans mt-1.5 leading-relaxed">
                    Powered by skilled steel fabricators, welders, and operational managers ensuring high structural standards and precision.
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
      {/* 8. CONTACT SECTION: WORKSHOP LIVE LOCATION & DIRECT INQUIRY */}
      {/* ======================================================== */}
      <section id="contact" className="cv-auto scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>Workshop & Fabrication Yard</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-wider">
              CONTACT & LIVE LOCATION
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              Visit our fabrication yard in Sector I-9 Industrial Area or send project dimensions for an immediate estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Quick Quote & Consultation Form */}
            <div className="lg:col-span-6">
              <form 
                action={settings?.formspreeEndpoint || 'https://formspree.io/f/mppzrorn'} 
                method="POST" 
                onSubmit={handleQuickQuoteSubmit} 
                className="bg-brand-navy border border-brand-gold/40 p-6 sm:p-8 rounded-lg space-y-4 shadow-2xl"
              >
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
                    onClick={(e) => { e.preventDefault(); openDirectEmail(); }}
                    className="hover:underline flex items-center gap-1 text-stone-200 hover:text-brand-gold transition-colors cursor-pointer"
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
                  onClick={(e) => { e.preventDefault(); openDirectEmail(); }}
                  className="btn-outline text-xs py-2.5 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
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
                src={`${activeVideoModal.videoUrl}#t=3`}
                controls
                autoPlay
                preload="auto"
                playsInline
                disablePictureInPicture={false}
                onLoadedMetadata={(e) => {
                  try {
                    if (e.currentTarget.currentTime < 3) {
                      e.currentTarget.currentTime = 3;
                    }
                  } catch (err) {}
                }}
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
                <h3 className="font-heading font-black text-sm sm:text-base text-stone-100 uppercase tracking-wider truncate">
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
                  src={activeServiceModal.image || FALLBACK_IMAGE_URL} 
                  alt={activeServiceModal.title}
                  onError={handleImageError}
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



    </div>
  );
};
