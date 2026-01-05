import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { getSitewideSchemas } from '../schemas';

export function getFundMatcherSeo(): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa Fund Finder (2026) | Movingto Funds'),
    description: optimizeDescription('Filter funds by strategy, fees, timeline, and risk posture to build a shortlist. No recommendations—always verify in official docs.'),
    url: URL_CONFIG.buildUrl('fund-matcher'),
    canonical: URL_CONFIG.buildUrl('fund-matcher'),
    robots: 'index, follow',
    keywords: [
      'golden visa fund matcher',
      'portugal investment fund finder',
      'fund recommendation quiz',
      'golden visa fund selector',
      'portugal fund comparison tool',
      'investment fund quiz'
    ],
    structuredData: getFundMatcherStructuredData()
  };
}

export function getFundMatcherResultsSeo(fundsCount: number = 0): SEOData {
  return {
    title: optimizeTitle(`${fundsCount} Matching Funds | Fund Matcher Results`),
    description: optimizeDescription('Your personalized Portugal Golden Visa fund recommendations based on your investment criteria.'),
    url: URL_CONFIG.buildUrl('fund-matcher/results'),
    canonical: URL_CONFIG.buildUrl('fund-matcher'),
    robots: 'noindex, follow', // Dynamic results are noindexed
    keywords: [],
    structuredData: null
  };
}

function getFundMatcherStructuredData(): any {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Portugal Golden Visa Fund Matcher',
      'description': 'Interactive quiz to find the best CMVM-regulated investment fund for your Golden Visa application based on your budget, risk tolerance, and investment goals.',
      'url': URL_CONFIG.buildUrl('fund-matcher'),
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
      },
      'featureList': [
        'Personalized fund recommendations',
        'Budget-based filtering',
        'Risk tolerance matching',
        'Nationality-specific filtering for US investors',
        'Timeline-based fund selection'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': URL_CONFIG.buildUrl('')
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Fund Matcher',
          'item': URL_CONFIG.buildUrl('fund-matcher')
        }
      ]
    }
  ];

  return [...getSitewideSchemas(), ...schemas];
}
