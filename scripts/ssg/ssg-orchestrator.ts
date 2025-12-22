import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../../src/ssg/routeDiscovery';
import { findBuiltAssets, validateAssetPaths } from './asset-discovery';
import { processRoute } from './route-processor';
import { validateGeneratedFile, verifyCriticalPages } from './validation';
import { generateSitemap } from './sitemap-generator';
import { generateFundsSitemap } from './sitemap-funds-generator';
import { generate404Page } from './404-generator';
import { generateComprehensiveSitemaps } from './comprehensive-sitemap-generator';
import { validateSitemapURLs } from './validate-sitemap-urls';
import { validateSitemapCanonical } from './validate-sitemap-canonical';
import { runComprehensiveHTMLValidation } from './comprehensive-html-validation';

// NOTE: EnhancedSitemapService removed from orchestrator to avoid Node.js module leakage
// Sitemap generation is now fully handled by comprehensive-sitemap-generator

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

  // Write manifest of generated routes for debugging on Vercel
  try {
    const manifest = {
      generatedAt: new Date().toISOString(),
      counts: {
        total: routes.length,
        success: successCount,
        failed: failedCount,
        byType: routes.reduce((acc: Record<string, number>, r) => {
          acc[r.pageType] = (acc[r.pageType] || 0) + 1;
          return acc;
        }, {})
      },
      routes: successfulRoutes.map(r => r.path),
      failedRoutes
    };
    fs.writeFileSync(path.join(distDir, 'ssg-manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('📝 Wrote SSG manifest: dist/ssg-manifest.json');
  } catch (e) {
    console.warn('⚠️  Could not write ssg-manifest.json:', (e as Error).message);
  }

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
    await generateComprehensiveSitemaps(distDir);
  } catch (sitemapError) {
    console.error('❌ Comprehensive sitemap generation failed:', sitemapError);
    console.warn('⚠️  Falling back to legacy sitemap generators...');
    
    // Fallback to existing generators only
    await generateSitemap(routes, distDir);
    await generateFundsSitemap(distDir);
    
    // Generate basic robots.txt
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://funds.movingto.com/sitemap.xml

Disallow: /admin
Disallow: /auth
Disallow: /api/`;
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
    console.log('✅ Generated fallback robots.txt');
  }

  // Validate sitemap URLs
  console.log('\n🔍 Validating sitemap URLs...');
  const sitemapValidation = await validateSitemapURLs(distDir);
  
  // Only fail on errors, not warnings (warnings are informational)
  const errors = sitemapValidation.issues.filter(i => i.type === 'error');
  if (errors.length > 0) {
    console.error('\n❌ BUILD FAILED: Sitemap contains invalid URLs');
    throw new Error('Sitemap validation failed - found incorrect tag/category URLs');
  }
  
  // Warnings are OK - they're just informational
  const warnings = sitemapValidation.issues.filter(i => i.type === 'warning');
  if (warnings.length > 0) {
    console.log(`\n📝 Note: ${warnings.length} sitemap validation warnings (non-blocking)`);
  }

  // Validate canonical tags in sitemap
  console.log('\n🔍 Validating canonical tags in sitemap...');
  try {
    await validateSitemapCanonical(distDir);
  } catch (canonicalError) {
    console.error('\n❌ BUILD FAILED: Sitemap canonical validation failed');
    throw canonicalError;
  }

  // Verify critical static files exist (excluding team members which are dynamically discovered)
  console.log('\n🔍 Verifying critical static files...');
  const criticalRoutes = [
    '/categories/venture-capital',
    '/tags/golden-visa-eligible',
    '/manager/heed-capital'
  ];

  const missingCriticalFiles: string[] = [];
  for (const route of criticalRoutes) {
    const filePath = path.join(distDir, route, 'index.html');
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${route}`);
    } else {
      console.error(`   ❌ MISSING: ${route}`);
      missingCriticalFiles.push(route);
    }
  }
  
  // Verify at least some team member pages exist (dynamic check)
  const teamDir = path.join(distDir, 'team');
  if (fs.existsSync(teamDir)) {
    const teamFiles = fs.readdirSync(teamDir).filter(f => fs.statSync(path.join(teamDir, f)).isDirectory());
    console.log(`   ✅ /team/* (${teamFiles.length} team member pages)`);
    if (teamFiles.length === 0) {
      console.warn('   ⚠️  No team member pages generated');
    }
  } else {
    console.warn('   ⚠️  /team directory not found');
  }

  if (missingCriticalFiles.length > 0) {
    console.error('\n❌ BUILD FAILED: Critical static files missing');
    console.error(`   Missing files: ${missingCriticalFiles.join(', ')}`);
    throw new Error(`SSG failed to generate ${missingCriticalFiles.length} critical routes`);
  }

  // Run comprehensive HTML validation
  console.log('\n🔍 Running comprehensive HTML content validation...');
  const htmlValidation = runComprehensiveHTMLValidation(distDir);
  
  // Fail build if critical pages have errors
  if (htmlValidation.failed > 0) {
    console.error('\n❌ BUILD FAILED: HTML validation errors detected');
    console.error(`   ${htmlValidation.failed} pages failed validation checks`);
    throw new Error(`HTML validation failed - ${htmlValidation.failed} pages with errors`);
  }

  // Final report
  console.log('\n🎉 SSG: Static site generation completed!');
  console.log(`🗺️  Comprehensive sitemap generated with full URL coverage`);
  console.log(`✅ Sitemap URL validation passed`);
  console.log(`✅ Sitemap canonical validation passed`);
  console.log(`✅ Critical static files verified`);
  console.log(`✅ HTML content validation passed (${htmlValidation.passed}/${htmlValidation.totalPages} pages)`);
  
  if (htmlValidation.warnings > 0) {
    console.log(`   ⚠️  Note: ${htmlValidation.warnings} validation warnings (non-blocking)`);
  }
  
  if (failedRoutes.length > 0) {
    console.log(`   ⚠️  Warning: ${failedRoutes.length} routes had issues but build continued`);
  }
  
  console.log(`\n🚀 Static site ready at: ${distDir}`);
  
  // Verify critical pages (legacy check)
  verifyCriticalPages(distDir);
}