import { URL_CONFIG } from '@/utils/urlConfig';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

/**
 * Generate BreadcrumbList structured data
 * @param items Array of breadcrumb items (name and optional URL)
 * @returns Schema.org BreadcrumbList object
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      ...(item.url && { 'item': item.url })
    }))
  };
}

/**
 * Common breadcrumb configurations for different page types
 */
export const BREADCRUMB_CONFIGS = {
  homepage: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL }
  ]),
  
  roiCalculator: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'ROI Calculator', url: URL_CONFIG.buildUrl('roi-calculator') }
  ]),
  
  verifiedFunds: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'CMVM-Linked Funds', url: URL_CONFIG.buildUrl('verified-funds') }
  ]),
  
  fundAlternatives: (fundName: string, fundId: string) => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: fundName, url: URL_CONFIG.buildFundUrl(fundId) },
    { name: 'Alternatives', url: URL_CONFIG.buildFundAlternativesUrl(fundId) }
  ]),
  
  about: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'About', url: URL_CONFIG.buildUrl('about') }
  ]),
  
  disclaimer: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Disclaimer', url: URL_CONFIG.buildUrl('disclaimer') }
  ]),
  
  privacy: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Privacy Policy', url: URL_CONFIG.buildUrl('privacy') }
  ]),
  
  cookiePolicy: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Cookie Policy', url: URL_CONFIG.buildUrl('cookie-policy') }
  ]),
  
  contact: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Contact', url: URL_CONFIG.buildUrl('contact') }
  ]),
  
  terms: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Terms of Service', url: URL_CONFIG.buildUrl('terms') }
  ]),
  
  managersHub: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Fund Managers', url: URL_CONFIG.buildUrl('managers') }
  ]),
  
  categoriesHub: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Categories', url: URL_CONFIG.buildUrl('categories') }
  ]),
  
  tagsHub: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Investment Themes', url: URL_CONFIG.buildUrl('tags') }
  ]),
  
  alternativesHub: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Fund Alternatives', url: URL_CONFIG.buildUrl('alternatives') }
  ]),
  
  comparisonsHub: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Compare Funds', url: URL_CONFIG.buildUrl('comparisons') }
  ]),
  
  faqs: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'FAQs', url: URL_CONFIG.buildUrl('faqs') }
  ]),
  
  verificationProgram: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Verification Program', url: URL_CONFIG.buildUrl('verification-program') }
  ]),
  
  savedFunds: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'My Watchlist', url: URL_CONFIG.buildUrl('saved-funds') }
  ]),
  
  fundMatcher: () => generateBreadcrumbSchema([
    { name: 'Home', url: URL_CONFIG.BASE_URL },
    { name: 'Fund Matcher', url: URL_CONFIG.buildUrl('fund-matcher') }
  ])
};
