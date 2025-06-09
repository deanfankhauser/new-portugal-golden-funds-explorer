
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
    // Use setTimeout to ensure DOM is ready and avoid timing issues
    const applyMetaTags = () => {
      const currentUrl = URL_CONFIG.buildFundUrl(fund.id);
      
      console.log('Setting SEO for fund:', fund.name);
      console.log('Current URL:', currentUrl);
      
      // Initialize comprehensive SEO
      SEOService.initializeSEO(currentUrl);

      // Generate fund-specific SEO content
      const metaTitle = FundSeoService.generateMetaTitle(fund);
      const metaDescription = FundSeoService.generateMetaDescription(fund);
      const ogTitle = FundSeoService.generateOGTitle(fund);
      const ogDescription = FundSeoService.generateOGDescription(fund);
      const twitterDescription = FundSeoService.generateTwitterDescription(fund);
      const keywords = FundSeoService.generateKeywords(fund);

      console.log('Generated meta title:', metaTitle);
      console.log('Generated meta description:', metaDescription);

      // Set page title
      document.title = metaTitle;
      
      // Clear existing meta tags completely
      const metaTagsToRemove = [
        'meta[name="description"]',
        'meta[name="keywords"]', 
        'meta[name="robots"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:type"]',
        'meta[property="og:url"]',
        'meta[property="og:site_name"]',
        'meta[property="og:image"]',
        'meta[property="og:image:width"]',
        'meta[property="og:image:height"]',
        'meta[property="og:image:alt"]',
        'meta[property="og:locale"]',
        'meta[name="twitter:card"]',
        'meta[name="twitter:site"]',
        'meta[name="twitter:creator"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
        'meta[name="twitter:image"]',
        'meta[name="twitter:image:alt"]',
        'link[rel="canonical"]'
      ];

      metaTagsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // Helper function to create and append meta tags
      const createMetaTag = (attributes: Record<string, string>) => {
        const meta = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => {
          meta.setAttribute(key, value);
        });
        document.head.appendChild(meta);
      };

      // Create all new meta tags
      createMetaTag({ name: 'description', content: metaDescription });
      createMetaTag({ name: 'keywords', content: keywords });
      createMetaTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });

      // Open Graph meta tags
      createMetaTag({ property: 'og:title', content: ogTitle });
      createMetaTag({ property: 'og:description', content: ogDescription });
      createMetaTag({ property: 'og:type', content: 'website' });
      createMetaTag({ property: 'og:url', content: currentUrl });
      createMetaTag({ property: 'og:site_name', content: 'Movingto Portugal Golden Visa Funds' });
      createMetaTag({ property: 'og:image', content: 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg' });
      createMetaTag({ property: 'og:image:width', content: '400' });
      createMetaTag({ property: 'og:image:height', content: '400' });
      createMetaTag({ property: 'og:image:alt', content: `${fund.name} - Portuguese Golden Visa Investment Fund` });
      createMetaTag({ property: 'og:locale', content: 'en_US' });

      // Twitter Card meta tags
      createMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
      createMetaTag({ name: 'twitter:site', content: '@movingtoio' });
      createMetaTag({ name: 'twitter:creator', content: '@movingtoio' });
      createMetaTag({ name: 'twitter:title', content: ogTitle });
      createMetaTag({ name: 'twitter:description', content: twitterDescription });
      createMetaTag({ name: 'twitter:image', content: 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg' });
      createMetaTag({ name: 'twitter:image:alt', content: `${fund.name} - Portuguese Golden Visa Investment Fund` });

      // Add canonical URL
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = currentUrl;
      document.head.appendChild(canonical);

      console.log('Meta tags applied successfully');

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
