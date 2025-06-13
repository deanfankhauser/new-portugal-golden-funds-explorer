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

    // Step 3: Run the pre-rendering with error handling
    console.log('\n🎨 Step 2/3: Generating static pages...');
    try {
      prerenderRoutes();
    } catch (prerenderError) {
      console.warn('⚠️  Pre-rendering encountered issues:', prerenderError.message);
      console.log('Continuing with basic build...');
    }
    
    // Step 4: Create additional route files for better SEO (but keep SPA routing)
    console.log('\n📄 Step 3/3: Setting up SPA routing...');
    
    const indexFile = path.join(distDir, 'index.html');
    
    if (fs.existsSync(indexFile)) {
      console.log('✅ Index file exists');
      
      // Read the main index.html content
      const indexContent = fs.readFileSync(indexFile, 'utf8');
      
      // Create some key directory structures for better SEO
      const keyRoutes = [
        'funds',
        'categories', 
        'tags',
        'managers',
        'about',
        'compare'
      ];
      
      keyRoutes.forEach(route => {
        const routeDir = path.join(distDir, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
          // Copy index.html to each route directory for better SPA routing
          fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
        }
      });
      
    } else {
      console.warn('⚠️  Index file not found');
    }
    
    // Generate basic sitemap if not exists
    const sitemapFile = path.join(distDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapFile)) {
      console.log('📄 Generating basic sitemap...');
      const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://movingto.com/funds</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
      fs.writeFileSync(sitemapFile, basicSitemap);
      console.log('✅ Basic sitemap generated');
    } else {
      console.log('✅ Sitemap already exists');
    }
    
    // Count generated files
    const countFiles = (dir) => {
      let count = 0;
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isDirectory()) {
            count += countFiles(filePath);
          } else if (file.endsWith('.html')) {
            count++;
          }
        }
      } catch (error) {
        console.warn(`Could not read directory: ${dir}`);
      }
      return count;
    };
    
    const pageCount = countFiles(distDir);
    console.log(`📄 Total HTML files: ${pageCount}`);
    
    console.log('\n🎉 Build complete!');
    console.log(`📁 Files are ready in: ${distDir}`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    
    // Fallback: ensure basic build exists
    try {
      console.log('🔄 Attempting fallback build...');
      execSync('vite build', { stdio: 'inherit' });
      console.log('✅ Fallback build completed');
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
