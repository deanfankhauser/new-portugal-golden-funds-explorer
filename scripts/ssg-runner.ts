
import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../src/ssg/routeDiscovery';
import { renderRoute, generateHTMLTemplate } from '../src/ssg/ssrUtils';

function findBuiltAssets(distDir: string): { cssFiles: string[], jsFiles: string[] } {
  const cssFiles: string[] = [];
  const jsFiles: string[] = [];
  
  // Look for assets in the dist directory
  const assetsDir = path.join(distDir, 'assets');
  
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    
    files.forEach(file => {
      if (file.endsWith('.css')) {
        cssFiles.push(`/assets/${file}`);
      } else if (file.endsWith('.js')) {
        jsFiles.push(`/assets/${file}`);
      }
    });
  }
  
  // Also check for index files in root dist
  const distFiles = fs.readdirSync(distDir);
  distFiles.forEach(file => {
    if (file.endsWith('.css') && file.startsWith('index')) {
      cssFiles.push(`/${file}`);
    } else if (file.endsWith('.js') && file.startsWith('index')) {
      jsFiles.push(`/${file}`);
    }
  });
  
  console.log('Found CSS files:', cssFiles);
  console.log('Found JS files:', jsFiles);
  
  return { cssFiles, jsFiles };
}

function copySSGStyles(distDir: string) {
  const sourceStylesPath = path.join(process.cwd(), 'src', 'ssg', 'ssg-styles.css');
  const targetStylesPath = path.join(distDir, 'ssg-styles.css');
  
  if (fs.existsSync(sourceStylesPath)) {
    fs.copyFileSync(sourceStylesPath, targetStylesPath);
    console.log('✅ Copied SSG fallback styles to dist directory');
  } else {
    console.warn('⚠️  SSG styles file not found at:', sourceStylesPath);
  }
}

export async function generateStaticFiles() {
  console.log('🎨 Generating static files with correct SEO...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy SSG styles to dist directory
  copySSGStyles(distDir);

  // Find built assets
  const { cssFiles, jsFiles } = findBuiltAssets(distDir);

  const routes = getAllStaticRoutes();
  console.log(`📄 Found ${routes.length} routes to generate`);

  // Generate static files for each route
  for (const route of routes) {
    try {
      console.log(`🔨 Generating: ${route.path}`);
      
      // Render the route with SSR to get proper SEO data (now async)
      const { html, seoData } = await renderRoute(route);
      
      // Generate the complete HTML template with dynamic SEO and built assets
      const fullHTML = generateHTMLTemplate(html, seoData, cssFiles, jsFiles);
      
      // Determine the output path
      let outputPath: string;
      if (route.path === '/') {
        outputPath = path.join(distDir, 'index.html');
      } else {
        const routeDir = path.join(distDir, route.path);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        outputPath = path.join(routeDir, 'index.html');
      }
      
      // Write the static HTML file with proper SEO
      fs.writeFileSync(outputPath, fullHTML);
      console.log(`✅ Generated: ${outputPath}`);
      console.log(`   Title: ${seoData.title}`);
      
      // Verify the content was written correctly
      const writtenContent = fs.readFileSync(outputPath, 'utf8');
      if (writtenContent.includes(seoData.title)) {
        console.log(`   ✓ SEO data properly embedded`);
      } else {
        console.warn(`   ⚠️  SEO data may not be embedded correctly`);
      }
      
    } catch (error) {
      console.error(`❌ Error generating ${route.path}:`, error);
    }
  }

  // Generate sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>https://movingto.com/funds${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated');
  
  console.log('🎉 Static file generation complete!');
}

// Check if this is the main module (ES module way)
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticFiles().catch(console.error);
}
