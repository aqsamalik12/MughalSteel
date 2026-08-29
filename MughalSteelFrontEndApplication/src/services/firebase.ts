import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA-zl3eo3s6NTcPINpRE-Q9zlMMTRXcOH0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mughalsteel-72cb9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mughalsteel-72cb9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mughalsteel-72cb9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "631869057730",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:631869057730:web:422dbf2ee7a3f01aade95b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7DZLZ3T9MS"
};

// Initialize Firebase safely (prevent re-initializing during HMR)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
  updatePassword,
  signInWithPopup,
  type FirebaseUser
};

export default app;
