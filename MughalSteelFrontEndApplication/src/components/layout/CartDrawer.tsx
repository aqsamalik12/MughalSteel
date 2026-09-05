import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  X, Trash2, Plus, Minus, MessageCircle, ArrowRight, 
  ShoppingBag, ShieldCheck, Calculator, Sparkles 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, cartOpen, setCartOpen, removeFromCart, 
    updateQuantity, updateItemDimensions, cartTotal, 
    sendCartToWhatsApp 
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  if (!cartOpen) return null;

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendCartToWhatsApp(customerName, customerPhone, customNotes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-brand-navy border-l border-brand-light flex flex-col justify-between shadow-2xl animate-slide-in">
          
          {/* Top Bar */}
          <div className="p-6 border-b border-brand-light flex items-center justify-between bg-brand-dark/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-gold/10 text-brand-gold rounded border border-brand-gold/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-stone-100">
                  Quotation Cart
                </h3>
                <span className="text-[11px] text-slate-400">
                  {cart.length} {cart.length === 1 ? 'Product Configuration' : 'Product Configurations'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setCartOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-sm hover:bg-brand-medium transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List / Table */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-medium flex items-center justify-center mx-auto text-slate-500 border border-brand-light">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-heading text-base font-bold text-stone-200 uppercase tracking-wide">
                  Your Cart is Empty
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore our project categories and configure custom dimensions to calculate estimates.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    to="/categories" 
                    onClick={() => setCartOpen(false)}
                    className="btn-gold text-xs py-2.5 px-5"
                  >
                    Browse Categories
                  </Link>
                  <Link 
                    to="/try-at-home" 
                    onClick={() => setCartOpen(false)}
                    className="btn-outline text-xs py-2.5 px-5"
                  >
                    Try at Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-brand-gold/10 border border-brand-gold/30 rounded p-3 text-xs text-stone-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>
                    You can adjust width & height on each item to dynamically recalculate estimated fabrication pricing.
                  </span>
                </div>

                {cart.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-brand-medium/70 border border-brand-light rounded p-4 space-y-3 shadow-md"
                  >
                    {/* Item Title & Code */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={item.productImage} 
                          alt={item.productName} 
                          className="w-16 h-16 object-cover rounded border border-brand-light shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-gold/15 px-1.5 py-0.5 rounded border border-brand-gold/30">
                              {item.productCode}
                            </span>
                            <h4 className="text-sm font-heading font-bold text-stone-100">
                              {item.productName}
                            </h4>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {item.category} • {item.item}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"
                        title="Remove from inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dimensions & Calculator Inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-brand-dark/60 p-2.5 rounded border border-brand-light/50 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Width (ft)</span>
                        <input 
                          type="number" 
                          min="1"
                          step="0.5"
                          value={item.width}
                          onChange={(e) => updateItemDimensions(item.id, parseFloat(e.target.value) || 1, item.height)}
                          className="w-full bg-brand-navy border border-brand-light px-2 py-1 text-stone-100 font-mono font-bold rounded mt-1 focus:border-brand-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Height (ft)</span>
                        <input 
                          type="number" 
                          min="1"
                          step="0.5"
                          value={item.height}
                          onChange={(e) => updateItemDimensions(item.id, item.width, parseFloat(e.target.value) || 1)}
                          className="w-full bg-brand-navy border border-brand-light px-2 py-1 text-stone-100 font-mono font-bold rounded mt-1 focus:border-brand-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Area (sq.ft)</span>
                        <span className="block font-mono font-bold text-stone-200 mt-2">
                          {item.area} sq.ft
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Rate / sq.ft</span>
                        <span className="block font-mono font-bold text-brand-gold mt-2">
                          Rs. {(item.pricePerSqFt || item.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">Qty:</span>
                        <div className="flex items-center border border-brand-light rounded bg-brand-dark">
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="px-2.5 py-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono font-bold text-stone-200">{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="px-2.5 py-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Estimated Total</span>
                        <span className="text-sm font-heading font-black text-brand-gold">
                          Rs. {(item.totalPrice != null ? item.totalPrice : Math.round((item.area || 1) * (item.pricePerSqFt || item.price || 0) * (item.quantity || 1))).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Summary & WhatsApp Checkout Bar */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-light bg-brand-dark/80 space-y-4">
              {/* Optional Contact Inputs Toggle */}
              {showInquiryForm ? (
                <form onSubmit={handleWhatsAppSend} className="space-y-3 bg-brand-medium/80 p-3.5 rounded border border-brand-light text-xs animate-fade-in">
                  <div className="flex items-center justify-between border-b border-brand-light pb-2">
                    <span className="font-heading font-bold text-brand-gold uppercase tracking-wider text-[11px]">
                      Your Contact Details for WhatsApp Quotation
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setShowInquiryForm(false)}
                      className="text-slate-400 hover:text-white text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Your Name (e.g. Tariq Khan)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-brand-dark border border-brand-light p-2 text-stone-100 rounded focus:border-brand-gold focus:outline-none"
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number (e.g. 0300-1234567)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="bg-brand-dark border border-brand-light p-2 text-stone-100 rounded focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                  <textarea 
                    rows={2}
                    placeholder="Specific requirements (e.g. need automatic motor, installation in DHA Lahore)..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2 text-stone-100 rounded focus:border-brand-gold focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="btn-whatsapp w-full text-center text-xs py-3"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Inquiry to WhatsApp Now</span>
                  </button>
                </form>
              ) : null}

              {/* Total Display */}
              <div className="flex items-center justify-between border-b border-brand-light/60 pb-3">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-heading font-semibold tracking-wider block">
                    Estimated Complete Cart Total
                  </span>
                  <span className="text-[10px] text-slate-500">
                    *Final price confirmed after site measurement
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl md:text-2xl font-heading font-black text-brand-gold">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link 
                  to="/checkout" 
                  onClick={() => setCartOpen(false)}
                  className="btn-gold w-full text-center text-xs py-3 shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase font-bold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </Link>

                {!showInquiryForm && (
                  <button 
                    onClick={() => setShowInquiryForm(true)}
                    className="btn-whatsapp w-full text-center text-xs py-3 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Complete Cart to WhatsApp</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/cart" 
                    onClick={() => setCartOpen(false)}
                    className="btn-outline text-center text-[11px] py-2.5"
                  >
                    <span>Detailed Cart View</span>
                  </Link>

                  <Link 
                    to="/quote" 
                    onClick={() => setCartOpen(false)}
                    className="btn-outline text-center text-[11px] py-2.5"
                  >
                    <span>Request Formal Quote</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
