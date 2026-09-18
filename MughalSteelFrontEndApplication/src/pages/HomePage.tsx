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
  Send, Mail, Phone, ChevronLeft, ChevronRight, Quote
} from 'lucide-react';
import { PROJECT_CATEGORIES_DATA, SEED_PROJECTS } from '../data/seedData';
import { useSEO } from '../utils/useSEO';
import { openDirectEmail } from '../utils/emailHelper';
import { handleImageError, FALLBACK_IMAGE_URL } from '../utils/imageFallback';


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
  const heroSlides = [
    {
      id: 'slide-mughal-team',
      type: 'image' as const,
      src: '/mughal-steel-team-hero.png',
      badge: 'Mughal Steel Team • High Court Road Yard',
      title: 'Specializing in Heavy Fabrication & Custom Solutions',
      description: 'Delivering high-tensile architectural CNC laser gates, luxury balustrades, and certified structural steel engineering across Islamabad & Rawalpindi.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'Explore Products',
      secondaryLink: '/items'
    },
    {
      id: 'slide-vid-0',
      type: 'video' as const,
      videoSrc: '/videos/hero_video_0.mp4',
      poster: '/videos/hero_poster_0.jpg',
      youtubeId: 'fQZGXcWxw0Q',
      badge: 'DHA Phase 1 • Steel Work & Railings',
      title: 'Overview of Completed Projects & Railings',
      description: 'Site walkthrough of completed heavy architectural steel fabrication, precision laser-cut balustrades, and master metal engineering.',
      ctaText: 'Get A Quote',
      ctaLink: '/quote',
      secondaryText: 'View Railings',
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
      // Safety watchdog: in case video duration is long or blocked, advance after 45 seconds
      const watchdog = setTimeout(() => {
        nextSlide();
      }, 45000);
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
    <div className="w-full bg-[#05080E] text-stone-100 font-sans">
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
                          muted
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
              - Left side gradient: Guarantees 100% crisp typography legibility matching FF Steel reference
              - Top & bottom vignettes: Seamless blend with navigation header and credential ribbons */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05080E]/95 via-[#05080E]/80 to-transparent w-full md:w-3/4 lg:w-3/5 pointer-events-none z-10" />
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

        {/* Hero Content Area: Clean Left-Aligned Enterprise Typography matching Reference Screenshot */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:pl-6 lg:pr-12 flex-1 flex flex-col justify-center py-6 sm:py-8 lg:py-10">
          <div className="max-w-2xl lg:max-w-3xl text-left -ml-1 sm:-ml-3 lg:-ml-4">
            
            {currentSlide === 0 ? (
              // Team Photo Slide: Exact Showcase layout from reference screenshot
              <div className="border-l-2 sm:border-l-[3px] border-[#cca04b] pl-3.5 sm:pl-5 space-y-2.5 sm:space-y-3">
                
                {/* Brand Hero Heading */}
                <div className="space-y-1">
                  <p className="text-white text-base sm:text-lg lg:text-xl font-heading font-medium tracking-wide drop-shadow">
                    Welcome to
                  </p>
                  <h1 className="flex flex-wrap items-baseline gap-2 sm:gap-3 font-heading font-black tracking-tight drop-shadow-2xl">
                    <span className="text-3xl sm:text-5xl lg:text-[56px] text-[#cca04b] border-b-2 sm:border-b-4 border-[#cca04b] pb-0.5 leading-none font-black inline-block">
                      Mughal
                    </span>
                    <span className="text-2xl sm:text-4xl lg:text-[44px] text-white leading-tight font-black">
                      Steel Fabrication.
                    </span>
                  </h1>
                </div>

                {/* Tagline / Subtitle */}
                <p className="text-xs sm:text-sm lg:text-base text-stone-200 font-sans font-semibold drop-shadow-md">
                  Premium Steel &amp; Metal Fabrication Solutions <span className="text-[#cca04b] font-bold mx-1">|</span> Serving All Over Pakistan
                </p>

                {/* Action Buttons: Explore Projects & Get a Free Quote */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-0.5">
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center justify-center bg-[#cca04b] hover:bg-[#d8ad56] text-stone-950 font-heading font-bold text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-md shadow-lg hover:shadow-[0_0_20px_rgba(204,160,75,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Explore Projects</span>
                  </Link>

                  <Link 
                    to="/quote" 
                    className="inline-flex items-center justify-center bg-black/60 hover:bg-black/85 text-white border border-stone-400/80 hover:border-white font-heading font-medium text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-md backdrop-blur-md shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Get a Free Quote</span>
                  </Link>
                </div>

                {/* Direct Call Number Placed Directly UNDER the Explore Projects Buttons Section */}
                <div className="pt-0.5">
                  <a 
                    href="tel:03005197825"
                    className="inline-flex items-center gap-2 text-white hover:text-[#cca04b] font-heading font-bold text-xs sm:text-sm tracking-wider py-1 transition-colors drop-shadow group"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#cca04b]/20 flex items-center justify-center group-hover:bg-[#cca04b]/30 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-[#cca04b]" />
                    </div>
                    <span className="font-mono font-bold text-stone-100">0300-5197825</span>
                  </a>
                </div>

                {/* 4 Architectural Fabrication Specialties */}
                <div className="pt-2 sm:pt-2.5 space-y-2 sm:space-y-2.5 text-left max-w-2xl">
                  <div>
                    <h2 className="text-xs sm:text-[13px] lg:text-[13.5px] font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 sm:underline-offset-4 decoration-[#cca04b]">
                      WROUGHT &amp; CAST IRON WORK,
                    </h2>
                    <p className="text-[11px] sm:text-xs lg:text-[12px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Custom double-height main entrance doors, heavy-duty security gates, and ornamental window panels crafted to perfection.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs sm:text-[13px] lg:text-[13.5px] font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 sm:underline-offset-4 decoration-[#cca04b]">
                      MODERN STAIRCASES,
                    </h2>
                    <p className="text-[11px] sm:text-xs lg:text-[12px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Precision-engineered spiral stairs, L-shaped staircases, and single-beam structures with marble-topped steel steps.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs sm:text-[13px] lg:text-[13.5px] font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 sm:underline-offset-4 decoration-[#cca04b]">
                      GLASS RAILINGS &amp; CNC GRILLS,
                    </h2>
                    <p className="text-[11px] sm:text-xs lg:text-[12px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Tempered glass balcony railings, architectural fences, and intricate CNC laser-cut metal panels.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs sm:text-[13px] lg:text-[13.5px] font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 sm:underline-offset-4 decoration-[#cca04b]">
                      SHADE PERGOLAS &amp; CANOPIES,
                    </h2>
                    <p className="text-[11px] sm:text-xs lg:text-[12px] text-stone-100 font-sans leading-snug drop-shadow pt-0.5">
                      Durable outdoor fencing systems and modern retractable shade pergolas with tensile fabric.
                    </p>
                  </div>

                  {/* Why Choose Us Section */}
                  <div className="pt-1.5 border-t border-white/10">
                    <h2 className="text-xs sm:text-[13px] lg:text-[14px] font-black text-[#cca04b] uppercase tracking-wider underline underline-offset-2 sm:underline-offset-4 decoration-[#cca04b]">
                      WHY CHOOSE US?
                    </h2>
                    <div className="mt-1 space-y-1 text-[11px] sm:text-xs text-stone-100 font-sans leading-snug drop-shadow">
                      <p>
                        <strong className="text-white font-bold">Nationwide Service:</strong> Delivering premium steel fabrication and structural solutions all across Pakistan.
                      </p>
                      <p>
                        <strong className="text-white font-bold">Tailored for Every Structure:</strong> Whether it's a modern house, a classic villa, or a commercial plaza, we deliver solutions customized to your exact architectural style.
                      </p>
                      <p>
                        <strong className="text-white font-bold">Precision &amp; Gauge Standards:</strong> Guaranteed structural strength using certified material gauges and accurate fabrication standards.
                      </p>
                      <p>
                        <strong className="text-white font-bold">Expert Craftsmanship:</strong> Backed by professional expertise and precision MS projects nationwide.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              // Video Slides: Active Project Headline & Dynamic Info
              <div className="border-l-2 sm:border-l-[3px] border-[#cca04b] pl-3.5 sm:pl-5 space-y-3 sm:space-y-4">
                
                {/* Project Header Tag & Byline */}
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm lg:text-base font-heading font-black uppercase tracking-wider sm:tracking-widest text-[#cca04b] drop-shadow">
                    COMPLETE RESIDENTIAL FABRICATION PROJECT
                  </p>
                  <p className="text-[11px] sm:text-xs lg:text-sm font-heading font-medium text-white tracking-wide drop-shadow">
                    Crafted With Perfection By
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <h1 className="flex flex-wrap items-baseline gap-2 sm:gap-3 font-heading font-black tracking-tight drop-shadow-2xl">
                    <span className="text-3xl sm:text-5xl lg:text-[56px] text-[#cca04b] border-b-2 sm:border-b-4 border-[#cca04b] pb-0.5 leading-none font-black inline-block">
                      Mughal
                    </span>
                    <span className="text-2xl sm:text-4xl lg:text-[44px] text-white leading-tight font-black">
                      Steel Fabrication.
                    </span>
                  </h1>

                  {/* Golden Subtitle directly under Mughal Steel Fabrication */}
                  <p className="text-xs sm:text-sm font-heading font-bold text-[#cca04b] uppercase tracking-wide drop-shadow pt-0.5">
                    Featuring custom wrought iron gates, security Grills and premium aluminum windows
                  </p>

                  <p className="text-sm sm:text-lg lg:text-xl font-heading font-bold text-stone-200 uppercase tracking-wide drop-shadow pt-0.5">
                    {heroSlides[currentSlide].title}
                  </p>
                </div>

                <p className="text-xs sm:text-sm lg:text-base text-stone-300/95 font-sans font-normal leading-relaxed max-w-2xl drop-shadow-md">
                  {heroSlides[currentSlide].description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center justify-center bg-[#cca04b] hover:bg-[#d8ad56] text-stone-950 font-heading font-bold text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-md shadow-lg hover:shadow-[0_0_20px_rgba(204,160,75,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Explore Projects</span>
                  </Link>

                  <Link 
                    to="/quote" 
                    className="inline-flex items-center justify-center bg-black/50 hover:bg-black/80 text-white border border-stone-500/70 hover:border-stone-300 font-heading font-medium text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-md backdrop-blur-md shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Get a Free Quote</span>
                  </Link>
                </div>

                {/* Direct Call Number Placed Directly UNDER the Explore Projects Buttons Section */}
                <div className="pt-0.5">
                  <a 
                    href="tel:03005197825"
                    className="inline-flex items-center gap-2 text-white hover:text-[#cca04b] font-heading font-bold text-xs sm:text-sm tracking-wider py-1 transition-colors drop-shadow group"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#cca04b]/20 flex items-center justify-center group-hover:bg-[#cca04b]/30 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-[#cca04b]" />
                    </div>
                    <span className="font-mono font-bold text-stone-100">0300-5197825</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Pagination Bar: Circular Dots • • ⦿ • • & Floating "Online" Button */}
        <div className="relative z-30 w-full pb-4 sm:pb-5">
          {/* Bottom-Center Circular Dots matching reference image • • ⦿ • • */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3" role="tablist" aria-label="Slider Pagination">
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

          {/* Floating Online Badge in Bottom-Right matching FF Steel Reference */}
          <a 
            href={whatsappDirect}
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex absolute bottom-0 right-6 z-30 bg-[#f38300] hover:bg-[#ff9514] text-white font-heading font-black text-xs px-5 py-2 rounded-t-lg shadow-2xl items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <span>Online</span>
          </a>
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
      <section id="products" className="cv-auto scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header with Slider Navigation Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                FRONT GATES & CUSTOM FABRICATIONS
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
            {products.slice(0, 12).map((prod) => (
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
                  <div className="absolute top-2.5 left-2.5 bg-black/80 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-gold/40 shadow">
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
            ))}
          </div>

          {/* 16 Modern Home Items Row with Infinite Smooth Marquee & Controls */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-heading font-black text-lg text-stone-100 uppercase">
                  16 Modern Home Fabrication Items
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Continuous gliding gallery • Hover to pause and inspect any item
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
      {/* SERVICES SECTION: 6 CORE CAPABILITIES */}
      {/* ======================================================== */}
      <section id="services" className="cv-auto scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-16 md:py-20">
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
                className="group bg-brand-navy border border-brand-light/60 rounded-xl p-7 sm:p-8 hover:border-brand-gold transition-all duration-300 shadow-xl flex flex-col justify-between space-y-6 cursor-pointer hover:bg-brand-medium/60 card-interactive"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform p-3 text-brand-gold">
                    {srv.icon}
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-stone-100 group-hover:text-brand-gold transition-colors tracking-wide leading-snug pt-1">
                    {srv.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {srv.desc}
                </p>

                <div className="pt-3 border-t border-brand-light/40 flex items-center justify-between text-xs font-heading font-bold text-brand-gold uppercase tracking-wider">
                  <span className="group-hover:underline">Learn More & View Specs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* PORTFOLIO SECTION: 10 ARCHITECTURAL CATEGORIES */}
      {/* ======================================================== */}
      <section id="portfolio" className="cv-auto scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-16 md:py-20">
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
                className="group bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden hover:border-brand-gold transition-all duration-300 shadow-md flex flex-col justify-between card-interactive"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <img 
                    src={cat.heroImage || FALLBACK_IMAGE_URL} 
                    alt={cat.name} 
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
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
      <section id="projects" className="cv-auto scroll-mt-24 w-full bg-[#080D17] border-b border-brand-light/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-brand-light/40 pb-6">
            <div className="space-y-3 max-w-4xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[10px] font-heading font-black uppercase tracking-widest rounded">
                09. FEATURED WORK
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                FEATURED PORTFOLIO PROJECTS
              </h2>
              
              <div className="space-y-3 pt-1">
                <div className="border-l-2 border-brand-gold pl-3 py-0.5">
                  <h3 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
                    COMPLETED PROJECT: GULBERG GREENS FARMHOUSE
                  </h3>
                  <p className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mt-0.5">
                    Executed Entirely by Mughal Steel Fabrication
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300 font-sans">
                  <div className="flex items-start gap-2 bg-black/40 border border-brand-light/40 p-2.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                    <span><strong className="text-stone-100">Wrought &amp; Cast Iron Work:</strong> Grand entrance gates, custom fencing, and ornamental details crafted with perfection.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-black/40 border border-brand-light/40 p-2.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                    <span><strong className="text-stone-100">Precision Steel &amp; Pipe Works:</strong> High-strength structural framework and heavy-duty fabrication.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-black/40 border border-brand-light/40 p-2.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                    <span><strong className="text-stone-100">Custom Staircases:</strong> Elegant and durable modern architectural stairs.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-black/40 border border-brand-light/40 p-2.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                    <span><strong className="text-stone-100">Architectural Aluminum Work:</strong> Premium-grade windows and fittings.</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-200 font-medium">
                  Experience total perfection in metalwork and construction with Mughal Steel Fabrication, Rawalpindi.
                </p>
              </div>
            </div>
            
            <Link 
              to="/portfolio"
              className="text-xs font-heading font-bold text-brand-gold hover:underline flex items-center gap-1.5 uppercase tracking-wider shrink-0 self-start lg:self-start mt-1 bg-black/60 px-4 py-2.5 rounded-lg border border-brand-gold/40 shadow-md hover:border-brand-gold transition"
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
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-light/60 hover:border-brand-gold transition-all duration-300 shadow-2xl bg-black flex flex-col justify-between card-interactive"
              >
                <img 
                  src={project.image || (project as any).coverImage || FALLBACK_IMAGE_URL} 
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
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
      <section id="reviews" className="cv-auto scroll-mt-24 w-full bg-[#05080E] border-b border-brand-light/40 py-16 md:py-20">
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
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight drop-shadow-2xl">
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
              <h3 className="text-xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight drop-shadow-md">
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
