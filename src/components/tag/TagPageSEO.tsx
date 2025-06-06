import React, { useEffect } from 'react';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
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
    const currentUrl = URL_CONFIG.buildTagUrl(tagSlug || '');
    
    // Initialize comprehensive SEO
    SEOService.initializeSEO(currentUrl);

    // Set optimized page title and meta description
    const optimizedTitle = `Top ${tagName} Golden Visa Funds | Movingto`;
    document.title = optimizedTitle;
    
    // Generate optimized meta description (keep under 155 chars)
    const optimizedDescription = SEOService.optimizeMetaDescription(
      `Discover ${tagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`,
      []
    );
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', optimizedDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = optimizedDescription;
      document.head.appendChild(meta);
    }

    // Add author meta tag
    const updateOrCreateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('author', 'Dean Fankhauser, CEO');
    updateOrCreateMeta('robots', 'index, follow, max-image-preview:large');

    // Update Open Graph meta tags
    const updateOrCreateOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    const fallbackImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';

    updateOrCreateOGMeta('og:title', optimizedTitle);
    updateOrCreateOGMeta('og:description', optimizedDescription);
    updateOrCreateOGMeta('og:type', 'website');
    updateOrCreateOGMeta('og:url', currentUrl);
    updateOrCreateOGMeta('og:image', fallbackImage);
    updateOrCreateOGMeta('og:site_name', 'Movingto Portugal Golden Visa Funds');

    // Add Twitter Card meta tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
    updateOrCreateTwitterMeta('twitter:site', '@movingtoio');
    updateOrCreateTwitterMeta('twitter:title', optimizedTitle);
    updateOrCreateTwitterMeta('twitter:description', optimizedDescription);
    updateOrCreateTwitterMeta('twitter:image', fallbackImage);

    // Generate enhanced structured data schemas
    const schemas = [
      // Original CollectionPage schema
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
              'item': currentUrl
            }
          ]
        }
      },
      // Add enhanced schemas
      EnhancedStructuredDataService.generateWebSiteSchema(),
      EnhancedStructuredDataService.generateOrganizationSchema(),
      EnhancedStructuredDataService.generateArticleSchema(
        `${tagName} Golden Visa Investment Funds Directory`,
        optimizedDescription,
        currentUrl
      )
    ];

    // Add tag-specific FAQ schema
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
