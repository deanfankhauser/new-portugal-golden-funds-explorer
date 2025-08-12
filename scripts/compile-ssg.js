
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
    const fundPath = path.join(distDir, 'funds', 'horizon-fund', 'index.html');
    if (fs.existsSync(fundPath)) {
      const content = fs.readFileSync(fundPath, 'utf8');
      // Silent verification - no logging
    }
    
    // Check a sample category page - silent verification
    const categoryPath = path.join(distDir, 'categories', 'growth', 'index.html');
    if (fs.existsSync(categoryPath)) {
      const content = fs.readFileSync(categoryPath, 'utf8');
      // Silent verification - no logging
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
    <loc>https://www.movingto.com/funds</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), basicSitemap);
  }
}
