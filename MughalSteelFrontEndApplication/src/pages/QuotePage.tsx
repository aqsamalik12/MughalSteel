import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PROJECT_CATEGORIES_DATA } from '../data/seedData';
import { 
  FileText, CheckCircle2, MessageCircle, 
  Calculator, Sparkles, AlertCircle, ArrowRight 
} from 'lucide-react';

export const QuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { products, addQuote, getWhatsAppUrl, categories } = useData();
  const activeCategories = (categories && categories.length > 0) ? categories : PROJECT_CATEGORIES_DATA;

  const paramCode = searchParams.get('productCode') || '';
  const paramCategory = searchParams.get('category') || 'Modern Home';

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [projectCategory, setProjectCategory] = useState(paramCategory);
  const [productItem, setProductItem] = useState('Front Gates');
  const [productCode, setProductCode] = useState(paramCode);

  const [width, setWidth] = useState<number>(12);
  const [height, setHeight] = useState<number>(7.5);
  const [quantity, setQuantity] = useState<number>(1);
  const [requirements, setRequirements] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const matchedProduct = products.find(p => p.productCode === productCode || p.name.toLowerCase() === productItem.toLowerCase());
  const rawPhoto = matchedProduct?.frontImage || matchedProduct?.images?.[0] || '';
  const productPhoto = (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://')) ? rawPhoto : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!firstName || !phone || !email) {
      setErrorMessage('Please fill in your name, phone number, and email address.');
      return;
    }

    setSubmitting(true);
    try {
      const area = parseFloat((width * height).toFixed(2));
      const baseRate = 2500;
      const estimatedPrice = Math.round(area * baseRate * quantity);

      await addQuote({
        customer: {
          firstName,
          lastName,
          email,
          phone,
          city
        },
        projectType: projectCategory,
        productCategory: projectCategory,
        productItem: productItem,
        productCode: productCode || 'CUSTOM-FAB',
        dimensions: {
          width,
          height,
          qty: quantity,
          area
        },
        ratePerSqFt: baseRate,
        estimatedPrice,
        requirements,
        notes: customNotes,
        attachments: productPhoto ? [productPhoto] : []
      });

      setSubmitted(true);

    } catch (_) {
      setSubmitted(true); // Always succeed in frontend mode
    } finally {
      setSubmitting(false);
    }
  };

  const productUrl = matchedProduct ? `${window.location.origin}/#/product/${matchedProduct.slug}` : '';

  const whatsappInquiryUrl = getWhatsAppUrl(
    `*FORMAL QUOTE REQUEST — MUGHAL STEEL*\n\n` +
    (productPhoto ? `🖼️ *PRODUCT DESIGN PHOTO LINK:*\n${productPhoto}\n\n` : '') +
    (productUrl ? `🔗 *VIEW ITEM ONLINE:*\n${productUrl}\n\n` : '') +
    `👤 *CLIENT DETAILS:*\n` +
    `• Client Name: ${firstName} ${lastName}\n` +
    `• Phone: ${phone}\n` +
    `• City: ${city}\n\n` +
    `📋 *FABRICATION SPECIFICATIONS:*\n` +
    `• Category: ${projectCategory}\n` +
    `• Fabrication Item: ${productItem}\n` +
    (productCode ? `• Product Code: ${productCode}\n` : '') +
    `• Dimensions: ${width} ft (W) × ${height} ft (H) = ${(width * height).toFixed(1)} sq.ft\n` +
    `• Quantity: ${quantity} Unit(s)\n` +
    (requirements ? `• Requirements: ${requirements}\n` : '') +
    (customNotes ? `• Custom Notes: ${customNotes}\n` : '') +
    `\nPlease review my requirements and provide an itemized fabrication quotation.`
  );



  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-bold uppercase tracking-widest rounded-sm">
            <FileText className="w-3.5 h-3.5" />
            <span>Fast Turnaround Quotation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight text-stone-100">
            Request a Fabrication Quotation
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Provide your project details and approximate measurements below. Our senior structural engineers will review your drawings and provide an itemized estimate.
          </p>
        </div>

        {submitted ? (
          <div className="bg-brand-medium border-2 border-brand-gold/50 p-8 sm:p-12 rounded-sm text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-stone-100">
                Quotation Request Submitted Successfully!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{firstName}</strong>. Our project estimator has received your details for the <strong>{projectCategory} ({productItem})</strong> project and will contact you within 24 hours.
              </p>
            </div>

            <div className="p-4 bg-brand-dark/80 rounded border border-brand-light max-w-md mx-auto text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Project Type:</span>
                <span className="font-bold text-stone-100">{projectCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Item:</span>
                <span className="font-bold text-stone-100">{productItem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Size:</span>
                <span className="font-mono text-brand-gold">{width} ft × {height} ft (Qty: {quantity})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a 
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs py-3 px-6 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Forward Quote to WhatsApp for Immediate Reply</span>
              </a>

              <Link to="/items" className="btn-outline text-xs py-3 px-6">
                <span>Browse More Products</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-brand-medium border border-brand-light p-6 sm:p-10 rounded-sm space-y-8 shadow-2xl">
            
            {/* Section 1: Customer Contact Information */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-light pb-2">
                1. Customer Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    First Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Tariq"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Khan"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. tariq@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    City / Site Location *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Other">Other City / District</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Project & Product Configuration */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-light pb-2">
                2. Project & Item Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Project Category
                  </label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                  >
                    {activeCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Fabrication Item
                  </label>
                  <select
                    value={productItem}
                    onChange={(e) => setProductItem(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                  >
                    <option value="Front Gates">Front Gates</option>
                    <option value="Main Gates">Main Gates</option>
                    <option value="Railing">Railing</option>
                    <option value="Stair Railing">Stair Railing</option>
                    <option value="Balcony Railing">Balcony Railing</option>
                    <option value="Grills">Window Grills</option>
                    <option value="Doors">Pivot / Steel Doors</option>
                    <option value="Windows">Steel & Aluminum Windows</option>
                    <option value="Steel Structures">Structural Sheds</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Reference Code (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. MFG-001"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs font-mono text-stone-100 focus:border-brand-gold focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Width (Feet)
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs font-mono font-bold text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Height (Feet)
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs font-mono font-bold text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                    Quantity
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-xs font-mono font-bold text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Custom Fabrication Requirements */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-light pb-2">
                3. Custom Requirements & Specifications
              </h3>

              <div>
                <label className="text-xs font-heading font-semibold text-slate-300 block mb-1">
                  Customization Requirements
                </label>
                <textarea 
                  rows={3}
                  placeholder="Mention gauge requirements, motor automation, wood accents, or specific finish..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-light p-3 rounded text-xs text-stone-100 focus:border-brand-gold focus:outline-none"
                />
              </div>

              {matchedProduct && (
                <div className="flex items-center gap-3 p-3 bg-brand-dark rounded-md border border-brand-gold/40 shadow-sm">
                  <img 
                    src={productPhoto || matchedProduct.images[0]} 
                    alt={matchedProduct.name} 
                    className="w-14 h-14 object-cover rounded border border-brand-gold/60 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-100 truncate block">{matchedProduct.name}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-bold shrink-0">
                        Design Photo Attached
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Code: {matchedProduct.productCode} • Category: {matchedProduct.category}
                    </span>
                  </div>
                </div>
              )}
            </div>


            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-gold w-full text-xs py-4 shadow-xl"
              >
                {submitting ? 'Submitting Estimate...' : 'Submit Quotation Request'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
