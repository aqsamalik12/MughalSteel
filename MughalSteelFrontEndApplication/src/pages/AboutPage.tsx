import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Hammer, Factory, Sparkles, 
  MapPin, CheckCircle2, MessageCircle, ArrowRight,
  Cpu, Layers, FileText, Share2, Phone
} from 'lucide-react';
import { useSEO } from '../utils/useSEO';
import { handleImageError } from '../utils/imageFallback';

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About Mughal Steel Fabrication | High Court Road, Rawalpindi',
    description: 'Mughal Steel Fabrication is a premier metal fabrication business on High Court Road, Rawalpindi, owned & operated by Muhammad Qasim. Traditional craftsmanship, modern engineering, and digital 3D workflows.',
    keywords: 'Mughal Steel Fabrication, Muhammad Qasim, High Court Road Rawalpindi, metal fabrication Rawalpindi Islamabad, custom ironwork, steel stairs, laser cut gates',
    url: '/about'
  });

  const { getWhatsAppUrl } = useData();

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  const coreServices = [
    {
      title: 'Custom Ironwork',
      desc: 'Specializes in bespoke wrought iron and cast iron fabrications, such as double-height main entrance doors, security gates, ornamental window panels, and safety grills.',
      icon: Hammer,
      badge: 'Bespoke Forge'
    },
    {
      title: 'Staircase Engineering',
      desc: 'Designs and constructs mild steel staircases including spiral, L-shaped, cantilevered, and single-beam stairs integrated with marble treads.',
      icon: Layers,
      badge: 'Structural Design'
    },
    {
      title: 'Architectural & Outdoor Structures',
      desc: 'Fabricates tempered glass balcony railings, CNC laser-cut metal panels, outdoor perimeter fencing, and retractable wave canopy pergolas using tensile fabric.',
      icon: Sparkles,
      badge: 'Modern Exterior'
    },
    {
      title: 'Industrial & Heavy Works',
      desc: 'Provides heavy structural steel fabrication and high-tensile architectural steel solutions tailored to residential and commercial projects.',
      icon: Factory,
      badge: 'Heavy Fabrication'
    }
  ];

  const digitalWorkflow = [
    {
      step: '01',
      title: '3D Renders & Design',
      desc: 'Utilizes advanced AI image generation and 3D rendering tools to give clients a live visual preview of custom gates, stairs, and structures before production begins.',
      icon: Cpu,
      highlight: 'AI & 3D Previews'
    },
    {
      step: '02',
      title: 'Streamlined Consultation',
      desc: 'Employs WhatsApp catalogs, digital rate lists, and instant quotation frameworks to simplify customer communication and project estimates.',
      icon: FileText,
      highlight: 'Transparent Estimates'
    },
    {
      step: '03',
      title: 'Digital Marketing & Reach',
      desc: 'Maintains an active online presence across social media platforms (Facebook, Instagram, TikTok, and YouTube) with targeted campaigns to connect with residential and commercial clients across the twin cities.',
      icon: Share2,
      highlight: 'Twin Cities Reach'
    }
  ];

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 font-sans animate-fade-in">
      
      {/* Hero Banner with Executive Ownership & Location */}
      <section 
        className="w-full relative py-20 md:py-32 bg-cover bg-center flex items-center justify-center text-center border-b border-brand-light/40 overflow-hidden"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(5,8,14,0.28), rgba(5,8,14,0.45)), url('/mughal-luxury-architectural-villa.jpg')` 
        }}
      >
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-gold/15 border border-brand-gold/50 text-brand-gold text-xs font-mono font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5" />
            <span>High Court Road, Rawalpindi • Muhammad Qasim</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-stone-100 uppercase tracking-tight leading-tight drop-shadow-2xl">
            ABOUT MUGHAL STEEL FABRICATION
          </h1>

          <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto font-sans font-normal drop-shadow">
            Mughal Steel Fabrication is a premier metal fabrication business located on High Court Road in Rawalpindi, Pakistan, owned and operated by <span className="text-brand-gold font-semibold">Muhammad Qasim</span>. The enterprise is recognized for combining traditional craftsmanship with modern engineering and digital workflows.
          </p>

          <div className="pt-3 flex flex-wrap justify-center gap-3.5">
            <Link to="/quote" className="btn-gold text-xs py-3 px-7 font-bold uppercase tracking-wider shadow-lg">
              Get an Instant Quote
            </Link>
            <a 
              href={getWhatsAppUrl('Hello Muhammad Qasim, I would like to consult regarding custom steel fabrication for my project.')}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-3 px-7 font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Consultation</span>
            </a>
            <a 
              href="tel:03005197825"
              className="inline-flex items-center gap-2 bg-black/50 hover:bg-black/75 border border-stone-600 text-stone-200 hover:text-white text-xs py-3 px-6 rounded font-heading font-bold uppercase tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>0300-5197825</span>
            </a>
          </div>
        </div>
      </section>

      {/* Core Brand Highlights Bar */}
      <section className="w-full bg-brand-navy/90 border-b border-brand-light/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Ownership</p>
            <p className="text-lg sm:text-xl font-heading font-black text-brand-gold">Muhammad Qasim</p>
            <p className="text-[11px] text-slate-400">Owner & Operator</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Location</p>
            <p className="text-lg sm:text-xl font-heading font-black text-brand-gold">High Court Road</p>
            <p className="text-[11px] text-slate-400">Rawalpindi, Pakistan</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Workshop Yard</p>
            <p className="text-lg sm:text-xl font-heading font-black text-brand-gold">Modern Machinery</p>
            <p className="text-[11px] text-slate-400">Dedicated Fabrication Yard</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Digital Flow</p>
            <p className="text-lg sm:text-xl font-heading font-black text-brand-gold">AI & 3D Renderings</p>
            <p className="text-[11px] text-slate-400">Digital Lists & Instant Estimates</p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* SECTION 1: Core Specializations & Services */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-light/40 pb-5">
            <div className="space-y-2">
              <span className="text-brand-gold text-xs font-mono font-bold uppercase tracking-widest block">
                1. CORE SPECIALIZATIONS & SERVICES
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                Craftsmanship Meets Heavy Engineering
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md font-sans">
              From bespoke classical ironwork to high-tensile structural steel for residential and commercial projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {coreServices.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-brand-navy/90 backdrop-blur-xs border border-brand-light/60 p-7 sm:p-8 rounded-xl space-y-4 hover:border-brand-gold/80 transition-all duration-300 shadow-xl group hover:bg-brand-medium/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                      {svc.badge}
                    </span>
                  </div>

                  {/* Professional spacious heading with clean typography */}
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-stone-100 tracking-wide leading-snug group-hover:text-brand-gold transition-colors pt-1">
                    {svc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pt-0.5">
                    {svc.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: Workshop & Expert Team */}
        <section className="bg-[#080D17] border border-brand-light/60 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-brand-gold text-xs font-mono font-bold uppercase tracking-widest block">
                  2. WORKSHOP & EXPERT TEAM
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
                  High-Precision Yard in Rawalpindi
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <div className="p-4 bg-brand-navy/90 border-l-4 border-brand-gold rounded-r-lg">
                  <p className="font-semibold text-stone-100">
                    Operates a dedicated fabrication yard in Rawalpindi equipped with modern machinery and tools.
                  </p>
                </div>
                <div className="p-4 bg-brand-navy/90 border-l-4 border-brand-gold rounded-r-lg">
                  <p className="font-semibold text-stone-100">
                    Powered by skilled steel fabricators, welders, and operational managers who ensure high structural standards and precision.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>High Court Road Yard</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Certified Welders & Fabricators</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Modern Machinery & Tools</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>High Structural Standards</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-brand-gold/60 shadow-2xl bg-black group">
                <img 
                  src="/mughal-steel-workshop-master.jpg" 
                  alt="Muhammad Qasim & Mughal Steel Fabrication Team - High Court Road Yard" 
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-6">
                  <span className="font-mono text-xs font-bold text-brand-gold uppercase tracking-wider bg-black/80 px-2.5 py-1 rounded border border-brand-gold/40 self-start">
                    High Court Road Yard • Muhammad Qasim & Expert Team
                  </span>
                  <span className="text-xs text-slate-200 font-sans mt-2 leading-relaxed drop-shadow">
                    Powered by skilled steel fabricators, welders, and operational managers who ensure high structural standards and precision.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Digital Workflow & Client Consultation Process */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest">
              3. DIGITAL WORKFLOW & CLIENT CONSULTATION PROCESS
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
              Modern Digital Workflows & Seamless Reach
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              From 3D previews to instant WhatsApp catalogs and twin-city digital marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {digitalWorkflow.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-brand-navy border border-brand-light/60 p-6 sm:p-7 rounded-xl space-y-4 hover:border-brand-gold transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-mono font-black text-brand-gold/60">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-heading font-black text-stone-100 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-brand-light/40">
                    <span className="text-[11px] font-mono text-brand-gold font-bold uppercase tracking-wider">
                      ✦ {item.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Executive Direct Contact & Quote CTA */}
        <section className="bg-gradient-to-r from-brand-navy via-[#0C1424] to-brand-navy border border-brand-gold/40 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest">
              DIRECT CONSULTATION WITH MUHAMMAD QASIM
            </span>
            <h3 className="text-2xl sm:text-4xl font-heading font-black text-stone-100 uppercase">
              Ready to Discuss Your Project?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Connect directly with Muhammad Qasim and our engineering team for instant WhatsApp catalogs, 3D render previews, and precise project estimates.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <a 
              href={getWhatsAppUrl('Hello Muhammad Qasim, I would like to get a quote and review designs for my project.')}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-3.5 px-8 font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
            <Link 
              to="/quote" 
              className="btn-gold text-xs py-3.5 px-8 font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl"
            >
              <span>Request Instant Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 bg-black/60 hover:bg-black/85 border border-stone-600 hover:border-brand-gold text-stone-200 hover:text-white text-xs py-3.5 px-6 rounded font-heading font-bold uppercase tracking-wider transition-colors"
            >
              <span>View Completed Projects</span>
            </Link>
          </div>
        </section>

      </div>

    </div>
  );
};
