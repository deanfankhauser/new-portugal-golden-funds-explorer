
import { useEffect } from 'react';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { STATIC_PAGES_META } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

interface StaticPageSEOProps {
  pageKey: keyof typeof STATIC_PAGES_META;
  pagePath: string;
}

const StaticPageSEO: React.FC<StaticPageSEOProps> = ({ pageKey, pagePath }) => {
  useEffect(() => {
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildUrl(pagePath);
      
      console.log(`StaticPageSEO: Setting SEO for ${pageKey}`);
      console.log('StaticPageSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Get hardcoded meta data
      const metaData = STATIC_PAGES_META[pageKey];

      if (!metaData) {
        console.error('StaticPageSEO: No meta data found for page:', pageKey);
        return;
      }

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

      console.log(`StaticPageSEO: Meta tags applied successfully for ${pageKey}`);

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

      // Add structured data using our service
      StructuredDataService.addStructuredData(schemas, `static-${pageKey}`);

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 100);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData(`static-${pageKey}`);
    };
  }, [pageKey, pagePath]);

  return null; // This component doesn't render anything
};

export default StaticPageSEO;
