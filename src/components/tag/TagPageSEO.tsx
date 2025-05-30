
import React, { useEffect } from 'react';
import { StructuredDataService } from '../../services/structuredDataService';
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
  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = `Top ${tagName} Golden Visa Funds | Movingto`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Discover ${tagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`
      );
    }

    // Generate structured data schemas using our service
    const schemas = [
      // CollectionPage schema
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': URL_CONFIG.buildTagUrl(tagSlug || '')
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
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': URL_CONFIG.BASE_URL
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Tags',
              'item': URL_CONFIG.buildUrl('tags')
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': tagName,
              'item': URL_CONFIG.buildTagUrl(tagSlug || '')
            }
          ]
        }
      }
    ];

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, `tag-${tagSlug}`);

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData(`tag-${tagSlug}`);
    };
  }, [tagName, fundsCount, funds, tagSlug]);

  return null; // This component doesn't render anything
};

export default TagPageSEO;
