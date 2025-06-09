
const fs = require('fs');
const path = require('path');

// This is a simplified version that creates the structure
// In a real implementation, you'd use the SSR utilities
function prerenderRoutes() {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // For now, we'll create a simple implementation
  // The actual SSR would require a more complex setup with Node.js and React
  console.log('Static site generation setup complete.');
  console.log('To implement full SSR, you would need to:');
  console.log('1. Set up a Node.js server for rendering');
  console.log('2. Use ReactDOMServer.renderToString()');
  console.log('3. Generate static HTML files for each route');
  
  // Create a simple sitemap
  const routes = [
    '/',
    '/about',
    '/disclaimer',
    '/privacy',
    '/faqs',
    '/compare',
    '/comparisons',
    '/roi-calculator',
    '/fund-quiz',
    '/managers',
    '/categories',
    '/tags'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>https://movingto.com/funds${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated at dist/sitemap.xml');
}

if (require.main === module) {
  prerenderRoutes();
}

module.exports = { prerenderRoutes };
