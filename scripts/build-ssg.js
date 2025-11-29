
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { compileSSGFiles } from './compile-ssg.js';

export async function buildSSG() {
  try {
    // Step 1: Run the regular Vite build first
    execSync('vite build', { stdio: 'inherit' });
    
    // Step 2: Verify build output
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      throw new Error('Vite build failed - dist directory not found');
    }

    // Step 3: Generate static files
    compileSSGFiles();

    // Step 4: Ensure enhanced sitemap files are also available in /public for local preview/dev servers
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
    console.error('❌ SSG build must succeed. Failing deployment to prevent broken site.');
    process.exit(1);
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildSSG();
}
