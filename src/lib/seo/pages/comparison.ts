import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getComparisonSeo(): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa Fund Comparison Tool – Compare Any Two Funds | Movingto Funds'),
    description: optimizeDescription('Compare Portugal Golden Visa funds side by side. Check performance, fees, risk, liquidity, minimum investment and more before choosing your fund.'),
    url: URL_CONFIG.buildUrl('/compare'),
    canonical: URL_CONFIG.buildUrl('/compare'),
    keywords: [
      'Golden Visa fund comparison',
      'compare investment funds Portugal',
      'fund comparison tool',
      'investment fund analysis',
      'Golden Visa fund comparison tool',
      'side-by-side fund comparison'
    ],
    structuredData: getComparisonStructuredData()
  };
}

export function getFundComparisonSeo(fund1: Fund, fund2: Fund, normalizedSlug: string): SEOData {
  return {
    title: optimizeTitle(`${fund1.name} vs ${fund2.name} | Portugal Golden Visa Fund Comparison`),
    description: optimizeDescription(`Compare ${fund1.name} and ${fund2.name} for the Portugal Golden Visa. Review minimum investment, fees, target returns, lock-up periods, and risk side by side.`),
    url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    canonical: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    robots: 'index, follow',
    keywords: [
      `${fund1.name} vs ${fund2.name}`,
      'fund comparison',
      'investment comparison',
      'fund review',
      'fees comparison',
      'risk comparison',
      'Golden Visa fund comparison',
      'investment fund analysis',
      `${fund1.managerName}`,
      `${fund2.managerName}`,
      'fund performance comparison',
      'compare funds',
      'investment analysis'
    ],
    structuredData: getFundComparisonStructuredData(fund1, fund2)
  };
}

export function getFundComparisonFallbackSeo(normalizedSlug: string): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa Fund Comparison – Investment Analysis | Movingto Funds'),
    description: optimizeDescription('Compare Portugal Golden Visa funds side by side. Check performance, fees, risk, liquidity, minimum investment and more before choosing your fund.'),
    url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    canonical: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    robots: 'index, follow',
    keywords: [
      'Golden Visa fund comparison',
      'investment fund analysis',
      'compare funds Portugal',
      'fund comparison tool',
      'investment analysis'
    ],
    structuredData: getGenericComparisonStructuredData()
  };
}

function getComparisonStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Portugal Golden Visa Fund Comparison Tool',
    'description': 'Compare Portugal Golden Visa investment funds side by side',
    'url': URL_CONFIG.buildUrl('/compare'),
    'potentialAction': {
      '@type': 'CompareAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${URL_CONFIG.BASE_URL}/compare/{fund1}-vs-{fund2}`
      }
    }
  };
}

function getFundComparisonStructuredData(fund1: Fund, fund2: Fund): any {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': `${fund1.name} vs ${fund2.name} - Investment Fund Comparison`,
      'description': `Detailed comparison of ${fund1.name} and ${fund2.name}`,
      'dateModified': new Date().toISOString()
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Fund Comparison',
      'numberOfItems': 2,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund1.name,
            'url': URL_CONFIG.buildFundUrl(fund1.id)
          }
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund2.name,
            'url': URL_CONFIG.buildFundUrl(fund2.id)
          }
        }
      ]
    }
  ];
}

function getGenericComparisonStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Portugal Golden Visa Fund Comparison',
    'description': 'Compare Portugal Golden Visa investment funds side by side',
    'url': URL_CONFIG.buildUrl('/compare')
  };
}
