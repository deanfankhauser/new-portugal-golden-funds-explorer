
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
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
  useEffect(() => {
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildCategoryUrl(categorySlug);
      
      console.log('CategoryPageSEO: Setting SEO for category:', categoryName);
      console.log('CategoryPageSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Get hardcoded meta data for this category
      const metaData = CATEGORY_META_DATA[categorySlug];
      
      if (!metaData) {
        console.error('CategoryPageSEO: No meta data found for category:', categorySlug);
        return;
      }

      console.log('CategoryPageSEO: Using hardcoded meta data:', metaData.title);

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

      console.log('CategoryPageSEO: Meta tags applied successfully');

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
                'name': 'Categories',
                'item': URL_CONFIG.buildUrl('categories')
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': categoryName,
                'item': currentUrl
              }
            ]
          }
        },
        // Add enhanced schemas
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

      // Add structured data using our service
      StructuredDataService.addStructuredData(schemas, `category-${categorySlug}`);

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 200);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData(`category-${categorySlug}`);
    };
  }, [categoryName, categorySlug, fundsCount, funds]);

  return null; // This component doesn't render anything
};

export default CategoryPageSEO;
