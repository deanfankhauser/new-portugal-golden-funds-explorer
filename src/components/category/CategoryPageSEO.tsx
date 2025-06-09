
import React from 'react';
import PageSEO from '../common/PageSEO';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { CATEGORY_META_DATA } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

interface CategoryPageSEOProps {
  categoryName: string;
  categorySlug: string;
  fundsCount: number;
  funds: Fund[];
}

const CategoryPageSEO: React.FC<CategoryPageSEOProps> = ({ 
  categoryName, 
  categorySlug, 
  fundsCount, 
  funds 
}) => {
  const currentUrl = URL_CONFIG.buildCategoryUrl(categorySlug);
  const metaData = CATEGORY_META_DATA[categorySlug];

  if (!metaData) {
    console.error('CategoryPageSEO: No meta data found for category:', categorySlug);
    return null;
  }

  // Generate enhanced structured data schemas
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': currentUrl
      },
      'name': `${categoryName} Golden Visa Investment Funds`,
      'description': metaData.description,
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
            'category': fund.category,
            'provider': {
              '@type': 'Organization',
              'name': fund.managerName
            },
            'offers': {
              '@type': 'Offer',
              'price': fund.minimumInvestment,
              'priceCurrency': 'EUR'
            }
          }
        }))
      }
    },
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateArticleSchema(
      `${categoryName} Golden Visa Investment Funds Directory`,
      metaData.description,
      currentUrl
    )
  ];

  // Add category-specific FAQ schema
  if (fundsCount > 0) {
    const categoryFAQSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': `What are ${categoryName} Golden Visa funds?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `${categoryName} Golden Visa funds are specialized investment vehicles eligible for Portugal's Golden Visa program, requiring a minimum investment of €500,000.`
          }
        },
        {
          '@type': 'Question',
          'name': `How many ${categoryName} funds are available?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `There are currently ${fundsCount} ${categoryName.toLowerCase()} funds available that meet Golden Visa eligibility requirements.`
          }
        }
      ]
    };
    schemas.push(categoryFAQSchema);
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
      schemaId={`category-${categorySlug}`}
    />
  );
};

export default CategoryPageSEO;
