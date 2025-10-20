import fs from 'fs';
import path from 'path';
import { getAllTags } from '../../src/data/services/tags-service';
import { getAllCategories } from '../../src/data/services/categories-service';
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
export function generateRedirectRules() {
  console.log('🔀 Generating redirect rules...');
  
  // Get all tags and convert to slugs
  const allTags = getAllTags();
  const tagSlugs = allTags.map(tag => tagToSlug(tag));
  
  // Get all categories dynamically and convert to slugs
  const categories = getAllCategories();
  const categorySlugs = categories.map(cat => categoryToSlug(cat));
  
  // Check for overlaps between tags and categories (informational only)
  const tagSlugSet = new Set(tagSlugs);
  const overlaps = categorySlugs.filter(slug => tagSlugSet.has(slug));
  
  if (overlaps.length > 0) {
    console.log('📌 Note: These slugs exist as both tags AND categories:');
    overlaps.forEach(slug => console.log(`   - ${slug}`));
    console.log('   (Both will work correctly with different URL paths: /tags/ vs /categories/)');
  }
  
  console.log(`📋 Found ${tagSlugs.length} tag slugs`);
  console.log(`📋 Found ${categorySlugs.length} category slugs`);
  
  // Generate chunked redirects
  const tagRedirects = createChunkedRedirects(tagSlugs, '/tags/:slug');
  const categoryRedirects = createChunkedRedirects(categorySlugs, '/categories/:slug');
  
  const tagChunkCount = Math.ceil(tagSlugs.length / 25);
  const categoryChunkCount = Math.ceil(categorySlugs.length / 25);
  
  console.log(`📦 Generated ${tagChunkCount} tag redirect chunks (${tagRedirects.length} rules)`);
  console.log(`📦 Generated ${categoryChunkCount} category redirect chunks (${categoryRedirects.length} rules)`);
  
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
    stats: {
      tagCount: tagSlugs.length,
      categoryCount: categorySlugs.length,
      tagChunks: tagChunkCount,
      categoryChunks: categoryChunkCount,
      legacyCount: legacyRedirects.length
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
    // Remove all other redirects (old tag/category rules)
    return false;
  });
  
  // IMPORTANT: Order matters! More specific rules must come first
  config.redirects = [
    ...filteredRedirects,      // Domain redirects, /funds redirects (kept)
    ...legacyRedirects,        // /:num(\d+)-return (most specific)
    ...categoryRedirects,      // /:slug(private-equity|...) (medium specificity)
    ...tagRedirects            // /:slug(solar|wind|...) (least specific, fallback)
  ];
  
  fs.writeFileSync(vercelConfigPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Updated vercel.json with dynamic redirects');
  console.log(`   - ${stats.tagCount} tag slugs (${stats.tagChunks} chunks, ${tagRedirects.length} rules)`);
  console.log(`   - ${stats.categoryCount} category slugs (${stats.categoryChunks} chunks, ${categoryRedirects.length} rules)`);
  console.log(`   - ${stats.legacyCount} legacy patterns`);
  console.log(`   - Total redirect rules: ${config.redirects.length}`);
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  updateVercelConfig();
}
