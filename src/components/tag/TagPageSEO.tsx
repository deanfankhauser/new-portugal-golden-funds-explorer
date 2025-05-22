
import React, { useEffect } from 'react';

interface TagPageSEOProps {
  tagName: string;
  tagSlug: string | undefined;
  fundsCount: number;
  funds: Array<{
    id: string;
    name: string;
    description: string;
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

    // Create JSON-LD structured data for search engines
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://portugalvisafunds.com/tags/${tagSlug}`
      },
      'name': `${tagName} Golden Visa Investment Funds`,
      'description': `Explore ${tagName} Golden Visa investment funds. Find and compare the best ${tagName} funds for your Golden Visa investment.`,
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
            'name': 'Tags',
            'item': 'https://portugalvisafunds.com/tags'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': `${tagName}`,
            'item': `https://portugalvisafunds.com/tags/${tagSlug}`
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

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(s => s.remove());
    };
  }, [tagName, fundsCount, funds, tagSlug]);

  return null; // This component doesn't render anything
};

export default TagPageSEO;
