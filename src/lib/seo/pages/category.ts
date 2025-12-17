import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription, slugify, getCurrentYear } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getCategorySeo(categoryName: string, funds: Fund[] = []): SEOData {
  const currentYear = getCurrentYear();
  const fundCount = funds.length;
  
  // SEO Title: "Best [Category Name] Portugal Golden Visa Funds ({Current Year}) | Movingto"
  const categoryTitle = `Best ${categoryName} Portugal Golden Visa Funds (${currentYear}) | Movingto`;
  
  // SEO Description: Handle zero-fund case gracefully
  const categoryDescription = fundCount > 0
    ? `Compare ${fundCount} ${categoryName} investment funds eligible for the Portugal Golden Visa. Analysis of fees, yields, and risk profiles.`
    : `Explore ${categoryName} Portugal Golden Visa investment funds. This section is updated as funds become available. Learn about strategies, risk, and eligibility.`;
  
  const categoryKeywords = [
    `best ${categoryName} Golden Visa funds`,
    `${categoryName} investment Portugal ${currentYear}`,
    `Portugal ${categoryName} funds`,
    'Golden Visa investment categories',
    `${categoryName} fund comparison`,
    `top ${categoryName} funds Portugal`,
    `${categoryName} fund fees yields`
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
