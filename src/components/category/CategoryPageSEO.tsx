
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';

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
  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = `Top ${categoryName} Golden Visa Funds | Movingto`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Discover ${categoryName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`
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
          '@id': `https://portugalvisafunds.com/categories/${categorySlug}`
        },
        'name': `${categoryName} Golden Visa Investment Funds`,
        'description': `Explore ${categoryName} Golden Visa investment funds. Find and compare the best ${categoryName} funds for your Golden Visa investment.`,
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
              'url': `https://portugalvisafunds.com/funds/${fund.id}`,
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
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://portugalvisafunds.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Categories',
              'item': 'https://portugalvisafunds.com/categories'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': categoryName,
              'item': `https://portugalvisafunds.com/categories/${categorySlug}`
            }
          ]
        }
      }
    ];

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, `category-${categorySlug}`);

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData(`category-${categorySlug}`);
    };
  }, [categoryName, categorySlug, fundsCount, funds]);

  return null; // This component only handles side effects
};

export default CategoryPageSEO;
