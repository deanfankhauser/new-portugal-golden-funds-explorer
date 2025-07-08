
import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../src/ssg/routeDiscovery';
import { renderRoute } from '../src/ssg/ssrUtils';
import { generateHTMLTemplate } from '../src/ssg/htmlTemplateGenerator';

function findBuiltAssets(distDir: string): { cssFiles: string[], jsFiles: string[] } {
  const cssFiles: string[] = [];
  const jsFiles: string[] = [];
  
  console.log('🔍 SSG: Scanning for built assets in:', distDir);
  
  const assetsDir = path.join(distDir, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.warn(`🔍 SSG: Assets directory not found: ${assetsDir}`);
    return { cssFiles, jsFiles };
  }
  
  const files = fs.readdirSync(assetsDir);
  console.log('🔍 SSG: Found files in assets directory:', files);
  
  files.forEach(file => {
    const fullPath = path.join(assetsDir, file);
    
    if (fs.statSync(fullPath).isFile()) {
      if (file.endsWith('.css') && !file.includes('.map')) {
        cssFiles.push(file);
        console.log(`✅ SSG: Found CSS: ${file}`);
      } else if (file.endsWith('.js') && !file.includes('.map')) {
        jsFiles.push(file);
        console.log(`✅ SSG: Found JS: ${file}`);
      }
    }
  });
  
  // Sort files for predictable loading order
  cssFiles.sort((a, b) => {
    // Prioritize main index files
    if (a.includes('index-') && !b.includes('index-')) return -1;
    if (!a.includes('index-') && b.includes('index-')) return 1;
    return a.localeCompare(b);
  });
  
  jsFiles.sort((a, b) => {
    // Main files first, then chunks
    if (a.includes('index-') && !b.includes('index-')) return -1;
    if (!a.includes('index-') && b.includes('index-')) return 1;
    if (a.includes('chunk-') && !b.includes('chunk-')) return 1;
    if (!a.includes('chunk-') && b.includes('chunk-')) return -1;
    return a.localeCompare(b);
  });
  
  console.log(`📊 SSG: Asset summary - CSS: ${cssFiles.length}, JS: ${jsFiles.length}`);
  console.log('📊 SSG: CSS files:', cssFiles);
  console.log('📊 SSG: JS files:', jsFiles);
  
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
      
      // Verify assets exist before writing HTML
      const missingAssets: string[] = [];
      cssFiles.forEach(css => {
        const assetPath = path.join(distDir, 'assets', css);
        if (!fs.existsSync(assetPath)) {
          missingAssets.push(`CSS: assets/${css}`);
        }
      });
      
      jsFiles.forEach(js => {
        const assetPath = path.join(distDir, 'assets', js);
        if (!fs.existsSync(assetPath)) {
          missingAssets.push(`JS: assets/${js}`);
        }
      });
      
      if (missingAssets.length > 0) {
        console.warn(`⚠️  SSG: Missing assets for ${route.path}:`, missingAssets);
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
        hasRelativeCSS: cssFiles.length === 0 || cssFiles.every(css => generatedContent.includes(`href="./assets/${css}"`)),
        hasRelativeJS: jsFiles.length === 0 || jsFiles.every(js => generatedContent.includes(`src="./assets/${js}"`)),
        noAbsolutePaths: !generatedContent.includes('https://www.movingto.com/funds/assets/')
      };
      
      const validationResults = Object.entries(validationChecks)
        .map(([key, passed]) => `${key}: ${passed ? '✅' : '❌'}`)
        .join(', ');
      
      console.log(`   🔍 Validation: ${validationResults}`);
      
      if (!validationChecks.hasRelativeCSS || !validationChecks.hasRelativeJS) {
        console.warn(`   ⚠️  Asset path issues in ${outputPath}`);
        console.warn(`   Expected CSS files: ${cssFiles.join(', ')}`);
        console.warn(`   Expected JS files: ${jsFiles.join(', ')}`);
      }
      
    } catch (error) {
      console.error(`❌ SSG: Failed to generate ${route.path}:`, error.message);
      failedRoutes.push(route.path);
    }
  }

  // Generate enhanced sitemap with correct www subdomain
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  let priority = '0.8';
  if (route.path === '/') priority = '1.0';
  else if (route.pageType === 'fund') priority = '0.9';
  else if (route.pageType === 'fund-index') priority = '0.9';
  else if (['categories', 'tags', 'managers'].includes(route.pageType)) priority = '0.7';
  
  return `  <url>
    <loc>https://www.movingto.com/funds${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('✅ SSG: Sitemap generated with correct www subdomain');
  
  // Final report
  console.log('\n🎉 SSG: Static site generation completed!');
  console.log('📊 Generation Summary:');
  console.log(`   ✅ Successfully generated: ${successCount}/${routes.length} pages`);
  console.log(`   📁 CSS assets linked: ${cssFiles.length}`);
  console.log(`   📁 JS assets linked: ${jsFiles.length}`);
  console.log(`   🗺️  Sitemap generated with ${routes.length} URLs`);
  
  if (failedRoutes.length > 0) {
    console.log(`   ❌ Failed routes: ${failedRoutes.join(', ')}`);
  }
  
  // Verify critical pages and their asset references
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
      const content = fs.readFileSync(pagePath, 'utf8');
      const hasRelativePaths = !content.includes('https://www.movingto.com/funds/assets/');
      const hasCorrectAssets = cssFiles.every(css => content.includes(`href="./assets/${css}"`)) &&
                               jsFiles.every(js => content.includes(`src="./assets/${js}"`));
      console.log(`   ${hasRelativePaths && hasCorrectAssets ? '✅' : '❌'} ${name}: ${file} (${Math.round(fileSize / 1024)}KB)`);
      
      if (!hasCorrectAssets) {
        console.log(`      Missing assets in ${name}`);
      }
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
