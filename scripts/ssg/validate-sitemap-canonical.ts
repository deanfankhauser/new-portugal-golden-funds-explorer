import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);

interface ValidationResult {
  url: string;
  canonicalUrl?: string;
  status: 'valid' | 'invalid' | 'missing';
  message?: string;
}

/**
 * Validates that all URLs in sitemap.xml have self-referencing canonical tags
 * Fails the build if non-canonical pages are found in sitemap
 */
export async function validateSitemapCanonical(distDir: string): Promise<void> {
  console.log('\n🔍 Validating sitemap canonical tags...');
  console.log('─'.repeat(60));

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ sitemap.xml not found at:', sitemapPath);
    throw new Error('Sitemap validation failed: sitemap.xml missing');
  }

  // Parse sitemap XML
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
  const parsed = await parseXml(sitemapXml);
  
  const urls = parsed.urlset?.url?.map((entry: any) => entry.loc[0]) || [];
  console.log(`📊 Found ${urls.length} URLs in sitemap`);

  const results: ValidationResult[] = [];
  let invalidCount = 0;
  let missingHtmlCount = 0;

  for (const url of urls) {
    // Convert URL to file path
    const urlPath = new URL(url).pathname;
    let htmlPath: string;
    
    if (urlPath === '/' || urlPath === '') {
      htmlPath = path.join(distDir, 'index.html');
    } else {
      // Remove leading slash and append /index.html
      const cleanPath = urlPath.replace(/^\//, '');
      htmlPath = path.join(distDir, cleanPath, 'index.html');
      
      // Fallback: try without /index.html (some routes might have .html directly)
      if (!fs.existsSync(htmlPath)) {
        htmlPath = path.join(distDir, `${cleanPath}.html`);
      }
    }

    if (!fs.existsSync(htmlPath)) {
      results.push({
        url,
        status: 'missing',
        message: `HTML file not found: ${htmlPath}`
      });
      missingHtmlCount++;
      continue;
    }

    // Read HTML and extract canonical tag
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/);
    
    if (!canonicalMatch) {
      results.push({
        url,
        status: 'invalid',
        message: 'No canonical tag found'
      });
      invalidCount++;
      continue;
    }

    const canonicalUrl = canonicalMatch[1];
    
    // Normalize URLs for comparison (remove trailing slash)
    const normalizedSitemapUrl = url.replace(/\/$/, '');
    const normalizedCanonicalUrl = canonicalUrl.replace(/\/$/, '');

    if (normalizedSitemapUrl !== normalizedCanonicalUrl) {
      results.push({
        url,
        canonicalUrl,
        status: 'invalid',
        message: `Non-self-referencing canonical (points to: ${canonicalUrl})`
      });
      invalidCount++;
    } else {
      results.push({
        url,
        canonicalUrl,
        status: 'valid'
      });
    }
  }

  // Report results
  const validCount = results.filter(r => r.status === 'valid').length;
  
  console.log(`\n📊 Validation Results:`);
  console.log(`   ✅ Valid (self-referencing): ${validCount}`);
  console.log(`   ❌ Invalid (non-self-referencing): ${invalidCount}`);
  console.log(`   ⚠️  Missing HTML files: ${missingHtmlCount}`);

  // Log first 10 invalid entries for debugging
  const invalidEntries = results.filter(r => r.status === 'invalid');
  if (invalidEntries.length > 0) {
    console.log(`\n❌ Non-canonical pages found in sitemap (showing first 10):`);
    invalidEntries.slice(0, 10).forEach(entry => {
      console.log(`   Sitemap URL: ${entry.url}`);
      console.log(`   Canonical:   ${entry.canonicalUrl || 'N/A'}`);
      console.log(`   Issue:       ${entry.message}`);
      console.log('');
    });
    
    if (invalidEntries.length > 10) {
      console.log(`   ... and ${invalidEntries.length - 10} more`);
    }
  }

  const missingEntries = results.filter(r => r.status === 'missing');
  if (missingEntries.length > 0) {
    console.log(`\n⚠️  URLs in sitemap with missing HTML (showing first 5):`);
    missingEntries.slice(0, 5).forEach(entry => {
      console.log(`   ${entry.url}`);
    });
    
    if (missingEntries.length > 5) {
      console.log(`   ... and ${missingEntries.length - 5} more`);
    }
  }

  // Fail build if invalid canonicals found
  if (invalidCount > 0) {
    console.error(`\n❌ VALIDATION FAILED: ${invalidCount} non-canonical pages found in sitemap`);
    console.error('   Sitemaps must only contain pages with self-referencing canonical tags');
    throw new Error(`Sitemap validation failed: ${invalidCount} non-canonical pages found`);
  }

  console.log(`\n✅ Sitemap canonical validation passed: All ${validCount} URLs have self-referencing canonicals`);
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const distDir = path.join(process.cwd(), 'dist');
  validateSitemapCanonical(distDir).catch(error => {
    console.error('Validation error:', error.message);
    process.exit(1);
  });
}
