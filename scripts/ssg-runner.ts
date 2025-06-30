
import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../src/ssg/routeDiscovery';
import { renderRoute } from '../src/ssg/ssrUtils';
import { generateHTMLTemplate } from '../src/ssg/htmlTemplateGenerator';

function findBuiltAssets(distDir: string): { cssFiles: string[], jsFiles: string[] } {
  const cssFiles: string[] = [];
  const jsFiles: string[] = [];
  
  console.log('🔍 SSG: Scanning for built assets in:', distDir);
  
  function scanDirectory(dir: string, relativePath: string = '') {
    if (!fs.existsSync(dir)) {
      console.warn(`🔍 SSG: Directory not found: ${dir}`);
      return;
    }
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativeFilePath = relativePath ? `${relativePath}/${file}` : file;
      
      if (fs.statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath, relativeFilePath);
      } else if (file.endsWith('.css') && !file.includes('.map')) {
        cssFiles.push(`/${relativeFilePath}`);
        console.log(`✅ SSG: Found CSS: /${relativeFilePath}`);
      } else if (file.endsWith('.js') && !file.includes('.map')) {
        jsFiles.push(`/${relativeFilePath}`);
        console.log(`✅ SSG: Found JS: /${relativeFilePath}`);
      }
    });
  }
  
  scanDirectory(distDir);
  
  // Sort files for predictable loading order
  cssFiles.sort((a, b) => {
    // Prioritize main index files
    if (a.includes('/assets/index-') && !b.includes('/assets/index-')) return -1;
    if (!a.includes('/assets/index-') && b.includes('/assets/index-')) return 1;
    return a.localeCompare(b);
  });
  
  jsFiles.sort((a, b) => {
    // Main files first, then chunks
    if (a.includes('/assets/index-') && !b.includes('/assets/index-')) return -1;
    if (!a.includes('/assets/index-') && b.includes('/assets/index-')) return 1;
    if (a.includes('chunk-') && !b.includes('chunk-')) return 1;
    if (!a.includes('chunk-') && b.includes('chunk-')) return -1;
    return a.localeCompare(b);
  });
  
  console.log(`📊 SSG: Asset summary - CSS: ${cssFiles.length}, JS: ${jsFiles.length}`);
  return { cssFiles, jsFiles };
}

export async function generateStaticFiles() {
  console.log('🎨 SSG: Starting static site generation...');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ SSG: Build directory not found. Please run "vite build" first.');
    process.exit(1);
  }

  const { cssFiles, jsFiles } = findBuiltAssets(distDir);
  
  if (cssFiles.length === 0) {
    console.warn('⚠️  SSG: No CSS files found. Styles may not load correctly.');
  }
  
  if (jsFiles.length === 0) {
    console.warn('⚠️  SSG: No JS files found. Interactivity may not work.');
  }

  const routes = getAllStaticRoutes();
  console.log(`📄 SSG: Processing ${routes.length} routes for static generation`);

  let successCount = 0;
  const failedRoutes: string[] = [];

  // Process each route
  for (const route of routes) {
    try {
      console.log(`🔨 SSG: Processing ${route.path} (${route.pageType})`);
      
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
      console.log(`   📄 Description: ${seoData.description.substring(0, 80)}...`);
      
      // Validate generated file
      const generatedContent = fs.readFileSync(outputPath, 'utf8');
      
      const validationChecks = {
        hasTitle: generatedContent.includes(`<title>${seoData.title}</title>`),
        hasDescription: generatedContent.includes(`content="${seoData.description}"`),
        hasStructuredData: seoData.structuredData && Object.keys(seoData.structuredData).length > 0,
        hasFonts: generatedContent.includes('fonts.googleapis.com'),
        hasCSSAssets: cssFiles.length === 0 || cssFiles.every(css => generatedContent.includes(`href="${css}"`)),
        hasJSAssets: jsFiles.length === 0 || jsFiles.every(js => generatedContent.includes(`src="${js}"`))
      };
      
      const validationResults = Object.entries(validationChecks)
        .map(([key, passed]) => `${key}: ${passed ? '✅' : '❌'}`)
        .join(', ');
      
      console.log(`   🔍 Validation: ${validationResults}`);
      
    } catch (error) {
      console.error(`❌ SSG: Failed to generate ${route.path}:`, error.message);
      failedRoutes.push(route.path);
    }
  }

  // Generate enhanced sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  // Set priority based on page type
  let priority = '0.8';
  if (route.path === '/') priority = '1.0';
  else if (route.pageType === 'fund') priority = '0.9';
  else if (route.pageType === 'fund-index') priority = '0.9';
  else if (['categories', 'tags', 'managers'].includes(route.pageType)) priority = '0.7';
  
  return `  <url>
    <loc>https://movingto.com/funds${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('✅ SSG: Sitemap generated with priority optimization');
  
  // Final report
  console.log('\n🎉 SSG: Static site generation completed!');
  console.log('📊 Generation Summary:');
  console.log(`   ✅ Successfully generated: ${successCount}/${routes.length} pages`);
  console.log(`   📁 CSS assets linked: ${cssFiles.length}`);
  console.log(`   📁 JS assets linked: ${jsFiles.length}`);
  console.log(`   🗺️  Sitemap generated with ${routes.length} URLs`);
  
  if (failedRoutes.length > 0) {
    console.log(`   ❌ Failed routes: ${failedRoutes.join(', ')}`);
    console.log('   📋 Consider checking component imports and route configurations');
  }
  
  // Verify critical pages
  const criticalPages = [
    { file: 'index.html', name: 'Homepage' },
    { file: 'funds/index/index.html', name: 'Fund Index' },
    { file: 'about/index.html', name: 'About Page' }
  ];
  
  console.log('\n🔍 Critical Page Verification:');
  criticalPages.forEach(({ file, name }) => {
    const pagePath = path.join(distDir, file);
    if (fs.existsSync(pagePath)) {
      const fileSize = fs.statSync(pagePath).size;
      console.log(`   ✅ ${name}: ${file} (${Math.round(fileSize / 1024)}KB)`);
    } else {
      console.log(`   ❌ ${name}: ${file} MISSING`);
    }
  });
  
  console.log(`\n🚀 Static site ready at: ${distDir}`);
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticFiles().catch(error => {
    console.error('💥 SSG: Fatal error:', error);
    process.exit(1);
  });
}
