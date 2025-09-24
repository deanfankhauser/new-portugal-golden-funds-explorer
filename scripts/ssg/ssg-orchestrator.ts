import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../../src/ssg/routeDiscovery';
import { findBuiltAssets, validateAssetPaths } from './asset-discovery';
import { processRoute } from './route-processor';
import { validateGeneratedFile, verifyCriticalPages } from './validation';
import { generateSitemap } from './sitemap-generator';
import { generateFundsSitemap } from './sitemap-funds-generator';
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
  
  // Generate sitemaps with all discovered routes (not just successful ones)
  // This ensures the sitemap includes all intended URLs for SEO, even if SSG fails for some
  generateSitemap(routes, distDir);
  generateFundsSitemap(distDir);
  
  // Final report
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n🎉 SSG: Static site generation completed!');
    console.log('📊 Generation Summary:');
    console.log(`   ✅ Successfully generated: ${successCount}/${routes.length} pages`);
    console.log(`   📁 CSS assets linked: ${validCss.length}`);
    console.log(`   📁 JS assets linked: ${validJs.length}`);
    console.log(`   🗺️  Sitemap generated with ${routes.length} URLs`);
    
    if (failedRoutes.length > 0) {
      console.log(`   ❌ Failed routes: ${failedRoutes.join(', ')}`);
    }
    
    console.log(`\n🚀 Static site ready at: ${distDir}`);
  }
  
  // Verify critical pages
  verifyCriticalPages(distDir);
}