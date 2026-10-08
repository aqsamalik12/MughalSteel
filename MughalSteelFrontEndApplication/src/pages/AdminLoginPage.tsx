import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArchitecturalAuthBackground } from '../components/auth/ArchitecturalAuthBackground';
import { Lock, Mail, AlertTriangle, CheckCircle, Eye, EyeOff, RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { handleImageError } from '../utils/imageFallback';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin, isAuthenticated, logout, error: authError } = useAuth();

  const [email, setEmail] = useState('mughalsteelfabrication51@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Please provide both your administrator email and password.');
      setLoading(false);
      return;
    }

    try {
      const success = await login(cleanEmail, cleanPass);
      
      if (success) {
        // Double-check admin privilege status
        const currentUser = JSON.parse(localStorage.getItem('ic_user') || '{}');
        const hasAdminRole = currentUser?.isAdmin === true || currentUser?.role === 'admin' || currentUser?.role === 'SuperAdmin';
        
        if (hasAdminRole || isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          logout();
          setErrorMsg('Access Denied: This account is not authorized for Administrator access.');
        }
      } else {
        setErrorMsg(authError || 'Invalid email or password. Please verify your administrator credentials.');
      }
    } catch {
      setErrorMsg('Login failed. Please check your credentials or network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-stone-100 flex flex-col justify-between selection:bg-brand-gold selection:text-brand-dark relative font-sans overflow-hidden">
      
      {/* 1. ARCHITECTURAL ANIMATED BACKGROUND */}
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
          <span>Admin Security Gateway</span>
        </div>
      </div>

      {/* 3. CENTERED ADMIN CARD */}
      <div className="flex-grow flex items-center justify-center px-4 py-4 sm:py-8 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#0A101D]/90 border border-brand-gold/40 rounded-2xl p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.1)] backdrop-blur-xl my-auto transition-all duration-300 space-y-6">
          
          {/* Header / Logo */}
          <div className="text-center space-y-2.5">
            <Link to="/" className="inline-block group" title="Mughal Steel Home">
              <img 
                src="/mughal-steel-logo.png" 
                alt="Mughal Steel Fabrication" 
                onError={handleImageError}
                className="h-16 sm:h-20 w-auto object-contain mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div>
              <p className="text-[10px] sm:text-[10.5px] text-brand-gold font-mono uppercase tracking-[0.22em] font-bold mt-1 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Authorized Administrator Portal</span>
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-500/50 p-3 rounded-xl text-red-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200 shadow-md">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl text-emerald-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200 shadow-md">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errorMsg) setErrorMsg(null); }}
                    placeholder="mughalsteelfabrication51@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errorMsg) setErrorMsg(null); }}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark font-heading font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-brand-gold/20 mt-2 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-dark" />
                    <span>Authenticating Admin...</span>
                  </>
                ) : (
                  <span>Secure Admin Login</span>
                )}
              </button>

              <p className="text-[11px] text-stone-400 text-center font-mono pt-1">
                Admin email &amp; password can be changed inside Dashboard → Global Settings.
              </p>
            </form>

          <div className="text-center pt-2 border-t border-stone-800/80">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-brand-gold transition cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch to Customer Login</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 4. Minimalist Footer */}
      <footer className="w-full py-4 px-6 border-t border-stone-800/80 bg-[#05080E]/90 text-center text-xs text-stone-500 relative z-10">
        <p>© {new Date().getFullYear()} Mughal Steel Fabrication. Authorized Staff Only.</p>
      </footer>
    </div>
  );
};

export default AdminLoginPage;
