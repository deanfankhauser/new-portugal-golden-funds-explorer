
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to safely execute compiled JavaScript modules
async function executeCompiledModule(jsFilePath, functionName, ...args) {
  try {
    const absolutePath = path.resolve(process.cwd(), jsFilePath);
    console.log(`Executing: ${absolutePath}`);
    
    // Use dynamic import to load the compiled module
    const module = await import(`file://${absolutePath}`);
    
    if (!module[functionName]) {
      throw new Error(`Function ${functionName} not found in module ${jsFilePath}`);
    }
    
    const result = module[functionName](...args);
    return result;
  } catch (error) {
    console.error(`Error executing ${jsFilePath}:`, error.message);
    return null;
  }
}

export function prerenderRoutes() {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log('Starting static site generation...');

  try {
    // Step 1: Compile TypeScript files
    console.log('Compiling TypeScript files...');
    execSync('npx tsc -p tsconfig.ssg.json', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('TypeScript compilation completed');

    // Step 2: Execute the route discovery
    console.log('Discovering routes...');
    
    // Simple approach: directly generate routes without complex execution
    const routes = generateStaticRoutes();
    
    if (!routes || routes.length === 0) {
      console.error('No routes found for pre-rendering');
      return;
    }

    console.log(`Found ${routes.length} routes to pre-render`);

    // Step 3: Generate basic HTML files for each route
    let successCount = 0;
    let errorCount = 0;

    for (const route of routes) {
      try {
        console.log(`Generating: ${route.path}`);
        
        // Generate basic HTML for each route
        const html = generateBasicHTML(route);
        
        // Determine the output file path
        let outputPath;
        if (route.path === '/') {
          outputPath = path.join(distDir, 'index.html');
        } else {
          const routeDir = path.join(distDir, route.path);
          if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
          }
          outputPath = path.join(routeDir, 'index.html');
        }

        // Write the HTML file
        fs.writeFileSync(outputPath, html);
        successCount++;
        
      } catch (error) {
        console.error(`Error generating route ${route.path}:`, error.message);
        errorCount++;
      }
    }

    // Step 4: Generate sitemap
    console.log('Generating sitemap...');
    const sitemap = generateSitemap(routes);
    
    if (sitemap) {
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
      console.log('Sitemap generated successfully');
    }

    console.log(`\nStatic site generation complete!`);
    console.log(`✅ Successfully generated: ${successCount} pages`);
    if (errorCount > 0) {
      console.log(`❌ Failed to generate: ${errorCount} pages`);
    }
    console.log(`📁 Output directory: ${distDir}`);
    
  } catch (error) {
    console.error('Critical error during pre-rendering:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
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

  // Add some sample fund routes (you can expand this with actual data)
  const fundRoutes = [
    { path: '/funds/3cc-golden-income', pageType: 'fund', params: { fundName: '3CC Golden Income' } },
    { path: '/funds/growth-blue-fund', pageType: 'fund', params: { fundName: 'Growth Blue Fund' } },
    { path: '/funds/horizon-fund', pageType: 'fund', params: { fundName: 'Horizon Fund' } }
  ];

  return [...staticRoutes, ...fundRoutes];
}

// Generate basic HTML template
function generateBasicHTML(route) {
  const baseTitle = route.pageType === 'homepage' 
    ? 'Portugal Golden Visa Investment Funds - Movingto'
    : `${route.pageType.charAt(0).toUpperCase() + route.pageType.slice(1)} - Movingto`;
    
  const baseDescription = route.pageType === 'homepage'
    ? 'Explore our qualified Portugal Golden Visa Investment funds list with our comprehensive directory.'
    : `Learn more about ${route.pageType} on Movingto.`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Preconnect to external domains for performance -->
    <link rel="preconnect" href="https://www.googletagmanager.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3ML90T25MY"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3ML90T25MY');
    </script>
    
    <!-- SEO meta tags -->
    <title>${baseTitle}</title>
    <meta name="description" content="${baseDescription}" />
    <link rel="canonical" href="https://movingto.com/funds${route.path}" />
    
    <!-- Open Graph tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${baseTitle}" />
    <meta property="og:description" content="${baseDescription}" />
    <meta property="og:url" content="https://movingto.com/funds${route.path}" />
    <meta property="og:site_name" content="Movingto" />
    <meta property="og:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@movingtoio" />
    <meta name="twitter:title" content="${baseTitle}" />
    <meta name="twitter:description" content="${baseDescription}" />
    
    <!-- Favicon -->
    <link rel="icon" href="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png" type="image/png">
    
    <!-- Theme color -->
    <meta name="theme-color" content="#EF4444" />
  </head>

  <body>
    <div id="root"></div>
    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
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
