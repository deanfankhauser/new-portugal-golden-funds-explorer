import fs from 'fs';
import path from 'path';

/**
 * Verify that SSG-generated HTML files contain proper content for SEO
 */
export function verifySSGHTML() {
  console.log('\n🔍 Verifying SSG HTML quality...\n');
  
  const distDir = path.join(process.cwd(), 'dist');
  let failures = 0;
  
  // Check critical pages including category/tag pages
  const criticalPages = [
    { path: 'index.html', name: 'Homepage', expectH1Contains: 'Golden Visa' },
    { path: 'disclaimer/index.html', name: 'Disclaimer' },
    { path: 'privacy/index.html', name: 'Privacy' },
    // Category pages - must NOT show homepage content
    { path: 'categories/mixed/index.html', name: 'Mixed Category', expectH1Contains: 'Mixed', mustNotContain: 'Compare Golden Visa Investment Funds' },
    { path: 'categories/venture-capital/index.html', name: 'Venture Capital Category', expectH1Contains: 'Venture Capital', mustNotContain: 'Compare Golden Visa Investment Funds' },
    // Tag pages
    { path: 'tags/esg/index.html', name: 'ESG Tag', expectH1Contains: 'ESG', mustNotContain: 'Compare Golden Visa Investment Funds' },
  ];
  
  criticalPages.forEach(({ path: pagePath, name, expectH1Contains, mustNotContain }) => {
    const fullPath = path.join(distDir, pagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ ${name}: File not found at ${pagePath}`);
      failures++;
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Extract H1 content
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Content = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null;
    
    const checks = {
      hasH1: !!h1Match,
      hasMetaDescription: content.includes('meta name="description"'),
      hasStructuredData: content.includes('application/ld+json'),
      hasContent: content.includes('<main') || content.includes('<article'),
      contentLength: content.length
    };
    
    // Check H1 contains expected text (critical for category/tag pages)
    if (expectH1Contains && h1Content) {
      if (!h1Content.toLowerCase().includes(expectH1Contains.toLowerCase())) {
        console.error(`❌ ${name}: H1 "${h1Content.substring(0, 50)}..." does not contain "${expectH1Contains}" - likely rendering wrong page`);
        failures++;
        return;
      }
    }
    
    // Check for unwanted content (e.g., homepage content on category pages)
    if (mustNotContain && content.includes(mustNotContain)) {
      console.error(`❌ ${name}: Contains homepage content - route falling back incorrectly`);
      failures++;
      return;
    }
    
    if (!checks.hasH1) {
      console.error(`❌ ${name}: Missing <h1> tag`);
      failures++;
    } else if (!checks.hasMetaDescription) {
      console.warn(`⚠️  ${name}: Missing meta description`);
    } else if (!checks.hasStructuredData) {
      console.warn(`⚠️  ${name}: Missing structured data`);
    } else if (!checks.hasContent) {
      console.warn(`⚠️  ${name}: Missing semantic HTML`);
    } else if (checks.contentLength < 1000) {
      console.warn(`⚠️  ${name}: Content suspiciously short (${checks.contentLength} chars)`);
    } else {
      console.log(`✅ ${name}: Valid (${checks.contentLength} chars, H1 contains "${expectH1Contains || 'any'}")`);
    }
  });
  
  // Sample check fund pages
  const fundDirs = fs.readdirSync(distDir).filter(f => {
    const fullPath = path.join(distDir, f);
    const stat = fs.statSync(fullPath);
    return stat.isDirectory() && 
           !['assets', 'categories', 'tags', 'managers', 'manager', 'compare', 'comparisons', 'alternatives', 'disclaimer', 'privacy', 'about', 'admin', 'account', 'auth', 'my-funds', 'manage-fund', 'manage-profile', 'saved-funds', 'verified-funds', 'faqs', 'roi-calculator', 'verification-program'].includes(f);
  });
  
  const sampleSize = Math.min(5, fundDirs.length);
  if (sampleSize > 0) {
    console.log(`\n🔍 Checking ${sampleSize} fund pages...`);
    
    fundDirs.slice(0, sampleSize).forEach(fundId => {
      const fundHtml = path.join(distDir, fundId, 'index.html');
      if (fs.existsSync(fundHtml)) {
        const content = fs.readFileSync(fundHtml, 'utf-8');
        const hasH1 = content.includes('<h1');
        const hasMetaDesc = content.includes('meta name="description"');
        const hasStructuredData = content.includes('application/ld+json');
        const length = content.length;
        
        if (!hasH1 || !hasMetaDesc || !hasStructuredData || length < 5000) {
          console.error(`❌ ${fundId}: H1=${hasH1}, Meta=${hasMetaDesc}, Schema=${hasStructuredData}, Size=${length}`);
          failures++;
        } else {
          console.log(`✅ ${fundId}: ${length} chars, H1, meta, schema`);
        }
      }
    });
  }
  
  // Verify sitemap
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    const locCount = (sitemap.match(/<loc>/g) || []).length;
    
    if (urlCount > 0 && locCount > 0) {
      console.log(`\n✅ Sitemap: ${urlCount} URLs`);
    } else {
      console.error('\n❌ Sitemap: Invalid or empty');
      failures++;
    }
  } else {
    console.error('\n❌ Sitemap: Not found');
    failures++;
  }
  
  if (failures > 0) {
    console.error(`\n❌ SSG HTML verification failed with ${failures} errors`);
    return false;
  } else {
    console.log('\n✅ All SSG HTML quality checks passed!\n');
    return true;
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = verifySSGHTML();
  process.exit(success ? 0 : 1);
}
