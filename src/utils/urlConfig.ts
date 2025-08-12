import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

export const URL_CONFIG = {
  BASE_URL: 'https://www.movingto.com/funds',
  SITE_URL: 'https://www.movingto.com',
  
  buildUrl: (path: string) => `https://www.movingto.com/funds${path.startsWith('/') ? path : `/${path}`}`,
  buildFundUrl: (fundId: string) => `https://www.movingto.com/funds/${fundId}`,
  buildManagerUrl: (managerName: string) => `https://www.movingto.com/funds/manager/${managerToSlug(managerName)}`,
  buildCategoryUrl: (categoryName: string) => `https://www.movingto.com/funds/categories/${categoryToSlug(categoryName)}`,
  buildTagUrl: (tagName: string) => `https://www.movingto.com/funds/tags/${tagToSlug(tagName)}`
};
