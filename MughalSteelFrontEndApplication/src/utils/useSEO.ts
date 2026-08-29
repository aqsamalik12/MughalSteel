import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, any>;
}

const DEFAULT_TITLE = 'Mughal Steel Fabrication | Steel Doors, Gates & Custom Fabrication';
const DEFAULT_DESC = 'Custom steel fabrication, laser-cut main gates, wrought iron railings, architectural stairs, stainless steel structures, and CNC works across Islamabad and Rawalpindi.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
const BASE_URL = 'https://mughalsteelfabrication.com';

export function useSEO({
  title,
  description = DEFAULT_DESC,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  structuredData
}: SEOProps = {}) {
  useEffect(() => {
    // 1. Title
    const finalTitle = title 
      ? (title.includes('Mughal Steel') ? title : `${title} | Mughal Steel Fabrication`)
      : DEFAULT_TITLE;
    document.title = finalTitle;

    // 2. Helper to set or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard metadata
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // Open Graph
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:type', type);
    if (url) {
      setMetaTag('property', 'og:url', url.startsWith('http') ? url : `${BASE_URL}${url}`);
    }

    // Twitter Card
    setMetaTag('property', 'twitter:title', finalTitle);
    setMetaTag('property', 'twitter:description', description);
    setMetaTag('property', 'twitter:image', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : BASE_URL);

    // Structured Data JSON-LD
    let scriptTag: HTMLScriptElement | null = null;
    if (structuredData) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(structuredData);
      scriptTag.id = 'page-structured-data';
      
      const existing = document.getElementById('page-structured-data');
      if (existing) {
        existing.remove();
      }
      document.head.appendChild(scriptTag);
    }

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, keywords, image, url, type, structuredData]);
}
