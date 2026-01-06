/**
 * Sitemap Index Generator - Modular type-specific sitemaps
 * 
 * Generates separate sitemaps per content type with indexability filtering.
 * Only includes URLs that pass indexability checks.
 */
import fs from 'fs';
import path from 'path';
import { fetchAllBuildDataCached, fetchAllTeamMembersForBuild } from '../../src/lib/build-data-fetcher';
import { generateComparisonsFromFunds } from '../../src/data/services/comparison-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../../src/lib/utils';
import { isGoneTeamMember } from '../../src/lib/gone-slugs';
import { Fund } from '../../src/data/types/funds';

// Import indexability checks
import {
  checkFundIndexability,
  checkCategoryIndexability,
  checkTagIndexability,
  checkManagerIndexability,
  checkComparisonIndexability,
  checkTeamMemberIndexability,
} from '../../src/lib/indexability/checks';

const PRODUCTION_BASE_URL = 'https://funds.movingto.com';
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const SITEMAP_NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface SitemapFile {
  filename: string;
  urlCount: number;
  lastmod: string;
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate XML for a single URL entry
 */
function generateURLElement(url: SitemapURL): string {
  return `  <url>
    <loc>${escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`;
}

/**
 * Write sitemap XML file
 */
function writeSitemapXML(distDir: string, filename: string, urls: SitemapURL[]): void {
  const xml = `${XML_DECLARATION}
<urlset xmlns="${SITEMAP_NAMESPACE}">
${urls.map(generateURLElement).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, filename), xml);
}

/**
 * Generate funds sitemap with indexability filtering
 */
async function generateFundsSitemap(distDir: string, funds: Fund[]): Promise<SitemapFile> {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapURL[] = [];

  // Filter to only indexable funds
  const indexableFunds = funds.filter(fund => {
    const result = checkFundIndexability(fund);
    return result.isIndexable;
  });

  const excludedCount = funds.length - indexableFunds.length;
  console.log(`📄 Funds: ${indexableFunds.length} indexable (${excludedCount} excluded)`);

  // Add fund detail pages
  indexableFunds.forEach(fund => {
    urls.push({
      loc: `${PRODUCTION_BASE_URL}/${fund.id}`,
      lastmod: fund.dateModified || currentDate,
      changefreq: 'weekly',
      priority: 0.9
    });

    // Also add /alternatives pages
    urls.push({
      loc: `${PRODUCTION_BASE_URL}/${fund.id}/alternatives`,
      lastmod: fund.dateModified || currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  writeSitemapXML(distDir, 'sitemap-funds.xml', urls);
  return { filename: 'sitemap-funds.xml', urlCount: urls.length, lastmod: currentDate };
}

/**
 * Generate categories sitemap with indexability filtering
 */
async function generateCategoriesSitemap(distDir: string, categories: string[], funds: Fund[]): Promise<SitemapFile> {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapURL[] = [];

  // Add hub page
  urls.push({
    loc: `${PRODUCTION_BASE_URL}/categories`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8
  });

  // Filter to only indexable categories (have funds)
  const indexableCategories = categories.filter(category => {
    const result = checkCategoryIndexability(category, funds);
    return result.isIndexable;
  });

  const excludedCount = categories.length - indexableCategories.length;
  console.log(`📄 Categories: ${indexableCategories.length} indexable (${excludedCount} excluded)`);

  indexableCategories.forEach(category => {
    urls.push({
      loc: `${PRODUCTION_BASE_URL}/categories/${categoryToSlug(category)}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  writeSitemapXML(distDir, 'sitemap-categories.xml', urls);
  return { filename: 'sitemap-categories.xml', urlCount: urls.length, lastmod: currentDate };
}

/**
 * Generate tags sitemap with indexability filtering
 */
async function generateTagsSitemap(distDir: string, tags: string[], funds: Fund[]): Promise<SitemapFile> {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapURL[] = [];

  // Add hub page
  urls.push({
    loc: `${PRODUCTION_BASE_URL}/tags`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8
  });

  // Filter to only indexable tags (have funds)
  const indexableTags = tags.filter(tag => {
    const result = checkTagIndexability(tag, funds);
    return result.isIndexable;
  });

  const excludedCount = tags.length - indexableTags.length;
  console.log(`📄 Tags: ${indexableTags.length} indexable (${excludedCount} excluded)`);

  indexableTags.forEach(tag => {
    urls.push({
      loc: `${PRODUCTION_BASE_URL}/tags/${tagToSlug(tag)}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  writeSitemapXML(distDir, 'sitemap-tags.xml', urls);
  return { filename: 'sitemap-tags.xml', urlCount: urls.length, lastmod: currentDate };
}

/**
 * Generate managers sitemap with indexability filtering
 */
async function generateManagersSitemap(
  distDir: string, 
  managers: Array<{ name: string; fundsCount: number }>, 
  funds: Fund[]
): Promise<SitemapFile> {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapURL[] = [];

  // Add hub page
  urls.push({
    loc: `${PRODUCTION_BASE_URL}/managers`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.8
  });

  // Filter to only indexable managers (have funds)
  const indexableManagers = managers.filter(manager => {
    const result = checkManagerIndexability(manager.name, funds);
    return result.isIndexable;
  });

  const excludedCount = managers.length - indexableManagers.length;
  console.log(`📄 Managers: ${indexableManagers.length} indexable (${excludedCount} excluded)`);

  indexableManagers.forEach(manager => {
    urls.push({
      loc: `${PRODUCTION_BASE_URL}/manager/${managerToSlug(manager.name)}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  writeSitemapXML(distDir, 'sitemap-managers.xml', urls);
  return { filename: 'sitemap-managers.xml', urlCount: urls.length, lastmod: currentDate };
}

/**
 * Generate comparisons sitemap with indexability filtering
 */
async function generateComparisonsSitemap(distDir: string, funds: Fund[]): Promise<SitemapFile> {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapURL[] = [];

  // Add hub pages
  urls.push({
    loc: `${PRODUCTION_BASE_URL}/comparisons`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.7
  });

  urls.push({
    loc: `${PRODUCTION_BASE_URL}/compare`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: 0.6
  });

  // Generate all possible comparisons
  const allComparisons = generateComparisonsFromFunds(funds);

  // Filter to only indexable comparisons
  const indexableComparisons = allComparisons.filter(comparison => {
    const result = checkComparisonIndexability(comparison.fund1, comparison.fund2, comparison.slug);
    return result.isIndexable;
  });

  const excludedCount = allComparisons.length - indexableComparisons.length;
  console.log(`📄 Comparisons: ${indexableComparisons.length} indexable (${excludedCount} excluded)`);

  indexableComparisons.forEach(comparison => {
    urls.push({
      loc: `${PRODUCTION_BASE_URL}/compare/${comparison.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.85
    });
  });

  writeSitemapXML(distDir, 'sitemap-comparisons.xml', urls);
  return { filename: 'sitemap-comparisons.xml', urlCount: urls.length, lastmod: currentDate };
}

/**
 * Generate static pages sitemap
 */
async function generateStaticSitemap(distDir: string): Promise<SitemapFile> {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapURL[] = [];

  // Homepage
  urls.push({
    loc: PRODUCTION_BASE_URL,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: 1.0
  });

  // Static pages - only indexable content pages (exclude noindex pages like disclaimer, privacy, terms, cookie-policy)
  const staticPages = [
    { path: '/about', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/faqs', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/roi-calculator', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/alternatives', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/verification-program', priority: 0.5, changefreq: 'monthly' as const },
    { path: '/fund-matcher', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/verified-funds', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/contact', priority: 0.4, changefreq: 'monthly' as const },
    { path: '/best-portugal-golden-visa-funds', priority: 0.95, changefreq: 'weekly' as const },
    { path: '/funds/us-citizens', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/fees', priority: 0.9, changefreq: 'weekly' as const },
    // Fee-type landing pages
    { path: '/fees/management-fee', priority: 0.85, changefreq: 'weekly' as const },
    { path: '/fees/performance-fee', priority: 0.85, changefreq: 'weekly' as const },
    { path: '/fees/subscription-fee', priority: 0.85, changefreq: 'weekly' as const },
    { path: '/fees/redemption-fee', priority: 0.85, changefreq: 'weekly' as const },
    { path: '/fees/exit-fee', priority: 0.85, changefreq: 'weekly' as const },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${PRODUCTION_BASE_URL}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Add indexable team members
  const teamMembers = await fetchAllTeamMembersForBuild();
  const indexableTeamMembers = teamMembers.filter(member => {
    // Skip gone team members
    if (isGoneTeamMember(member.slug)) return false;
    
    const result = checkTeamMemberIndexability({
      name: member.name,
      role: member.role,
      bio: member.bio
    });
    return result.isIndexable;
  });

  console.log(`📄 Team members: ${indexableTeamMembers.length} indexable (${teamMembers.length - indexableTeamMembers.length} excluded)`);

  indexableTeamMembers.forEach(member => {
    urls.push({
      loc: `${PRODUCTION_BASE_URL}/team/${member.slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5
    });
  });

  writeSitemapXML(distDir, 'sitemap-static.xml', urls);
  return { filename: 'sitemap-static.xml', urlCount: urls.length, lastmod: currentDate };
}

/**
 * Generate sitemap index file
 */
function generateSitemapIndexFile(distDir: string, sitemaps: SitemapFile[]): void {
  const xml = `${XML_DECLARATION}
<sitemapindex xmlns="${SITEMAP_NAMESPACE}">
${sitemaps.map(s => `  <sitemap>
    <loc>${PRODUCTION_BASE_URL}/${s.filename}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), xml);
  console.log(`✅ Generated sitemap-index.xml referencing ${sitemaps.length} sitemaps`);
}

/**
 * Generate robots.txt referencing sitemap index
 */
function generateRobotsTxt(distDir: string): void {
  const currentDate = new Date().toISOString().split('T')[0];

  const robotsTxt = `# Robots.txt for ${PRODUCTION_BASE_URL}
# Generated on ${currentDate}

# Googlebot configuration
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /manager-auth
Disallow: /investor-auth
Disallow: /api/
Disallow: /account-settings
Disallow: /my-funds
Disallow: /manage-fund/
Disallow: /manage-profile/
Disallow: /confirm
Disallow: /confirm-email
Disallow: /reset-password
Disallow: /saved-funds
Crawl-delay: 1

# Bingbot configuration
User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /manager-auth
Disallow: /investor-auth
Disallow: /api/
Disallow: /account-settings
Disallow: /my-funds
Disallow: /manage-fund/
Disallow: /manage-profile/
Disallow: /confirm
Disallow: /confirm-email
Disallow: /reset-password
Disallow: /saved-funds
Crawl-delay: 2

# All other bots
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /manager-auth
Disallow: /investor-auth
Disallow: /api/
Disallow: /account-settings
Disallow: /my-funds
Disallow: /manage-fund/
Disallow: /manage-profile/
Disallow: /confirm
Disallow: /confirm-email
Disallow: /reset-password
Disallow: /saved-funds

# Sitemap index location (contains all sitemaps)
Sitemap: ${PRODUCTION_BASE_URL}/sitemap-index.xml
`;

  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt referencing sitemap-index.xml');
}

/**
 * Main entry point: Generate all sitemaps with sitemap index
 */
export async function generateSitemapIndex(distDir: string): Promise<{
  sitemapFiles: SitemapFile[];
  totalURLs: number;
}> {
  console.log('🗺️  Starting modular sitemap generation...');
  console.log('📊 Fetching data from database...');

  // Fetch all data from database (cached)
  const { funds, categories, tags, managers } = await fetchAllBuildDataCached();
  console.log(`✅ Loaded ${funds.length} funds, ${categories.length} categories, ${tags.length} tags, ${managers.length} managers`);

  const sitemapFiles: SitemapFile[] = [];

  // Generate type-specific sitemaps
  console.log('\n📝 Generating type-specific sitemaps with indexability filtering...');

  // 1. Funds sitemap
  const fundsResult = await generateFundsSitemap(distDir, funds);
  sitemapFiles.push(fundsResult);

  // 2. Categories sitemap
  const categoriesResult = await generateCategoriesSitemap(distDir, categories, funds);
  sitemapFiles.push(categoriesResult);

  // 3. Tags sitemap
  const tagsResult = await generateTagsSitemap(distDir, tags, funds);
  sitemapFiles.push(tagsResult);

  // 4. Managers sitemap
  const managersResult = await generateManagersSitemap(distDir, managers, funds);
  sitemapFiles.push(managersResult);

  // 5. Comparisons sitemap
  const comparisonsResult = await generateComparisonsSitemap(distDir, funds);
  sitemapFiles.push(comparisonsResult);

  // 6. Static pages sitemap
  const staticResult = await generateStaticSitemap(distDir);
  sitemapFiles.push(staticResult);

  // Generate sitemap index
  generateSitemapIndexFile(distDir, sitemapFiles);

  // Generate robots.txt
  generateRobotsTxt(distDir);

  const totalURLs = sitemapFiles.reduce((sum, f) => sum + f.urlCount, 0);

  console.log('\n📊 Sitemap generation summary:');
  sitemapFiles.forEach(f => {
    console.log(`   📄 ${f.filename}: ${f.urlCount} URLs`);
  });
  console.log(`   📊 Total: ${totalURLs} URLs across ${sitemapFiles.length} sitemaps`);

  return { sitemapFiles, totalURLs };
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const distDir = path.join(process.cwd(), 'dist');
  generateSitemapIndex(distDir).catch(console.error);
}
