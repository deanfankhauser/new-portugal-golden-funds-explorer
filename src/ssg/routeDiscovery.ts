
import { fundsData } from '../data/funds';
import { managersService } from '../data/services/managers-service';
import { categoriesService } from '../data/services/categories-service';
import { tagsService } from '../data/services/tags-service';

export interface StaticRoute {
  path: string;
  pageType: string;
  params?: Record<string, string>;
}

export class RouteDiscovery {
  static getAllStaticRoutes(): StaticRoute[] {
    const routes: StaticRoute[] = [];

    // Homepage
    routes.push({ path: '/', pageType: 'homepage' });

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

    // Fund detail pages
    fundsData.forEach(fund => {
      routes.push({
        path: `/funds/${fund.id}`,
        pageType: 'fund',
        params: { fundName: fund.name }
      });
    });

    // Manager pages
    const managers = managersService.getAllManagers();
    managers.forEach(manager => {
      const slug = manager.toLowerCase().replace(/\s+/g, '-');
      routes.push({
        path: `/manager/${slug}`,
        pageType: 'manager',
        params: { managerName: manager }
      });
    });

    // Category pages
    const categories = categoriesService.getAllCategories();
    categories.forEach(category => {
      const slug = category.toLowerCase().replace(/\s+/g, '-');
      routes.push({
        path: `/categories/${slug}`,
        pageType: 'category',
        params: { categoryName: category }
      });
    });

    // Tag pages
    const tags = tagsService.getAllTags();
    tags.forEach(tag => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-');
      routes.push({
        path: `/tags/${slug}`,
        pageType: 'tag',
        params: { tagName: tag }
      });
    });

    return routes;
  }

  static generateSitemap(): string {
    const routes = this.getAllStaticRoutes();
    const baseUrl = 'https://movingto.com/funds';
    
    const urls = routes.map(route => {
      return `  <url>
    <loc>${baseUrl}${route.path}</loc>
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
