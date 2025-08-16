import fs from 'fs';
import path from 'path';
import { StaticRoute } from '../../src/ssg/routeDiscovery';
import { DateManagementService } from '../../src/services/dateManagementService';
import { funds } from '../../src/data/services/funds-service';
import { getAllComparisonSlugs } from '../../src/data/services/comparison-service';

export function generateSitemap(routes: StaticRoute[], distDir: string): void {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  let priority = '0.8';
  let changefreq = 'weekly';
  let lastmod = DateManagementService.getCurrentISODate();

  // Set priority and frequency based on page type and content
  if (route.path === '/') {
    priority = '1.0';
    changefreq = 'daily';
  } else if (route.pageType === 'fund') {
    priority = '0.9';
    // Get fund-specific dates if available
    const fund = route.fundId ? funds.find(f => f.id === route.fundId) : null;
    if (fund) {
      const contentDates = DateManagementService.getFundContentDates(fund);
      lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
      changefreq = contentDates.changeFrequency;
    }
  } else if (route.pageType === 'fund-index') {
    priority = '0.9';
    changefreq = 'daily'; // Fund index updates frequently
  } else if (route.pageType === 'fund-comparison') {
    priority = '0.85'; // Higher priority for comparison pages
    changefreq = 'weekly';
    // Use content-specific dates for comparison pages
    const contentDates = DateManagementService.getContentDates('comparison');
    lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
  } else if (['categories', 'tags', 'managers', 'comparisons-hub'].includes(route.pageType)) {
    priority = '0.7';
    changefreq = 'weekly';
    const contentDates = DateManagementService.getContentDates(route.pageType);
    lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
  }
  
  return `  <url>
    <loc>https://funds.movingto.com${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  
  // Verify comparison URLs are included
  const comparisonSlugs = getAllComparisonSlugs();
  const comparisonRoutesInSitemap = routes.filter(r => r.pageType === 'fund-comparison').length;
  
  console.log(`✅ Sitemap: Generated ${routes.length} URLs including ${comparisonRoutesInSitemap} comparison pages`);
  
  if (comparisonRoutesInSitemap < comparisonSlugs.length) {
    console.warn(`⚠️  Sitemap: Missing ${comparisonSlugs.length - comparisonRoutesInSitemap} comparison URLs`);
  }
}