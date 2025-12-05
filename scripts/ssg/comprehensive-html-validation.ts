import fs from 'fs';
import path from 'path';

interface HTMLValidationResult {
  filePath: string;
  route: string;
  pageType: string;
  checks: {
    hasH1: boolean;
    hasMetaDescription: boolean;
    hasTitle: boolean;
    hasCanonical: boolean;
    hasStructuredData: boolean;
    contentLength: number;
    meetsMinLength: boolean;
  };
  errors: string[];
  warnings: string[];
}

interface ValidationSummary {
  totalPages: number;
  passed: number;
  failed: number;
  warnings: number;
  results: HTMLValidationResult[];
  errorsByType: Record<string, number>;
}

const MIN_CONTENT_LENGTH = 1000; // Minimum HTML content length
const CRITICAL_PAGE_MIN_LENGTH = 5000; // Higher threshold for fund/manager pages

/**
 * Recursively find all index.html files in dist directory
 */
function findAllHTMLFiles(dir: string, baseDir: string): string[] {
  const files: string[] = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip assets directory
      if (entry.name === 'assets') continue;
      
      files.push(...findAllHTMLFiles(fullPath, baseDir));
    } else if (entry.name === 'index.html') {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Determine page type from route path
 */
function getPageTypeFromRoute(route: string): string {
  if (route === '/') return 'homepage';
  if (route.startsWith('/team/')) return 'team-member';
  if (route.startsWith('/manager/')) return 'manager';
  if (route.startsWith('/categories/')) return 'category';
  if (route.startsWith('/tags/')) return 'tag';
  if (route.startsWith('/compare/')) return 'fund-comparison';
  if (route === '/about') return 'about';
  if (route === '/faqs') return 'faqs';
  if (route === '/privacy') return 'privacy';
  if (route === '/disclaimer') return 'disclaimer';
  if (route === '/verified-funds') return 'verified-funds';
  if (route === '/verification-program') return 'verification-program';
  
  // If it's not a known route and has segments, it's likely a fund page
  if (route.split('/').filter(Boolean).length === 1) return 'fund';
  
  return 'other';
}

/**
 * Validate a single HTML file
 */
function validateHTMLFile(filePath: string, distDir: string): HTMLValidationResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const route = '/' + path.relative(distDir, path.dirname(filePath)).replace(/\\/g, '/');
  const pageType = getPageTypeFromRoute(route);
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for H1 tag
  const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(content);
  if (!hasH1) {
    errors.push('Missing H1 tag');
  }
  
  // Check for meta description
  const hasMetaDescription = /<meta\s+name=["']description["']/i.test(content);
  if (!hasMetaDescription) {
    errors.push('Missing meta description');
  }
  
  // Check for title tag
  const hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(content);
  if (!hasTitle) {
    errors.push('Missing title tag');
  }
  
  // Check for canonical tag
  const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(content);
  if (!hasCanonical) {
    warnings.push('Missing canonical tag');
  }
  
  // Check for structured data
  const hasStructuredData = /<script[^>]*type=["']application\/ld\+json["']/i.test(content);
  if (!hasStructuredData) {
    warnings.push('Missing structured data (JSON-LD)');
  }
  
  // Check for FAQPage schema on pages that should have it
  const faqRequiredPageTypes = ['fund', 'category', 'tag', 'manager', 'faqs', 'comparison', 'fund-comparison'];
  if (faqRequiredPageTypes.includes(pageType)) {
    const hasFAQSchema = content.includes('"@type":"FAQPage"') || 
                          content.includes('"@type": "FAQPage"') ||
                          content.includes('\\"@type\\":\\"FAQPage\\"');
    if (!hasFAQSchema) {
      warnings.push(`Missing FAQPage schema on ${pageType} page`);
    }
    
    // For fund pages, validate minimum FAQ count (should have at least 5 FAQs after enhancement)
    if (pageType === 'fund' && hasFAQSchema) {
      const faqMatches = content.match(/"@type"\s*:\s*"Question"/g) || 
                         content.match(/"@type":"Question"/g) || [];
      const faqCount = faqMatches.length;
      if (faqCount < 5) {
        warnings.push(`Fund page has only ${faqCount} FAQs in schema (minimum 5 recommended)`);
      }
    }
  }
  
  // Check for InvestmentFund schema on fund pages (critical for rich results)
  if (pageType === 'fund') {
    const hasInvestmentFundSchema = content.includes('"@type":"InvestmentFund"') || 
                                     content.includes('"@type": "InvestmentFund"') ||
                                     content.includes('\\"@type\\":\\"InvestmentFund\\"');
    if (!hasInvestmentFundSchema) {
      errors.push('Missing InvestmentFund schema on fund page');
    }
  }
  
  // Check content length
  const contentLength = content.length;
  const minLength = ['fund', 'manager', 'team-member'].includes(pageType) 
    ? CRITICAL_PAGE_MIN_LENGTH 
    : MIN_CONTENT_LENGTH;
  const meetsMinLength = contentLength >= minLength;
  
  if (!meetsMinLength) {
    if (['fund', 'manager', 'team-member'].includes(pageType)) {
      errors.push(`Content too short: ${contentLength} chars (min: ${minLength})`);
    } else {
      warnings.push(`Content below recommended length: ${contentLength} chars (recommended: ${minLength})`);
    }
  }
  
  return {
    filePath,
    route,
    pageType,
    checks: {
      hasH1,
      hasMetaDescription,
      hasTitle,
      hasCanonical,
      hasStructuredData,
      contentLength,
      meetsMinLength
    },
    errors,
    warnings
  };
}

/**
 * Run comprehensive HTML validation on all generated pages
 */
export function runComprehensiveHTMLValidation(distDir: string): ValidationSummary {
  console.log('\n🔍 Running comprehensive HTML validation...\n');
  
  const htmlFiles = findAllHTMLFiles(distDir, distDir);
  console.log(`📄 Found ${htmlFiles.length} HTML files to validate`);
  
  const results: HTMLValidationResult[] = [];
  const errorsByType: Record<string, number> = {};
  
  let passed = 0;
  let failed = 0;
  let totalWarnings = 0;
  
  for (const filePath of htmlFiles) {
    const result = validateHTMLFile(filePath, distDir);
    results.push(result);
    
    if (result.errors.length > 0) {
      failed++;
      console.log(`   ❌ ${result.route}`);
      result.errors.forEach(err => {
        console.log(`      • ${err}`);
        errorsByType[err] = (errorsByType[err] || 0) + 1;
      });
    } else {
      passed++;
      if (process.env.SSG_DEBUG === '1') {
        console.log(`   ✅ ${result.route} (${result.checks.contentLength} chars)`);
      }
    }
    
    if (result.warnings.length > 0) {
      totalWarnings += result.warnings.length;
      if (process.env.SSG_DEBUG === '1') {
        result.warnings.forEach(warn => console.log(`      ⚠️  ${warn}`));
      }
    }
  }
  
  const summary: ValidationSummary = {
    totalPages: htmlFiles.length,
    passed,
    failed,
    warnings: totalWarnings,
    results,
    errorsByType
  };
  
  // Print summary
  console.log('\n📊 HTML Validation Summary:');
  console.log(`   Total pages: ${summary.totalPages}`);
  console.log(`   ✅ Passed: ${summary.passed}`);
  console.log(`   ❌ Failed: ${summary.failed}`);
  console.log(`   ⚠️  Warnings: ${summary.warnings}`);
  
  if (Object.keys(errorsByType).length > 0) {
    console.log('\n📋 Errors by type:');
    Object.entries(errorsByType)
      .sort((a, b) => b[1] - a[1])
      .forEach(([error, count]) => {
        console.log(`   • ${error}: ${count} pages`);
      });
  }
  
  // Group results by page type for additional insights
  const byPageType: Record<string, number> = {};
  results.forEach(r => {
    byPageType[r.pageType] = (byPageType[r.pageType] || 0) + 1;
  });
  
  console.log('\n📑 Pages by type:');
  Object.entries(byPageType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const typeResults = results.filter(r => r.pageType === type);
      const typeFailed = typeResults.filter(r => r.errors.length > 0).length;
      const status = typeFailed > 0 ? '❌' : '✅';
      console.log(`   ${status} ${type}: ${count} pages (${typeFailed} failed)`);
    });
  
  // Write detailed report to file
  const reportPath = path.join(distDir, 'html-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`\n📝 Detailed report: ${reportPath}`);
  
  return summary;
}
