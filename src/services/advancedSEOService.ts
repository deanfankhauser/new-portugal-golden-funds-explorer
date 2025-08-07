
import { EnhancedSEOService } from './enhancedSEOService';
import { PerformanceMonitoringService } from './performanceMonitoringService';
import { ImageOptimizationService } from './imageOptimizationService';
import { Fund } from '../data/funds';

export class AdvancedSEOService extends EnhancedSEOService {
  
  // Generate comprehensive Open Graph meta tags
  static generateOpenGraphTags(data: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: string;
  }): void {
    const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
    
    const ogTags = [
      { property: 'og:title', content: data.title },
      { property: 'og:description', content: data.description },
      { property: 'og:url', content: data.url },
      { property: 'og:type', content: data.type || 'website' },
      { property: 'og:image', content: data.image || defaultImage },
      { property: 'og:image:width', content: '400' },
      { property: 'og:image:height', content: '400' },
      { property: 'og:site_name', content: 'Movingto' },
      { property: 'og:locale', content: 'en_US' }
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

  // Generate Twitter Card meta tags
  static generateTwitterCardTags(data: {
    title: string;
    description: string;
    image?: string;
  }): void {
    const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
    
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@movingtoio' },
      { name: 'twitter:creator', content: '@movingtoio' },
      { name: 'twitter:title', content: data.title },
      { name: 'twitter:description', content: data.description },
      { name: 'twitter:image', content: data.image || defaultImage }
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

  // Generate comprehensive JSON-LD structured data
  static generateStructuredData(type: 'fund' | 'category' | 'homepage', data: any): void {
    // Remove existing structured data
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());

    let structuredData: any;

    switch (type) {
      case 'fund':
        structuredData = this.generateFundStructuredData(data);
        break;
      case 'category':
        structuredData = this.generateCategoryStructuredData(data);
        break;
      case 'homepage':
        structuredData = this.generateHomepageStructuredData();
        break;
      default:
        return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  private static generateFundStructuredData(fund: Fund) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      'name': fund.name,
      'description': fund.description,
      'category': fund.category,
      'provider': {
        '@type': 'Organization',
        'name': fund.managerName,
        'url': fund.websiteUrl
      },
      'offers': {
        '@type': 'Offer',
        'price': fund.minimumInvestment,
        'priceCurrency': 'EUR',
        'availability': fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      },
      'additionalProperty': [
        {
          '@type': 'PropertyValue',
          'name': 'Management Fee',
          'value': `${fund.managementFee}%`
        },
        {
          '@type': 'PropertyValue',
          'name': 'Performance Fee',
          'value': `${fund.performanceFee}%`
        }
      ]
    };
  }

  private static generateCategoryStructuredData(data: { categoryName: string; fundCount: number }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${data.categoryName} Golden Visa Investment Funds`,
      'description': `Collection of ${data.categoryName} Golden Visa investment funds`,
      'numberOfItems': data.fundCount,
      'about': {
        '@type': 'Thing',
        'name': 'Golden Visa Investment Funds'
      }
    };
  }

  private static generateHomepageStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto - Portugal Golden Visa Investment Funds',
      'url': 'https://movingto.com/funds',
      'description': 'Portugal Golden Visa Investment Funds Directory',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://movingto.com/funds/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
  }

  // Initialize comprehensive SEO for a page
  static initializePageSEO(config: {
    title: string;
    description: string;
    url: string;
    type: 'fund' | 'category' | 'homepage';
    data?: any;
    image?: string;
  }): void {
    // Set basic meta tags
    document.title = config.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = config.description;
      document.head.appendChild(meta);
    }

    // Set canonical URL
    this.setCanonicalUrl(config.url);

    // Generate social media tags
    this.generateOpenGraphTags({
      title: config.title,
      description: config.description,
      url: config.url,
      image: config.image
    });

    this.generateTwitterCardTags({
      title: config.title,
      description: config.description,
      image: config.image
    });

    // Generate structured data
    this.generateStructuredData(config.type, config.data);

    // Initialize enhanced SEO and performance optimizations
    this.initializeEnhancedSEO({
      url: config.url,
      title: config.title,
      description: config.description,
      type: config.type,
      image: config.image
    });
    
    // Initialize performance monitoring and image optimization
    PerformanceMonitoringService.initializeMonitoring();
    ImageOptimizationService.initializeGlobalOptimization();
  }
}
