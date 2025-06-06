
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
    
    // Generate optimized meta description with key metrics
    const keyMetrics = AIOptimizationService.extractKeyMetrics(fund);
    const optimizedDescription = SEOService.optimizeMetaDescription(
      `Invest in ${fund.name} - ${fund.description} Minimum investment: €${fund.minimumInvestment.toLocaleString()}. Target return: ${fund.returnTarget}. Managed by ${fund.managerName}.`,
      [fund.category, 'Golden Visa', 'Portugal Investment', `€${fund.minimumInvestment.toLocaleString()}`, fund.returnTarget]
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

    // Update Open Graph meta tags
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

    const defaultImage = 'https://cdn.prod.website-files.com/60a591ad1264ce6f84bf0fd8/66d7511a2f4c8bd3a07f8a64_66d74e88c74fb1c020fc9920_peaceful%2520village%2520portugal.webp';

    updateOrCreateMeta('og:title', optimizedTitle);
    updateOrCreateMeta('og:description', fund.description);
    updateOrCreateMeta('og:type', 'website');
    updateOrCreateMeta('og:url', currentUrl);
    updateOrCreateMeta('og:image', fund.managerLogo || defaultImage);

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
    updateOrCreateTwitterMeta('twitter:description', fund.description);
    updateOrCreateTwitterMeta('twitter:image', fund.managerLogo || defaultImage);

    // Generate comprehensive structured data
    const basicSchemas = [
      StructuredDataService.generateFundProductSchema(fund),
      StructuredDataService.generateFundManagerSchema(fund),
      StructuredDataService.generateInvestmentSchema(fund),
      StructuredDataService.generateFundPageSchema(fund)
    ];

    const enhancedSchemas = EnhancedStructuredDataService.generateComprehensiveFundSchemas(fund);
    
    const allSchemas = [...basicSchemas, ...enhancedSchemas];

    // Add structured data using our service
    StructuredDataService.addStructuredData(allSchemas, 'fund-page-schema');

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
