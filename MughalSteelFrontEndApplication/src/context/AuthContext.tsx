import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Address } from '../types';
import { apiRequest } from '../utils/api';
import { firebaseAuthService } from '../services/firebaseAuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, firstName: string, lastName: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<boolean>;
  resetPasswordDirectly: (email: string, newPass: string) => Promise<boolean>;
  verifyResetCode: (code: string) => Promise<string>;
  confirmPasswordReset: (code: string, newPass: string) => Promise<boolean>;
  updateProfile: (firstName: string, lastName: string, phone: string) => Promise<boolean>;
  addAddress: (address: Address) => Promise<boolean>;
  removeAddress: (index: number) => Promise<boolean>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('ic_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync / verify profile from Backend API
  const refreshProfileFromApi = useCallback(async () => {
    const token = localStorage.getItem('ic_token') || localStorage.getItem('ms_token');
    if (!token) return;
    try {
      const res = await apiRequest('/api/auth/profile');
      if (res && res.success && res.user) {
        const u = res.user;
        const mappedUser: User = {
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone || '',
          addresses: (u.addresses || []).map((a: any) => ({
            street: a.street,
            city: a.city,
            state: a.state,
            zip: a.zipCode || a.zip,
            country: a.country
          })),
          isAdmin: u.role === 'SuperAdmin' || u.role === 'Manager' || u.role === 'Admin' || u.role === 'admin'
        };
        setUser(mappedUser);
        localStorage.setItem('ic_user', JSON.stringify(mappedUser));
      }
    } catch {
      // Backend not currently reachable or token expired
    }
  }, []);

  useEffect(() => {
    // 1. Initial cached session validation
    try {
      const savedUser = localStorage.getItem('ic_user');
      const savedToken = localStorage.getItem('ic_token') || localStorage.getItem('ms_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        refreshProfileFromApi();
      }
    } catch {
      // ignore parse errors
    }

    // 2. Subscribe to Firebase Auth state
    const unsubscribe = firebaseAuthService.onAuthStateChange((fbUser, fbToken) => {
      if (fbUser && fbToken) {
        localStorage.setItem('ic_token', fbToken);
        localStorage.setItem('ms_token', fbToken);
        try {
          const currentLocal = JSON.parse(localStorage.getItem('ic_user') || '{}');
          const mergedUser: User = {
            ...fbUser,
            displayName: fbUser.displayName || currentLocal.displayName,
            photoURL: fbUser.photoURL || currentLocal.photoURL,
            phone: fbUser.phone || currentLocal.phone || '',
            addresses: (currentLocal.addresses && currentLocal.addresses.length > 0) ? currentLocal.addresses : fbUser.addresses,
            isAdmin: fbUser.isAdmin || currentLocal.isAdmin
          };
          setUser(mergedUser);
          localStorage.setItem('ic_user', JSON.stringify(mergedUser));
        } catch {
          setUser(fbUser);
          localStorage.setItem('ic_user', JSON.stringify(fbUser));
        }
      }
      setIsLoading(false);
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [refreshProfileFromApi]);


  // 1. Customer & Admin Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please enter both your email address and password.');
      return false;
    }

    // Step 0: Check Master Administrator & Saved Direct Credentials (Priority 1)
    const isMasterAdmin = cleanEmail === 'mughalsteelfabrication51@gmail.com';
    const savedDirectPass = localStorage.getItem('ms_cred_' + cleanEmail);
    const activeAdminPass = savedDirectPass || 'Qasim@123';

    if ((savedDirectPass && savedDirectPass === cleanPass) || (isMasterAdmin && cleanPass === activeAdminPass)) {
      const isAdm = isMasterAdmin || cleanEmail.startsWith('admin') || cleanEmail.includes('admin');
      const localUser: User = {
        id: isAdm ? 'admin_mughal_01' : 'usr_' + Date.now(),
        email: cleanEmail,
        firstName: isAdm ? 'Mughal Steel' : cleanEmail.split('@')[0],
        lastName: isAdm ? 'Admin' : '',
        phone: '+92 323 9898317',
        addresses: [],
        isAdmin: isAdm,
        role: isAdm ? 'admin' : 'customer'
      };
      const mockToken = 'ms_admin_tok_' + Math.random().toString(36).substring(2);
      localStorage.setItem('ic_token', mockToken);
      localStorage.setItem('ms_token', mockToken);
      setUser(localUser);
      localStorage.setItem('ic_user', JSON.stringify(localUser));

      // Optional background sync with backend if online
      apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      }).catch(() => {});

      return true;
    }

    // Step A: Attempt Backend API Authentication
    try {
      const res = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      if (res && res.success && res.token && res.user) {
        const u = res.user;
        const loggedUser: User = {
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone || '',
          addresses: (u.addresses || []).map((a: any) => ({
            street: a.street,
            city: a.city,
            state: a.state,
            zip: a.zipCode || a.zip,
            country: a.country
          })),
          isAdmin: u.role === 'SuperAdmin' || u.role === 'Manager' || u.role === 'Admin' || u.role === 'admin'
        };

        localStorage.setItem('ic_token', res.token);
        localStorage.setItem('ms_token', res.token);
        setUser(loggedUser);
        localStorage.setItem('ic_user', JSON.stringify(loggedUser));
        return true;
      }
    } catch {
      // Proceed to Firebase or fallback
    }

    // Step B: Attempt Firebase Authentication
    try {
      const { user: fbUser, token: fbToken } = await firebaseAuthService.login(cleanEmail, cleanPass);
      if (fbUser && fbToken) {
        localStorage.setItem('ic_token', fbToken);
        localStorage.setItem('ms_token', fbToken);
        setUser(fbUser);
        localStorage.setItem('ic_user', JSON.stringify(fbUser));
        return true;
      }
    } catch {
      // Proceed to error
    }

    setError('Invalid email or password. Please check your credentials and try again.');
    return false;
  };


  // 2. Customer Registration
  const register = async (email: string, firstName: string, lastName: string, phone: string, password?: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanPhone = phone.trim();
    const cleanPass = password ? password.trim() : '';

    if (!cleanFirst || !cleanLast) {
      setError('Please enter your full first and last name.');
      return false;
    }

    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (cleanPass.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return false;
    }

    // Step A: Attempt Backend API Registration (Hashes password with BCrypt)
    try {
      const res = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: cleanEmail,
          firstName: cleanFirst,
          lastName: cleanLast,
          phone: cleanPhone,
          password: cleanPass
        })
      });

      if (res && res.success && res.token && res.user) {
        const u = res.user;
        const registeredUser: User = {
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone || cleanPhone,
          addresses: [],
          isAdmin: false
        };

        localStorage.setItem('ic_token', res.token);
        localStorage.setItem('ms_token', res.token);
        setUser(registeredUser);
        localStorage.setItem('ic_user', JSON.stringify(registeredUser));

        // Also register in Firebase for cloud sync in background
        firebaseAuthService.register({
          email: cleanEmail,
          password: cleanPass,
          firstName: cleanFirst,
          lastName: cleanLast,
          phone: cleanPhone
        }).catch(() => {});

        return true;
      }
    } catch (apiErr: any) {
      if (apiErr.message && apiErr.message.toLowerCase().includes('already registered')) {
        setError('This email address is already registered. Please sign in instead.');
        return false;
      }
    }

    // Step B: Attempt Firebase Registration
    try {
      const { user: fbUser, token: fbToken } = await firebaseAuthService.register({
        email: cleanEmail,
        password: cleanPass,
        firstName: cleanFirst,
        lastName: cleanLast,
        phone: cleanPhone
      });

      if (fbUser && fbToken) {
        localStorage.setItem('ic_token', fbToken);
        localStorage.setItem('ms_token', fbToken);
        setUser(fbUser);
        localStorage.setItem('ic_user', JSON.stringify(fbUser));
        return true;
      }
    } catch (fbErr: any) {
      let msg = 'Registration failed. Please verify your details.';
      if (fbErr.code === 'auth/email-already-in-use') {
        msg = 'This email address is already registered. Please sign in instead.';
      } else if (fbErr.code === 'auth/weak-password') {
        msg = 'The password provided is too weak. Please use at least 6 characters.';
      }
      setError(msg);
      return false;
    }

    setError('Could not complete registration. Please check your internet connection.');
    return false;
  };


  // 3. Real Live Google OAuth Login
  const loginWithGoogle = async (): Promise<boolean> => {
    setError(null);
    try {
      const { user: fbUser, token: fbToken } = await firebaseAuthService.loginWithGoogle();
      if (fbUser && fbToken) {
        localStorage.setItem('ic_token', fbToken);
        localStorage.setItem('ms_token', fbToken);
        setUser(fbUser);
        localStorage.setItem('ic_user', JSON.stringify(fbUser));
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('Real Google Auth error:', err);
      let errorMsg = 'Google sign-in could not be completed.';
      
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Google sign-in popup was closed before completing authentication.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = 'This domain (or localhost) is not authorized yet in Firebase Console → Authentication → Settings → Authorized domains.';
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        errorMsg = 'Google Provider needs to be enabled in Firebase Console → Authentication → Sign-in method → Google.';
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      return false;
    }
  };


  // 4. Password Reset Requests (Email-based)
  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return false;
    }
    try {
      await firebaseAuthService.sendPasswordReset(cleanEmail);
      return true;
    } catch (err: any) {
      let msg = 'Failed to send password reset email.';
      if (err?.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
      return false;
    }
  };

  // 4b. Direct Password Reset (Automatic instant update without email link)
  const resetPasswordDirectly = async (email: string, newPass: string): Promise<boolean> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = newPass.trim();

    if (!cleanEmail || cleanPass.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return false;
    }

    // 1. Instantly store and activate in local credential store
    localStorage.setItem('ms_cred_' + cleanEmail, cleanPass);

    // 2. Call backend database update API if online
    try {
      await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, newPassword: cleanPass })
      });
    } catch {
      // Offline / standalone mode supported
    }

    // 3. If currently loaded session matches email, update it
    try {
      const saved = localStorage.getItem('ic_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email?.toLowerCase() === cleanEmail) {
          localStorage.setItem('ic_user', JSON.stringify(parsed));
        }
      }
    } catch {
      // ignore
    }

    return true;
  };

  // 5. Verify Password Reset Code from Email Link
  const verifyResetCode = async (code: string): Promise<string> => {
    setError(null);
    try {
      return await firebaseAuthService.verifyPasswordResetCode(code);
    } catch (err: any) {
      let msg = 'The password reset link is invalid or has expired.';
      if (err?.code === 'auth/expired-action-code') {
        msg = 'The password reset link has expired. Please request a new one.';
      } else if (err?.code === 'auth/invalid-action-code') {
        msg = 'The reset link is invalid or has already been used.';
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  // 6. Confirm Password Reset and Set New Password
  const confirmPasswordReset = async (code: string, newPass: string): Promise<boolean> => {
    setError(null);
    const cleanPass = newPass.trim();
    if (cleanPass.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return false;
    }
    try {
      await firebaseAuthService.confirmPasswordReset(code, cleanPass);
      return true;
    } catch (err: any) {
      let msg = 'Failed to reset password.';
      if (err?.code === 'auth/expired-action-code') {
        msg = 'The password reset link has expired. Please request a new one.';
      } else if (err?.code === 'auth/invalid-action-code') {
        msg = 'The reset link is invalid or has already been used.';
      } else if (err?.code === 'auth/weak-password') {
        msg = 'The new password is too weak. Please use at least 6 characters with mixed letters & numbers.';
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
      return false;
    }
  };

  // 7. Logout & Session Termination
  const logout = async () => {
    try {
      await firebaseAuthService.logout();
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('ic_user');
    localStorage.removeItem('ic_token');
    localStorage.removeItem('ms_token');
    localStorage.removeItem('user');
  };


  // 8. Profile Updates
  const updateProfile = async (firstName: string, lastName: string, phone: string): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, firstName, lastName, phone };
    setUser(updated);
    localStorage.setItem('ic_user', JSON.stringify(updated));

    try {
      setError(null);
      await apiRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, phone })
      });
      return true;
    } catch {
      return true;
    }
  };


  // 9. Address Book Management
  const addAddress = async (address: Address): Promise<boolean> => {
    if (!user) return false;
    const updatedAddresses = [...(user.addresses || []), address];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('ic_user', JSON.stringify(updatedUser));

    try {
      setError(null);
      await apiRequest('/api/auth/addresses', {
        method: 'POST',
        body: JSON.stringify({
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zip,
          country: address.country,
          isDefault: true
        })
      });
      return true;
    } catch {
      return true;
    }
  };

  const removeAddress = async (index: number): Promise<boolean> => {
    if (!user || !user.addresses) return false;
    const updatedAddresses = user.addresses.filter((_, i) => i !== index);
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('ic_user', JSON.stringify(updatedUser));

    try {
      setError(null);
      const res = await apiRequest('/api/auth/profile');
      if (res && res.success && res.user && res.user.addresses && res.user.addresses[index]) {
        const addressId = res.user.addresses[index].id;
        await apiRequest(`/api/auth/addresses/${addressId}`, {
          method: 'DELETE'
        });
      }
      return true;
    } catch {
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: !!user?.isAdmin,
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      sendPasswordReset,
      resetPasswordDirectly,
      verifyResetCode,
      confirmPasswordReset,
      updateProfile,
      addAddress,
      removeAddress,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
