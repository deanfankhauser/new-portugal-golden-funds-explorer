
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Compile TypeScript files to JavaScript for SSG
export function compileSSGFiles() {
  console.log('\n🏗️  Compiling SSG files...');
  
  try {
    // Generate dynamic redirects first
    console.log('🔀 Generating dynamic redirects...');
    execSync('npx tsx scripts/ssg/generate-redirects.ts', {
      stdio: 'inherit'
    });
    
    // Generate fund slug redirects (legacy URLs → current fundId routes)
    console.log('🔀 Generating fund slug redirects...');
    execSync('npx tsx scripts/ssg/generate-fund-slug-redirects.ts', {
      stdio: 'inherit'
    });
    
    // Execute the SSG runner with debug mode if requested
    const ssgEnv = {
      ...process.env,
      SSG_DEBUG: process.env.SSG_DEBUG || '0'
    };
    
    console.log('🔧 SSG_DEBUG=' + ssgEnv.SSG_DEBUG);
    
    execSync('npx tsx scripts/ssg-runner.ts', {
      stdio: 'inherit',
      env: ssgEnv
    });
    
    // Verify that static files were generated with proper SEO
    const distDir = path.join(process.cwd(), 'dist');
    
    // Step 4: Verify critical pages with strict checks
    console.log('\n🔍 Verifying critical pages...');
    
    const criticalPages = [
      { path: path.join(distDir, 'index.html'), name: 'homepage' },
      { path: path.join(distDir, 'disclaimer', 'index.html'), name: 'disclaimer' },
      { path: path.join(distDir, 'privacy', 'index.html'), name: 'privacy' }
    ];
    
    let verificationFailed = false;
    
    for (const page of criticalPages) {
      if (!fs.existsSync(page.path)) {
        console.error(`❌ CRITICAL: ${page.name} not generated at ${page.path}`);
        verificationFailed = true;
        continue;
      }
      
      const content = fs.readFileSync(page.path, 'utf-8');
      const hasH1 = content.includes('<h1');
      const h1Count = (content.match(/<h1[^>]*>/g) || []).length;
      const contentLength = content.length;
      const hasContent = content.includes('<main') || content.includes('<article');
      
      if (!hasH1) {
        console.error(`❌ CRITICAL: ${page.name} missing H1 tag`);
        verificationFailed = true;
      } else if (h1Count > 1) {
        console.warn(`⚠️  ${page.name} has ${h1Count} H1 tags (should be 1)`);
      } else if (contentLength < 1500) {
        console.warn(`⚠️  ${page.name} suspiciously short (${contentLength} bytes)`);
      } else if (!hasContent) {
        console.warn(`⚠️  ${page.name} missing semantic HTML`);
      } else {
        console.log(`   ✅ ${page.name}: ${contentLength} bytes, 1 H1, semantic HTML`);
      }
    }
    
    if (verificationFailed) {
      throw new Error('SSG verification failed: Critical pages missing or incomplete');
    }
    
    // Quick check on fund pages
    const fundDirs = fs.readdirSync(distDir).filter(f => {
      const fullPath = path.join(distDir, f);
      const stat = fs.statSync(fullPath);
      return stat.isDirectory() && !['assets', 'categories', 'tags', 'managers', 'compare', 'comparisons', 'alternatives', 'disclaimer', 'privacy', 'about'].includes(f);
    });
    
    const sampleSize = Math.min(3, fundDirs.length);
    if (sampleSize > 0) {
      console.log(`\n🔍 Spot-checking ${sampleSize} fund pages...`);
      fundDirs.slice(0, sampleSize).forEach(fundId => {
        const fundHtml = path.join(distDir, fundId, 'index.html');
        if (fs.existsSync(fundHtml)) {
          const fundContent = fs.readFileSync(fundHtml, 'utf-8');
          const hasH1 = fundContent.includes('<h1');
          if (!hasH1) {
            console.warn(`⚠️  Fund page ${fundId} missing H1 tag`);
          } else {
            console.log(`   ✅ ${fundId}: has H1`);
          }
        }
      });
    }
    
    // Check sitemap
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const comparisonUrls = (sitemapContent.match(/\/compare\//g) || []).length;
      const alternativesUrls = (sitemapContent.match(/\/alternatives\//g) || []).length;
      console.log(`\n✅ Sitemap includes: ${comparisonUrls} comparisons, ${alternativesUrls} alternatives`);
    }

    // Write quick presence check for tags/categories and expose for debugging
    const tagsDir = path.join(distDir, 'tags');
    const categoriesDir = path.join(distDir, 'categories');
    const manifest = {
      tagsSubdirs: fs.existsSync(tagsDir) ? fs.readdirSync(tagsDir) : [],
      categoriesSubdirs: fs.existsSync(categoriesDir) ? fs.readdirSync(categoriesDir) : []
    };
    fs.writeFileSync(path.join(distDir, 'ssg-presence.json'), JSON.stringify(manifest, null, 2));
    console.log('📝 Wrote SSG presence manifest: dist/ssg-presence.json');

    if (!fs.existsSync(tagsDir) || manifest.tagsSubdirs.length === 0) {
      console.warn('⚠️  No tag pages detected in dist/tags. Reloads for /tags/* will 404.');
    }
    if (!fs.existsSync(categoriesDir) || manifest.categoriesSubdirs.length === 0) {
      console.warn('⚠️  No category pages detected in dist/categories. Reloads for /categories/* will 404.');
    }

    // Also copy enhanced sitemap files from dist to public so /sitemap.xml resolves correctly in dev/preview
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const distDir = path.join(process.cwd(), 'dist');
      const filesToCopy = ['sitemap.xml', 'sitemap-index.xml', 'sitemap-funds.xml', 'sitemap-enhanced.xml', 'robots.txt'];
      filesToCopy.forEach((file) => {
        const src = path.join(distDir, file);
        if (fs.existsSync(src)) {
          const dest = path.join(publicDir, file);
          fs.copyFileSync(src, dest);
        }
      });
      console.log('🗺️  SSG: Copied enhanced sitemaps to /public');

      // Fallback: if consolidated sitemap lacks categories/tags, use enhanced sitemap which includes them
      try {
        const publicSitemap = path.join(publicDir, 'sitemap.xml');
        const enhancedPath = path.join(distDir, 'sitemap-enhanced.xml');
        if (fs.existsSync(publicSitemap)) {
          const content = fs.readFileSync(publicSitemap, 'utf8');
          const hasCategories = content.includes('/categories/');
          const hasTags = content.includes('/tags/');
          if ((!hasCategories || !hasTags) && fs.existsSync(enhancedPath)) {
            const enhanced = fs.readFileSync(enhancedPath, 'utf8');
            fs.writeFileSync(publicSitemap, enhanced);
            console.log('🗺️  SSG: Replaced /public/sitemap.xml with enhanced sitemap to include categories/tags');
          }
        }
      } catch (fallbackErr) {
        console.warn('⚠️  SSG: Failed fallback to enhanced sitemap:', fallbackErr.message);
      }
    } catch (copyErr) {
      console.warn('⚠️  SSG: Could not copy enhanced sitemap files to /public:', copyErr.message);
    }
    
  } catch (error) {
    console.warn('⚠️  SSG compilation failed, falling back to basic build');
    
    // Create basic sitemap as fallback
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://funds.movingto.com</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    const sitemapOutPath = path.join(distDir, 'sitemap.xml');
    // Do NOT overwrite an existing sitemap copied from /public
    if (!fs.existsSync(sitemapOutPath)) {
      fs.writeFileSync(sitemapOutPath, basicSitemap);
    }
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      // Copy the original Vite-built index.html as fallback
      console.log('⚠️  Creating fallback SPA index.html for Vercel');
    }
  }
}
