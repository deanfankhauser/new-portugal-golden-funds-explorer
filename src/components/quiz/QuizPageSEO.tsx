
import React from 'react';
import PageSEO from '../common/PageSEO';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { STATIC_PAGES_META } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

const QuizPageSEO = () => {
  const currentUrl = URL_CONFIG.buildUrl('fund-quiz');
  const metaData = STATIC_PAGES_META['fund-quiz'];

  // Generate structured data schemas
  const schemas = [
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateArticleSchema(
      'Portugal Golden Visa Fund Quiz',
      metaData.description,
      currentUrl
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      'name': 'Portugal Golden Visa Fund Finder Quiz',
      'description': metaData.description,
      'url': currentUrl,
      'about': {
        '@type': 'Thing',
        'name': 'Portugal Golden Visa Investment Funds'
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
      schemaId="fund-quiz"
    />
  );
};

export default QuizPageSEO;
