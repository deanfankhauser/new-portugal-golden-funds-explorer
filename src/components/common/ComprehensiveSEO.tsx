
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSEOOptimization } from '../../hooks/useSEOOptimization';

interface ComprehensiveSEOProps {
  title: string;
  description: string;
  url: string;
  type: 'fund' | 'category' | 'homepage';
  data?: any;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

const ComprehensiveSEO: React.FC<ComprehensiveSEOProps> = ({
  title,
  description,
  url,
  type,
  data,
  image,
  keywords = [],
  noIndex = false
}) => {
  const { initializePageSEO } = useSEOOptimization();
  const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';

  useEffect(() => {
    // Initialize comprehensive SEO
    initializePageSEO({
      title,
      description,
      url,
      type,
      data,
      image: image || defaultImage
    });
  }, [title, description, url, type, data, image, initializePageSEO]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      <link rel="canonical" href={url} />
      
      {/* Keywords (if provided) */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Author and Publisher */}
      <meta name="author" content="Dean Fankhauser, CEO" />
      <meta name="publisher" content="Movingto" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content="Movingto - Golden Visa Investment Funds" />
      <meta property="og:site_name" content="Movingto" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@movingtoio" />
      <meta name="twitter:creator" content="@movingtoio" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:image:alt" content="Movingto - Golden Visa Investment Funds" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-TileColor" content="#EF4444" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="https://pbs.twimg.com" />
    </Helmet>
  );
};

export default ComprehensiveSEO;
