
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

// Data freshness constants
export const DATA_AS_OF_DATE = "Sep 2025";
export const DATA_AS_OF_LABEL = `(as of ${DATA_AS_OF_DATE})`;

export const URL_CONFIG = {
  // Use environment variable for base URL, with fallback to production
  BASE_URL: import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com',
  SITE_URL: import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com',
  
  buildUrl: (path: string) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com';
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  },
  buildFundUrl: (fundId: string) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com';
    return `${baseUrl}/${fundId}`;
  },
  buildManagerUrl: (managerName: string) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com';
    return `${baseUrl}/manager/${managerToSlug(managerName)}`;
  },
  buildCategoryUrl: (categoryName: string) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com';
    return `${baseUrl}/categories/${categoryToSlug(categoryName)}`;
  },
  buildTagUrl: (tagName: string) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com';
    return `${baseUrl}/tags/${tagToSlug(tagName)}`;
  },
  buildComparisonUrl: (slug: string) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://funds.movingto.com';
    return `${baseUrl}/compare/${slug}`;
  }
};
