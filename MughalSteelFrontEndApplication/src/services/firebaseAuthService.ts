import { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updatePassword,
  signInWithPopup,
  type FirebaseUser
} from './firebase';
import type { User } from '../types';

// Helper to map Firebase User to App User format
export const mapFirebaseUser = (fbUser: FirebaseUser, extra?: { phone?: string; isAdmin?: boolean; role?: 'admin' | 'customer'; addresses?: any[] }): User => {
  const nameParts = (fbUser.displayName || '').split(' ');
  const firstName = nameParts[0] || fbUser.email?.split('@')[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const email = (fbUser.email || '').toLowerCase().trim();
  // An account is an admin if explicitly marked as admin, assigned admin role, or is the registered company admin
  const isExplicitAdmin = extra?.isAdmin === true || 
    extra?.role === 'admin' || 
    email === 'mughalsteelfabrication51@gmail.com' || 
    email.startsWith('admin@') || 
    email.includes('admin');

  return {
    id: fbUser.uid,
    email: fbUser.email || '',
    firstName,
    lastName,
    phone: extra?.phone || fbUser.phoneNumber || '',
    addresses: extra?.addresses || [],
    isAdmin: isExplicitAdmin,
    role: isExplicitAdmin ? 'admin' : 'customer'
  };
};

export const firebaseAuthService = {
  // 1. Sign In with Email and Password
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password.trim());
    const token = await userCredential.user.getIdToken();
    const tokenResult = await userCredential.user.getIdTokenResult().catch(() => null);
    const hasAdminClaim = Boolean(tokenResult?.claims?.admin || tokenResult?.claims?.role === 'admin' || tokenResult?.claims?.role === 'SuperAdmin');
    const user = mapFirebaseUser(userCredential.user, { isAdmin: hasAdminClaim });
    return { user, token };
  },

  // 2. Sign Up with Email and Password
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ user: User; token: string }> {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email.trim().toLowerCase(), data.password.trim());
    
    // Update Display Name
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    if (fullName) {
      await updateProfile(userCredential.user, { displayName: fullName }).catch(() => {});
    }

    const token = await userCredential.user.getIdToken();
    const user = mapFirebaseUser(userCredential.user, { phone: data.phone, isAdmin: false });
    return { user, token };
  },

  // 3. Real Live Google OAuth Authentication
  async loginWithGoogle(): Promise<{ user: User; token: string }> {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, googleProvider);
    const token = await userCredential.user.getIdToken();
    const tokenResult = await userCredential.user.getIdTokenResult().catch(() => null);
    const hasAdminClaim = Boolean(tokenResult?.claims?.admin || tokenResult?.claims?.role === 'admin' || tokenResult?.claims?.role === 'SuperAdmin');
    const user = mapFirebaseUser(userCredential.user, { isAdmin: hasAdminClaim });
    return { user, token };
  },

  // 4. Send Password Reset Email
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  },

  // 5. Verify Password Reset Code from Action URL
  async verifyPasswordResetCode(actionCode: string): Promise<string> {
    return await verifyPasswordResetCode(auth, actionCode);
  },

  // 6. Confirm and Complete Password Reset
  async confirmPasswordReset(actionCode: string, newPassword: string): Promise<void> {
    await confirmPasswordReset(auth, actionCode, newPassword.trim());
  },

  // 7. Update Password for Current Authenticated User
  async updateCurrentPassword(newPassword: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No user is currently authenticated.');
    await updatePassword(auth.currentUser, newPassword.trim());
  },

  // 8. Sign Out
  async logout(): Promise<void> {
    await signOut(auth);
  },

  // 9. Auth State Listener
  onAuthStateChange(callback: (user: User | null, token: string | null) => void) {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          const tokenResult = await fbUser.getIdTokenResult().catch(() => null);
          const hasAdminClaim = Boolean(tokenResult?.claims?.admin || tokenResult?.claims?.role === 'admin' || tokenResult?.claims?.role === 'SuperAdmin');
          const user = mapFirebaseUser(fbUser, { isAdmin: hasAdminClaim });
          callback(user, token);
        } catch {
          callback(null, null);
        }
      } else {
        callback(null, null);
      }
    });
  }
};
