import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBag, Check, Calculator, ArrowRight, ShieldCheck, 
  Sparkles, Plus, Minus, CheckCircle2, MessageCircle, Ruler,
  Layers, Sliders, Eye
} from 'lucide-react';
import { handleImageError, FALLBACK_IMAGE_URL } from '../../utils/imageFallback';

export const AddToCartSection: React.FC = () => {
  const navigate = useNavigate();
  const { products, getWhatsAppUrl } = useData();
  const { formatPrice } = useCurrency();
  const { cart, addToCart, setCartOpen } = useCart();

  // Curated showcase products for instant add-to-cart
  const showcaseProducts = products.slice(0, 10);

  // Selected product state
  const [selectedProductId, setSelectedProductId] = useState<string>(showcaseProducts[0]?.id || '');
  const activeProduct = showcaseProducts.find(p => p.id === selectedProductId) || showcaseProducts[0];

  // Customization & Dimension states
  const [width, setWidth] = useState<number>(6);
  const [height, setHeight] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedGauge, setSelectedGauge] = useState<string>('14 Gauge Heavy Industrial');
  const [selectedFinish, setSelectedFinish] = useState<string>('Matte Black Anti-Corrosion');
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Dynamic calculations
  const safeWidth = Math.max(1, width || 1);
  const safeHeight = Math.max(1, height || 1);
  const safeQty = Math.max(1, quantity || 1);
  const area = parseFloat((safeWidth * safeHeight).toFixed(2));
  const baseRate = activeProduct?.pricePerSqFt || activeProduct?.price || 2500;
  
  // Extra gauge adjustment
  const gaugeMultiplier = selectedGauge.includes('12 Gauge') ? 1.15 : selectedGauge.includes('16 Gauge') ? 0.95 : 1.0;
  const effectiveRate = Math.round(baseRate * gaugeMultiplier);
  const subtotal = Math.round(area * effectiveRate * safeQty);
  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleAddToCart = () => {
    if (!activeProduct) return;

    addToCart({
      id: `${activeProduct.id}-${Date.now()}`,
      productId: activeProduct.id,
      productCode: activeProduct.productCode,
      productName: activeProduct.name,
      productImage: activeProduct.frontImage || activeProduct.images?.[0] || FALLBACK_IMAGE_URL,
      category: activeProduct.category,
      item: activeProduct.item,
      width: safeWidth,
      height: safeHeight,
      area: area,
      pricePerSqFt: effectiveRate,
      material: `${selectedGauge} • ${activeProduct.materials?.[0] || 'Mild Steel'}`,
      finish: selectedFinish,
      customNotes: includeInstallation ? 'Includes Turnkey Site Anchor Installation' : 'Supply Only'
    }, safeQty);

    setAddedSuccess(true);
    setCartOpen(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    if (!activeProduct) return;

    addToCart({
      id: `${activeProduct.id}-${Date.now()}`,
      productId: activeProduct.id,
      productCode: activeProduct.productCode,
      productName: activeProduct.name,
      productImage: activeProduct.frontImage || activeProduct.images?.[0] || FALLBACK_IMAGE_URL,
      category: activeProduct.category,
      item: activeProduct.item,
      width: safeWidth,
      height: safeHeight,
      area: area,
      pricePerSqFt: effectiveRate,
      material: `${selectedGauge} • ${activeProduct.materials?.[0] || 'Mild Steel'}`,
      finish: selectedFinish,
      customNotes: includeInstallation ? 'Includes Turnkey Site Anchor Installation' : 'Supply Only'
    }, safeQty);

    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (!activeProduct) return;
    const msg = `*MUGHAL STEEL DIRECT ORDER & CART QUOTATION*\n\n` +
      `• Product Code: ${activeProduct.productCode}\n` +
      `• Design Name: ${activeProduct.name}\n` +
      `• Category: ${activeProduct.category} • ${activeProduct.item}\n` +
      `• Dimensions: ${safeWidth}ft (W) × ${safeHeight}ft (H) = ${area} sq.ft\n` +
      `• Steel Gauge: ${selectedGauge}\n` +
      `• Surface Finish: ${selectedFinish}\n` +
      `• Quantity: ${safeQty} Unit(s)\n` +
      `• Rate per Sq.Ft: Rs. ${effectiveRate.toLocaleString()}\n` +
      `• *Total Estimated Price: Rs. ${subtotal.toLocaleString()}*\n\n` +
      `Hello Admin, I configured this fabrication on your website and want to confirm order details and site measurements.`;

    window.open(getWhatsAppUrl(msg), '_blank');
  };

  if (!activeProduct) return null;

  return (
    <section id="add-to-cart-section" className="relative py-16 sm:py-24 bg-[#060A13] border-y border-brand-gold/30 text-stone-100 overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-mono font-bold tracking-widest uppercase">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>DIRECT SHOPPING & FABRICATION CART</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-stone-100 uppercase">
            CONFIGURE & <span className="text-brand-gold">ADD TO CART</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Select an authentic steel design, tailor width & height dimensions in real-time, review instant transparent sq.ft pricing, and add to your cart or order directly.
          </p>
        </div>

        {/* Live Cart Quick Status Banner */}
        {totalCartCount > 0 && (
          <div className="bg-brand-navy/90 border border-brand-gold/40 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-heading font-black text-stone-100 block">
                  You have <span className="text-brand-gold font-mono">{totalCartCount}</span> fabrication item{totalCartCount > 1 ? 's' : ''} in your cart
                </span>
                <span className="text-[11px] text-slate-400">
                  Ready to review or proceed with quotation and site verification.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button 
                onClick={() => setCartOpen(true)}
                className="btn-gold text-xs py-2 px-4 font-bold flex-1 sm:flex-none flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Open Cart Drawer</span>
              </button>
              <Link 
                to="/cart"
                className="btn-outline text-xs py-2 px-4 font-bold flex-1 sm:flex-none text-center"
              >
                <span>View Cart Page</span>
              </Link>
            </div>
          </div>
        )}

        {/* Main 2-Column Interactive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Design Selector & Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Design Selector Thumbnails */}
            <div className="space-y-2">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-brand-gold" />
                <span>1. Choose Steel Design</span>
              </span>
              
              <div className="grid grid-cols-5 gap-2 pb-1">
                {showcaseProducts.map((p) => {
                  const isSelected = p.id === activeProduct.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProductId(p.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                        isSelected 
                          ? 'border-brand-gold ring-2 ring-brand-gold/30 scale-105 shadow-lg' 
                          : 'border-brand-light/60 hover:border-brand-gold/60 opacity-70 hover:opacity-100'
                      }`}
                      title={p.name}
                    >
                      <img 
                        src={p.frontImage || p.images?.[0] || FALLBACK_IMAGE_URL} 
                        alt={p.name} 
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-brand-gold text-brand-dark rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Product Big Preview Card */}
            <div className="bg-brand-navy border border-brand-light/70 rounded-xl overflow-hidden shadow-2xl space-y-4 p-4">
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-black border border-brand-light/40 group">
                <img 
                  src={activeProduct.frontImage || activeProduct.images?.[0] || FALLBACK_IMAGE_URL} 
                  alt={activeProduct.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-brand-gold text-xs font-mono font-bold px-2.5 py-1 rounded border border-brand-gold/40 shadow">
                  {activeProduct.productCode}
                </div>

                <div className="absolute top-3 right-3 bg-brand-gold/90 text-brand-dark text-[10px] font-heading font-black px-2 py-0.5 rounded shadow uppercase">
                  {activeProduct.category}
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 rounded flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-stone-100 uppercase line-clamp-1">
                      {activeProduct.name}
                    </h3>
                    <span className="text-[10px] text-slate-300 font-mono">
                      {activeProduct.item}
                    </span>
                  </div>
                  <Link 
                    to={`/product/${activeProduct.slug}`}
                    className="p-1.5 rounded-full bg-brand-gold text-brand-dark hover:scale-110 transition-transform"
                    title="View Full Specifications"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Quick Specs Chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 bg-brand-dark/80 rounded border border-brand-light/40">
                  <span className="text-slate-400 block text-[9px] uppercase">Base Fabrication Rate</span>
                  <span className="font-black text-brand-gold text-xs">
                    {formatPrice(baseRate)} / sq.ft
                  </span>
                </div>
                <div className="p-2.5 bg-brand-dark/80 rounded border border-brand-light/40">
                  <span className="text-slate-400 block text-[9px] uppercase">Warranty Standard</span>
                  <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>10 Years Guarantee</span>
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Dimensions, Customizations & Add to Cart Controls (7 cols) */}
          <div className="lg:col-span-7 bg-[#0B1220] border border-brand-gold/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-light/50 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider block">
                  STEP 2 • TAILOR DIMENSIONS & OPTIONS
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black uppercase text-stone-100">
                  Live Price & Cart Builder
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Area</span>
                <span className="text-sm sm:text-base font-mono font-black text-stone-100 bg-brand-navy px-2.5 py-1 rounded border border-brand-light/60">
                  {area} sq.ft
                </span>
              </div>
            </div>

            {/* Dimension Inputs */}
            <div className="space-y-4">
              <span className="text-xs font-heading font-bold uppercase tracking-wide text-slate-300 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-brand-gold" />
                <span>Site Dimensions (Feet)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Width */}
                <div className="bg-brand-navy/60 p-3.5 rounded-xl border border-brand-light/60 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-300">Width (ft)</label>
                    <span className="font-mono font-black text-brand-gold">{safeWidth} ft</span>
                  </div>
                  <input 
                    type="range"
                    min="2"
                    max="30"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 2)}
                    className="w-full accent-brand-gold cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2 ft (Walkway)</span>
                    <span>16 ft (Driveway)</span>
                    <span>30 ft</span>
                  </div>
                </div>

                {/* Height */}
                <div className="bg-brand-navy/60 p-3.5 rounded-xl border border-brand-light/60 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-300">Height (ft)</label>
                    <span className="font-mono font-black text-brand-gold">{safeHeight} ft</span>
                  </div>
                  <input 
                    type="range"
                    min="2"
                    max="20"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 2)}
                    className="w-full accent-brand-gold cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2 ft (Railing)</span>
                    <span>7-10 ft (Gate)</span>
                    <span>20 ft</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Material Gauge & Finish Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Gauge */}
              <div className="space-y-1.5">
                <label className="font-heading font-bold text-slate-300 uppercase text-[11px] block">
                  Steel Pipe & Sheet Gauge
                </label>
                <select
                  value={selectedGauge}
                  onChange={(e) => setSelectedGauge(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-light/80 rounded-lg p-2.5 text-stone-100 font-mono text-xs focus:border-brand-gold focus:outline-none"
                >
                  <option value="14 Gauge Heavy Industrial">14 Gauge Heavy Industrial (Recommended)</option>
                  <option value="12 Gauge Ultra-Rigid Security">12 Gauge Ultra-Rigid Security (+15%)</option>
                  <option value="16 Gauge Standard Residential">16 Gauge Standard Residential (-5%)</option>
                </select>
              </div>

              {/* Finish */}
              <div className="space-y-1.5">
                <label className="font-heading font-bold text-slate-300 uppercase text-[11px] block">
                  Surface Protective Coating
                </label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full bg-brand-navy border border-brand-light/80 rounded-lg p-2.5 text-stone-100 font-mono text-xs focus:border-brand-gold focus:outline-none"
                >
                  <option value="Matte Black Anti-Corrosion">Matte Black Anti-Corrosion Powder Coat</option>
                  <option value="Charcoal Gray Metallic">Charcoal Gray Metallic Oven Bake</option>
                  <option value="Antique Bronze Patina">Antique Bronze Patina Highlight</option>
                  <option value="Gloss Pure White">Gloss Pure White Epoxy Finish</option>
                </select>
              </div>

            </div>

            {/* Turnkey Installation Checkbox */}
            <label className="flex items-center gap-2.5 bg-brand-navy/40 p-3 rounded-lg border border-brand-light/40 cursor-pointer text-xs">
              <input 
                type="checkbox" 
                checked={includeInstallation}
                onChange={(e) => setIncludeInstallation(e.target.checked)}
                className="rounded accent-brand-gold w-4 h-4"
              />
              <span className="text-slate-300">
                Include turnkey site anchor welding, laser alignment & civil grouting in Rawalpindi / Islamabad
              </span>
            </label>

            {/* Price Breakdown Banner */}
            <div className="bg-brand-dark/95 border border-brand-gold/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Calculated Estimate ({safeWidth}ft × {safeHeight}ft @ Rs. {effectiveRate.toLocaleString()}/sq.ft)
                </span>
                <span className="text-2xl sm:text-3xl font-heading font-black text-brand-gold">
                  {formatPrice(subtotal, true)}
                </span>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center bg-brand-navy border border-brand-light rounded-lg p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded bg-brand-dark hover:bg-brand-medium text-stone-100 hover:text-brand-gold flex items-center justify-center font-bold transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="px-3 text-center">
                  <span className="font-mono font-black text-sm text-stone-100">{safeQty}</span>
                  <span className="text-[8px] text-slate-400 block uppercase font-bold">Qty</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded bg-brand-dark hover:bg-brand-medium text-stone-100 hover:text-brand-gold flex items-center justify-center font-bold transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS ROW */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Main ADD TO CART Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-5 rounded-xl font-heading font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-[0.98] ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-900/40'
                      : 'bg-gradient-to-r from-amber-400 via-brand-gold to-amber-500 hover:from-amber-300 hover:to-amber-400 text-brand-dark border border-amber-300 shadow-[0_0_25px_rgba(212,175,55,0.35)]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-white animate-bounce" />
                      <span>Added to Cart! (Opening Cart...)</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* 2. Buy Now / Immediate Checkout */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-5 rounded-xl bg-brand-navy hover:bg-brand-medium border border-brand-gold/60 hover:border-brand-gold text-brand-gold hover:text-amber-300 font-heading font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Order Now & Checkout</span>
                </button>
              </div>

              {/* 3. Direct WhatsApp Order Button */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="btn-whatsapp w-full py-3 px-4 text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-[0.99] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire & Confirm Order on WhatsApp</span>
              </button>
            </div>

            {/* Quality & Trust Badges */}
            <div className="pt-2 border-t border-brand-light/30 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-mono">
              <div>✓ Pakistan Standard Certified</div>
              <div>✓ Guaranteed Gauge Thickness</div>
              <div>✓ Free Site Survey in Twin Cities</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
