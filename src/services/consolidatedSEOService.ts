
import { SEOData } from '../types/seo';
import { URL_CONFIG } from '../utils/urlConfig';
import { funds } from '../data/funds';
import { normalizeComparisonSlug } from '../utils/comparisonUtils';
import { getComparisonBySlug } from '../data/services/comparison-service';
import { ReviewsService } from '../data/services/reviews-service';

export class ConsolidatedSEOService {
  private static readonly DEFAULT_IMAGE = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
  private static readonly MAX_TITLE_LENGTH = 60;
  private static readonly MAX_DESCRIPTION_LENGTH = 155;

  // Clean up duplicate meta tags
  static cleanup(): void {
    // Remove duplicate and empty title tags
    const titles = document.querySelectorAll('title');
    if (titles.length > 1) {
      // Remove empty titles first
      titles.forEach(title => {
        if (!title.textContent?.trim()) {
          title.remove();
        }
      });
      
      // If still duplicates, keep only the first meaningful one
      const remainingTitles = document.querySelectorAll('title');
      if (remainingTitles.length > 1) {
        for (let i = 1; i < remainingTitles.length; i++) {
          remainingTitles[i].remove();
        }
      }
    }

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

    // Clean up only managed structured data, preserve others (like FAQ schemas)
    const managedSchemas = document.querySelectorAll('script[type="application/ld+json"][data-managed="consolidated-seo"]');
    managedSchemas.forEach(script => script.remove());
    
    // Remove duplicate robots meta tags (keep only one)
    const robotsTags = document.querySelectorAll('meta[name="robots"]');
    robotsTags.forEach((robot, index) => {
      if (index > 0) robot.remove();
    });
    
    // If we're about to inject new JSON-LD and there are existing ones, replace or skip to prevent duplication
    const existingJsonLd = document.querySelectorAll('script[type="application/ld+json"]:not([data-managed])');
    if (existingJsonLd.length > 0) {
      // Mark existing as managed to prevent duplication
      existingJsonLd.forEach(script => script.setAttribute('data-managed', 'legacy'));
    }
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
    const baseUrl = URL_CONFIG.BASE_URL;
    
    switch (pageType) {
      case 'homepage':
        return {
          title: this.optimizeText('Portugal Golden Visa Investment Funds | Compare & Analyze | Movingto', 60),
          description: this.optimizeText('Discover and compare Portugal Golden Visa Investment Funds. Comprehensive analysis, performance data, and expert insights for qualified Golden Visa investment decisions.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/'),
          structuredData: this.getHomepageStructuredData()
        };

      case 'fund':
      case 'fund-details':
        const fund = this.getFundByName(params.fundName);
        if (!fund) return this.getSEOData('homepage');
        
        return {
          title: this.optimizeText(`${fund.name} | Portugal Golden Visa Investment Fund Details | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Comprehensive details about ${fund.name} Portugal Golden Visa investment fund including minimum investment, returns, fees, and fund manager information.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildFundUrl(fund.id),
          structuredData: this.getFundStructuredData(fund)
        };

      case 'fund-index':
        return {
          title: this.optimizeText('Portugal Golden Visa Investment Fund Index 2025 | Fund Database | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Complete Portugal Golden Visa investment fund database. Compare qualified Golden Visa funds by category, fees, minimum investment, and performance metrics.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('index'),
          structuredData: this.getFundIndexStructuredData()
        };

      case 'category':
        return {
          title: this.optimizeText(`${params.categoryName} Portugal Golden Visa Investment Funds | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Discover ${params.categoryName} Portugal Golden Visa investment funds. Compare minimum investments, returns, fees, and eligibility for residency applications.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildCategoryUrl(params.categoryName),
          structuredData: this.getCategoryStructuredData(params.categoryName, params.funds || [])
        };

      case 'tag':
        return {
          title: this.optimizeText(`${params.tagName} Portugal Golden Visa Investment Funds | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Explore ${params.tagName} Portugal Golden Visa investment funds. Compare minimum investments, returns, and Golden Visa eligibility requirements.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildTagUrl(params.tagName),
          structuredData: this.getTagStructuredData(params.tagName, params.funds || [])
        };

      case 'manager':
        return {
          title: this.optimizeText(`${params.managerName} | Portugal Golden Visa Fund Manager | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Profile and Portugal Golden Visa investment funds managed by ${params.managerName}. Track record, investment philosophy, and fund performance.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildManagerUrl(params.managerName),
          structuredData: this.getManagerStructuredData(params.managerName)
        };

      case 'comparison':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparison Tool | Compare Investment Funds | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare Portugal Golden Visa investment funds side by side. Analyze performance, fees, risk profiles and make informed Golden Visa investment decisions.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/compare'),
          structuredData: this.getComparisonStructuredData()
        };

      case 'fund-comparison':
        const normalizedSlug = normalizeComparisonSlug(params.comparisonSlug || '');
        const comparisonData = getComparisonBySlug(normalizedSlug);
        
        if (comparisonData) {
          const { fund1, fund2 } = comparisonData;
          
          return {
            title: this.optimizeText(`${fund1.name} vs ${fund2.name} Comparison | Portugal Golden Visa Funds 2025`, this.MAX_TITLE_LENGTH),
            description: this.optimizeText(`Compare ${fund1.name} (${fund1.managerName}) vs ${fund2.name} (${fund2.managerName}) Portugal Golden Visa funds. Side-by-side analysis of fees, minimum investment, returns, and performance metrics.`, this.MAX_DESCRIPTION_LENGTH),
            url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
            structuredData: this.getFundComparisonStructuredData(fund1, fund2)
          };
        }
        
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparison | Investment Analysis 2025', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare Portugal Golden Visa investment funds side-by-side. Detailed analysis of fees, returns, minimum investment, and fund performance metrics.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('compare'),
          structuredData: this.getGenericComparisonStructuredData()
        };

      case 'roi-calculator':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund ROI Calculator | Investment Returns | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Calculate potential returns on Portugal Golden Visa investment funds. Compare different funds and investment scenarios for Golden Visa investments.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('roi-calculator'),
          structuredData: this.getCalculatorStructuredData()
        };

      case 'fund-quiz':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Finder Quiz | Find Your Perfect Investment | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Take our quiz to find the perfect Portugal Golden Visa investment fund for your needs. Personalized Golden Visa fund recommendations.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('fund-quiz'),
          structuredData: this.getQuizStructuredData()
        };

      case '404':
        return {
          title: this.optimizeText('Page Not Found | Portugal Investment Funds | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('The page you are looking for could not be found. Explore our investment funds.', this.MAX_DESCRIPTION_LENGTH),
          url: `${baseUrl}/404`,
          structuredData: this.getHomepageStructuredData()
        };

      case 'managers-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Managers | Investment Professionals | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Directory of Portugal Golden Visa fund managers. Find experienced investment professionals managing Golden Visa eligible funds.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('managers'),
          structuredData: this.getManagersHubStructuredData()
        };

      case 'categories-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Categories | Investment Types | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Browse Portugal Golden Visa investment fund categories. Explore different investment types and strategies for Golden Visa programs.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('categories'),
          structuredData: this.getCategoriesHubStructuredData()
        };

      case 'tags-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Tags | Investment Characteristics | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Explore Portugal Golden Visa investment funds by characteristics and tags. Find Golden Visa funds that match your criteria.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('tags'),
          structuredData: this.getTagsHubStructuredData()
        };

      case 'alternatives-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Alternatives Hub | Compare Investment Options | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Explore alternative Portugal Golden Visa investment funds for every fund in our database. Find similar Golden Visa fund options based on category, risk level, and investment requirements.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/alternatives'),
          structuredData: this.getAlternativesHubStructuredData()
        };

      case 'comparisons-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparisons | Investment Analysis Hub | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Hub for comparing Portugal Golden Visa investment funds. Access Golden Visa fund comparison tools and analysis.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('comparisons'),
          structuredData: this.getComparisonsHubStructuredData()
        };

      case 'about':
        return {
          title: this.optimizeText('About | Portugal Golden Visa Investment Fund Analysis Platform | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Learn about our platform for analyzing Portugal Golden Visa investment funds. Expert Golden Visa fund analysis.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('about'),
          structuredData: this.getAboutStructuredData()
        };

      case 'disclaimer':
        return {
          title: this.optimizeText('Disclaimer | Portugal Golden Visa Investment Information | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Important disclaimer regarding Portugal Golden Visa investment information. Please read our terms.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('disclaimer'),
          structuredData: this.getDisclaimerStructuredData()
        };

      case 'faqs':
        return {
          title: this.optimizeText('FAQs | Portugal Golden Visa Investment Fund Questions | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Frequently asked questions about Portugal Golden Visa investment funds. Get answers about Golden Visa programs.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('faqs'),
          structuredData: this.getFAQStructuredData()
        };

      case 'privacy':
        return {
          title: this.optimizeText('Privacy Policy | Portugal Golden Visa Investment Fund Platform | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Privacy policy for our Portugal Golden Visa investment fund platform. Learn how we protect your data while helping you find the right investment funds.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('privacy'),
          structuredData: this.getPrivacyStructuredData()
        };

      case 'fund-alternatives':
        const altFund = this.getFundByName(params.fundName);
        if (!altFund) return this.getSEOData('homepage');
        
        return {
          title: this.optimizeText(`${altFund.name} Alternatives | Similar Portugal Golden Visa Funds | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Discover investment alternatives to ${altFund.name}. Compare similar Portugal Golden Visa eligible funds with matching investment profiles and characteristics.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildFundUrl(altFund.id) + '/alternatives',
          structuredData: this.getFundAlternativesStructuredData(altFund)
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
      this.setRobots(seoData.robots);
      
      // Social media tags
    this.setOpenGraph(seoData);
    this.setTwitterCard(seoData);
    this.setLocale();
      
      // Structured data
      if (seoData.structuredData) {
        this.setStructuredData(seoData.structuredData);
      }
      
      // Security headers
      this.addSecurityHeaders();
      
      // Dispatch event to notify components of SEO update
      window.dispatchEvent(new CustomEvent('seo:updated', { detail: seoData }));
      
    } catch (error) {
      // Silent fallback - no console logging in production
    }
  }

  // Helper methods
  private static setOrUpdateMeta(nameOrProperty: string, content: string): void;
  private static setOrUpdateMeta(nameOrProperty: string, attribute: string, content: string): void;
  private static setOrUpdateMeta(nameOrProperty: string, contentOrAttribute: string, content?: string): void {
    const isProperty = nameOrProperty === 'property';
    const attributeName = isProperty ? contentOrAttribute : nameOrProperty;
    const metaContent = isProperty ? content! : contentOrAttribute;
    
    const selector = isProperty ? `meta[property="${attributeName}"]` : `meta[name="${attributeName}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(isProperty ? 'property' : 'name', attributeName);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', metaContent);
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

  private static setRobots(robotsDirective?: string): void {
    // Ensure fund pages are always indexable - never use noindex for funds
    const robots = robotsDirective === 'noindex, follow' ? 'index, follow' : (robotsDirective || 'index, follow, max-image-preview:large');
    this.setOrUpdateMeta('robots', robots);
  }

  private static setOpenGraph(seoData: SEOData): void {
    // Enhanced og:type detection
    let ogType = 'website';
    if (seoData.url.includes('/compare/') && seoData.url.includes('-vs-')) {
      ogType = 'article';
    } else if (seoData.structuredData) {
      // Check for fund pages (multiple schemas)
      if (Array.isArray(seoData.structuredData)) {
        const hasInvestmentFund = seoData.structuredData.some(schema => schema['@type'] === 'InvestmentFund');
        if (hasInvestmentFund) ogType = 'product';
      } else if (seoData.structuredData['@type'] === 'InvestmentFund') {
        ogType = 'product';
      } else if (seoData.structuredData['@type'] === 'FinancialProduct') {
        ogType = 'product';
      } else if (seoData.structuredData['@type'] === 'Person') {
        ogType = 'profile';
      }
    }
    
    // DEV-only verification log
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('🔍 SEO og:type set to:', ogType, 'for URL:', seoData.url);
    }
    
    const ogTags = [
      { property: 'og:title', content: seoData.title },
      { property: 'og:description', content: seoData.description },
      { property: 'og:url', content: seoData.url },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: this.DEFAULT_IMAGE },
      { property: 'og:site_name', content: 'Movingto' },
    ];

    // Add article:modified_time for fund pages
    if (ogType === 'product' && seoData.structuredData) {
      let modifiedTime = new Date().toISOString();
      if (Array.isArray(seoData.structuredData)) {
        const webPageSchema = seoData.structuredData.find(schema => schema['@type'] === 'WebPage');
        if (webPageSchema && webPageSchema.dateModified) {
          modifiedTime = webPageSchema.dateModified;
        }
      }
      ogTags.push({ property: 'article:modified_time', content: modifiedTime });
    }

    document.querySelectorAll('meta[property^="og:"], meta[property^="article:"]').forEach(tag => tag.remove());
    
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

  private static setLocale(): void {
    this.setOrUpdateMeta('property', 'og:locale', 'en_US');
  }

  private static setStructuredData(structuredData: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-managed', 'consolidated-seo');
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
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Movingto - Portugal Golden Visa Investment Funds',
        'url': URL_CONFIG.BASE_URL,
        'description': 'Comprehensive analysis and comparison of Portugal Golden Visa Investment Funds',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Portugal Investment Funds',
        'url': URL_CONFIG.BASE_URL,
        'description': 'Independent platform for comparing Portugal Golden Visa investment funds',
        'foundingDate': '2024',
        'knowsAbout': [
          'Portugal Golden Visa',
          'Investment Funds',
          'Real Estate Investment',
          'Portuguese Residency',
          'Fund Management'
        ],
        'areaServed': {
          '@type': 'Country',
          'name': 'Portugal'
        }
      }
    ];
  }

  private static getFundStructuredData(fund: any): any {
    const { InvestmentFundStructuredDataService } = require('./investmentFundStructuredDataService');
    const investmentFundSchema = InvestmentFundStructuredDataService.generateInvestmentFundSchema(fund);
    
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': `${fund.name} - Fund Details`,
      'description': fund.description,
      'dateModified': fund.dateModified || new Date().toISOString(),
      'url': URL_CONFIG.buildFundUrl(fund.id),
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Portugal Golden Visa Funds Home', 'item': URL_CONFIG.BASE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': 'Complete Portugal Fund Database', 'item': URL_CONFIG.buildUrl('/index') },
          { '@type': 'ListItem', 'position': 3, 'name': `${fund.name} Details & Analysis` }
        ]
      }
    };

    // Add review data if available
    const reviewData = ReviewsService.buildReviewStructuredData(fund.id);
    if (reviewData) {
      baseStructuredData['aggregateRating'] = reviewData.aggregateRating;
      baseStructuredData['review'] = reviewData.review;
    }

    return [investmentFundSchema, baseStructuredData];
  }

  private static getCategoryStructuredData(categoryName: string, funds: any[] = []): any {
    const categorySlug = this.slugify(categoryName);
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${categoryName} Investment Funds`,
      'description': `Collection of ${categoryName} investment funds in Portugal`,
      'url': URL_CONFIG.buildCategoryUrl(categoryName)
    };

    // Add ItemList schema for SEO
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `${categoryName} Portugal Golden Visa Investment Funds`,
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'name': fund.name
      }))
    };

    // Add BreadcrumbList schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': URL_CONFIG.BASE_URL
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Categories',
          'item': `${URL_CONFIG.BASE_URL}/categories`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': categoryName,
          'item': `${URL_CONFIG.BASE_URL}/categories/${categorySlug}`
        }
      ]
    };

    return [baseSchema, itemListSchema, breadcrumbSchema];
  }

  private static getTagStructuredData(tagName: string, funds: any[] = []): any {
    const tagSlug = this.slugify(tagName);
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${tagName} Investment Funds`,
      'description': `Investment funds tagged with ${tagName}`,
      'url': URL_CONFIG.buildTagUrl(tagName)
    };

    // Add ItemList schema for SEO
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `${tagName} Portugal Golden Visa Investment Funds`,
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'name': fund.name
      }))
    };

    // Add BreadcrumbList schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': URL_CONFIG.BASE_URL
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Tags',
          'item': `${URL_CONFIG.BASE_URL}/tags`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': tagName,
          'item': `${URL_CONFIG.BASE_URL}/tags/${tagSlug}`
        }
      ]
    };

    return [baseSchema, itemListSchema, breadcrumbSchema];
  }

  private static getManagerStructuredData(managerName: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': managerName,
      'url': URL_CONFIG.buildManagerUrl(managerName)
    };
  }

  private static getComparisonStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': URL_CONFIG.buildUrl('compare'),
          'name': 'Investment Fund Comparison Tool',
          'description': 'Compare investment funds side-by-side to analyze performance, fees, and risk profiles',
          'url': URL_CONFIG.buildUrl('compare'),
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': URL_CONFIG.buildUrl('/')
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Compare Funds',
                'item': URL_CONFIG.buildUrl('compare')
              }
            ]
          }
        },
        {
          '@type': 'WebApplication',
          'name': 'Fund Comparison Tool',
          'description': 'Interactive tool to compare investment funds',
          'url': URL_CONFIG.buildUrl('compare'),
          'applicationCategory': 'FinanceApplication'
        }
      ]
    };
  }

  private static getFundIndexStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Portugal Golden Visa Investment Funds Database',
      'description': 'Complete database of Portugal Golden Visa Investment Funds',
      'url': URL_CONFIG.buildUrl('index'),
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': URL_CONFIG.buildUrl('/')
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Fund Index',
            'item': URL_CONFIG.buildUrl('index')
          }
        ]
      }
    };
  }

  private static getCalculatorStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'ROI Calculator',
      'description': 'Calculate potential investment returns',
      'url': URL_CONFIG.buildUrl('roi-calculator')
    };
  }

  private static getQuizStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Fund Finder Quiz',
      'description': 'Find the perfect investment fund',
      'url': URL_CONFIG.buildUrl('fund-quiz')
    };
  }

  private static getManagersHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Fund Managers Directory',
      'description': 'Directory of investment fund managers',
      'url': URL_CONFIG.buildUrl('managers')
    };
  }

  private static getCategoriesHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Fund Categories',
      'description': 'Browse investment fund categories',
      'url': URL_CONFIG.buildUrl('categories')
    };
  }

  private static getTagsHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Fund Tags',
      'description': 'Explore funds by characteristics',
      'url': URL_CONFIG.buildUrl('tags')
    };
  }

  private static getComparisonsHubStructuredData(): any {
    // Get top 10 fund pairs for featured comparisons
    const topComparisons = funds.slice(0, 10).flatMap((fund, i) => 
      funds.slice(i + 1, i + 3).map((otherFund, j) => ({
        '@type': 'ListItem',
        'position': i * 2 + j + 1,
        'name': `${fund.name} vs ${otherFund.name}`,
        'item': URL_CONFIG.buildUrl(`compare/${normalizeComparisonSlug(`${fund.id}-vs-${otherFund.id}`)}`)
      }))
    ).slice(0, 10);

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': URL_CONFIG.buildUrl('comparisons'),
          'name': 'Fund Comparisons Hub',
          'description': 'Comprehensive hub for comparing investment funds with tools and featured comparisons',
          'url': URL_CONFIG.buildUrl('comparisons'),
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': URL_CONFIG.buildUrl('/')
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Fund Comparisons',
                'item': URL_CONFIG.buildUrl('comparisons')
              }
            ]
          },
          'mainEntity': {
            '@type': 'ItemList',
            'name': 'Featured Fund Comparisons',
            'numberOfItems': topComparisons.length,
            'itemListElement': topComparisons
          }
        }
      ]
    };
  }

  private static getAboutStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About Movingto',
      'description': 'About our investment fund analysis platform',
      'url': URL_CONFIG.buildUrl('about')
    };
  }

  private static getDisclaimerStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Disclaimer',
      'description': 'Investment information disclaimer',
      'url': URL_CONFIG.buildUrl('disclaimer')
    };
  }

  private static getFAQStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': 'Frequently Asked Questions',
      'description': 'Common questions about investment funds',
      'url': URL_CONFIG.buildUrl('faqs')
    };
  }

  private static getPrivacyStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Privacy Policy',
      'description': 'Privacy policy for our platform',
      'url': URL_CONFIG.buildUrl('privacy')
    };
  }

  private static getFundAlternativesStructuredData(fund: any): any {
    // Import the service to get alternatives
    const { findAlternativeFunds } = require('../data/services/alternative-funds-service');
    const alternatives = findAlternativeFunds(fund, 6);
    
    const baseStructuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': `${fund.name} Alternatives`,
        'description': `Alternative investment funds similar to ${fund.name}`,
        'url': URL_CONFIG.buildFundUrl(fund.id) + '/alternatives',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': URL_CONFIG.buildUrl('')
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': fund.name,
              'item': URL_CONFIG.buildFundUrl(fund.id)
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Alternatives',
              'item': URL_CONFIG.buildFundUrl(fund.id) + '/alternatives'
            }
          ]
        }
      }
    ];

    // Add ItemList if alternatives exist
    if (alternatives.length > 0) {
      baseStructuredData[0]['mainEntity'] = {
        '@type': 'ItemList',
        'name': `Alternatives to ${fund.name}`,
        'description': `Investment funds with similar characteristics to ${fund.name}`,
        'numberOfItems': alternatives.length,
        'itemListElement': alternatives.map((alt: any, index: number) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': alt.name,
            'description': alt.description,
            'url': URL_CONFIG.buildFundUrl(alt.id),
            'category': alt.category,
            'provider': {
              '@type': 'Organization',
              'name': alt.managerName
            }
          }
        }))
      };
    }

    return baseStructuredData;
  }


  // Generate fund comparison structured data
  private static getFundComparisonStructuredData(fund1: any, fund2: any) {
    if (!fund1 || !fund2 || !fund1.name || !fund2.name || !fund1.id || !fund2.id) return this.getGenericComparisonStructuredData();

    const normalizedSlug = `${[fund1.id, fund2.id].sort().join('-vs-')}`;
    const comparisonUrl = URL_CONFIG.buildComparisonUrl(normalizedSlug);

    return [
      // Main WebPage schema
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${fund1.name} vs ${fund2.name} Comparison`,
        "description": `Compare ${fund1.name} and ${fund2.name} investment funds side-by-side to make informed investment decisions`,
        "url": comparisonUrl,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": URL_CONFIG.BASE_URL
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Fund Comparisons",
              "item": URL_CONFIG.buildUrl('comparisons')
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${fund1.name} vs ${fund2.name}`,
              "item": comparisonUrl
            }
          ]
        },
        "mainEntity": {
          "@type": "ItemList",
          "name": "Fund Comparison",
          "numberOfItems": 2,
          "itemListElement": [
            {
              "@type": "FinancialProduct",
              "name": fund1.name,
              "description": fund1.description || `Investment fund: ${fund1.name}`,
              "url": URL_CONFIG.buildFundUrl(fund1.id),
              "offers": {
                "@type": "Offer",
                "price": fund1.minimumInvestment || 0,
                "priceCurrency": "EUR"
              }
            },
            {
              "@type": "FinancialProduct", 
              "name": fund2.name,
              "description": fund2.description || `Investment fund: ${fund2.name}`,
              "url": URL_CONFIG.buildFundUrl(fund2.id),
              "offers": {
                "@type": "Offer",
                "price": fund2.minimumInvestment || 0,
                "priceCurrency": "EUR"
              }
            }
          ]
        }
      }
    ];
  }

  // Generate generic comparison structured data
  private static getGenericComparisonStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Fund Comparison Tool',
      'description': 'Compare Portugal Golden Visa investment funds'
    };
  }

  private static getAlternativesHubStructuredData() {
    const { fundsData } = require('../data/mock/funds');
    const { findAlternativeFunds } = require('../data/services/alternative-funds-service');
    
    const fundsWithAlternatives = fundsData
      .map((fund: any) => ({
        fund,
        alternatives: findAlternativeFunds(fund, 3)
      }))
      .filter((item: any) => item.alternatives.length > 0);

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Fund Alternatives Hub",
      "description": "Comprehensive directory of investment fund alternatives and similar options",
      "url": URL_CONFIG.buildUrl('/alternatives'),
      "mainEntity": {
        "@type": "ItemList",
        "name": "Funds with Alternatives",
        "numberOfItems": fundsWithAlternatives.length,
        "itemListElement": fundsWithAlternatives.slice(0, 20).map((item: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "FinancialProduct",
            "name": item.fund.name,
            "category": item.fund.category,
            "url": URL_CONFIG.buildFundUrl(item.fund.id),
            "additionalProperty": {
              "@type": "PropertyValue",
              "name": "alternativesCount",
              "value": item.alternatives.length
            }
          }
        }))
      }
    };
  }

}
