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
import { generateComprehensiveSitemaps } from './comprehensive-sitemap-generator';

export async function generateStaticFiles() {
  const distDir = path.join(process.cwd(), 'dist');
  const isDebug = process.env.SSG_DEBUG === '1';
  
  console.log('\n🎯 SSG: Starting static site generation...');
  console.log(`📁 Output directory: ${distDir}`);
  if (isDebug) {
    console.log(`🐛 Debug mode: ENABLED (SSG_DEBUG=1)\n`);
  } else {
    console.log(`💡 Tip: Set SSG_DEBUG=1 for verbose output\n`);
  }
  
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
  console.log(`📄 SSG: Processing ${routes.length} routes for static generation\n`);

  let successCount = 0;
  let failedCount = 0;
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
      failedCount++;
      failedRoutes.push(route.path);
    }
  }

  // Summary
  console.log('\n📊 SSG Generation Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  console.log(`   📄 Total routes: ${routes.length}`);
  console.log(`   🎨 CSS files: ${validCss.length}`);
  console.log(`   📦 JS files: ${validJs.length}`);
  
  // Fail build if any critical pages failed
  if (failedCount > 0) {
    console.error('\n❌ SSG BUILD FAILED: Some routes could not be generated');
    console.error(`   Failed routes: ${failedRoutes.join(', ')}`);
    throw new Error(`SSG failed to generate ${failedCount} routes`);
  }

  // Generate 404 page
  await generate404Page(distDir);
  
  // Use the new comprehensive sitemap generator
  try {
    generateComprehensiveSitemaps(distDir);
  } catch (sitemapError) {
    console.warn('⚠️  Comprehensive sitemap generation failed, falling back to legacy generators');
    
    // Fallback to existing generators
    generateSitemap(routes, distDir);
    generateFundsSitemap(distDir);
    
    // Generate enhanced sitemap as a supplemental file
    const enhancedSitemapXML = EnhancedSitemapService.generateEnhancedSitemapXML();
    fs.writeFileSync(path.join(distDir, 'sitemap-enhanced.xml'), enhancedSitemapXML);
    
    // Generate sitemap index
    const sitemapIndex = EnhancedSitemapService.generateSitemapIndex();
    fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), sitemapIndex);
    
    // Generate robots.txt
    const robotsTxt = EnhancedSitemapService.generateRobotsTxt();
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
  }

  // Final report
  console.log('\n🎉 SSG: Static site generation completed!');
  console.log(`🗺️  Comprehensive sitemap generated with full URL coverage`);
  
  if (failedRoutes.length > 0) {
    console.log(`   ⚠️  Warning: ${failedRoutes.length} routes had issues but build continued`);
  }
  
  console.log(`\n🚀 Static site ready at: ${distDir}`);
  
  // Verify critical pages
  verifyCriticalPages(distDir);
}