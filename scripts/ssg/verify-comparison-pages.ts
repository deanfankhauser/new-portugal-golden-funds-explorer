import fs from 'fs';
import path from 'path';

interface ValidationResult {
  file: string;
  checks: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasCanonical: boolean;
    canonicalIsSelfReferencing: boolean;
    hasIndexableRobots: boolean;
    hasNoindexRobots: boolean;
    hasFAQSchema: boolean;
    hasBreadcrumbSchema: boolean;
    hasWebPageSchema: boolean;
    hasItemListSchema: boolean;
    fundSizeFormatCorrect: boolean;
    has404Content: boolean;
  };
  issues: string[];
  url?: string;
}

function extractCanonicalUrl(html: string): string | null {
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/);
  return canonicalMatch ? canonicalMatch[1] : null;
}

function extractMetaContent(html: string, name: string): string | null {
  const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractRobotsContent(html: string): string | null {
  return extractMetaContent(html, 'robots');
}

function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  return titleMatch ? titleMatch[1] : null;
}

function checkStructuredData(html: string, schemaType: string): boolean {
  const schemaRegex = new RegExp(`<script\\s+type=["']application/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>`, 'g');
  let match;
  
  while ((match = schemaRegex.exec(html)) !== null) {
    const jsonContent = match[1];
    try {
      const data = JSON.parse(jsonContent);
      if (data['@type'] === schemaType) {
        return true;
      }
      // Check in @graph array
      if (data['@graph'] && Array.isArray(data['@graph'])) {
        if (data['@graph'].some((item: any) => item['@type'] === schemaType)) {
          return true;
        }
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  return false;
}

function checkFundSizeFormatting(html: string): boolean {
  // Check for correct format: €70,000,000 (with thousand separators)
  // Should NOT have: "Not disclosed" for valid AUM values, or improper formatting
  const correctFormat = /€\d{1,3}(,\d{3})+/;
  const hasCorrectFormat = correctFormat.test(html);
  
  // Also check it doesn't show undefined or NaN
  const hasInvalidFormat = html.includes('€undefined') || html.includes('€NaN') || html.includes('€0');
  
  return hasCorrectFormat && !hasInvalidFormat;
}

function verifyComparisonPage(filePath: string, baseUrl: string): ValidationResult {
  const html = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(path.join(process.cwd(), 'dist'), filePath);
  const urlPath = relativePath.replace(/\\/g, '/').replace('/index.html', '');
  const expectedUrl = `${baseUrl}/${urlPath}`;
  
  const result: ValidationResult = {
    file: relativePath,
    url: expectedUrl,
    checks: {
      hasTitle: false,
      hasDescription: false,
      hasCanonical: false,
      canonicalIsSelfReferencing: false,
      hasIndexableRobots: false,
      hasNoindexRobots: false,
      hasFAQSchema: false,
      hasBreadcrumbSchema: false,
      hasWebPageSchema: false,
      hasItemListSchema: false,
      fundSizeFormatCorrect: false,
      has404Content: false,
    },
    issues: [],
  };
  
  // Check for 404 content
  if (html.includes('404 - Page Not Found') || html.includes('The page you\'re looking for doesn\'t exist')) {
    result.checks.has404Content = true;
    result.issues.push('❌ CRITICAL: Page contains 404 content');
  }
  
  // Check title
  const title = extractTitle(html);
  result.checks.hasTitle = !!title;
  if (!title) {
    result.issues.push('Missing <title> tag');
  } else if (!title.includes('vs')) {
    result.issues.push(`Title doesn't contain 'vs' for comparison: "${title}"`);
  }
  
  // Check meta description
  const description = extractMetaContent(html, 'description');
  result.checks.hasDescription = !!description;
  if (!description) {
    result.issues.push('Missing meta description');
  } else if (!description.includes('Compare')) {
    result.issues.push(`Description doesn't start with 'Compare': "${description}"`);
  }
  
  // Check canonical
  const canonical = extractCanonicalUrl(html);
  result.checks.hasCanonical = !!canonical;
  if (!canonical) {
    result.issues.push('Missing canonical tag');
  } else {
    // Normalize URLs for comparison (remove trailing slash)
    const normalizedCanonical = canonical.replace(/\/$/, '');
    const normalizedExpected = expectedUrl.replace(/\/$/, '');
    result.checks.canonicalIsSelfReferencing = normalizedCanonical === normalizedExpected;
    
    if (!result.checks.canonicalIsSelfReferencing) {
      result.issues.push(`Canonical mismatch: expected "${normalizedExpected}", got "${normalizedCanonical}"`);
    }
  }
  
  // Check robots
  const robots = extractRobotsContent(html);
  result.checks.hasIndexableRobots = robots === 'index, follow';
  result.checks.hasNoindexRobots = robots?.includes('noindex') || false;
  
  if (!result.checks.hasIndexableRobots) {
    result.issues.push(`Robots directive incorrect: "${robots}" (should be "index, follow")`);
  }
  
  if (result.checks.hasNoindexRobots) {
    result.issues.push('❌ CRITICAL: Page has noindex directive');
  }
  
  // Check structured data
  result.checks.hasFAQSchema = checkStructuredData(html, 'FAQPage');
  result.checks.hasBreadcrumbSchema = checkStructuredData(html, 'BreadcrumbList');
  result.checks.hasWebPageSchema = checkStructuredData(html, 'WebPage');
  result.checks.hasItemListSchema = checkStructuredData(html, 'ItemList');
  
  if (!result.checks.hasFAQSchema) {
    result.issues.push('Missing FAQPage structured data');
  }
  if (!result.checks.hasBreadcrumbSchema) {
    result.issues.push('Missing BreadcrumbList structured data');
  }
  if (!result.checks.hasWebPageSchema) {
    result.issues.push('Missing WebPage structured data');
  }
  if (!result.checks.hasItemListSchema) {
    result.issues.push('Missing ItemList structured data');
  }
  
  // Check fund size formatting
  result.checks.fundSizeFormatCorrect = checkFundSizeFormatting(html);
  if (!result.checks.fundSizeFormatCorrect) {
    result.issues.push('Fund size formatting may be incorrect (check for proper €XX,XXX,XXX format)');
  }
  
  return result;
}

async function verifyAllComparisonPages() {
  console.log('🔍 Starting comparison pages verification...\n');
  
  const distDir = path.join(process.cwd(), 'dist');
  const compareDir = path.join(distDir, 'compare');
  const baseUrl = 'https://funds.movingto.com';
  
  if (!fs.existsSync(compareDir)) {
    console.error('❌ Compare directory not found at:', compareDir);
    console.error('   Run `npm run build:ssg` first to generate static files.');
    process.exit(1);
  }
  
  // Find all comparison page HTML files
  const comparisonFiles: string[] = [];
  const subdirs = fs.readdirSync(compareDir);
  
  for (const subdir of subdirs) {
    const subdirPath = path.join(compareDir, subdir);
    if (fs.statSync(subdirPath).isDirectory()) {
      const indexPath = path.join(subdirPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        comparisonFiles.push(indexPath);
      }
    }
  }
  
  console.log(`📄 Found ${comparisonFiles.length} comparison pages to verify\n`);
  
  if (comparisonFiles.length === 0) {
    console.error('❌ No comparison pages found in dist/compare/');
    process.exit(1);
  }
  
  // Verify each page
  const results: ValidationResult[] = [];
  let passCount = 0;
  let failCount = 0;
  let criticalIssues = 0;
  
  for (const file of comparisonFiles) {
    const result = verifyComparisonPage(file, baseUrl);
    results.push(result);
    
    const hasCriticalIssues = result.checks.has404Content || result.checks.hasNoindexRobots || !result.checks.canonicalIsSelfReferencing;
    
    if (result.issues.length === 0) {
      passCount++;
      console.log(`✅ ${result.file}`);
    } else {
      failCount++;
      if (hasCriticalIssues) {
        criticalIssues++;
        console.log(`🔴 ${result.file}`);
      } else {
        console.log(`⚠️  ${result.file}`);
      }
      
      result.issues.forEach(issue => {
        console.log(`   ${issue}`);
      });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total pages checked: ${results.length}`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`⚠️  Failed (warnings): ${failCount - criticalIssues}`);
  console.log(`🔴 Failed (critical): ${criticalIssues}`);
  
  // Aggregate checks
  console.log('\n📋 AGGREGATE CHECKS:');
  const aggregates = {
    hasTitle: results.filter(r => r.checks.hasTitle).length,
    hasDescription: results.filter(r => r.checks.hasDescription).length,
    hasCanonical: results.filter(r => r.checks.hasCanonical).length,
    canonicalIsSelfReferencing: results.filter(r => r.checks.canonicalIsSelfReferencing).length,
    hasIndexableRobots: results.filter(r => r.checks.hasIndexableRobots).length,
    hasNoindexRobots: results.filter(r => r.checks.hasNoindexRobots).length,
    hasFAQSchema: results.filter(r => r.checks.hasFAQSchema).length,
    hasBreadcrumbSchema: results.filter(r => r.checks.hasBreadcrumbSchema).length,
    hasWebPageSchema: results.filter(r => r.checks.hasWebPageSchema).length,
    hasItemListSchema: results.filter(r => r.checks.hasItemListSchema).length,
    fundSizeFormatCorrect: results.filter(r => r.checks.fundSizeFormatCorrect).length,
    has404Content: results.filter(r => r.checks.has404Content).length,
  };
  
  console.log(`  Title tags:                    ${aggregates.hasTitle}/${results.length}`);
  console.log(`  Meta descriptions:             ${aggregates.hasDescription}/${results.length}`);
  console.log(`  Canonical tags:                ${aggregates.hasCanonical}/${results.length}`);
  console.log(`  Self-referencing canonicals:   ${aggregates.canonicalIsSelfReferencing}/${results.length}`);
  console.log(`  Indexable robots:              ${aggregates.hasIndexableRobots}/${results.length}`);
  console.log(`  FAQPage schema:                ${aggregates.hasFAQSchema}/${results.length}`);
  console.log(`  BreadcrumbList schema:         ${aggregates.hasBreadcrumbSchema}/${results.length}`);
  console.log(`  WebPage schema:                ${aggregates.hasWebPageSchema}/${results.length}`);
  console.log(`  ItemList schema:               ${aggregates.hasItemListSchema}/${results.length}`);
  console.log(`  Fund size formatting correct:  ${aggregates.fundSizeFormatCorrect}/${results.length}`);
  
  if (aggregates.hasNoindexRobots > 0) {
    console.log(`  ❌ Pages with noindex:          ${aggregates.hasNoindexRobots}/${results.length}`);
  }
  
  if (aggregates.has404Content > 0) {
    console.log(`  ❌ Pages with 404 content:      ${aggregates.has404Content}/${results.length}`);
  }
  
  console.log('\n' + '='.repeat(80));
  
  if (criticalIssues > 0) {
    console.error(`\n🔴 CRITICAL: ${criticalIssues} page(s) have critical issues (404 content, noindex, or wrong canonical)`);
    process.exit(1);
  }
  
  if (failCount > 0) {
    console.warn(`\n⚠️  ${failCount} page(s) have warnings (missing meta tags or structured data)`);
    process.exit(1);
  }
  
  console.log('\n✅ All comparison pages passed verification!');
  process.exit(0);
}

// Run verification
verifyAllComparisonPages().catch((error) => {
  console.error('❌ Verification failed with error:', error);
  process.exit(1);
});
