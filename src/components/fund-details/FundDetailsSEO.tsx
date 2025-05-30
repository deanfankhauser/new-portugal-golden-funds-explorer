
import { useEffect } from 'react';
import { Fund } from '../../data/funds';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundDetailsSEOProps {
  fund: Fund;
}

const FundDetailsSEO: React.FC<FundDetailsSEOProps> = ({ fund }) => {
  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = `${fund.name} | Investment Fund Details | Movingto`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Invest in ${fund.name} - ${fund.description} Minimum investment: €${fund.minimumInvestment.toLocaleString()}. Target return: ${fund.returnTarget}. Managed by ${fund.managerName}.`
      );
    } else {
      // Create meta description if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `Invest in ${fund.name} - ${fund.description} Minimum investment: €${fund.minimumInvestment.toLocaleString()}. Target return: ${fund.returnTarget}. Managed by ${fund.managerName}.`;
      document.head.appendChild(meta);
    }

    // Add Open Graph meta tags for social sharing
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

    updateOrCreateMeta('og:title', `${fund.name} | Investment Fund`);
    updateOrCreateMeta('og:description', fund.description);
    updateOrCreateMeta('og:type', 'website');
    updateOrCreateMeta('og:url', URL_CONFIG.buildFundUrl(fund.id));
    if (fund.managerLogo) {
      updateOrCreateMeta('og:image', fund.managerLogo);
    }

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
    updateOrCreateTwitterMeta('twitter:title', `${fund.name} | Investment Fund`);
    updateOrCreateTwitterMeta('twitter:description', fund.description);
    if (fund.managerLogo) {
      updateOrCreateTwitterMeta('twitter:image', fund.managerLogo);
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [fund]);

  return null; // This component doesn't render anything
};

export default FundDetailsSEO;
