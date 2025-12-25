import { URL_CONFIG } from '@/utils/urlConfig';
import { COMPANY_INFO } from '@/config/company';

/**
 * Sitewide structured data schemas to be included on every page
 * Provides consistent WebSite and Organization schema across the site
 */

export function getSitewideSchemas(): any[] {
  return [
    getWebSiteSchema(),
    getOrganizationSchema()
  ];
}

export function getWebSiteSchema(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Movingto - Portugal Golden Visa Investment Funds',
    'url': URL_CONFIG.BASE_URL,
    'description': 'Comprehensive analysis and comparison of Portugal Golden Visa Investment Funds',
    'publisher': {
      '@type': 'Organization',
      'name': 'Movingto'
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getOrganizationSchema(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Movingto',
    'legalName': COMPANY_INFO.legalName,
    'url': URL_CONFIG.BASE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': `${URL_CONFIG.BASE_URL}${COMPANY_INFO.logo.url}`,
      'width': COMPANY_INFO.logo.width,
      'height': COMPANY_INFO.logo.height
    },
    'image': `${URL_CONFIG.BASE_URL}${COMPANY_INFO.logo.url}`,
    'description': 'Independent platform for comparing Portugal Golden Visa investment funds. Compare fees, performance, minimums and risk across CMVM-linked funds.',
    'foundingDate': COMPANY_INFO.foundingDate,
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Investor Relations',
      'email': COMPANY_INFO.email,
      'areaServed': 'Worldwide',
      'availableLanguage': ['en', 'pt']
    },
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': COMPANY_INFO.address.city,
      'addressRegion': COMPANY_INFO.address.state,
      'addressCountry': COMPANY_INFO.address.countryCode
    },
    'sameAs': [
      COMPANY_INFO.socialLinks.linkedin,
      COMPANY_INFO.socialLinks.twitter
    ],
    'knowsAbout': [
      'Portugal Golden Visa',
      'Investment Funds',
      'Real Estate Investment',
      'Portuguese Residency',
      'Fund Management',
      'CMVM Regulation'
    ],
    'areaServed': {
      '@type': 'Country',
      'name': 'Portugal',
      'alternateName': 'PT'
    },
    'slogan': 'Compare Portugal Golden Visa Investment Funds'
  };
}
