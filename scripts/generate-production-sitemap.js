#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate production sitemap immediately for deployment
async function generateProductionSitemap() {
  try {
    console.log('🗺️  Starting production sitemap generation...');
    
    // Use comprehensive sitemap service
    const { ComprehensiveSitemapService } = await import('../src/services/comprehensiveSitemapService.js');
    
    const publicDir = path.join(process.cwd(), 'public');
    
    // Generate comprehensive sitemaps
    const result = ComprehensiveSitemapService.generateSitemaps(publicDir);
    
    console.log('✅ Production sitemap files generated successfully');
    console.log(`   📊 Total URLs: ${result.totalURLs}`);
    console.log(`   📁 Files: ${result.sitemapFiles.join(', ')}`);
    console.log(`   🤖 Robots.txt: ${result.robotsTxtGenerated ? 'Generated' : 'Failed'}`);
    
    // Verify comprehensive coverage
    if (result.totalURLs < 1000) {
      console.warn(`⚠️  WARNING: Only ${result.totalURLs} URLs generated, expected 1500+`);
      console.warn('⚠️  This indicates missing comparison, alternatives, or manager pages');
    } else {
      console.log(`✅ Comprehensive sitemap with ${result.totalURLs} URLs generated!`);
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