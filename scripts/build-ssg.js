
import { build } from 'vite';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { routes } from '../src/routes.js';
import { SEODataService } from '../src/services/seoDataService.js';

async function buildSSG() {
  console.log('Building SSG...');
  
  // Ensure dist directory exists
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }

  // Build the app first
  await build({
    build: {
      outDir: 'dist'
    }
  });

  // Generate static HTML files for each route
  for (const route of routes) {
    const seoData = SEODataService.getSEOData(route.seoProps);
    
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${seoData.title}</title>
    <meta name="description" content="${seoData.description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${seoData.url}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seoData.title}" />
    <meta property="og:description" content="${seoData.description}" />
    <meta property="og:url" content="${seoData.url}" />
    <meta property="og:site_name" content="Movingto" />
    <meta property="og:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@movingtoio" />
    <meta name="twitter:title" content="${seoData.title}" />
    <meta name="twitter:description" content="${seoData.description}" />
    
    ${Object.keys(seoData.structuredData).length > 0 ? 
      `<script type="application/ld+json">${JSON.stringify(seoData.structuredData, null, 2)}</script>` : 
      ''
    }
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    // Create directory structure if needed
    const routePath = route.path === '/' ? '/index.html' : `${route.path}/index.html`;
    const filePath = join('dist', routePath);
    const dirPath = join('dist', route.path === '/' ? '' : route.path);
    
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    
    writeFileSync(filePath, html);
    console.log(`Generated: ${filePath}`);
  }
  
  console.log('SSG build complete!');
}

buildSSG().catch(console.error);
