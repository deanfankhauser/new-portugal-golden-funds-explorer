import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../../src/ssg/routeDiscovery';
import { findBuiltAssets, validateAssetPaths } from './asset-discovery';
import { processRoute } from './route-processor';
import { validateGeneratedFile, verifyCriticalPages } from './validation';
import { generateSitemap } from './sitemap-generator';

export async function generateStaticFiles() {
  console.log('🎨 SSG: Starting static site generation...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ SSG: Build directory not found. Please run "vite build" first.');
    process.exit(1);
  }

  const { cssFiles, jsFiles } = findBuiltAssets(distDir);
  const { validCss, validJs } = validateAssetPaths(distDir, cssFiles, jsFiles);
  
  if (validCss.length === 0) {
    console.warn('⚠️  SSG: No valid CSS files found. Styles may not load correctly.');
  }
  
  if (validJs.length === 0) {
    console.warn('⚠️  SSG: No valid JS files found. Interactivity may not work.');
  }

  const routes = getAllStaticRoutes();
  console.log(`📄 SSG: Processing ${routes.length} routes for static generation`);

  let successCount = 0;
  const failedRoutes: string[] = [];

  // Process each route
  for (const route of routes) {
    const result = await processRoute(route, distDir, validCss, validJs);
    
    if (result.success && result.outputPath && result.seoData) {
      successCount++;
      validateGeneratedFile(result.outputPath, result.seoData, validCss, validJs);
    } else {
      failedRoutes.push(route.path);
    }
  }

  // Generate sitemap
  generateSitemap(routes, distDir);
  
  // Final report
  console.log('\n🎉 SSG: Static site generation completed!');
  console.log('📊 Generation Summary:');
  console.log(`   ✅ Successfully generated: ${successCount}/${routes.length} pages`);
  console.log(`   📁 CSS assets linked: ${validCss.length}`);
  console.log(`   📁 JS assets linked: ${validJs.length}`);
  console.log(`   🗺️  Sitemap generated with ${routes.length} URLs`);
  
  if (failedRoutes.length > 0) {
    console.log(`   ❌ Failed routes: ${failedRoutes.join(', ')}`);
  }
  
  // Verify critical pages
  verifyCriticalPages(distDir);
  
  console.log(`\n🚀 Static site ready at: ${distDir}`);
}