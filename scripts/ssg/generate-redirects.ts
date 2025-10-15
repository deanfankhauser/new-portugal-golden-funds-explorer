import fs from 'fs';
import path from 'path';
import { getAllTags } from '../../src/data/services/tags-service';
import { tagToSlug, categoryToSlug } from '../../src/lib/utils';
import type { FundCategory } from '../../src/data/types/funds';

/**
 * Generate dynamic redirect rules for vercel.json
 * This ensures all tag and category slugs are properly redirected
 */
export function generateRedirectRules() {
  console.log('🔀 Generating redirect rules...');
  
  // Get all tags and convert to slugs
  const allTags = getAllTags();
  const tagSlugs = allTags.map(tag => tagToSlug(tag));
  
  // Get all categories and convert to slugs
  const categories: FundCategory[] = [
    'Private Equity',
    'Venture Capital', 
    'Real Estate',
    'Private Debt',
    'Hedge Funds',
    'Infrastructure',
    'Natural Resources'
  ];
  const categorySlugs = categories.map(cat => categoryToSlug(cat));
  
  // Build regex alternations
  const tagSlugRegex = tagSlugs.join('|');
  const categorySlugRegex = categorySlugs.join('|');
  
  console.log(`📋 Found ${tagSlugs.length} tag slugs`);
  console.log(`📋 Found ${categorySlugs.length} category slugs`);
  
  // Build redirect rules
  const tagRedirects = [
    {
      source: `/:slug(${tagSlugRegex})`,
      destination: '/tags/:slug',
      permanent: true
    },
    {
      source: `/:slug(${tagSlugRegex})/`,
      destination: '/tags/:slug',
      permanent: true
    }
  ];
  
  const categoryRedirects = [
    {
      source: `/:slug(${categorySlugRegex})`,
      destination: '/categories/:slug',
      permanent: true
    },
    {
      source: `/:slug(${categorySlugRegex})/`,
      destination: '/categories/:slug',
      permanent: true
    }
  ];
  
  // Legacy alias patterns
  const legacyRedirects = [
    // Percent return patterns
    { source: '/:num(\\\\\\\\d+)-return', destination: '/tags/:num-percent-return', permanent: true },
    { source: '/:num(\\\\\\\\d+)-annual-yield', destination: '/tags/:num-percent-yield', permanent: true },
    { source: '/:num(\\\\\\\\d+)-dividend', destination: '/tags/:num-percent-dividend', permanent: true },
    
    // Known legacy names
    { source: '/small-cap-50m', destination: '/tags/small-cap-less-than-50m', permanent: true },
    { source: '/mid-cap', destination: '/tags/mid-cap-50-100m', permanent: true },
    { source: '/large-cap', destination: '/tags/large-cap-100m-plus', permanent: true },
  ];
  
  return {
    tagRedirects,
    categoryRedirects,
    legacyRedirects,
    stats: {
      tagSlugs: tagSlugs.length,
      categorySlugs: categorySlugs.length,
      legacyRules: legacyRedirects.length
    }
  };
}

/**
 * Update vercel.json with generated redirects
 */
export function updateVercelConfig() {
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    console.error('❌ vercel.json not found');
    return;
  }
  
  const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
  const { tagRedirects, categoryRedirects, legacyRedirects, stats } = generateRedirectRules();
  
  // Remove old individual tag/category redirects
  const existingRedirects = config.redirects || [];
  const filteredRedirects = existingRedirects.filter((redirect: any) => {
    // Keep domain redirects and /funds redirects
    if (redirect.has || redirect.source === '/funds' || redirect.source === '/funds/') {
      return true;
    }
    // Remove old individual tag redirects
    return false;
  });
  
  // Add new dynamic redirects at the end (after domain redirects)
  config.redirects = [
    ...filteredRedirects,
    ...legacyRedirects,
    ...tagRedirects,
    ...categoryRedirects
  ];
  
  fs.writeFileSync(vercelConfigPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Updated vercel.json with dynamic redirects');
  console.log(`   - ${stats.tagSlugs} tag slugs covered`);
  console.log(`   - ${stats.categorySlugs} category slugs covered`);
  console.log(`   - ${stats.legacyRules} legacy patterns added`);
  console.log(`   - Total redirect rules: ${config.redirects.length}`);
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  updateVercelConfig();
}
