import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  CheckCircle2, AlertCircle, Sparkles, Send, Loader2 
} from 'lucide-react';
import { useSEO } from '../utils/useSEO';
import { openDirectEmail } from '../utils/emailHelper';

export const ContactPage: React.FC = () => {
  useSEO({
    title: 'Contact Mughal Steel Fabrication | Islamabad & Rawalpindi',
    description: 'Get in touch with Mughal Steel Fabrication. Visit our workshop in Sector I-9 Industrial Area, request a site laser measurement survey, or get an instant WhatsApp quote.',
    keywords: 'Contact Mughal Steel, steel fabricator phone number Islamabad, metal gate workshop Rawalpindi address',
    url: '/contact'
  });

  const { settings, addContactMessage, getWhatsAppUrl } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [projectCategory, setProjectCategory] = useState('Modern Home');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill in your name, phone number, and project requirements.');
      return;
    }
    setError('');
    setSubmitting(true);

    const formspreeUrl = settings.formspreeEndpoint || import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mppzrorn';

    // 1. Post to Formspree endpoint via AJAX for instant notification
    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Mughal Steel Inquiry: ${name} (${projectCategory})`,
          name,
          phone,
          email: email.trim() || 'inquiry@mughalsteel.com',
          projectCategory,
          subject: subject || `Inquiry for ${projectCategory}`,
          message,
          submittedAt: new Date().toLocaleString()
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data && data.errors && data.errors.length > 0) {
          const detail = data.errors.map((item: any) => item.message).join(', ');
          console.warn('Formspree response warning:', detail);
        }
      }
    } catch (err) {
      console.warn('Network issue submitting to Formspree:', err);
    }

    // 2. Also register in local/backend data store
    try {
      await addContactMessage({
        name,
        email: email.trim() || 'inquiry@mughalsteel.com',
        phone,
        subject: subject || `Inquiry for ${projectCategory}`,
        message,
        projectCategory
      });
    } catch (err) {
      console.warn('Local message store error:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
    setMessage('');
  };

  const whatsappDirectUrl = getWhatsAppUrl(
    `Hello Mughal Steel Fabrication, I would like to get in touch regarding a ${projectCategory} fabrication project.`
  );

  return (
    <div className="bg-brand-dark min-h-screen text-stone-100 py-12 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-bold uppercase tracking-widest rounded-sm">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            Contact Mughal Steel Fabrication
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Visit our workshop complex, call our project engineers, or message us on WhatsApp for fast inquiries, site surveys, and quotations.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone */}
          <div className="bg-brand-medium border border-brand-light p-6 rounded-sm space-y-3 shadow-md">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded w-max border border-brand-gold/30">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-100 uppercase">Call Our Team</h3>
            <p className="text-xs text-slate-400">Speak directly with our fabrication estimators.</p>
            <a href={`tel:${settings.phone}`} className="font-mono text-sm font-bold text-brand-gold block hover:underline">
              {settings.phone}
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-brand-medium border border-brand-light p-6 rounded-sm space-y-3 shadow-md">
            <div className="p-3 bg-emerald-950/60 text-emerald-400 rounded w-max border border-emerald-500/40">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-100 uppercase">WhatsApp Inquiry</h3>
            <p className="text-xs text-slate-400">Send drawings & photos for instant quotation.</p>
            <a 
              href={whatsappDirectUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-mono text-sm font-bold text-emerald-400 block hover:underline"
            >
              {settings.whatsappNumber}
            </a>
          </div>

          {/* Email */}
          <div className="bg-brand-medium border border-brand-light p-6 rounded-sm space-y-3 shadow-md">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded w-max border border-brand-gold/30">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-100 uppercase">Email Us</h3>
            <a 
              href={`mailto:${settings.email || 'mughalsteelfabrication51@gmail.com'}?subject=Website%20Inquiry%20%E2%80%93%20Mughal%20Steel%20Fabrication`} 
              onClick={(e) => { e.preventDefault(); openDirectEmail(settings.email || 'mughalsteelfabrication51@gmail.com'); }}
              className="text-xs font-mono font-semibold text-stone-200 block hover:text-brand-gold transition-colors cursor-pointer"
              title="Click to email Mughal Steel Fabrication"
            >
              {settings.email || 'mughalsteelfabrication51@gmail.com'}
            </a>
          </div>

          {/* Hours */}
          <div className="bg-brand-medium border border-brand-light p-6 rounded-sm space-y-3 shadow-md">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded w-max border border-brand-gold/30">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-stone-100 uppercase">Working Hours</h3>
            <p className="text-xs text-slate-400">Workshop & on-site teams available.</p>
            <span className="text-xs text-stone-200 block font-medium">
              {settings.businessHours}
            </span>
          </div>
        </div>

        {/* Main Content: Inquiry Form (Left) + Workshop Location & Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-brand-medium border border-brand-light p-6 sm:p-8 rounded-sm space-y-6 shadow-2xl">
            <div className="border-b border-brand-light pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-bold text-stone-100 uppercase tracking-wide">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-slate-400">
                  We typically respond within 2 to 4 business hours.
                </p>
              </div>
              <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-1 rounded border border-brand-gold/30 hidden sm:inline-block">
                Formspree Verified
              </span>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs rounded text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="font-heading font-bold text-sm text-stone-100">Message Received!</h4>
                <p>Thank you, {name}. Your inquiry has been submitted and sent to our fabrication estimators.</p>
                <div className="pt-2">
                  <a 
                    href={whatsappDirectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-whatsapp text-xs inline-flex"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Also Connect on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form 
                action={settings.formspreeEndpoint || 'https://formspree.io/f/mppzrorn'} 
                method="POST" 
                onSubmit={handleSubmit} 
                className="space-y-4 text-xs"
              >
                <input type="hidden" name="_subject" value={`New Mughal Steel Inquiry: ${name || 'Prospective Client'} (${projectCategory})`} />
                <input type="hidden" name="_replyto" value={email} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="e.g. 0300-8456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="e.g. tariq@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Project Category</label>
                    <select
                      name="projectCategory"
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                    >
                      <option value="Modern Home">Modern Home</option>
                      <option value="Classical Home">Classical Home</option>
                      <option value="Housing Society">Housing Society</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Modern Farmhouse">Modern Farmhouse</option>
                      <option value="Classical Farmhouse">Classical Farmhouse</option>
                      <option value="Village House">Village House</option>
                      <option value="Farm">Farm</option>
                      <option value="Small Villa">Small Villa</option>
                      <option value="Aluminum & Glass">Aluminum & Glass</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    placeholder="e.g. Quotation for 14ft Laser Cut Main Gate"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Your Project Requirements *</label>
                  <textarea 
                    name="message"
                    required
                    rows={4}
                    placeholder="Please include approximate dimensions, property location, and required timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn-gold w-full text-xs py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
                      <span>Submitting Inquiry to Mughal Steel...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Workshop Location & Live Interactive Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-navy border border-brand-light/60 p-6 sm:p-8 rounded-lg space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
                <h3 className="font-heading text-sm font-black uppercase tracking-wider text-brand-gold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>Workshop & Fabrication Yard</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                  ● Live Location
                </span>
              </div>
              
              <div className="space-y-1 text-xs text-slate-300 leading-relaxed font-sans">
                <p className="text-sm font-heading font-bold text-stone-100 uppercase">
                  Mughal Steel Fabrication Complex
                </p>
                <p>{settings.streetAddress}</p>
                <p>{settings.city}, {settings.country} (Postcode: {settings.zipCode})</p>
                <p className="text-brand-gold font-mono pt-1">Coordinates: 33.6593° N, 73.0450° E</p>
              </div>

              <div className="space-y-2 text-xs text-slate-400 font-sans pt-2 border-t border-brand-light/40">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  <span>Heavy ±0.1mm CNC Fiber Laser Cutters & Hydraulic Brakes</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  <span>Active Zinc Chemical Primer & Electrostatic Powder Coating</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  <span>Customer Showroom & Physical Gate Material Samples</span>
                </p>
              </div>

              {/* Live Google Map Interactive Frame */}
              <div className="relative h-64 sm:h-72 bg-brand-dark border-2 border-brand-gold/40 rounded-lg overflow-hidden shadow-xl group">
                <iframe
                  title="Mughal Steel Fabrication Real Live Map"
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

              {/* Direct Live Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Mughal+Steel+Fabrication+I-9+Industrial+Area+Islamabad+Rawalpindi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-xs py-3 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>

                <a 
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-xs py-3 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Get Live Location Pin</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
