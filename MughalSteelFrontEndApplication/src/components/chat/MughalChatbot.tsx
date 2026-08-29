import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  X, Send, Bot, Calculator, 
  ArrowRight, MessageCircle, RefreshCw
} from 'lucide-react';
import type { Product } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string; payload?: any }[];
  productCard?: Product;
  calculator?: boolean;
}

export const MughalChatbot: React.FC = () => {
  const navigate = useNavigate();
  const { products, getWhatsAppUrl } = useData();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  
  // Custom Gate Calculator State inside chat
  const [calcWidth, setCalcWidth] = useState<number>(14);
  const [calcHeight, setCalcHeight] = useState<number>(7.5);
  const [calcGauge, setCalcGauge] = useState<'14' | '16' | '12'>('14');
  const [calcMotor, setCalcMotor] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initial Welcome Message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-1',
        sender: 'bot',
        text: "Assalam-o-Alaikum! 🌟 Welcome to **Mughal Steel Fabrication** AI Support.\n\nI am your 24/7 Architectural Steel Assistant. How can I assist you with your gate, door, railing, or construction project today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: '💰 Estimate Gate Price & Weight', action: 'show_calculator' },
          { label: '🚪 Browse Main Gates Catalog', action: 'browse_gates' },
          { label: '📸 Test Gate on House Photo', action: 'goto_tryon' },
          { label: '🛡️ 14-Gauge vs 16-Gauge Difference', action: 'gauge_info' },
          { label: '🔍 Track Quote / Order', action: 'track_order' },
          { label: '📍 Location, Delivery & Installation', action: 'location_info' }
        ]
      }
    ];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setShowTooltip(false);
    }
  }, [isOpen, messages, isTyping]);

  // Hide tooltip automatically after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Quick Action Click Handler
  const handleQuickAction = (action: string, payload?: any) => {
    if (action === 'show_calculator') {
      addUserMessage("I want to calculate gate price and weight");
      generateBotResponse("calc_request");
    } else if (action === 'browse_gates') {
      addUserMessage("Show me popular Main Gates designs");
      generateBotResponse("show_gates");
    } else if (action === 'goto_tryon') {
      addUserMessage("How can I test a gate design on my house photo?");
      generateBotResponse("tryon_info");
    } else if (action === 'gauge_info') {
      addUserMessage("What is the difference between 14-Gauge and 16-Gauge steel?");
      generateBotResponse("gauge_details");
    } else if (action === 'track_order') {
      addUserMessage("I want to track my Quote or Fabrication Order");
      generateBotResponse("track_instructions");
    } else if (action === 'location_info') {
      addUserMessage("Where is your workshop and how do delivery and installation work?");
      generateBotResponse("delivery_details");
    } else if (action === 'talk_human') {
      window.open(getWhatsAppUrl("Hello Mughal Steel Team, I was chatting with your AI Assistant and would like to speak directly with an engineering consultant."), '_blank');
    } else if (action === 'view_product' && payload) {
      setIsOpen(false);
      navigate(`/product/${payload}`);
    } else if (action === 'open_quote') {
      setIsOpen(false);
      navigate('/quote');
    } else if (action === 'goto_tryon_link') {
      setIsOpen(false);
      navigate('/try-at-home');
    } else if (action === 'view_account') {
      setIsOpen(false);
      navigate('/account');
    }
  };

  const addUserMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const text = inputMessage.trim();
    setInputMessage('');
    addUserMessage(text);
    generateBotResponse(text.toLowerCase());
  };

  // Intelligent Knowledge Base & Response Engine
  const generateBotResponse = (query: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const q = query.toLowerCase();

      // 1. Gate Price & Weight Calculation Request
      if (q === 'calc_request' || q.includes('price') || q.includes('rate') || q.includes('calculate') || q.includes('cost') || q.includes('weight') || q.includes('estimate') || q.includes('kitne ka') || q.includes('kharcha')) {
        botReply.text = "Here is our **Interactive Gate Price & Weight Estimator**:\n\nYou can adjust dimensions (Width × Height) and select steel thickness to get an instant realistic estimate according to current Pakistan steel market rates.";
        botReply.calculator = true;
        botReply.quickActions = [
          { label: '📝 Request Official Quotation', action: 'open_quote' },
          { label: '💬 Confirm on WhatsApp', action: 'talk_human' }
        ];
      }
      // 2. Browse Main Gates & Products
      else if (q === 'show_gates' || q.includes('gate') || q.includes('door') || q.includes('darwaza') || q.includes('design') || q.includes('catalog') || q.includes('product')) {
        const topGate = products.find(p => p.category.toLowerCase().includes('gate') || p.category.toLowerCase().includes('home')) || products[0];
        botReply.text = `Here is one of our top-rated **${topGate?.name || 'Grand CNC Laser Cut Steel Gate'}**.\n\n• **Material:** 14-Gauge Structural Mild Carbon Steel\n• **Finish:** Oven-Baked Matte Electrostatic Powder Coating\n• **Price:** Approx Rs. ${(topGate?.price || 145000).toLocaleString()} (Standard size)\n• **Warranty:** 10-Year Structural Guarantee`;
        if (topGate) {
          botReply.productCard = topGate;
        }
        botReply.quickActions = [
          { label: '🔍 View Product Details', action: 'view_product', payload: topGate?.id },
          { label: '📸 Test on House Photo', action: 'goto_tryon_link' },
          { label: '📝 Request Custom Quote', action: 'open_quote' },
          { label: '💬 Discuss on WhatsApp', action: 'talk_human' }
        ];
      }
      // 3. Virtual Try-On / House Photo Test
      else if (q === 'tryon_info' || q.includes('photo') || q.includes('try') || q.includes('visualizer') || q.includes('tasveer') || q.includes('house') || q.includes('home')) {
        botReply.text = "✨ **Virtual Try-At-Home Feature:**\n\nYou can upload a photo of your front elevation or main entrance porch, and our visualizer will superimpose our realistic 3D laser-cut gate designs directly onto your house!\n\nThis helps you see how the gate matches your marble, pillars, and color scheme before placing an order.";
        botReply.quickActions = [
          { label: '🚀 Open House Photo Visualizer', action: 'goto_tryon_link' },
          { label: '💬 Send Photo on WhatsApp for 3D Render', action: 'talk_human' }
        ];
      }
      // 4. Steel Gauge & Quality (14G vs 16G)
      else if (q === 'gauge_details' || q.includes('gauge') || q.includes('14') || q.includes('16') || q.includes('thickness') || q.includes('quality') || q.includes('material') || q.includes('farq') || q.includes('loha')) {
        botReply.text = "🛡️ **14-Gauge vs 16-Gauge Steel Comparison:**\n\n• **14-Gauge (2.0mm Thickness):**\n  - Recommended for Grand Main Gates, Driveway Sliding Gates, and Main Double Entrance Doors.\n  - Extra rigidity, zero bending, withstands heavy wind load & impacts.\n\n• **16-Gauge (1.6mm Thickness):**\n  - Recommended for Boundary Wall Security Grills, Staircase Railings, and Balcony Balustrades.\n  - Lightweight yet strong, economical for decorative patterns.\n\n• **Corrosion Protection:** All our steel undergoes anti-rust red oxide primer + oven-baked electrostatic powder coating.";
        botReply.quickActions = [
          { label: '💰 Calculate 14G vs 16G Price', action: 'show_calculator' },
          { label: '💬 Ask an Engineer on WhatsApp', action: 'talk_human' }
        ];
      }
      // 5. Order & Quote Tracking
      else if (q === 'track_instructions' || q.includes('track') || q.includes('status') || q.includes('quo-') || q.includes('ord-') || q.includes('mera order') || q.includes('check')) {
        botReply.text = "🔍 **Order & Quotation Tracking:**\n\n• If you have submitted a Quote Request or placed an Order, you can view the live progress directly in your **Customer Dashboard (`/account`)**.\n\n• You can also send your **Quote Number (e.g. `QUO-XXXXX`)** or Phone Number to our WhatsApp support team for instant real-time fabrication shop floor pictures!";
        botReply.quickActions = [
          { label: '📱 Chat with Order Desk on WhatsApp', action: 'talk_human' },
          { label: '👤 Open My Account', action: 'view_account' }
        ];
      }
      // 6. Location, Delivery & Installation
      else if (q === 'delivery_details' || q.includes('location') || q.includes('address') || q.includes('delivery') || q.includes('install') || q.includes('kahan') || q.includes('lahore') || q.includes('rawalpindi') || q.includes('islamabad')) {
        botReply.text = "📍 **Workshop & Delivery Information:**\n\n• **Head Workshop:** Plot 42, Sector I-9 Industrial Area, Rawalpindi / Islamabad.\n• **Free Site Measurement:** Available in Islamabad, Rawalpindi, Bahria Town & DHA.\n• **Nationwide Delivery:** We deliver and install custom fabrication across Lahore, Peshawar, Faisalabad, Multan, and throughout Pakistan via secure crane & container transit.\n• **Installation:** On-site laser level foundation anchoring + motor programming included.";
        botReply.quickActions = [
          { label: '📞 Call / WhatsApp Workshop', action: 'talk_human' },
          { label: '📝 Book Free Site Measurement', action: 'open_quote' }
        ];
      }
      // 7. Automation / Motor inquiry
      else if (q.includes('motor') || q.includes('remote') || q.includes('automatic') || q.includes('sliding') || q.includes('sensor')) {
        botReply.text = "⚡ **Gate Automation & Motors:**\n\nWe provide heavy-duty **Italian & German Sliding / Swing Gate Automation Motors** (800kg to 1500kg capacity) featuring:\n\n• Dual Wireless Remote Controls (100m range)\n• Infrared Obstacle Safety Sensors\n• Mobile App WiFi Control\n• Manual Key Override for power outages\n• 2-Year Full Motor Replacement Warranty.";
        botReply.quickActions = [
          { label: '💰 Estimate Motor Cost with Gate', action: 'show_calculator' },
          { label: '💬 Inquire Motor Models on WhatsApp', action: 'talk_human' }
        ];
      }
      // 8. General / Fallback Response
      else {
        botReply.text = `Thank you for reaching out! I understand you are inquiring about: *"${query}"*.\n\nAt **Mughal Steel Fabrication**, we specialize in custom architectural metalwork, CNC laser cut gates, security doors, railings, and structural steel.\n\nHow would you like to proceed?`;
        botReply.quickActions = [
          { label: '💰 Calculate Gate Price & Weight', action: 'show_calculator' },
          { label: '🚪 View Main Gates Catalog', action: 'browse_gates' },
          { label: '📝 Request Custom Quote', action: 'open_quote' },
          { label: '💬 Talk to Human Engineer on WhatsApp', action: 'talk_human' }
        ];
      }

      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 600);
  };

  // Price & Weight Calculation Helper
  const areaSqFt = calcWidth * calcHeight;
  const weightFactor = calcGauge === '12' ? 5.5 : calcGauge === '14' ? 4.2 : 3.4; // kg per sq ft
  const estWeightKg = Math.round(areaSqFt * weightFactor);
  const ratePerSqFt = calcGauge === '12' ? 3600 : calcGauge === '14' ? 3100 : 2600;
  const rawGatePrice = Math.round(areaSqFt * ratePerSqFt);
  const motorCost = calcMotor ? 48000 : 0;
  const totalEstPrice = rawGatePrice + motorCost;

  return (
    <>
      {/* ======================================================== */}
      {/* 1. FLOATING ACTION BUTTONS (SNUG IN BOTTOM-RIGHT CORNER) */}
      {/* ======================================================== */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex flex-col items-center gap-2 select-none">
        
        {/* Tooltip Popup */}
        {showTooltip && !isOpen && (
          <div className="bg-[#0C1322] text-stone-100 border border-brand-gold/60 px-3 py-1.5 rounded-xl shadow-2xl text-[10px] max-w-[220px] animate-bounce flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="min-w-0">
              <p className="font-heading font-black text-brand-gold uppercase text-[9px]">Mughal Steel AI</p>
              <p className="text-[9px] text-slate-300 truncate">Need instant gate prices?</p>
            </div>
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. WhatsApp Floating Button (Top Circular Icon) */}
        <a
          href={getWhatsAppUrl("Hello Mughal Steel Team, I am browsing your website and would like to inquire about architectural fabrication.")}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_4px_16px_rgba(37,211,102,0.45)] flex items-center justify-center transition-all duration-300 hover:scale-108 cursor-pointer group"
          title="Chat on WhatsApp"
          aria-label="WhatsApp Support"
        >
          <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </a>

        {/* 2. AI Chatbot Floating Trigger Button (Bottom Circular Icon) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-11 h-11 sm:w-11 sm:h-11 rounded-full shadow-[0_4px_16px_rgba(220,38,38,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-108 cursor-pointer relative ${
            isOpen 
              ? 'bg-stone-900 border border-stone-700 text-stone-300' 
              : 'bg-gradient-to-tr from-[#991B1B] via-[#DC2626] to-[#EF4444] text-white'
          }`}
          title="Mughal Steel AI Assistant"
          aria-label="Toggle AI Support Chat"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              {/* Dual Chat Bubble Icon matching screenshot */}
              <div className="relative flex items-center justify-center">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                </svg>
              </div>
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-gold text-brand-dark text-[8px] font-mono font-black rounded-full flex items-center justify-center animate-pulse border border-brand-dark">
                  1
                </span>
              )}
            </>
          )}
        </button>

      </div>

      {/* ======================================================== */}
      {/* 2. CHATBOT INTERACTIVE WINDOW (SNUG & COMPACT) */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="fixed bottom-16 right-2 sm:bottom-18 sm:right-4 z-50 w-[calc(100vw-1rem)] sm:w-[370px] h-[470px] max-h-[70vh] bg-[#070C15] border border-brand-gold/60 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-3 duration-250 backdrop-blur-xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0C1322] via-[#111A2E] to-[#0C1322] px-3.5 py-2.5 border-b border-brand-light/40 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0C1322] rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-black text-xs text-stone-100 uppercase tracking-wider">
                    MUGHAL STEEL AI
                  </h3>
                  <span className="px-1.5 py-0.2 bg-brand-gold/20 text-brand-gold text-[8px] font-mono font-bold rounded">
                    24/7
                  </span>
                </div>
                <p className="text-[9.5px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <span>● Online</span>
                  <span className="text-slate-400 font-sans">• Fabrication & Pricing</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: `msg-${Date.now()}`,
                      sender: 'bot',
                      text: "Conversation reset. How can I assist you with your gate, door, or architectural fabrication requirements?",
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      quickActions: [
                        { label: '💰 Calculate Gate Price', action: 'show_calculator' },
                        { label: '🚪 Browse Main Gates', action: 'browse_gates' },
                        { label: '📸 Test on House Photo', action: 'goto_tryon_link' },
                        { label: '💬 Talk to Engineer', action: 'talk_human' }
                      ]
                    }
                  ]);
                }}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-brand-gold flex items-center justify-center transition cursor-pointer"
                title="Restart Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition cursor-pointer"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans scrollbar-thin scrollbar-thumb-stone-800">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Text Message Bubble */}
                  <div className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-tr from-[#947427] to-brand-gold text-brand-dark font-medium rounded-tr-none' 
                      : 'bg-[#0E1526] border border-brand-light/50 text-stone-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Interactive Gate Calculator Component */}
                  {msg.calculator && (
                    <div className="bg-[#05080E] border border-brand-gold/50 p-3.5 rounded-xl space-y-3 shadow-lg">
                      <div className="flex items-center gap-1.5 text-brand-gold font-heading font-black uppercase text-[11px] border-b border-brand-light/30 pb-1.5">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Instant Gate Price & Weight Estimator</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-400 block mb-0.5">Width (Feet):</label>
                          <input 
                            type="number" 
                            value={calcWidth} 
                            min={6} 
                            max={30}
                            onChange={(e) => setCalcWidth(Number(e.target.value))}
                            className="w-full bg-[#0C1322] border border-stone-700 rounded px-2 py-1 text-stone-100 text-xs font-mono focus:border-brand-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-0.5">Height (Feet):</label>
                          <input 
                            type="number" 
                            value={calcHeight} 
                            min={5} 
                            max={15}
                            onChange={(e) => setCalcHeight(Number(e.target.value))}
                            className="w-full bg-[#0C1322] border border-stone-700 rounded px-2 py-1 text-stone-100 text-xs font-mono focus:border-brand-gold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-400 block mb-0.5">Steel Thickness:</label>
                          <select
                            value={calcGauge}
                            onChange={(e) => setCalcGauge(e.target.value as any)}
                            className="w-full bg-[#0C1322] border border-stone-700 rounded px-2 py-1 text-stone-100 text-xs font-mono focus:border-brand-gold focus:outline-none"
                          >
                            <option value="14">14-Gauge (2.0mm - Standard)</option>
                            <option value="16">16-Gauge (1.6mm - Economy)</option>
                            <option value="12">12-Gauge (2.5mm - Heavy Duty)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-0.5">Automation Motor:</label>
                          <select
                            value={calcMotor ? 'yes' : 'no'}
                            onChange={(e) => setCalcMotor(e.target.value === 'yes')}
                            className="w-full bg-[#0C1322] border border-stone-700 rounded px-2 py-1 text-stone-100 text-xs font-mono focus:border-brand-gold focus:outline-none"
                          >
                            <option value="yes">Italian Motor Included (+Rs. 48K)</option>
                            <option value="no">Manual Roller Only</option>
                          </select>
                        </div>
                      </div>

                      {/* Calculation Summary Box */}
                      <div className="bg-[#0C1322] p-2.5 rounded-lg border border-brand-light/30 space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between text-slate-300">
                          <span>Total Area:</span>
                          <span className="font-bold text-stone-100">{areaSqFt.toFixed(1)} Sq. Ft.</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Estimated Steel Weight:</span>
                          <span className="font-bold text-stone-100">~{estWeightKg} KG</span>
                        </div>
                        <div className="flex justify-between text-brand-gold pt-1 border-t border-stone-800 font-bold text-xs">
                          <span>Estimated Total Price:</span>
                          <span className="text-sm">Rs. {totalEstPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      <a
                        href={getWhatsAppUrl(`Hello Mughal Steel, I estimated a custom gate on your website:\n\nDimensions: ${calcWidth}ft Width × ${calcHeight}ft Height (${areaSqFt} sq.ft)\nGauge: ${calcGauge}-Gauge Steel\nEstimated Weight: ~${estWeightKg} KG\nEstimated Price: Rs. ${totalEstPrice.toLocaleString()}\nMotor: ${calcMotor ? 'Yes (Italian Motor)' : 'No (Manual)'}\n\nPlease confirm availability and booking.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold w-full text-center py-2 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-brand-dark" />
                        <span>Book This Estimate on WhatsApp</span>
                      </a>
                    </div>
                  )}

                  {/* Product Recommendation Card */}
                  {msg.productCard && (
                    <div className="bg-[#05080E] border border-brand-light/60 rounded-xl overflow-hidden shadow-lg p-2.5 space-y-2">
                      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black relative">
                        <img 
                          src={msg.productCard.frontImage || msg.productCard.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'} 
                          alt={msg.productCard.name}
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-2 left-2 bg-brand-dark/90 text-brand-gold text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                          {msg.productCard.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-heading font-black text-stone-100 text-xs uppercase truncate">
                          {msg.productCard.name}
                        </h4>
                        <span className="font-mono font-bold text-brand-gold text-xs shrink-0">
                          Rs. {(msg.productCard.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((qa, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickAction(qa.action, qa.payload)}
                          className="px-2.5 py-1.5 bg-[#0C1322] hover:bg-brand-gold hover:text-brand-dark border border-brand-light/60 hover:border-brand-gold text-slate-300 rounded-lg text-[10px] font-heading font-bold uppercase transition-all flex items-center gap-1 cursor-pointer shadow"
                        >
                          <span>{qa.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-500 font-mono block px-1">
                    {msg.timestamp}
                  </span>

                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-brand-gold text-brand-dark font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow">
                    U
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#0E1526] p-2.5 rounded-xl border border-brand-light/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#0C1322] border-t border-brand-light/50 shrink-0 space-y-2">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about gate prices, 14G vs 16G, designs, order..."
                className="flex-1 bg-[#05080E] border border-brand-light/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-slate-500 focus:outline-none focus:border-brand-gold transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-9 h-9 rounded-xl bg-brand-gold hover:brightness-110 disabled:opacity-40 text-brand-dark flex items-center justify-center transition cursor-pointer shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
              <span>Mughal Steel AI Assistant</span>
              <a 
                href={getWhatsAppUrl("Hello Mughal Steel, I would like to speak directly with an engineer.")}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Escalate to WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
