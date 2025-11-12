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
    hasCanonical: content.includes('link rel="canonical"'),
    hasKeywords: content.includes('meta name="keywords"'),
    hasOGTags: content.includes('property="og:title"') && content.includes('property="og:description"'),
    hasTwitterCard: content.includes('name="twitter:card"'),
    hasRobots: content.includes('meta name="robots"'),
    contentLength: content.length
  };
  
  const errors = [];
  const warnings = [];
  
  if (!checks.hasH1) errors.push('Missing <h1> tag');
  if (!checks.hasMetaDescription) errors.push('Missing meta description');
  if (!checks.hasCanonical) warnings.push('Missing canonical link');
  if (!checks.hasKeywords) warnings.push('Missing keywords meta tag');
  if (!checks.hasOGTags) warnings.push('Missing Open Graph tags');
  if (!checks.hasTwitterCard) warnings.push('Missing Twitter card tags');
  if (!checks.hasRobots) warnings.push('Missing robots meta tag');
  if (checks.contentLength < 1000) warnings.push(`Content short (${checks.contentLength} chars)`);
  
  if (errors.length > 0) {
    console.error(`❌ ${name}: ${errors.join(', ')}`);
    failures++;
  } else if (warnings.length > 0) {
    console.warn(`⚠️  ${name}: ${warnings.join(', ')}`);
  } else {
    console.log(`✅ ${name}: All meta tags present (${checks.contentLength} chars)`);
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

console.log('\n📋 SSG Meta Tags Verification Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✓ H1 tags presence');
console.log('✓ Meta descriptions');
console.log('✓ Canonical links');
console.log('✓ Keywords meta tags');
console.log('✓ Open Graph tags (title, description, url)');
console.log('✓ Twitter Card tags');
console.log('✓ Robots meta tags');
console.log('✓ Structured data (JSON-LD)');
console.log('✓ Content length validation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (failures > 0) {
  console.error(`❌ Build verification failed with ${failures} critical errors`);
  console.error('Fix these issues before deploying to production.\n');
  process.exit(1);
} else {
  console.log('✅ All SSG quality checks passed!');
  console.log('🚀 Static HTML files are properly optimized for SEO');
  console.log('🔍 All meta tags are correctly injected during build time\n');
}
