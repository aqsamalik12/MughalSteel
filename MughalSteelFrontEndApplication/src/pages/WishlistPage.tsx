import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useData } from '../context/DataContext';
import { Heart, Trash2, Calculator, ArrowRight, MessageCircle } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { getWhatsAppUrl } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWhatsAppInquiry = (item: typeof wishlist[0]) => {
    const imageUrl = item.frontImage || item.images?.[0] || '';
    const productUrl = `${window.location.origin}/#/product/${item.slug}`;

    const msg = `*MUGHAL STEEL SAVED DESIGN INQUIRY*\n\n` +
      `• Product Code: ${item.productCode}\n` +
      `• Name: ${item.name}\n` +
      `• Category: ${item.category} • ${item.item}\n` +
      `• Estimated Rate: Rs. ${(item.pricePerSqFt || item.price || 0).toLocaleString()} / sq.ft\n\n` +
      `🖼️ *Design Photo Link:* ${imageUrl}\n` +
      `🔗 *Product Page:* ${productUrl}\n\n` +
      `Hello Admin, I saved this fabrication design and would like to get a formal quotation.`;

    const url = getWhatsAppUrl(msg);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-brand-dark min-h-screen text-stone-100 py-12 px-4 sm:px-6 font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-brand-light/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <Heart className="w-5 h-5 fill-brand-gold" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-black uppercase text-stone-100">
                Saved Designs & Projects
              </h1>
              <p className="text-xs text-slate-400">
                {wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved in your private moodboard
              </p>
            </div>
          </div>

          {wishlist.length > 0 && (
            <Link 
              to="/products"
              className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <span>Explore More Designs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-brand-medium/50 border border-brand-light rounded-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-dark/80 border border-brand-light flex items-center justify-center mx-auto text-slate-500">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-200">No Saved Designs Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Browse our architectural steel gates, staircases, and railings catalog and click the heart icon on any design to save it.
            </p>
            <Link to="/products" className="btn-gold text-xs inline-flex items-center gap-2 mt-2">
              <Calculator className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div 
                key={item.id}
                className="bg-brand-medium border border-brand-light rounded-sm overflow-hidden flex flex-col justify-between group hover:border-brand-gold/60 transition-all duration-300 shadow-premium"
              >
                <div className="relative aspect-[4/3] bg-brand-dark overflow-hidden">
                  <img 
                    src={item.images[0]} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-brand-navy/90 border border-brand-gold/40 text-brand-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                    {item.productCode}
                  </div>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-brand-dark/80 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 transition-colors border border-rose-500/30"
                    title="Remove from Saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {item.category} • {item.item}
                    </span>
                    <h3 className="font-heading text-sm font-bold text-stone-100 group-hover:text-brand-gold transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2">
                      {item.shortDescription || item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-brand-light/60 flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Rate:</span>
                      <span className="text-xs font-heading font-bold text-brand-gold">
                        Rs. {(item.pricePerSqFt || item.price || 0).toLocaleString()} / sq.ft
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to={`/product/${item.slug}`}
                        className="btn-gold text-[10px] py-1.5 text-center flex items-center justify-center gap-1"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>View Design</span>
                      </Link>

                      <button
                        onClick={() => handleWhatsAppInquiry(item)}
                        className="btn-whatsapp text-[10px] py-1.5 text-center flex items-center justify-center gap-1 cursor-pointer"
                        title="Inquire on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
