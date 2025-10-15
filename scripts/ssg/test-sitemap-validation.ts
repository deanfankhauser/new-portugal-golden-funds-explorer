import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../../src/ssg/routeDiscovery';
import { URL_CONFIG } from '../../src/utils/urlConfig';

interface ValidationResult {
  passed: boolean;
  testName: string;
  message: string;
  details?: string[];
}

/**
 * Comprehensive sitemap validation test suite
 */
export class SitemapValidator {
  private publicDir: string;
  private results: ValidationResult[] = [];

  constructor(publicDir = path.join(process.cwd(), 'public')) {
    this.publicDir = publicDir;
  }

  async runAllTests(): Promise<boolean> {
    console.log('🧪 Starting Sitemap Validation Tests...\n');

    await this.testSitemapExists();
    await this.testSitemapValidXML();
    await this.testSitemapURLFormat();
    await this.testSitemapCoverage();
    await this.testNoDuplicateURLs();
    await this.testValidDates();
    await this.testPriorityValues();
    await this.testChangefreqValues();
    await this.testRobotsTxt();

    this.printResults();
    return this.allTestsPassed();
  }

  private async testSitemapExists(): Promise<void> {
    const sitemapPath = path.join(this.publicDir, 'sitemap.xml');
    const exists = fs.existsSync(sitemapPath);

    this.results.push({
      passed: exists,
      testName: 'Sitemap File Exists',
      message: exists ? 'sitemap.xml found' : 'sitemap.xml not found'
    });
  }

  private async testSitemapValidXML(): Promise<void> {
    const sitemapPath = path.join(this.publicDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      this.results.push({
        passed: false,
        testName: 'Valid XML Format',
        message: 'Cannot validate - sitemap.xml not found'
      });
      return;
    }

    const content = fs.readFileSync(sitemapPath, 'utf8');
    
    // Check for required XML elements
    const hasXMLDeclaration = content.includes('<?xml version="1.0"');
    const hasUrlset = content.includes('<urlset') || content.includes('<sitemapindex');
    const hasProperClosing = content.includes('</urlset>') || content.includes('</sitemapindex>');
    const hasNamespace = content.includes('xmlns=');

    const issues: string[] = [];
    if (!hasXMLDeclaration) issues.push('Missing XML declaration');
    if (!hasUrlset) issues.push('Missing urlset/sitemapindex element');
    if (!hasProperClosing) issues.push('Missing closing tag');
    if (!hasNamespace) issues.push('Missing XML namespace');

    this.results.push({
      passed: issues.length === 0,
      testName: 'Valid XML Format',
      message: issues.length === 0 ? 'XML format is valid' : 'XML format issues found',
      details: issues
    });
  }

  private async testSitemapURLFormat(): Promise<void> {
    const urls = this.extractAllURLs();
    const invalidURLs: string[] = [];

    for (const url of urls) {
      try {
        new URL(url);
        if (!url.startsWith('https://')) {
          invalidURLs.push(`${url} - not HTTPS`);
        }
      } catch {
        invalidURLs.push(`${url} - invalid URL format`);
      }
    }

    this.results.push({
      passed: invalidURLs.length === 0,
      testName: 'URL Format Validation',
      message: invalidURLs.length === 0 
        ? `All ${urls.length} URLs are valid HTTPS URLs` 
        : `${invalidURLs.length} invalid URLs found`,
      details: invalidURLs.slice(0, 10) // Show first 10
    });
  }

  private async testSitemapCoverage(): Promise<void> {
    const routes = await getAllStaticRoutes();
    const sitemapURLs = new Set(this.extractAllURLs());
    
    const expectedURLs = routes.map(r => {
      return r.path === '/' ? URL_CONFIG.BASE_URL : `${URL_CONFIG.BASE_URL}${r.path}`;
    });

    const missing = expectedURLs.filter(url => !sitemapURLs.has(url));
    const coveragePercent = ((expectedURLs.length - missing.length) / expectedURLs.length * 100).toFixed(1);

    this.results.push({
      passed: missing.length === 0,
      testName: 'Route Coverage',
      message: missing.length === 0 
        ? `All ${expectedURLs.length} routes covered (100%)` 
        : `${missing.length} routes missing (${coveragePercent}% coverage)`,
      details: missing.slice(0, 10)
    });
  }

  private async testNoDuplicateURLs(): Promise<void> {
    const urls = this.extractAllURLs();
    const urlCounts = new Map<string, number>();
    
    urls.forEach(url => {
      urlCounts.set(url, (urlCounts.get(url) || 0) + 1);
    });

    const duplicates = Array.from(urlCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([url, count]) => `${url} (${count} times)`);

    this.results.push({
      passed: duplicates.length === 0,
      testName: 'No Duplicate URLs',
      message: duplicates.length === 0 
        ? `No duplicates found in ${urls.length} URLs` 
        : `${duplicates.length} duplicate URLs found`,
      details: duplicates
    });
  }

  private async testValidDates(): Promise<void> {
    const content = this.getSitemapContent();
    const dateMatches = content.matchAll(/<lastmod>(.*?)<\/lastmod>/g);
    const invalidDates: string[] = [];

    for (const match of dateMatches) {
      const dateStr = match[1];
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        invalidDates.push(dateStr);
      } else if (date > new Date()) {
        invalidDates.push(`${dateStr} - future date`);
      }
    }

    const totalDates = Array.from(content.matchAll(/<lastmod>/g)).length;

    this.results.push({
      passed: invalidDates.length === 0,
      testName: 'Valid Lastmod Dates',
      message: invalidDates.length === 0 
        ? `All ${totalDates} dates are valid` 
        : `${invalidDates.length} invalid dates found`,
      details: invalidDates.slice(0, 10)
    });
  }

  private async testPriorityValues(): Promise<void> {
    const content = this.getSitemapContent();
    const priorityMatches = content.matchAll(/<priority>(.*?)<\/priority>/g);
    const invalidPriorities: string[] = [];

    for (const match of priorityMatches) {
      const priority = parseFloat(match[1]);
      
      if (isNaN(priority) || priority < 0 || priority > 1) {
        invalidPriorities.push(match[1]);
      }
    }

    const totalPriorities = Array.from(content.matchAll(/<priority>/g)).length;

    this.results.push({
      passed: invalidPriorities.length === 0,
      testName: 'Valid Priority Values',
      message: invalidPriorities.length === 0 
        ? `All ${totalPriorities} priority values are valid (0-1)` 
        : `${invalidPriorities.length} invalid priority values found`,
      details: invalidPriorities.slice(0, 10)
    });
  }

  private async testChangefreqValues(): Promise<void> {
    const content = this.getSitemapContent();
    const changefreqMatches = content.matchAll(/<changefreq>(.*?)<\/changefreq>/g);
    const validValues = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    const invalidChangefreqs: string[] = [];

    for (const match of changefreqMatches) {
      const changefreq = match[1];
      
      if (!validValues.includes(changefreq)) {
        invalidChangefreqs.push(changefreq);
      }
    }

    const totalChangefreqs = Array.from(content.matchAll(/<changefreq>/g)).length;

    this.results.push({
      passed: invalidChangefreqs.length === 0,
      testName: 'Valid Changefreq Values',
      message: invalidChangefreqs.length === 0 
        ? `All ${totalChangefreqs} changefreq values are valid` 
        : `${invalidChangefreqs.length} invalid changefreq values found`,
      details: invalidChangefreqs.slice(0, 10)
    });
  }

  private async testRobotsTxt(): Promise<void> {
    const robotsPath = path.join(this.publicDir, 'robots.txt');
    const exists = fs.existsSync(robotsPath);

    if (!exists) {
      this.results.push({
        passed: false,
        testName: 'robots.txt Exists',
        message: 'robots.txt not found'
      });
      return;
    }

    const content = fs.readFileSync(robotsPath, 'utf8');
    const hasSitemapReference = content.includes('Sitemap:');
    const hasUserAgent = content.includes('User-agent:');

    const issues: string[] = [];
    if (!hasSitemapReference) issues.push('Missing Sitemap reference');
    if (!hasUserAgent) issues.push('Missing User-agent directive');

    this.results.push({
      passed: issues.length === 0,
      testName: 'robots.txt Configuration',
      message: issues.length === 0 ? 'robots.txt properly configured' : 'robots.txt issues found',
      details: issues
    });
  }

  private getSitemapContent(): string {
    const sitemapPath = path.join(this.publicDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) return '';

    let content = fs.readFileSync(sitemapPath, 'utf8');

    // If it's a sitemap index, read referenced sitemaps too
    if (content.includes('<sitemapindex')) {
      const sitemapFiles = this.extractSitemapFiles(content);
      for (const file of sitemapFiles) {
        const filePath = path.join(this.publicDir, file);
        if (fs.existsSync(filePath)) {
          content += '\n' + fs.readFileSync(filePath, 'utf8');
        }
      }
    }

    return content;
  }

  private extractAllURLs(): string[] {
    const content = this.getSitemapContent();
    const matches = content.matchAll(/<loc>(.*?)<\/loc>/g);
    return Array.from(matches).map(m => m[1].trim());
  }

  private extractSitemapFiles(content: string): string[] {
    const matches = content.matchAll(/<loc>(.*?)<\/loc>/g);
    return Array.from(matches)
      .map(m => m[1].trim())
      .map(url => url.split('/').pop()!)
      .filter(filename => filename.endsWith('.xml'));
  }

  private printResults(): void {
    console.log('\n📊 Validation Results:\n');

    let passed = 0;
    let failed = 0;

    for (const result of this.results) {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.testName}: ${result.message}`);
      
      if (result.details && result.details.length > 0) {
        result.details.forEach(detail => {
          console.log(`   • ${detail}`);
        });
      }

      result.passed ? passed++ : failed++;
    }

    console.log(`\n📈 Summary: ${passed}/${this.results.length} tests passed`);
    
    if (failed > 0) {
      console.log(`\n⚠️  ${failed} test(s) failed`);
    } else {
      console.log('\n🎉 All validation tests passed!');
    }
  }

  private allTestsPassed(): boolean {
    return this.results.every(r => r.passed);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetDir = process.argv[2] 
    ? path.resolve(process.argv[2]) 
    : path.join(process.cwd(), 'public');
  
  const validator = new SitemapValidator(targetDir);
  validator.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { SitemapValidator };
