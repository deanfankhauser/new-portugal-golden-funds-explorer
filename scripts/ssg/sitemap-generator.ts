import fs from 'fs';
import path from 'path';
import { StaticRoute } from '../../src/ssg/routeDiscovery';
import { DateManagementService } from '../../src/services/dateManagementService';
import { funds } from '../../src/data/services/funds-service';
import { getAllComparisonSlugs } from '../../src/data/services/comparison-service';
import { EnhancedSitemapService } from '../../src/services/enhancedSitemapService';

export function generateSitemap(routes: StaticRoute[], distDir: string): void {
  // Build route-derived entries first
  const routeEntries = routes.map(route => {
    let priority = '0.8';
    let changefreq = 'weekly';
    let lastmod = DateManagementService.getCurrentISODate();

    if (route.path === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (route.pageType === 'fund') {
      priority = '0.9';
      const fund = route.fundId ? funds.find(f => f.id === route.fundId) : null;
      if (fund) {
        const contentDates = DateManagementService.getFundContentDates(fund);
        lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
        changefreq = contentDates.changeFrequency;
      }
    } else if (route.pageType === 'fund-index') {
      priority = '0.9';
      changefreq = 'daily';
    } else if (route.pageType === 'fund-comparison') {
      priority = '0.85';
      changefreq = 'weekly';
      const contentDates = DateManagementService.getContentDates('comparison');
      lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
    } else if (route.pageType === 'fund-alternatives') {
      priority = '0.8';
      changefreq = 'weekly';
      const fund = route.fundId ? funds.find(f => f.id === route.fundId) : null;
      if (fund) {
        const contentDates = DateManagementService.getFundContentDates(fund);
        lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
      }
    } else if (['categories', 'tags', 'managers', 'comparisons-hub', 'alternatives-hub'].includes(route.pageType)) {
      priority = '0.7';
      changefreq = 'weekly';
      const contentDates = DateManagementService.getContentDates(route.pageType);
      lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
    }

    return {
      url: `https://funds.movingto.com${route.path}`,
      lastmod,
      changefreq,
      priority
    };
  });

  // Merge with enhanced entries (static + content-aware)
  const enhancedEntries = EnhancedSitemapService.generateEnhancedSitemapEntries();

  const byUrl = new Map<string, { lastmod: string; changefreq: string; priority: string }>();
  const addIfMissing = (e: { url: string; lastmod: string; changefreq: string; priority: number | string }) => {
    const priorityStr = typeof e.priority === 'number' ? e.priority.toFixed(2).replace(/\.00$/, '') : e.priority;
    if (!byUrl.has(e.url)) {
      byUrl.set(e.url, {
        lastmod: e.lastmod,
        changefreq: e.changefreq as string,
        priority: String(priorityStr)
      });
    }
  };

  routeEntries.forEach(addIfMissing);
  enhancedEntries.forEach(addIfMissing);

  const urlElements = Array.from(byUrl.entries()).map(([url, meta]) => `  <url>
    <loc>${url}</loc>
    <lastmod>${meta.lastmod}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

  // Coverage logs
  const comparisonSlugs = getAllComparisonSlugs();
  const comparisonRoutesInSitemap = routes.filter(r => r.pageType === 'fund-comparison').length;
  const alternativesRoutesInSitemap = routes.filter(r => r.pageType === 'fund-alternatives').length;
  const categoryRoutesInSitemap = routes.filter(r => r.pageType === 'category').length;

  console.log(`✅ Sitemap: Generated ${byUrl.size} URLs including ${comparisonRoutesInSitemap} comparison pages, ${alternativesRoutesInSitemap} alternatives pages, and ${categoryRoutesInSitemap} category pages`);
  if (comparisonRoutesInSitemap < comparisonSlugs.length) {
    console.warn(`⚠️  Sitemap: Missing ${comparisonSlugs.length - comparisonRoutesInSitemap} comparison URLs`);
  }
}