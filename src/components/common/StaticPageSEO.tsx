
import React from 'react';
import PageSEO from './PageSEO';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { STATIC_PAGES_META } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

interface StaticPageSEOProps {
  pageKey: keyof typeof STATIC_PAGES_META;
  pagePath: string;
}

const StaticPageSEO: React.FC<StaticPageSEOProps> = ({ pageKey, pagePath }) => {
  const currentUrl = URL_CONFIG.buildUrl(pagePath);
  const metaData = STATIC_PAGES_META[pageKey];

  if (!metaData) {
    console.error('StaticPageSEO: No meta data found for page:', pageKey);
    return null;
  }

  // Generate structured data schemas
  const schemas = [
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateArticleSchema(
      metaData.title,
      metaData.description,
      currentUrl
    )
  ];

  // Add FAQ schema for FAQ page
  if (pageKey === 'faqs') {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is the Portugal Golden Visa program?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The Portugal Golden Visa program allows non-EU citizens to obtain Portuguese residency through investment in qualified funds with a minimum €500,000 investment.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How much do I need to invest for a Golden Visa?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The minimum investment for Portugal Golden Visa through investment funds is €500,000.'
          }
        }
      ]
    };
    schemas.push(faqSchema);
  }

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
      schemaId={`static-${pageKey}`}
    />
  );
};

export default StaticPageSEO;
