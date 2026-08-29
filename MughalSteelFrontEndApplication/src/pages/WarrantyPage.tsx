import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ShieldCheck, Award, AlertCircle, FileText, CheckCircle2, MessageCircle } from 'lucide-react';

export const WarrantyPage: React.FC = () => {
  const { getWhatsAppUrl } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whatsappDirect = getWhatsAppUrl('Hello Mughal Steel Fabrication, I have a warranty inquiry regarding my installation.');

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-heading font-black uppercase tracking-widest rounded-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Structural Assurance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            WARRANTY & GUARANTEE POLICY
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            At Mughal Steel Fabrication, we stand behind the durability and structural integrity of every gate, railing, stair, and steel structure we build.
          </p>
        </div>

        {/* 3 Pillars Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-brand-navy border border-brand-light/60 rounded-lg space-y-3 text-center shadow-xl">
            <Award className="w-10 h-10 text-brand-gold mx-auto" />
            <h3 className="font-heading font-black text-base text-stone-100 uppercase">10-Year Structural Guarantee</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Covers core steel frame integrity, structural weld penetration, and hinge anchoring against cracking or sagging.
            </p>
          </div>

          <div className="p-8 bg-brand-navy border border-brand-light/60 rounded-lg space-y-3 text-center shadow-xl">
            <ShieldCheck className="w-10 h-10 text-brand-gold mx-auto" />
            <h3 className="font-heading font-black text-base text-stone-100 uppercase">3-Year Anti-Rust Protection</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hot-zinc chemical phosphate primer & high-bake electrostatic powder coating against blistering, flaking, or atmospheric corrosion.
            </p>
          </div>

          <div className="p-8 bg-brand-navy border border-brand-light/60 rounded-lg space-y-3 text-center shadow-xl">
            <FileText className="w-10 h-10 text-brand-gold mx-auto" />
            <h3 className="font-heading font-black text-base text-stone-100 uppercase">1-Year Moving Hardware Warranty</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Mechanical sliding rollers, heavy ball bearings, track alignments, and gate locksets covered for 12 months.
            </p>
          </div>
        </div>

        {/* Detailed Sections (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              1. Material & Gauge Standards
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mughal Steel Fabrication warrants that all fabricated products are constructed using minimum certified 14-gauge to 10-gauge structural steel pipes, cold-rolled steel sheets, and solid forging bars. All weld joints undergo rigorous quality inspections to ensure full penetration and zero porosity.
            </p>
          </div>

          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              2. Finishing & Surface Coating
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              All steel surfaces are sandblasted, treated with an active zinc-phosphate anti-rust undercoat, and cured with high-bake industrial powder coating. This warranty covers bubbling, blistering, or flaking under standard residential atmospheric conditions.
            </p>
          </div>

          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              3. Turnkey On-Site Installation
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our expert installation team conducts laser leveling and heavy anchor-bolting to ensure smooth, plumb operation without sagging or binding. Workmanship warranty covers track re-alignment and hardware servicing.
            </p>
          </div>

          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              4. Claims & Direct Support
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              To request a warranty inspection or service visit, contact our Rawalpindi workshop desk with your invoice number and site elevation photo. Our field engineers will be dispatched within 48 hours.
            </p>
          </div>

        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-brand-navy via-[#0B1320] to-brand-navy border border-brand-gold/40 p-8 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-heading font-black text-lg text-stone-100 uppercase">Have a Question About Your Installation?</h3>
            <p className="text-xs text-slate-400">Our customer service engineers are available 6 days a week.</p>
          </div>
          <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-xs py-3 px-6 uppercase font-bold tracking-wider shrink-0 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Contact Warranty Desk</span>
          </a>
        </div>

      </div>
    </div>
  );
};
