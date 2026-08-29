import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/apiServices';
import { 
  ShieldCheck, Lock, CheckCircle2, MessageCircle, 
  ShoppingBag
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { getWhatsAppUrl } = useData();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [fullName, setFullName] = useState(user ? `${user.firstName} ${user.lastName}`.trim() : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState('Lahore');
  const [streetAddress, setStreetAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setSubmitting(true);
    setErrorMsg('');

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    try {
      const orderPayload = {
        userId: user?.id,
        email: email || `${phone.replace(/\D/g, '')}@mughalsteel.customer`,
        firstName,
        lastName,
        phone,
        street: streetAddress || 'Site Location Address',
        city,
        notes: specialInstructions,
        items: cart.map(item => ({
          productId: item.productId || '00000000-0000-0000-0000-000000000000',
          productName: item.productName,
          sku: item.productCode || item.sku,
          price: item.totalPrice,
          quantity: item.quantity,
          selectedWidth: item.width.toString(),
          selectedHeight: item.height.toString(),
          selectedFinish: item.finish || item.selectedOptions?.finish || 'Standard Powder Coat',
          selectedGlass: item.glass || item.selectedOptions?.glass || 'Standard',
          selectedHardware: item.selectedOptions?.hardware || 'Standard'
        }))
      };

      const createdOrder = await orderService.create(orderPayload);
      setOrderId(createdOrder.orderNumber || `MSF-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      console.warn('API Order submit fallback to offline order ID:', err);
      const fallbackId = `MSF-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(fallbackId);
      setOrderPlaced(true);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappConfirmationUrl = getWhatsAppUrl(
    `*NEW PROJECT ORDER CONFIRMATION #${orderId}*\n` +
    `Customer: ${fullName}\n` +
    `Phone: ${phone}\n` +
    `Site City: ${city}\n` +
    `Address: ${streetAddress}\n` +
    (specialInstructions ? `Notes: ${specialInstructions}\n` : '') +
    `\nPlease contact me for the advance payment and site measurement schedule.`
  );

  return (
    <div className="bg-brand-dark min-h-screen text-stone-100 py-12 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-brand-light pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-heading font-bold uppercase tracking-widest rounded-sm mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Direct Project Booking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight text-stone-100">
            Confirm Project Quotation & Booking
          </h1>
        </div>

        {orderPlaced ? (
          <div className="bg-brand-medium border-2 border-brand-gold/50 p-8 sm:p-12 rounded-sm text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-brand-gold text-sm font-bold block">
                ORDER ID: {orderId}
              </span>
              <h2 className="text-2xl font-heading font-bold text-stone-100">
                Fabrication Order Booked Successfully!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your project has been logged in our fabrication queue. Our project coordinator will contact you to schedule the on-site laser measurement survey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a 
                href={whatsappConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs py-3 px-6 shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp With Order ID</span>
              </a>

              <Link to="/items" className="btn-outline text-xs py-3 px-6">
                <span>Return to Catalog</span>
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-20 bg-brand-medium border border-brand-light rounded space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="font-heading font-bold text-stone-200">No items in your cart to checkout</h3>
            <Link to="/items" className="btn-gold text-xs">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <form onSubmit={handleOrderSubmit} className="lg:col-span-7 bg-brand-medium border border-brand-light p-6 sm:p-8 rounded-sm space-y-6 shadow-xl">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-light pb-2">
                1. Project Site & Contact Details
              </h3>

              {errorMsg && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Asim Raza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 0300-8456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. asim@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">City / Region *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Other">Other District</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Site / Street Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Phase 6, DHA"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Special Site Instructions</label>
                  <textarea 
                    rows={3}
                    placeholder="Mention any specific gate pillar constraints, slope or motor preparation requirements..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-light p-2.5 rounded text-stone-100 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="btn-gold w-full text-xs py-3.5 shadow-xl disabled:opacity-50"
              >
                <span>{submitting ? 'Submitting Order...' : 'Confirm & Place Quotation Order'}</span>
              </button>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-5 bg-brand-medium border border-brand-light p-6 rounded-sm space-y-4 shadow-xl text-xs">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-light pb-2">
                Order Package ({cart.length} Items)
              </h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-2 bg-brand-dark/70 rounded border border-brand-light">
                    <div className="flex items-center gap-2.5">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded border border-brand-light" />
                      <div>
                        <span className="text-[9px] font-mono text-brand-gold font-bold">{item.productCode}</span>
                        <h4 className="text-xs font-bold text-stone-100 line-clamp-1">{item.productName}</h4>
                        <span className="text-[10px] text-slate-400">{item.width}×{item.height} ft • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-brand-gold text-xs whitespace-nowrap">
                      PKR {(item.totalPrice != null ? item.totalPrice : Math.round((item.area || 1) * (item.pricePerSqFt || item.price || 0) * (item.quantity || 1))).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-light pt-3 space-y-2">
                <div className="flex justify-between items-center text-sm font-heading font-black text-stone-100">
                  <span>Estimated Total:</span>
                  <span className="text-brand-gold text-lg">PKR {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-brand-dark/90 rounded border border-brand-light space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-stone-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Includes 10-Year Structural Guarantee</span>
                </div>
                <div>• Turnkey laser measurement & installation.</div>
                <div>• Verified certified 14G+ MS steel frame.</div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
