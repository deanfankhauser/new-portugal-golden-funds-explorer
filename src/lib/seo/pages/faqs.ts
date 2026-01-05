import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { getSitewideSchemas } from '../schemas';

export function getFAQsSeo(): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa Funds FAQ (2026) | Movingto Funds'),
    description: optimizeDescription('Answers on fund eligibility, timelines, common fees, and process steps for the Portugal Golden Visa €500k fund route in 2026.'),
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
      'Golden Visa minimum investment 2026',
      'can family get Golden Visa',
      'Golden Visa tax implications'
    ],
    structuredData: getFAQStructuredData()
  };
}

function getFAQStructuredData(): any {
  const faqsUrl = URL_CONFIG.buildUrl('faqs');
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'FAQs', 'item': faqsUrl }
    ]
  };

  // Complete FAQPage schema synced with FAQsContent.tsx (all 8 FAQs)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'name': 'Portugal Golden Visa Investment Funds FAQ',
    'description': 'Frequently asked questions about Portugal Golden Visa investment funds',
    'url': faqsUrl,
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is a Golden Visa investment fund?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'A Golden Visa investment fund is a regulated investment vehicle that allows foreign investors to obtain Portuguese residency by making a qualifying investment. For Portugal\'s Golden Visa program, eligible funds must focus on private equity/venture capital with €500,000 minimum investment and cannot be linked to real estate (rule changed October 2023).'
        }
      },
      {
        '@type': 'Question',
        'name': 'What are the minimum investment amounts?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Portugal Golden Visa fund route requires €500,000 total investment (post-October 2023 changes), with no real estate exposure permitted. Individual fund subscription minimums may be lower, but total qualifying investment must reach €500,000.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How long does the Golden Visa process take?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The processing time varies by country and fund. Typically, it takes 3-12 months from application submission to approval. This includes due diligence, document verification, and government processing. Some countries offer expedited processing for additional fees.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What are the tax implications of Golden Visa investments?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Tax implications depend on your country of residence, the fund\'s jurisdiction, and the type of investment. Generally, you may be subject to capital gains tax, income tax on distributions, and potentially wealth taxes. We recommend consulting with a tax advisor familiar with international tax law.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can family members be included in the Golden Visa application?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Most Golden Visa programs allow inclusion of family members, typically including spouse, dependent children, and sometimes parents or grandparents. Each family member may require additional investment or fees. Check specific program requirements for eligibility criteria.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What are the ongoing obligations after obtaining a Golden Visa?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Ongoing obligations typically include maintaining the investment for a minimum period (usually 5 years), meeting minimum residency requirements, and complying with tax obligations. Some programs require periodic renewals and proof of continued investment.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I compare different Golden Visa funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'When comparing funds, consider factors such as minimum investment amount, expected returns, risk level, management fees, fund track record, liquidity terms, and the specific Golden Visa program requirements. Our comparison tools help you evaluate these factors side by side.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What happens if I want to exit my investment early?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Early exit terms vary by fund. Some funds offer liquidity windows at specific intervals, while others may have lock-up periods. Early withdrawal may result in penalties or reduced returns. Review the fund\'s redemption terms carefully before investing.'
        }
      }
    ]
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    faqSchema
  ];
}
