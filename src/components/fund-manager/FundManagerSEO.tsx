
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FundManagerData, useFundManagerStructuredData } from '../../hooks/useFundManagerStructuredData';
import { SEOService } from '../../services/seoService';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundManagerSEOProps {
  managerData: FundManagerData;
}

const FundManagerSEO: React.FC<FundManagerSEOProps> = ({ managerData }) => {
  // Add structured data using our hook
  useFundManagerStructuredData(managerData);

  const pageUrl = URL_CONFIG.buildManagerUrl(managerData.name);
  const title = `${managerData.name} Golden Visa Investment Funds | Fund Manager Profile`;
  const description = SEOService.optimizeMetaDescription(
    `Discover ${managerData.name}'s ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets. Compare funds and investment strategies.`,
    ['Golden Visa', managerData.name, 'Investment Funds', 'Portugal']
  );
  const socialImageUrl = managerData.logo || 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg';

  useEffect(() => {
    // Initialize comprehensive SEO setup
    SEOService.initializeSEO(pageUrl);

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [managerData, pageUrl]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${managerData.name}, Golden Visa, Investment Funds, Portugal, Fund Manager, ${managerData.fundsCount} funds`} />
      <meta name="author" content="Dean Fankhauser, CEO" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${managerData.name} | Fund Manager Profile`} />
      <meta property="og:description" content={`Learn about ${managerData.name}, managing ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets.`} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Movingto" />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content={`${managerData.name} - Fund Manager Profile`} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@movingtoio" />
      <meta name="twitter:creator" content="@movingtoio" />
      <meta name="twitter:title" content={`${managerData.name} | Fund Manager Profile`} />
      <meta name="twitter:description" content={`Learn about ${managerData.name}, managing ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets.`} />
      <meta name="twitter:image" content={socialImageUrl} />
      <meta name="twitter:image:alt" content={`${managerData.name} - Fund Manager Profile`} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-TileColor" content="#EF4444" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

export default FundManagerSEO;
