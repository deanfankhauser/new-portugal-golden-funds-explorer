import fs from 'fs';
import path from 'path';
import { fetchAllTagsForBuild, fetchAllCategoriesForBuild } from '../../src/lib/build-data-fetcher';
import { tagToSlug, categoryToSlug } from '../../src/lib/utils';

/**
 * Create chunked redirects to avoid Vercel regex complexity limits
 * Generates pairs of redirects (with and without trailing slash) for each chunk
 */
function createChunkedRedirects(slugs: string[], destination: string) {
  const CHUNK_SIZE = 25;
  const chunks: any[] = [];
  
  for (let i = 0; i < slugs.length; i += CHUNK_SIZE) {
    const chunk = slugs.slice(i, i + CHUNK_SIZE);
    const pattern = chunk.join('|');
    
    // Without trailing slash
    chunks.push({
      source: `/:slug(${pattern})`,
      destination: destination, // destination is /tags/:slug or /categories/:slug (no trailing slash)
      permanent: true
    });
    
    // With trailing slash - redirect to same destination (no trailing slash)
    chunks.push({
      source: `/:slug(${pattern})/`,
      destination: destination,
      permanent: true
    });
  }
  
  return chunks;
}

/**
 * Generate dynamic redirect rules for vercel.json
 * This ensures all tag and category slugs are properly redirected
 */
export async function generateRedirectRules() {
  console.log('🔀 Generating redirect rules...');
  
  // Get all tags and convert to slugs (using build-time data fetcher)
  const allTags = await fetchAllTagsForBuild();
  const tagSlugs = allTags.map(tag => tagToSlug(tag));
  
  // Get all categories dynamically and convert to slugs (using build-time data fetcher)
  const categories = await fetchAllCategoriesForBuild();
  const categorySlugs = categories.map(cat => categoryToSlug(cat));
  
  // Check for overlaps between tags and categories
  // Categories take precedence - we generate redirects from /tags/{slug} to /categories/{slug}
  const tagSlugSet = new Set(tagSlugs);
  const categorySlugSet = new Set(categorySlugs);
  const overlaps = categorySlugs.filter(slug => tagSlugSet.has(slug));
  
  // Auto-generate tag→category redirects for overlapping slugs
  const tagToCategoryRedirects: any[] = [];
  if (overlaps.length > 0) {
    console.log('🔄 Generating tag→category redirects for overlapping slugs:');
    overlaps.forEach(slug => {
      console.log(`   /tags/${slug} → /categories/${slug}`);
      tagToCategoryRedirects.push({
        source: `/tags/${slug}`,
        destination: `/categories/${slug}`,
        permanent: true
      });
      tagToCategoryRedirects.push({
        source: `/tags/${slug}/`,
        destination: `/categories/${slug}`,
        permanent: true
      });
    });
  }
  
  // Filter out overlapping slugs from tagSlugs (categories take precedence)
  const uniqueTagSlugs = tagSlugs.filter(slug => !categorySlugSet.has(slug));
  
  console.log(`📋 Found ${tagSlugs.length} tag slugs (${uniqueTagSlugs.length} unique, ${overlaps.length} overlap with categories)`);
  console.log(`📋 Found ${categorySlugs.length} category slugs`);
  
  // Generate chunked redirects (using unique tag slugs to avoid duplicates)
  const tagRedirects = createChunkedRedirects(uniqueTagSlugs, '/tags/:slug');
  const categoryRedirects = createChunkedRedirects(categorySlugs, '/categories/:slug');
  
  const tagChunkCount = Math.ceil(uniqueTagSlugs.length / 25);
  const categoryChunkCount = Math.ceil(categorySlugs.length / 25);
  
  console.log(`📦 Generated ${tagChunkCount} tag redirect chunks (${tagRedirects.length} rules)`);
  console.log(`📦 Generated ${categoryChunkCount} category redirect chunks (${categoryRedirects.length} rules)`);
  console.log(`📦 Generated ${tagToCategoryRedirects.length} tag→category overlap redirects`);
  
  // Legacy alias patterns (more specific, should match first)
  const legacyRedirects = [
    // Percent return patterns - FIXED: Only 2 backslashes in JS string → 1 backslash in JSON
    { source: '/:num(\\d+)-return', destination: '/tags/:num-percent-return', permanent: true },
    { source: '/:num(\\d+)-annual-yield', destination: '/tags/:num-percent-yield', permanent: true },
    { source: '/:num(\\d+)-dividend', destination: '/tags/:num-percent-dividend', permanent: true },
    
    // Known legacy names
    { source: '/small-cap-50m', destination: '/tags/small-cap-less-than-50m', permanent: true },
    { source: '/mid-cap', destination: '/tags/mid-cap-50-100m', permanent: true },
    { source: '/large-cap', destination: '/tags/large-cap-100m-plus', permanent: true },
  ];
  
  return {
    tagRedirects,
    categoryRedirects,
    legacyRedirects,
    tagToCategoryRedirects,
    stats: {
      tagCount: tagSlugs.length,
      uniqueTagCount: uniqueTagSlugs.length,
      categoryCount: categorySlugs.length,
      overlapCount: overlaps.length,
      tagChunks: tagChunkCount,
      categoryChunks: categoryChunkCount,
      legacyCount: legacyRedirects.length,
      tagToCategoryCount: tagToCategoryRedirects.length
    }
  };
}

/**
 * Update vercel.json with generated redirects
 */
export async function updateVercelConfig() {
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    console.error('❌ vercel.json not found');
    return;
  }
  
  const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
  const { tagRedirects, categoryRedirects, legacyRedirects, tagToCategoryRedirects, stats } = await generateRedirectRules();
  
  // Remove old individual tag/category redirects
  const existingRedirects = config.redirects || [];
  const filteredRedirects = existingRedirects.filter((redirect: any) => {
    // Keep domain redirects and /funds redirects
    if (redirect.has || redirect.source === '/funds' || redirect.source === '/funds/') {
      return true;
    }
    // Remove all other redirects (old tag/category rules)
    return false;
  });
  
  // IMPORTANT: Order matters! More specific rules must come first
  // Tag→category redirects are explicit /tags/X → /categories/X (most specific)
  config.redirects = [
    ...filteredRedirects,         // Domain redirects, /funds redirects (kept)
    ...tagToCategoryRedirects,    // /tags/private-equity → /categories/private-equity (most specific)
    ...legacyRedirects,           // /:num(\d+)-return (specific patterns)
    ...categoryRedirects,         // /:slug(private-equity|...) (medium specificity)
    ...tagRedirects               // /:slug(solar|wind|...) (least specific, fallback)
  ];
  
  fs.writeFileSync(vercelConfigPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Updated vercel.json with dynamic redirects');
  console.log(`   - ${stats.uniqueTagCount} unique tag slugs (${stats.tagChunks} chunks, ${tagRedirects.length} rules)`);
  console.log(`   - ${stats.categoryCount} category slugs (${stats.categoryChunks} chunks, ${categoryRedirects.length} rules)`);
  console.log(`   - ${stats.overlapCount} tag→category overlap redirects`);
  console.log(`   - ${stats.legacyCount} legacy patterns`);
  console.log(`   - Total redirect rules: ${config.redirects.length}`);
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  await updateVercelConfig();
}
