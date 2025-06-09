
import React from 'react';
import { Helmet } from 'react-helmet';
import { StructuredDataService } from '../../services/structuredDataService';
import { SEOService } from '../../services/seoService';

interface PageSEOProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  imageUrl?: string;
  imageAlt?: string;
  schemas?: any[];
  schemaId?: string;
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  imageUrl = 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg',
  imageAlt = 'Portugal Golden Visa Investment Funds',
  schemas = [],
  schemaId
}) => {
  React.useEffect(() => {
    // Initialize SEO services
    SEOService.initializeSEO(canonicalUrl);
    
    // Add structured data if provided
    if (schemas.length > 0 && schemaId) {
      StructuredDataService.addStructuredData(schemas, schemaId);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Cleanup function
    return () => {
      if (schemaId) {
        StructuredDataService.removeStructuredData(schemaId);
      }
    };
  }, [canonicalUrl, schemas, schemaId]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="Dean Fankhauser, CEO" />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Movingto Portugal Golden Visa Funds" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@movingtoio" />
      <meta name="twitter:creator" content="@movingtoio" />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default PageSEO;
