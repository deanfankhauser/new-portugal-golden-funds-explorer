
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { compileSSGFiles } from './compile-ssg.js';
import { verifySSGBuild } from './verify-ssg-build.js';

export async function buildSSG() {
  try {
    // Step 1: Run the regular Vite build first
    console.log('\n📦 Running Vite build...\n');
    execSync('vite build', { stdio: 'inherit' });
    
    // Step 2: Verify build output
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      throw new Error('Vite build failed - dist directory not found');
    }

    // Step 3: Generate static files
    compileSSGFiles();

    // Step 4: Verify SSG build quality
    console.log('\n' + '='.repeat(60));
    const buildVerified = verifySSGBuild();
    
    if (!buildVerified) {
      console.warn('\n⚠️  WARNING: SSG build has issues but continuing deployment...');
      console.warn('    Fund pages may not have proper H1/H2 tags for SEO');
    }

    // Step 5: Ensure enhanced sitemap files are also available in /public for local preview/dev servers
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const distDir = path.join(process.cwd(), 'dist');
      const filesToCopy = ['sitemap.xml', 'sitemap-index.xml', 'sitemap-funds.xml', 'sitemap-enhanced.xml', 'robots.txt'];
      filesToCopy.forEach((file) => {
        const src = path.join(distDir, file);
        if (fs.existsSync(src)) {
          const dest = path.join(publicDir, file);
          fs.copyFileSync(src, dest);
        }
      });
      console.log('🗺️  Copied enhanced sitemap files to /public for visibility in build_ssg mode');
    } catch (copyErr) {
      console.warn('⚠️  Could not copy enhanced sitemap files to /public:', copyErr.message);
    }
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    
    // Fallback: ensure basic build exists
    try {
      execSync('vite build', { stdio: 'inherit' });
    } catch (fallbackError) {
      console.error('❌ Fallback build also failed:', fallbackError.message);
      process.exit(1);
    }
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildSSG();
}
