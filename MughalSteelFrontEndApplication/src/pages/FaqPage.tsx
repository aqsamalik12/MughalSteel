import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Search, ChevronDown, ChevronUp, MessageCircle, HelpCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Quotation & Pricing' | 'Measurements & Site Survey' | 'Materials & Steel Gauges' | 'Finishing & Anti-Rust' | 'Installation & Motorization' | 'Warranty';
}

export const FaqPage: React.FC = () => {
  const { getWhatsAppUrl } = useData();

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = [
    'All', 
    'Quotation & Pricing', 
    'Measurements & Site Survey', 
    'Materials & Steel Gauges', 
    'Finishing & Anti-Rust', 
    'Installation & Motorization', 
    'Warranty'
  ];

  const faqs: FaqItem[] = [
    {
      category: 'Quotation & Pricing',
      question: 'How is the fabrication price estimated on this website?',
      answer: 'Our website calculates pricing based on the total surface area: Width (ft) × Height (ft) = Area (sq.ft) × Rate per sq.ft × Quantity. The calculated amount represents an estimated base price for high-quality standard fabrication. Final quotes are confirmed following on-site laser survey, gauge selection, and custom motorization accessories.'
    },
    {
      category: 'Quotation & Pricing',
      question: 'How do I send my product order or design estimate to WhatsApp?',
      answer: 'Simply select your desired gate, door, or railing design, configure your approximate width and height in feet, fill in your name, contact number, and site address, and click "Send Order & Inquire on WhatsApp". The system automatically compiles all item codes, measurements, rates, totals, and the direct design photo link into an organized message for immediate response from our senior estimator.'
    },

    {
      category: 'Measurements & Site Survey',
      question: 'Do you provide on-site laser measurements before fabrication?',
      answer: 'Yes, absolutely! While you can input approximate dimensions on our website for an instant estimate, our dedicated technical team conducts a free precision laser measurement survey at your property to check column plumbness, driveway slope, and exact mounting tolerances before cutting raw steel.'
    },
    {
      category: 'Materials & Steel Gauges',
      question: 'What steel gauges and materials do you use for main gates?',
      answer: 'We construct all structural gate frames with certified minimum 14-gauge to 10-gauge structural MS pipe and solid forged square bars. For CNC laser cut panels, we use high-grade 3mm to 8mm cold-rolled steel plates to guarantee extreme rigidity, wind resistance, and anti-sag performance.'
    },
    {
      category: 'Finishing & Anti-Rust',
      question: 'How are the gates and railings protected against monsoon rust?',
      answer: 'All fabricated items undergo thorough surface sandblasting, active hot-zinc phosphate chemical pre-treatment, epoxy anti-corrosion primer, and high-bake industrial powder coating. This multi-stage process creates an impenetrable barrier against humid monsoon moisture and peeling.'
    },
    {
      category: 'Installation & Motorization',
      question: 'Can your main gates be integrated with automatic motor openers?',
      answer: 'Yes. All our sliding and swing gate systems are pre-engineered with internal structural reinforcements and heavy-duty ball-bearing tracks compatible with Italian and German sliding/swing arm motors, remote controls, and smart smartphone biometric intercoms.'
    },
    {
      category: 'Installation & Motorization',
      question: 'Which cities and regions do you install in?',
      answer: 'We have direct fabrication and installation teams covering Islamabad, Rawalpindi, Lahore, Faisalabad, Gujranwala, Sialkot, and Peshawar. We also ship prefabricated crated systems nationwide across Pakistan.'
    },
    {
      category: 'Warranty',
      question: 'What is covered under the 10-Year Structural Guarantee?',
      answer: 'Our 10-year structural warranty covers core frame integrity, hinge anchoring, and structural weld points against cracking or sagging under normal residential and commercial usage.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-black uppercase tracking-widest rounded-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CUSTOMER KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-stone-100">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans">
            Find immediate answers about our steel fabrication standards, pricing formulas, site surveys, and nationwide delivery.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search questions (e.g. gauge, motor, warranty, pricing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-navy border border-brand-light/80 rounded p-3.5 pr-10 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-heading font-bold uppercase transition-all ${
                activeCategory === cat 
                  ? 'bg-brand-gold text-brand-dark shadow-glow-gold' 
                  : 'bg-brand-navy text-slate-300 hover:text-white border border-brand-light/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-brand-navy border border-brand-light/60 rounded-lg space-y-2">
              <p className="text-slate-300 text-xs">No questions matched your search query.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="btn-gold text-[10px] py-1.5 px-3 uppercase font-bold">
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-brand-dark/50 transition-colors"
                >
                  <span className="font-heading font-bold text-xs sm:text-sm text-stone-100">
                    {faq.question}
                  </span>
                  {expandedIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-brand-gold shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {expandedIndex === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed font-sans border-t border-brand-light/40">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-brand-gold uppercase">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* WhatsApp Consultation Prompt */}
        <div className="p-6 bg-brand-navy border border-brand-gold/40 rounded-lg text-center space-y-3 shadow-xl">
          <h3 className="font-heading font-bold text-sm text-stone-100 uppercase">
            Still Have a Specific Fabrication Question?
          </h3>
          <p className="text-xs text-slate-300 font-sans">
            Our senior engineers are available directly on WhatsApp to answer structural queries.
          </p>
          <a 
            href={getWhatsAppUrl('Hello Mughal Steel, I have a question regarding my house steel fabrication.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xs py-2.5 px-5 font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with an Engineer on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
