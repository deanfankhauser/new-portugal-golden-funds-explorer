
import React from 'react';
import PageSEO from '../common/PageSEO';
import { funds } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { PerformanceService } from '../../services/performanceService';
import { HOMEPAGE_META } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

const HomepageSEO = () => {
  const currentUrl = URL_CONFIG.BASE_URL;

  React.useEffect(() => {
    PerformanceService.initializePerformanceOptimizations();
    PerformanceService.addResourceHints();
  }, []);

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
      }
    },
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateLocalBusinessSchema(),
    EnhancedStructuredDataService.generateInvestmentHowToSchema(),
    EnhancedStructuredDataService.generateComparisonTableSchema(funds.slice(0, 5)),
    EnhancedStructuredDataService.generateArticleSchema(
      'Portugal Golden Visa Investment Funds Directory',
      'Complete guide to qualified investment funds for Portugal Golden Visa residency program with detailed comparisons and analysis',
      currentUrl
    )
  ];

  return (
    <PageSEO
      title={HOMEPAGE_META.title}
      description={HOMEPAGE_META.description}
      keywords={HOMEPAGE_META.keywords}
      canonicalUrl={currentUrl}
      ogTitle={HOMEPAGE_META.ogTitle}
      ogDescription={HOMEPAGE_META.ogDescription}
      twitterTitle={HOMEPAGE_META.twitterTitle}
      twitterDescription={HOMEPAGE_META.twitterDescription}
      imageAlt={HOMEPAGE_META.imageAlt}
      schemas={schemas}
      schemaId="homepage"
    />
  );
};

export default HomepageSEO;
