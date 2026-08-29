import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  Trash2, Plus, Minus, MessageCircle, ArrowRight, 
  ShoppingBag, ShieldCheck, Calculator, Sparkles, Tag, CheckCircle2, 
  X, Paperclip, Mic, Send, Check, RefreshCw
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, removeFromCart, updateQuantity, clearCart, 
    loadBlueprintDefaults 
  } = useCart();

  const { getWhatsAppUrl } = useData();
  const { formatPrice } = useCurrency();

  // Customer Details for WhatsApp Message
  const [customerName, setCustomerName] = useState('Ali Khan');
  const [customerPhone, setCustomerPhone] = useState('+92 300 1234567');
  const [customerProject, setCustomerProject] = useState('Modern Home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadSampleBlueprintItems = () => {
    loadBlueprintDefaults();
  };

  // Aggregate totals
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAreaSqFt = cart.reduce((sum, item) => sum + (item.area * item.quantity), 0);
  const calculatedGrandTotal = cart.reduce((sum, item) => sum + (item.area * item.pricePerSqFt * item.quantity), 0);

  const generateWhatsAppMessage = () => {
    let msg = `*Mughal Steel Fabrication - New Inquiry*\n\n`;
    msg += `*Customer Details:*\n`;
    msg += `Name: ${customerName}\n`;
    msg += `Phone: ${customerPhone}\n`;
    msg += `Project: ${customerProject}\n\n`;
    msg += `*Products List:*\n`;

    cart.forEach((item, idx) => {
      const lineTotal = Math.round(item.area * item.pricePerSqFt * item.quantity);
      msg += `${idx + 1}. ${item.productCode} - ${item.productName}\n`;
      msg += `Size: ${item.width}ft × ${item.height}ft | Area: ${item.area} Sq.ft\n`;
      msg += `Rate: ${formatPrice(item.pricePerSqFt)} | Qty: ${item.quantity}\n`;
      msg += `Total: ${formatPrice(lineTotal)}\n\n`;
    });

    msg += `*Estimated Grand Total: ${formatPrice(calculatedGrandTotal, true)}*\n\n`;
    msg += `*Please provide quotation for the above items.\nThank you!*`;
    return msg;
  };

  const handleWhatsAppSend = () => {
    const msg = generateWhatsAppMessage();
    const url = getWhatsAppUrl(msg);
    window.open(url, '_blank');
  };

  return (
    <div className="w-full bg-[#05080E] min-h-screen text-stone-100 py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light/40 pb-5">
          <div>
            <span className="font-mono text-xs font-bold text-brand-gold uppercase tracking-wider block">
              QUOTATION CART & INQUIRY BUILDER
            </span>
            <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight text-stone-100">
              YOUR SELECTED FABRICATIONS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {cart.length === 0 ? (
              <button 
                onClick={loadSampleBlueprintItems}
                className="btn-gold text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load Sample Blueprint Items</span>
              </button>
            ) : (
              <button 
                onClick={clearCart}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Items</span>
              </button>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-brand-navy border border-brand-light/60 rounded-lg p-12 text-center space-y-4 shadow-xl">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-500" />
            <h3 className="font-heading font-bold text-stone-100 text-lg uppercase">
              Your Quotation Cart is Currently Empty
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Explore our gate and door catalog, calculate your site dimensions, or load pre-configured sample blueprint items to test instant WhatsApp quotation.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link to="/items" className="btn-gold text-xs py-3 px-6 uppercase font-bold">
                <span>Browse Products</span>
              </Link>
              <button onClick={loadSampleBlueprintItems} className="btn-outline text-xs py-3 px-6 uppercase font-bold">
                <span>Load 4 Sample Items</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Columns: Products Table */}
            <div className="lg:col-span-8 bg-brand-navy border border-brand-light/60 rounded-lg overflow-hidden shadow-xl">
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-brand-dark/90 text-stone-100 font-heading uppercase text-[11px] border-b border-brand-light">
                      <th className="py-3.5 px-4 font-bold">Product</th>
                      <th className="py-3.5 px-3 font-bold">Dimensions</th>
                      <th className="py-3.5 px-3 font-bold">Area</th>
                      <th className="py-3.5 px-3 font-bold">Rate</th>
                      <th className="py-3.5 px-3 font-bold text-center">Qty</th>
                      <th className="py-3.5 px-3 font-bold text-right">Total</th>
                      <th className="py-3.5 px-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-light/40 font-sans">
                    {cart.map((item) => {
                      const lineTotal = Math.round(item.area * item.pricePerSqFt * item.quantity);
                      return (
                        <tr key={item.id} className="hover:bg-brand-medium/50 transition-colors">
                          {/* Product Image & Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded overflow-hidden bg-black border border-brand-light/60 shrink-0">
                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-0.5 max-w-xs">
                                <span className="text-[10px] font-mono text-brand-gold font-bold block">{item.productCode}</span>
                                <h4 className="font-heading font-bold text-xs text-stone-100 line-clamp-1">{item.productName}</h4>
                                {item.customNotes && (
                                  <p className="text-[10px] text-slate-400 line-clamp-1 italic">{item.customNotes}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Dimensions */}
                          <td className="py-4 px-3 font-mono text-slate-200 whitespace-nowrap">
                            {item.width}ft × {item.height}ft
                          </td>

                          {/* Area */}
                          <td className="py-4 px-3 font-mono text-slate-200 whitespace-nowrap">
                            {item.area} sq.ft
                          </td>

                          {/* Rate */}
                          <td className="py-4 px-3 font-mono text-brand-gold whitespace-nowrap">
                            {formatPrice(item.pricePerSqFt)}
                          </td>

                          {/* Quantity Stepper */}
                          <td className="py-4 px-3 text-center whitespace-nowrap">
                            <div className="inline-flex items-center border border-brand-light rounded bg-brand-dark overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-brand-medium text-slate-300 hover:text-white transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-mono font-bold text-stone-100 text-xs">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-brand-medium text-slate-300 hover:text-white transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          {/* Line Total */}
                          <td className="py-4 px-3 text-right font-mono font-bold text-stone-100 whitespace-nowrap">
                            {formatPrice(lineTotal)}
                          </td>

                          {/* Remove */}
                          <td className="py-4 px-4 text-center">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-brand-dark/90 border-t border-brand-light flex flex-wrap items-center justify-between gap-4 text-xs">
                <Link to="/items" className="text-brand-gold hover:underline font-bold flex items-center gap-1.5">
                  <span>← Continue Browsing Fabrication Items</span>
                </Link>
                <span className="text-slate-400">
                  Total Surface Area: <strong className="text-stone-100 font-mono">{totalAreaSqFt.toFixed(1)} Sq.ft</strong>
                </span>
              </div>

            </div>

            {/* Right 4 Columns: Summary & WhatsApp Exporter */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Grand Total Box */}
              <div className="bg-brand-navy border border-brand-gold/40 rounded-lg p-6 space-y-5 shadow-xl">
                <h3 className="font-heading font-black text-sm text-stone-100 uppercase tracking-wider border-b border-brand-light pb-3">
                  ESTIMATED QUOTATION SUMMARY
                </h3>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Total Configured Items:</span>
                    <span className="font-mono font-bold text-stone-100">{totalItemsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Fabrication Area:</span>
                    <span className="font-mono font-bold text-stone-100">{totalAreaSqFt.toFixed(1)} sq.ft</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-brand-light/40">
                    <span className="font-heading font-black text-xs uppercase text-stone-100">Estimated Total:</span>
                    <span className="text-lg sm:text-xl font-heading font-black text-emerald-400 font-mono">
                      {formatPrice(calculatedGrandTotal, true)}
                    </span>
                  </div>
                </div>

                {/* Customer Details for WhatsApp Message */}
                <div className="space-y-3 pt-2 border-t border-brand-light/40 text-xs">
                  <span className="font-heading font-bold text-brand-gold block uppercase tracking-wider text-[10px]">
                    Customer Details (For WhatsApp)
                  </span>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Your Name</label>
                    <input 
                      type="text" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2 text-stone-100 rounded focus:border-brand-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Phone / Mobile</label>
                    <input 
                      type="text" 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2 text-stone-100 rounded focus:border-brand-gold outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Project Type</label>
                    <input 
                      type="text" 
                      value={customerProject} 
                      onChange={(e) => setCustomerProject(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2 text-stone-100 rounded focus:border-brand-gold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button 
                    onClick={handleWhatsAppSend}
                    className="btn-whatsapp w-full py-3.5 text-center justify-center font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Complete Cart to WhatsApp</span>
                  </button>

                  <Link 
                    to="/quote" 
                    className="btn-outline w-full py-3 text-center justify-center font-bold text-xs uppercase tracking-wider block"
                  >
                    <span>Request Official CAD Drawing</span>
                  </Link>
                </div>

                <p className="text-[10px] text-slate-400 italic text-center leading-relaxed">
                  *Online totals represent estimated base fabrication cost. Final pricing is confirmed following official laser survey on site.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
