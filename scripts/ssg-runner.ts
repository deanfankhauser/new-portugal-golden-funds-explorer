
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
  console.log('🎨 Generating static files...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('❌ Dist directory not found. Run vite build first.');
    return;
  }

  // Find built assets
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
      
      // Render the route with SSR
      const { html, seoData } = await renderRoute(route);
      
      // Generate the complete HTML template
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
      
      // Verify the content
      const writtenContent = fs.readFileSync(outputPath, 'utf8');
      
      // Check if assets are properly linked
      const hasCSSLinks = cssFiles.every(css => writtenContent.includes(`href="${css}"`));
      const hasJSLinks = jsFiles.every(js => writtenContent.includes(`src="${js}"`));
      
      if (hasCSSLinks || cssFiles.length === 0) {
        console.log(`   ✓ CSS assets properly linked`);
      } else {
        console.warn(`   ⚠️  Some CSS assets may not be linked correctly`);
      }
      
      if (hasJSLinks || jsFiles.length === 0) {
        console.log(`   ✓ JS assets properly linked`);
      } else {
        console.warn(`   ⚠️  Some JS assets may not be linked correctly`);
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
  console.log(`   - Linked ${cssFiles.length} CSS files`);
  console.log(`   - Linked ${jsFiles.length} JS files`);
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticFiles().catch(console.error);
}
