import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getComparisonSeo(): SEOData {
  return {
    title: 'Compare Portugal Golden Visa Funds Side by Side',
    description: 'Compare any two Portugal Golden Visa investment funds. Review fees, minimums, returns, and strategy differences before investing.',
    url: URL_CONFIG.buildUrl('/compare'),
    canonical: URL_CONFIG.buildUrl('/compare'),
    keywords: [
      'Golden Visa fund comparison',
      'compare investment funds Portugal',
      'fund comparison tool',
      'investment fund analysis',
      'side-by-side fund comparison'
    ],
    structuredData: getComparisonStructuredData()
  };
}

export function getFundComparisonSeo(fund1: Fund, fund2: Fund, normalizedSlug: string): SEOData {
  // Format minimum investments
  const min1 = fund1.minimumInvestment ? `€${(fund1.minimumInvestment / 1000).toFixed(0)}k` : 'N/A';
  const min2 = fund2.minimumInvestment ? `€${(fund2.minimumInvestment / 1000).toFixed(0)}k` : 'N/A';
  const cat1 = fund1.category || 'investment';
  const cat2 = fund2.category || 'investment';
  
  // Smart title truncation for long fund names
  const maxTitleLength = 60;
  const suffix = ' | Portugal Golden Visa Funds';
  let title = `Compare ${fund1.name} vs ${fund2.name}${suffix}`;
  
  if (title.length > maxTitleLength) {
    // Use shorter fund names if available, otherwise truncate
    const shortName1 = fund1.name.split(' ').slice(0, 2).join(' ');
    const shortName2 = fund2.name.split(' ').slice(0, 2).join(' ');
    title = `Compare ${shortName1} vs ${shortName2}${suffix}`;
    
    if (title.length > maxTitleLength) {
      title = `${shortName1} vs ${shortName2}${suffix}`;
    }
  }
  
  // Description with key differences
  const description = `Compare ${fund1.name} vs ${fund2.name}: ${min1} vs ${min2} minimum, ${cat1} vs ${cat2} strategy. Key differences for Golden Visa.`;
  
  return {
    title: title,
    description: optimizeDescription(description),
    url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    canonical: URL_CONFIG.buildComparisonUrl(normalizedSlug),
    robots: 'index, follow',
    keywords: [
      `${fund1.name} vs ${fund2.name}`,
      'fund comparison',
      'Golden Visa fund comparison',
      'investment fund analysis',
      'compare funds Portugal'
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
