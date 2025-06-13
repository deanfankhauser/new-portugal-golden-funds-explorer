import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../src/ssg/routeDiscovery.ts';
import { renderRoute, generateHTMLTemplate } from '../src/ssg/ssrUtils.tsx';

export function prerenderRoutes() {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log('Starting enhanced static site generation...');

  try {
    // Get all static routes
    const routes = getAllStaticRoutes();
    
    if (!routes || routes.length === 0) {
      console.error('No routes found for pre-rendering');
      return;
    }

    console.log(`Found ${routes.length} routes to pre-render`);

    // Generate HTML for each route
    let successCount = 0;
    routes.forEach((route, index) => {
      try {
        console.log(`Rendering route ${index + 1}/${routes.length}: ${route.path}`);
        
        // Render the route
        const { html, seoData } = renderRoute(route);
        
        // Generate full HTML template
        const fullHTML = generateHTMLTemplate(html, seoData);
        
        // Determine output path
        let outputPath;
        if (route.path === '/') {
          outputPath = path.join(distDir, 'index.html');
        } else {
          const routeDir = path.join(distDir, route.path);
          fs.mkdirSync(routeDir, { recursive: true });
          outputPath = path.join(routeDir, 'index.html');
        }
        
        // Write the HTML file
        fs.writeFileSync(outputPath, fullHTML);
        successCount++;
        
        console.log(`✅ Generated: ${route.path}`);
      } catch (error) {
        console.warn(`⚠️  Failed to render ${route.path}:`, error.message);
      }
    });

    // Generate sitemap
    console.log('Generating sitemap...');
    const sitemap = generateSitemap(routes);
    
    if (sitemap) {
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
      console.log('✅ Sitemap generated successfully');
    }

    console.log(`\nStatic site generation complete!`);
    console.log(`📁 Output directory: ${distDir}`);
    console.log(`✅ Successfully rendered: ${successCount}/${routes.length} routes`);
    
  } catch (error) {
    console.warn('Pre-rendering encountered issues:', error.message);
    console.log('Continuing with basic build...');
  }
}

// Generate sitemap
function generateSitemap(routes) {
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

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderRoutes();
}
