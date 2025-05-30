
// Centralized URL configuration for the application
export const URL_CONFIG = {
  BASE_URL: 'https://movingto.com/funds',
  DOMAIN: 'movingto.com',
  
  // Helper function to build full URLs
  buildUrl: (path: string = '') => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${URL_CONFIG.BASE_URL}${cleanPath ? `/${cleanPath}` : ''}`;
  },
  
  // Helper function to build fund detail URLs
  buildFundUrl: (fundId: string) => {
    return `${URL_CONFIG.BASE_URL}/funds/${fundId}`;
  },
  
  // Helper function to build tag URLs
  buildTagUrl: (tag: string) => {
    return `${URL_CONFIG.BASE_URL}/tags/${tag}`;
  },
  
  // Helper function to build category URLs
  buildCategoryUrl: (category: string) => {
    return `${URL_CONFIG.BASE_URL}/categories/${category}`;
  },
  
  // Helper function to build manager URLs
  buildManagerUrl: (managerName: string) => {
    return `${URL_CONFIG.BASE_URL}/manager/${managerName}`;
  },
  
  // Helper function to build comparison URLs
  buildComparisonUrl: (slug: string) => {
    return `${URL_CONFIG.BASE_URL}/compare/${slug}`;
  }
};
