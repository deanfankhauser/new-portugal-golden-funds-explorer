import { SEOData } from '../types';
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../constants';
import { optimizeText } from '../utils';

const BASE_URL = 'https://funds.movingto.com';

/**
 * Generate 404 page SEO data with proper structured data
 */
export function getNotFoundSeo(): SEOData {
  const title = optimizeText('Page Not Found | Portugal Golden Visa Funds | Movingto', MAX_TITLE_LENGTH);
  const description = optimizeText(
    'The page you are looking for could not be found. Browse our Portugal Golden Visa investment fund directory to compare funds by performance, fees, and risk.',
    MAX_DESCRIPTION_LENGTH
  );

  return {
    title,
    description,
    url: `${BASE_URL}/404`,
    canonical: `${BASE_URL}/404`,
    robots: 'noindex, follow',
    keywords: [
      'Portugal Golden Visa funds',
      'investment fund directory',
      'compare funds',
      'fund comparison'
    ],
    structuredData: getNotFoundStructuredData()
  };
}

/**
 * Generate structured data for 404 error page
 * Uses WebPage schema with appropriate error context
 */
function getNotFoundStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Page Not Found',
    description: 'The requested page could not be found on Movingto Funds.',
    url: `${BASE_URL}/404`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Movingto Funds',
      url: BASE_URL,
      description: 'Compare Portugal Golden Visa investment funds by performance, fees, risk, strategy and minimum ticket.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Page Not Found'
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Suggested Pages',
      description: 'Pages you might be looking for',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Browse All Funds',
          url: BASE_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Fund Categories',
          url: `${BASE_URL}/categories`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Investment Tags',
          url: `${BASE_URL}/tags`
        }
      ]
    }
  };
}
