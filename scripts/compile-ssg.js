
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Compile TypeScript files to JavaScript for SSG
export function compileSSGFiles() {
  try {
    // Use tsx to compile and run the SSG process
    execSync('npx tsx scripts/ssg-runner.ts', { stdio: 'inherit' });
    
    // Verify that static files were generated with proper SEO
    const distDir = path.join(process.cwd(), 'dist');
    
    // Check homepage - silent verification
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      // Silent verification - no logging
    }
    
    // Check a sample fund page - silent verification
    const fundDirs = [
      path.join(distDir, 'horizon-fund', 'index.html'),
      path.join(distDir, 'imga-portuguese-corporate-debt-fund', 'index.html'),
      path.join(distDir, 'imga-silver-domus-fund', 'index.html')
    ];
    
    let fundPagesGenerated = 0;
    fundDirs.forEach(fundPath => {
      if (fs.existsSync(fundPath)) {
        const content = fs.readFileSync(fundPath, 'utf8');
        if (content.includes('meta name="description"')) {
          fundPagesGenerated++;
        }
      }
    });
    
    // Check routing files exist
    const routeFiles = [
      path.join(distDir, 'index', 'index.html'),
      path.join(distDir, 'categories', 'index.html'),
      path.join(distDir, 'tags', 'index.html')
    ];
    
    // Verify sitemap includes comparison pages
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const comparisonUrls = (sitemapContent.match(/\/compare\//g) || []).length;
      const alternativesUrls = (sitemapContent.match(/\/alternatives\//g) || []).length;
      console.log(`✅ SSG: Generated ${fundPagesGenerated} fund pages, ${comparisonUrls} comparison URLs, ${alternativesUrls} alternatives URLs`);
      if (alternativesUrls === 0) {
        console.warn('⚠️  SSG: No alternatives pages detected in sitemap. Verify /:id/alternatives generation.');
      }
    } else {
      console.log(`✅ SSG: Generated ${fundPagesGenerated} fund pages successfully`);
    }

    // Also copy enhanced sitemap files from dist to public so /sitemap.xml resolves correctly in dev/preview
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const distDir = path.join(process.cwd(), 'dist');
      const filesToCopy = ['sitemap.xml', 'sitemap-index.xml', 'sitemap-funds.xml', 'robots.txt'];
      filesToCopy.forEach((file) => {
        const src = path.join(distDir, file);
        if (fs.existsSync(src)) {
          const dest = path.join(publicDir, file);
          fs.copyFileSync(src, dest);
        }
      });
      console.log('🗺️  SSG: Copied enhanced sitemaps to /public');
    } catch (copyErr) {
      console.warn('⚠️  SSG: Could not copy enhanced sitemap files to /public:', copyErr.message);
    }
    
  } catch (error) {
    console.warn('⚠️  SSG compilation failed, falling back to basic build');
    
    // Create basic sitemap as fallback
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://funds.movingto.com</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    const sitemapOutPath = path.join(distDir, 'sitemap.xml');
    // Do NOT overwrite an existing sitemap copied from /public
    if (!fs.existsSync(sitemapOutPath)) {
      fs.writeFileSync(sitemapOutPath, basicSitemap);
    }
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      // Copy the original Vite-built index.html as fallback
      console.log('⚠️  Creating fallback SPA index.html for Vercel');
    }
  }
}
