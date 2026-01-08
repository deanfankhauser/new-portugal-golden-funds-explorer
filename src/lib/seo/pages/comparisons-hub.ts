import { SEOData } from '../types';
import { optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { getSitewideSchemas } from '../schemas';
import { SEO_CONFIG } from '@/config/company';

/**
 * SEO data for the /comparisons hub page
 * This is the SEO discovery page for fund comparisons
 */
export function getComparisonsHubSeo(): SEOData {
  const year = SEO_CONFIG.currentYear;
  
  return {
    title: `Compare Portugal Golden Visa Funds (${year}) | Movingto Funds`,
    description: optimizeDescription('Compare Portugal Golden Visa investment funds with 100+ side-by-side comparisons. Filter by strategy, fees, and terms to build your shortlist.'),
    url: URL_CONFIG.buildUrl('/comparisons'),
    canonical: URL_CONFIG.buildUrl('/comparisons'),
    robots: 'noindex, follow',
    keywords: [
      'Portugal Golden Visa fund comparisons',
      'compare Golden Visa funds',
      'fund comparison directory',
      'side by side fund analysis',
      'Golden Visa investment comparison',
      'compare Portugal investment funds'
    ],
    structuredData: getComparisonsHubStructuredData()
  };
}

function getComparisonsHubStructuredData(): any {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Fund Comparisons', 'item': URL_CONFIG.buildUrl('/comparisons') }
    ]
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Portugal Golden Visa Fund Comparisons',
    'description': 'Browse and explore side-by-side comparisons of Portugal Golden Visa investment funds',
    'url': URL_CONFIG.buildUrl('/comparisons')
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How many fund comparisons are available?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We maintain over 100 pre-built fund comparisons covering all major Portugal Golden Visa investment strategies including private equity, venture capital, real estate, and debt funds.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What metrics are compared in each analysis?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Each comparison analyzes minimum investment, management fees, performance fees, lock-up periods, liquidity terms, regulatory status, and Golden Visa eligibility requirements.'
        }
      }
    ]
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    webPageSchema,
    faqSchema
  ];
}
