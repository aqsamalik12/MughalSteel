import type { WebsiteSettings } from '../types';

/**
 * Returns a live interactive Google Maps embed URL for iframe
 * Supports custom embed links if provided, or dynamically builds
 * from company address & city.
 */
export const getGoogleMapsEmbedUrl = (settings?: Partial<WebsiteSettings> | null): string => {
  if (!settings) {
    return 'https://maps.google.com/maps?q=Sector%20I-9%20Industrial%20Area%20Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed';
  }

  // If user pasted a custom Google Maps Embed URL (e.g. contains /embed or embed?pb=)
  if (settings.googleMapsUrl && (settings.googleMapsUrl.includes('/embed') || settings.googleMapsUrl.includes('embed?pb='))) {
    return settings.googleMapsUrl;
  }

  // Build clean dynamic address query
  const parts = [
    settings.streetAddress,
    settings.city,
    settings.state,
    settings.country || 'Pakistan'
  ].filter(Boolean);

  const query = parts.length > 0 ? parts.join(', ') : 'Plot 42, Sector I-9 Industrial Area, Rawalpindi / Islamabad, Pakistan';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

/**
 * Returns a direct Google Maps navigation / search URL for buttons & links
 */
export const getGoogleMapsDirectionsUrl = (settings?: Partial<WebsiteSettings> | null): string => {
  if (!settings) {
    return 'https://www.google.com/maps/search/?api=1&query=Mughal+Steel+Fabrication+I-9+Industrial+Area+Islamabad';
  }

  // If user provided a normal external link (not an iframe embed)
  if (
    settings.googleMapsUrl && 
    settings.googleMapsUrl.startsWith('http') && 
    !settings.googleMapsUrl.includes('/embed') && 
    !settings.googleMapsUrl.includes('embed?pb=')
  ) {
    return settings.googleMapsUrl;
  }

  const queryParts = [
    settings.companyName || 'Mughal Steel Fabrication',
    settings.streetAddress,
    settings.city
  ].filter(Boolean);

  const query = queryParts.join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
