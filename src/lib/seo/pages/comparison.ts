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
  const fee1 = fund1.managementFee ? `${fund1.managementFee}%` : '';
  const fee2 = fund2.managementFee ? `${fund2.managementFee}%` : '';
  
  // Smart title truncation for long fund names - never cut mid-word
  const maxTitleLength = 60;
  const suffix = ' | Golden Visa';
  let title = `${fund1.name} vs ${fund2.name}${suffix}`;
  
  if (title.length > maxTitleLength) {
    // Use shorter fund names (first 2-3 words)
    const shortName1 = fund1.name.split(' ').slice(0, 2).join(' ');
    const shortName2 = fund2.name.split(' ').slice(0, 2).join(' ');
    title = `${shortName1} vs ${shortName2}${suffix}`;
    
    if (title.length > maxTitleLength) {
      // Remove suffix if still too long
      title = `${shortName1} vs ${shortName2} Comparison`;
      if (title.length > maxTitleLength) {
        title = `${shortName1} vs ${shortName2}`;
      }
    }
  }
  
  // Rich description with differentiating details (full 155 chars)
  let description: string;
  if (fee1 && fee2) {
    description = `${fund1.name} vs ${fund2.name}: ${min1} vs ${min2} minimum, ${fee1} vs ${fee2} fees. Compare ${cat1} and ${cat2} strategies for Portugal Golden Visa.`;
  } else {
    description = `${fund1.name} vs ${fund2.name}: ${min1} vs ${min2} minimum investment. Compare ${cat1} and ${cat2} fund strategies, fees, and returns for Golden Visa.`;
  }
  
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
  const webPageSchema = {
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How do I compare Portugal Golden Visa funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Select any two funds from our directory to see a side-by-side comparison of fees, minimums, returns, and strategy differences.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What factors should I consider when comparing funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Key factors include minimum investment amount, management fees, target returns, lock-up period, redemption frequency, and Golden Visa eligibility.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are all funds on this platform eligible for Portugal Golden Visa?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, all funds listed are eligible for the Portugal Golden Visa program, meeting the €500,000 minimum investment requirement for qualifying investment funds.'
        }
      }
    ]
  };

  return [webPageSchema, faqSchema];
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
