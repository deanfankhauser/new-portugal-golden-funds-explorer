import { SEOData } from '../types/seo';

export class MetaTagManager {
  // Clean up duplicate meta tags
  static cleanup(): void {
    // Remove duplicate viewports
    const viewports = document.querySelectorAll('meta[name="viewport"]');
    if (viewports.length > 1) {
      for (let i = 1; i < viewports.length; i++) {
        viewports[i].remove();
      }
    }

    // Remove duplicate descriptions
    const descriptions = document.querySelectorAll('meta[name="description"]');
    if (descriptions.length > 1) {
      for (let i = 1; i < descriptions.length; i++) {
        descriptions[i].remove();
      }
    }

    // Remove duplicate canonicals
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    if (canonicals.length > 1) {
      for (let i = 1; i < canonicals.length; i++) {
        canonicals[i].remove();
      }
    }

    // Remove duplicate robots
    const robots = document.querySelectorAll('meta[name="robots"]');
    if (robots.length > 1) {
      for (let i = 1; i < robots.length; i++) {
        robots[i].remove();
      }
    }

    // Clean up overlapping structured data
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());
  }

  // Set essential meta tags
  static setBasicMeta(seoData: SEOData): void {
    // Title
    document.title = seoData.title;

    // Description
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', seoData.description);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.url);

    // Robots
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'index, follow, max-image-preview:large');
  }

  // Set OpenGraph tags
  static setOpenGraph(seoData: SEOData): void {
    const ogTags = [
      { property: 'og:title', content: seoData.title },
      { property: 'og:description', content: seoData.description },
      { property: 'og:url', content: seoData.url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Movingto' },
      { property: 'og:locale', content: 'en_US' },
    ];

    // Remove existing OG tags
    document.querySelectorAll('meta[property^="og:"]').forEach(tag => tag.remove());

    // Add new OG tags
    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  // Set Twitter Card tags
  static setTwitterCard(seoData: SEOData): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@movingtoio' },
      { name: 'twitter:title', content: seoData.title },
      { name: 'twitter:description', content: seoData.description },
    ];

    // Remove existing Twitter tags
    document.querySelectorAll('meta[name^="twitter:"]').forEach(tag => tag.remove());

    // Add new Twitter tags
    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  // Set structured data
  static setStructuredData(structuredData: any): void {
    if (!structuredData) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  // Main method to apply all SEO
  static applySEO(seoData: SEOData): void {
    this.cleanup();
    this.setBasicMeta(seoData);
    this.setOpenGraph(seoData);
    this.setTwitterCard(seoData);
    
    if (seoData.structuredData) {
      this.setStructuredData(seoData.structuredData);
    }
  }
}