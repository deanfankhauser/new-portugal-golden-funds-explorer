import fs from 'fs';
import path from 'path';
import { StaticRoute } from '../../src/ssg/routeDiscovery';

export function generateSitemap(routes: StaticRoute[], distDir: string): void {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  let priority = '0.8';
  if (route.path === '/') priority = '1.0';
  else if (route.pageType === 'fund') priority = '0.9';
  else if (route.pageType === 'fund-index') priority = '0.9';
  else if (route.pageType === 'fund-comparison') priority = '0.8';
  else if (['categories', 'tags', 'managers', 'comparisons-hub'].includes(route.pageType)) priority = '0.7';
  
  return `  <url>
    <loc>https://funds.movingto.com${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  // Sitemap generated
}