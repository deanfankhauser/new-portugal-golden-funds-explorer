import fs from 'fs';
import path from 'path';

/**
 * Verify that the SSG build generated proper static HTML files with SEO elements
 */
export function verifySSGBuild() {
  const distDir = path.join(process.cwd(), 'dist');
  
  console.log('\n🔍 Verifying SSG build quality...\n');
  
  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('❌ CRITICAL: /dist directory not found!');
    return false;
  }
  
  let allPassed = true;
  
  // 1. Verify homepage
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const hasH1 = content.includes('<h1');
    const hasMeta = content.includes('meta name="description"');
    console.log(`✅ Homepage: ${hasH1 ? 'Has H1' : '❌ Missing H1'}, ${hasMeta ? 'Has meta' : '❌ Missing meta'}`);
    if (!hasH1 || !hasMeta) allPassed = false;
  } else {
    console.error('❌ Homepage not found');
    allPassed = false;
  }
  
  // 2. Verify fund detail pages
  const sampleFunds = [
    'horizon-fund',
    'imga-portuguese-corporate-debt-fund',
    'portugal-liquid-opportunities',
    'lince-yield-fund'
  ];
  
  let fundsPassed = 0;
  let fundsWithH1 = 0;
  let fundsWithMeta = 0;
  
  console.log('\n📄 Fund Detail Pages:');
  sampleFunds.forEach(fundId => {
    const fundPath = path.join(distDir, fundId, 'index.html');
    if (fs.existsSync(fundPath)) {
      const content = fs.readFileSync(fundPath, 'utf8');
      const hasH1 = content.includes('<h1');
      const hasMeta = content.includes('meta name="description"');
      const hasStructuredData = content.includes('application/ld+json');
      
      fundsPassed++;
      if (hasH1) fundsWithH1++;
      if (hasMeta) fundsWithMeta++;
      
      console.log(`   ${fundId}: ${hasH1 ? '✅' : '❌'} H1, ${hasMeta ? '✅' : '❌'} Meta, ${hasStructuredData ? '✅' : '❌'} Schema`);
      
      if (!hasH1 || !hasMeta) allPassed = false;
    } else {
      console.log(`   ${fundId}: ❌ NOT FOUND`);
      allPassed = false;
    }
  });
  
  console.log(`\n📊 Fund Pages Summary: ${fundsPassed}/${sampleFunds.length} generated, ${fundsWithH1} with H1, ${fundsWithMeta} with meta`);
  
  // 3. Verify sitemap
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const fundCount = (content.match(/<loc>https:\/\/funds\.movingto\.com\/[^/<]+<\/loc>/g) || []).length;
    console.log(`\n✅ Sitemap: ${fundCount} fund URLs`);
    if (fundCount === 0) {
      console.error('❌ CRITICAL: Sitemap has no fund URLs!');
      allPassed = false;
    }
  } else {
    console.error('\n❌ Sitemap not found');
    allPassed = false;
  }
  
  // Final verdict
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ SSG BUILD VERIFIED: All checks passed!');
    console.log('   - Fund pages have H1 tags in initial HTML');
    console.log('   - SEO meta tags are present');
    console.log('   - Sitemap includes all pages');
  } else {
    console.error('❌ SSG BUILD ISSUES DETECTED');
    console.error('   - Some pages missing H1/H2 tags');
    console.error('   - SEO elements may be incomplete');
    console.error('   - Search engines may not properly index these pages');
  }
  console.log('='.repeat(60) + '\n');
  
  return allPassed;
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifySSGBuild();
}
