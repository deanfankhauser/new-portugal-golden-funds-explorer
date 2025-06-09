
import React from 'react';
import PageSEO from '../common/PageSEO';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { STATIC_PAGES_META } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

const ROICalculatorSEO = () => {
  const currentUrl = URL_CONFIG.buildUrl('roi-calculator');
  const metaData = STATIC_PAGES_META['roi-calculator'];

  // Generate structured data schemas
  const schemas = [
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateArticleSchema(
      'Portugal Golden Visa ROI Calculator',
      metaData.description,
      currentUrl
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Portugal Golden Visa ROI Calculator',
      'description': metaData.description,
      'url': currentUrl,
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
      }
    }
  ];

  return (
    <PageSEO
      title={metaData.title}
      description={metaData.description}
      keywords={metaData.keywords}
      canonicalUrl={currentUrl}
      ogTitle={metaData.ogTitle}
      ogDescription={metaData.ogDescription}
      twitterTitle={metaData.twitterTitle}
      twitterDescription={metaData.twitterDescription}
      imageAlt={metaData.imageAlt}
      schemas={schemas}
      schemaId="roi-calculator"
    />
  );
};

export default ROICalculatorSEO;
