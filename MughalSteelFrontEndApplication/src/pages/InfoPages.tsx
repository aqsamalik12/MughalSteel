import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, FileText } from 'lucide-react';
import { useSEO } from '../utils/useSEO';

export const ShippingPage: React.FC = () => {
  useSEO({
    title: 'Shipping & On-Site Installation | Mughal Steel Fabrication',
    description: 'Learn about our heavy structural transport, crating, and on-site laser alignment installation process across Pakistan.',
    url: '/shipping'
  });
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
            Due to the structural weight and dimensions of Mughal Steel double driveway gates, pivot doors, and custom steel frames, all entries are transported via specialized heavy flatbed carriers with cushioned crating to prevent vibration and damage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Fabrication & Delivery Timelines</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            - **Standard Catalog Products**: Standard manufactured units are prepared within 7-10 business days.<br />
            - **Bespoke / Custom CAD Architectural Designs**: Custom entries require CNC fiber laser profiling, hand-forging, structural frame welding, zinc anti-rust primer, and electrostatic powder baking. Turnaround averages 14-21 business days.
          </p>
        </section>

        <div className="pt-6">
          <Link to="/contact" className="btn-gold text-xs inline-flex items-center space-x-2">
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
  useSEO({
    title: '10-Year Structural Warranty | Mughal Steel Fabrication',
    description: 'Read the official 10-Year Structural Anti-Sag and 5-Year Anti-Corrosion warranty policy for Mughal Steel Fabrication products.',
    url: '/warranty'
  });
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
            Every Mughal Steel gate and door is backed by our comprehensive warranty coverage:<br />
            - **Steel Frame & Structural Welds**: 10-Year Limited Structural Warranty.<br />
            - **Finishes & Electrostatic Powder Coat**: 5-Year Limited Warranty against blistering or flaking under normal environmental exposure.<br />
            - **Glass Units & Seals**: 5-Year Limited Warranty against seal failure and moisture fogging.<br />
            - **Italian Gate Automation & Motors**: 2-Year Official Manufacturer Warranty.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif text-stone-100 uppercase tracking-widest border-l-2 border-brand-gold pl-3">Warranty Exclusions</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            This warranty does not cover damages caused by:<br />
            - Improper installation by unauthorized third parties failing to follow structural leveling guidelines.<br />
            - Unapproved modifications made to the frame after leaving our fabrication workshop.<br />
            - Natural wear-and-tear or minor cosmetic fading of bronze highlighting over extended years.
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
  useSEO({
    title: 'Privacy Policy | Mughal Steel Fabrication',
    description: 'Privacy policy for Mughal Steel Fabrication client inquiries, measurements, and quotation data.',
    url: '/privacy'
  });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center space-x-3 text-brand-gold border-b border-brand-light pb-4">
          <FileText className="w-8 h-8" />
          <h1 className="text-4xl font-serif uppercase tracking-widest">Privacy Policy</h1>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed">
          At Mughal Steel Fabrication, your privacy is a cornerstone of our service. We collect information like your name, email, phone, and project measurements exclusively to construct accurate quotes and deliver fabricated steel products. We do not sell your personal data.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  useSEO({
    title: 'Terms & Conditions | Mughal Steel Fabrication',
    description: 'Terms and conditions for Mughal Steel Fabrication engineering contracts, site surveys, and product fabrication.',
    url: '/terms'
  });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center space-x-3 text-brand-gold border-b border-brand-light pb-4">
          <FileText className="w-8 h-8" />
          <h1 className="text-4xl font-serif uppercase tracking-widest">Terms & Conditions</h1>
        </div>
        <p className="text-stone-400 text-sm leading-relaxed">
          By engaging Mughal Steel Fabrication for steel fabrication, you agree to our terms. Structural pillar leveling checks, masonry anchor clearances, and building permit approvals are coordinated between the homeowner and our on-site survey engineers. Estimated prices in the Custom Designer and Try-on tools are close approximations; formal contracts specify official final pricing.
        </p>
      </div>
    </div>
  );
};
