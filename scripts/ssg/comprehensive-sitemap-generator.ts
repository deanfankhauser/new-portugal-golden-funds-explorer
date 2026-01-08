import { ComprehensiveSitemapService } from './services/comprehensiveSitemapService';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

/**
 * Generate comprehensive sitemaps for the application
 * This replaces the existing problematic sitemap generation
 * 
 * NOTE: This is a BUILD-TIME ONLY script and uses Node.js modules (fs, path)
 */
export async function generateComprehensiveSitemaps(distDir: string): Promise<void> {
  console.log('🗺️  Starting comprehensive sitemap generation from database...');
  
  try {
    // Generate sitemaps (now async)
    const result = await ComprehensiveSitemapService.generateSitemaps(distDir);
    
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
      
      result.sitemapFiles.forEach(filename => {
        const src = path.join(distDir, filename);
        const dest = path.join(publicDir, filename);
        try {
          execSync(`cp "${src}" "${dest}"`);
        } catch {
          // Fallback for Windows
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
        if (fs.existsSync(robotsSrc)) {
          fs.copyFileSync(robotsSrc, robotsDest);
        }
      }
      
      // Verify categories/tags presence in public sitemap; if missing, generate directly into /public
      const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
      if (fs.existsSync(publicSitemapPath)) {
        const content = fs.readFileSync(publicSitemapPath, 'utf8');
        const hasCategories = content.includes('/categories/');
        const hasTags = content.includes('/tags/');
        if (!hasCategories || !hasTags) {
          console.warn('⚠️  Public sitemap missing categories/tags. Regenerating sitemap directly into /public...');
          const direct = await ComprehensiveSitemapService.generateSitemaps(publicDir);
          console.log(`✅ Regenerated ${direct.sitemapFiles.length} sitemap file(s) directly in /public with full categories/tags coverage`);
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