
import { PageSEOProps } from './types/seo';
import { funds } from './data/services/funds-service';
import { getAllFundManagers } from './data/services/managers-service';
import { getAllCategories } from './data/services/categories-service';
import { getAllTags } from './data/services/tags-service';

export interface RouteConfig {
  path: string;
  seoProps: PageSEOProps;
}

// Generate dynamic routes for all funds, managers, categories, and tags
const generateDynamicRoutes = (): RouteConfig[] => {
  const routes: RouteConfig[] = [];
  
  // Fund detail pages
  funds.forEach(fund => {
    routes.push({
      path: `/funds/${fund.id}`,
      seoProps: { pageType: 'fund', fundName: fund.name }
    });
  });
  
  // Manager pages
  const managers = getAllFundManagers();
  managers.forEach((manager: { name: string; logo?: string }) => {
    const slug = manager.name.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      path: `/manager/${slug}`,
      seoProps: { pageType: 'manager', managerName: manager.name }
    });
  });
  
  // Category pages
  const categories = getAllCategories();
  categories.forEach((category: string) => {
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      path: `/categories/${slug}`,
      seoProps: { pageType: 'category', categoryName: category }
    });
  });
  
  // Tag pages
  const tags = getAllTags();
  tags.forEach((tag: string) => {
    const slug = tag.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      path: `/tags/${slug}`,
      seoProps: { pageType: 'tag', tagName: tag }
    });
  });
  
  return routes;
};

export const routes: RouteConfig[] = [
  // Static routes
  {
    path: '/',
    seoProps: { pageType: 'homepage' }
  },
  {
    path: '/managers',
    seoProps: { pageType: 'managers-hub' }
  },
  {
    path: '/categories',
    seoProps: { pageType: 'categories-hub' }
  },
  {
    path: '/tags',
    seoProps: { pageType: 'tags-hub' }
  },
  {
    path: '/compare',
    seoProps: { pageType: 'comparison' }
  },
  {
    path: '/comparisons',
    seoProps: { pageType: 'comparisons-hub' }
  },
  {
    path: '/roi-calculator',
    seoProps: { pageType: 'roi-calculator' }
  },
  {
    path: '/fund-quiz',
    seoProps: { pageType: 'fund-quiz' }
  },
  {
    path: '/about',
    seoProps: { pageType: 'about' }
  },
  {
    path: '/faqs',
    seoProps: { pageType: 'faqs' }
  },
  {
    path: '/privacy',
    seoProps: { pageType: 'privacy' }
  },
  {
    path: '/disclaimer',
    seoProps: { pageType: 'disclaimer' }
  },
  {
    path: '/404',
    seoProps: { pageType: '404' }
  },
  // Add all dynamic routes
  ...generateDynamicRoutes()
];
