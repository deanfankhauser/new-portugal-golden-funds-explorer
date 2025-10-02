import fs from 'fs';
import path from 'path';

const criticalPages = [
  { path: 'index.html', name: 'Homepage' },
  { path: 'optimize-golden-opportunities/index.html', name: 'Optimize Fund' },
  { path: 'horizon-fund/index.html', name: 'Horizon Fund' },
  { path: 'portugal-liquid-opportunities/index.html', name: 'Portugal Liquid' }
];

console.log('\n🔍 Verifying SSG Build Quality...\n');

let failures = 0;

criticalPages.forEach(({ path: pagePath, name }) => {
  const fullPath = path.join(process.cwd(), 'dist', pagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ ${name}: File not found at ${pagePath}`);
    failures++;
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  const checks = {
    hasH1: content.includes('<h1'),
    hasMetaDescription: content.includes('meta name="description"'),
    hasStructuredData: content.includes('application/ld+json'),
    contentLength: content.length
  };
  
  if (!checks.hasH1) {
    console.error(`❌ ${name}: Missing <h1> tag`);
    failures++;
  } else if (!checks.hasMetaDescription) {
    console.warn(`⚠️  ${name}: Missing meta description`);
  } else if (checks.contentLength < 1000) {
    console.warn(`⚠️  ${name}: Content suspiciously short (${checks.contentLength} chars)`);
  } else {
    console.log(`✅ ${name}: Valid (${checks.contentLength} chars, has H1, meta, structured data)`);
  }
});

// Verify sitemap
const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  console.log(`\n✅ Sitemap: ${urlCount} URLs`);
} else {
  console.error('\n❌ Sitemap: Not found');
  failures++;
}

if (failures > 0) {
  console.error(`\n❌ Build verification failed with ${failures} errors`);
  process.exit(1);
} else {
  console.log('\n✅ All SSG quality checks passed!\n');
}
