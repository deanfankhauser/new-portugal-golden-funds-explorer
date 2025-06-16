
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Compile TypeScript files to JavaScript for SSG
export function compileSSGFiles() {
  console.log('📦 Compiling TypeScript files for SSG...');
  
  try {
    // Use tsx to compile and run the SSG process
    execSync('npx tsx scripts/ssg-runner.ts', { stdio: 'inherit' });
    console.log('✅ SSG compilation successful');
    
    // Verify that static files were generated with proper SEO
    const distDir = path.join(process.cwd(), 'dist');
    
    // Check homepage
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      console.log('🔍 Verifying homepage static file...');
      
      if (content.includes('Portugal Golden Visa Investment Funds | Eligible Investments 2025')) {
        console.log('✅ Homepage has correct SEO title');
      } else {
        console.warn('⚠️  Homepage may still have default meta tags');
      }
    }
    
    // Check a sample fund page
    const fundPath = path.join(distDir, 'funds', 'horizon-fund', 'index.html');
    if (fs.existsSync(fundPath)) {
      const content = fs.readFileSync(fundPath, 'utf8');
      console.log('🔍 Verifying fund page static file...');
      
      if (content.includes('Horizon Fund | Investment Fund Details')) {
        console.log('✅ Fund page has correct SEO title');
      } else {
        console.warn('⚠️  Fund page may still have default meta tags');
      }
    }
    
    // Check a sample category page
    const categoryPath = path.join(distDir, 'categories', 'growth', 'index.html');
    if (fs.existsSync(categoryPath)) {
      const content = fs.readFileSync(categoryPath, 'utf8');
      console.log('🔍 Verifying category page static file...');
      
      if (content.includes('Top Growth Golden Visa Funds')) {
        console.log('✅ Category page has correct SEO title');
      } else {
        console.warn('⚠️  Category page may still have default meta tags');
      }
    }
    
  } catch (error) {
    console.warn('⚠️  SSG compilation failed, falling back to basic build');
    console.warn(error.message);
    
    // Create basic sitemap as fallback
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://movingto.com/funds</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), basicSitemap);
    console.log('✅ Basic sitemap generated');
  }
}
