import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useData } from '../../context/DataContext';
import { useCurrency, CURRENCIES, type CurrencyCode } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { MegaMenu } from './MegaMenu';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Heart, Menu, X, Phone, MessageCircle, 
  ChevronDown, ChevronRight, Layers, Sparkles, Shield, Compass, 
  FileText, CheckCircle, Globe, MapPin, Eye, Grid, DoorClosed, Star,
  LogOut, User as UserIcon, Home, Cog, Package, Image as ImageIcon, Mail,
  Sun, Moon
} from 'lucide-react';
import { PROJECT_CATEGORIES_DATA } from '../../data/seedData';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { products, settings, getWhatsAppUrl, categories } = useData();
  const { currency, setCurrency } = useCurrency();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Scroll detection for sticky header transition
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaType, setActiveMegaType] = useState<'categories' | 'items' | 'services' | 'more' | null>(null);

  // Hover & debounced close timer for smooth dropdown interaction
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnterMega = (type: 'categories' | 'items' | 'services' | 'more') => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current);
      megaTimeoutRef.current = null;
    }
    setActiveMegaType(type);
  };

  const handleMouseLeaveMega = () => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current);
    }
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMegaType(null);
    }, 250);
  };

  const handleToggleMega = (type: 'categories' | 'items' | 'services' | 'more') => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current);
      megaTimeoutRef.current = null;
    }
    setActiveMegaType(prev => prev === type ? null : type);
  };

  // Mobile Accordion States
  const [mobileExpandedSection, setMobileExpandedSection] = useState<'about' | 'projects' | 'products' | 'services' | 'company' | null>(null);


  // Search states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);

  // Optimized 60-120 FPS Scroll Spy & Sticky Header handler (Zero layout thrashing on touchpad gestures)
  const [activeSection, setActiveSection] = useState<string>('home');
  const isScrolledRef = useRef<boolean>(false);
  const activeSectionRef = useRef<string>('home');

  useEffect(() => {
    let animationFrameId: number | null = null;
    let isTicking = false;

    const sections = ['home', 'about', 'services', 'products', 'portfolio', 'projects', 'reviews', 'contact'];

    const onScroll = () => {
      if (!isTicking) {
        animationFrameId = window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const newScrolled = currentScrollY > 20;

          // Only update state when scrolled boolean state actually changes
          if (newScrolled !== isScrolledRef.current) {
            isScrolledRef.current = newScrolled;
            setIsScrolled(newScrolled);
          }

          // On Home page, update scrollspy if section changed
          if (location.pathname === '/') {
            const scrollPos = currentScrollY + 160;
            let currentSec = 'home';
            for (let i = sections.length - 1; i >= 0; i--) {
              const el = document.getElementById(sections[i]);
              if (el && scrollPos >= el.offsetTop) {
                currentSec = sections[i];
                break;
              }
            }
            if (currentSec !== activeSectionRef.current) {
              activeSectionRef.current = currentSec;
              setActiveSection(currentSec);
            }
          }

          isTicking = false;
        });
        isTicking = true;
      }
    };

    if (location.pathname !== '/') {
      setActiveSection('');
      activeSectionRef.current = '';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaType(null);
    setSearchOpen(false);
  }, [location.pathname]);

  const wishlistCount = wishlist.length;

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      return true;
    }
    return false;
  };

  const handleNavClick = (sectionId: string, fallbackPath?: string) => {
    setActiveMegaType(null);
    setMobileMenuOpen(false);

    if (location.pathname === '/' || location.pathname === '') {
      scrollToSection(sectionId);
      return;
    }

    navigate(fallbackPath || `/#${sectionId}`);
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 120);
  };

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const results = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.productCode?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.item?.toLowerCase().includes(q)
    ).slice(0, 6);
    setSearchResults(results);
  }, [searchQuery, products]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const executeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isNavActive = (sectionId: string, path: string) => {
    if (location.pathname === '/' && activeSection === sectionId) return true;
    if (location.pathname.startsWith(path) && path !== '/') return true;
    return false;
  };

  const whatsappDirectUrl = getWhatsAppUrl(
    `Hello Mughal Steel Fabrication! I am browsing your architectural catalog and would like to request an instant design estimate.`
  );

  return (
    <>
      {/* ======================================================== */}
      {/* MAIN NAVIGATION HEADER (PERFECT RESPONSIVE LAYOUT) */}
      {/* ======================================================== */}
      <header 
        className={`sticky top-0 z-50 w-full bg-[#070D18] transition-all duration-300 ${
          isScrolled 
            ? 'shadow-2xl py-2.5 border-b border-brand-gold/30' 
            : 'py-3 border-b border-brand-gold/25'
        }`}
      >
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
          
          {/* 1. LEFT CORNER: LOGO EMBLEM + MUGHAL STEEL BRANDING */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Mobile Menu Icon for small screens */}
            <button 
              className="lg:hidden p-1.5 text-stone-300 hover:text-brand-gold transition-colors rounded"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0 select-none py-0.5" 
              title="Mughal Steel Fabrication"
            >
              {/* Emblem Logo */}
              <div className="relative rounded-lg overflow-hidden shrink-0 border border-brand-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-brand-gold transition duration-300">
                <img 
                  src="/mughal-steel-logo.png" 
                  alt="Mughal Steel Logo" 
                  className="h-9 sm:h-10 md:h-11 w-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Professional Brand Title & Subtitle */}
              <div className="flex flex-col">
                <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-wider text-stone-100 uppercase leading-tight group-hover:text-brand-gold transition-colors duration-200 whitespace-nowrap">
                  MUGHAL STEEL
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.2em] text-[#c5a880] font-bold uppercase mt-0.5 leading-none whitespace-nowrap">
                  FABRICATION COMPLEX
                </span>
              </div>
            </Link>
          </div>

          {/* 2. CENTER: NAVIGATION MENU ITEMS (CLEAN SPACING & ZERO OVERLAP) */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-3 xl:mx-8 shrink">
            <nav className="flex items-center space-x-3.5 xl:space-x-6 font-heading">
              
              {/* HOME (Single Page Link) */}
              <button 
                type="button"
                onClick={() => handleNavClick('home', '/')}
                className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 flex items-center whitespace-nowrap ${
                  isNavActive('home', '/') && location.pathname === '/' 
                    ? 'text-brand-gold font-bold' 
                    : 'text-stone-300 hover:text-brand-gold'
                }`}
              >
                HOME
              </button>

              {/* ABOUT US (Dropdown/MegaMenu) */}
              <div 
                className="relative group/nav"
                onMouseEnter={() => handleMouseEnterMega('more')}
                onMouseLeave={handleMouseLeaveMega}
              >
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMega('more');
                  }}
                  className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 flex items-center gap-1 whitespace-nowrap ${
                    isNavActive('about', '/about') || activeMegaType === 'more'
                      ? 'text-brand-gold font-bold' 
                      : 'text-stone-300 hover:text-brand-gold'
                  }`}
                >
                  <span>ABOUT US</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMegaType === 'more' ? 'rotate-180 text-brand-gold' : 'text-stone-400 group-hover/nav:text-brand-gold'}`} />
                </button>
              </div>

              {/* SERVICES (Direct Nav Button - Smooth Scroll to #services) */}
              <button 
                type="button"
                onClick={() => handleNavClick('services')}
                className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 whitespace-nowrap ${
                  isNavActive('services', '/services')
                    ? 'text-brand-gold font-bold' 
                    : 'text-stone-300 hover:text-brand-gold'
                }`}
              >
                SERVICES
              </button>

              {/* PRODUCTS (Dropdown/MegaMenu) */}
              <div 
                className="relative group/nav"
                onMouseEnter={() => handleMouseEnterMega('items')}
                onMouseLeave={handleMouseLeaveMega}
              >
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMega('items');
                  }}
                  className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 flex items-center gap-1 whitespace-nowrap ${
                    isNavActive('products', '/items') || isNavActive('products', '/product') || activeMegaType === 'items'
                      ? 'text-brand-gold font-bold' 
                      : 'text-stone-300 hover:text-brand-gold'
                  }`}
                >
                  <span>PRODUCTS</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMegaType === 'items' ? 'rotate-180 text-brand-gold' : 'text-stone-400 group-hover/nav:text-brand-gold'}`} />
                </button>
              </div>

              {/* PORTFOLIO (Dropdown/MegaMenu) */}
              <div 
                className="relative group/nav"
                onMouseEnter={() => handleMouseEnterMega('categories')}
                onMouseLeave={handleMouseLeaveMega}
              >
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMega('categories');
                  }}
                  className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 flex items-center gap-1 whitespace-nowrap ${
                    isNavActive('portfolio', '/categories') || isNavActive('portfolio', '/portfolio') || activeMegaType === 'categories'
                      ? 'text-brand-gold font-bold' 
                      : 'text-stone-300 hover:text-brand-gold'
                  }`}
                >
                  <span>PORTFOLIO</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMegaType === 'categories' ? 'rotate-180 text-brand-gold' : 'text-stone-400 group-hover/nav:text-brand-gold'}`} />
                </button>
              </div>

              {/* PROJECTS (Single Page Link) */}
              <button 
                type="button"
                onClick={() => handleNavClick('projects', '/projects')}
                className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 flex items-center whitespace-nowrap ${
                  isNavActive('projects', '/projects') 
                    ? 'text-brand-gold font-bold' 
                    : 'text-stone-300 hover:text-brand-gold'
                }`}
              >
                PROJECTS
              </button>

              {/* REVIEWS (Direct Link to Reviews) */}
              <button 
                type="button"
                onClick={() => handleNavClick('reviews', '/projects#reviews')}
                className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 flex items-center whitespace-nowrap ${
                  isNavActive('reviews', '/reviews') || location.hash === '#reviews'
                    ? 'text-brand-gold font-bold' 
                    : 'text-stone-300 hover:text-brand-gold'
                }`}
              >
                REVIEWS
              </button>

              {/* CONTACT (Single Page Link) */}
              <button 
                type="button"
                onClick={() => handleNavClick('contact', '/contact')}
                className={`text-[11px] xl:text-xs font-heading font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer py-1 flex items-center whitespace-nowrap ${
                  isNavActive('contact', '/contact') 
                    ? 'text-brand-gold font-bold' 
                    : 'text-stone-300 hover:text-brand-gold'
                }`}
              >
                CONTACT
              </button>

            </nav>
          </div>

          {/* 3. RIGHT CORNER: USER PROFILE & LOGOUT */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Profile Link */}
            <Link 
              to={isAdmin ? "/admin" : "/account"} 
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-brand-gold/40 bg-brand-navy/60 hover:border-brand-gold hover:bg-brand-gold/10 text-[#c5a880] transition group cursor-pointer shrink-0"
              title={isAuthenticated ? (isAdmin ? "Admin Dashboard" : `Account (${user?.firstName || 'User'})`) : "Account Login"}
            >
              <div className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold border border-brand-gold/30 shrink-0">
                {isAdmin ? <Shield className="w-3 h-3 text-amber-400" /> : <UserIcon className="w-3 h-3" />}
              </div>
              <span className="text-[11px] sm:text-xs font-heading font-black tracking-wider uppercase text-stone-200 group-hover:text-brand-gold whitespace-nowrap">
                {isAuthenticated ? (user?.firstName ? user.firstName : (isAdmin ? 'Admin' : 'Profile')) : 'Profile'}
              </span>
            </Link>

            {/* Logout Button */}
            {isAuthenticated ? (
              <button 
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-900/40 hover:border-red-500/60 text-red-400 hover:text-red-300 transition text-[11px] sm:text-xs font-heading font-black tracking-wider uppercase cursor-pointer shrink-0 whitespace-nowrap"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-dark text-brand-gold transition text-xs font-heading font-black tracking-wider uppercase shrink-0 whitespace-nowrap"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>

        </div>

        {/* MEGA MENU CONTAINER */}
        <MegaMenu 
          type={activeMegaType} 
          onClose={() => setActiveMegaType(null)} 
          onMouseEnter={() => {
            if (megaTimeoutRef.current) {
              clearTimeout(megaTimeoutRef.current);
              megaTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeaveMega}
        />

      </header>

      {/* ======================================================== */}
      {/* 3. MOBILE SLIDE-OUT MENU DRAWER */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-[#070C15] border-r border-brand-gold/40 text-stone-100 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-brand-light/40 flex items-center justify-between bg-brand-navy">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                <img src="/mughal-steel-logo.png" alt="Mughal Steel Logo" className="h-10 w-auto object-contain drop-shadow" />
              </Link>

              <div className="flex items-center gap-2">
                <Link 
                  to="/wishlist" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-300 hover:text-brand-gold relative"
                  title="Saved Designs"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-dark font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>


            {/* Drawer Navigation List */}
            <div className="p-4 space-y-1 font-heading text-xs font-bold uppercase tracking-wider divide-y divide-brand-light/30">
              
              {/* 1. HOME */}
              <div className="pt-2 pb-2">
                <button 
                  type="button"
                  onClick={() => handleNavClick('home', '/')}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded text-left ${
                    isNavActive('home', '/') ? 'bg-brand-navy text-brand-gold border border-brand-gold/40' : 'text-stone-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-brand-gold" />
                    <span>HOME</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* 2. ABOUT */}
              <div className="py-2">
                <button 
                  type="button"
                  onClick={() => handleNavClick('about', '/about')}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded text-left ${
                    isNavActive('about', '/about') ? 'bg-brand-navy text-brand-gold border border-brand-gold/40' : 'text-stone-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <UserIcon className="w-4 h-4 text-brand-gold" />
                    <span>ABOUT</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* 3. SERVICES (Direct Nav) */}
              <div className="py-2">
                <button 
                  type="button"
                  onClick={() => handleNavClick('services', '/#services')}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded text-left ${
                    isNavActive('services', '/services') ? 'bg-brand-navy text-brand-gold border border-brand-gold/40' : 'text-stone-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Cog className="w-4 h-4 text-brand-gold" />
                    <span>SERVICES</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* 4. PRODUCTS Accordion */}
              <div className="py-2 space-y-2">
                <button 
                  onClick={() => setMobileExpandedSection(mobileExpandedSection === 'products' ? null : 'products')}
                  className="w-full flex items-center justify-between py-2 px-3 text-stone-200 hover:text-brand-gold cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-brand-gold" />
                    <span>PRODUCTS</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'products' ? 'rotate-180 text-brand-gold' : 'text-slate-500'}`} />
                </button>

                {mobileExpandedSection === 'products' && (
                  <div className="pl-6 space-y-1 font-sans text-xs normal-case border-l-2 border-brand-gold/40 my-2">
                    <button 
                      type="button"
                      onClick={() => handleNavClick('products', '/items')} 
                      className="block w-full text-left py-1 text-brand-gold font-bold font-heading uppercase text-[11px]"
                    >
                      ★ All Products Catalog →
                    </button>
                    <Link to="/items?item=Main+Gates" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-brand-gold">Main & Front Gates</Link>
                    <Link to="/items?item=Doors" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-brand-gold">Pivot & Steel Doors</Link>
                    <Link to="/items?item=Windows" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-brand-gold">Windows & Security Grills</Link>
                    <Link to="/items?item=Balcony+Railing" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-brand-gold">Balcony & Stair Railings</Link>
                    <Link to="/items?item=Aluminum+%26+Glass+Partitions" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-brand-gold">Aluminum & Glass Works</Link>
                    <Link to="/items?item=Sheds+%26+Canopies" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-brand-gold">Car Porch Sheds & Pergolas</Link>
                  </div>
                )}
              </div>

              {/* 5. PORTFOLIO Accordion (10 Categories) */}
              <div className="py-2 space-y-2">
                <button 
                  onClick={() => setMobileExpandedSection(mobileExpandedSection === 'projects' ? null : 'projects')}
                  className="w-full flex items-center justify-between py-2 px-3 text-stone-200 hover:text-brand-gold cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Grid className="w-4 h-4 text-brand-gold" />
                    <span>PORTFOLIO (10 CATEGORIES)</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'projects' ? 'rotate-180 text-brand-gold' : 'text-slate-500'}`} />
                </button>

                {mobileExpandedSection === 'projects' && (
                  <div className="pl-6 space-y-1 font-sans text-xs normal-case border-l-2 border-brand-gold/40 my-2">
                    <button 
                      type="button"
                      onClick={() => handleNavClick('portfolio', '/categories')} 
                      className="block w-full text-left py-1 text-brand-gold font-bold font-heading uppercase text-[11px]"
                    >
                      ★ View All Categories →
                    </button>
                    {(categories && categories.length > 0 ? categories : PROJECT_CATEGORIES_DATA).map((cat) => (
                      <Link 
                        key={cat.id} 
                        to={`/categories/${cat.slug}`} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-slate-300 hover:text-brand-gold"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. PROJECTS (Completed Installations) */}
              <div className="py-2">
                <button 
                  type="button"
                  onClick={() => handleNavClick('projects', '/projects')}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded text-left ${
                    isNavActive('projects', '/projects') ? 'bg-brand-navy text-brand-gold border border-brand-gold/40' : 'text-stone-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-brand-gold" />
                    <span>PROJECTS (COMPLETED SITES)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* 7. REVIEWS */}
              <div className="py-2">
                <button 
                  type="button"
                  onClick={() => handleNavClick('reviews', '/reviews')}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded text-left ${
                    isNavActive('reviews', '/reviews') ? 'bg-brand-navy text-brand-gold border border-brand-gold/40' : 'text-stone-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>REVIEWS</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* 8. CONTACT */}
              <div className="py-2">
                <button 
                  type="button"
                  onClick={() => handleNavClick('contact', '/contact')}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded text-left ${
                    isNavActive('contact', '/contact') ? 'bg-brand-navy text-brand-gold border border-brand-gold/40' : 'text-stone-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-brand-gold" />
                    <span>CONTACT</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Account / Admin / Logout */}
              <div className="py-2 border-t border-brand-light/30">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2 px-3 text-amber-400 font-bold hover:bg-brand-dark/40 rounded"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span>ADMIN PORTAL</span>
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                    <Link 
                      to="/account" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 px-3 text-stone-200 hover:text-brand-gold"
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-brand-gold" />
                        <span>MY ACCOUNT ({user?.firstName})</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </Link>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full text-left flex items-center justify-between py-2 px-3 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>LOGOUT</span>
                      </span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/account" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 text-stone-200 hover:text-brand-gold"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-brand-gold" />
                      <span>SIGN IN / REGISTER</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                )}
              </div>

              {/* Theme Switcher in Mobile Drawer */}
              <div className="py-3 px-3 border-t border-brand-light/30 flex items-center justify-between">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                  {isDark ? <Moon className="w-4 h-4 text-brand-gold" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
                </span>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-dark transition cursor-pointer"
                >
                  {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>

            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 bg-brand-navy border-t border-brand-light/40 space-y-2.5">
              <Link 
                to="/quote" 
                onClick={() => setMobileMenuOpen(false)}
                className="btn-gold w-full text-center py-3 text-xs font-bold uppercase tracking-wider block"
              >
                Request a Free Quote
              </Link>

              <a 
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full text-center py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Us on WhatsApp</span>
              </a>

              <p className="text-[10px] text-slate-400 text-center pt-1 font-mono">
                Rawalpindi / Islamabad Workshops • +92 300 1234567
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. LIVE PRODUCT SEARCH MODAL */}
      {/* ======================================================== */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 px-4 animate-fade-in">
          <div className="bg-brand-navy border border-brand-gold/50 max-w-2xl w-full p-6 rounded-lg shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-gold" />
                <h3 className="font-heading text-sm font-black uppercase tracking-wider text-brand-gold">
                  Search Mughal Steel Products
                </h3>
              </div>
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={executeSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search by code (MFG-001), name (Metropolis Gate), or item (Door, Railing)..."
                value={searchQuery}
                onChange={handleSearch}
                autoFocus
                className="w-full bg-brand-dark border border-brand-light p-3.5 pr-12 text-sm text-stone-100 placeholder-slate-500 rounded focus:outline-none focus:border-brand-gold font-sans"
              />
              <button 
                type="submit"
                className="absolute right-3 top-3.5 text-brand-gold hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Live Search Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Found {searchResults.length} Products:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2.5 bg-brand-dark/90 hover:bg-brand-medium border border-brand-light/60 rounded transition-colors"
                    >
                      <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded shrink-0 bg-black" />
                      <div className="space-y-0.5 overflow-hidden">
                        <span className="text-[9px] font-mono text-brand-gold font-bold block">{prod.productCode}</span>
                        <h4 className="font-heading font-bold text-xs text-stone-100 truncate">{prod.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{prod.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim().length > 1 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No products matching &ldquo;{searchQuery}&rdquo;. Try &ldquo;Gate&rdquo;, &ldquo;Door&rdquo;, or &ldquo;MFG-001&rdquo;.
              </p>
            ) : null}

          </div>
        </div>
      )}

    </>
  );
};
