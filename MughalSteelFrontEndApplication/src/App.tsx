import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider as CustomAuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Layout
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { MughalChatbot } from './components/chat/MughalChatbot';

// Core Eagerly Loaded Pages
import { HomePage } from './pages/HomePage';
import { CustomerLoginPage } from './pages/CustomerLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { scheduleIdlePrefetch } from './utils/prefetchRoutes';

// Lazy-Loaded Route Pages (Splits 1.28MB monolithic bundle into lightweight chunks)
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage').then(m => ({ default: m.CategoryDetailPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const VirtualTryOnPage = lazy(() => import('./pages/VirtualTryOnPage').then(m => ({ default: m.VirtualTryOnPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const WarrantyPage = lazy(() => import('./pages/WarrantyPage').then(m => ({ default: m.WarrantyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const QuotePage = lazy(() => import('./pages/QuotePage').then(m => ({ default: m.QuotePage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const CustomDesignPage = lazy(() => import('./pages/CustomDesignPage').then(m => ({ default: m.CustomDesignPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
import { useAuth } from './context/AuthContext';

// 1. Loading Screen Component during session verification
const AuthLoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-[#070C15] flex flex-col items-center justify-center text-center p-6 font-sans">
    <div className="relative mb-6">
      <div className="w-16 h-16 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
          <span className="text-brand-gold text-xs font-bold font-serif">MS</span>
        </div>
      </div>
    </div>
    <h2 className="text-stone-200 font-serif text-lg tracking-widest uppercase">MUGHAL STEEL</h2>
    <p className="text-stone-500 text-xs font-mono uppercase tracking-widest mt-1">Initializing Secure Session...</p>
  </div>
);

// 2. Protected Route Component: Restricts access to authenticated users only
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// 3. Public-Only Route Component: Prevents authenticated users from viewing login/register pages
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    const stateFrom = (location.state as any)?.from;
    const fromPath = typeof stateFrom === 'string' ? stateFrom : stateFrom?.pathname;
    const destination = (fromPath && fromPath !== '/login' && fromPath !== '/register' && fromPath !== '/signin') 
      ? (typeof stateFrom === 'string' ? stateFrom : (stateFrom.pathname + (stateFrom.search || '') + (stateFrom.hash || '')))
      : '/account';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};

// 4. Admin-Only Route Component: Strictly protects administrator dashboard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  let hasAdmin = isAdmin;
  if (!hasAdmin) {
    try {
      const savedUser = JSON.parse(localStorage.getItem('ic_user') || '{}');
      if (savedUser?.isAdmin === true || savedUser?.role === 'admin' || savedUser?.role === 'SuperAdmin') {
        hasAdmin = true;
      }
    } catch {
      // ignore
    }
  }

  if (!hasAdmin) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};


const AppContent: React.FC = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const isAdminPage = location.pathname.startsWith('/admin') && !location.pathname.startsWith('/admin/login') && !location.pathname.startsWith('/admin/reset-password');
  const isAuthPage = [
    '/login', '/register', '/signin', '/signup', 
    '/customer/login', '/admin/login', '/forgot-password',
    '/reset-password', '/admin/reset-password'
  ].some(p => location.pathname === p || location.pathname.startsWith(p + '/'));

  // Show header and footer across public browsing, hidden only on dedicated auth and admin portal pages
  const showNav = !isAdminPage && !isAuthPage;

  // Ultra-low latency: Automatically prefetch primary routes in background idle cycles
  React.useEffect(() => {
    scheduleIdlePrefetch();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 font-sans ${
      isDark 
        ? 'bg-[#070C15] text-stone-100 selection:bg-brand-gold selection:text-brand-dark' 
        : 'bg-[#F8F9FA] text-slate-800 selection:bg-amber-400 selection:text-slate-900'
    }`}>
      {/* Global Sticky Header */}
      {showNav && <Header />}
      
      {/* Sliding Cart Drawer */}
      {showNav && <CartDrawer />}

      {/* Main Content View */}
      <main className="flex-grow">
        <Suspense fallback={<AuthLoadingScreen />}>
          <Routes>
            {/* Public Auth Routes (Accessible only when logged out) */}
            <Route path="/login" element={<PublicOnlyRoute><CustomerLoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><CustomerLoginPage /></PublicOnlyRoute>} />
            <Route path="/signin" element={<PublicOnlyRoute><CustomerLoginPage /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><CustomerLoginPage /></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<PublicOnlyRoute><CustomerLoginPage /></PublicOnlyRoute>} />
            <Route path="/customer/login" element={<PublicOnlyRoute><CustomerLoginPage /></PublicOnlyRoute>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Password Recovery Routes */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

            {/* Completely Open Public Storefront & Browsing Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Catalog & Shop (Categories & Dedicated Item Slugs) */}
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:category" element={<CategoryDetailPage />} />
            <Route path="/categories/:category" element={<CategoryDetailPage />} />
            <Route path="/category/:category/:subcategory" element={<CategoryDetailPage />} />
            <Route path="/categories/:category/:subcategory" element={<CategoryDetailPage />} />
            <Route path="/products" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/items" element={<ShopPage />} />
            <Route path="/item/:slug" element={<ProductDetailPage />} />

            {/* Try at Home Tool & Custom Design Studio */}
            <Route path="/try-at-home" element={<VirtualTryOnPage />} />
            <Route path="/virtual-try-on" element={<Navigate to="/try-at-home" replace />} />
            <Route path="/custom-design" element={<CustomDesignPage />} />

            {/* Services, Projects & Portfolio */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<ProjectsPage />} />
            <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />

            {/* Customer Quotation, Cart & Wishlist (Freely Browseable) */}
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/quote-calculator" element={<QuotePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Strictly Protected: Purchase/Checkout Completion & Private Account Dashboard */}
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

            {/* Blog & Articles */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            {/* Company, Information & Contact */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Administrator Dashboard */}
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />

            {/* Fallback Catch-all: Redirects to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global AI Assistant & Customer Support Chatbot (Hidden on all login & admin pages) */}
      {!isAdminPage && !isAuthPage && <MughalChatbot />}

      {/* Global Footer */}
      {showNav && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <CurrencyProvider>
          <CustomAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Router>
                  <AppContent />
                </Router>
              </WishlistProvider>
            </CartProvider>
          </CustomAuthProvider>
        </CurrencyProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
