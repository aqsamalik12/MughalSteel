import type React from 'react';

/**
 * Global Fallback Image for Mughal Steel Fabrication.
 * Uses the local branded vector graphic so it works even offline or if external CDNs are unavailable.
 */
export const FALLBACK_IMAGE_URL = '/image/placeholder-steel.svg';

/**
 * Standard image error handler that gracefully swaps failed or 404 image sources
 * with the branded placeholder, preventing broken image icons anywhere on the site.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback: string = FALLBACK_IMAGE_URL
) => {
  const target = e.currentTarget;
  // Prevent potential infinite recursion if the fallback itself errors
  target.onerror = null;
  if (target.src !== customFallback) {
    target.src = customFallback;
  }
};

/**
 * Returns a valid URL string or the default fallback if the provided URL is null,
 * undefined, empty, or an invalid format.
 */
export const getSafeImageUrl = (
  url?: string | null,
  fallback: string = FALLBACK_IMAGE_URL
): string => {
  if (!url || typeof url !== 'string') return fallback;
  const clean = url.trim();
  if (clean.length < 5) return fallback;
  return clean;
};
