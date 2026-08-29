import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArchitecturalAuthBackground } from '../components/auth/ArchitecturalAuthBackground';
import { Lock, CheckCircle, AlertTriangle, Eye, EyeOff, RefreshCw, ArrowLeft, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { verifyResetCode, confirmPasswordReset } = useAuth();

  // Extract oobCode from query parameters or hash
  const oobCode = searchParams.get('oobCode') || searchParams.get('code') || '';

  const [email, setEmail] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<boolean>(Boolean(oobCode));
  const [codeValid, setCodeValid] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Verify code on mount if present
  useEffect(() => {
    window.scrollTo(0, 0);

    if (oobCode) {
      setVerifying(true);
      verifyResetCode(oobCode)
        .then((userEmail) => {
          setEmail(userEmail);
          setCodeValid(true);
        })
        .catch((err) => {
          setCodeValid(false);
          setErrorMsg(err?.message || 'This password reset link is invalid or has expired. Please request a new one.');
        })
        .finally(() => {
          setVerifying(false);
        });
    } else {
      setVerifying(false);
      setCodeValid(false);
    }
  }, [oobCode, verifyResetCode]);

  // Calculate password strength
  const getPasswordStrength = (pass: string): { label: string; color: string; percent: number } => {
    if (!pass) return { label: 'None', color: 'bg-stone-700', percent: 0 };
    if (pass.length < 6) return { label: 'Too short', color: 'bg-red-500', percent: 25 };
    
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

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPass = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (cleanPass.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setErrorMsg('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (!oobCode) {
      setErrorMsg('No valid reset token found in URL.');
      return;
    }

    setSubmitting(true);

    try {
      const success = await confirmPasswordReset(oobCode, cleanPass);
      if (success) {
        setSuccessMsg('Your password has been successfully updated! Redirecting to login...');
        setTimeout(() => {
          if (location.pathname.includes('admin') || (email && email.toLowerCase().startsWith('admin'))) {
            navigate('/admin/login', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        }, 1800);
      } else {
        setErrorMsg('Failed to update password. Please try requesting a new reset link.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while resetting your password.');
    } finally {
      setSubmitting(false);
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
          <span>Security Reset Gateway</span>
        </div>
      </div>

      {/* 3. CENTERED RESET PASSWORD CARD */}
      <div className="flex-grow flex items-center justify-center px-4 py-4 sm:py-8 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#0A101D]/90 border border-brand-gold/40 rounded-2xl p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.1)] backdrop-blur-xl my-auto transition-all duration-300 space-y-6">
          
          {/* Header / Logo */}
          <div className="text-center space-y-2.5">
            <Link to="/" className="inline-block group" title="Mughal Steel Home">
              <img 
                src="/mughal-steel-logo.png" 
                alt="Mughal Steel Fabrication" 
                className="h-16 sm:h-20 w-auto object-contain mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div>
              <p className="text-[10px] sm:text-[10.5px] text-brand-gold font-mono uppercase tracking-[0.22em] font-bold mt-1 flex items-center justify-center gap-1.5">
                <KeyRound className="w-3 h-3" />
                <span>Create New Account Password</span>
              </p>
            </div>
          </div>

          {/* STATE 1: VERIFYING TOKEN */}
          {verifying && (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-gold animate-spin mx-auto" />
              <p className="text-xs text-stone-300 font-medium">Verifying password reset security link...</p>
            </div>
          )}

          {/* STATE 2: TOKEN EXPIRED OR MISSING */}
          {!verifying && !codeValid && !successMsg && (
            <div className="space-y-5">
              <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start space-x-2.5 shadow-md">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-red-200">Invalid or Expired Link</p>
                  <p className="leading-relaxed text-stone-300">{errorMsg || 'No reset token was found in the URL, or the link has already expired.'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark font-heading font-bold text-xs uppercase tracking-wider rounded-xl text-center hover:brightness-110 transition shadow-md flex items-center justify-center gap-2"
                >
                  <span>Request Reset for Customer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/admin/login"
                  className="w-full py-2.5 bg-[#070C15] border border-stone-700 text-stone-300 hover:text-brand-gold hover:border-brand-gold font-heading font-bold text-xs uppercase tracking-wider rounded-xl text-center transition"
                >
                  <span>Request Reset for Admin</span>
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: TOKEN VALID - FORM TO INPUT NEW PASSWORD */}
          {!verifying && codeValid && !successMsg && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {email && (
                <div className="text-center bg-[#060911] border border-stone-800 p-2.5 rounded-xl">
                  <p className="text-[11px] text-stone-400">Resetting credentials for</p>
                  <p className="text-xs font-mono font-bold text-brand-gold">{email}</p>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-950/60 border border-red-500/50 p-3 rounded-xl text-red-300 text-xs flex items-start space-x-2.5 shadow-md animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); if (errorMsg) setErrorMsg(null); }}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${strength.color}`} 
                        style={{ width: `${strength.percent}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-stone-400 flex justify-between font-mono">
                      <span>Password strength:</span>
                      <span className="font-bold text-stone-300">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (errorMsg) setErrorMsg(null); }}
                    placeholder="Re-type new password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#060911]/90 border border-stone-700/90 rounded-xl text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark font-heading font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-brand-gold/20 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-dark" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STATE 4: SUCCESS */}
          {successMsg && (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-stone-100">Password Updated Successfully!</h3>
                <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                  Your new credentials are active. You can now log into your account securely.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 py-2 px-5 bg-gradient-to-r from-amber-500 via-brand-gold to-yellow-500 text-brand-dark text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
                >
                  <span>Proceed to Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          <div className="text-center pt-2 border-t border-stone-800/80">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-brand-gold transition cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 4. Minimalist Footer */}
      <footer className="w-full py-4 px-6 border-t border-stone-800/80 bg-[#05080E]/90 text-center text-xs text-stone-500 relative z-10">
        <p>© {new Date().getFullYear()} Mughal Steel Fabrication. All rights reserved. • ISO 9001 Certified Security</p>
      </footer>
    </div>
  );
};

export default ResetPasswordPage;
