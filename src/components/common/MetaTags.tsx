
import React from 'react';
import { Helmet } from 'react-helmet';
import { SEOData } from '../../types/seo';

interface MetaTagsProps {
  seoData: SEOData;
}

const MetaTags: React.FC<MetaTagsProps> = ({ seoData }) => {
  const defaultImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';

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

export default MetaTags;
