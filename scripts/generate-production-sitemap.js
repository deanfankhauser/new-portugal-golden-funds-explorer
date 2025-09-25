#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate production sitemap immediately for deployment
async function generateProductionSitemap() {
  try {
    // Import the enhanced sitemap service
    const { EnhancedSitemapService } = await import('../src/services/enhancedSitemapService.js');
    
    const publicDir = path.join(process.cwd(), 'public');
    
    // Generate enhanced sitemap
    const enhancedSitemapXML = EnhancedSitemapService.generateEnhancedSitemapXML();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), enhancedSitemapXML);
    
    // Generate sitemap index
    const sitemapIndex = EnhancedSitemapService.generateSitemapIndex();
    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);
    
    // Update robots.txt
    const robotsTxt = EnhancedSitemapService.generateRobotsTxt();
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    
    console.log('✅ Production sitemap files generated successfully');
    console.log('   - sitemap.xml');
    console.log('   - sitemap-index.xml');
    console.log('   - robots.txt updated');
    
  } catch (error) {
    console.error('❌ Failed to generate production sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateProductionSitemap();
}

export { generateProductionSitemap };