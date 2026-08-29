import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ShieldCheck, Hammer, Award, Factory, Sparkles, 
  MapPin, CheckCircle2, MessageCircle, ArrowRight 
} from 'lucide-react';
import { useSEO } from '../utils/useSEO';

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About Mughal Steel Fabrication | Quality Steel Fabrication',
    description: 'Learn about Mughal Steel Fabrication, our 30+ year engineering heritage in Rawalpindi & Islamabad, and our certified 14-gauge structural steel standards.',
    keywords: 'About Mughal Steel, steel fabricators Pakistan, metal workshop Rawalpindi, gate manufacturers Islamabad',
    url: '/about'
  });

  const { settings, getWhatsAppUrl } = useData();

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  const stats = [
    { value: '30+', label: 'Years of Metal Heritage' },
    { value: '5,000+', label: 'Gates & Railings Fabricated' },
    { value: '10-Year', label: 'Anti-Sag Structural Warranty' },
    { value: '100%', label: 'Certified 14G/16G MS Steel' }
  ];

  const milestones = [
    { year: '1996', title: 'Foundation & Forging Heritage', desc: 'Established as an artisan blacksmith and architectural iron forge workshop in Rawalpindi & Islamabad.' },
    { year: '2010', title: 'CNC Laser & Automation', desc: 'Introduced industrial fiber laser cutting technology and motorized sliding/swing automation.' },
    { year: '2018', title: 'Multi-City Expansion', desc: 'Deployed dedicated installation teams across Islamabad, Rawalpindi, Lahore, and KPK.' },
    { year: '2026', title: 'Digital Visual Showroom', desc: 'Launched live Try at Home elevation visualizer studio and transparent square-foot calculator.' }
  ];

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 font-sans animate-fade-in">
      
      {/* Hero Banner */}
      <section 
        className="w-full relative py-20 md:py-28 bg-cover bg-center flex items-center justify-center text-center border-b border-brand-light/40"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(5,8,14,0.85), rgba(5,8,14,0.95)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')` 
        }}
      >
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MASTER CRAFTSMEN IN ARCHITECTURAL STEEL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-stone-100 uppercase tracking-tight leading-tight">
            ABOUT MUGHAL STEEL FABRICATION
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            Combining traditional blacksmith forge artistry with millimeter-precise CNC fiber laser cutting to create iconic gates, railings, floating staircases, and luxury facades.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link to="/categories" className="btn-gold text-xs py-3 px-6 font-bold uppercase tracking-wider">
              Explore 10 Categories
            </Link>
            <a 
              href={getWhatsAppUrl('Hello Mughal Steel, I would like to learn more about your fabrication services.')}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-3 px-6 font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full bg-brand-navy/80 border-b border-brand-light/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-heading font-black text-brand-gold">{s.value}</p>
              <p className="text-slate-300 text-xs uppercase tracking-wider font-semibold font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
        
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-brand-gold text-xs font-mono font-bold uppercase tracking-widest block">
              OUR HERITAGE & MISSION
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-stone-100 uppercase tracking-tight">
              Forging Architectural Statements That Endure Generations
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              Mughal Steel Fabrication was founded with a dedicated mission: to elevate standard security metalwork into architectural masterpieces. We engineer structural steel solutions for prestigious housing societies, luxury modern residences, classical villas, and commercial complexes across Pakistan.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              Every gate, railing, staircase, and partition is constructed from heavy-gauge structural carbon steel (minimum 14-gauge certified), treated with active hot-zinc anti-corrosion primer, and cured in high-bake powder coating ovens.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-brand-navy border border-brand-light/60 rounded-lg space-y-1">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                <h4 className="font-heading font-bold text-xs text-stone-100 uppercase">10-Year Warranty</h4>
                <p className="text-[11px] text-slate-400">Sag-free guarantee & chemical primer protection.</p>
              </div>
              <div className="p-4 bg-brand-navy border border-brand-light/60 rounded-lg space-y-1">
                <Hammer className="w-5 h-5 text-brand-gold" />
                <h4 className="font-heading font-bold text-xs text-stone-100 uppercase">±0.1mm Precision</h4>
                <p className="text-[11px] text-slate-400">High-power industrial fiber laser profiling.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-brand-gold/40 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80" 
                alt="Mughal Steel Workshop" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3.5 rounded border border-brand-light/60 flex items-center justify-between text-xs">
                <span className="font-mono text-brand-gold font-bold">Rawalpindi & Islamabad Workshops</span>
                <span className="text-slate-300 font-mono text-[11px]">Direct Laser Cutters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest">
              EVOLUTION & TRACK RECORD
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-stone-100 uppercase">
              Three Decades of Engineering Excellence
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-5 bg-brand-navy border border-brand-light/60 rounded-lg space-y-3 relative hover:border-brand-gold transition-colors">
                <span className="text-2xl font-mono font-black text-brand-gold block">{m.year}</span>
                <h4 className="font-heading font-bold text-sm text-stone-100 uppercase">{m.title}</h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
