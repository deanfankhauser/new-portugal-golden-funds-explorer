
import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../src/ssg/routeDiscovery';
import { renderRoute, generateHTMLTemplate } from '../src/ssg/ssrUtils';

function findBuiltAssets(distDir: string): { cssFiles: string[], jsFiles: string[] } {
  const cssFiles: string[] = [];
  const jsFiles: string[] = [];
  
  console.log('🔍 SSG: Looking for built assets in:', distDir);
  
  function findFiles(dir: string, relativePath: string = '') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativeFilePath = relativePath ? `${relativePath}/${file}` : file;
      
      if (fs.statSync(fullPath).isDirectory()) {
        findFiles(fullPath, relativeFilePath);
      } else if (file.endsWith('.css') && !file.includes('.map')) {
        cssFiles.push(`/${relativeFilePath}`);
        console.log(`✅ SSG: Found CSS: /${relativeFilePath}`);
      } else if (file.endsWith('.js') && !file.includes('.map')) {
        jsFiles.push(`/${relativeFilePath}`);
        console.log(`✅ SSG: Found JS: /${relativeFilePath}`);
      }
    });
  }
  
  findFiles(distDir);
  
  // Sort files for consistent loading order
  cssFiles.sort((a, b) => {
    if (a.includes('/assets/index-') && !b.includes('/assets/index-')) return -1;
    if (!a.includes('/assets/index-') && b.includes('/assets/index-')) return 1;
    return a.localeCompare(b);
  });
  
  jsFiles.sort((a, b) => {
    if (a.includes('/assets/index-') && !b.includes('/assets/index-')) return -1;
    if (!a.includes('/assets/index-') && b.includes('/assets/index-')) return 1;
    if (a.includes('chunk-') && !b.includes('chunk-')) return 1;
    if (!a.includes('chunk-') && b.includes('chunk-')) return -1;
    return a.localeCompare(b);
  });
  
  console.log(`📊 SSG: Final assets - CSS: ${cssFiles.length}, JS: ${jsFiles.length}`);
  return { cssFiles, jsFiles };
}

export async function generateStaticFiles() {
  console.log('🎨 SSG: Starting static file generation...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ SSG: Dist directory not found. Run vite build first.');
    return;
  }

  const { cssFiles, jsFiles } = findBuiltAssets(distDir);
  
  if (cssFiles.length === 0) {
    console.warn('⚠️  SSG: No CSS files found. This might cause styling issues.');
  }
  
  if (jsFiles.length === 0) {
    console.warn('⚠️  SSG: No JS files found. This might cause functionality issues.');
  }

  const routes = getAllStaticRoutes();
  console.log(`📄 SSG: Found ${routes.length} routes to generate`);

  let successCount = 0;
  const failedRoutes: string[] = [];

  // Generate static files for each route
  for (const route of routes) {
    try {
      console.log(`🔨 SSG: Generating ${route.path} (${route.pageType})`);
      
      const { html, seoData } = await renderRoute(route);
      const fullHTML = generateHTMLTemplate(html, seoData, cssFiles, jsFiles);
      
      // Determine output path
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
      
      fs.writeFileSync(outputPath, fullHTML);
      successCount++;
      
      console.log(`✅ SSG: Generated ${outputPath}`);
      console.log(`   📝 Title: ${seoData.title}`);
      console.log(`   📄 Description: ${seoData.description.substring(0, 100)}...`);
      
      // Verify critical elements
      const content = fs.readFileSync(outputPath, 'utf8');
      
      // Check for proper SEO elements
      const hasTitle = content.includes(`<title>${seoData.title}</title>`);
      const hasDescription = content.includes(`content="${seoData.description}"`);
      const hasStructuredData = seoData.structuredData && Object.keys(seoData.structuredData).length > 0;
      const hasGoogleFonts = content.includes('fonts.googleapis.com');
      const hasCSSLinks = cssFiles.every(css => content.includes(`href="${css}"`));
      const hasJSLinks = jsFiles.every(js => content.includes(`src="${js}"`));
      
      console.log(`   🔍 Verification:`, {
        seo: hasTitle && hasDescription ? '✅' : '❌',
        structured: hasStructuredData ? '✅' : '⚠️',
        fonts: hasGoogleFonts ? '✅' : '❌',
        css: hasCSSLinks ? '✅' : '❌',
        js: hasJSLinks ? '✅' : '❌'
      });
      
    } catch (error) {
      console.error(`❌ SSG: Error generating ${route.path}:`, error.message);
      failedRoutes.push(route.path);
    }
  }

  // Generate sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>https://movingto.com/funds${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.path === '/' ? '1.0' : route.pageType === 'fund' ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('✅ SSG: Sitemap generated with proper priorities');
  
  // Final summary
  console.log('\n🎉 SSG: Static file generation complete!');
  console.log('📋 Summary:');
  console.log(`   ✅ Successfully generated: ${successCount}/${routes.length} pages`);
  console.log(`   📁 CSS files linked: ${cssFiles.length}`);
  console.log(`   📁 JS files linked: ${jsFiles.length}`);
  console.log(`   🗺️  Sitemap generated with ${routes.length} URLs`);
  
  if (failedRoutes.length > 0) {
    console.log(`   ❌ Failed routes: ${failedRoutes.join(', ')}`);
  }
  
  // Verify key pages exist
  const keyPages = ['index.html', 'funds/index/index.html', 'about/index.html'];
  keyPages.forEach(page => {
    const pagePath = path.join(distDir, page);
    if (fs.existsSync(pagePath)) {
      console.log(`   ✅ Key page verified: ${page}`);
    } else {
      console.log(`   ❌ Key page missing: ${page}`);
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticFiles().catch(console.error);
}
