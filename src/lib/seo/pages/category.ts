import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getCategorySeo(categoryName: string, funds: Fund[] = []): SEOData {
  const fundCount = funds.length;
  
  // SEO Title: "{Category} Portugal Golden Visa Funds | Compare {Count}+ Options" (under 60 chars)
  const categoryTitle = fundCount > 0
    ? `${categoryName} Portugal Golden Visa Funds | Compare ${fundCount}+ Options`
    : `${categoryName} Portugal Golden Visa Funds | Investment Guide`;
  
  // SEO Description: "Explore {Count}+ {Category} funds eligible for Portugal Golden Visa..."
  const categoryDescription = fundCount > 0
    ? `Explore ${fundCount}+ ${categoryName} funds eligible for Portugal Golden Visa. Compare fees, minimums, risk, strategy.`
    : `Explore ${categoryName} Portugal Golden Visa investment funds. Compare fees, minimums, risk and strategy.`;
  
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

  return [baseSchema, itemListSchema];
}
