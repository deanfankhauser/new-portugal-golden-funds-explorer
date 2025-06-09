import React, { useEffect } from 'react';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
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
  useEffect(() => {
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildTagUrl(tagSlug || '');
      
      console.log('TagPageSEO: Setting SEO for tag:', tagName);
      console.log('TagPageSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Get hardcoded meta data for this tag
      const metaData = TAG_META_DATA[tagSlug || ''];
      
      if (!metaData) {
        console.error('TagPageSEO: No meta data found for tag:', tagSlug);
        return;
      }

      console.log('TagPageSEO: Using hardcoded meta data:', metaData.title);

      // Clear all existing managed meta tags
      MetaTagManager.clearAllManagedMetaTags();

      // Set up all meta tags using hardcoded data
      MetaTagManager.setupPageMetaTags({
        title: metaData.title,
        description: metaData.description,
        keywords: metaData.keywords,
        canonicalUrl: currentUrl,
        ogTitle: metaData.ogTitle,
        ogDescription: metaData.ogDescription,
        ogUrl: currentUrl,
        twitterTitle: metaData.twitterTitle,
        twitterDescription: metaData.twitterDescription,
        imageAlt: metaData.imageAlt
      });

      console.log('TagPageSEO: Meta tags applied successfully');

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
          metaData.description,
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
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 200);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData(`tag-${tagSlug}`);
    };
  }, [tagName, fundsCount, funds, tagSlug]);

  return null; // This component doesn't render anything
};

export default TagPageSEO;
