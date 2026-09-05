import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArchitecturalAuthBackground } from '../components/auth/ArchitecturalAuthBackground';
import { 
  User, Lock, Mail, Eye, EyeOff, 
  ArrowRight, AlertTriangle, CheckCircle, RefreshCw,
  ArrowLeft, ShieldCheck, Sparkles, ChevronDown, ChevronUp, KeyRound
} from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, register, resetPasswordDirectly, isAuthenticated, isAdmin, error: authError } = useAuth();

  // Mode: 'google' | 'email_login' | 'email_register' | 'forgot'
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [emailMode, setEmailMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getTargetDestination = (isAdminUser: boolean) => {
    if (isAdminUser) return '/admin';
    const stateFrom = (location.state as any)?.from;
    if (stateFrom) {
      if (typeof stateFrom === 'string' && stateFrom !== '/login' && stateFrom !== '/register' && stateFrom !== '/signin') {
        return stateFrom;
      }
      if (stateFrom.pathname && stateFrom.pathname !== '/login' && stateFrom.pathname !== '/register' && stateFrom.pathname !== '/signin') {
        return stateFrom.pathname + (stateFrom.search || '') + (stateFrom.hash || '');
      }
    }
    return '/account';
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getTargetDestination(isAdmin), { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location.state]);

  // Google 1-Click Sign-In
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        const dest = getTargetDestination(isAdmin);
        const isCheckout = dest.includes('/checkout');
        setSuccessMessage(isCheckout ? 'Signed in! Returning to checkout...' : 'Signed in with Google successfully! Redirecting...');
        setTimeout(() => {
          navigate(dest, { replace: true });
        }, 300);
      } else {
        if (authError) {
          setErrorMessage(authError);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Email Sign In
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage('Please enter both your email address and password.');
      setLoading(false);
      return;
    }

    try {
      const success = await login(cleanEmail, cleanPass);
      if (success) {
        const currentUser = JSON.parse(localStorage.getItem('ic_user') || '{}');
        const hasAdminRole = currentUser?.isAdmin === true || currentUser?.role === 'admin' || currentUser?.role === 'SuperAdmin';
        const dest = getTargetDestination(hasAdminRole);
        const isCheckout = dest.includes('/checkout');
        setSuccessMessage(isCheckout ? 'Sign in successful! Returning to checkout...' : 'Sign in successful! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate(dest, { replace: true });
        }, 300);
      } else {
        setErrorMessage(authError || 'Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Email Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPass = password.trim();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanPhone = phone.trim();

    if (!cleanFirst || !cleanLast) {
      setErrorMessage('Please enter your full first and last name.');
      setLoading(false);
      return;
    }

    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (cleanPass.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      setLoading(false);
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      setLoading(false);
      return;
    }

    try {
      const success = await register(cleanEmail, cleanFirst, cleanLast, cleanPhone, cleanPass);
      if (success) {
        setSuccessMessage('Account created successfully! Welcome to Mughal Steel.');
        const dest = getTargetDestination(false);
        setTimeout(() => {
          navigate(dest, { replace: true });
        }, 350);
      } else {
        setErrorMessage(authError || 'Registration could not be completed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Direct Password Reset
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = forgotNewPassword.trim();
    const cleanConfirm = forgotConfirmPassword.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      setLoading(false);
      return;
    }

    if (cleanPass.length < 6) {
      setErrorMessage('New password must be at least 6 characters in length.');
      setLoading(false);
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await resetPasswordDirectly(cleanEmail, cleanPass);
      setPassword(cleanPass);
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setSuccessMessage('Password updated successfully! You can now sign in with your new password.');
      setEmailMode('login');
    } catch {
      setErrorMessage('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-stone-100 flex flex-col justify-between selection:bg-brand-gold selection:text-brand-dark relative font-sans overflow-hidden">
      
      {/* 1. Architectural Ambient Background */}
      <ArchitecturalAuthBackground />

      {/* 2. Top Header Navigation Bar */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-stone-300 hover:text-brand-gold text-xs font-heading font-bold uppercase tracking-wider transition group px-3 py-1.5 rounded-lg bg-black/30 border border-brand-light/40 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Storefront</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-brand-gold/80 bg-black/30 border border-brand-gold/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
          <span>Customer Portal • 256-Bit SSL</span>
        </div>
      </div>

      {/* 3. Main Center Card: Simple & Focused on Google Sign-In */}
      <div className="flex-grow flex items-center justify-center px-4 py-6 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#0A101D]/90 border border-brand-gold/40 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.12)] backdrop-blur-xl my-auto transition-all duration-300 space-y-5">
          
          {/* Mughal Steel Branding */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block group" title="Mughal Steel Home">
              <img 
                src="/mughal-steel-logo.png" 
                alt="Mughal Steel Fabrication" 
                className="h-16 sm:h-20 w-auto object-contain mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <div>
              <p className="text-[10.5px] font-mono tracking-[0.22em] text-brand-gold uppercase font-bold mt-1 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>{(location.state as any)?.from ? 'Authentication Required' : 'Customer Dashboard Access'}</span>
              </p>
              <h2 className="text-xl font-heading font-black text-stone-100 uppercase tracking-wide mt-1">
                {(location.state as any)?.from ? 'Sign In to Proceed' : 'Welcome to Mughal Steel'}
              </h2>
              <p className="text-stone-400 text-xs mt-1">
                {(location.state as any)?.from 
                  ? 'Please sign in with Google or your email to continue directly with your purchase.' 
                  : 'Sign in to view your quotes, orders, custom designs, and delivery updates.'}
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-md">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-md">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PRIMARY 1-CLICK ACTION: GOOGLE SIGN-IN */}
          {/* ------------------------------------------------------------- */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full py-3.5 px-4 bg-[#0E1627] hover:bg-[#152037] border-2 border-brand-gold/60 hover:border-brand-gold text-stone-100 text-sm font-heading font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-brand-gold/10 hover:shadow-brand-gold/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {googleLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-brand-gold" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-stone-500 font-sans">
              Instant 1-click access to your Mughal Steel account
            </p>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* COLLAPSIBLE EMAIL OPTION */}
          {/* ------------------------------------------------------------- */}
          <div className="pt-2 border-t border-stone-800/90">
            <button
              type="button"
              onClick={() => {
                setShowEmailSection(!showEmailSection);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full flex items-center justify-between text-xs text-stone-400 hover:text-brand-gold py-1 transition cursor-pointer"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider">
                {showEmailSection ? 'Hide email options' : 'Or sign in with email & password'}
              </span>
              {showEmailSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showEmailSection && (
              <div className="mt-4 pt-3 border-t border-stone-800/80 space-y-4 animate-in fade-in duration-200">
                {/* Sub-mode selector */}
                <div className="flex items-center p-1 bg-[#05080E] rounded-lg border border-stone-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setEmailMode('login'); setErrorMessage(null); }}
                    className={`flex-1 py-1.5 font-bold uppercase tracking-wider rounded transition cursor-pointer ${
                      emailMode === 'login' ? 'bg-brand-gold text-brand-dark' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmailMode('register'); setErrorMessage(null); }}
                    className={`flex-1 py-1.5 font-bold uppercase tracking-wider rounded transition cursor-pointer ${
                      emailMode === 'register' ? 'bg-brand-gold text-brand-dark' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Email Sign In Form */}
                {emailMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full px-3 py-2 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">Password</label>
                        <button
                          type="button"
                          onClick={() => setEmailMode('forgot')}
                          className="text-[10.5px] text-brand-gold hover:underline cursor-pointer"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 pr-9 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-500 hover:text-stone-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-brand-gold text-brand-dark font-heading font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Sign In with Email'}
                    </button>
                  </form>
                )}

                {/* Email Register Form */}
                {emailMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">First Name</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">Last Name</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">Password</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">Confirm</label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat pass"
                          className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-brand-gold text-brand-dark font-heading font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                  </form>
                )}

                {/* Email Forgot Form */}
                {emailMode === 'forgot' && (
                  <form onSubmit={handleForgotSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">Registered Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">New Password</label>
                        <input
                          type="password"
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider">Confirm</label>
                        <input
                          type="password"
                          required
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="Repeat"
                          className="w-full px-2.5 py-1.5 bg-[#060911] border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-brand-gold text-brand-dark font-heading font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Set New Password'}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setEmailMode('login')}
                        className="text-[11px] text-stone-400 hover:text-brand-gold cursor-pointer"
                      >
                        Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* ADMIN LINK AT BOTTOM */}
          {/* ------------------------------------------------------------- */}
          <div className="pt-2 text-center border-t border-stone-800/80">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-brand-gold transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Store Administrator? Sign in to Admin Panel</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 4. Minimal Footer */}
      <footer className="w-full py-4 px-6 border-t border-stone-800/80 bg-[#05080E]/90 text-center text-xs text-stone-500 relative z-10">
        <p>© {new Date().getFullYear()} Mughal Steel Fabrication • Customer Experience Portal</p>
      </footer>
    </div>
  );
};

export default CustomerLoginPage;
