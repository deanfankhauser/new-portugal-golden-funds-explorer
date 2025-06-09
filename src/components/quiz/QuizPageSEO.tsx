
import { useEffect } from 'react';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { STATIC_PAGES_META } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

const QuizPageSEO = () => {
  useEffect(() => {
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildUrl('fund-quiz');
      
      console.log('QuizPageSEO: Setting SEO for fund quiz');
      console.log('QuizPageSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Get hardcoded meta data
      const metaData = STATIC_PAGES_META['fund-quiz'];

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

      console.log('QuizPageSEO: Meta tags applied successfully');

      // Generate structured data schemas
      const schemas = [
        EnhancedStructuredDataService.generateWebSiteSchema(),
        EnhancedStructuredDataService.generateOrganizationSchema(),
        EnhancedStructuredDataService.generateArticleSchema(
          'Portugal Golden Visa Fund Quiz',
          metaData.description,
          currentUrl
        ),
        // Add Quiz specific schema
        {
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          'name': 'Portugal Golden Visa Fund Finder Quiz',
          'description': metaData.description,
          'url': currentUrl,
          'about': {
            '@type': 'Thing',
            'name': 'Portugal Golden Visa Investment Funds'
          }
        }
      ];

      // Add structured data using our service
      StructuredDataService.addStructuredData(schemas, 'fund-quiz');

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 100);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('fund-quiz');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default QuizPageSEO;
