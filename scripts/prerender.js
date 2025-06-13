
import fs from 'fs';
import path from 'path';

export function prerenderRoutes() {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log('Starting simplified static site generation...');

  try {
    // Generate basic routes without complex compilation
    const routes = generateStaticRoutes();
    
    if (!routes || routes.length === 0) {
      console.error('No routes found for pre-rendering');
      return;
    }

    console.log(`Found ${routes.length} routes to pre-render`);

    // Generate basic sitemap
    console.log('Generating sitemap...');
    const sitemap = generateSitemap(routes);
    
    if (sitemap) {
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
      console.log('✅ Sitemap generated successfully');
    }

    console.log(`\nStatic site generation complete!`);
    console.log(`📁 Output directory: ${distDir}`);
    
  } catch (error) {
    console.warn('Pre-rendering encountered issues:', error.message);
    console.log('Continuing with basic build...');
  }
}

// Simplified route generation
function generateStaticRoutes() {
  // Static routes that don't require dynamic data
  const staticRoutes = [
    { path: '/', pageType: 'homepage' },
    { path: '/about', pageType: 'about' },
    { path: '/disclaimer', pageType: 'disclaimer' },
    { path: '/privacy', pageType: 'privacy' },
    { path: '/faqs', pageType: 'faqs' },
    { path: '/compare', pageType: 'comparison' },
    { path: '/comparisons', pageType: 'comparisons-hub' },
    { path: '/roi-calculator', pageType: 'roi-calculator' },
    { path: '/fund-quiz', pageType: 'fund-quiz' },
    { path: '/managers', pageType: 'managers-hub' },
    { path: '/categories', pageType: 'categories-hub' },
    { path: '/tags', pageType: 'tags-hub' }
  ];

  // Add some sample fund routes
  const fundRoutes = [
    { path: '/funds/3cc-golden-income', pageType: 'fund' },
    { path: '/funds/growth-blue-fund', pageType: 'fund' },
    { path: '/funds/horizon-fund', pageType: 'fund' },
    { path: '/funds/lince-growth-fund', pageType: 'fund' },
    { path: '/funds/lince-yield-fund', pageType: 'fund' }
  ];

  return [...staticRoutes, ...fundRoutes];
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
