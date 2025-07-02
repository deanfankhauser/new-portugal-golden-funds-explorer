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
  static getAllStaticRoutes(): StaticRoute[] {
    const routes: StaticRoute[] = [];

    // Homepage
    routes.push({ path: '/', pageType: 'homepage' });

    // Fund Index page - Fixed to avoid double /funds
    routes.push({ path: '/index', pageType: 'fund-index' });

    // Static pages
    routes.push({ path: '/about', pageType: 'about' });
    routes.push({ path: '/disclaimer', pageType: 'disclaimer' });
    routes.push({ path: '/privacy', pageType: 'privacy' });
    routes.push({ path: '/faqs', pageType: 'faqs' });
    routes.push({ path: '/compare', pageType: 'comparison' });
    routes.push({ path: '/comparisons', pageType: 'comparisons-hub' });
    routes.push({ path: '/roi-calculator', pageType: 'roi-calculator' });
    routes.push({ path: '/fund-quiz', pageType: 'fund-quiz' });
    routes.push({ path: '/managers', pageType: 'managers-hub' });
    routes.push({ path: '/categories', pageType: 'categories-hub' });
    routes.push({ path: '/tags', pageType: 'tags-hub' });

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

    console.log(`🔍 RouteDiscovery: Generated ${routes.length} static routes`);
    return routes;
  }

  static generateSitemap(): string {
    const routes = this.getAllStaticRoutes();
    const baseUrl = 'https://movingto.com/funds';
    
    const urls = routes.map(route => {
      // Build correct URL without duplication
      const url = route.path === '/' ? baseUrl : `${baseUrl}${route.path}`;
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }
}

export const getAllStaticRoutes = () => RouteDiscovery.getAllStaticRoutes();
export const generateSitemap = () => RouteDiscovery.generateSitemap();
