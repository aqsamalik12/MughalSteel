import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEED_SERVICES } from '../data/seedData';
import { useData } from '../context/DataContext';
import { 
  ShieldCheck, Hammer, Layers, Shield, Maximize2, 
  Factory, ArrowRight, MessageCircle, Sparkles, CheckCircle2 
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { getWhatsAppUrl, services } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorClosed': return <ShieldCheck className="w-5 h-5 text-brand-gold" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-brand-gold" />;
      case 'Layers': return <Layers className="w-5 h-5 text-brand-gold" />;
      case 'Shield': return <Shield className="w-5 h-5 text-brand-gold" />;
      case 'Maximize2': return <Maximize2 className="w-5 h-5 text-brand-gold" />;
      default: return <Factory className="w-5 h-5 text-brand-gold" />;
    }
  };

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-sm">
            <Hammer className="w-3.5 h-3.5" />
            <span>09. INDUSTRIAL & ARCHITECTURAL EXPERTISE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            STEEL FABRICATION SERVICES
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
            From CNC fiber laser cutting and hand-forged wrought iron to structural industrial trusses and architectural pivot glass facades, explore our turnkey fabrication solutions.
          </p>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services || SEED_SERVICES).map((serv, idx) => (
            <div 
              key={serv.id}

              className="bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-brand-gold transition-all duration-300 shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img 
                  src={serv.image} 
                  alt={serv.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-brand-dark/90 backdrop-blur-md border border-brand-gold/40 text-brand-gold text-xs font-mono font-bold px-2.5 py-1 rounded shadow">
                  SERVICE 0{idx + 1}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    {getIcon(serv.icon)}
                    <h3 className="font-heading text-base font-bold text-stone-100 group-hover:text-brand-gold transition-colors uppercase">
                      {serv.title}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed font-sans">
                    {serv.description}
                  </p>

                  <div className="pt-2 border-t border-brand-light/40 space-y-1.5">
                    <span className="text-[10px] font-heading font-bold text-brand-gold uppercase tracking-wider block">
                      Key Highlights:
                    </span>
                    {(Array.isArray(serv.features) ? serv.features : []).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-light/40 flex items-center justify-between gap-3">
                  <a 
                    href={getWhatsAppUrl(`Hello Mughal Steel, I am inquiring about your ${serv.title} service.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold uppercase tracking-wider"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <Link 
                    to="/quote" 
                    className="btn-gold text-[10px] py-2 px-3.5 uppercase font-bold"
                  >
                    <span>Get Quote</span>
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
