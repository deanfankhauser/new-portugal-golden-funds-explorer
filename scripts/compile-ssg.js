
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Compile TypeScript files to JavaScript for SSG
export function compileSSGFiles() {
  console.log('\n🏗️  SSG Compilation Pipeline Starting...\n');
  console.log('═'.repeat(60));
  
  try {
    // Step 1 & 2: Skip redirect generation on Vercel (modifying vercel.json during build doesn't apply)
    if (process.env.VERCEL === '1') {
      console.log('\n📍 STEP 1-2: Skipped (CI environment - redirect generation disabled on Vercel)');
      console.log('─'.repeat(60));
      console.log('ℹ️  Dynamic redirects and fund slug aliases are skipped in CI builds');
      console.log('   (Modifying vercel.json during deployment has no effect)');
    } else {
      // Step 1: Generate dynamic redirects first
      console.log('\n📍 STEP 1: Generating dynamic redirects...');
      console.log('─'.repeat(60));
      execSync('npx tsx scripts/ssg/generate-redirects.ts', {
        stdio: 'inherit'
      });
      
      // Step 2: Generate fund slug redirects (legacy URLs → current fundId routes)
      console.log('\n📍 STEP 2: Generating fund slug redirects...');
      console.log('─'.repeat(60));
      execSync('npx tsx scripts/ssg/generate-fund-slug-redirects.ts', {
        stdio: 'inherit'
      });
    }
    
    // Step 3: Execute the SSG runner with debug mode if requested
    console.log('\n📍 STEP 3: Running SSG generation...');
    console.log('─'.repeat(60));
    const ssgEnv = {
      ...process.env,
      SSG_DEBUG: process.env.SSG_DEBUG || '0'
    };
    
    console.log('🔧 Environment: SSG_DEBUG=' + ssgEnv.SSG_DEBUG);
    console.log('🔌 Supabase URL:', process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ MISSING');
    console.log('🔑 Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ MISSING');
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('CRITICAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY - cannot fetch data during build');
    }
    
    console.log('');
    execSync('npx tsx scripts/ssg-runner.ts', {
      stdio: 'inherit',
      env: ssgEnv
    });
    
    // Step 4: Generate legacy slug aliases
    console.log('\n📍 STEP 4: Generating legacy slug aliases...');
    console.log('─'.repeat(60));
    try {
      execSync('npx tsx scripts/ssg/generate-legacy-slug-aliases.ts', { stdio: 'inherit' });
    } catch (aliasError) {
      console.warn('⚠️  Legacy slug alias generation failed (non-critical):', aliasError.message);
    }

    // Step 5: Log dist tree for diagnostics
    console.log('\n📍 STEP 5: Dist directory diagnostics...');
    console.log('─'.repeat(60));
    try {
      execSync('npx tsx scripts/ssg/log-dist-tree.ts', { stdio: 'inherit' });
    } catch (treeError) {
      console.warn('⚠️  Dist tree logging failed (non-critical)');
    }

    // Step 6: Verify that static files were generated with proper SEO
    console.log('\n📍 STEP 6: Verifying generated pages...');
    console.log('─'.repeat(60));
    const distDir = path.join(process.cwd(), 'dist');
    
    // Verify critical pages with strict checks
    
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

    // Step 7: Validate sitemap canonical tags
    console.log('\n📍 STEP 7: Validating sitemap canonical tags...');
    console.log('─'.repeat(60));
    try {
      execSync('npx tsx scripts/ssg/validate-sitemap-canonical.ts', { stdio: 'inherit' });
    } catch (validationError) {
      console.error('❌ Sitemap canonical validation failed');
      throw validationError;
    }

    // Step 8: Copy enhanced sitemap files from dist to public
    console.log('\n📍 STEP 8: Copying sitemaps to public...');
    console.log('─'.repeat(60));
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const distDir = path.join(process.cwd(), 'dist');
      const filesToCopy = ['sitemap.xml', 'sitemap-index.xml', 'sitemap-funds.xml', 'sitemap-enhanced.xml', 'robots.txt'];
      
      let copiedCount = 0;
      filesToCopy.forEach((file) => {
        const src = path.join(distDir, file);
        if (fs.existsSync(src)) {
          const dest = path.join(publicDir, file);
          fs.copyFileSync(src, dest);
          copiedCount++;
        }
      });
      console.log(`✅ Copied ${copiedCount} sitemap files to /public`);

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
      console.warn('⚠️  Could not copy sitemap files to /public:', copyErr.message);
    }
    
    // Final summary
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 SSG COMPILATION PIPELINE COMPLETED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    console.log('');
    console.log('📊 Next Steps:');
    console.log('   1. Check dist/ssg-manifest.json for route generation details');
    console.log('   2. Check dist/ssg-presence.json for tags/categories verification');
    console.log('   3. Deploy to Vercel and verify production URLs');
    console.log('   4. Test sample URLs with curl after deployment');
    console.log('');
    
  } catch (error) {
    console.error('\n' + '═'.repeat(60));
    console.error('❌ SSG COMPILATION FAILED');
    console.error('═'.repeat(60));
    console.error('Error:', error.message);
    console.error('\n🚨 Build aborted: SSG must complete successfully to deploy');
    console.error('   No fallback SPA-only build will be created.');
    console.error('   Fix the SSG error above and redeploy.\n');
    
    // Exit with error code to fail the Vercel deployment
    process.exit(1);
  }
}
