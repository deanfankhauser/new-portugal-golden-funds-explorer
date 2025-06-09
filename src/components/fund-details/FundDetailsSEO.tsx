
import { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { FundSeoService } from '../../services/fundSeoService';
import { MetaTagManager } from '../../services/metaTagManager';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundDetailsSEOProps {
  fund: Fund;
}

const FundDetailsSEO: React.FC<FundDetailsSEOProps> = ({ fund }) => {
  useEffect(() => {
    // Use setTimeout to ensure DOM is ready and avoid timing issues
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildFundUrl(fund.id);
      
      console.log('FundDetailsSEO: Setting SEO for fund:', fund.name);
      console.log('FundDetailsSEO: Current URL:', currentUrl);
      
      // Initialize comprehensive SEO (without setting meta tags)
      SEOService.initializeSEO(currentUrl);

      // Generate fund-specific SEO content
      const metaTitle = FundSeoService.generateMetaTitle(fund);
      const metaDescription = FundSeoService.generateMetaDescription(fund);
      const ogTitle = FundSeoService.generateOGTitle(fund);
      const ogDescription = FundSeoService.generateOGDescription(fund);
      const twitterDescription = FundSeoService.generateTwitterDescription(fund);
      const keywords = FundSeoService.generateKeywords(fund);

      console.log('FundDetailsSEO: Generated meta title:', metaTitle);
      console.log('FundDetailsSEO: Generated meta description:', metaDescription);

      // Clear all existing managed meta tags
      MetaTagManager.clearAllManagedMetaTags();

      // Set up all meta tags using the unified manager
      MetaTagManager.setupPageMetaTags({
        title: metaTitle,
        description: metaDescription,
        keywords: keywords,
        canonicalUrl: currentUrl,
        ogTitle: ogTitle,
        ogDescription: ogDescription,
        ogUrl: currentUrl,
        twitterTitle: ogTitle,
        twitterDescription: twitterDescription,
        imageAlt: `${fund.name} - Portuguese Golden Visa Investment Fund`
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
          metaTitle,
          metaDescription,
          currentUrl
        )
      ];

      // Add FAQ structured data if available
      const faqSchema = FundSeoService.generateFAQStructuredData(fund);
      if (faqSchema) {
        schemas.push(faqSchema);
      }

      // Add structured data
      StructuredDataService.addStructuredData(schemas, 'fund-page-schema');

      // Scroll to top on page load
      window.scrollTo(0, 0);
    };

    // Apply meta tags with a small delay to ensure DOM is ready
    setTimeout(applyMetaTags, 100);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('fund-page-schema');
    };
  }, [fund]);

  return null; // This component doesn't render anything
};

export default FundDetailsSEO;
