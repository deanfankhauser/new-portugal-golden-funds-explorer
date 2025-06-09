
import { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { FundSeoService } from '../../services/fundSeoService';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundDetailsSEOProps {
  fund: Fund;
}

const FundDetailsSEO: React.FC<FundDetailsSEOProps> = ({ fund }) => {
  useEffect(() => {
    const currentUrl = URL_CONFIG.buildFundUrl(fund.id);
    
    // Initialize comprehensive SEO
    SEOService.initializeSEO(currentUrl);

    // Generate fund-specific SEO content
    const metaTitle = FundSeoService.generateMetaTitle(fund);
    const metaDescription = FundSeoService.generateMetaDescription(fund);
    const ogTitle = FundSeoService.generateOGTitle(fund);
    const ogDescription = FundSeoService.generateOGDescription(fund);
    const twitterDescription = FundSeoService.generateTwitterDescription(fund);
    const keywords = FundSeoService.generateKeywords(fund);

    // Set page title
    document.title = metaTitle;
    
    // Update or create meta description
    const updateOrCreateMeta = (name: string, content: string, useProperty = false) => {
      const selector = useProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement('meta');
        if (useProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Update meta tags
    updateOrCreateMeta('description', metaDescription);
    updateOrCreateMeta('keywords', keywords);
    updateOrCreateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Update Open Graph meta tags
    updateOrCreateMeta('og:title', ogTitle, true);
    updateOrCreateMeta('og:description', ogDescription, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:url', currentUrl, true);
    updateOrCreateMeta('og:site_name', 'Movingto Portugal Golden Visa Funds', true);
    updateOrCreateMeta('og:image', 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg', true);
    updateOrCreateMeta('og:image:width', '400', true);
    updateOrCreateMeta('og:image:height', '400', true);
    updateOrCreateMeta('og:image:alt', `${fund.name} - Portuguese Golden Visa Investment Fund`, true);
    updateOrCreateMeta('og:locale', 'en_US', true);

    // Update Twitter Card meta tags
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:site', '@movingtoio');
    updateOrCreateMeta('twitter:creator', '@movingtoio');
    updateOrCreateMeta('twitter:title', ogTitle);
    updateOrCreateMeta('twitter:description', twitterDescription);
    updateOrCreateMeta('twitter:image', 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg');
    updateOrCreateMeta('twitter:image:alt', `${fund.name} - Portuguese Golden Visa Investment Fund`);

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

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('fund-page-schema');
    };
  }, [fund]);

  return null; // This component doesn't render anything
};

export default FundDetailsSEO;
