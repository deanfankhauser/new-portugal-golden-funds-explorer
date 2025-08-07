import { SEOData } from '../types/seo';
import { URL_CONFIG } from '../utils/urlConfig';
import { funds } from '../data/funds';

export class ConsolidatedSEOService {
  private static readonly DEFAULT_IMAGE = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
  private static readonly MAX_TITLE_LENGTH = 60;
  private static readonly MAX_DESCRIPTION_LENGTH = 155;

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

    // Clean up overlapping structured data
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());
  }

  // Optimize title and description
  static optimizeText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLength * 0.8 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  // Get SEO data for different page types
  static getSEOData(pageType: string, params: any = {}): SEOData {
    const baseUrl = URL_CONFIG.SITE_URL;
    
    switch (pageType) {
      case 'homepage':
        return {
          title: 'Portugal Investment Funds | Compare & Analyze | Movingto',
          description: this.optimizeText('Discover and compare Portugal investment funds. Comprehensive analysis, performance data, and expert insights to help you make informed investment decisions.', this.MAX_DESCRIPTION_LENGTH),
          url: baseUrl,
          structuredData: this.getHomepageStructuredData()
        };

      case 'fund-details':
        const fund = this.getFundByName(params.fundName);
        if (!fund) return this.getSEOData('homepage');
        
        return {
          title: this.optimizeText(`${fund.name} | Fund Analysis | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Comprehensive analysis of ${fund.name}. View performance, fees, risk profile, and investment strategy details.`, this.MAX_DESCRIPTION_LENGTH),
          url: `${baseUrl}/funds/${fund.id}`,
          structuredData: this.getFundStructuredData(fund)
        };

      case 'category':
        return {
          title: this.optimizeText(`${params.categoryName} Funds | Portugal Investment Analysis | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Explore ${params.categoryName} investment funds in Portugal. Compare performance, fees, and risk profiles.`, this.MAX_DESCRIPTION_LENGTH),
          url: `${baseUrl}/categories/${this.slugify(params.categoryName)}`,
          structuredData: this.getCategoryStructuredData(params.categoryName)
        };

      case 'tag':
        return {
          title: this.optimizeText(`${params.tagName} Investment Funds | Portugal | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Find investment funds tagged with ${params.tagName}. Detailed analysis and comparison tools.`, this.MAX_DESCRIPTION_LENGTH),
          url: `${baseUrl}/tags/${this.slugify(params.tagName)}`,
          structuredData: this.getTagStructuredData(params.tagName)
        };

      case 'manager':
        return {
          title: this.optimizeText(`${params.managerName} | Fund Manager Profile | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Profile and funds managed by ${params.managerName}. Track record, investment philosophy, and fund performance.`, this.MAX_DESCRIPTION_LENGTH),
          url: `${baseUrl}/managers/${this.slugify(params.managerName)}`,
          structuredData: this.getManagerStructuredData(params.managerName)
        };

      case 'comparison':
        return {
          title: this.optimizeText(`Fund Comparison | ${params.comparisonTitle || 'Investment Analysis'} | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare investment funds side-by-side. Analyze performance, fees, risk profiles, and investment strategies.', this.MAX_DESCRIPTION_LENGTH),
          url: `${baseUrl}/comparison`,
          structuredData: this.getComparisonStructuredData()
        };

      default:
        return this.getSEOData('homepage');
    }
  }

  // Set all meta tags and structured data
  static applyMetaTags(seoData: SEOData): void {
    try {
      this.cleanup();
      
      // Basic meta tags
      document.title = seoData.title;
      this.setOrUpdateMeta('description', seoData.description);
      this.setCanonical(seoData.url);
      this.setRobots();
      
      // Social media tags
      this.setOpenGraph(seoData);
      this.setTwitterCard(seoData);
      
      // Structured data
      if (seoData.structuredData) {
        this.setStructuredData(seoData.structuredData);
      }
      
      // Security headers
      this.addSecurityHeaders();
      
    } catch (error) {
      // Silent fallback - no console logging in production
    }
  }

  // Helper methods
  private static setOrUpdateMeta(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  private static setCanonical(url: string): void {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  private static setRobots(): void {
    this.setOrUpdateMeta('robots', 'index, follow, max-image-preview:large');
  }

  private static setOpenGraph(seoData: SEOData): void {
    const ogTags = [
      { property: 'og:title', content: seoData.title },
      { property: 'og:description', content: seoData.description },
      { property: 'og:url', content: seoData.url },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: this.DEFAULT_IMAGE },
      { property: 'og:site_name', content: 'Movingto' },
    ];

    document.querySelectorAll('meta[property^="og:"]').forEach(tag => tag.remove());
    
    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  private static setTwitterCard(seoData: SEOData): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@movingtoio' },
      { name: 'twitter:title', content: seoData.title },
      { name: 'twitter:description', content: seoData.description },
      { name: 'twitter:image', content: this.DEFAULT_IMAGE },
    ];

    document.querySelectorAll('meta[name^="twitter:"]').forEach(tag => tag.remove());
    
    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  private static setStructuredData(structuredData: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  private static addSecurityHeaders(): void {
    const securityMetas = [
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'referrer', content: 'strict-origin-when-cross-origin' }
    ];

    securityMetas.forEach(meta => {
      const identifier = meta['http-equiv'] || meta.name;
      const existing = document.querySelector(`meta[${meta['http-equiv'] ? 'http-equiv' : 'name'}="${identifier}"]`);
      if (!existing) {
        const metaElement = document.createElement('meta');
        if (meta['http-equiv']) {
          metaElement.setAttribute('http-equiv', meta['http-equiv']);
        } else {
          metaElement.setAttribute('name', meta.name);
        }
        metaElement.content = meta.content;
        document.head.appendChild(metaElement);
      }
    });
  }

  private static getFundByName(fundName: string): any {
    return funds.find(fund => fund.name === fundName);
  }

  private static slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  // Structured data generators
  private static getHomepageStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto - Portugal Investment Funds',
      'url': URL_CONFIG.SITE_URL,
      'description': 'Comprehensive analysis and comparison of Portugal investment funds',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${URL_CONFIG.SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  private static getFundStructuredData(fund: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      'name': fund.name,
      'description': fund.description || `Investment fund managed by ${fund.manager}`,
      'provider': {
        '@type': 'Organization',
        'name': fund.manager
      },
      'url': `${URL_CONFIG.SITE_URL}/funds/${fund.id}`
    };
  }

  private static getCategoryStructuredData(categoryName: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${categoryName} Investment Funds`,
      'description': `Collection of ${categoryName} investment funds in Portugal`,
      'url': `${URL_CONFIG.SITE_URL}/categories/${this.slugify(categoryName)}`
    };
  }

  private static getTagStructuredData(tagName: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${tagName} Investment Funds`,
      'description': `Investment funds tagged with ${tagName}`,
      'url': `${URL_CONFIG.SITE_URL}/tags/${this.slugify(tagName)}`
    };
  }

  private static getManagerStructuredData(managerName: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': managerName,
      'jobTitle': 'Fund Manager',
      'url': `${URL_CONFIG.SITE_URL}/managers/${this.slugify(managerName)}`
    };
  }

  private static getComparisonStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Investment Fund Comparison',
      'description': 'Compare investment funds side-by-side',
      'url': `${URL_CONFIG.SITE_URL}/comparison`
    };
  }
}