/**
 * Sitemap Accessibility Validator
 * 
 * Validates that all sitemap URLs are accessible with correct HTTP status and content-type.
 * Run after deployment to ensure sitemaps are not blocked by WAF or misconfigured.
 */

interface ValidationResult {
  url: string;
  status: number | null;
  contentType: string | null;
  robotsTag: string | null;
  accessible: boolean;
  error?: string;
}

interface ValidationSummary {
  totalChecked: number;
  passed: number;
  failed: number;
  results: ValidationResult[];
}

const SITEMAP_FILES = [
  'sitemap-index.xml',
  'sitemap-funds.xml',
  'sitemap-categories.xml',
  'sitemap-tags.xml',
  'sitemap-managers.xml',
  'sitemap-comparisons.xml',
  'sitemap-static.xml',
  'robots.txt'
];

const EXPECTED_CONTENT_TYPES = {
  xml: ['application/xml', 'text/xml', 'application/xml; charset=utf-8', 'text/xml; charset=utf-8'],
  txt: ['text/plain', 'text/plain; charset=utf-8']
};

/**
 * Validate a single URL for accessibility and correct headers
 */
async function validateUrl(url: string): Promise<ValidationResult> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'
      }
    });

    const contentType = response.headers.get('content-type');
    const robotsTag = response.headers.get('x-robots-tag');
    const isXml = url.endsWith('.xml');
    const expectedTypes = isXml ? EXPECTED_CONTENT_TYPES.xml : EXPECTED_CONTENT_TYPES.txt;
    
    // Check content type matches expected
    const contentTypeValid = contentType ? 
      expectedTypes.some(t => contentType.toLowerCase().includes(t.split(';')[0])) : 
      false;
    
    // Check robots tag doesn't block
    const robotsBlocking = robotsTag?.toLowerCase().includes('noindex');

    const accessible = response.status === 200 && contentTypeValid && !robotsBlocking;

    return {
      url,
      status: response.status,
      contentType,
      robotsTag,
      accessible,
      error: !accessible ? 
        `Status: ${response.status}, Content-Type: ${contentType || 'missing'}, X-Robots-Tag: ${robotsTag || 'none'}` : 
        undefined
    };
  } catch (error) {
    return {
      url,
      status: null,
      contentType: null,
      robotsTag: null,
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate all sitemap files for a given base URL
 */
export async function validateSitemapAccessibility(baseUrl: string): Promise<ValidationSummary> {
  console.log(`🔍 Validating sitemap accessibility for ${baseUrl}...`);
  
  const results: ValidationResult[] = [];
  
  for (const file of SITEMAP_FILES) {
    const url = `${baseUrl}/${file}`;
    console.log(`   Checking ${file}...`);
    const result = await validateUrl(url);
    results.push(result);
    
    if (result.accessible) {
      console.log(`   ✅ ${file}: OK (${result.status}, ${result.contentType})`);
    } else {
      console.log(`   ❌ ${file}: FAILED - ${result.error}`);
    }
  }

  const passed = results.filter(r => r.accessible).length;
  const failed = results.filter(r => !r.accessible).length;

  console.log(`\n📊 Validation Summary:`);
  console.log(`   Total: ${results.length}`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);

  return {
    totalChecked: results.length,
    passed,
    failed,
    results
  };
}

/**
 * Run validation with exit code for CI/CD integration
 */
export async function runValidation(baseUrl: string): Promise<boolean> {
  const summary = await validateSitemapAccessibility(baseUrl);
  
  if (summary.failed > 0) {
    console.error('\n❌ Sitemap accessibility validation FAILED');
    console.error('Failed URLs:');
    summary.results
      .filter(r => !r.accessible)
      .forEach(r => console.error(`   - ${r.url}: ${r.error}`));
    return false;
  }
  
  console.log('\n✅ All sitemap files are accessible with correct headers');
  return true;
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const baseUrl = process.argv[2] || 'https://funds.movingto.com';
  
  runValidation(baseUrl).then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Validation error:', error);
    process.exit(1);
  });
}
