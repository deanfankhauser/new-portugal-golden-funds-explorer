import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';

export function getFAQsSeo(): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa Investment Funds – FAQs & Common Questions | Movingto Funds'),
    description: optimizeDescription('Answers to common questions about Portugal Golden Visa investment funds. Learn how eligibility, risk, performance, fees and minimums work.'),
    url: URL_CONFIG.buildUrl('faqs'),
    canonical: URL_CONFIG.buildUrl('faqs'),
    keywords: [
      'FAQs',
      'frequently asked questions',
      'Golden Visa questions',
      'investment fund FAQs',
      'Portugal Golden Visa FAQ',
      'Portugal visa questions',
      'how long Golden Visa process',
      'Golden Visa minimum investment 2025',
      'can family get Golden Visa',
      'Golden Visa tax implications'
    ],
    structuredData: getFAQStructuredData()
  };
}

function getFAQStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'name': 'Portugal Golden Visa Investment Funds FAQ',
    'description': 'Frequently asked questions about Portugal Golden Visa investment funds',
    'url': URL_CONFIG.buildUrl('faqs'),
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is the Portugal Golden Visa program?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The Portugal Golden Visa is a residency-by-investment program that allows non-EU citizens to obtain Portuguese residency through qualifying investments, including investment fund subscriptions starting from €500,000.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What are the minimum investment amounts?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The minimum investment for Golden Visa qualifying investment funds is €500,000 for general funds. Some funds may have lower minimums but require higher total investments.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How long does the Golden Visa process take?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The typical timeline is 6-12 months from fund subscription to residency permit approval, depending on documentation completeness and government processing times.'
        }
      }
    ]
  };
}
