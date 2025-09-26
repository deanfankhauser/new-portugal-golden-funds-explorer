import { ComprehensiveSitemapService } from '../../src/services/comprehensiveSitemapService';
import path from 'path';

/**
 * Generate comprehensive sitemaps for the application
 * This replaces the existing problematic sitemap generation
 */
export function generateComprehensiveSitemaps(distDir: string): void {
  console.log('🗺️  Starting comprehensive sitemap generation...');
  
  try {
    // Generate sitemaps
    const result = ComprehensiveSitemapService.generateSitemaps(distDir);
    
    console.log(`✅ Sitemap generation completed successfully!`);
    console.log(`   📊 Total URLs: ${result.totalURLs}`);
    console.log(`   📁 Files generated: ${result.sitemapFiles.length}`);
    console.log(`   🤖 Robots.txt: ${result.robotsTxtGenerated ? 'Generated' : 'Failed'}`);
    
    // Validate the generated sitemaps
    const validation = ComprehensiveSitemapService.validateSitemaps(distDir);
    
    if (validation.valid) {
      console.log('✅ Sitemap validation passed');
    } else {
      console.warn('⚠️  Sitemap validation issues:');
      validation.errors.forEach(error => console.error(`   ❌ ${error}`));
      validation.warnings.forEach(warning => console.warn(`   ⚠️  ${warning}`));
    }

    // Copy to public directory for preview/development
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const { execSync } = require('child_process');
      
      result.sitemapFiles.forEach(filename => {
        const src = path.join(distDir, filename);
        const dest = path.join(publicDir, filename);
        try {
          execSync(`cp "${src}" "${dest}"`);
        } catch {
          // Fallback for Windows
          const fs = require('fs');
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
          }
        }
      });
      
      // Also copy robots.txt
      const robotsSrc = path.join(distDir, 'robots.txt');
      const robotsDest = path.join(publicDir, 'robots.txt');
      try {
        execSync(`cp "${robotsSrc}" "${robotsDest}"`);
      } catch {
        const fs = require('fs');
        if (fs.existsSync(robotsSrc)) {
          fs.copyFileSync(robotsSrc, robotsDest);
        }
      }
      
      console.log('🗂️  Copied sitemap files to /public directory');
    } catch (copyError) {
      console.warn('⚠️  Failed to copy files to /public:', copyError);
    }
    
  } catch (error) {
    console.error('❌ Comprehensive sitemap generation failed:', error);
    throw error;
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const distDir = path.join(process.cwd(), 'dist');
  generateComprehensiveSitemaps(distDir);
}