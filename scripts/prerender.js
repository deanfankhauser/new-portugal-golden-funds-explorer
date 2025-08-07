
import fs from 'fs';
import path from 'path';

// Simplified prerender that focuses on basic static file generation
export async function prerenderRoutes() {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Setting up basic static routing

  try {
    // Create basic sitemap
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
    // Basic sitemap generated

    // Create route directories for better SEO
    const routes = ['funds', 'categories', 'tags', 'managers', 'about', 'compare'];
    
    routes.forEach(route => {
      const routeDir = path.join(distDir, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
    });

    // Route directories created for SEO
    
  } catch (error) {
    console.warn('Pre-rendering encountered issues:', error.message);
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderRoutes();
}
