import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  CheckCircle2, AlertCircle, Sparkles, Send, Loader2 
} from 'lucide-react';
import { useSEO } from '../utils/useSEO';
import { openDirectEmail } from '../utils/emailHelper';
import { getGoogleMapsEmbedUrl, getGoogleMapsDirectionsUrl } from '../utils/mapsHelper';

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
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-wider text-stone-100">
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
                  {settings.companyName || 'Mughal Steel Fabrication Complex'}
                </p>
                <p>{settings.streetAddress || 'Main Workshop & Yard, Plot 42, Sector I-9 Industrial Area'}</p>
                <p>
                  {settings.city || 'Rawalpindi / Islamabad'}
                  {settings.state ? `, ${settings.state}` : ''}, {settings.country || 'Pakistan'}
                  {settings.zipCode ? ` (Postcode: ${settings.zipCode})` : ''}
                </p>
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
                  src={getGoogleMapsEmbedUrl(settings)}
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
                  href={getGoogleMapsDirectionsUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-xs py-3 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>

                <a 
                  href={getWhatsAppUrl(`Hello Mughal Steel Fabrication, please share your workshop location pin for ${settings.streetAddress || 'your yard'}, ${settings.city || 'Rawalpindi'}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-xs py-3 text-center justify-center font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Get Live Location Pin</span>
                </a>
              </div>

              {/* Social Channels Bar */}
              <div className="pt-3 border-t border-brand-light/40 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-heading font-bold text-stone-300 uppercase tracking-wider">
                  Follow On Social Media:
                </span>
                <div className="flex items-center gap-2.5">
                  <a href="https://www.tiktok.com/@mughalsteelfabrication?_r=1&_t=ZS-99t2eFpg3zs" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black text-white border border-stone-700 hover:border-[#25F4EE] flex items-center justify-center shadow hover:scale-110 transition-transform hover:shadow-[0_0_12px_rgba(37,244,238,0.4)]" title="TikTok Profile">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46 6.27 6.27 0 0 0 1.89-4.48V8.65a8.31 8.31 0 0 0 4.84 1.54V6.74c-.33 0-.67-.02-1-.05z"/></svg>
                  </a>
                  <a href="https://www.facebook.com/101947381864652?ref=PROFILE_EDIT_xav_ig_profile_page_web" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow hover:scale-110 transition-transform" title="Facebook Page">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/mughalsteelfabrication/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow hover:scale-110 transition-transform" title="Instagram Profile">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://youtube.com/playlist?list=PLIY_NugRLGiBoPBJd6qhjl3Ra5QqTCb-f&si=rJY9tie1xTRH59SU" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow hover:scale-110 transition-transform" title="YouTube Playlist">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href={whatsappDirectUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow hover:scale-110 transition-transform" title="WhatsApp Chat">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
