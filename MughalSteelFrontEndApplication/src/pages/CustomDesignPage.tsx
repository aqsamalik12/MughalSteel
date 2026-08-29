import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Check, Save, Calculator, HelpCircle } from 'lucide-react';

export const CustomDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomDesign, addQuote } = useData();
  const { isAuthenticated } = useAuth();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Design state
  const [doorType, setDoorType] = useState('double'); // single, double, sidelights, transom, sidelights-transom
  const [width, setWidth] = useState(72);
  const [height, setHeight] = useState(96);
  const [configuration, setConfiguration] = useState('Standard Grid'); // Standard Grid, Arch Top, Minimalist, Traditional Scrolled
  const [swingDirection, setSwingDirection] = useState('Inswing - Right Hand');
  const [finish, setFinish] = useState('Matte Black');
  const [glass, setGlass] = useState('Rain');
  const [hardware, setHardware] = useState('Modern 60" Pull Bar');
  const [handle, setHandle] = useState('Solid Gold Anodized');
  const [threshold, setThreshold] = useState('Standard 1.5" Brass');
  const [notes, setNotes] = useState('');

  // Calculate pricing
  const [price, setPrice] = useState(3800);

  useEffect(() => {
    let basePrice = 2500;
    if (doorType === 'double') basePrice += 1800;
    if (doorType === 'sidelights') basePrice += 1500;
    if (doorType === 'transom') basePrice += 1200;
    if (doorType === 'sidelights-transom') basePrice += 2800;

    // Dimensions pricing
    const area = (width * height) / 144;
    basePrice += Math.round(area * 18);

    // Configuration pricing
    if (configuration === 'Arch Top') basePrice += 650;
    if (configuration === 'Traditional Scrolled') basePrice += 950;

    // Finishes
    if (finish === 'Oil Rubbed Bronze') basePrice += 350;
    if (finish === 'Satin Gold') basePrice += 450;

    // Hardware
    if (hardware.includes('Smart') || hardware.includes('60"')) basePrice += 300;

    setPrice(basePrice);
  }, [doorType, width, height, configuration, finish, hardware]);

  const steps = [
    { num: 1, title: 'Door Style' },
    { num: 2, title: 'Dimensions' },
    { num: 3, title: 'Frame Config' },
    { num: 4, title: 'Finish Coating' },
    { num: 5, title: 'Glass Selection' },
    { num: 6, title: 'Hardware' },
    { num: 7, title: 'Additional Options' },
    { num: 8, title: 'Final Review' }
  ];

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveDesign = () => {
    addCustomDesign({
      doorType,
      width,
      height,
      configuration,
      swingDirection,
      finish,
      glass,
      hardware,
      handle,
      estimatedPrice: price
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (!isAuthenticated) {
        navigate('/account'); // guide to register/login to view saved designs
      }
    }, 2000);
  };

  const handleRequestQuote = () => {
    addQuote({
      customer: {
        firstName: 'Guest',
        lastName: 'Designer',
        email: 'mughalsteelfabrication51@gmail.com',
        phone: '0323-9898317',
        address: 'Saved Custom Design',
        city: 'Islamabad',
        state: 'Punjab / ICT',
        zip: '46000'

      },
      projectType: 'Bespoke Custom Designer',
      productCategory: 'Custom Door Design',
      doorStyle: `Bespoke ${configuration} (${doorType})`,
      dimensions: {
        width: String(width),
        height: String(height),
        qty: 1
      },
      configuration: `${swingDirection} | Threshold: ${threshold}`,
      finish,
      glass,
      hardware: `${hardware} (${handle})`,
      attachments: ['custom_design_wizard.json'],
      notes: notes || 'Submitted directly from the IronCraft Online Custom Designer Wizard.'
    });
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      navigate('/account/quotes');
    }, 2000);
  };

  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em]">IronCraft Lab</span>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-100 uppercase tracking-widest">Architectural Door Designer</h1>
          <p className="text-stone-400 text-xs max-w-md mx-auto leading-relaxed">
            Configure your bespoke steel or iron entryway. Toggle door options to watch the visual frame layout update in real time.
          </p>
        </div>

        {/* Steps Progress Indicator */}
        <div className="hidden lg:flex items-center justify-between border-y border-brand-light/75 py-4 px-2">
          {steps.map((s) => (
            <div 
              key={s.num} 
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center space-x-2 cursor-pointer transition-colors ${currentStep === s.num ? 'text-brand-gold font-bold' : currentStep > s.num ? 'text-stone-400' : 'text-stone-600 hover:text-stone-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${currentStep === s.num ? 'border-brand-gold bg-brand-gold text-brand-dark' : 'border-stone-700'}`}>
                {currentStep > s.num ? <Check className="w-3 h-3 text-brand-gold" /> : s.num}
              </span>
              <span className="text-[10px] uppercase tracking-wider">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Visual Mockup Illustration */}
          <div className="lg:col-span-5 bg-brand-medium border border-brand-light p-8 flex flex-col justify-between items-center min-h-[450px] relative rounded">
            <span className="absolute top-4 left-4 text-[10px] text-stone-500 uppercase tracking-widest">Interactive Frame Mockup</span>
            <span className="absolute top-4 right-4 text-xs font-serif text-brand-gold font-bold">${price.toLocaleString()}</span>

            {/* Simulated Door Illustration Canvas */}
            <div className="flex-1 w-full flex items-center justify-center py-10">
              <div className="relative border-4 border-stone-850 p-2 bg-brand-dark/40 flex items-stretch space-x-1" style={{ width: doorType.includes('double') ? '170px' : '100px', height: '240px' }}>
                
                {/* Transom Frame on Top */}
                {doorType.includes('transom') && (
                  <div className="absolute -top-12 inset-x-0 h-10 border-2 border-stone-800 bg-brand-medium/50 flex items-center justify-center">
                    <span className="text-[8px] text-stone-500 uppercase">Transom</span>
                  </div>
                )}

                {/* Sidelight Left */}
                {doorType.includes('sidelights') && (
                  <div className="w-6 border border-stone-800 bg-brand-medium/30 flex items-center justify-center">
                    <span className="text-[7px] text-stone-500 origin-center -rotate-90">Sidelight</span>
                  </div>
                )}

                {/* Door Panel(s) */}
                <div className="flex-1 border-2 border-brand-gold/60 relative flex bg-brand-dark/80 overflow-hidden">
                  
                  {/* Grid Muntin Lines based on configuration */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-4 gap-1 opacity-20 border border-brand-light">
                    {[...Array(8)].map((_, i) => <div key={i} className="border border-brand-light/40"></div>)}
                  </div>

                  {/* Handles */}
                  <div className={`absolute top-1/2 -translate-y-1/2 w-1 h-14 bg-brand-gold rounded ${swingDirection.includes('Right') ? 'right-2' : 'left-2'}`} />

                  {/* Double Door Split Line */}
                  {doorType === 'double' && (
                    <div className="absolute inset-y-0 left-1/2 w-[2px] bg-brand-gold/50" />
                  )}

                  <div className="absolute inset-x-2 bottom-2 text-center">
                    <span className="text-[7px] text-stone-500 uppercase tracking-widest truncate block">
                      {finish} | {glass}
                    </span>
                  </div>
                </div>

                {/* Sidelight Right */}
                {doorType.includes('sidelights') && (
                  <div className="w-6 border border-stone-800 bg-brand-medium/30 flex items-center justify-center">
                    <span className="text-[7px] text-stone-500 origin-center rotate-90">Sidelight</span>
                  </div>
                )}

              </div>
            </div>

            {/* Spec tags quick check */}
            <div className="w-full text-center text-[10px] text-stone-550 border-t border-brand-light/40 pt-4 uppercase tracking-widest space-y-1">
              <p>Type: <span className="text-stone-300 font-bold">{doorType}</span> | Configuration: <span className="text-stone-300 font-bold">{configuration}</span></p>
              <p>Dimensions: <span className="text-stone-300 font-bold">{width}"W x {height}"H</span></p>
            </div>
          </div>

          {/* Right Block: Active Step Inputs */}
          <div className="lg:col-span-7 bg-brand-medium border border-brand-light p-8 flex flex-col justify-between rounded shadow-premium">
            
            {/* Step Content */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-brand-light pb-3">
                <h3 className="text-base font-serif text-stone-200 uppercase tracking-wider font-bold">
                  Step {currentStep}: {steps[currentStep-1].title}
                </h3>
                <span className="text-[10px] text-stone-500 uppercase font-bold">Step {currentStep} of 8</span>
              </div>

              {/* STEP 1: Door Style Select */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 leading-relaxed">Select the base architectural frame configuration layout:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'single', name: 'Single Entrance Door', desc: 'Standard single pivoting or swinging panel entry.' },
                      { id: 'double', name: 'Double Entry Doors', desc: 'Classic double swinging panels for grand openings.' },
                      { id: 'sidelights', name: 'Single Door + Sidelights', desc: 'Add narrow glass side frames to maximize foyer light.' },
                      { id: 'transom', name: 'Double Door + Transom Window', desc: 'Add a semicircular arch or rectangular pane overhead.' },
                      { id: 'sidelights-transom', name: 'Double + Sidelights + Transom', desc: 'The ultimate luxury estate entryway configuration.' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDoorType(d.id)}
                        className={`text-left p-4 border rounded transition-all flex flex-col justify-between h-28 ${doorType === d.id ? 'border-brand-gold bg-brand-dark/40' : 'border-stone-800 bg-brand-dark/10 hover:border-brand-gold/40'}`}
                      >
                        <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">{d.name}</span>
                        <span className="text-[10px] text-stone-500 leading-normal mt-1">{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Dimensions */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <p className="text-xs text-stone-400 leading-relaxed">Specify the width and height requirements. Base rates scale accordingly:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-stone-300 font-bold uppercase tracking-wider">Width: {width} inches</span>
                        <span className="text-stone-500">Min 36" &ndash; Max 144"</span>
                      </div>
                      <input 
                        type="range" min={36} max={144} value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full accent-brand-gold bg-brand-dark h-1.5 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-stone-300 font-bold uppercase tracking-wider">Height: {height} inches</span>
                        <span className="text-stone-500">Min 80" &ndash; Max 120"</span>
                      </div>
                      <input 
                        type="range" min={80} max={120} value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full accent-brand-gold bg-brand-dark h-1.5 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-brand-dark/40 border border-brand-light/35 p-4 rounded text-[11px] text-stone-500 leading-relaxed flex items-start space-x-2">
                    <HelpCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Rough openings should exceed frame dimensions by 0.5" in width and height to ensure leveling shim adjustments.</span>
                  </div>
                </div>
              )}

              {/* STEP 3: Frame Configuration */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 leading-relaxed">Choose grid patterns, muntins, and swing handings:</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">Grid Design</label>
                      <select 
                        value={configuration}
                        onChange={(e) => setConfiguration(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-light text-xs px-2 py-2.5 text-stone-200"
                      >
                        <option value="Standard Grid">Standard Horizontal Grid</option>
                        <option value="Arch Top">Arch Top (Semicircular Grids)</option>
                        <option value="Minimalist">Minimalist (Large Glass Area)</option>
                        <option value="Traditional Scrolled">Traditional Wrought Iron Scrolls</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">Swing Handing</label>
                      <select 
                        value={swingDirection}
                        onChange={(e) => setSwingDirection(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-light text-xs px-2 py-2.5 text-stone-200"
                      >
                        <option value="Inswing - Right Hand">Inswing - Right Hand Active</option>
                        <option value="Inswing - Left Hand">Inswing - Left Hand Active</option>
                        <option value="Outswing - Right Hand">Outswing - Right Hand Active</option>
                        <option value="Outswing - Left Hand">Outswing - Left Hand Active</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Finish */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 leading-relaxed">Select hand-finished weathercoat paint finish options:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Matte Black', desc: 'Modern powder coat, low gloss. Matches black aluminum window trim.' },
                      { name: 'Oil Rubbed Bronze', desc: 'Copper highlights. Complements traditional stucco/brick exteriors.' },
                      { name: 'Aged Pewter', desc: 'Textured steel sheen finish. Complements historic cottages.' },
                      { name: 'Satin Gold', desc: 'Luxury golden lacquer. For bold modern statement entrances.' }
                    ].map((f) => (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => setFinish(f.name)}
                        className={`text-left p-4 border rounded flex flex-col justify-between h-24 ${finish === f.name ? 'border-brand-gold bg-brand-dark/45' : 'border-stone-800 bg-brand-dark/10'}`}
                      >
                        <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">{f.name}</span>
                        <span className="text-[10px] text-stone-500 mt-1">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Glass */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 leading-relaxed">Choose insulated dual-pane tempered glass filters:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Rain', desc: 'Vertical moisture pattern. Extremely high privacy rating.' },
                      { name: 'Frosted', desc: 'Matte satin white translucent. Excellent privacy, high diffused light.' },
                      { name: 'Clear Low-E', desc: 'Completely clear glass pane. Blocks thermal heat UV transfer.' },
                      { name: 'Aquatex', desc: 'Textured scale ripples. Classic wrought iron door pairing.' }
                    ].map((g) => (
                      <button
                        key={g.name}
                        type="button"
                        onClick={() => setGlass(g.name)}
                        className={`text-left p-4 border rounded flex flex-col justify-between h-24 ${glass === g.name ? 'border-brand-gold bg-brand-dark/45' : 'border-stone-800 bg-brand-dark/10'}`}
                      >
                        <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">{g.name}</span>
                        <span className="text-[10px] text-stone-500 mt-1">{g.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Hardware */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 leading-relaxed">Choose locksets and heavy entry handles:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Modern 60" Pull Bar', desc: 'Oversized vertical bar.' },
                      { name: 'Traditional Lockset', desc: 'Thumb latch + deadbolt.' },
                      { name: 'Smart BioLock', desc: 'Biometric fingerprint lock.' }
                    ].map((h) => (
                      <button
                        key={h.name}
                        type="button"
                        onClick={() => setHardware(h.name)}
                        className={`text-left p-3.5 border rounded flex flex-col justify-between h-28 ${hardware === h.name ? 'border-brand-gold bg-brand-dark/45' : 'border-stone-800 bg-brand-dark/10'}`}
                      >
                        <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">{h.name}</span>
                        <span className="text-[10px] text-stone-550 leading-snug mt-1">{h.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">Handle Metal Coating</label>
                    <select 
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-light text-xs px-2 py-2 text-stone-200"
                    >
                      <option value="Solid Gold Anodized">Solid Gold Anodized Brass</option>
                      <option value="Satin Steel">Satin Stainless Steel</option>
                      <option value="Matte Black">Matte Black Powder Coat</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 7: Additional Options */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 leading-relaxed">Final mechanical selections and builder notes:</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">Threshold Profile</label>
                      <select 
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-light text-xs px-2 py-2 text-stone-200"
                      >
                        <option value="Standard 1.5&quot; Brass">Standard 1.5" Brass Sweep</option>
                        <option value="ADA Low Profile">ADA Compliant Low Profile (0.5")</option>
                        <option value="None">None (Slab floor install)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">Builder Design Notes</label>
                    <textarea 
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add concrete structural offsets, custom glass grill requests, or specific locking prep codes..."
                      className="w-full bg-brand-dark border border-brand-light text-xs px-3 py-2 text-stone-200"
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: Final Review */}
              {currentStep === 8 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 leading-relaxed">Review your custom specifications. You can save this design or submit it immediately for an official quote:</p>
                  
                  <div className="bg-brand-dark border border-brand-light/40 p-5 rounded text-xs space-y-2 grid grid-cols-2 gap-x-6">
                    <div className="col-span-2 text-brand-gold border-b border-brand-light pb-2 mb-2 font-serif font-bold tracking-wider uppercase">Specification Sheet</div>
                    
                    <div className="text-stone-500">Door Frame:</div>
                    <div className="text-stone-300 font-bold uppercase">{doorType}</div>
                    
                    <div className="text-stone-500">Dimensions:</div>
                    <div className="text-stone-300 font-bold">{width}"W x {height}"H</div>
                    
                    <div className="text-stone-500">Grid Style:</div>
                    <div className="text-stone-300 font-bold">{configuration}</div>
                    
                    <div className="text-stone-500">Frame Coating:</div>
                    <div className="text-stone-300 font-bold">{finish}</div>
                    
                    <div className="text-stone-500">Glass Type:</div>
                    <div className="text-stone-300 font-bold">{glass}</div>
                    
                    <div className="text-stone-500">Lock & Handle:</div>
                    <div className="text-stone-300 font-bold">{hardware} ({handle})</div>

                    <div className="text-stone-500">Threshold Sweep:</div>
                    <div className="text-stone-300 font-bold">{threshold}</div>
                  </div>

                  {saveSuccess && (
                    <p className="text-brand-gold font-bold text-center text-xs animate-pulse">Design saved successfully! View it in your Customer Account Dashboard.</p>
                  )}
                  {quoteSuccess && (
                    <p className="text-brand-gold font-bold text-center text-xs animate-pulse">Quote submitted successfully! Redirecting to tracking queue...</p>
                  )}
                </div>
              )}

            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-brand-light/60 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="btn-outline flex items-center space-x-2 text-[10px] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStep < 8 ? (
                <button
                  onClick={handleNext}
                  className="btn-gold flex items-center space-x-2 text-[10px]"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveDesign}
                    className="btn-outline flex items-center space-x-1.5 text-[10px]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Design</span>
                  </button>
                  <button
                    onClick={handleRequestQuote}
                    className="btn-gold flex items-center space-x-1.5 text-[10px]"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Request Quote</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default CustomDesignPage;
