/**
 * High-Speed Zero-Latency Route Prefetcher for Mughal Steel Fabrication
 * Automatically pre-loads and caches page bundles in idle browser threads 
 * and immediately upon user hover, ensuring 0ms instantaneous route transitions.
 */

const prefetchedRoutes = new Set<string>();

export const prefetchRoute = (routeName: string) => {
  const normalized = routeName.toLowerCase().trim();
  if (prefetchedRoutes.has(normalized)) return;
  prefetchedRoutes.add(normalized);

  try {
    switch (normalized) {
      case 'products':
      case 'shop':
      case 'items':
        import('../pages/ShopPage');
        break;
      case 'categories':
      case 'portfolio':
        import('../pages/CategoriesPage');
        break;
      case 'services':
        import('../pages/ServicesPage');
        break;
      case 'projects':
        import('../pages/ProjectsPage');
        break;
      case 'quote':
      case 'quote-calculator':
        import('../pages/QuotePage');
        break;
      case 'cart':
        import('../pages/CartPage');
        break;
      case 'account':
        import('../pages/AccountPage');
        break;
      case 'contact':
        import('../pages/ContactPage');
        break;
      case 'custom-design':
        import('../pages/CustomDesignPage');
        break;
      case 'reviews':
        import('../pages/ReviewsPage');
        break;
      case 'admin':
        import('../pages/AdminPage');
        break;
      default:
        break;
    }
  } catch {
    // Non-blocking catch
  }
};

/**
 * Automatically schedule background prefetching of primary commercial routes
 * during idle browser cycles so user transitions feel instantaneous.
 */
export const scheduleIdlePrefetch = () => {
  if (typeof window === 'undefined') return;

  const runPrefetch = () => {
    // Prefetch top 5 customer destinations
    setTimeout(() => prefetchRoute('products'), 300);
    setTimeout(() => prefetchRoute('categories'), 600);
    setTimeout(() => prefetchRoute('services'), 900);
    setTimeout(() => prefetchRoute('quote'), 1200);
    setTimeout(() => prefetchRoute('cart'), 1500);
    setTimeout(() => prefetchRoute('account'), 1800);
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runPrefetch, { timeout: 3000 });
  } else {
    setTimeout(runPrefetch, 800);
  }
};
