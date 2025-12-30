import fs from 'fs';
import path from 'path';
import { StaticRoute } from '../../src/ssg/routeDiscovery';
import { DateManagementService } from '../../src/services/dateManagementService';
import { fetchAllFundsForBuild, fetchAllCategoriesForBuild, fetchAllTagsForBuild } from '../../src/lib/build-data-fetcher';
import { generateComparisonsFromFunds } from '../../src/data/services/comparison-service';
import { EnhancedSitemapService } from '../../src/services/enhancedSitemapService';
import { categoryToSlug, tagToSlug } from '../../src/lib/utils';
import { isLowValueComparison } from '../../src/utils/comparisonUtils';

export async function generateSitemap(routes: StaticRoute[], distDir: string): Promise<void> {
  // Fetch fund data for accurate lastmod dates
  const funds = await fetchAllFundsForBuild();
  
  // Filter to only canonical routes (exclude legacy slug aliases, alternatives pages)
  const canonicalRoutes = routes.filter(route => route.isCanonical !== false);
  const excludedCount = routes.length - canonicalRoutes.length;
  
  console.log(`📊 Sitemap: Processing ${canonicalRoutes.length} canonical routes (excluded ${excludedCount} non-canonical)`);
  
  // Build route-derived entries first
  const routeEntries = canonicalRoutes.map(route => {
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

  // Ensure core hub/static pages are present even if upstream generation misses them
  const now = DateManagementService.getCurrentISODate();
  const corePaths = ['/', '/about', '/disclaimer', '/privacy', '/faqs', '/roi-calculator', '/saved-funds', '/categories', '/tags', '/managers', '/comparisons', '/compare', '/alternatives'];
  corePaths.forEach(p => addIfMissing({
    url: `https://funds.movingto.com${p === '/' ? '' : p}`,
    lastmod: now,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  // Force include all discovered category and tag detail pages
  routes.filter(r => r.pageType === 'category' || r.pageType === 'tag').forEach(r => addIfMissing({
    url: `https://funds.movingto.com${r.path}`,
    lastmod: now,
    changefreq: 'weekly',
    priority: r.pageType === 'category' ? '0.8' : '0.7'
  }));

  // Also force include using direct data (independent of route discovery)
  try {
    const categoriesList = await fetchAllCategoriesForBuild();
    categoriesList.forEach(cat => addIfMissing({
      url: `https://funds.movingto.com/categories/${categoryToSlug(cat as any)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8'
    }));
    
    const tagsList = await fetchAllTagsForBuild();
    tagsList.forEach(tag => addIfMissing({
      url: `https://funds.movingto.com/tags/${tagToSlug(tag as any)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.7'
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

  // Coverage logs - filter out low-value comparisons that are noindexed
  const allComparisons = generateComparisonsFromFunds(funds);
  const indexableComparisons = allComparisons.filter(c => !isLowValueComparison(c.fund1, c.fund2));
  const lowValueCount = allComparisons.length - indexableComparisons.length;
  
  // Remove low-value comparison URLs from sitemap
  indexableComparisons.forEach(comparison => {
    const url = `https://funds.movingto.com/compare/${comparison.slug}`;
    if (!byUrl.has(url)) {
      const contentDates = DateManagementService.getContentDates('comparison');
      byUrl.set(url, {
        lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
        changefreq: 'weekly',
        priority: '0.85'
      });
    }
  });
  
  // Remove low-value comparison URLs that may have been added
  allComparisons.forEach(comparison => {
    if (isLowValueComparison(comparison.fund1, comparison.fund2)) {
      const url = `https://funds.movingto.com/compare/${comparison.slug}`;
      byUrl.delete(url);
    }
  });
  
  const comparisonRoutesInSitemap = Array.from(byUrl.keys()).filter(url => url.includes('/compare/')).length;
  const alternativesRoutesInSitemap = canonicalRoutes.filter(r => r.pageType === 'fund-alternatives').length;
  const categoryRoutesInSitemap = canonicalRoutes.filter(r => r.pageType === 'category').length;

  console.log(`✅ Sitemap: Generated ${byUrl.size} URLs (${comparisonRoutesInSitemap} comparisons, ${alternativesRoutesInSitemap} alternatives, ${categoryRoutesInSitemap} categories)`);
  console.log(`   Excluded ${excludedCount} non-canonical routes from sitemap`);
  console.log(`   Excluded ${lowValueCount} low-value comparisons (noindexed) from sitemap`);
  if (comparisonRoutesInSitemap < indexableComparisons.length) {
    console.warn(`⚠️  Sitemap: Missing ${indexableComparisons.length - comparisonRoutesInSitemap} comparison URLs`);
  }
}