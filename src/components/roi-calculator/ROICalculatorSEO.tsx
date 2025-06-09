
import { useEffect } from 'react';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { STATIC_PAGES_META } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

const ROICalculatorSEO = () => {
  useEffect(() => {
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildUrl('roi-calculator');
      
      console.log('ROICalculatorSEO: Setting SEO for ROI calculator');
      console.log('ROICalculatorSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Get hardcoded meta data
      const metaData = STATIC_PAGES_META['roi-calculator'];

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

      console.log('ROICalculatorSEO: Meta tags applied successfully');

      // Generate structured data schemas
      const schemas = [
        EnhancedStructuredDataService.generateWebSiteSchema(),
        EnhancedStructuredDataService.generateOrganizationSchema(),
        EnhancedStructuredDataService.generateArticleSchema(
          'Portugal Golden Visa ROI Calculator',
          metaData.description,
          currentUrl
        ),
        // Add Calculator specific schema
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'Portugal Golden Visa ROI Calculator',
          'description': metaData.description,
          'url': currentUrl,
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'Web Browser',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'EUR'
          }
        }
      ];

      // Add structured data using our service
      StructuredDataService.addStructuredData(schemas, 'roi-calculator');

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 100);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('roi-calculator');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ROICalculatorSEO;
