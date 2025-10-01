#!/usr/bin/env tsx

/**
 * Emergency sitemap regeneration script
 * Run with: npx tsx scripts/regenerate-sitemap-now.ts
 * 
 * This directly generates a comprehensive sitemap in /public and /dist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Direct imports (no dynamic imports)
import { funds } from '../src/data/services/funds-service';
import { getAllComparisonSlugs, generateFundComparisons } from '../src/data/services/comparison-service';
import { getAllCategories } from '../src/data/services/categories-service';
import { getAllTags } from '../src/data/services/tags-service';
import { getAllFundManagers } from '../src/data/services/managers-service';
import { URL_CONFIG } from '../src/utils/urlConfig';
import { categoryToSlug, tagToSlug, managerToSlug } from '../src/lib/utils';

console.log('🔧 EMERGENCY SITEMAP REGENERATION\n');

// Step 1: Verify data sources
console.log('Step 1: Verifying data sources...');
console.log(`   Funds: ${funds.length}`);

const comparisonSlugs = getAllComparisonSlugs();
console.log(`   Comparison slugs: ${comparisonSlugs.length}`);

const categories = getAllCategories();
console.log(`   Categories: ${categories.length}`);

const tags = getAllTags();
console.log(`   Tags: ${tags.length}`);

const managers = getAllFundManagers();
console.log(`   Managers: ${managers.length}\n`);

if (funds.length === 0) {
  console.error('❌ CRITICAL: No funds available!');
  process.exit(1);
}

if (comparisonSlugs.length === 0) {
  console.error('❌ CRITICAL: No comparison slugs generated!');
  console.error('   Attempting manual generation...');
  const manualComparisons = generateFundComparisons();
  console.log(`   Manual generation result: ${manualComparisons.length} comparisons`);
  if (manualComparisons.length === 0) {
    console.error('❌ Manual generation also failed! Exiting...');
    process.exit(1);
  }
}

// Step 2: Generate sitemap URLs
console.log('Step 2: Generating sitemap URLs...');

const currentDate = new Date().toISOString().split('T')[0];
const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: number }> = [];

// Homepage
urls.push({
  loc: URL_CONFIG.BASE_URL,
  lastmod: currentDate,
  changefreq: 'daily',
  priority: 1.0
});

// Static pages
const staticPages = [
  { path: '/index', priority: 0.9, changefreq: 'daily' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/disclaimer', priority: 0.3, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'monthly' },
  { path: '/faqs', priority: 0.7, changefreq: 'monthly' },
  { path: '/roi-calculator', priority: 0.6, changefreq: 'monthly' },
  { path: '/saved-funds', priority: 0.6, changefreq: 'weekly' },
  { path: '/categories', priority: 0.8, changefreq: 'weekly' },
  { path: '/tags', priority: 0.8, changefreq: 'weekly' },
  { path: '/managers', priority: 0.8, changefreq: 'weekly' },
  { path: '/comparisons', priority: 0.7, changefreq: 'weekly' },
  { path: '/compare', priority: 0.6, changefreq: 'weekly' },
  { path: '/alternatives', priority: 0.7, changefreq: 'weekly' }
];

staticPages.forEach(page => {
  urls.push({
    loc: `${URL_CONFIG.BASE_URL}${page.path}`,
    lastmod: currentDate,
    changefreq: page.changefreq as any,
    priority: page.priority
  });
});

// Fund pages
funds.forEach(fund => {
  // Fund detail page
  urls.push({
    loc: URL_CONFIG.buildFundUrl(fund.id),
    lastmod: fund.dateModified || currentDate,
    changefreq: 'weekly',
    priority: 0.9
  });

  // Fund alternatives page
  urls.push({
    loc: `${URL_CONFIG.buildFundUrl(fund.id)}/alternatives`,
    lastmod: fund.dateModified || currentDate,
    changefreq: 'weekly',
    priority: 0.8
  });
});

// Category pages
categories.forEach(category => {
  urls.push({
    loc: URL_CONFIG.buildCategoryUrl(category),
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8
  });
});

// Tag pages
tags.forEach(tag => {
  urls.push({
    loc: URL_CONFIG.buildTagUrl(tag),
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.7
  });
});

// Manager pages
managers.forEach(manager => {
  urls.push({
    loc: URL_CONFIG.buildManagerUrl(manager.name),
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8
  });
});

// Comparison pages - THE CRITICAL MISSING PIECE
console.log(`   Adding ${comparisonSlugs.length} comparison pages...`);
comparisonSlugs.forEach(slug => {
  urls.push({
    loc: URL_CONFIG.buildComparisonUrl(slug),
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.85
  });
});

console.log(`   Total URLs: ${urls.length}\n`);

// Step 3: Generate XML
console.log('Step 3: Generating XML...');

const urlElements = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n');

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

// Step 4: Write to files
console.log('Step 4: Writing sitemap files...');

const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');

// Write to /public
const publicPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapXML, 'utf8');
console.log(`   ✅ Written to: ${publicPath}`);

// Write to /dist if it exists
if (fs.existsSync(distDir)) {
  const distPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(distPath, sitemapXML, 'utf8');
  console.log(`   ✅ Written to: ${distPath}`);
}

// Step 5: Generate robots.txt
const robotsTxt = `# Robots.txt for ${URL_CONFIG.BASE_URL}
# Generated on ${currentDate}

User-agent: *
Allow: /

# Disallow admin and auth pages
Disallow: /admin
Disallow: /auth
Disallow: /manager-auth
Disallow: /investor-auth

# Sitemap location
Sitemap: ${URL_CONFIG.BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
console.log(`   ✅ robots.txt updated\n`);

// Step 6: Summary
console.log('📊 SITEMAP GENERATION SUMMARY:');
console.log(`   Static pages: ${staticPages.length + 1}`);
console.log(`   Fund pages: ${funds.length * 2} (${funds.length} details + ${funds.length} alternatives)`);
console.log(`   Category pages: ${categories.length}`);
console.log(`   Tag pages: ${tags.length}`);
console.log(`   Manager pages: ${managers.length}`);
console.log(`   Comparison pages: ${comparisonSlugs.length}`);
console.log(`   ─────────────────────────────────`);
console.log(`   TOTAL: ${urls.length} URLs\n`);

const expectedIdeal = 1500;
if (urls.length >= expectedIdeal) {
  console.log(`✅ EXCELLENT: ${urls.length} URLs generated!`);
  console.log('✅ Sitemap is now comprehensive with all pages included!\n');
} else if (urls.length >= 1000) {
  console.log(`✅ GOOD: ${urls.length} URLs generated (expected ${expectedIdeal})`);
} else {
  console.warn(`⚠️  WARNING: Only ${urls.length} URLs generated (expected ${expectedIdeal}+)`);
}

console.log('🎉 Sitemap regeneration complete!');
console.log('   Run this script anytime to regenerate the sitemap with all pages.');
