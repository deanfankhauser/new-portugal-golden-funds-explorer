
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
