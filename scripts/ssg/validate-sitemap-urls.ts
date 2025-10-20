import fs from 'fs';
import path from 'path';
import { getAllTags } from '../../src/data/services/tags-service';
import { getAllCategories } from '../../src/data/services/categories-service';
import { tagToSlug, categoryToSlug } from '../../src/lib/utils';

interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  url?: string;
}

export function validateSitemapURLs(distDir: string): { valid: boolean; issues: ValidationIssue[] } {
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  const issues: ValidationIssue[] = [];
  
  if (!fs.existsSync(sitemapPath)) {
    issues.push({
      type: 'error',
      message: 'sitemap.xml not found in dist directory'
    });
    return { valid: false, issues };
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  
  // Extract all URLs from sitemap
  const urlMatches = sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g);
  const urls = Array.from(urlMatches).map(match => match[1]);
  
  console.log(`\n🔍 Validating ${urls.length} URLs in sitemap...\n`);
  
  // Get all valid tag and category slugs
  const tags = getAllTags();
  const tagSlugs = tags.map(tag => tagToSlug(tag));
  const categories = getAllCategories();
  const categorySlugs = categories.map(cat => categoryToSlug(cat));
  
  // Check for incorrect bare slug URLs
  const baseUrl = 'https://funds.movingto.com';
  
  urls.forEach(url => {
    const path = url.replace(baseUrl, '');
    
    // Check for duplicate /index
    if (path === '/index') {
      issues.push({
        type: 'error',
        message: 'Duplicate /index entry found (should only have homepage /)',
        url
      });
    }
    
    // Check for bare tag slugs (should be /tags/{slug})
    const bareSlug = path.substring(1); // remove leading /
    if (tagSlugs.includes(bareSlug) && !path.startsWith('/tags/')) {
      issues.push({
        type: 'error',
        message: `Tag URL missing /tags/ prefix: should be /tags/${bareSlug}`,
        url
      });
    }
    
    // Check for bare category slugs (should be /categories/{slug})
    if (categorySlugs.includes(bareSlug) && !path.startsWith('/categories/')) {
      issues.push({
        type: 'error',
        message: `Category URL missing /categories/ prefix: should be /categories/${bareSlug}`,
        url
      });
    }
  });
  
  // Check for missing essential URLs
  const essentialPaths = [
    '/',
    '/categories',
    '/tags',
    '/managers',
    '/about',
    '/faqs'
  ];
  
  essentialPaths.forEach(essentialPath => {
    const fullUrl = `${baseUrl}${essentialPath === '/' ? '' : essentialPath}`;
    if (!urls.includes(fullUrl)) {
      issues.push({
        type: 'warning',
        message: `Essential URL missing: ${essentialPath}`,
        url: fullUrl
      });
    }
  });
  
  // Report results
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  
  if (errors.length > 0) {
    console.error('❌ Sitemap validation FAILED:\n');
    errors.forEach(issue => {
      console.error(`   ❌ ${issue.message}`);
      if (issue.url) console.error(`      URL: ${issue.url}`);
    });
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Sitemap validation warnings:\n');
    warnings.forEach(issue => {
      console.warn(`   ⚠️  ${issue.message}`);
      if (issue.url) console.warn(`      URL: ${issue.url}`);
    });
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Sitemap validation passed - all URLs are correctly formatted\n');
  }
  
  return {
    valid: errors.length === 0,
    issues
  };
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const distDir = path.join(process.cwd(), 'dist');
  const result = validateSitemapURLs(distDir);
  
  if (!result.valid) {
    console.error('\n💥 Sitemap validation failed. Build should not proceed.\n');
    process.exit(1);
  }
  
  console.log('🎉 Sitemap validation complete!\n');
}
