import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { MAX_TITLE_LENGTH } from '../constants';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas';
import { checkComparisonIndexability } from '@/lib/indexability';

/**
 * SEO data for the /compare tool page
 * This is a noindex utility page - users build their own comparisons here
 * The SEO hub is /comparisons (see comparisons-hub.ts)
 */
export function getComparisonSeo(): SEOData {
  return {
    title: 'Build Your Fund Comparison | Movingto Funds',
    description: optimizeDescription('Select funds to compare side-by-side. Analyze fees, minimums, lock-up periods, and terms to build your shortlist.'),
    url: URL_CONFIG.buildUrl('/compare'),
    canonical: URL_CONFIG.buildUrl('/compare'),
    robots: 'noindex, follow',
    structuredData: null // No structured data for noindex pages
  };
}

export function getFundComparisonSeo(fund1: Fund, fund2: Fund, normalizedSlug: string): SEOData {
  const indexability = checkComparisonIndexability(fund1, fund2, normalizedSlug);
  
  const cat1 = fund1.category || 'Investment';
  const cat2 = fund2.category || 'Investment';
  
  // Build title per new format: "{Fund A} vs {Fund B} (2026) | Fees & Terms | Movingto Funds"
  let title = `${fund1.name} vs ${fund2.name} (2026) | Fees & Terms | Movingto Funds`;
  if (title.length > MAX_TITLE_LENGTH) {
    // Fallback: shorter format
    title = `${fund1.name} vs ${fund2.name} (2026) | Movingto Funds`;
    if (title.length > MAX_TITLE_LENGTH) {
      title = `${fund1.name} vs ${fund2.name} (2026)`;
    }
  }
  
  // Enhanced description per recommendations
  const description = `Compare ${fund1.name} and ${fund2.name} for the €500k route: strategy, fees, liquidity terms, timeline, and key risks to review.`;
  
  return {
    title: optimizeTitle(title),
    description: optimizeDescription(description),
    url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    canonical: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    robots: indexability.robots,
    keywords: [
      fund1.name,
      fund2.name,
      'fund comparison',
      'Golden Visa comparison',
      `${cat1} vs ${cat2}`,
      'Portugal investment funds',
      'compare fund fees'
    ],
    structuredData: getFundComparisonStructuredData(fund1, fund2, normalizedSlug)
  };
}

export function getFundComparisonFallbackSeo(normalizedSlug: string): SEOData {
  return {
    title: optimizeTitle('Compare Portugal Golden Visa Investment Funds | Movingto'),
    description: optimizeDescription('Compare two Portugal Golden Visa investment funds. Analyze fees, minimums, returns, and lock-up periods to find your ideal investment.'),
    url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    canonical: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    structuredData: getGenericComparisonStructuredData(normalizedSlug)
  };
}

function getComparisonStructuredData(): any {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Compare Funds', 'item': URL_CONFIG.buildUrl('/compare') }
    ]
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Compare Portugal Golden Visa Investment Funds',
    'description': 'Side-by-side comparison tool for Portugal Golden Visa investment funds',
    'url': URL_CONFIG.buildUrl('/compare')
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How do I compare Golden Visa funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Use our comparison tool to analyze funds side by side. Compare minimum investments, management fees, performance fees, lock-up periods, and manager track records to find the best fund for your investment goals.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What factors should I consider when comparing funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Key factors include minimum investment amount, fee structure (management and performance fees), liquidity terms, historical performance, fund manager experience, and whether the fund meets Golden Visa requirements.'
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

function getFundComparisonStructuredData(fund1: Fund, fund2: Fund, normalizedSlug: string): any {
  const comparisonUrl = URL_CONFIG.buildComparisonUrl(normalizedSlug);
  
  // BreadcrumbList for specific comparison
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Compare Funds', 'item': URL_CONFIG.buildUrl('/compare') },
      { '@type': 'ListItem', 'position': 3, 'name': `${fund1.name} vs ${fund2.name}`, 'item': comparisonUrl }
    ]
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': `Compare ${fund1.name} vs ${fund2.name}`,
    'description': `Detailed comparison of ${fund1.name} and ${fund2.name} for Portugal Golden Visa`,
    'url': comparisonUrl
  };

  // ItemList with both funds as FinancialProducts
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${fund1.name} vs ${fund2.name} Comparison`,
    'numberOfItems': 2,
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'item': {
          '@type': 'FinancialProduct',
          'name': fund1.name,
          'url': URL_CONFIG.buildFundUrl(fund1.id),
          'category': fund1.category,
          'offers': {
            '@type': 'Offer',
            'price': fund1.minimumInvestment || 500000,
            'priceCurrency': 'EUR'
          },
          'provider': {
            '@type': 'Organization',
            'name': fund1.managerName || 'Fund Manager'
          }
        }
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'item': {
          '@type': 'FinancialProduct',
          'name': fund2.name,
          'url': URL_CONFIG.buildFundUrl(fund2.id),
          'category': fund2.category,
          'offers': {
            '@type': 'Offer',
            'price': fund2.minimumInvestment || 500000,
            'priceCurrency': 'EUR'
          },
          'provider': {
            '@type': 'Organization',
            'name': fund2.managerName || 'Fund Manager'
          }
        }
      }
    ]
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    webPageSchema,
    itemListSchema
  ];
}

function getGenericComparisonStructuredData(normalizedSlug: string): any {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Compare Funds', 'item': URL_CONFIG.buildUrl('/compare') },
      { '@type': 'ListItem', 'position': 3, 'name': 'Fund Comparison', 'item': URL_CONFIG.buildComparisonUrl(normalizedSlug) }
    ]
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Compare Portugal Golden Visa Investment Funds',
    'description': 'Compare Portugal Golden Visa investment funds side by side',
    'url': URL_CONFIG.buildComparisonUrl(normalizedSlug)
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    webPageSchema
  ];
}
