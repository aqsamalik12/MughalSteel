import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { FileText, ShieldCheck, HelpCircle, CheckCircle2, MessageCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { getWhatsAppUrl } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whatsappDirect = getWhatsAppUrl('Hello Mughal Steel Fabrication, I would like to clarify commercial terms for my project.');

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-heading font-black uppercase tracking-widest rounded-sm">
            <FileText className="w-4 h-4" />
            <span>Commercial Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            TERMS & CONDITIONS
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Please review our commercial terms governing quotation validity, site measurements, material specifications, fabrication schedules, and turnkey delivery.
          </p>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              1. Price Estimates & Quotation Validity
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              All online calculations, cart summaries, and catalog rates displayed on this platform are preliminary estimates based on square footage base rates. Official written quotations provided by Mughal Steel Fabrication remain valid for <strong>15 calendar days</strong> from issuance, subject to steel commodity market price stability.
            </p>
          </div>

          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              2. On-Site Measurement & CAD Approval
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Prior to cutting raw steel, our field survey team conducts a laser dimension survey to verify column plumbness, driveway slopes, and frame offsets. Fabrication begins strictly after the client signs off on the official 2D/3D CAD shop drawing.
            </p>
          </div>

          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              3. Milestone Payment Terms
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-300 font-sans list-disc list-inside">
              <li><strong>50% Advance:</strong> Upon CAD drawing sign-off to procure certified steel sheets and box pipes.</li>
              <li><strong>40% Upon Workshop Inspection:</strong> Prior to final powder coating and dispatch.</li>
              <li><strong>10% On Handover:</strong> After on-site installation, laser leveling, and roller motor testing.</li>
            </ul>
          </div>

          <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-3 shadow-lg">
            <h2 className="text-sm sm:text-base font-heading font-black text-brand-gold uppercase tracking-wide">
              4. Delivery Timeline & Jurisdiction
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Standard fabrication timelines range from 10 to 15 business days depending on design complexity. On-site installation is scheduled in coordination with client civil contractors. All commercial transactions are governed by Rawalpindi / Islamabad legal jurisdiction.
            </p>
          </div>

        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-brand-navy via-[#0B1320] to-brand-navy border border-brand-gold/40 p-8 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-heading font-black text-lg text-stone-100 uppercase">Ready to Proceed with Your Project?</h3>
            <p className="text-xs text-slate-400">Request a free site survey and engineering estimate today.</p>
          </div>
          <Link to="/quote" className="btn-gold text-xs py-3 px-6 uppercase font-bold tracking-wider shrink-0 flex items-center gap-2">
            <span>Request Official Quotation</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
