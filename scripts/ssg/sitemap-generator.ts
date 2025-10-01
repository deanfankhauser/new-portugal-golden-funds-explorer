import fs from 'fs';
import path from 'path';
import { StaticRoute } from '../../src/ssg/routeDiscovery';
import { DateManagementService } from '../../src/services/dateManagementService';
import { funds } from '../../src/data/services/funds-service';
import { getAllComparisonSlugs } from '../../src/data/services/comparison-service';
import { EnhancedSitemapService } from '../../src/services/enhancedSitemapService';
import { getAllCategories } from '../../src/data/services/categories-service';
import { getAllTags } from '../../src/data/services/tags-service';
import { categoryToSlug, tagToSlug } from '../../src/lib/utils';

export function generateSitemap(routes: StaticRoute[], distDir: string): void {
  // Build route-derived entries with enhanced priority logic
  const routeEntries = routes.map(route => {
    let priority = '0.6'; // Default for static pages
    let changefreq = 'weekly';
    let lastmod = DateManagementService.getCurrentISODate();

    if (route.path === '/') {
      priority = '1.0'; // Homepage - highest priority
      changefreq = 'daily';
    } else if (route.pageType === 'fund-index') {
      priority = '0.95'; // Fund index - critical discovery page
      changefreq = 'daily';
    } else if (route.pageType === 'fund') {
      // Individual funds: 0.85-0.90 based on performance/data quality
      const fund = route.fundId ? funds.find(f => f.id === route.fundId) : null;
      if (fund) {
        const contentDates = DateManagementService.getFundContentDates(fund);
        lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
        changefreq = contentDates.changeFrequency;
        
        // Higher priority for funds with better data quality
        const hasPerformance = fund.historicalPerformance && fund.historicalPerformance.length > 0;
        const hasRichData = fund.websiteUrl && fund.description;
        priority = (hasPerformance && hasRichData) ? '0.90' : '0.85';
      } else {
        priority = '0.85';
      }
    } else if (route.pageType === 'fund-comparison') {
      priority = '0.80'; // Comparisons - valuable for users
      changefreq = 'weekly';
      const contentDates = DateManagementService.getContentDates('comparison');
      lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
    } else if (route.pageType === 'fund-alternatives') {
      priority = '0.75'; // Alternatives - discovery tool
      changefreq = 'weekly';
      const fund = route.fundId ? funds.find(f => f.id === route.fundId) : null;
      if (fund) {
        const contentDates = DateManagementService.getFundContentDates(fund);
        lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
      }
    } else if (route.pageType === 'category') {
      priority = '0.75'; // Categories - important taxonomy
      changefreq = 'weekly';
      const contentDates = DateManagementService.getContentDates('category');
      lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
    } else if (route.pageType === 'tag') {
      priority = '0.70'; // Tags - secondary taxonomy
      changefreq = 'weekly';
      const contentDates = DateManagementService.getContentDates('tag');
      lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
    } else if (['categories-hub', 'tags-hub', 'managers-hub', 'comparisons-hub', 'alternatives-hub'].includes(route.pageType)) {
      priority = '0.70'; // Hub pages - navigation aids
      changefreq = 'weekly';
      const contentDates = DateManagementService.getContentDates(route.pageType);
      lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
    } else if (route.pageType === 'manager') {
      priority = '0.65'; // Manager pages
      changefreq = 'monthly';
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

  // Ensure core hub/static pages with differentiated priorities
  const now = DateManagementService.getCurrentISODate();
  const corePages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/index', priority: '0.95', changefreq: 'daily' },
    { path: '/categories', priority: '0.70', changefreq: 'weekly' },
    { path: '/tags', priority: '0.70', changefreq: 'weekly' },
    { path: '/managers', priority: '0.70', changefreq: 'weekly' },
    { path: '/comparisons', priority: '0.70', changefreq: 'weekly' },
    { path: '/compare', priority: '0.70', changefreq: 'weekly' },
    { path: '/alternatives', priority: '0.70', changefreq: 'weekly' },
    { path: '/roi-calculator', priority: '0.65', changefreq: 'monthly' },
    { path: '/about', priority: '0.60', changefreq: 'monthly' },
    { path: '/faqs', priority: '0.65', changefreq: 'monthly' },
    { path: '/disclaimer', priority: '0.50', changefreq: 'yearly' },
    { path: '/privacy', priority: '0.50', changefreq: 'yearly' },
    { path: '/saved-funds', priority: '0.40', changefreq: 'never' }, // User-specific
  ];
  corePages.forEach(({ path, priority, changefreq }) => addIfMissing({
    url: `https://funds.movingto.com${path === '/' ? '' : path}`,
    lastmod: now,
    changefreq,
    priority
  }));

  // Force include all discovered category and tag detail pages with proper priorities
  routes.filter(r => r.pageType === 'category' || r.pageType === 'tag').forEach(r => addIfMissing({
    url: `https://funds.movingto.com${r.path}`,
    lastmod: now,
    changefreq: 'weekly',
    priority: r.pageType === 'category' ? '0.75' : '0.70'
  }));

  // Also force include using direct data (independent of route discovery)
  try {
    const categoriesList = getAllCategories();
    categoriesList.forEach(cat => addIfMissing({
      url: `https://funds.movingto.com/categories/${categoryToSlug(cat as any)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.75' // Categories are important taxonomy
    }));
    const tagsList = getAllTags();
    tagsList.forEach(tag => addIfMissing({
      url: `https://funds.movingto.com/tags/${tagToSlug(tag as any)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.70' // Tags are secondary taxonomy
    }));
  } catch (e) {
    console.warn('⚠️  Sitemap: category/tag data include failed:', (e as any)?.message || e);
  }

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