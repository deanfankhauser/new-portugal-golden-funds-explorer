import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getCategorySeo(categoryName: string, funds: Fund[] = []): SEOData {
  const fundCount = funds.length;
  
  // SEO Title: "{Category} Golden Visa Funds | Compare {Count}+ Options" (under 60 chars)
  const categoryTitle = fundCount > 0
    ? `${categoryName} Golden Visa Funds | Compare ${fundCount}+ Options`
    : `${categoryName} Golden Visa Funds Portugal | Investment Guide`;
  
  // SEO Description: Full 155 chars with unique, compelling copy per category
  const categoryDescription = fundCount > 0
    ? `Explore ${fundCount}+ ${categoryName} funds for Portugal Golden Visa residency. Compare management fees, minimum investments, risk profiles, and exit strategies.`
    : `Discover ${categoryName} investment funds for Portugal Golden Visa. Get detailed analysis of fees, returns, liquidity terms, and fund manager track records.`;
  
  const categoryKeywords = [
    `${categoryName} Golden Visa funds`,
    `${categoryName} investment Portugal`,
    `Portugal ${categoryName} funds`,
    'Golden Visa investment categories',
    `${categoryName} fund comparison`,
    `${categoryName} funds Portugal`
  ];
  
  return {
    title: optimizeTitle(categoryTitle),
    description: optimizeDescription(categoryDescription),
    url: URL_CONFIG.buildCategoryUrl(categoryName),
    canonical: URL_CONFIG.buildCategoryUrl(categoryName),
    keywords: categoryKeywords,
    robots: fundCount === 0 ? 'noindex, follow' : 'index, follow',
    structuredData: getCategoryStructuredData(categoryName, funds)
  };
}

function getCategoryStructuredData(categoryName: string, funds: Fund[] = []): any {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${categoryName} Investment Funds`,
    'description': `Collection of ${categoryName} investment funds in Portugal`,
    'url': URL_CONFIG.buildCategoryUrl(categoryName)
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': URL_CONFIG.BASE_URL
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Categories',
        'item': URL_CONFIG.buildUrl('/categories')
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': categoryName,
        'item': URL_CONFIG.buildCategoryUrl(categoryName)
      }
    ]
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${categoryName} Portugal Golden Visa Investment Funds`,
    'numberOfItems': funds.length,
    'itemListElement': funds.map((fund, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': URL_CONFIG.buildFundUrl(fund.id),
      'name': fund.name
    }))
  };

  return [baseSchema, breadcrumbSchema, itemListSchema];
}
