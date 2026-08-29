import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Star, MessageCircle, ShieldCheck, CheckCircle2, Award, 
  Sparkles, Send, Check, ThumbsUp, MapPin 
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { testimonials, addTestimonial, getWhatsAppUrl } = useData();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState('Modern Home Main Gate');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    await addTestimonial({
      name,
      location: location || 'Rawalpindi / Islamabad',
      projectType,
      rating,
      text: comment,
      featured: true,
      published: true
    });
    setSubmitted(true);
    setName('');
    setLocation('');
    setComment('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const userAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  ];

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-bold uppercase tracking-widest rounded-sm">
            <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
            <span>Verified Customer Testimonials</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            Client Reviews & Ratings
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Read real verified feedback from homeowners, commercial property developers, overseas Pakistanis, and architects who trusted Mughal Steel Fabrication.
          </p>
        </div>

        {/* Rating Score Summary Card */}
        <div className="bg-gradient-to-b from-[#0B1320] to-[#070B12] border border-brand-gold/40 p-6 md:p-8 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-4xl mx-auto shadow-2xl">
          <div className="space-y-1 sm:border-r border-brand-light/40">
            <span className="font-heading font-black text-4xl text-brand-gold">5.0 / 5.0</span>
            <div className="flex justify-center text-amber-500 gap-1 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">100% Verified Customer Rating</span>
          </div>

          <div className="space-y-1 sm:border-r border-brand-light/40">
            <span className="font-heading font-black text-4xl text-stone-100">500+</span>
            <span className="text-[11px] text-slate-400 block pt-2">Projects Delivered Across Pakistan</span>
          </div>

          <div className="space-y-1">
            <span className="font-heading font-black text-4xl text-emerald-400">10-Year</span>
            <span className="text-[11px] text-slate-400 block pt-2">Structural Quality & Anti-Rust Warranty</span>
          </div>
        </div>

        {/* Reviews Grid (Matching Clean White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div 
              key={item.id || idx}
              className="bg-white text-slate-900 rounded-lg p-6 space-y-4 shadow-xl border border-slate-200 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Top Author Row */}
              <div className="flex items-center gap-3.5">
                <img 
                  src={userAvatars[idx % userAvatars.length]} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" 
                />
                <div className="space-y-0.5">
                  <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{item.location || 'Rawalpindi / Islamabad'}</span>
                  </p>
                </div>
              </div>

              {/* 5 Gold Stars & Project */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-dark/70 block">
                  {item.projectType || 'Modern Steel Fabrication Project'}
                </span>
              </div>

              {/* Review Quote */}
              <p className="text-xs sm:text-[13px] text-slate-700 font-sans leading-relaxed flex-1">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Verified Badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Purchase</span>
                </span>
                <span>Mughal Certified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review Form Box */}
        <div className="bg-gradient-to-b from-[#0B1320] to-[#070B12] border border-brand-gold/40 rounded-lg p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-heading font-black text-stone-100 uppercase tracking-wide">
              Leave Your Feedback
            </h3>
            <p className="text-xs text-slate-400">
              Have we fabricated a gate, railing, or staircase for your project? Share your experience with our team!
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded text-center text-xs text-emerald-300 space-y-2">
              <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
              <p className="font-bold">Thank you for your valuable feedback!</p>
              <p>Your review has been submitted for verified publishing.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Imran Khan"
                    className="w-full bg-brand-dark/80 border border-brand-light rounded px-3 py-2.5 text-stone-100 focus:border-brand-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">City / Location</label>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Islamabad / Rawalpindi"
                    className="w-full bg-brand-dark/80 border border-brand-light rounded px-3 py-2.5 text-stone-100 focus:border-brand-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`} 
                      />
                    </button>
                  ))}
                  <span className="text-brand-gold font-bold ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Your Review *</label>
                <textarea 
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about fabrication quality, finish, timeline, and customer service..."
                  className="w-full bg-brand-dark/80 border border-brand-light rounded p-3 text-stone-100 focus:border-brand-gold outline-none"
                />
              </div>

              <button 
                type="submit"
                className="btn-gold w-full text-center py-3 text-xs uppercase font-bold tracking-wider shadow-md"
              >
                <span>Submit Client Review</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
