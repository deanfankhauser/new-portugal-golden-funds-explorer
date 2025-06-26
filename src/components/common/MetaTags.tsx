
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { SEOData } from '../../types/seo';

interface MetaTagsProps {
  seoData: SEOData;
}

const MetaTags: React.FC<MetaTagsProps> = ({ seoData }) => {
  const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';

  // Enhanced title update with multiple fallbacks
  useEffect(() => {
    const updateTitle = () => {
      try {
        document.title = seoData.title;
        
        const titleTags = document.querySelectorAll('title');
        titleTags.forEach(tag => {
          tag.textContent = seoData.title;
        });
        
        console.log('MetaTags: Updated document title to:', seoData.title);
      } catch (error) {
        console.error('MetaTags: Error updating title:', error);
      }
    };
    
    updateTitle();
    
    const timers = [
      setTimeout(updateTitle, 10),
      setTimeout(updateTitle, 50),
      setTimeout(updateTitle, 100)
    ];
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [seoData.title]);

  return (
    <Helmet>
      {/* Enhanced Title & Description */}
      <title key="title">{seoData.title}</title>
      <meta key="description" name="description" content={seoData.description} />
      
      {/* Enhanced Meta Tags */}
      <meta name="author" content="Dean Fankhauser, CEO - Movingto" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={seoData.url} />
      
      {/* Enhanced Keywords */}
      <meta name="keywords" content="Portugal Golden Visa, investment funds, Portuguese residency, Golden Visa funds 2025, fund comparison, investment migration, Portugal investment, fund managers, minimum investment, Golden Visa requirements" />
      
      {/* Enhanced Open Graph */}
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={seoData.title} />
      <meta key="og:description" property="og:description" content={seoData.description} />
      <meta key="og:url" property="og:url" content={seoData.url} />
      <meta property="og:site_name" content="Movingto - Portugal Golden Visa Funds" />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content="Movingto - Portugal Golden Visa Investment Funds Platform" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Enhanced Twitter Card */}
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@movingtoio" />
      <meta name="twitter:creator" content="@movingtoio" />
      <meta key="twitter:title" name="twitter:title" content={seoData.title} />
      <meta key="twitter:description" name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={defaultImage} />
      <meta name="twitter:image:alt" content="Portugal Golden Visa Investment Funds Directory" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-TileColor" content="#EF4444" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Movingto Funds" />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="PT" />
      <meta name="geo.country" content="Portugal" />
      <meta name="ICBM" content="39.3999, -8.2245" />
      
      {/* Enhanced Structured Data */}
      {seoData.structuredData && Object.keys(seoData.structuredData).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData, null, 2)}
        </script>
      )}
      
      {/* Preload Critical Resources */}
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
      <link rel="preload" href={defaultImage} as="image" />
      
      {/* DNS Prefetch for External Resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//pbs.twimg.com" />
    </Helmet>
  );
};

export default MetaTags;
