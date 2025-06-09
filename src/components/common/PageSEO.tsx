
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface PageSEOProps {
  pageType: 'homepage' | 'fund' | 'manager' | 'category' | 'tag' | '404' | 'disclaimer' | 'about' | 'faqs' | 'privacy' | 'comparison' | 'comparisons-hub' | 'fund-comparison' | 'roi-calculator' | 'fund-quiz' | 'managers-hub' | 'categories-hub' | 'tags-hub';
  fundName?: string;
  managerName?: string;
  categoryName?: string;
  tagName?: string;
  comparisonTitle?: string;
}

const PageSEO: React.FC<PageSEOProps> = ({ 
  pageType, 
  fundName, 
  managerName, 
  categoryName, 
  tagName,
  comparisonTitle
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

      case '404':
        return {
          title: 'Page Not Found | Portugal Golden Visa Investment Funds',
          description: 'The page you are looking for could not be found. Return to our Golden Visa investment funds directory.',
          url: baseUrl,
          structuredData: {}
        };

      case 'disclaimer':
        return {
          title: 'Disclaimer | Portugal Golden Visa Investment Funds',
          description: 'Important disclaimer and legal information about using our Golden Visa investment funds directory.',
          url: `${baseUrl}/disclaimer`,
          structuredData: {}
        };

      case 'about':
        return {
          title: 'About the Golden Visa Funds Directory | Movingto',
          description: 'Learn more about the Movingto Golden Visa Funds Directory and how it can help you find the right fund for you.',
          url: `${baseUrl}/about`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            'name': 'About Portugal Golden Visa Funds',
            'description': 'Learn about our mission to help investors find the best Portugal Golden Visa investment funds'
          }
        };

      case 'faqs':
        return {
          title: 'Portugal Golden Visa Investment Funds FAQs',
          description: 'Frequently asked questions about Portugal Golden Visa Investment Funds. Learn about eligibility, requirements, and how to invest.',
          url: `${baseUrl}/faqs`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'name': 'Portugal Golden Visa Investment Funds FAQs',
            'description': 'Frequently asked questions about Portugal Golden Visa investment funds and the application process'
          }
        };

      case 'privacy':
        return {
          title: 'Privacy Policy | MovingTo Portugal Golden Visa Funds',
          description: 'Our privacy policy and how we handle your personal information when using the Portugal Golden Visa Funds directory.',
          url: `${baseUrl}/privacy`,
          structuredData: {}
        };

      case 'comparison':
        return {
          title: 'Compare Funds | Portugal Golden Visa Investment Funds',
          description: 'Compare Portugal Golden Visa investment funds side-by-side. Analyze fees, returns, minimum investments, and more.',
          url: `${baseUrl}/compare`,
          structuredData: {}
        };

      case 'comparisons-hub':
        return {
          title: 'Fund Comparisons Hub | Portugal Golden Visa Investment Funds',
          description: 'Browse detailed fund comparisons for Portugal Golden Visa investment funds.',
          url: `${baseUrl}/comparisons`,
          structuredData: {}
        };

      case 'fund-comparison':
        return {
          title: `${comparisonTitle} | Fund Comparison`,
          description: `Detailed comparison of Portugal Golden Visa investment funds: ${comparisonTitle}`,
          url: `${baseUrl}/compare/${comparisonTitle?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {}
        };

      case 'roi-calculator':
        return {
          title: 'ROI Calculator | Portugal Golden Visa Investment Funds',
          description: 'Calculate potential returns on Portugal Golden Visa fund investments with our free ROI calculator.',
          url: `${baseUrl}/roi-calculator`,
          structuredData: {}
        };

      case 'fund-quiz':
        return {
          title: 'Fund Quiz | Find Your Perfect Golden Visa Investment',
          description: 'Take our quiz to get personalized Portugal Golden Visa fund recommendations based on your investment profile.',
          url: `${baseUrl}/fund-quiz`,
          structuredData: {}
        };

      case 'managers-hub':
        return {
          title: 'Fund Managers | Portugal Golden Visa Investment Funds',
          description: 'Browse fund managers offering Portugal Golden Visa investment opportunities.',
          url: `${baseUrl}/managers`,
          structuredData: {}
        };

      case 'categories-hub':
        return {
          title: 'Fund Categories | Portugal Golden Visa Investment Funds',
          description: 'Explore different categories of Portugal Golden Visa investment funds.',
          url: `${baseUrl}/categories`,
          structuredData: {}
        };

      case 'tags-hub':
        return {
          title: 'Fund Tags | Portugal Golden Visa Investment Funds',
          description: 'Browse funds by tags to find the perfect Portugal Golden Visa investment.',
          url: `${baseUrl}/tags`,
          structuredData: {}
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
