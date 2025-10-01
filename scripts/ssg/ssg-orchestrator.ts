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
  
  // Use the new comprehensive sitemap generator (PRIMARY METHOD)
  console.log('\n🗺️  Starting COMPREHENSIVE sitemap generation...');
  console.log('🔍 Debug: Checking funds availability before sitemap generation...');
  
  // Import funds to verify they're available
  const { funds: availableFunds } = await import('../../src/data/services/funds-service');
  console.log(`🔍 Debug: ${availableFunds?.length || 0} funds available for sitemap generation`);
  
  try {
    generateComprehensiveSitemaps(distDir);
    console.log('✅ Comprehensive sitemap generation completed successfully!');
  } catch (sitemapError) {
    console.error('❌ CRITICAL: Comprehensive sitemap generation failed:', sitemapError);
    console.error('❌ Error stack:', sitemapError instanceof Error ? sitemapError.stack : 'No stack trace');
    console.warn('⚠️  Falling back to legacy generators (expect missing pages)...');
    
    // Fallback to existing generators
    try {
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
    } catch (fallbackError) {
      console.error('❌ CRITICAL: Even fallback sitemap generation failed:', fallbackError);
      throw fallbackError;
    }
  }

  // Final report
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n🎉 SSG: Static site generation completed!');
    console.log('📊 Generation Summary:');
    console.log(`   ✅ Successfully generated: ${successCount}/${routes.length} pages`);
    console.log(`   📁 CSS assets linked: ${validCss.length}`);
    console.log(`   📁 JS assets linked: ${validJs.length}`);
    console.log(`   🗺️  Comprehensive sitemap generated with full URL coverage`);
    
    if (failedRoutes.length > 0) {
      console.log(`   ❌ Failed routes: ${failedRoutes.join(', ')}`);
    }
    
    console.log(`\n🚀 Static site ready at: ${distDir}`);
  }
  
  // Verify critical pages
  verifyCriticalPages(distDir);
}