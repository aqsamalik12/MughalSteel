/**
 * Easy Slide In Animation Observer
 * Applies smooth 'easySlideIn' animation to all heading texts across the website
 * strictly excluding the front page hero section (#home).
 */

let observerInstance: IntersectionObserver | null = null;
let mutationObserverInstance: MutationObserver | null = null;

export function initEasySlideInObserver(): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return () => {};
  }

  // Cleanup existing observers if any
  if (observerInstance) {
    observerInstance.disconnect();
    observerInstance = null;
  }
  if (mutationObserverInstance) {
    mutationObserverInstance.disconnect();
    mutationObserverInstance = null;
  }

  observerInstance = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        // Never animate headings inside the front page hero (#home)
        if (el.closest('#home')) {
          el.style.animation = 'none';
          el.classList.remove('in-view');
          return;
        }

        if (entry.isIntersecting) {
          el.classList.add('in-view');
          // Re-trigger the easySlideIn animation cleanly
          el.style.animation = 'none';
          // Trigger reflow to restart animation
          void el.offsetWidth;
          
          let duration = '1.8s';
          if (el.tagName === 'H2') duration = '1.9s';
          else if (el.tagName === 'H3') duration = '2.0s';
          else if (['H4', 'H5', 'H6'].includes(el.tagName)) duration = '2.1s';

          el.style.animation = `easySlideIn ${duration} cubic-bezier(0.16, 1, 0.3, 1) both`;
        } else {
          el.classList.remove('in-view');
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    }
  );

  const observeHeadings = () => {
    try {
      // Standard universally valid selector
      const headings = document.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6, .heading-spaced, [data-heading="true"]'
      );

      headings.forEach((heading) => {
        if (!heading.closest('#home')) {
          heading.classList.add('easy-slide-in');
          observerInstance?.observe(heading);
        } else {
          heading.style.animation = 'none';
        }
      });
    } catch {
      // safe fallback
    }
  };

  // Run on next frame
  requestAnimationFrame(() => {
    observeHeadings();
  });

  // Watch for dynamic DOM updates (e.g. tab switches, filters, modals)
  try {
    mutationObserverInstance = new MutationObserver(() => {
      observeHeadings();
    });

    mutationObserverInstance.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch {
    // safe fallback
  }

  return () => {
    observerInstance?.disconnect();
    observerInstance = null;
    mutationObserverInstance?.disconnect();
    mutationObserverInstance = null;
  };
}
