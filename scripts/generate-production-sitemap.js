#!/usr/bin/env node
// Production sitemap generation script - triggers GitHub sync
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate production sitemap immediately for deployment
async function generateProductionSitemap() {
  try {
    console.log('🗺️  Starting production sitemap generation...');
    
// Pre-flight check: Verify data sources
console.log('🧪 Pre-flight: Verifying data sources...');
const { funds } = await import('../src/data/services/funds-service.ts');
const { getAllComparisonSlugs } = await import('../src/data/services/comparison-service.ts');

console.log(`  ✓ Funds available: ${funds.length}`);
const comparisonSlugs = getAllComparisonSlugs();
console.log(`  ✓ Comparison slugs: ${comparisonSlugs.length}`);

if (funds.length === 0) {
  throw new Error('CRITICAL: No funds available for sitemap generation!');
}

if (comparisonSlugs.length === 0) {
  console.warn('⚠️  WARNING: No comparison slugs generated – sitemap will be incomplete');
}

// Use comprehensive sitemap service (TypeScript file)
const { ComprehensiveSitemapService } = await import('../src/services/comprehensiveSitemapService.ts');

    const { ComprehensiveSitemapService } = await import('../src/services/comprehensiveSitemapService.ts');
    
    const publicDir = path.join(process.cwd(), 'public');
    
    // Generate comprehensive sitemaps
    const result = ComprehensiveSitemapService.generateSitemaps(publicDir);
    
    console.log('✅ Production sitemap files generated successfully');
    console.log(`   📊 Total URLs: ${result.totalURLs}`);
    console.log(`   📁 Files: ${result.sitemapFiles.join(', ')}`);
    console.log(`   🤖 Robots.txt: ${result.robotsTxtGenerated ? 'Generated' : 'Failed'}`);
    
    // Enhanced validation
    const expectedMin = 1000;
    const expectedIdeal = 1500;
    
    if (result.totalURLs < expectedMin) {
      console.error(`❌ CRITICAL: Only ${result.totalURLs} URLs generated, expected ${expectedIdeal}+`);
      console.error('❌ Sitemap is incomplete - missing comparison, alternatives, or manager pages');
      console.error(`❌ Breakdown: ${funds.length} funds should generate:`);
      console.error(`   - ${funds.length * 2} fund pages (details + alternatives)`);
      console.error(`   - ${comparisonSlugs.length} comparison pages`);
      process.exit(1);
    } else if (result.totalURLs < expectedIdeal) {
      console.warn(`⚠️  WARNING: ${result.totalURLs} URLs generated, expected ${expectedIdeal}+`);
      console.warn('⚠️  Sitemap may be missing some pages');
    } else {
      console.log(`✅ EXCELLENT: Comprehensive sitemap with ${result.totalURLs} URLs generated!`);
    }
    
  } catch (error) {
    console.error('❌ Failed to generate production sitemap:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateProductionSitemap();
}

export { generateProductionSitemap };