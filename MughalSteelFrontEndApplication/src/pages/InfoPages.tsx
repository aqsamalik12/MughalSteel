import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, FileText } from 'lucide-react';

export const ShippingPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
        <div className="flex items-center space-x-3 text-brand-gold border-b border-brand-light pb-4">
          <Truck className="w-8 h-8" />
          <h1 className="text-4xl font-serif uppercase tracking-widest">Shipping & Delivery</h1>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Freight Delivery Process</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            Due to the structural weight and dimensions of IronCraft double doors, pivots, and custom steel frames, all entries are shipped via heavy freight LTL carriers. Your door will arrive crated in a custom wooden container, secured by industrial straps to prevent vibration and damage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Lead Times</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            - **In-Stock Units**: Standard units ship out within 5-7 business days. Delivery transits average 5-10 business days depending on location.<br />
            - **Bespoke/Custom Design Doors**: Custom entries require hand-forging, structural frame welding, glass sealing, and customized finishing coats. Current lead times for custom layouts average 12-16 weeks.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Freight Charges</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            Flat-rate freight shipping for single or double entry doors is **$350** inside the continental US. Smaller hardware components ship flat-rate at **$45**. Orders exceeding **$8,000** are qualified for **FREE standard freight shipping**.
          </p>
        </section>

        <section className="space-y-4 bg-brand-medium/50 border border-brand-light p-6 rounded">
          <h3 className="text-sm font-serif text-brand-gold uppercase tracking-widest mb-2 font-bold">Important: Inspection Requirement</h3>
          <p className="text-stone-400 text-xs leading-relaxed">
            You or your general contractor must inspect the wooden crate for signs of damage BEFORE signing the freight receipt. If the crate is damaged, take photos immediately, write "Damaged upon receipt" on the shipping slip, refuse the shipment, and call our service department at (800) 555-IRON.
          </p>
        </section>

        <div className="pt-6">
          <Link to="/quote" className="btn-gold text-xs inline-flex items-center space-x-2">
            <span>Ask a Shipping Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ReturnsPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
        <div className="flex items-center space-x-3 text-brand-gold border-b border-brand-light pb-4">
          <RefreshCw className="w-8 h-8" />
          <h1 className="text-4xl font-serif uppercase tracking-widest">Returns & Refund Policy</h1>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">In-Stock Standard Return Policy</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            We accept returns of unused, uninstalled, standard in-stock doors within **30 days** of delivery. The item must remain in its original crate, undamaged. The customer is responsible for standard LTL return freight fees ($350) and a 15% restocking fee.
          </p>
        </section>

        <section className="space-y-4 bg-red-950/20 border border-red-900/30 p-6 rounded">
          <h3 className="text-sm font-serif text-red-400 uppercase tracking-widest mb-2 font-bold">Custom Designs & Bespoke Orders</h3>
          <p className="text-stone-400 text-xs leading-relaxed">
            Doors created via the Custom Designer, designed to specific non-standard dimensions, custom-welded configurations, or customized finishes are **non-returnable and non-refundable**. Each custom door is made specifically for your home's structural framing and cannot be resold.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Damage Claims</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            In the rare event of damage occurring during transit, you must contact us within 48 hours of delivery. Include detailed photographs of the damaged shipping box/crate and the door unit itself. We will arrange a replacement or refund at no extra cost.
          </p>
        </section>

        <div className="pt-6">
          <Link to="/contact" className="btn-gold text-xs inline-flex items-center space-x-2">
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const WarrantyPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
        <div className="flex items-center space-x-3 text-brand-gold border-b border-brand-light pb-4">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-4xl font-serif uppercase tracking-widest">Product Warranty</h1>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Coverage Structure</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            Every IronCraft door is backed by our comprehensive warranty coverage:<br />
            - **Iron Frame & Structural Welds**: 10-Year Limited Warranty.<br />
            - **Finishes & Paint**: 5-Year Limited Warranty against peeling, blistering, or flaking under normal exposure.<br />
            - **Glass Units & Seals**: 5-Year Limited Warranty against seal failure and moisture fogging.<br />
            - **Handles & Locks**: 2-Year Limited Warranty on mechanics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Warranty Exclusions</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            This warranty does not cover damages caused by:<br />
            - Improper installation or failing to follow structural guidelines.<br />
            - Modifications made to the door frame after leaving our facility.<br />
            - Extreme marine atmospheres or coastal salt spray without choosing our special Marine Clear Finish.<br />
            - Natural wear-and-tear or minor cosmetic fading of bronze highlighting over time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Claims Process</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            To submit a warranty claim, prepare your invoice details, structural photographs of the issue, and email them to <a href="mailto:mughalsteelfabrication51@gmail.com?subject=Warranty%20Claim%20%E2%80%93%20Mughal%20Steel%20Fabrication" className="text-brand-gold font-bold underline hover:brightness-110">mughalsteelfabrication51@gmail.com</a>. A certified structural inspector will review your case within 5 business days.
          </p>
        </section>

        <div className="pt-6">
          <Link to="/contact" className="btn-gold text-xs inline-flex items-center space-x-2">
            <span>File a Claim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center space-x-3 text-brand-gold border-b border-brand-light pb-4">
          <FileText className="w-8 h-8" />
          <h1 className="text-4xl font-serif uppercase tracking-widest">Privacy Policy</h1>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed">
          At IronCraft Doors, your privacy is a cornerstone of our service. We collect information like your name, email, phone, and project measurements to construct accurate quotes and deliver products. We do not sell your data. Mock credit card transactions during checkout are processed via simulated systems and card details are never stored.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center space-x-3 text-brand-gold border-b border-brand-light pb-4">
          <FileText className="w-8 h-8" />
          <h1 className="text-4xl font-serif uppercase tracking-widest">Terms & Conditions</h1>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed">
          By browsing or buying from IronCraft Doors, you agree to our terms. Structural framing, threshold level checks, and building permit clearances are the absolute responsibility of the homeowner and installer. Estimated prices in the Custom Designer and Try-on tools are mock approximations; formal contracts will specify official final pricing.
        </p>
      </div>
    </div>
  );
};
