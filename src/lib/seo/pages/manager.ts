import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas';
import { checkManagerIndexability } from '@/lib/indexability';

export function getManagerSeo(managerName: string, managerProfile: any, funds: Fund[] = []): SEOData {
  const indexability = checkManagerIndexability(managerName, funds);
  const gvFundCount = funds.filter((f: any) => f.tags?.includes('Golden Visa Eligible')).length || funds.length;
  
  // SEO Title: "[Manager Name]: Corporate Profile, Track Record & Active Funds"
  const managerTitle = `${managerName}: Corporate Profile, Track Record & Active Funds`;
  
  // SEO Description: Dynamic with AUM and fund count
  const managerDescription = generateManagerDescription(managerName, managerProfile, gvFundCount);
  
  return {
    title: optimizeTitle(managerTitle),
    description: optimizeDescription(managerDescription),
    url: URL_CONFIG.buildManagerUrl(managerName),
    canonical: URL_CONFIG.buildManagerUrl(managerName),
    robots: indexability.robots,
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

function generateManagerDescription(managerName: string, managerProfile: any, gvFundCount: number): string {
  // AUM formatting (from managerProfile if available)
  const aum = managerProfile?.assets_under_management;
  let aumStr: string | null = null;
  
  if (aum && aum > 0) {
    if (aum >= 1_000_000_000) {
      aumStr = `€${(aum / 1_000_000_000).toFixed(1)}B AUM`;
    } else if (aum >= 1_000_000) {
      aumStr = `€${(aum / 1_000_000).toFixed(0)}M AUM`;
    } else if (aum >= 1000) {
      aumStr = `€${(aum / 1000).toFixed(0)}k AUM`;
    }
  }
  
  // Build description dynamically - avoid "0 funds"
  const basePart = `${managerName} is a Portugal-based fund manager`;
  
  if (aumStr && gvFundCount > 0) {
    return `${basePart} with ${aumStr} and ${gvFundCount} Portugal Golden Visa fund${gvFundCount !== 1 ? 's' : ''}. Explore strategies, track record, and active funds.`;
  } else if (aumStr) {
    return `${basePart} with ${aumStr}. Explore strategies, track record, and active funds.`;
  } else if (gvFundCount > 0) {
    return `${basePart} with ${gvFundCount} Portugal Golden Visa fund${gvFundCount !== 1 ? 's' : ''}. Explore strategies, track record, and active funds.`;
  } else {
    return `${basePart}. Explore strategies, track record, and active funds on Movingto.`;
  }
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
  
  return [
    ...getSitewideSchemas(),
    ...schemas
  ];
}
