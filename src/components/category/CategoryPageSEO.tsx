
import React from 'react';
import { Helmet } from 'react-helmet';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { SEOService } from '../../services/seoService';
import { URL_CONFIG } from '../../utils/urlConfig';

interface CategoryPageSEOProps {
  categoryName: string;
  categorySlug: string;
  fundsCount: number;
  funds: Fund[];
}

const CategoryPageSEO: React.FC<CategoryPageSEOProps> = ({ 
  categoryName, 
  categorySlug, 
  fundsCount, 
  funds 
}) => {
  const pageUrl = URL_CONFIG.buildCategoryUrl(categorySlug);
  const title = `Top ${categoryName} Golden Visa Funds | Movingto`;
  const description = SEOService.optimizeMetaDescription(
    `Discover ${categoryName} Golden Visa funds. Browse and compare ${fundsCount} funds to find the best Golden Visa investment for you.`,
    [categoryName, 'Golden Visa', 'Portugal', 'Investment Funds']
  );
  const socialImageUrl = 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg';

  React.useEffect(() => {
    // Initialize comprehensive SEO setup
    SEOService.initializeSEO(pageUrl);

    // Generate enhanced structured data schemas
    const schemas = [
      // WebSite schema
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL,
        'description': 'Find and compare the best Golden Visa investment funds in Portugal',
        'publisher': {
          '@type': 'Organization',
          'name': 'Movingto',
          'url': URL_CONFIG.BASE_URL
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      
      // Organization schema
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL,
        'logo': socialImageUrl,
        'description': 'Leading platform for Golden Visa investment fund comparison and research',
        'founder': {
          '@type': 'Person',
          'name': 'Dean Fankhauser'
        },
        'knowsAbout': ['Golden Visa', 'Portugal Investment', 'Investment Funds', 'Immigration'],
        'serviceArea': {
          '@type': 'Place',
          'name': 'Worldwide'
        }
      },

      // CollectionPage schema (enhanced)
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': pageUrl
        },
        'name': `${categoryName} Golden Visa Investment Funds`,
        'description': description,
        'numberOfItems': fundsCount,
        'author': {
          '@type': 'Person',
          'name': 'Dean Fankhauser',
          'jobTitle': 'CEO',
          'worksFor': {
            '@type': 'Organization',
            'name': 'Movingto'
          }
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Movingto',
          'url': URL_CONFIG.BASE_URL
        },
        'dateModified': new Date().toISOString(),
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': fundsCount,
          'itemListElement': funds.map((fund, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'FinancialProduct',
              'name': fund.name,
              'description': fund.description,
              'url': URL_CONFIG.buildFundUrl(fund.id),
              'category': fund.category,
              'provider': {
                '@type': 'Organization',
                'name': fund.managerName
              },
              'offers': {
                '@type': 'Offer',
                'price': fund.minimumInvestment,
                'priceCurrency': 'EUR'
              }
            }
          }))
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': URL_CONFIG.BASE_URL
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Categories',
              'item': URL_CONFIG.buildUrl('categories')
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': categoryName,
              'item': pageUrl
            }
          ]
        }
      },

      // Article schema for content
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': title,
        'description': description,
        'author': {
          '@type': 'Person',
          'name': 'Dean Fankhauser',
          'jobTitle': 'CEO'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Movingto',
          'logo': {
            '@type': 'ImageObject',
            'url': socialImageUrl
          }
        },
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString(),
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': pageUrl
        },
        'articleSection': 'Investment Funds',
        'keywords': [categoryName, 'Golden Visa', 'Portugal', 'Investment Funds', 'Immigration'].join(', ')
      }
    ];

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, `category-${categorySlug}`);

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData(`category-${categorySlug}`);
    };
  }, [categoryName, categorySlug, fundsCount, funds, pageUrl, title, description]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${categoryName}, Golden Visa, Portugal, Investment Funds, Immigration, ${categoryName} funds`} />
      <meta name="author" content="Dean Fankhauser, CEO" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Movingto" />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:alt" content="Movingto - Golden Visa Investment Funds" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@movingtoio" />
      <meta name="twitter:creator" content="@movingtoio" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImageUrl} />
      <meta name="twitter:image:alt" content="Movingto - Golden Visa Investment Funds" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-TileColor" content="#EF4444" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

export default CategoryPageSEO;
