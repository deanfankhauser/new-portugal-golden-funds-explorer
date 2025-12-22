import { URL_CONFIG } from '@/utils/urlConfig';

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
    'legalName': 'Moving To Global Pty Ltd',
    'url': URL_CONFIG.BASE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': `${URL_CONFIG.BASE_URL}/lovable-uploads/c5481949-8ec2-43f1-a77f-8d6cce1eec0e.png`,
      'width': 512,
      'height': 512
    },
    'image': `${URL_CONFIG.BASE_URL}/lovable-uploads/c5481949-8ec2-43f1-a77f-8d6cce1eec0e.png`,
    'description': 'Independent platform for comparing Portugal Golden Visa investment funds. Compare fees, performance, minimums and risk across CMVM-linked funds.',
    'foundingDate': '2024-01-01',
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Investor Relations',
      'email': 'info@movingto.com',
      'areaServed': 'Worldwide',
      'availableLanguage': ['en', 'pt']
    },
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'AU'
    },
    'sameAs': [
      'https://www.linkedin.com/company/movingto',
      'https://twitter.com/movingtoio'
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
