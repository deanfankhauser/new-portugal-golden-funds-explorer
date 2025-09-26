import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../../src/ssg/routeDiscovery';
import { findBuiltAssets, validateAssetPaths } from './asset-discovery';
import { processRoute } from './route-processor';
import { validateGeneratedFile, verifyCriticalPages } from './validation';
import { generateSitemap } from './sitemap-generator';
import { generateFundsSitemap } from './sitemap-funds-generator';
import { EnhancedSitemapService } from '../../src/services/enhancedSitemapService';
import { generate404Page } from './404-generator';

export async function generateStaticFiles() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🎨 SSG: Starting static site generation...');
  }
  
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ SSG: Build directory not found. Please run "vite build" first.');
    process.exit(1);
  }

  const { cssFiles, jsFiles } = findBuiltAssets(distDir);
  const { validCss, validJs } = validateAssetPaths(distDir, cssFiles, jsFiles);
  
  // Fail fast if no assets found - this prevents deploying broken pages
  if (validCss.length === 0) {
    console.error('❌ SSG: No valid CSS files found. Cannot generate working pages.');
    process.exit(1);
  }
  
  if (validJs.length === 0) {
    console.error('❌ SSG: No valid JS files found. Cannot generate interactive pages.');
    process.exit(1);
  }

  const routes = await getAllStaticRoutes();
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📄 SSG: Processing ${routes.length} routes for static generation`);
  }

  let successCount = 0;
  const failedRoutes: string[] = [];
  const successfulRoutes: any[] = [];

  // Process each route
  for (const route of routes) {
    const result = await processRoute(route, distDir, validCss, validJs);
    
    if (result.success && result.outputPath && result.seoData) {
      successCount++;
      successfulRoutes.push(route);
      validateGeneratedFile(result.outputPath, result.seoData, validCss, validJs);
    } else {
      failedRoutes.push(route.path);
    }
  }

  // Generate 404 page
  await generate404Page(distDir);
  
  // Generate enhanced sitemaps with all discovered routes
  // This ensures the sitemap includes all intended URLs for SEO, even if SSG fails for some
  generateSitemap(routes, distDir);
  generateFundsSitemap(distDir);
  
  // Generate enhanced sitemap as a supplemental file (do not overwrite the main routes sitemap)
  const enhancedSitemapXML = EnhancedSitemapService.generateEnhancedSitemapXML();
  fs.writeFileSync(path.join(distDir, 'sitemap-enhanced.xml'), enhancedSitemapXML);
  
  // Generate sitemap index (include all sitemaps)
  const sitemapIndex = EnhancedSitemapService.generateSitemapIndex();
  fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), sitemapIndex);
  
  // Generate robots.txt
  const robotsTxt = EnhancedSitemapService.generateRobotsTxt();
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);

  // Consolidate all sitemaps into a single comprehensive sitemap.xml for preview/build_ssg
  try {
    const read = (name: string) => {
      const p = path.join(distDir, name);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    };
    const base = read('sitemap.xml');
    const enhanced = read('sitemap-enhanced.xml');
    const fundsMap = read('sitemap-funds.xml');
    const xmls = [base, enhanced, fundsMap].filter(Boolean);

    const urlSet = new Set<string>();
    const lastmodMap = new Map<string, string>();
    const changefreqMap = new Map<string, string>();
    const priorityMap = new Map<string, string>();

    const urlRegex = /<url>[\s\S]*?<loc>(.*?)<\/loc>[\s\S]*?<lastmod>(.*?)<\/lastmod>[\s\S]*?<changefreq>(.*?)<\/changefreq>[\s\S]*?<priority>(.*?)<\/priority>[\s\S]*?<\/url>/g;
    for (const xml of xmls) {
      let m: RegExpExecArray | null;
      while ((m = urlRegex.exec(xml))) {
        const [ , loc, lastmod, changefreq, priority ] = m;
        urlSet.add(loc);
        if (!lastmodMap.has(loc) || (lastmod > (lastmodMap.get(loc) || ''))) lastmodMap.set(loc, lastmod);
        if (!changefreqMap.has(loc)) changefreqMap.set(loc, changefreq);
        if (!priorityMap.has(loc)) priorityMap.set(loc, priority);
      }
    }

    // Force include categories and tags from data
    try {
      const { getAllCategories } = await import('../../src/data/services/categories-service');
      const { getAllTags } = await import('../../src/data/services/tags-service');
      const { categoryToSlug, tagToSlug } = await import('../../src/lib/utils');
      const today = new Date().toISOString().split('T')[0];

      const cats = getAllCategories();
      cats.forEach((cat: any) => {
        const loc = `https://funds.movingto.com/categories/${categoryToSlug(cat as string)}`;
        urlSet.add(loc);
        if (!lastmodMap.has(loc)) lastmodMap.set(loc, today);
        if (!changefreqMap.has(loc)) changefreqMap.set(loc, 'weekly');
        if (!priorityMap.has(loc)) priorityMap.set(loc, '0.8');
      });

      const tags = getAllTags();
      tags.forEach((tag: any) => {
        const loc = `https://funds.movingto.com/tags/${tagToSlug(tag as string)}`;
        urlSet.add(loc);
        if (!lastmodMap.has(loc)) lastmodMap.set(loc, today);
        if (!changefreqMap.has(loc)) changefreqMap.set(loc, 'weekly');
        if (!priorityMap.has(loc)) priorityMap.set(loc, '0.7');
      });
    } catch (incErr) {
      console.warn('⚠️  Consolidation: failed to include category/tag URLs directly:', (incErr as any)?.message || incErr);
    }

    const merged = Array.from(urlSet.values()).sort().map(loc => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmodMap.get(loc) || new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>${changefreqMap.get(loc) || 'weekly'}</changefreq>\n    <priority>${priorityMap.get(loc) || '0.7'}</priority>\n  </url>`).join('\n');

    const finalSitemap = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${merged}\n</urlset>`;
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), finalSitemap);
    console.log(`🗺️  Consolidated sitemap.xml with ${urlSet.size} URLs`);

    // Also write a copy to /public so build_ssg preview serves the consolidated sitemap
    try {
      const publicDir = path.join(process.cwd(), 'public');
      if (fs.existsSync(publicDir)) {
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), finalSitemap);
        console.log('🗺️  Copied consolidated sitemap.xml to /public');
      }
    } catch (copyErr) {
      console.warn('⚠️  Failed to copy consolidated sitemap to /public:', (copyErr as any)?.message || copyErr);
    }
  } catch (e) {
    console.warn('⚠️  Failed to consolidate sitemaps:', (e as any)?.message || e);
  }


  // Verify sitemap coverage (routes vs generated XML)
  try {
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const count = (pattern: RegExp) => (content.match(pattern) || []).length;

    const staticChecks = [
      '/', '/index', '/about', '/disclaimer', '/privacy', '/faqs',
      '/roi-calculator', '/categories', '/tags', '/managers',
      '/comparisons', '/compare', '/alternatives'
    ];
    const missingStatics = staticChecks.filter(p => {
      const full = `https://funds.movingto.com${p === '/' ? '' : p}`;
      return !content.includes(full);
    });

    const categoriesRoutes = routes.filter(r => r.pageType === 'category');
    const tagsRoutes = routes.filter(r => r.pageType === 'tag');
    const managersRoutes = routes.filter(r => r.pageType === 'manager');
    const comparisonsRoutes = routes.filter(r => r.pageType === 'fund-comparison');
    const alternativesRoutes = routes.filter(r => r.pageType === 'fund-alternatives');

    // Sample check for first 5 of each
    const sampleCheck = (rs: any[]) => rs.slice(0, 5).map(r => `https://funds.movingto.com${r.path}`).filter(u => !content.includes(u));
    const missingCategorySamples = sampleCheck(categoriesRoutes);
    const missingTagSamples = sampleCheck(tagsRoutes);

    console.log(`🧩 Sitemap coverage: categories=${count(/\/categories\//g)} (expected ${categoriesRoutes.length}), tags=${count(/\/tags\//g)} (expected ${tagsRoutes.length}), managers=${count(/\/manager\//g)} (expected ${managersRoutes.length}), comparisons=${count(/\/compare\//g)} (expected ${comparisonsRoutes.length}), alternatives=${count(/\/[a-z0-9-]+\/alternatives/g)} (expected ${alternativesRoutes.length})`);
    if (missingStatics.length) console.warn('⚠️  Sitemap missing core static pages:', missingStatics.join(', '));
    if (missingCategorySamples.length) console.warn('⚠️  Sample missing category URLs:', missingCategorySamples.join(', '));
    if (missingTagSamples.length) console.warn('⚠️  Sample missing tag URLs:', missingTagSamples.join(', '));
  } catch (e) {
    console.warn('⚠️  Could not verify sitemap coverage:', (e as any)?.message || e);
  }
  
  // Final report
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n🎉 SSG: Static site generation completed!');
    console.log('📊 Generation Summary:');
    console.log(`   ✅ Successfully generated: ${successCount}/${routes.length} pages`);
    console.log(`   📁 CSS assets linked: ${validCss.length}`);
    console.log(`   📁 JS assets linked: ${validJs.length}`);
    console.log(`   🗺️  Enhanced sitemap generated with comprehensive URL coverage`);
    console.log(`   🗺️  Sitemap index and robots.txt updated`);
    
    if (failedRoutes.length > 0) {
      console.log(`   ❌ Failed routes: ${failedRoutes.join(', ')}`);
    }
    
    console.log(`\n🚀 Static site ready at: ${distDir}`);
  }
  
  // Verify critical pages
  verifyCriticalPages(distDir);
}