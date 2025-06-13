
import { execSync } from 'child_process';
import { prerenderRoutes } from './prerender.js';
import fs from 'fs';
import path from 'path';

export function buildSSG() {
  console.log('🚀 Building static site with SSG...');
  
  try {
    // Step 1: Run the regular Vite build first
    console.log('\n📦 Step 1/3: Running Vite build...');
    execSync('vite build', { stdio: 'inherit' });
    
    // Step 2: Verify build output
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      throw new Error('Vite build failed - dist directory not found');
    }
    
    console.log('✅ Vite build completed successfully');

    // Step 3: Run the pre-rendering (simplified approach)
    console.log('\n🎨 Step 2/3: Generating static pages...');
    prerenderRoutes();
    
    // Step 4: Final verification
    console.log('\n🔍 Step 3/3: Verifying generated files...');
    
    const indexFile = path.join(distDir, 'index.html');
    const sitemapFile = path.join(distDir, 'sitemap.xml');
    
    if (fs.existsSync(indexFile)) {
      console.log('✅ Homepage generated successfully');
    } else {
      console.warn('⚠️  Homepage not found');
    }
    
    if (fs.existsSync(sitemapFile)) {
      console.log('✅ Sitemap generated successfully');
    } else {
      console.warn('⚠️  Sitemap not found');
    }
    
    // Count generated pages
    const countFiles = (dir) => {
      let count = 0;
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isDirectory()) {
            count += countFiles(filePath);
          } else if (file === 'index.html') {
            count++;
          }
        }
      } catch (error) {
        console.warn(`Could not read directory: ${dir}`);
      }
      return count;
    };
    
    const pageCount = countFiles(distDir);
    console.log(`📄 Total pages generated: ${pageCount}`);
    
    console.log('\n🎉 Static site generation complete!');
    console.log('🔗 Run "npm run preview" to test the generated site.');
    console.log(`📁 Files are ready in: ${distDir}`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    if (error.stdout) {
      console.error('STDOUT:', error.stdout.toString());
    }
    if (error.stderr) {
      console.error('STDERR:', error.stderr.toString());
    }
    process.exit(1);
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildSSG();
}
