import { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { FUND_META_DATA } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundDetailsSEOProps {
  fund: Fund;
}

const FundDetailsSEO: React.FC<FundDetailsSEOProps> = ({ fund }) => {
  useEffect(() => {
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildFundUrl(fund.id);
      
      console.log('FundDetailsSEO: Setting SEO for fund:', fund.name);
      console.log('FundDetailsSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Get hardcoded meta data for this fund
      const metaData = FUND_META_DATA[fund.id];
      
      if (!metaData) {
        console.error('FundDetailsSEO: No meta data found for fund:', fund.id);
        return;
      }

      console.log('FundDetailsSEO: Using hardcoded meta data:', metaData.title);

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

      console.log('FundDetailsSEO: Meta tags applied successfully');

      // Generate comprehensive structured data
      const schemas = [
        StructuredDataService.generateFundProductSchema(fund),
        StructuredDataService.generateFundManagerSchema(fund),
        StructuredDataService.generateInvestmentSchema(fund),
        StructuredDataService.generateFundPageSchema(fund),
        ...EnhancedStructuredDataService.generateComprehensiveFundSchemas(fund),
        EnhancedStructuredDataService.generateWebSiteSchema(),
        EnhancedStructuredDataService.generateOrganizationSchema(),
        EnhancedStructuredDataService.generateArticleSchema(
          metaData.title,
          metaData.description,
          currentUrl
        )
      ];

      // Add FAQ structured data if available
      // const faqSchema = FundSeoService.generateFAQStructuredData(fund);
      // if (faqSchema) {
      //   schemas.push(faqSchema);
      // }

      // Add structured data
      StructuredDataService.addStructuredData(schemas, 'fund-page-schema');

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 200);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('fund-page-schema');
    };
  }, [fund]);

  return null; // This component doesn't render anything
};

export default FundDetailsSEO;
