import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas';

export function getTagSeo(tagName: string, funds: Fund[] = []): SEOData {
  const fundCount = funds.length;
  
  // Clean tag label for display
  const cleanTagLabel = tagName.replace(/-/g, ' ');
  
  // Dynamic title with fund count
  const title = fundCount > 0
    ? `${cleanTagLabel} Funds (${fundCount}) – Portugal Golden Visa | Movingto`
    : `${cleanTagLabel} Portugal Golden Visa Funds | Movingto`;
  
  // Enhanced description using full 155 character limit with unique content per tag
  const description = fundCount > 0
    ? `Browse ${fundCount}+ ${cleanTagLabel} funds for Portugal Golden Visa. Filter by fees, minimum investment, target returns, and fund manager reputation.`
    : `Explore ${cleanTagLabel} themed Golden Visa investment opportunities in Portugal. Compare fund strategies, risk profiles, and investment terms.`;
  
  return {
    title: optimizeTitle(title),
    description: optimizeDescription(description),
    url: URL_CONFIG.buildTagUrl(tagName),
    canonical: URL_CONFIG.buildTagUrl(tagName),
    robots: fundCount === 0 ? 'noindex, follow' : 'index, follow',
    keywords: [
      cleanTagLabel,
      `${cleanTagLabel} funds`,
      `${cleanTagLabel} Golden Visa`,
      'Portugal investment funds',
      'Golden Visa funds',
      'CMVM regulated funds',
      `${cleanTagLabel} investment strategy`
    ],
    structuredData: getTagStructuredData(tagName, cleanTagLabel, funds)
  };
}

function getTagStructuredData(tagName: string, cleanTagLabel: string, funds: Fund[] = []): any {
  const tagUrl = URL_CONFIG.buildTagUrl(tagName);
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Tags', 'item': URL_CONFIG.buildUrl('/tags') },
      { '@type': 'ListItem', 'position': 3, 'name': cleanTagLabel, 'item': tagUrl }
    ]
  };
  
  // Enhanced ItemList with FinancialProduct type for each fund
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${cleanTagLabel} Portugal Golden Visa Investment Funds`,
    'description': `Collection of funds tagged with ${cleanTagLabel} for Portugal Golden Visa`,
    'url': tagUrl,
    'numberOfItems': funds.length,
    'itemListElement': funds.map((fund, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'FinancialProduct',
        'name': fund.name,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'category': fund.category,
        'description': fund.description || `${fund.name} - ${cleanTagLabel} investment fund`,
        'offers': {
          '@type': 'Offer',
          'price': fund.minimumInvestment || 500000,
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock'
        },
        'provider': {
          '@type': 'Organization',
          'name': fund.managerName || 'Fund Manager'
        },
        ...(fund.managementFee && {
          'annualPercentageRate': fund.managementFee
        })
      }
    }))
  };

  // CollectionPage schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${cleanTagLabel} Portugal Golden Visa Investment Funds`,
    'description': `Browse ${funds.length}+ ${cleanTagLabel} funds for Portugal Golden Visa`,
    'url': tagUrl
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    collectionSchema,
    itemListSchema
  ];
}
