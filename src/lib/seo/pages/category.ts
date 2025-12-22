import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas';

export function getCategorySeo(categoryName: string, funds: Fund[] = []): SEOData {
  const fundCount = funds.length;
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
  
  // Dynamic title with fund count
  const title = fundCount > 0
    ? `${categoryName} Funds (${fundCount}) – Portugal Golden Visa | Movingto`
    : `${categoryName} Portugal Golden Visa Funds | Movingto`;
  
  // Enhanced description using full 155 character limit
  const description = fundCount > 0
    ? `Explore ${fundCount}+ ${categoryName} funds for Portugal Golden Visa residency. Compare management fees, minimum investments, risk profiles, and exit strategies.`
    : `Discover ${categoryName} investment funds for Portugal Golden Visa. Get detailed analysis of fees, returns, liquidity terms, and fund manager track records.`;
  
  return {
    title: optimizeTitle(title),
    description: optimizeDescription(description),
    url: URL_CONFIG.buildCategoryUrl(categoryName),
    canonical: URL_CONFIG.buildCategoryUrl(categoryName),
    robots: fundCount === 0 ? 'noindex, follow' : 'index, follow',
    keywords: [
      `${categoryName} funds`,
      `${categoryName} Golden Visa`,
      'Portugal investment funds',
      `${categoryName} investment`,
      'Golden Visa funds',
      'CMVM regulated funds',
      `${categoryName} fund comparison`
    ],
    structuredData: getCategoryStructuredData(categoryName, funds)
  };
}

function getCategoryStructuredData(categoryName: string, funds: Fund[] = []): any {
  const categoryUrl = URL_CONFIG.buildCategoryUrl(categoryName);
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Categories', 'item': URL_CONFIG.buildUrl('/categories') },
      { '@type': 'ListItem', 'position': 3, 'name': categoryName, 'item': categoryUrl }
    ]
  };
  
  // Enhanced ItemList with FinancialProduct type for each fund
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${categoryName} Portugal Golden Visa Investment Funds`,
    'description': `Collection of ${categoryName} funds eligible for Portugal Golden Visa`,
    'url': categoryUrl,
    'numberOfItems': funds.length,
    'itemListElement': funds.map((fund, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'FinancialProduct',
        'name': fund.name,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'category': fund.category || categoryName,
        'description': fund.description || `${fund.name} - ${categoryName} investment fund for Portugal Golden Visa`,
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
    'name': `${categoryName} Portugal Golden Visa Investment Funds`,
    'description': `Explore ${funds.length}+ ${categoryName} funds for Portugal Golden Visa residency`,
    'url': categoryUrl
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    collectionSchema,
    itemListSchema
  ];
}
