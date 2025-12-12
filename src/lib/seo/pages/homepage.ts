import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getHomeSeo(funds?: Fund[]): SEOData {
  return {
    title: optimizeTitle('Compare Portugal Golden Visa Funds – Directory of CMVM-Regulated Funds | Movingto Funds'),
    keywords: [
      'Portugal Golden Visa funds',
      'Golden Visa investment',
      'Portugal investment funds',
      'CMVM funds',
      'investment immigration',
      'residence by investment',
      'Portugal capital transfer',
      'VC funds Portugal',
      'real estate funds Portugal',
      'fund comparison'
    ],
    description: optimizeDescription('Compare Portugal Golden Visa funds by performance, fees, risk, strategy and minimum ticket. Use our independent directory to shortlist funds for your residency plan.'),
    url: URL_CONFIG.buildUrl('/'),
    canonical: URL_CONFIG.buildUrl('/'),
    structuredData: getHomepageStructuredData(funds)
  };
}

function getHomepageStructuredData(funds?: Fund[]): any {
  const topFunds = funds ? funds.filter((f: any) => f && f.name && f.id).slice(0, 10) : [];
  
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto - Portugal Golden Visa Investment Funds',
      'url': URL_CONFIG.BASE_URL,
      'description': 'Comprehensive analysis and comparison of Portugal Golden Visa Investment Funds',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Movingto',
      'url': URL_CONFIG.BASE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${URL_CONFIG.BASE_URL}/lovable-uploads/c5481949-8ec2-43f1-a77f-8d6cce1eec0e.png`,
        'width': 512,
        'height': 512
      },
      'description': 'Independent platform for comparing Portugal Golden Visa investment funds',
      'foundingDate': '2024-01-01',
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Investor Relations',
        'email': 'info@movingto.com',
        'areaServed': 'PT',
        'availableLanguage': ['en', 'pt']
      },
      'sameAs': [
        'https://www.linkedin.com/company/movingto',
        'https://twitter.com/movingto',
        'https://www.facebook.com/movingto'
      ],
      'knowsAbout': [
        'Portugal Golden Visa',
        'Investment Funds',
        'Real Estate Investment',
        'Portuguese Residency',
        'Fund Management',
        'CMVM Regulation',
        'European Investment'
      ],
      'areaServed': {
        '@type': 'Country',
        'name': 'Portugal',
        'alternateName': 'PT'
      },
      'founder': {
        '@type': 'Organization',
        'name': 'Movingto'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Top Portugal Golden Visa Investment Funds',
      'description': 'Featured top-rated Portugal Golden Visa investment funds',
      'numberOfItems': topFunds.length,
      'itemListElement': topFunds.map((fund: any, index: number) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'FinancialProduct',
          'name': fund.name,
          'url': URL_CONFIG.buildFundUrl(fund.id),
          'category': fund.category,
          'offers': {
            '@type': 'Offer',
            'price': fund.minimumInvestment || 0,
            'priceCurrency': 'EUR'
          }
        }
      }))
    }
  ];
}
