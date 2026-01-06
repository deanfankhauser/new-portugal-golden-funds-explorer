import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { getSitewideSchemas } from '../schemas';

export function getFAQsSeo(): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa Funds FAQ (2026): Fees, Lock-Up, Eligibility, Timeline | Movingto Funds'),
    description: optimizeDescription('Complete guide to Portugal\'s €500k Golden Visa fund route. Answers on fund eligibility, fees, lock-up periods, process timeline, family inclusion, and citizenship path.'),
    url: URL_CONFIG.buildUrl('faqs'),
    canonical: URL_CONFIG.buildUrl('faqs'),
    keywords: [
      'Portugal golden visa fund FAQ',
      'golden visa fund fees',
      'golden visa lock-up period',
      'Portugal golden visa timeline 2026',
      'golden visa fund eligibility',
      'US citizen Portugal golden visa',
      'Portugal golden visa minimum investment',
      'golden visa family members',
      'Portugal golden visa citizenship',
      'golden visa fund comparison',
      '€500k fund route Portugal',
      'Portugal PE VC funds golden visa'
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

  // Top 12 highest-intent FAQs for schema (trimmed from full page content)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'name': 'Portugal Golden Visa Funds FAQ (2026)',
    'description': 'Complete guide to Portugal\'s €500k Golden Visa fund route covering eligibility, fees, lock-ups, process timeline, and citizenship.',
    'url': faqsUrl,
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is a qualifying Portugal Golden Visa fund?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'A qualifying Golden Visa fund is a Portuguese-regulated investment or venture capital fund that meets the €500,000 fund route rules—structured so the investment supports the Portuguese economy rather than direct property ownership. The fund must be regulated and supervised in Portugal with proper documentation for your ARI application file.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is real estate still allowed for Portugal Golden Visa?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Direct real estate purchase is no longer an eligible Golden Visa route. Portugal removed property-based paths in 2023. Some funds invest in operating companies (including hospitality operators)—this is different from buying a property deed directly.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is the minimum investment for the fund route?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The qualifying amount is €500,000 for the Portugal Golden Visa fund option. A fund may list a lower subscription minimum, but you still need to reach the €500,000 program threshold with your qualifying investment.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What fees do Golden Visa funds typically charge?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Golden Visa funds typically charge: subscription/entry fees (0-3%), management fees (1-2.5% annually), performance fees (15-20% of profits), administration and custody fees, and redemption/exit fees. Total fees can exceed 15-20% of your initial investment over the full period.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is a lock-up period and how long is typical?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'A lock-up period is when you cannot redeem your investment from the fund. For Golden Visa funds, lock-ups are typically 6-10 years. Lock-up and exit mechanics matter more than marketing target returns.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is the real timeline for Portugal Golden Visa via funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'There isn\'t a single clean timeline. Processing backlogs have materially impacted timelines, with ongoing reforms and digitization efforts. Steps include: fund subscription (2-4 weeks), ARI preparation (2-6 weeks), application submission, biometrics, approval and card issuance (historically 3-12 months, currently longer).'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I include my spouse and children?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes—Portugal Golden Visa is commonly used for families. Your spouse and dependent children can be included in your application. The €500,000 investment covers the entire family—no additional investment required per person, though additional government fees apply.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How long do I need to hold the investment?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You generally need to maintain the qualifying investment through the Golden Visa residency period (5-year path is common), but the fund\'s own term can be longer—often 6-10 years. Plan for the longer of: residency requirement OR fund lock-up.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What happens if I want to exit early?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Most Golden Visa funds are not built for exit whenever you want. Many funds have hard lock-ups with no early exit option. Exiting before obtaining permanent residency or citizenship can invalidate your Golden Visa. Early exit can create both financial and immigration risks.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is the citizenship timeline still 5 years?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The historical baseline has been eligibility for citizenship after 5 years of legal residency, but Portugal has had active political and legal debate about nationality rules. In late 2025, the Constitutional Court found parts of proposed nationality law amendments unconstitutional. Applicants should rely on their immigration lawyer for the latest position.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can US citizens invest in Portugal Golden Visa funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, US citizens can invest, but some funds refuse US persons due to regulatory complexity. FATCA and PFIC rules create reporting requirements and complex tax treatment that some fund managers choose to avoid.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I compare Golden Visa funds properly?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Compare in this order: 1) Eligibility fit under post-2023 rules, 2) Total fees (management + performance + entry/exit + admin), 3) Liquidity reality (lock-up, redemption windows, secondary transfer rules), 4) Manager incentives and conflicts, 5) Evidence pack quality for your ARI process.'
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
