import { SEOData } from '@/types/seo';
import { Fund } from '@/data/types/funds';
import { URL_CONFIG } from '@/utils/urlConfig';
import { SEO_CONFIG } from '@/config/company';
import { getSortedBestFunds } from '@/utils/fundScoring';

/**
 * Best Funds page SEO helper
 * Targets: "best portugal golden visa funds", "top golden visa funds portugal"
 */
export function getBestFundsSeo(funds?: Fund[]): SEOData {
  const year = SEO_CONFIG.currentYear;
  
  return {
    title: `Best Portugal Golden Visa Funds (${year}) | Shortlist by Criteria | Movingto Funds`,
    description: `A ${year} shortlist of Portugal Golden Visa investment funds for the €500k route—ranked by disclosed factors like fees, liquidity terms, strategy, and governance signals.`,
    url: URL_CONFIG.buildUrl('best-portugal-golden-visa-funds'),
    canonical: URL_CONFIG.buildUrl('best-portugal-golden-visa-funds'),
    keywords: [
      'best portugal golden visa funds',
      'top golden visa funds portugal',
      'recommended portugal golden visa investment fund',
      'best golden visa fund 2026',
      'portugal gv fund comparison',
      'top rated golden visa funds',
      'best €500k investment funds portugal',
      'golden visa fund rankings'
    ],
    structuredData: getBestFundsStructuredData(funds)
  };
}

/**
 * Generate structured data for Best Funds page
 */
function getBestFundsStructuredData(funds?: Fund[]): any[] {
  const year = SEO_CONFIG.currentYear;
  const baseUrl = URL_CONFIG.BASE_URL;
  
  const schemas: any[] = [];
  
  // BreadcrumbList
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': `Best Portugal Golden Visa Funds (${year})`,
        'item': `${baseUrl}/best-portugal-golden-visa-funds`
      }
    ]
  });
  
  // ItemList for the shortlist
  if (funds && funds.length > 0) {
    const topFunds = getSortedBestFunds(funds, 8);
    
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `Best Portugal Golden Visa Investment Funds ${year}`,
      'description': `A curated shortlist of Portugal Golden Visa funds ranked by disclosed factors including fees, liquidity, and governance.`,
      'numberOfItems': topFunds.length,
      'itemListElement': topFunds.map((sf, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': sf.fund.name,
        'url': `${baseUrl}/${sf.fund.id}`,
        'item': {
          '@type': 'FinancialProduct',
          'name': sf.fund.name,
          'description': sf.fund.description,
          'provider': {
            '@type': 'Organization',
            'name': sf.fund.managerName
          }
        }
      }))
    });
  }
  
  // FAQPage schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is the €500k fund route for Portugal Golden Visa?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The €500k fund route allows investors to qualify for a Portugal Golden Visa by investing €500,000 or more in a qualifying investment fund regulated by CMVM (Portuguese Securities Market Commission). This is one of the most popular paths to Portuguese residency.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How long is the investment typically held?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Most Golden Visa funds have investment terms of 5-10 years to align with fund strategy and residency requirements. Lock-up periods vary by fund, with some offering more flexible redemption options than others.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are returns guaranteed on Golden Visa funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No. Investment returns are never guaranteed. Fund performance depends on market conditions, fund strategy, and management execution. Past performance does not guarantee future results.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What fees are typical for Golden Visa funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Typical fees include management fees (1-2.5% annually) and performance fees (10-20% of profits above a hurdle rate). Some funds also charge subscription or redemption fees. Always review the fee schedule in official fund documents.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can US citizens invest in Portugal Golden Visa funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Some funds accept US citizens, but many do not due to regulatory complexity (FATCA, PFIC rules). Look for funds explicitly marked as US-compliant or PFIC-compliant if you are a US person.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I verify CMVM registration?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can verify fund registration on the CMVM website (cmvm.pt) by searching for the fund name or CMVM ID number. All qualifying Golden Visa funds must be registered with CMVM.'
        }
      }
    ]
  });
  
  return schemas;
}
