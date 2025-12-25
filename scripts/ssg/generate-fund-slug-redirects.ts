import { getSupabaseBuildClient } from '../../src/lib/supabase-build';
import fs from 'fs';
import path from 'path';

/**
 * Generate a slug from fund name (matches the legacy slug format)
 */
function fundNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate 301 redirects from legacy fund slugs to current /fundId routes
 * This ensures old URLs indexed by search engines redirect properly
 */
export async function generateFundSlugRedirects() {
  console.log('🔀 Generating legacy fund slug redirects...');
  
  try {
    const supabase = getSupabaseBuildClient();
    
    // Fetch all funds
    const { data: funds, error } = await supabase
      .from('funds')
      .select('id, name')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching funds for redirect generation:', error);
      throw error;
    }
    
    if (!funds || funds.length === 0) {
      console.warn('⚠️  No funds found for redirect generation');
      return [];
    }
    
    // Generate redirect rules
    const redirects = funds.map(fund => {
      const slug = fundNameToSlug(fund.name);
      return {
        source: `/${slug}`,
        destination: `/${fund.id}`,
        permanent: true
      };
    });
    
    console.log(`✅ Generated ${redirects.length} fund slug redirects`);
    
    return redirects;
    
  } catch (error) {
    console.error('❌ Failed to generate fund slug redirects:', error);
    throw error;
  }
}

/**
 * Merge generated redirects with existing vercel.json configuration
 */
export async function updateVercelConfigWithRedirects() {
  console.log('📝 Updating vercel.json with fund redirects...');
  
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  
  // Read existing vercel.json
  let vercelConfig: any;
  try {
    const content = fs.readFileSync(vercelConfigPath, 'utf-8');
    vercelConfig = JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to read vercel.json:', error);
    throw error;
  }
  
  // Generate fund redirects
  const fundRedirects = await generateFundSlugRedirects();
  
  // Prepend fund redirects to existing redirects (order matters - specific before generic)
  vercelConfig.redirects = [
    ...fundRedirects,
    ...(vercelConfig.redirects || [])
  ];
  
  // Write updated config
  fs.writeFileSync(
    vercelConfigPath,
    JSON.stringify(vercelConfig, null, 2) + '\n'
  );
  
  console.log(`✅ Updated vercel.json with ${fundRedirects.length} fund redirects`);
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  updateVercelConfigWithRedirects().catch(error => {
    console.error('💥 Fatal error generating redirects:', error);
    process.exit(1);
  });
}
