
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

// Data freshness constants
export const DATA_AS_OF_DATE = "Sep 2025";
export const DATA_AS_OF_LABEL = `(as of ${DATA_AS_OF_DATE})`;

export const URL_CONFIG = {
  BASE_URL: 'https://funds.movingto.com',
  SITE_URL: 'https://funds.movingto.com',
  
  buildUrl: (path: string) => `https://funds.movingto.com${path.startsWith('/') ? path : `/${path}`}`,
  buildFundUrl: (fundId: string) => `https://funds.movingto.com/${fundId}`,
  buildManagerUrl: (managerName: string) => `https://funds.movingto.com/manager/${managerToSlug(managerName)}`,
  buildCategoryUrl: (categoryName: string) => `https://funds.movingto.com/categories/${categoryToSlug(categoryName)}`,
  buildTagUrl: (tagName: string) => `https://funds.movingto.com/tags/${tagToSlug(tagName)}`,
  buildComparisonUrl: (slug: string) => `https://funds.movingto.com/compare/${slug}`
};
