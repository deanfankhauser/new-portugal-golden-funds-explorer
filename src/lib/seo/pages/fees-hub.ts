import { SEOData } from '../types';
import { URL_CONFIG } from '@/utils/urlConfig';
import { getSitewideSchemas } from '../schemas';

export function getFeesHubSeo(): SEOData {
  const feesUrl = URL_CONFIG.buildUrl('/fees');
  
  return {
    title: 'Portugal Golden Visa Fund Fees (2026) | Management, Performance & Exit | Movingto Funds',
    description: 'Understand common Portugal Golden Visa fund fees—management, performance, subscription, redemption and exit costs. Compare fee structures across funds and estimate total cost.',
    url: feesUrl,
    canonical: feesUrl,
    robots: 'index, follow',
    keywords: [
      'Portugal Golden Visa fund fees',
      'management fee Golden Visa',
      'performance fee Golden Visa funds',
      'subscription fee Portugal funds',
      'redemption fee investment funds',
      'exit fee Golden Visa',
      'total cost Golden Visa funds',
      'fund fee comparison',
      'Golden Visa investment costs',
      'CMVM fund fees'
    ],
    structuredData: getFeesHubStructuredData(feesUrl)
  };
}

function getFeesHubStructuredData(url: string): any[] {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Fees', 'item': url }
    ]
  };
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What fees do Portugal Golden Visa funds typically charge?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Most funds charge a combination of: management fees (1-2% annually), performance fees (0-20% of profits above a hurdle), and potentially subscription/redemption fees (0-3%). The total cost varies significantly by fund type and strategy.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How do fees impact my returns?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Fees compound over time and directly reduce net returns. A fund with 2% annual fees versus 1% annual fees can result in tens of thousands of euros difference over a 6-year holding period on a €500k investment.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are fund fees negotiable?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'For standard €500k Golden Visa subscriptions, fee terms are typically fixed. However, larger commitments may qualify for institutional share classes with reduced fees. Some funds offer early-bird discounts for initial subscribers.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Where can I verify fund fees?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Official fees are disclosed in the fund prospectus, Information Memorandum, or Key Information Document (KID). For CMVM-regulated funds, fee information may also be available on the regulator\'s website.'
        }
      }
    ]
  };
  
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Portugal Golden Visa Fund Fees Guide',
    'description': 'Comprehensive guide to understanding fees charged by Portugal Golden Visa investment funds',
    'url': url,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'Movingto Funds',
      'url': URL_CONFIG.BASE_URL
    }
  };
  
  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    webPageSchema,
    faqSchema
  ];
}
