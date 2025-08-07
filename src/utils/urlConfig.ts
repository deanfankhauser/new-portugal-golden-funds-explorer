
export const URL_CONFIG = {
  BASE_URL: 'https://movingto.com/funds',
  SITE_URL: 'https://movingto.com',
  
  buildUrl: (path: string) => `https://movingto.com/funds${path.startsWith('/') ? path : `/${path}`}`,
  buildFundUrl: (fundId: string) => `https://movingto.com/funds/${fundId}`,
  buildManagerUrl: (managerName: string) => `https://movingto.com/funds/manager/${encodeURIComponent(managerName.toLowerCase().replace(/\s+/g, '-'))}`,
  buildCategoryUrl: (categoryName: string) => `https://movingto.com/funds/categories/${encodeURIComponent(categoryName.toLowerCase())}`,
  buildTagUrl: (tagName: string) => `https://movingto.com/funds/tags/${encodeURIComponent(tagName.toLowerCase().replace(/\s+/g, '-'))}`
};
