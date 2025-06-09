
import React from 'react';
import PageSEO from '../common/PageSEO';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { TAG_META_DATA } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

interface TagPageSEOProps {
  tagName: string;
  tagSlug: string | undefined;
  fundsCount: number;
  funds: Array<{
    id: string;
    name: string;
    description: string;
    category?: string;
    managerName?: string;
    minimumInvestment?: number;
  }>;
}

const TagPageSEO = ({ tagName, tagSlug, fundsCount, funds }: TagPageSEOProps) => {
  const currentUrl = URL_CONFIG.buildTagUrl(tagSlug || '');
  const metaData = TAG_META_DATA[tagSlug || ''];

  if (!metaData) {
    console.error('TagPageSEO: No meta data found for tag:', tagSlug);
    return null;
  }

  // Generate structured data schemas
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': currentUrl
      },
      'name': `${tagName} Golden Visa Investment Funds`,
      'description': `Explore ${tagName} Golden Visa investment funds. Find and compare the best ${tagName} funds for your Golden Visa investment.`,
      'numberOfItems': fundsCount,
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': fundsCount,
        'itemListElement': funds.map((fund, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'description': fund.description,
            'url': URL_CONFIG.buildFundUrl(fund.id),
            'category': fund.category || 'Investment Fund',
            'provider': {
              '@type': 'Organization',
              'name': fund.managerName || 'Fund Manager'
            },
            'offers': {
              '@type': 'Offer',
              'price': fund.minimumInvestment || 500000,
              'priceCurrency': 'EUR'
            }
          }
        }))
      }
    },
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateArticleSchema(
      `${tagName} Golden Visa Investment Funds Directory`,
      metaData.description,
      currentUrl
    )
  ];

  // Add FAQ schema if there are funds
  if (fundsCount > 0) {
    const tagFAQSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': `What are ${tagName} Golden Visa funds?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `${tagName} Golden Visa funds are specialized investment vehicles eligible for Portugal's Golden Visa program, requiring a minimum investment of €500,000.`
          }
        },
        {
          '@type': 'Question',
          'name': `How many ${tagName} funds are available?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `There are currently ${fundsCount} ${tagName.toLowerCase()} funds available that meet Golden Visa eligibility requirements.`
          }
        }
      ]
    };
    schemas.push(tagFAQSchema);
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
      schemaId={`tag-${tagSlug}`}
    />
  );
};

export default TagPageSEO;
