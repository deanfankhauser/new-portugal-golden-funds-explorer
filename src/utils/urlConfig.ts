
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

// Data freshness constants
export const DATA_AS_OF_DATE = "Sep 2025";
export const DATA_AS_OF_LABEL = `(as of ${DATA_AS_OF_DATE})`;

import { getBaseUrl } from '../lib/ssr-env';

export const URL_CONFIG = {
  // Resolve at runtime for both SSG (Node) and client (Vite)
  get BASE_URL() { return getBaseUrl(); },
  get SITE_URL() { return getBaseUrl(); },

  buildUrl: (path: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  },
  buildFundUrl: (fundId: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/${fundId}`;
  },
  buildManagerUrl: (managerName: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/manager/${managerToSlug(managerName)}`;
  },
  buildCategoryUrl: (categoryName: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/categories/${categoryToSlug(categoryName)}`;
  },
  buildTagUrl: (tagName: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/tags/${tagToSlug(tagName)}`;
  },
  buildComparisonUrl: (slug: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/compare/${slug}`;
  }
};
