
import { useEffect } from 'react';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { URL_CONFIG } from '../../utils/urlConfig';

const ComparisonPageSEO = () => {
  useEffect(() => {
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildUrl('comparison');
      
      console.log('ComparisonPageSEO: Setting SEO for comparison page');
      console.log('ComparisonPageSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Clear all existing managed meta tags
      MetaTagManager.clearAllManagedMetaTags();

      // Set up all meta tags for comparison page
      MetaTagManager.setupPageMetaTags({
        title: "Compare Portugal Golden Visa Investment Funds | Fund Comparison Tool",
        description: "Compare Portugal Golden Visa investment funds side-by-side. Analyze fees, returns, and requirements to find the best fund for your EU residency investment.",
        keywords: "Portugal Golden Visa Comparison, Investment Fund Comparison, Golden Visa Tool, Fund Analysis, EU Residency",
        canonicalUrl: currentUrl,
        ogTitle: "Portugal Golden Visa Fund Comparison Tool",
        ogDescription: "Compare Golden Visa investment funds for Portugal residency. Side-by-side analysis of fees, returns, and requirements.",
        ogUrl: currentUrl,
        twitterTitle: "Golden Visa Fund Comparison Tool",
        twitterDescription: "Compare Golden Visa investment funds for Portugal residency. Side-by-side analysis of fees, returns, and requirements.",
        imageAlt: "Portugal Golden Visa Fund Comparison Tool"
      });

      console.log('ComparisonPageSEO: Meta tags applied successfully');

      // Generate structured data schemas
      const schemas = [
        EnhancedStructuredDataService.generateWebSiteSchema(),
        EnhancedStructuredDataService.generateOrganizationSchema(),
        EnhancedStructuredDataService.generateArticleSchema(
          'Portugal Golden Visa Fund Comparison Tool',
          'Compare investment funds for Portugal Golden Visa eligibility with our comprehensive comparison tool',
          currentUrl
        )
      ];

      // Add structured data using our service
      StructuredDataService.addStructuredData(schemas, 'comparison-page');

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 100);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('comparison-page');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ComparisonPageSEO;
