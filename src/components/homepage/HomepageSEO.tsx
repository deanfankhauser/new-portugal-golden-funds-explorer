
import { useEffect } from 'react';
import { funds } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { PerformanceService } from '../../services/performanceService';
import { StaticGenerationService } from '../../services/staticGenerationService';
import { URL_CONFIG } from '../../utils/urlConfig';

const HomepageSEO = () => {
  useEffect(() => {
    // Use setTimeout to ensure DOM is ready and avoid timing issues
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.BASE_URL;
      
      console.log('HomepageSEO: Setting SEO for homepage');
      console.log('HomepageSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO and performance optimizations (without setting meta tags)
      SEOService.initializeSEO(currentUrl);
      PerformanceService.initializePerformanceOptimizations();
      PerformanceService.addResourceHints();

      // Generate and set optimized meta data
      const metaData = StaticGenerationService.generateRouteMetaData('/');
      
      console.log('HomepageSEO: Generated meta title:', metaData.title);
      console.log('HomepageSEO: Generated meta description:', metaData.description);

      // Clear all existing managed meta tags
      MetaTagManager.clearAllManagedMetaTags();

      // Set up all meta tags using the unified manager
      MetaTagManager.setupPageMetaTags({
        title: metaData.title,
        description: metaData.description,
        keywords: metaData.keywords.join(', '),
        canonicalUrl: currentUrl,
        ogTitle: metaData.title,
        ogDescription: metaData.description,
        ogUrl: currentUrl,
        twitterTitle: metaData.title,
        twitterDescription: metaData.description,
        imageAlt: 'Portugal Golden Visa Investment Funds Directory'
      });

      console.log('HomepageSEO: Meta tags applied successfully');

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
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 100);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('homepage');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default HomepageSEO;
