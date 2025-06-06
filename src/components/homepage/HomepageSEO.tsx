
import { useEffect } from 'react';
import { funds } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { PerformanceService } from '../../services/performanceService';
import { URL_CONFIG } from '../../utils/urlConfig';

const HomepageSEO = () => {
  useEffect(() => {
    const currentUrl = URL_CONFIG.BASE_URL;
    
    // Initialize comprehensive SEO
    SEOService.initializeSEO(currentUrl);
    
    // Initialize performance optimizations
    PerformanceService.initializePerformanceOptimizations();

    // Set optimized page title and meta description
    document.title = "Portugal Golden Visa Investment Funds | Eligible Investments 2025";
    
    // Update meta description with optimized keywords
    const metaDescription = document.querySelector('meta[name="description"]');
    const optimizedDescription = SEOService.optimizeMetaDescription(
      "Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment. Start your journey today!",
      ['Golden Visa', 'Portugal Investment', 'Residency by Investment', 'EU Residency']
    );
    
    if (metaDescription) {
      metaDescription.setAttribute('content', optimizedDescription);
    }

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
                'priceCurrency': 'EUR'
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
        'Complete guide to qualified investment funds for Portugal Golden Visa residency program',
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
