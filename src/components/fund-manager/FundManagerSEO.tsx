
import React, { useEffect } from 'react';
import { FundManagerData, useFundManagerStructuredData } from '../../hooks/useFundManagerStructuredData';

interface FundManagerSEOProps {
  managerData: FundManagerData;
}

const FundManagerSEO: React.FC<FundManagerSEOProps> = ({ managerData }) => {
  // Add structured data using our hook
  useFundManagerStructuredData(managerData);

  useEffect(() => {
    // Set page title for SEO
    document.title = `${managerData.name} Golden Visa Investment Funds | Fund Manager Profile`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Discover ${managerData.name}'s ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets. Compare funds and investment strategies.`
      );
    } else {
      // Create meta description if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `Discover ${managerData.name}'s ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets. Compare funds and investment strategies.`;
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

    updateOrCreateMeta('og:title', `${managerData.name} | Fund Manager Profile`);
    updateOrCreateMeta('og:description', `Learn about ${managerData.name}, managing ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets.`);
    updateOrCreateMeta('og:type', 'website');
    updateOrCreateMeta('og:url', `${window.location.origin}/manager/${encodeURIComponent(managerData.name)}`);
    if (managerData.logo) {
      updateOrCreateMeta('og:image', managerData.logo);
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
    updateOrCreateTwitterMeta('twitter:title', `${managerData.name} | Fund Manager Profile`);
    updateOrCreateTwitterMeta('twitter:description', `Learn about ${managerData.name}, managing ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets.`);
    if (managerData.logo) {
      updateOrCreateTwitterMeta('twitter:image', managerData.logo);
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [managerData]);

  return null; // This component doesn't render anything
};

export default FundManagerSEO;
