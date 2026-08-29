import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArchitecturalAuthBackground } from '../components/auth/ArchitecturalAuthBackground';
import { 
  User, Lock, Mail, Phone, Eye, EyeOff, 
  ArrowRight, AlertTriangle, CheckCircle, RefreshCw,
  Hammer, KeyRound, ArrowLeft, ShieldCheck, Sparkles
} from 'lucide-react';
import { apiRequest } from '../utils/api';

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, register, resetPasswordDirectly, isAuthenticated, isAdmin, error: authError } = useAuth();

  // Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Login & Register Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode with route if navigating directly to /register, /signup, etc.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setAuthMode('register');
    } else {
      setAuthMode('login');
    }
  }, [location.pathname]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location.state]);

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
        setSuccessMessage('Authentication verified. Redirecting to your portal...');
        const currentUser = JSON.parse(localStorage.getItem('ic_user') || '{}');
        const hasAdminRole = currentUser?.isAdmin === true || currentUser?.role === 'admin' || currentUser?.role === 'SuperAdmin';
        setTimeout(() => {
          if (hasAdminRole) {
            navigate('/admin', { replace: true });
          } else {
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
          }
        }, 400);
      } else {
        setErrorMessage(authError || 'Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

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
        setSuccessMessage('Account created successfully. Welcome to Mughal Steel!');
        setTimeout(() => {
          const from = (location.state as any)?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 500);
      } else {
        setErrorMessage(authError || 'Registration could not be completed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password specific fields
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  const getForgotStrength = (pass: string) => {
    if (!pass) return { label: 'None', color: 'bg-stone-700', percent: 0 };
    if (pass.length < 6) return { label: 'Too short (min 6)', color: 'bg-red-500', percent: 25 };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    if (score <= 1) return { label: 'Weak', color: 'bg-amber-500', percent: 40 };
    if (score === 2) return { label: 'Medium', color: 'bg-yellow-400', percent: 65 };
    if (score === 3) return { label: 'Good', color: 'bg-emerald-500', percent: 85 };
    return { label: 'Strong', color: 'bg-emerald-400', percent: 100 };
  };

  const forgotStrength = getForgotStrength(forgotNewPassword);

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
      setErrorMessage('Passwords do not match. Please verify New Password and Confirm Password.');
      setLoading(false);
      return;
    }

    try {
      // Instantly set and update the password
      await resetPasswordDirectly(cleanEmail, cleanPass);
      setPassword(cleanPass);
      setEmail(cleanEmail);
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setSuccessMessage('Password updated successfully! Your new password is set. You can now sign in.');
      setAuthMode('login');
    } catch {
      setErrorMessage('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        setSuccessMessage('Google sign-in verified. Redirecting...');
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
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

  return (
    <div className="min-h-screen bg-[#060911] text-stone-100 flex flex-col justify-between selection:bg-brand-gold selection:text-brand-dark relative font-sans overflow-hidden">
      
      {/* 1. ARCHITECTURAL ANIMATED BACKGROUND (Live Steel Laser Grid & Beams) */}
      <ArchitecturalAuthBackground />

      {/* 2. Top Header Navigation Link */}
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
          <span>256-Bit SSL Encrypted Session</span>
        </div>
      </div>

      {/* 3. MAIN CENTERED LOGIN / REGISTRATION CARD */}
      <div className="flex-grow flex items-center justify-center px-4 py-4 sm:py-8 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#0A101D]/90 border border-brand-gold/40 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.1)] backdrop-blur-xl my-auto transition-all duration-300">
          
          {/* Mughal Steel Branding & Logo */}
          <div className="text-center space-y-2 mb-6">
            <Link to="/" className="inline-flex items-center gap-3 group" title="Mughal Steel Home">
              <img 
                src="/mughal-steel-logo.png" 
                alt="Mughal Steel Fabrication" 
                className="h-16 sm:h-20 w-auto object-contain mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <div>
              <p className="text-[10px] sm:text-[10.5px] font-mono tracking-[0.22em] text-brand-gold uppercase font-bold mt-1 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Customer Experience Portal</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher: Sign In vs Create Account */}
          {authMode !== 'forgot' && (
            <div className="flex items-center p-1 bg-[#05080E]/90 rounded-xl border border-stone-800 mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-amber-500/25 via-brand-gold/25 to-yellow-500/25 text-brand-gold border border-brand-gold/50 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-amber-500/25 via-brand-gold/25 to-yellow-500/25 text-brand-gold border border-brand-gold/50 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-md">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-md">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN VIEW */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setErrorMessage(null); setSuccessMessage(null); }}
                    className="text-[11px] text-brand-gold hover:underline cursor-pointer transition font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-stone-700 bg-stone-900 text-brand-gold focus:ring-brand-gold focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-stone-400">Remember my session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark font-heading font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-dark" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. CREATE ACCOUNT VIEW */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="First Name"
                    className="w-full px-3.5 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold transition shadow-inner"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="Last Name"
                    className="w-full px-3.5 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold transition shadow-inner"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold transition shadow-inner"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold transition shadow-inner"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder="Min 6 chars"
                      className="w-full px-3 py-2.5 pr-8 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold transition shadow-inner"
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

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                    Confirm *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder="Repeat pass"
                      className="w-full px-3 py-2.5 pr-8 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold transition shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-500 hover:text-stone-300 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark font-heading font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-dark" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD VIEW */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              <div className="text-center pb-1">
                <h3 className="text-sm font-bold text-stone-200">Reset Your Password</h3>
                <p className="text-stone-400 text-xs mt-0.5">Enter your email and set your new account password.</p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  New Password *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    required
                    value={forgotNewPassword}
                    onChange={(e) => { setForgotNewPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="Min 6 chars"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {forgotNewPassword.length > 0 && (
                  <div className="space-y-1 pt-0.5">
                    <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${forgotStrength.color}`} style={{ width: `${forgotStrength.percent}%` }}></div>
                    </div>
                    <p className="text-[10px] text-stone-400 flex justify-between font-mono">
                      <span>Password strength:</span>
                      <span className="font-bold text-stone-300">{forgotStrength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showForgotConfirmPassword ? 'text' : 'password'}
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => { setForgotConfirmPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark font-heading font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.99] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-dark" />
                    <span>Processing Password Update...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Reset & Update Password</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-brand-gold transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* Social Sign-In Separator */}
          {authMode !== 'forgot' && (
            <div className="mt-5 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-800/90 w-full"></div>
                <span className="bg-[#0A101D] px-3 text-[10.5px] text-stone-500 font-mono uppercase tracking-widest shrink-0">
                  Or continue with
                </span>
                <div className="border-t border-stone-800/90 w-full"></div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={googleLoading || loading}
                className="w-full py-2.5 bg-[#070C15] hover:bg-[#0E1627] border border-stone-700/80 hover:border-brand-gold/50 text-stone-200 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {googleLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-gold" />
                    <span>Connecting Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            </div>
          )}

        </div>
      </div>

      {/* 4. Minimalist Footer */}
      <footer className="w-full py-4 px-6 border-t border-stone-800/80 bg-[#05080E]/90 text-center text-xs text-stone-500 relative z-10">
        <p>© {new Date().getFullYear()} Mughal Steel Fabrication. All rights reserved. • ISO 9001 Certified Quality</p>
      </footer>
    </div>
  );
};

export default CustomerLoginPage;
