import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas';

const US_FUNDS_URL = '/funds/us-citizens';

export function getUSCitizensFundsSeo(funds: Fund[] = []): SEOData {
  // Filter to US-eligible funds for count
  const usEligibleFunds = funds.filter(f => 
    f.usCompliant === true || 
    f.tags?.includes('Golden Visa funds for U.S. citizens')
  );
  
  const title = 'Portugal Golden Visa Funds for US Citizens (2026) | US Persons Eligible | Movingto Funds';
  
  const description = 'Funds that accept US persons for Portugal\'s Golden Visa €500k fund route. Filter by fees, strategy and liquidity terms, with US-eligibility notes and sources where available.';
  
  return {
    title: optimizeTitle(title),
    description: optimizeDescription(description),
    url: URL_CONFIG.buildUrl(US_FUNDS_URL),
    canonical: URL_CONFIG.buildUrl(US_FUNDS_URL),
    robots: 'index, follow',
    keywords: [
      'portugal golden visa funds for us citizens',
      'us persons eligible golden visa funds',
      'fatca compliant portugal golden visa funds',
      'american investors portugal golden visa',
      'us citizen golden visa portugal',
      'pfic golden visa funds',
      'us tax compliant portugal funds',
      'golden visa funds accepting americans'
    ],
    structuredData: getUSCitizensFundsStructuredData(usEligibleFunds)
  };
}

function getUSCitizensFundsStructuredData(funds: Fund[] = []): any {
  const pageUrl = URL_CONFIG.buildUrl(US_FUNDS_URL);
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Funds', 'item': URL_CONFIG.buildUrl('/') },
      { '@type': 'ListItem', 'position': 3, 'name': 'US Citizens', 'item': pageUrl }
    ]
  };
  
  // ItemList schema for funds
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Portugal Golden Visa Funds for US Citizens',
    'description': 'Funds that accept US persons for Portugal Golden Visa',
    'url': pageUrl,
    'numberOfItems': funds.length,
    'itemListElement': funds.slice(0, 20).map((fund, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'FinancialProduct',
        'name': fund.name,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'category': fund.category,
        'description': fund.description || `${fund.name} - US person eligible investment fund`,
        'offers': {
          '@type': 'Offer',
          'price': fund.minimumInvestment || 500000,
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock'
        },
        'provider': {
          '@type': 'Organization',
          'name': fund.managerName || 'Fund Manager'
        }
      }
    }))
  };
  
  // FAQPage schema with curated FAQ
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Do Portugal Golden Visa funds accept US citizens?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, some funds explicitly accept US persons, though fewer than for other nationalities. This page shows confirmed eligibility where available based on fund disclosures or manager confirmations.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What does FATCA mean in this context?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'FATCA (Foreign Account Tax Compliance Act) requires foreign financial institutions to report US taxpayer accounts. Some funds are set up to handle FATCA reporting requirements.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What extra documents are common for US persons?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'W-9 form, proof of US taxpayer status, and additional AML/KYC documentation are commonly required. Timelines may be longer than for non-US investors.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are returns guaranteed?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No. Target returns are manager-stated projections, not guarantees. All investments carry risk and past performance does not guarantee future results.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is PFIC and why do people mention it?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'PFIC (Passive Foreign Investment Company) is a US tax classification that can result in unfavorable tax treatment. Some funds offer QEF elections to mitigate this. Discuss implications with your US tax advisor.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Who should I speak to before investing?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'A US-qualified tax advisor (for PFIC/FATCA implications), Portuguese legal counsel (for GV eligibility), and a licensed financial advisor should all be consulted before making investment decisions.'
        }
      }
    ]
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    itemListSchema,
    faqSchema
  ];
}
