import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getManagerSeo(managerName: string, managerProfile: any, funds: Fund[] = []): SEOData {
  const fundCount = funds.length;
  const goldenVisaFundCount = funds.filter((f: any) => f.tags?.includes('Golden Visa Eligible')).length || fundCount;
  
  // SEO Title: "[Manager Name]: Corporate Profile, Track Record & Active Funds"
  const managerTitle = `${managerName}: Corporate Profile, Track Record & Active Funds`;
  
  // SEO Description: "View the corporate profile of [Manager Name]. Regulated Portuguese fund manager with [X] active Golden Visa funds. View AUM and investment strategy."
  const managerDescription = `View the corporate profile of ${managerName}. Regulated Portuguese fund manager with ${goldenVisaFundCount} active Golden Visa fund${goldenVisaFundCount !== 1 ? 's' : ''}. View AUM and investment strategy.`;
  
  return {
    title: optimizeTitle(managerTitle),
    description: optimizeDescription(managerDescription),
    url: URL_CONFIG.buildManagerUrl(managerName),
    canonical: URL_CONFIG.buildManagerUrl(managerName),
    keywords: [
      `${managerName}`,
      'Portugal fund manager',
      'corporate profile',
      'track record',
      'Golden Visa fund manager',
      'investment fund management Portugal',
      'CMVM regulated',
      'fund manager analysis',
      'active funds',
      'AUM'
    ],
    structuredData: getManagerStructuredData(managerName, managerProfile, funds)
  };
}

function getManagerStructuredData(managerName: string, managerProfile: any, funds: Fund[] = []): any {
  const schemas: any[] = [];
  
  // Organization schema for the fund manager
  const organizationSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    'name': managerName,
    'url': URL_CONFIG.buildManagerUrl(managerName),
    'description': `${managerName} is a regulated Portuguese fund manager specializing in Golden Visa investment funds.`
  };
  
  if (managerProfile) {
    if (managerProfile.website) {
      organizationSchema.sameAs = [managerProfile.website];
    }
    if (managerProfile.city || managerProfile.country) {
      organizationSchema.address = {
        '@type': 'PostalAddress',
        'addressLocality': managerProfile.city,
        'addressCountry': managerProfile.country || 'Portugal'
      };
    }
    if (managerProfile.foundedYear) {
      organizationSchema.foundingDate = `${managerProfile.foundedYear}-01-01`;
    }
    if (managerProfile.logoUrl) {
      organizationSchema.logo = managerProfile.logoUrl;
    }
  }
  
  schemas.push(organizationSchema);
  
  // ItemList schema for funds
  if (funds.length > 0) {
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `Investment Funds by ${managerName}`,
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'FinancialProduct',
          'name': fund.name,
          'url': URL_CONFIG.buildFundUrl(fund.id)
        }
      }))
    };
    schemas.push(itemListSchema);
  }
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Fund Managers', 'item': URL_CONFIG.buildUrl('/managers') },
      { '@type': 'ListItem', 'position': 3, 'name': managerName, 'item': URL_CONFIG.buildManagerUrl(managerName) }
    ]
  };
  schemas.push(breadcrumbSchema);
  
  return schemas;
}
