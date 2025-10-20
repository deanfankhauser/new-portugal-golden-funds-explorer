
import { fundsData } from '../data/mock/funds';
import { getAllFundManagers } from '../data/services/managers-service';
import { getAllCategories } from '../data/services/categories-service';
import { getAllTags } from '../data/services/tags-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

export interface StaticRoute {
  path: string;
  pageType: string;
  params?: Record<string, string>;
  fundId?: string;
}

export class RouteDiscovery {
  static async getAllStaticRoutes(): Promise<StaticRoute[]> {
    const routes: StaticRoute[] = [];

    // Homepage (also serves as fund index)
    routes.push({ path: '/', pageType: 'homepage' });
    
    // Fund index page
    routes.push({ path: '/index', pageType: 'fund-index' });

    // Static pages
    routes.push({ path: '/about', pageType: 'about' });
    routes.push({ path: '/disclaimer', pageType: 'disclaimer' });
    routes.push({ path: '/privacy', pageType: 'privacy' });
    routes.push({ path: '/faqs', pageType: 'faqs' });
    routes.push({ path: '/compare', pageType: 'comparison' });
    routes.push({ path: '/comparisons', pageType: 'comparisons-hub' });
    routes.push({ path: '/roi-calculator', pageType: 'roi-calculator' });
    routes.push({ path: '/saved-funds', pageType: 'saved-funds' });
    
    // Auth pages - generate for SEO but handle auth state gracefully
    routes.push({ path: '/manager-auth', pageType: 'manager-auth' });
    routes.push({ path: '/investor-auth', pageType: 'investor-auth' });
    routes.push({ path: '/account-settings', pageType: 'account-settings' });
    routes.push({ path: '/reset-password', pageType: 'reset-password' });
    routes.push({ path: '/confirm', pageType: 'email-confirmation' });
    
    routes.push({ path: '/managers', pageType: 'managers-hub' });
    routes.push({ path: '/categories', pageType: 'categories-hub' });
    routes.push({ path: '/tags', pageType: 'tags-hub' });
    routes.push({ path: '/alternatives', pageType: 'alternatives-hub' });

    // Fund detail pages - ONLY the direct route pattern
    fundsData.forEach(fund => {
      // Only use the new direct route: /fund-id
      routes.push({
        path: `/${fund.id}`,
        pageType: 'fund',
        params: { fundName: fund.name },
        fundId: fund.id
      });
    });

    // Manager pages
    const managers = getAllFundManagers();
    managers.forEach(manager => {
      const slug = managerToSlug(manager.name);
      routes.push({
        path: `/manager/${slug}`,
        pageType: 'manager',
        params: { managerName: manager.name }
      });
    });

    // Category pages
    const categories = getAllCategories();
    categories.forEach(category => {
      const slug = categoryToSlug(category);
      routes.push({
        path: `/categories/${slug}`,
        pageType: 'category',
        params: { categoryName: category }
      });
    });

    // Tag pages
    const tags = getAllTags();
    tags.forEach(tag => {
      const slug = tagToSlug(tag);
      routes.push({
        path: `/tags/${slug}`,
        pageType: 'tag',
        params: { tagName: tag }
      });
    });

    // Fund comparison pages
    const { getAllComparisonSlugs } = await import('../data/services/comparison-service');
    const comparisonSlugs = getAllComparisonSlugs();
    comparisonSlugs.forEach(slug => {
      routes.push({
        path: `/compare/${slug}`,
        pageType: 'fund-comparison',
        params: { slug }
      });
    });

    // Fund alternatives pages (always generate for all funds)
    fundsData.forEach(fund => {
      routes.push({
        path: `/${fund.id}/alternatives`,
        pageType: 'fund-alternatives',
        params: { fundName: fund.name },
        fundId: fund.id
      });
    });

    // Filter out admin and edit suggestion routes from SSG
    const filteredRoutes = routes.filter(route => {
      // Exclude admin panel routes
      if (route.path.startsWith('/admin')) return false;
      // Exclude edit suggestion routes
      if (route.path.includes('/edit-suggestions')) return false;
      return true;
    });

    console.log(`🔍 RouteDiscovery: Generated ${filteredRoutes.length} static routes (filtered from ${routes.length} total, including ${comparisonSlugs.length} comparisons and ${fundsData.length} alternatives pages)`);
    return filteredRoutes;
  }

}

export const getAllStaticRoutes = () => RouteDiscovery.getAllStaticRoutes();
