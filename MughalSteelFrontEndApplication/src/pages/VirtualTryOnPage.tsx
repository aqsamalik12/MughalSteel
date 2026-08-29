import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  Upload, Sparkles, Move, ZoomIn, ZoomOut, RotateCw, 
  Trash2, MessageCircle, Calculator, CheckCircle2, 
  Layers, RefreshCw, Eye, Download, Info, Search, Filter, 
  SlidersHorizontal, Check, ArrowRight, CornerDownRight, Maximize2, FileText
} from 'lucide-react';

export const VirtualTryOnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { products, getWhatsAppUrl } = useData();
  const { formatPrice } = useCurrency();


  // Initial params
  const preSelectedCode = searchParams.get('product') || searchParams.get('code') || searchParams.get('slug');

  // Sample Elevations
  const sampleElevations = [
    {
      id: 'elev-1',
      title: 'Modern 1-Kanal Villa (Islamabad)',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'elev-2',
      title: 'Contemporary 10-Marla Facade',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'elev-3',
      title: 'Classical Haveli / Porch',
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'elev-4',
      title: 'Commercial Plaza Entrance',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  // Background House Image state
  const [houseImage, setHouseImage] = useState<string>(sampleElevations[0].url);
  const [houseImageName, setHouseImageName] = useState<string>('Sample Modern Villa Elevation');

  // Selected Product State
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0]>(() => {
    if (preSelectedCode) {
      const match = products.find(p => 
        p.productCode.toLowerCase() === preSelectedCode.toLowerCase() ||
        p.slug.toLowerCase() === preSelectedCode.toLowerCase() ||
        p.id === preSelectedCode
      );
      if (match) return match;
    }
    return products[0] || {
      id: 'prod-mfg-g001',
      productCode: 'MFG-G001',
      name: 'Metropolis CNC Laser-Cut Geometric Main Gate',
      slug: 'metropolis-cnc-laser-cut-geometric-main-gate',
      category: 'Modern Home',
      item: 'Front Gates',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
      materials: ['Mild Steel', 'CNC Laser Plate'],
      finishes: ['Matte Black Powder Coat'],
      pricePerSqFt: 2500,
      price: 130000
    };
  });

  // 4 Angle View State for Active Product
  const [selectedSide, setSelectedSide] = useState<'front' | 'back' | 'left' | 'right'>('front');

  // Compute 4 Views for selectedProduct
  const currentDefaultImages = (selectedProduct?.images || []).filter(img => Boolean(img && img.trim()));
  const currentFront = (selectedProduct?.frontImage || selectedProduct?.galleryViews?.front || currentDefaultImages[0] || '').trim();
  const currentBack = (selectedProduct?.backImage || selectedProduct?.galleryViews?.back || (currentDefaultImages.length > 1 ? currentDefaultImages[1] : '') || currentFront).trim();
  const currentLeft = (selectedProduct?.leftSideImage || selectedProduct?.galleryViews?.leftSide || (currentDefaultImages.length > 2 ? currentDefaultImages[2] : '') || currentFront).trim();
  const currentRight = (selectedProduct?.rightSideImage || selectedProduct?.galleryViews?.rightSide || (currentDefaultImages.length > 3 ? currentDefaultImages[3] : '') || currentBack || currentFront).trim();

  const productFourSides = [
    { id: 'front' as const, label: 'Front View', tag: '0° Face Elevation', url: currentFront },
    { id: 'back' as const, label: 'Back View', tag: '180° Porch / Rear', url: currentBack },
    { id: 'left' as const, label: 'Left Side', tag: '45° Left Perspective', url: currentLeft },
    { id: 'right' as const, label: 'Right Side', tag: '45° Right Profile', url: currentRight }
  ];

  const activeOverlayImage = (() => {
    if (selectedSide === 'back' && currentBack) return currentBack;
    if (selectedSide === 'left' && currentLeft) return currentLeft;
    if (selectedSide === 'right' && currentRight) return currentRight;
    return currentFront || currentDefaultImages[0] || '';
  })();

  // Product Browser Filter States
  const [catalogCategory, setCatalogCategory] = useState<string>('All');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Overlay Manipulation States
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [scale, setScale] = useState<number>(1);
  const [opacity, setOpacity] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [skewX, setSkewX] = useState<number>(0);
  const [skewY, setSkewY] = useState<number>(0);

  // Dragging states (Mouse & Touch)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sizing & Calculator inputs
  const [width, setWidth] = useState<number>(12);
  const [height, setHeight] = useState<number>(7.5);
  const [quantity, setQuantity] = useState<number>(1);

  // User Feedback States
  const [addedAlert, setAddedAlert] = useState(false);
  const [exportingPreview, setExportingPreview] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (preSelectedCode) {
      const match = products.find(p => 
        p.productCode.toLowerCase() === preSelectedCode.toLowerCase() ||
        p.slug.toLowerCase() === preSelectedCode.toLowerCase() ||
        p.id === preSelectedCode
      );
      if (match) setSelectedProduct(match);
    }
  }, [preSelectedCode, products]);

  // Filter products for the visualizer panel
  const selectableProducts = useMemo(() => {
    return products.filter(p => {
      if (catalogCategory !== 'All') {
        if (catalogCategory === 'Gates' && !p.item.includes('Gate')) return false;
        if (catalogCategory === 'Doors' && !p.item.includes('Door')) return false;
        if (catalogCategory === 'Railings' && !p.item.includes('Railing')) return false;
        if (catalogCategory === 'Windows' && !p.item.includes('Window') && !p.item.includes('Grill')) return false;
        if (catalogCategory === 'Modern Home' && p.category !== 'Modern Home') return false;
        if (catalogCategory === 'Classical Home' && p.category !== 'Classical Home') return false;
      }
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCode = p.productCode.toLowerCase().includes(q);
        const matchesItem = p.item.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesItem) return false;
      }
      return true;
    });
  }, [products, catalogCategory, catalogSearch]);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setHouseImage(reader.result as string);
        setHouseImageName(file.name);
        setPosition({ x: 50, y: 55 });
        setScale(1);
        setRotation(0);
        setSkewX(0);
        setSkewY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStart.x) * 0.18;
    const deltaY = (e.clientY - dragStart.y) * 0.18;
    setPosition(prev => ({
      x: Math.min(95, Math.max(5, prev.x + deltaX)),
      y: Math.min(95, Math.max(5, prev.y + deltaY))
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Events (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = (e.touches[0].clientX - dragStart.x) * 0.18;
    const deltaY = (e.touches[0].clientY - dragStart.y) * 0.18;
    setPosition(prev => ({
      x: Math.min(95, Math.max(5, prev.x + deltaX)),
      y: Math.min(95, Math.max(5, prev.y + deltaY))
    }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Dynamic Price Calculations
  const area = parseFloat((width * height).toFixed(2));
  const rate = selectedProduct.pricePerSqFt || 2500;
  const estimatedPrice = Math.round(area * rate * quantity);

  // Send WhatsApp Inquiry
  const handleWhatsAppSend = () => {
    const rawPhoto = selectedProduct.frontImage || selectedProduct.images?.[0] || '';
    const designPhoto = (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://')) ? rawPhoto : '';
    const productUrl = `${window.location.origin}/#/product/${selectedProduct.slug}`;

    const msg = `*MUGHAL STEEL TRY-AT-HOME VISUALIZER INQUIRY*\n\n` +
      `*Product Details:*\n` +
      `Design: ${selectedProduct.name}\n` +
      `Product Code: ${selectedProduct.productCode}\n` +
      `Category: ${selectedProduct.category} | Item: ${selectedProduct.item}\n\n` +
      `*Configured Dimensions:*\n` +
      `Size: ${width} ft (W) × ${height} ft (H) = ${area} sq.ft\n` +
      `Unit Rate: ${formatPrice(rate)} / sq.ft\n` +
      `Quantity: ${quantity}\n` +
      `*Estimated Price: ${formatPrice(estimatedPrice, true)}*\n\n` +
      `*Elevation Reference:*\n` +
      `House Photo: ${houseImageName}\n` +
      `🖼️ Design Photo Link: ${designPhoto}\n` +
      `🔗 Product Page: ${productUrl}\n\n` +
      `Please review this visual placement and schedule an on-site laser dimension measurement. Thank you!`;

    const url = getWhatsAppUrl(msg);
    window.open(url, '_blank');
  };


  // Save / Export Rendered Visualization (HTML5 Canvas)
  const handleSavePreview = () => {
    setExportingPreview(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setExportingPreview(false);
      return;
    }

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = houseImage;

    bgImg.onload = () => {
      canvas.width = bgImg.naturalWidth || 1200;
      canvas.height = bgImg.naturalHeight || 800;

      // Draw Background House
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Draw Overlay Product
      const prodImg = new Image();
      prodImg.crossOrigin = 'anonymous';
      prodImg.src = selectedProduct.images[0];

      prodImg.onload = () => {
        ctx.save();

        const posX = (position.x / 100) * canvas.width;
        const posY = (position.y / 100) * canvas.height;

        ctx.translate(posX, posY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.transform(1, (skewY * Math.PI) / 180, (skewX * Math.PI) / 180, 1, 0, 0);

        const prodWidth = (canvas.width * 0.38) * scale;
        const prodHeight = (prodImg.naturalHeight / prodImg.naturalWidth) * prodWidth;

        ctx.globalAlpha = opacity;
        ctx.drawImage(prodImg, -prodWidth / 2, -prodHeight / 2, prodWidth, prodHeight);
        ctx.restore();

        // Draw Mughal Steel Branding Badge at Bottom
        ctx.fillStyle = 'rgba(7, 11, 18, 0.85)';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

        ctx.fillStyle = '#E5B338';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`MUGHAL STEEL FABRICATION — Visualized Design: ${selectedProduct.productCode} (${width}ft × ${height}ft)`, 30, canvas.height - 24);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Est. Total: Rs. ${estimatedPrice.toLocaleString()}`, canvas.width - 240, canvas.height - 24);

        // Download PNG
        const link = document.createElement('a');
        link.download = `mughal-steel-${selectedProduct.productCode}-visualization.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setExportingPreview(false);
      };

      prodImg.onerror = () => {
        setExportingPreview(false);
        alert('Could not render image export due to cross-origin resource permissions. Please take a screenshot of the live preview.');
      };
    };

    bgImg.onerror = () => {
      setExportingPreview(false);
      alert('Could not render background export. Please take a screenshot of the live preview.');
    };
  };

  // Reset Adjustments
  const handleResetAdjustments = () => {
    setPosition({ x: 50, y: 55 });
    setScale(1);
    setRotation(0);
    setSkewX(0);
    setSkewY(0);
    setOpacity(1);
  };

  return (
    <div className="bg-brand-dark min-h-screen text-stone-100 py-8 px-4 sm:px-6 md:px-8 animate-fade-in space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ======================================================== */}
        {/* 1. TOP HEADER & UPLOAD BAR */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-[#0B1320] via-brand-navy to-[#0B1320] border border-brand-gold/40 p-5 sm:p-7 rounded-lg shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-bold uppercase tracking-widest rounded-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Architectural Elevation Visualizer</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-black uppercase tracking-tight text-stone-100">
              Try Gates & Doors On Your House Photo
            </h1>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
              Upload your actual house photo, select any gate, door or railing, drag to position, scale to dimensions, and see real-time pricing before requesting a quote.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn-gold text-xs py-3 px-5 uppercase font-bold tracking-wider shadow-lg hover:shadow-glow-gold flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your House Photo</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. 5-STEP CUSTOMER WORKFLOW GUIDE */}
        {/* ======================================================== */}
        <div className="bg-brand-navy/90 border border-brand-light/60 p-3 sm:p-4 rounded-lg grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-center shadow-md">
          <div className="space-y-1 border-r border-brand-light/40 last:border-0 pr-2">
            <span className="text-[10px] font-mono font-bold text-brand-gold block">STEP 01</span>
            <p className="text-[11px] sm:text-xs font-heading font-bold text-stone-200">Upload House Photo</p>
          </div>
          <div className="space-y-1 border-r border-brand-light/40 last:border-0 pr-2">
            <span className="text-[10px] font-mono font-bold text-brand-gold block">STEP 02</span>
            <p className="text-[11px] sm:text-xs font-heading font-bold text-stone-200">Select Design</p>
          </div>
          <div className="space-y-1 border-r border-brand-light/40 last:border-0 pr-2">
            <span className="text-[10px] font-mono font-bold text-brand-gold block">STEP 03</span>
            <p className="text-[11px] sm:text-xs font-heading font-bold text-stone-200">Drag & Position</p>
          </div>
          <div className="space-y-1 border-r border-brand-light/40 last:border-0 pr-2">
            <span className="text-[10px] font-mono font-bold text-brand-gold block">STEP 04</span>
            <p className="text-[11px] sm:text-xs font-heading font-bold text-stone-200">Set Dimensions (W×H)</p>
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono font-bold text-brand-gold block">STEP 05</span>
            <p className="text-[11px] sm:text-xs font-heading font-bold text-stone-200">Order on WhatsApp</p>
          </div>
        </div>


        {/* ======================================================== */}
        {/* 3. MAIN STUDIO WORKSPACE (CANVAS + CONTROL PANEL) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================================================== */}
          {/* LEFT: INTERACTIVE ELEVATION CANVAS (7 COLS ON DESKTOP) */}
          {/* ==================================================== */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Canvas Frame */}
            <div 
              ref={canvasContainerRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-[400px] sm:h-[500px] md:h-[560px] bg-black border-2 border-brand-gold/50 rounded-lg overflow-hidden select-none shadow-2xl relative"
            >
              {/* Background House Image */}
              <img 
                src={houseImage} 
                alt="House Front Elevation" 
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Grid / Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* LIVE DRAGGABLE & RESIZABLE PRODUCT OVERLAY */}
              {selectedProduct && (
                <div
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg) skew(${skewX}deg, ${skewY}deg)`,
                    opacity: opacity
                  }}
                  className="absolute cursor-grab active:cursor-grabbing transition-shadow duration-75 group"
                >
                  <div className="relative border border-brand-gold/60 hover:border-brand-gold bg-transparent p-0 rounded shadow-2xl group-hover:ring-1 group-hover:ring-brand-gold/40">
                    
                    {/* Live Product Image (Clean Cutout & Active Side/Angle) */}
                    <img 
                      src={activeOverlayImage} 
                      alt={`${selectedProduct.name} - ${selectedSide}`}
                      className="max-h-56 sm:max-h-72 md:max-h-84 w-auto object-contain pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]" 
                    />

                    {/* Drag Handle Label Badge */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-dark/95 border border-brand-gold/60 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-1 opacity-90 group-hover:opacity-100">
                      <Move className="w-3 h-3" />
                      <span>{selectedProduct.productCode} • {productFourSides.find(s => s.id === selectedSide)?.label} • Drag to Position</span>
                    </div>

                    {/* Corner Scale Pins */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-gold rounded-full border border-black" />
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-brand-gold rounded-full border border-black" />
                  </div>
                </div>
              )}

              {/* Canvas Overlay Badges & Quick Tools */}
              <div className="absolute top-3 left-3 bg-brand-dark/90 border border-brand-light text-stone-200 text-[10px] font-mono px-2.5 py-1 rounded shadow backdrop-blur-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Elevation: {houseImageName}</span>
              </div>

              {/* Live Position & Transform Status */}
              <div className="absolute top-3 right-3 bg-brand-dark/90 border border-brand-light text-brand-gold text-[10px] font-mono px-2.5 py-1 rounded shadow backdrop-blur-sm hidden sm:flex items-center gap-2">
                <span>X: {Math.round(position.x)}%</span>
                <span>Y: {Math.round(position.y)}%</span>
                <span>Scale: {scale.toFixed(1)}x</span>
                {rotation !== 0 && <span>Rot: {rotation}°</span>}
              </div>

              {/* Bottom Quick Action Bar over Canvas */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-brand-dark/90 border border-brand-light/70 p-2 rounded-md backdrop-blur-md">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button 
                    onClick={() => setScale(prev => Math.max(0.4, prev - 0.1))} 
                    className="p-1.5 bg-brand-navy hover:bg-brand-medium text-stone-300 rounded border border-brand-light"
                    title="Scale Down"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-brand-gold px-1">
                    {Math.round(scale * 100)}%
                  </span>
                  <button 
                    onClick={() => setScale(prev => Math.min(2.2, prev + 0.1))} 
                    className="p-1.5 bg-brand-navy hover:bg-brand-medium text-stone-300 rounded border border-brand-light"
                    title="Scale Up"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => setRotation(prev => (prev + 5) % 360)} 
                    className="p-1.5 bg-brand-navy hover:bg-brand-medium text-stone-300 rounded border border-brand-light ml-1"
                    title="Rotate 5°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleResetAdjustments}
                    className="text-[10px] text-slate-300 hover:text-white bg-brand-navy hover:bg-brand-medium px-2.5 py-1.5 rounded border border-brand-light font-heading font-bold"
                  >
                    Reset Position
                  </button>
                  <button 
                    onClick={handleSavePreview}
                    disabled={exportingPreview}
                    className="btn-gold text-[10px] py-1.5 px-3 uppercase font-bold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{exportingPreview ? 'Exporting...' : 'Save Preview'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 1. DEDICATED 4 SIDES / ANGLES OF SELECTED PRODUCT */}
            <div className="bg-brand-navy border-2 border-brand-gold/50 p-4 rounded-lg space-y-3 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-light/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-gold" />
                  <h3 className="font-heading font-black text-xs sm:text-sm text-stone-100 uppercase tracking-wide">
                    {selectedProduct?.name} — 4 SIDES / ANGLE VIEWS:
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-dark px-2.5 py-1 rounded border border-brand-gold/40 shadow">
                  Active Angle: {productFourSides.find(s => s.id === selectedSide)?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {productFourSides.map((side) => {
                  const isSelected = selectedSide === side.id;
                  return (
                    <button
                      key={side.id}
                      type="button"
                      onClick={() => setSelectedSide(side.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected 
                          ? 'border-brand-gold bg-brand-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.35)] ring-2 ring-brand-gold/60' 
                          : 'border-brand-light bg-brand-dark hover:border-brand-gold/60 hover:bg-brand-medium/70'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full rounded overflow-hidden bg-black/70 mb-2 border border-stone-800 relative flex items-center justify-center">
                        {side.url ? (
                          <img 
                            src={side.url} 
                            alt={side.label} 
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">No Image</span>
                        )}
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 bg-brand-gold text-brand-dark text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shadow flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-brand-gold font-bold block">{side.tag}</span>
                        <h4 className={`text-xs font-heading font-bold uppercase truncate ${isSelected ? 'text-brand-gold' : 'text-stone-200 group-hover:text-brand-gold'}`}>
                          {side.label}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SELECT ANOTHER MODEL / DESIGN TO TRY */}
            <div className="bg-brand-navy border border-brand-light p-3.5 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between border-b border-brand-light/40 pb-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Switch Gate / Door / Railing Design ({products.length} Models):</span>
                </span>
                <span className="text-[10px] text-brand-gold font-mono font-bold">
                  {selectableProducts.length} Showing
                </span>
              </div>

              {/* Quick Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {['All', 'Gates', 'Doors', 'Railings', 'Windows', 'Modern Home', 'Classical Home'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCatalogCategory(cat)}
                    className={`px-2.5 py-1 rounded text-[10px] font-heading font-bold uppercase whitespace-nowrap transition cursor-pointer ${
                      catalogCategory === cat
                        ? 'bg-brand-gold text-brand-dark shadow'
                        : 'bg-brand-dark text-slate-400 hover:text-white border border-brand-light/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {selectableProducts.map(prod => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setSelectedSide('front');
                      setPosition({ x: 50, y: 55 });
                    }}
                    className={`p-1.5 rounded border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedProduct?.id === prod.id 
                        ? 'border-brand-gold bg-brand-gold/15 shadow-[0_0_10px_rgba(212,175,55,0.2)]' 
                        : 'border-brand-light bg-brand-dark hover:border-brand-gold/60'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full rounded overflow-hidden bg-black/40 mb-1.5 border border-stone-800">
                      <img 
                        src={prod.frontImage || prod.galleryViews?.front || prod.images?.[0]} 
                        alt={prod.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-brand-gold font-bold block">{prod.productCode}</span>
                      <p className="text-[10px] text-stone-200 truncate font-heading font-semibold leading-tight">{prod.name}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Rs. {(prod.pricePerSqFt || prod.price || 0).toLocaleString()}/sq.ft</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine Tuning Sliders Accordion */}
            <div className="bg-brand-navy border border-brand-light p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between border-b border-brand-light/40 pb-2">
                <span className="font-heading font-bold text-xs text-stone-200 uppercase tracking-wide flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Perspective, Tilt & Opacity Controls</span>
                </span>
                <span className="text-[10px] text-slate-400">Fine Architectural Tuning</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Horizontal Angle (Skew X):</span>
                    <span className="font-mono text-brand-gold">{skewX}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-25" 
                    max="25" 
                    value={skewX} 
                    onChange={(e) => setSkewX(parseInt(e.target.value))} 
                    className="w-full accent-amber-500" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Vertical Angle (Skew Y):</span>
                    <span className="font-mono text-brand-gold">{skewY}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-25" 
                    max="25" 
                    value={skewY} 
                    onChange={(e) => setSkewY(parseInt(e.target.value))} 
                    className="w-full accent-amber-500" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Overlay Opacity:</span>
                    <span className="font-mono text-brand-gold">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.2" 
                    max="1" 
                    step="0.05"
                    value={opacity} 
                    onChange={(e) => setOpacity(parseFloat(e.target.value))} 
                    className="w-full accent-amber-500" 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ==================================================== */}
          {/* RIGHT: PRODUCT SELECTOR & SIZE CALCULATOR (5 COLS) */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Active Selected Product Summary Card */}
            <div className="bg-brand-navy border border-brand-gold/40 rounded-lg p-5 space-y-4 shadow-xl">
              
              <div className="flex items-start justify-between gap-3 border-b border-brand-light pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider">
                    SELECTED PRODUCT
                  </span>
                  <h3 className="font-heading font-black text-base text-stone-100 uppercase">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    Product Code: <strong className="text-brand-gold">{selectedProduct.productCode}</strong>
                  </p>
                </div>
                <div className="w-14 h-14 rounded bg-black border border-brand-light overflow-hidden shrink-0">
                  <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Product Specifications & Rate */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div><span className="font-bold text-stone-100">Category:</span> {selectedProduct.category}</div>
                <div><span className="font-bold text-stone-100">Item:</span> {selectedProduct.item}</div>
                <div><span className="font-bold text-stone-100">Material:</span> {selectedProduct.materials?.[0] || 'Mild Steel'}</div>
                <div><span className="font-bold text-stone-100">Unit Rate:</span> <strong className="text-brand-gold font-mono">{formatPrice(selectedProduct.pricePerSqFt || 2500)}/sq.ft</strong></div>
              </div>

              {/* SIZE & PRICE CALCULATOR */}
              <div className="bg-brand-dark/90 border border-brand-light/70 rounded p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-xs text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Dimensions & Price Calculator</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Live Formula</span>
                </div>

                {/* 3 Inputs Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">Width (ft)</label>
                    <input 
                      type="number" 
                      step={0.5} 
                      min={1} 
                      value={width} 
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 1)}
                      className="w-full bg-brand-navy border border-brand-light rounded p-2 text-xs text-center font-mono font-bold text-stone-100 focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">Height (ft)</label>
                    <input 
                      type="number" 
                      step={0.5} 
                      min={1} 
                      value={height} 
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 1)}
                      className="w-full bg-brand-navy border border-brand-light rounded p-2 text-xs text-center font-mono font-bold text-stone-100 focus:border-brand-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-brand-navy border border-brand-light rounded p-2 text-xs text-center font-mono font-bold text-stone-100 focus:border-brand-gold outline-none"
                    />
                  </div>
                </div>

                {/* Calculation Breakdown & Total */}
                <div className="border-t border-brand-light/50 pt-2 space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Calculated Area:</span>
                    <span className="font-mono font-bold text-stone-100">{area} Sq.ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate / Sq.ft:</span>
                    <span className="font-mono font-bold text-stone-100">{formatPrice(rate)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-brand-light/40">
                    <span className="font-heading font-black text-stone-100 uppercase text-xs">Estimated Total:</span>
                    <span className="text-base sm:text-lg font-heading font-black text-emerald-400 font-mono">
                      {formatPrice(estimatedPrice, true)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic pt-0.5">
                    *Estimated base fabrication cost. Final quote confirmed upon official on-site laser survey.
                  </p>
                </div>

                {/* Official Quote Button */}
                <div className="pt-1">
                  <Link 
                    to={`/quote?productCode=${selectedProduct.productCode}&category=${encodeURIComponent(selectedProduct.category)}`}
                    className="btn-gold w-full p-3 text-xs font-heading font-black rounded text-center transition-colors flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg hover:shadow-glow-gold"
                  >
                    <FileText className="w-4 h-4 text-brand-dark" />
                    <span>Request Official Quotation & Site Survey</span>
                  </Link>
                </div>
              </div>


            </div>

            {/* PRODUCT BROWSER (SELECT & CHANGE PRODUCT) */}
            <div className="bg-brand-navy border border-brand-light rounded-lg p-5 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-brand-light pb-2.5">
                <h4 className="font-heading font-black text-xs uppercase tracking-wider text-stone-100 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Choose Another Gate / Door / Railing</span>
                </h4>
                <span className="text-[10px] font-mono text-brand-gold font-bold">
                  {selectableProducts.length} Designs
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search by code (MFG-G001) or product name..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-light rounded pl-9 pr-3 py-2 text-xs text-stone-100 focus:border-brand-gold outline-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Gates', 'Doors', 'Railings', 'Windows', 'Modern Home', 'Classical Home'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategory(cat)}
                    className={`text-[10px] font-heading font-bold px-2.5 py-1 rounded transition-colors ${
                      catalogCategory === cat 
                        ? 'bg-brand-gold text-brand-dark' 
                        : 'bg-brand-dark text-slate-300 hover:text-white border border-brand-light'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Selectable Product Cards Grid (Scrollable) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {selectableProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setPosition({ x: 50, y: 55 });
                    }}
                    className={`p-2 rounded-md border text-left flex flex-col justify-between transition-all group ${
                      selectedProduct.id === p.id 
                        ? 'border-brand-gold bg-brand-gold/15 ring-2 ring-brand-gold/40' 
                        : 'border-brand-light bg-brand-dark hover:border-slate-400'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full rounded overflow-hidden bg-black mb-1.5 relative">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-1 left-1 bg-black/80 text-[9px] font-mono text-brand-gold px-1 rounded">
                        {p.productCode}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-heading font-bold text-stone-100 line-clamp-1 group-hover:text-brand-gold">
                        {p.name}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        {formatPrice(p.pricePerSqFt || 2500)}/sq.ft
                      </p>
                    </div>
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
