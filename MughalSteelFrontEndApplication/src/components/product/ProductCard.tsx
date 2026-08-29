import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useData } from '../../context/DataContext';
import { Heart, Eye, Calculator, ArrowRight, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getWhatsAppUrl } = useData();

  const isWishlisted = isInWishlist(product.id);

  const handleWhatsAppInquire = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rawImage = product.frontImage || product.images?.[0] || '';
    const imageUrl = (rawImage.startsWith('http://') || rawImage.startsWith('https://')) ? rawImage : '';
    const productUrl = `${window.location.origin}/#/product/${product.slug}`;
    
    let clientInfo = '';
    try {
      const savedUser = JSON.parse(localStorage.getItem('ic_user') || '{}');
      if (savedUser && (savedUser.firstName || savedUser.email)) {
        const name = `${savedUser.firstName || ''} ${savedUser.lastName || ''}`.trim() || savedUser.email;
        const phone = savedUser.phone || '';
        const address = savedUser.addresses?.[0] ? `${savedUser.addresses[0].street}, ${savedUser.addresses[0].city}` : '';
        clientInfo = `👤 *CLIENT DETAILS:*\n• Name: ${name}\n` +
          (phone ? `• Phone: ${phone}\n` : '') +
          (address ? `• Site Address: ${address}\n` : '') + `\n`;
      }
    } catch (_) {}

    const msg = `*MUGHAL STEEL PRODUCT INQUIRY*\n\n` +
      clientInfo +
      `📋 *DESIGN SPECS:*\n` +
      `• Product Code: ${product.productCode}\n` +
      `• Design Name: ${product.name}\n` +
      `• Category: ${product.category} • ${product.item}\n` +
      `• Estimated Rate: Rs. ${(product.pricePerSqFt || product.price || 0).toLocaleString()} / sq.ft\n\n` +
      (imageUrl ? `🖼️ *Design Photo Link:* ${imageUrl}\n` : '') +
      `🔗 *Product Page:* ${productUrl}\n\n` +
      `Hello Admin, I am interested in this fabrication design. Please share details and custom quotation.`;

    const url = getWhatsAppUrl(msg);
    window.open(url, '_blank');
  };


  return (
    <div className="group relative bg-brand-medium border border-brand-light flex flex-col h-full rounded-sm shadow-premium hover:shadow-premium-hover hover:border-brand-gold/60 transition-all duration-300 animate-fade-in">
      
      {/* Product Code Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-brand-navy/90 text-brand-gold border border-brand-gold/40 text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded shadow">
          {product.productCode}
        </span>
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-brand-dark/70 border border-brand-light/50 text-stone-300 hover:text-brand-gold transition-colors"
        title={isWishlisted ? "Remove from Saved" : "Save Item"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brand-gold text-brand-gold' : ''}`} />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-brand-dark border-b border-brand-light">
        <img 
          src={product.frontImage || product.galleryViews?.front || product.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-[10px] font-heading font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1">
            <span>Configure Dimensions</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {product.category} • {product.item}
          </span>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-heading text-sm font-bold text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Pricing & CTAs */}
        <div className="pt-3 border-t border-brand-light/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Estimated Rate:</span>
              <span className="text-sm font-heading font-bold text-brand-gold">
                Rs. {(product.pricePerSqFt || product.price || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/ sq.ft</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              10-Yr Guarantee
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link 
              to={`/product/${product.slug}`}
              className="btn-gold text-[10px] py-2 text-center flex items-center justify-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>View & Quote</span>
            </Link>

            <Link 
              to={`/try-at-home?product=${product.productCode}`}
              className="btn-outline text-[10px] py-2 text-center flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-brand-gold" />
              <span>Try at Home</span>
            </Link>
          </div>

          {/* WhatsApp Direct Inquiry with Image & Code */}
          <button
            onClick={handleWhatsAppInquire}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 hover:border-emerald-400 text-[11px] font-heading font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200 rounded transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inquire on WhatsApp (with Photo)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
