import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription, slugify, getCurrentYear } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';

export function getCategorySeo(categoryName: string, funds: Fund[] = []): SEOData {
  const currentYear = getCurrentYear();
  
  // SEO Title: "Best [Category Name] Funds for Portugal Golden Visa ({Current Year})"
  const categoryTitle = `Best ${categoryName} Funds for Portugal Golden Visa (${currentYear})`;
  
  // SEO Description: "Compare the top [Category Name] investment funds eligible for the Portugal Golden Visa. Analysis of fees, yields, and risk profiles for [Count] funds."
  const categoryDescription = `Compare the top ${categoryName} investment funds eligible for the Portugal Golden Visa. Analysis of fees, yields, and risk profiles for ${funds.length} fund${funds.length !== 1 ? 's' : ''}.`;
  
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
