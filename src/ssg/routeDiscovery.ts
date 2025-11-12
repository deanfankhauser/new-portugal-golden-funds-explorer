import { fetchAllBuildDataCached } from '../lib/build-data-fetcher';
import { generateComparisonsFromFunds } from '../data/services/comparison-service';
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

    console.log('🔍 RouteDiscovery: Fetching data from database for route generation...');
    
    // Fetch all data from database (cached for efficiency)
    const { funds, categories, tags, managers } = await fetchAllBuildDataCached();

    // Homepage (also serves as fund index)
    routes.push({ path: '/', pageType: 'homepage' });

    // Static pages
    routes.push({ path: '/about', pageType: 'about' });
    routes.push({ path: '/disclaimer', pageType: 'disclaimer' });
    routes.push({ path: '/privacy', pageType: 'privacy' });
    routes.push({ path: '/faqs', pageType: 'faqs' });
    routes.push({ path: '/compare', pageType: 'comparison' });
    routes.push({ path: '/comparisons', pageType: 'comparisons-hub' });
    routes.push({ path: '/roi-calculator', pageType: 'roi-calculator' });
    routes.push({ path: '/saved-funds', pageType: 'saved-funds' });
    
    routes.push({ path: '/managers', pageType: 'managers-hub' });
    routes.push({ path: '/categories', pageType: 'categories-hub' });
    routes.push({ path: '/tags', pageType: 'tags-hub' });
    routes.push({ path: '/alternatives', pageType: 'alternatives-hub' });

    // Fund detail pages - ONLY the direct route pattern
    funds.forEach(fund => {
      // Only use the new direct route: /fund-id
      routes.push({
        path: `/${fund.id}`,
        pageType: 'fund',
        params: { fundName: fund.name },
        fundId: fund.id
      });
    });

    // Manager pages
    managers.forEach(manager => {
      const slug = managerToSlug(manager.name);
      routes.push({
        path: `/manager/${slug}`,
        pageType: 'manager',
        params: { managerName: manager.name }
      });
    });

    // Category pages
    categories.forEach(category => {
      const slug = categoryToSlug(category);
      routes.push({
        path: `/categories/${slug}`,
        pageType: 'category',
        params: { categoryName: category }
      });
    });

    // Tag pages
    tags.forEach(tag => {
      const slug = tagToSlug(tag);
      routes.push({
        path: `/tags/${slug}`,
        pageType: 'tag',
        params: { tagName: tag }
      });
    });

    // Fund comparison pages
    const comparisons = generateComparisonsFromFunds(funds);
    comparisons.forEach(comparison => {
      routes.push({
        path: `/compare/${comparison.slug}`,
        pageType: 'fund-comparison',
        params: { slug: comparison.slug }
      });
    });

    // Fund alternatives pages (always generate for all funds)
    funds.forEach(fund => {
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
      // Exclude fund manager routes
      if (route.path.startsWith('/manage-fund')) return false;
      return true;
    });

    console.log(`🔍 RouteDiscovery: Generated ${filteredRoutes.length} static routes from database (filtered from ${routes.length} total, including ${comparisons.length} comparisons and ${funds.length} alternatives pages)`);
    return filteredRoutes;
  }

}

export const getAllStaticRoutes = () => RouteDiscovery.getAllStaticRoutes();
