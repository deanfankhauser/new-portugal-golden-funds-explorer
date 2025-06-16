
import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../src/ssg/routeDiscovery';

// Simple static site generation without complex SSR
export async function generateStaticFiles() {
  console.log('🎯 Generating static files...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    // Get all routes
    const routes = getAllStaticRoutes();
    console.log(`📄 Found ${routes.length} routes to process`);

    // Generate sitemap
    const sitemap = generateSitemap(routes);
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated');

    // Create route directories for better SEO routing
    const keyRoutes = ['funds', 'categories', 'tags', 'managers', 'about', 'compare'];
    
    keyRoutes.forEach(route => {
      const routeDir = path.join(distDir, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
    });

    console.log('✅ Route directories created');
    
  } catch (error) {
    console.error('❌ Static generation failed:', error.message);
    throw error;
  }
}

function generateSitemap(routes: any[]) {
  const baseUrl = 'https://movingto.com/funds';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = routes.map(route => {
    return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticFiles();
}
