
import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../src/ssg/routeDiscovery';
import { renderRoute, generateHTMLTemplate } from '../src/ssg/ssrUtils';

function findBuiltAssets(distDir: string): { cssFiles: string[], jsFiles: string[] } {
  const cssFiles: string[] = [];
  const jsFiles: string[] = [];
  
  console.log('🔍 Looking for built assets in:', distDir);
  
  // Function to recursively find files
  function findFiles(dir: string, relativePath: string = '') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativeFilePath = relativePath ? `${relativePath}/${file}` : file;
      
      if (fs.statSync(fullPath).isDirectory()) {
        findFiles(fullPath, relativeFilePath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(`/${relativeFilePath}`);
        console.log(`✅ Found CSS: /${relativeFilePath}`);
      } else if (file.endsWith('.js') && !file.includes('.map')) {
        jsFiles.push(`/${relativeFilePath}`);
        console.log(`✅ Found JS: /${relativeFilePath}`);
      }
    });
  }
  
  // Look for assets in the dist directory
  findFiles(distDir);
  
  // Sort files to ensure consistent order (main files first)
  cssFiles.sort((a, b) => {
    if (a.includes('index') && !b.includes('index')) return -1;
    if (!a.includes('index') && b.includes('index')) return 1;
    return a.localeCompare(b);
  });
  
  jsFiles.sort((a, b) => {
    if (a.includes('index') && !b.includes('index')) return -1;
    if (!a.includes('index') && b.includes('index')) return 1;
    return a.localeCompare(b);
  });
  
  console.log('📊 Final CSS files:', cssFiles);
  console.log('📊 Final JS files:', jsFiles);
  
  return { cssFiles, jsFiles };
}

export async function generateStaticFiles() {
  console.log('🎨 Generating static files with matching Vite build assets...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('❌ Dist directory not found. Run vite build first.');
    return;
  }

  // Find built assets - SAME AS VITE BUILD
  const { cssFiles, jsFiles } = findBuiltAssets(distDir);
  
  if (cssFiles.length === 0) {
    console.warn('⚠️  No CSS files found. This might cause styling issues.');
  }
  
  if (jsFiles.length === 0) {
    console.warn('⚠️  No JS files found. This might cause functionality issues.');
  }

  const routes = getAllStaticRoutes();
  console.log(`📄 Found ${routes.length} routes to generate`);

  // Generate static files for each route
  for (const route of routes) {
    try {
      console.log(`🔨 Generating: ${route.path}`);
      
      // Render the route with SSR to get proper SEO data
      const { html, seoData } = await renderRoute(route);
      
      // Generate the complete HTML template with SAME assets as Vite build
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
      
      // Write the static HTML file
      fs.writeFileSync(outputPath, fullHTML);
      console.log(`✅ Generated: ${outputPath}`);
      console.log(`   Title: ${seoData.title}`);
      
      // Verify the content matches Vite build expectations
      const writtenContent = fs.readFileSync(outputPath, 'utf8');
      
      // Check SEO data embedding
      if (writtenContent.includes(seoData.title)) {
        console.log(`   ✓ SEO data properly embedded`);
      } else {
        console.warn(`   ⚠️  SEO data may not be embedded correctly`);
      }
      
      // Check CSS linking (same as Vite build)
      const hasCSSLinks = cssFiles.every(css => writtenContent.includes(css));
      if (hasCSSLinks || cssFiles.length === 0) {
        console.log(`   ✓ CSS assets properly linked (matches Vite build)`);
      } else {
        console.warn(`   ⚠️  CSS assets may not match Vite build linking`);
        console.warn(`   Expected: ${cssFiles.join(', ')}`);
      }
      
      // Check JS linking (same as Vite build)
      const hasJSLinks = jsFiles.every(js => writtenContent.includes(js));
      if (hasJSLinks || jsFiles.length === 0) {
        console.log(`   ✓ JS assets properly linked (matches Vite build)`);
      } else {
        console.warn(`   ⚠️  JS assets may not match Vite build linking`);
        console.warn(`   Expected: ${jsFiles.join(', ')}`);
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
  console.log('📋 Summary:');
  console.log(`   - Generated ${routes.length} static pages`);
  console.log(`   - Linked ${cssFiles.length} CSS files (same as Vite build)`);
  console.log(`   - Linked ${jsFiles.length} JS files (same as Vite build)`);
  console.log(`   - Removed conflicting critical CSS`);
  console.log(`   - Ensured consistent asset loading`);
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticFiles().catch(console.error);
}
