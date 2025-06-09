
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface PageSEOProps {
  pageType: 'homepage' | 'fund' | 'manager' | 'category' | 'tag';
  fundName?: string;
  managerName?: string;
  categoryName?: string;
  tagName?: string;
}

const PageSEO: React.FC<PageSEOProps> = ({ 
  pageType, 
  fundName, 
  managerName, 
  categoryName, 
  tagName 
}) => {
  const baseUrl = 'https://movingto.com/funds';
  const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
  
  const getSEOData = () => {
    switch (pageType) {
      case 'homepage':
        return {
          title: 'Portugal Golden Visa Investment Funds | Eligible Investments 2025',
          description: 'Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment.',
          url: baseUrl,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Movingto Portugal Golden Visa Funds',
            'url': baseUrl,
            'description': 'Find and compare the best Golden Visa investment funds in Portugal',
            'publisher': {
              '@type': 'Organization',
              'name': 'Movingto',
              'url': baseUrl
            }
          }
        };
      
      case 'fund':
        return {
          title: `${fundName} | Investment Fund Details | Movingto`,
          description: `${fundName} - Detailed information about this Golden Visa investment fund. Min investment, fees, returns and more.`,
          url: `${baseUrl}/funds/${fundName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            'name': fundName,
            'description': `Golden Visa investment fund: ${fundName}`,
            'provider': {
              '@type': 'Organization',
              'name': 'Fund Manager'
            }
          }
        };
      
      case 'manager':
        return {
          title: `${managerName} Golden Visa Investment Funds | Fund Manager Profile`,
          description: `Discover ${managerName}'s Golden Visa investment funds. Compare funds and investment strategies from this experienced fund manager.`,
          url: `${baseUrl}/manager/${managerName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': managerName,
            'description': `Fund manager specializing in Golden Visa investment funds`,
            'serviceArea': {
              '@type': 'Place',
              'name': 'Portugal'
            }
          }
        };
      
      case 'category':
        return {
          title: `Top ${categoryName} Golden Visa Funds | Movingto`,
          description: `Discover ${categoryName} Golden Visa funds. Browse and compare funds to find the best Golden Visa investment for you.`,
          url: `${baseUrl}/categories/${categoryName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': `${categoryName} Golden Visa Investment Funds`,
            'description': `Collection of ${categoryName} Golden Visa investment funds`
          }
        };
      
      case 'tag':
        return {
          title: `Top ${tagName} Golden Visa Funds | Movingto`,
          description: `Discover ${tagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`,
          url: `${baseUrl}/tags/${tagName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': `${tagName} Golden Visa Investment Funds`,
            'description': `Collection of ${tagName} Golden Visa investment funds`
          }
        };
      
      default:
        return {
          title: 'Portugal Golden Visa Investment Funds | Movingto',
          description: 'Find and compare the best Golden Visa investment funds in Portugal',
          url: baseUrl,
          structuredData: {}
        };
    }
  };

  const seoData = getSEOData();

  // Debug logging to track meta tag updates
  useEffect(() => {
    console.log(`SEO: Setting meta tags for ${pageType}`, {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url
    });
    
    // Force a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      console.log('SEO: Meta tags should now be updated');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pageType, seoData.title, seoData.description, seoData.url]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="author" content="Dean Fankhauser, CEO" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={seoData.url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:url" content={seoData.url} />
      <meta property="og:site_name" content="Movingto" />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content="Movingto - Golden Visa Investment Funds" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@movingtoio" />
      <meta name="twitter:creator" content="@movingtoio" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={defaultImage} />
      <meta name="twitter:image:alt" content="Movingto - Golden Visa Investment Funds" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-TileColor" content="#EF4444" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {Object.keys(seoData.structuredData).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData, null, 2)}
        </script>
      )}
    </Helmet>
  );
};

export default PageSEO;
