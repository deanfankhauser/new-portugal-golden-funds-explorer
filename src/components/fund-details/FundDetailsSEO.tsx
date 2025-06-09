
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
    
    // Function to remove existing meta tags before setting new ones
    const removeExistingMeta = (selector: string) => {
      const existing = document.querySelectorAll(selector);
      existing.forEach(meta => meta.remove());
    };

    // Function to create new meta tag
    const createMeta = (name: string, content: string, useProperty = false) => {
      const meta = document.createElement('meta');
      if (useProperty) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      meta.content = content;
      document.head.appendChild(meta);
    };

    // Remove and recreate meta tags to ensure they override index.html defaults
    removeExistingMeta('meta[name="description"]');
    removeExistingMeta('meta[name="keywords"]'); 
    removeExistingMeta('meta[name="robots"]');
    createMeta('description', metaDescription);
    createMeta('keywords', keywords);
    createMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Remove and recreate Open Graph meta tags
    removeExistingMeta('meta[property="og:title"]');
    removeExistingMeta('meta[property="og:description"]');
    removeExistingMeta('meta[property="og:type"]');
    removeExistingMeta('meta[property="og:url"]');
    removeExistingMeta('meta[property="og:site_name"]');
    removeExistingMeta('meta[property="og:image"]');
    removeExistingMeta('meta[property="og:image:width"]');
    removeExistingMeta('meta[property="og:image:height"]');
    removeExistingMeta('meta[property="og:image:alt"]');
    removeExistingMeta('meta[property="og:locale"]');
    
    createMeta('og:title', ogTitle, true);
    createMeta('og:description', ogDescription, true);
    createMeta('og:type', 'website', true);
    createMeta('og:url', currentUrl, true);
    createMeta('og:site_name', 'Movingto Portugal Golden Visa Funds', true);
    createMeta('og:image', 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg', true);
    createMeta('og:image:width', '400', true);
    createMeta('og:image:height', '400', true);
    createMeta('og:image:alt', `${fund.name} - Portuguese Golden Visa Investment Fund`, true);
    createMeta('og:locale', 'en_US', true);

    // Remove and recreate Twitter Card meta tags
    removeExistingMeta('meta[name="twitter:card"]');
    removeExistingMeta('meta[name="twitter:site"]');
    removeExistingMeta('meta[name="twitter:creator"]');
    removeExistingMeta('meta[name="twitter:title"]');
    removeExistingMeta('meta[name="twitter:description"]');
    removeExistingMeta('meta[name="twitter:image"]');
    removeExistingMeta('meta[name="twitter:image:alt"]');
    
    createMeta('twitter:card', 'summary_large_image');
    createMeta('twitter:site', '@movingtoio');
    createMeta('twitter:creator', '@movingtoio');
    createMeta('twitter:title', ogTitle);
    createMeta('twitter:description', twitterDescription);
    createMeta('twitter:image', 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg');
    createMeta('twitter:image:alt', `${fund.name} - Portuguese Golden Visa Investment Fund`);

    // Add canonical URL
    removeExistingMeta('link[rel="canonical"]');
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = currentUrl;
    document.head.appendChild(canonical);

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
