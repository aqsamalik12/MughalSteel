/**
 * Easy Slide In Animation Observer
 * Applies smooth 'easySlideIn' animation to all heading texts across the website
 * strictly excluding the front page hero section (#home).
 */

let observerInstance: IntersectionObserver | null = null;

export function initEasySlideInObserver(): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return () => {};
  }

  // Cleanup existing observer if any
  if (observerInstance) {
    observerInstance.disconnect();
    observerInstance = null;
  }

  observerInstance = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        // Never animate headings inside the front page hero (#home)
        if (el.closest('#home')) {
          el.classList.remove('in-view', 'easy-slide-in-trigger');
          return;
        }

        if (entry.isIntersecting) {
          el.classList.add('in-view');
        } else {
          // Reset when out of view so it smoothly re-slides when scrolling back into view
          el.classList.remove('in-view');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  const observeHeadings = () => {
    // Select all heading tags and spaced headings outside #home
    const headings = document.querySelectorAll<HTMLElement>(
      'h1:not(#home *), h2:not(#home *), h3:not(#home *), h4:not(#home *), h5:not(#home *), h6:not(#home *), .heading-spaced:not(#home *)'
    );

    headings.forEach((heading) => {
      if (!heading.closest('#home')) {
        heading.classList.add('easy-slide-in-trigger');
        observerInstance?.observe(heading);
      }
    });
  };

  // Run on next frame
  requestAnimationFrame(() => {
    observeHeadings();
  });

  // Watch for dynamic DOM updates (e.g. tab switches, filters, modals)
  const mutationObserver = new MutationObserver(() => {
    observeHeadings();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => {
    observerInstance?.disconnect();
    observerInstance = null;
    mutationObserver.disconnect();
  };
}
