
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';

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

    // Create JSON-LD structured data for search engines
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://portugalvisafunds.com/categories/${categorySlug}`
      },
      'name': `${categoryName} Golden Visa Investment Funds`,
      'description': `Explore ${categoryName} Golden Visa investment funds. Find and compare the best ${categoryName} funds for your Golden Visa investment.`,
      'numberOfItems': fundsCount,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Product',
          'name': fund.name,
          'description': fund.description,
          'url': `https://portugalvisafunds.com/funds/${fund.id}`
        }
      })),
      // Adding breadcrumbs for better SEO
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
            'name': `${categoryName}`,
            'item': `https://portugalvisafunds.com/categories/${categorySlug}`
          }
        ]
      }
    };
    
    script.textContent = JSON.stringify(structuredData);
    
    // Remove any existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(s => s.remove());
    
    // Add the new structured data script
    document.head.appendChild(script);

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [categoryName, categorySlug, fundsCount, funds]);

  return null; // This component only handles side effects
};

export default CategoryPageSEO;
