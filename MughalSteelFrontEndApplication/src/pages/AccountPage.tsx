import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import type { CartItem, Quote, Order, CustomDesign, Address } from '../types';
import { User, ShoppingBag, ClipboardList, PenTool, MapPin, LogOut, CheckCircle, ArrowRight } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile, addAddress, removeAddress } = useAuth();
  const { orders, quotes, savedDesigns, deleteCustomDesign } = useData();

  useEffect(() => { 
    window.scrollTo(0, 0); 
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Dashboard states
  const [activeSubSection, setActiveSubSection] = useState<'profile' | 'orders' | 'designs' | 'quotes' | 'addresses'>('profile');

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'Pakistan' });

  // Profile update states
  const [profFirst, setProfFirst] = useState('');
  const [profLast, setProfLast] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfFirst(user.firstName || '');
      setProfLast(user.lastName || '');
      setProfPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profFirst.trim(), profLast.trim(), profPhone.trim());
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.street.trim() && newAddress.city.trim()) {
      await addAddress({
        street: newAddress.street.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim() || 'ICT',
        zip: newAddress.zip.trim() || '44000',
        country: newAddress.country || 'Pakistan'
      });
      setNewAddress({ street: '', city: '', state: '', zip: '', country: 'Pakistan' });
      setShowAddressForm(false);
    }
  };

  // Filter quotes, orders and designs strictly belonging to the active authenticated user
  const userQuotes = quotes.filter((q: Quote) => {
    if (user?.isAdmin) return true;
    return q.customer?.email?.toLowerCase() === user?.email?.toLowerCase() || (q as any).customerId === user?.id;
  });

  const userOrders = orders.filter((o: Order) => {
    if (user?.isAdmin) return true;
    return o.customerId === user?.id || o.customerEmail?.toLowerCase() === user?.email?.toLowerCase();
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="bg-[#070C15] min-h-screen text-stone-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        
        {/* Left Side: Sidebar Control Panel */}
        <aside className="lg:col-span-3 bg-[#0C1322]/95 border border-stone-800/90 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="text-center space-y-2 pb-4 border-b border-stone-800">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-brand-gold to-yellow-600 text-brand-dark rounded-2xl flex items-center justify-center font-serif text-xl font-bold mx-auto shadow-md shadow-brand-gold/10">
              {(user.firstName || user.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-serif text-base text-stone-100 uppercase tracking-wider font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-[10px] text-brand-gold font-mono uppercase tracking-widest font-bold mt-0.5">
                {user.isAdmin ? 'Administrator' : 'Customer Account'}
              </p>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">{user.email}</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-1.5 text-xs text-stone-400 uppercase tracking-wider font-semibold">
            <button 
              onClick={() => setActiveSubSection('profile')}
              className={`py-2.5 px-3.5 text-left rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeSubSection === 'profile' 
                  ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-bold' 
                  : 'hover:bg-stone-900/60 hover:text-stone-200'
              }`}
            >
              <User className="w-4 h-4 text-brand-gold shrink-0" />
              <span>My Profile</span>
            </button>

            <button 
              onClick={() => setActiveSubSection('orders')}
              className={`py-2.5 px-3.5 text-left rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeSubSection === 'orders' 
                  ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-bold' 
                  : 'hover:bg-stone-900/60 hover:text-stone-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Order History ({userOrders.length})</span>
            </button>

            <button 
              onClick={() => setActiveSubSection('designs')}
              className={`py-2.5 px-3.5 text-left rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeSubSection === 'designs' 
                  ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-bold' 
                  : 'hover:bg-stone-900/60 hover:text-stone-200'
              }`}
            >
              <PenTool className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Saved Designs ({savedDesigns.length})</span>
            </button>

            <button 
              onClick={() => setActiveSubSection('quotes')}
              className={`py-2.5 px-3.5 text-left rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeSubSection === 'quotes' 
                  ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-bold' 
                  : 'hover:bg-stone-900/60 hover:text-stone-200'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Quote Requests ({userQuotes.length})</span>
            </button>

            <button 
              onClick={() => setActiveSubSection('addresses')}
              className={`py-2.5 px-3.5 text-left rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeSubSection === 'addresses' 
                  ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-bold' 
                  : 'hover:bg-stone-900/60 hover:text-stone-200'
              }`}
            >
              <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Address Book</span>
            </button>

            {user.isAdmin && (
              <Link 
                to="/admin" 
                className="py-2.5 px-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all border border-brand-gold/40 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-dark mt-4 text-center font-bold text-xs"
              >
                <span>OPEN ADMIN PANEL</span>
              </Link>
            )}

            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="py-2.5 px-3.5 text-left rounded-xl flex items-center space-x-2.5 hover:bg-red-950/25 hover:text-red-300 mt-6 text-red-400 font-bold border border-red-950/40 cursor-pointer transition"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* Right Side: Tab Panel Content */}
        <main className="lg:col-span-9 bg-[#0C1322]/95 border border-stone-800/90 p-6 sm:p-8 rounded-2xl shadow-xl min-h-[460px]">
          
          {/* 1. PROFILE SUB-SECTION */}
          {activeSubSection === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3">
                <h2 className="text-lg sm:text-xl font-serif uppercase tracking-wider text-stone-100 font-bold">
                  My Profile Details
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">Manage your personal details and contact information.</p>
              </div>
              
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs text-stone-400 uppercase tracking-wider font-bold">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={profFirst}
                      onChange={(e) => setProfFirst(e.target.value)}
                      className="w-full bg-[#070C15] border border-stone-700/80 rounded-xl text-xs px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs text-stone-400 uppercase tracking-wider font-bold">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={profLast}
                      onChange={(e) => setProfLast(e.target.value)}
                      className="w-full bg-[#070C15] border border-stone-700/80 rounded-xl text-xs px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-stone-400 uppercase tracking-wider font-bold">Phone / WhatsApp Number</label>
                  <input 
                    type="tel" 
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#070C15] border border-stone-700/80 rounded-xl text-xs px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-stone-400 uppercase tracking-wider font-bold">Email Address</label>
                  <input 
                    type="email" 
                    disabled 
                    value={user.email}
                    className="w-full bg-[#070C15] border border-stone-800 rounded-xl text-xs px-3.5 py-2.5 text-stone-500 cursor-not-allowed font-mono"
                  />
                </div>

                <button 
                  type="submit" 
                  className="py-2.5 px-6 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition shadow-md cursor-pointer"
                >
                  Save Profile Changes
                </button>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Profile details updated successfully!</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* 2. ORDER HISTORY SUB-SECTION */}
          {activeSubSection === 'orders' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3">
                <h2 className="text-lg sm:text-xl font-serif uppercase tracking-wider text-stone-100 font-bold">
                  Purchase & Fabrication Orders
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">Track your structural steel orders and shipment updates.</p>
              </div>
              
              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs">
                  <ShoppingBag className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                  <p>No orders have been recorded on this account yet.</p>
                  <Link to="/products" className="inline-block mt-3 px-4 py-2 bg-brand-gold text-brand-dark rounded-xl font-bold text-xs">
                    Browse Product Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord: Order) => (
                    <div key={ord.id} className="border border-stone-800 rounded-xl overflow-hidden text-xs bg-[#070C15]/60">
                      {/* Order Header */}
                      <div className="bg-[#070C15] border-b border-stone-800 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
                        <div className="flex flex-wrap items-center gap-4">
                          <span>Date: <strong className="text-stone-300">{new Date(ord.createdAt).toLocaleDateString()}</strong></span>
                          <span>Order Ref: <strong className="text-brand-gold font-mono">#{ord.id.slice(-8)}</strong></span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          ord.orderStatus === 'delivered' || ord.orderStatus === 'shipped' 
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' 
                            : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </div>
                      
                      {/* Items */}
                      <div className="p-4 space-y-3">
                        {ord.items.map((item: CartItem, idx: number) => (
                          <div key={idx} className="flex justify-between items-start gap-4 pb-2 border-b border-stone-800/40 last:border-0 last:pb-0">
                            <div>
                              <p className="font-serif font-bold text-stone-200 text-sm">{item.productName}</p>
                              <p className="text-[11px] text-stone-500">Qty: {item.quantity} | Code: {item.productCode || item.sku || 'MSF'}</p>
                            </div>
                            <span className="text-stone-200 font-bold font-mono text-sm">
                              Rs. {(item.totalPrice || (item.pricePerSqFt * item.quantity)).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        
                        <div className="border-t border-stone-800 pt-3 flex flex-wrap justify-between items-center text-xs text-stone-400 gap-2">
                          <span>Delivery Address: {ord.shippingAddress?.street}, {ord.shippingAddress?.city}</span>
                          <span className="text-brand-gold font-bold font-mono text-sm">
                            Total: Rs. {(ord.total || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. SAVED CUSTOM DESIGNS SUB-SECTION */}
          {activeSubSection === 'designs' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3">
                <h2 className="text-lg sm:text-xl font-serif uppercase tracking-wider text-stone-100 font-bold">
                  Saved Custom Designs
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">Your saved configurations from the Custom Design Studio.</p>
              </div>
              
              {savedDesigns.length === 0 ? (
                <div className="text-center py-12 text-stone-500 space-y-3 text-xs">
                  <PenTool className="w-10 h-10 text-stone-600 mx-auto" />
                  <p>You have no custom layouts saved.</p>
                  <Link to="/custom-design" className="inline-block px-4 py-2 bg-brand-gold text-brand-dark rounded-xl font-bold text-xs">
                    Launch Custom Designer
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDesigns.map((d: CustomDesign) => (
                    <div key={d.id} className="bg-[#070C15] border border-stone-800 p-4 rounded-xl text-xs flex flex-col justify-between h-48">
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-brand-gold font-bold uppercase tracking-wider mb-2">
                          <span>Config: {d.doorType}</span>
                          <button onClick={() => deleteCustomDesign(d.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                            Delete
                          </button>
                        </div>
                        <p className="font-serif text-sm text-stone-200 mb-1">{d.width}"W x {d.height}"H Custom Entry</p>
                        <p className="text-stone-400">Finish: {d.finish} | Glass: {d.glass}</p>
                        <p className="text-stone-400 truncate mt-1">Hardware: {d.hardware} ({d.handle})</p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-stone-800">
                        <span className="text-brand-gold font-bold font-mono text-sm">
                          Rs. {(d.estimatedPrice || d.price || 0).toLocaleString()}
                        </span>
                        <Link 
                          to={`/quote?productType=${d.doorType}&doorStyle=${d.finish}+Finish&width=${d.width}&height=${d.height}`}
                          className="text-[10px] font-bold uppercase tracking-wider text-stone-300 hover:text-brand-gold transition flex items-center gap-1"
                        >
                          <span>Request Quote</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. QUOTE REQUESTS SUB-SECTION */}
          {activeSubSection === 'quotes' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3">
                <h2 className="text-lg sm:text-xl font-serif uppercase tracking-wider text-stone-100 font-bold">
                  Quotation Status & Estimates
                </h2>
                <p className="text-stone-400 text-xs mt-0.5">Track submitted custom architectural quotes and engineering estimates.</p>
              </div>
              
              {userQuotes.length === 0 ? (
                <div className="text-center py-12 text-stone-500 space-y-3 text-xs">
                  <ClipboardList className="w-10 h-10 text-stone-600 mx-auto" />
                  <p>No active quotations requested on this account.</p>
                  <Link to="/quote" className="inline-block px-4 py-2 bg-brand-gold text-brand-dark rounded-xl font-bold text-xs">
                    Request an Instant Quote
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {userQuotes.map((q: Quote) => (
                    <div key={q.id} className="border border-stone-800 rounded-xl overflow-hidden bg-[#070C15]/60">
                      <div className="bg-[#070C15] px-4 py-3 border-b border-stone-800 flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <span>Reference: <strong className="text-brand-gold font-mono font-bold">#{q.id.slice(-8)}</strong></span>
                          <span className="text-stone-500 text-[11px] ml-4">Submitted: {new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] border ${
                          q.status === 'Approved' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 
                          q.status === 'Rejected' ? 'bg-red-950/60 border-red-500/40 text-red-400' : 
                          'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Design / Category:</span>
                          <span className="text-stone-200 font-bold">{q.doorStyle || q.projectType || q.productCategory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Dimensions:</span>
                          <span className="text-stone-200">{q.dimensions.width}' x {q.dimensions.height}' ({q.dimensions.qty} unit)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Finish / Treatment:</span>
                          <span className="text-stone-200">{q.finish || 'Standard Primer'}</span>
                        </div>
                        <div className="flex justify-between border-t border-stone-800 pt-2 font-bold">
                          <span className="text-stone-400">Estimated Total:</span>
                          <span className="text-brand-gold font-mono text-sm">Rs. {(q.estimatedPrice || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. ADDRESS BOOK SUB-SECTION */}
          {activeSubSection === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif uppercase tracking-wider text-stone-100 font-bold">
                    Delivery Addresses
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">Manage on-site delivery and installation destinations.</p>
                </div>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-3 py-1.5 bg-brand-gold text-brand-dark rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:brightness-110 transition"
                >
                  {showAddressForm ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-[#070C15] border border-stone-800 p-5 rounded-xl space-y-4 max-w-md animate-fadeIn text-xs">
                  <h3 className="font-bold text-stone-200 uppercase tracking-wider">New Delivery Destination</h3>
                  <div className="space-y-1">
                    <label className="block text-xs text-stone-400 uppercase tracking-wider font-bold">Street Address *</label>
                    <input 
                      type="text" 
                      required 
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      placeholder="e.g. House 42, Street 12, Sector F-7/2"
                      className="w-full bg-[#0C1322] border border-stone-700/80 rounded-xl text-xs px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs text-stone-400 uppercase tracking-wider font-bold">City *</label>
                      <input 
                        type="text" 
                        required 
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="e.g. Islamabad"
                        className="w-full bg-[#0C1322] border border-stone-700/80 rounded-xl text-xs px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs text-stone-400 uppercase tracking-wider font-bold">State / Province</label>
                      <input 
                        type="text" 
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="e.g. Punjab / ICT"
                        className="w-full bg-[#0C1322] border border-stone-700/80 rounded-xl text-xs px-3 py-2 text-stone-100 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="py-2.5 px-5 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {(!user.addresses || user.addresses.length === 0) ? (
                <div className="text-center py-10 text-stone-500 text-xs">
                  <MapPin className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                  <p>No delivery destinations saved yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr: Address, idx: number) => (
                    <div key={idx} className="bg-[#070C15] border border-stone-800 p-4 rounded-xl text-xs flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/30">
                          Address #{idx + 1}
                        </span>
                        <p className="text-stone-200 font-bold pt-2">{addr.street}</p>
                        <p className="text-stone-400">{addr.city}, {addr.state} {addr.zip}</p>
                        <p className="text-stone-500">{addr.country || 'Pakistan'}</p>
                      </div>
                      <button 
                        onClick={() => removeAddress(idx)}
                        className="text-red-400 hover:text-red-300 text-[10px] uppercase tracking-wider font-bold cursor-pointer transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AccountPage;
