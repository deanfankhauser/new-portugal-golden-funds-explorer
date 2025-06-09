import { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { SEOService } from '../../services/seoService';
import { AIOptimizationService } from '../../services/aiOptimizationService';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundDetailsSEOProps {
  fund: Fund;
}

const FundDetailsSEO: React.FC<FundDetailsSEOProps> = ({ fund }) => {
  useEffect(() => {
    const currentUrl = URL_CONFIG.buildFundUrl(fund.id);
    
    // Initialize comprehensive SEO
    SEOService.initializeSEO(currentUrl);

    // Set optimized page title and meta description
    const optimizedTitle = `${fund.name} | Investment Fund Details | Movingto`;
    document.title = optimizedTitle;
    
    // Generate optimized meta description with key metrics (keep under 155 chars)
    const optimizedDescription = SEOService.optimizeMetaDescription(
      `${fund.name} - ${fund.description.length > 50 ? fund.description.substring(0, 50) + '...' : fund.description} Min: €${fund.minimumInvestment.toLocaleString()}.`,
      []
    );
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', optimizedDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = optimizedDescription;
      document.head.appendChild(meta);
    }

    // Add AI-readable fund summary as meta tag
    const fundSummary = AIOptimizationService.generateFundSummary(fund);
    const summaryMeta = document.createElement('meta');
    summaryMeta.name = 'fund-summary';
    summaryMeta.content = fundSummary;
    document.head.appendChild(summaryMeta);

    // Add key metrics as JSON-LD for AI parsing
    const keyMetrics = AIOptimizationService.extractKeyMetrics(fund);
    const keyMetricsMeta = document.createElement('script');
    keyMetricsMeta.type = 'application/ld+json';
    keyMetricsMeta.id = 'fund-metrics';
    keyMetricsMeta.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      'name': `${fund.name} Key Metrics`,
      'description': 'Machine-readable fund metrics for AI systems',
      'variableMeasured': keyMetrics
    });
    document.head.appendChild(keyMetricsMeta);

    // Update Open Graph meta tags with proper fallback image
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    const fallbackImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';

    updateOrCreateMeta('og:title', optimizedTitle);
    updateOrCreateMeta('og:description', optimizedDescription);
    updateOrCreateMeta('og:type', 'website');
    updateOrCreateMeta('og:url', currentUrl);
    updateOrCreateMeta('og:image', fallbackImage);
    updateOrCreateMeta('og:site_name', 'Movingto Portugal Golden Visa Funds');

    // Add Twitter Card meta tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
    updateOrCreateTwitterMeta('twitter:site', '@movingtoio');
    updateOrCreateTwitterMeta('twitter:title', optimizedTitle);
    updateOrCreateTwitterMeta('twitter:description', optimizedDescription);
    updateOrCreateTwitterMeta('twitter:image', fallbackImage);

    // Generate comprehensive structured data (avoid duplicates by using different schemas)
    const schemas = [
      StructuredDataService.generateFundProductSchema(fund),
      StructuredDataService.generateFundManagerSchema(fund),
      StructuredDataService.generateInvestmentSchema(fund),
      StructuredDataService.generateFundPageSchema(fund),
      ...EnhancedStructuredDataService.generateComprehensiveFundSchemas(fund),
      EnhancedStructuredDataService.generateWebSiteSchema(),
      EnhancedStructuredDataService.generateOrganizationSchema(),
      EnhancedStructuredDataService.generateArticleSchema(
        `${fund.name} Investment Fund Details`,
        optimizedDescription,
        currentUrl
      )
    ];

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, 'fund-page-schema');

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('fund-page-schema');
      
      // Remove custom meta tags
      const summaryMetaElement = document.getElementById('fund-metrics');
      if (summaryMetaElement) {
        summaryMetaElement.remove();
      }
      
      const fundSummaryMeta = document.querySelector('meta[name="fund-summary"]');
      if (fundSummaryMeta) {
        fundSummaryMeta.remove();
      }
    };
  }, [fund]);

  return null; // This component doesn't render anything
};

export default FundDetailsSEO;
