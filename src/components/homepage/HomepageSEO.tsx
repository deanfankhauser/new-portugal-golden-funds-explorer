
import { useEffect } from 'react';
import { funds } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { PerformanceService } from '../../services/performanceService';
import { StaticGenerationService } from '../../services/staticGenerationService';
import { URL_CONFIG } from '../../utils/urlConfig';

const HomepageSEO = () => {
  useEffect(() => {
    const currentUrl = URL_CONFIG.BASE_URL;
    
    // Initialize comprehensive SEO and performance optimizations
    SEOService.initializeSEO(currentUrl);
    PerformanceService.initializePerformanceOptimizations();
    PerformanceService.addResourceHints();

    // Generate and set optimized meta data
    const metaData = StaticGenerationService.generateRouteMetaData('/');
    document.title = metaData.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaData.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metaData.description;
      document.head.appendChild(meta);
    }

    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', metaData.keywords.join(', '));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = metaData.keywords.join(', ');
      document.head.appendChild(meta);
    }

    // Add author and other important meta tags
    const updateOrCreateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('author', 'Dean Fankhauser, CEO');
    updateOrCreateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateOrCreateMeta('theme-color', '#EF4444');
    updateOrCreateMeta('msapplication-TileColor', '#EF4444');

    // Generate enhanced structured data with current date
    const currentDate = new Date().toISOString().split('T')[0];
    
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': URL_CONFIG.BASE_URL
        },
        'name': 'Portugal Golden Visa Investment Funds Directory',
        'description': 'Comprehensive directory of eligible investment funds for the Portugal Golden Visa program',
        'numberOfItems': funds.length,
        'lastReviewed': currentDate,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': funds.length,
          'itemListElement': funds.map((fund, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'FinancialProduct',
              'name': fund.name,
              'description': fund.description,
              'category': fund.category,
              'provider': {
                '@type': 'Organization',
                'name': fund.managerName
              },
              'url': URL_CONFIG.buildFundUrl(fund.id),
              'offers': {
                '@type': 'Offer',
                'price': fund.minimumInvestment,
                'priceCurrency': 'EUR',
                'availability': fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
              }
            }
          }))
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': URL_CONFIG.BASE_URL
            }
          ]
        }
      },
      EnhancedStructuredDataService.generateWebSiteSchema(),
      EnhancedStructuredDataService.generateOrganizationSchema(),
      EnhancedStructuredDataService.generateLocalBusinessSchema(),
      EnhancedStructuredDataService.generateInvestmentHowToSchema(),
      EnhancedStructuredDataService.generateComparisonTableSchema(funds.slice(0, 5)), // Top 5 funds
      EnhancedStructuredDataService.generateArticleSchema(
        'Portugal Golden Visa Investment Funds Directory',
        'Complete guide to qualified investment funds for Portugal Golden Visa residency program with detailed comparisons and analysis',
        currentUrl
      )
    ];

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, 'homepage');
    
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('homepage');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default HomepageSEO;
