import { SEOAuditService } from './seoAuditService';
import { EnhancedSEOValidationService } from './enhancedSEOValidationService';
import { PerformanceMonitoringService } from './performanceMonitoringService';
import { CoreWebVitalsService } from './coreWebVitalsService';

export interface SEOIssue {
  id: string;
  type: 'critical' | 'error' | 'warning' | 'info';
  category: 'meta' | 'content' | 'performance' | 'technical' | 'links' | 'images' | 'mobile' | 'security' | 'structure';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  howToFix: string;
  affectedElements?: string[];
  url?: string;
}

export interface SEOAnalysisReport {
  score: number;
  timestamp: Date;
  url: string;
  issues: SEOIssue[];
  stats: {
    critical: number;
    errors: number;
    warnings: number;
    info: number;
  };
  categories: {
    meta: number;
    content: number;
    performance: number;
    technical: number;
    links: number;
    images: number;
    mobile: number;
    security: number;
    structure: number;
  };
  performance: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
  };
  recommendations: string[];
}

export class ComprehensiveSEOAnalysisService {
  private static issues: SEOIssue[] = [];

  static async performFullAnalysis(): Promise<SEOAnalysisReport> {
    this.issues = [];
    const startTime = Date.now();

    console.log('🔍 Starting comprehensive SEO analysis...');

    // Run all analysis modules
    await Promise.all([
      this.analyzeMetaTags(),
      this.analyzeContent(),
      this.analyzeImages(),
      this.analyzeLinks(),
      this.analyzeTechnical(),
      this.analyzeSecurity(),
      this.analyzeStructuredData(),
      this.analyzeMobile(),
      this.analyzePerformance(),
    ]);

    // Calculate score
    const score = this.calculateOverallScore();

    // Generate stats
    const stats = {
      critical: this.issues.filter(i => i.type === 'critical').length,
      errors: this.issues.filter(i => i.type === 'error').length,
      warnings: this.issues.filter(i => i.type === 'warning').length,
      info: this.issues.filter(i => i.type === 'info').length,
    };

    const categories = {
      meta: this.issues.filter(i => i.category === 'meta').length,
      content: this.issues.filter(i => i.category === 'content').length,
      performance: this.issues.filter(i => i.category === 'performance').length,
      technical: this.issues.filter(i => i.category === 'technical').length,
      links: this.issues.filter(i => i.category === 'links').length,
      images: this.issues.filter(i => i.category === 'images').length,
      mobile: this.issues.filter(i => i.category === 'mobile').length,
      security: this.issues.filter(i => i.category === 'security').length,
      structure: this.issues.filter(i => i.category === 'structure').length,
    };

    // Get performance metrics
    const perfMetrics = PerformanceMonitoringService.getMetrics();

    const report: SEOAnalysisReport = {
      score,
      timestamp: new Date(),
      url: window.location.href,
      issues: this.issues,
      stats,
      categories,
      performance: {
        lcp: perfMetrics.LCP,
        fid: perfMetrics.FID,
        cls: perfMetrics.CLS,
        fcp: perfMetrics.FCP,
        ttfb: perfMetrics.TTFB,
      },
      recommendations: this.generateRecommendations(),
    };

    const duration = Date.now() - startTime;
    console.log(`✅ SEO analysis completed in ${duration}ms`);
    console.log(`📊 Score: ${score}/100`);
    console.log(`🚨 Issues found: ${this.issues.length}`);

    return report;
  }

  private static async analyzeMetaTags(): Promise<void> {
    const title = document.querySelector('title');
    const metaDesc = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const viewport = document.querySelector('meta[name="viewport"]');

    // Title checks
    if (!title || !title.textContent) {
      this.addIssue({
        id: 'missing-title',
        type: 'critical',
        category: 'meta',
        title: 'Missing Title Tag',
        description: 'The page does not have a title tag',
        impact: 'high',
        howToFix: 'Add a unique, descriptive title tag (50-60 characters) that includes your primary keyword',
      });
    } else {
      const titleLength = title.textContent.length;
      if (titleLength < 30) {
        this.addIssue({
          id: 'title-too-short',
          type: 'warning',
          category: 'meta',
          title: 'Title Tag Too Short',
          description: `Title is only ${titleLength} characters`,
          impact: 'medium',
          howToFix: 'Expand your title to 50-60 characters for better SEO',
        });
      } else if (titleLength > 60) {
        this.addIssue({
          id: 'title-too-long',
          type: 'warning',
          category: 'meta',
          title: 'Title Tag Too Long',
          description: `Title is ${titleLength} characters (may be truncated in search results)`,
          impact: 'medium',
          howToFix: 'Shorten your title to 50-60 characters',
        });
      }
    }

    // Meta description checks
    if (!metaDesc || !metaDesc.getAttribute('content')) {
      this.addIssue({
        id: 'missing-meta-description',
        type: 'error',
        category: 'meta',
        title: 'Missing Meta Description',
        description: 'The page does not have a meta description',
        impact: 'high',
        howToFix: 'Add a compelling meta description (150-160 characters) that summarizes the page content',
      });
    } else {
      const descLength = metaDesc.getAttribute('content')?.length || 0;
      if (descLength < 120) {
        this.addIssue({
          id: 'meta-description-too-short',
          type: 'warning',
          category: 'meta',
          title: 'Meta Description Too Short',
          description: `Meta description is only ${descLength} characters`,
          impact: 'medium',
          howToFix: 'Expand your meta description to 150-160 characters',
        });
      } else if (descLength > 160) {
        this.addIssue({
          id: 'meta-description-too-long',
          type: 'warning',
          category: 'meta',
          title: 'Meta Description Too Long',
          description: `Meta description is ${descLength} characters`,
          impact: 'medium',
          howToFix: 'Shorten your meta description to 150-160 characters',
        });
      }
    }

    // Canonical check
    if (!canonical) {
      this.addIssue({
        id: 'missing-canonical',
        type: 'warning',
        category: 'technical',
        title: 'Missing Canonical URL',
        description: 'The page does not have a canonical URL',
        impact: 'medium',
        howToFix: 'Add a canonical URL to prevent duplicate content issues',
      });
    }

    // Viewport check
    if (!viewport) {
      this.addIssue({
        id: 'missing-viewport',
        type: 'error',
        category: 'mobile',
        title: 'Missing Viewport Meta Tag',
        description: 'The page is not mobile-optimized',
        impact: 'high',
        howToFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      });
    }

    // Check for duplicate meta tags
    const duplicates = EnhancedSEOValidationService['detectDuplicateMetaTags']();
    if (duplicates.length > 0) {
      this.addIssue({
        id: 'duplicate-meta-tags',
        type: 'error',
        category: 'technical',
        title: 'Duplicate Meta Tags',
        description: `Found duplicate meta tags: ${duplicates.join(', ')}`,
        impact: 'medium',
        howToFix: 'Remove duplicate meta tags from the page',
        affectedElements: duplicates,
      });
    }

    // Open Graph checks
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    const missingOgTags = ogTags.filter(tag => !document.querySelector(`meta[property="${tag}"]`));
    if (missingOgTags.length > 0) {
      this.addIssue({
        id: 'missing-og-tags',
        type: 'warning',
        category: 'meta',
        title: 'Missing Open Graph Tags',
        description: `Missing: ${missingOgTags.join(', ')}`,
        impact: 'medium',
        howToFix: 'Add Open Graph tags for better social media sharing',
        affectedElements: missingOgTags,
      });
    }
  }

  private static async analyzeContent(): Promise<void> {
    // H1 checks
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      this.addIssue({
        id: 'missing-h1',
        type: 'critical',
        category: 'content',
        title: 'Missing H1 Tag',
        description: 'The page does not have an H1 heading',
        impact: 'high',
        howToFix: 'Add a single, descriptive H1 tag that includes your primary keyword',
      });
    } else if (h1Tags.length > 1) {
      this.addIssue({
        id: 'multiple-h1',
        type: 'warning',
        category: 'content',
        title: 'Multiple H1 Tags',
        description: `Found ${h1Tags.length} H1 tags (should be only 1)`,
        impact: 'medium',
        howToFix: 'Use only one H1 tag per page, use H2-H6 for subheadings',
        affectedElements: Array.from(h1Tags).map(h => h.textContent || ''),
      });
    }

    // Heading hierarchy
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    let hierarchyIssues = false;
    
    allHeadings.forEach((heading) => {
      const level = parseInt(heading.tagName[1]);
      if (level > previousLevel + 1 && previousLevel !== 0) {
        hierarchyIssues = true;
      }
      previousLevel = level;
    });

    if (hierarchyIssues) {
      this.addIssue({
        id: 'heading-hierarchy',
        type: 'warning',
        category: 'structure',
        title: 'Improper Heading Hierarchy',
        description: 'Heading levels are not properly structured (e.g., H1 → H3 skipping H2)',
        impact: 'low',
        howToFix: 'Ensure headings follow proper hierarchy: H1 → H2 → H3, etc.',
      });
    }

    // Content length
    const mainContent = document.querySelector('main')?.textContent || document.body.textContent || '';
    const wordCount = mainContent.split(/\s+/).filter(w => w.length > 0).length;
    
    if (wordCount < 300) {
      this.addIssue({
        id: 'thin-content',
        type: 'warning',
        category: 'content',
        title: 'Thin Content',
        description: `Page has only ${wordCount} words`,
        impact: 'medium',
        howToFix: 'Add more valuable, unique content (aim for 300+ words minimum)',
      });
    }

    // Check for internal links
    const internalLinks = Array.from(document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]'));
    if (internalLinks.length < 3) {
      this.addIssue({
        id: 'few-internal-links',
        type: 'info',
        category: 'links',
        title: 'Limited Internal Linking',
        description: `Only ${internalLinks.length} internal links found`,
        impact: 'low',
        howToFix: 'Add more contextual internal links to improve site structure and user navigation',
      });
    }
  }

  private static async analyzeImages(): Promise<void> {
    const images = document.querySelectorAll('img');
    const missingAlt: string[] = [];
    const nonOptimized: string[] = [];

    images.forEach((img) => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src') || '';
      
      if (!alt || alt.trim() === '') {
        missingAlt.push(src);
      }

      // Check if image is optimized (has data-optimized attribute or modern format)
      const isOptimized = img.hasAttribute('data-optimized') || 
                         src.includes('.webp') || 
                         src.includes('.avif');
      
      if (!isOptimized && !src.startsWith('data:')) {
        nonOptimized.push(src);
      }

      // Check image dimensions
      if (img.naturalWidth && !img.hasAttribute('width')) {
        // Image loaded but no width/height attributes
      }
    });

    if (missingAlt.length > 0) {
      this.addIssue({
        id: 'missing-alt-text',
        type: 'error',
        category: 'images',
        title: 'Images Missing Alt Text',
        description: `${missingAlt.length} images are missing alt text`,
        impact: 'high',
        howToFix: 'Add descriptive alt text to all images for accessibility and SEO',
        affectedElements: missingAlt.slice(0, 10),
      });
    }

    if (nonOptimized.length > 0) {
      this.addIssue({
        id: 'unoptimized-images',
        type: 'warning',
        category: 'performance',
        title: 'Unoptimized Images',
        description: `${nonOptimized.length} images are not optimized`,
        impact: 'medium',
        howToFix: 'Convert images to WebP or AVIF format and use responsive images',
        affectedElements: nonOptimized.slice(0, 10),
      });
    }
  }

  private static async analyzeLinks(): Promise<void> {
    const allLinks = document.querySelectorAll('a');
    const brokenLinks: string[] = [];
    const noFollow: string[] = [];
    const externalNoOpener: string[] = [];

    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === '') {
        brokenLinks.push(link.textContent || 'Empty link');
      }

      if (link.hasAttribute('rel') && link.getAttribute('rel')?.includes('nofollow')) {
        noFollow.push(href || '');
      }

      // External links without rel="noopener noreferrer"
      if (href?.startsWith('http') && !href.includes(window.location.hostname)) {
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
          externalNoOpener.push(href);
        }
      }
    });

    if (brokenLinks.length > 0) {
      this.addIssue({
        id: 'empty-links',
        type: 'error',
        category: 'links',
        title: 'Empty or Broken Links',
        description: `Found ${brokenLinks.length} empty or placeholder links`,
        impact: 'medium',
        howToFix: 'Remove or fix empty links and ensure all links have valid destinations',
        affectedElements: brokenLinks.slice(0, 10),
      });
    }

    if (externalNoOpener.length > 0) {
      this.addIssue({
        id: 'external-links-security',
        type: 'warning',
        category: 'security',
        title: 'External Links Missing Security Attributes',
        description: `${externalNoOpener.length} external links missing rel="noopener noreferrer"`,
        impact: 'low',
        howToFix: 'Add rel="noopener noreferrer" to external links for security',
        affectedElements: externalNoOpener.slice(0, 10),
      });
    }
  }

  private static async analyzeTechnical(): Promise<void> {
    // Check for structured data
    const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
    if (jsonLd.length === 0) {
      this.addIssue({
        id: 'missing-structured-data',
        type: 'warning',
        category: 'technical',
        title: 'Missing Structured Data',
        description: 'No JSON-LD structured data found',
        impact: 'medium',
        howToFix: 'Add schema.org structured data to help search engines understand your content',
      });
    } else {
      // Validate JSON-LD
      jsonLd.forEach((script, index) => {
        try {
          JSON.parse(script.textContent || '');
        } catch {
          this.addIssue({
            id: `invalid-structured-data-${index}`,
            type: 'error',
            category: 'technical',
            title: 'Invalid Structured Data',
            description: `JSON-LD block ${index + 1} contains invalid JSON`,
            impact: 'medium',
            howToFix: 'Fix the JSON syntax in your structured data',
          });
        }
      });
    }

    // Check for preload directives
    const preloads = document.querySelectorAll('link[rel="preload"]');
    const hasInvalidPreloads = Array.from(preloads).some(link => !link.getAttribute('href'));
    
    if (hasInvalidPreloads) {
      this.addIssue({
        id: 'invalid-preload',
        type: 'error',
        category: 'performance',
        title: 'Invalid Preload Directives',
        description: 'Found preload links without href attribute',
        impact: 'low',
        howToFix: 'Remove or fix invalid preload directives',
      });
    }

    // Check robots meta tag
    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta?.getAttribute('content')?.includes('noindex')) {
      this.addIssue({
        id: 'noindex-meta',
        type: 'critical',
        category: 'technical',
        title: 'Page Set to NOINDEX',
        description: 'This page will not be indexed by search engines',
        impact: 'high',
        howToFix: 'Remove the noindex directive if you want this page indexed',
      });
    }
  }

  private static async analyzeSecurity(): Promise<void> {
    // HTTPS check
    if (window.location.protocol !== 'https:') {
      this.addIssue({
        id: 'not-https',
        type: 'critical',
        category: 'security',
        title: 'Not Using HTTPS',
        description: 'The page is not served over HTTPS',
        impact: 'high',
        howToFix: 'Enable HTTPS for your entire site',
      });
    }

    // Mixed content check
    const images = Array.from(document.querySelectorAll('img[src^="http:"]'));
    const scripts = Array.from(document.querySelectorAll('script[src^="http:"]'));
    const stylesheets = Array.from(document.querySelectorAll('link[href^="http:"]'));
    
    const mixedContent = [...images, ...scripts, ...stylesheets].length;
    if (mixedContent > 0) {
      this.addIssue({
        id: 'mixed-content',
        type: 'error',
        category: 'security',
        title: 'Mixed Content Issues',
        description: `Found ${mixedContent} HTTP resources on HTTPS page`,
        impact: 'high',
        howToFix: 'Update all resources to use HTTPS',
      });
    }
  }

  private static async analyzeStructuredData(): Promise<void> {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent || '');
        
        // Check for required properties based on @type
        if (data['@type']) {
          const type = data['@type'];
          const missingProps: string[] = [];
          
          if (type === 'Organization' || type === 'LocalBusiness') {
            if (!data.name) missingProps.push('name');
            if (!data.url) missingProps.push('url');
          }
          
          if (type === 'Article' || type === 'BlogPosting') {
            if (!data.headline) missingProps.push('headline');
            if (!data.author) missingProps.push('author');
            if (!data.datePublished) missingProps.push('datePublished');
          }
          
          if (missingProps.length > 0) {
            this.addIssue({
              id: `incomplete-structured-data-${index}`,
              type: 'warning',
              category: 'structure',
              title: 'Incomplete Structured Data',
              description: `${type} schema missing: ${missingProps.join(', ')}`,
              impact: 'low',
              howToFix: 'Add missing required properties to your structured data',
              affectedElements: missingProps,
            });
          }
        }
      } catch (e) {
        // Already handled in analyzeTechnical
      }
    });
  }

  private static async analyzeMobile(): Promise<void> {
    // Check viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      return; // Already reported in analyzeMetaTags
    }

    // Check for touch-friendly elements
    const smallClickTargets = Array.from(document.querySelectorAll('button, a')).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    });

    if (smallClickTargets.length > 0) {
      this.addIssue({
        id: 'small-tap-targets',
        type: 'warning',
        category: 'mobile',
        title: 'Small Touch Targets',
        description: `${smallClickTargets.length} elements are smaller than 44x44px`,
        impact: 'medium',
        howToFix: 'Ensure all interactive elements are at least 44x44px for touch-friendly design',
      });
    }

    // Check text size
    const smallText = Array.from(document.querySelectorAll('p, span, li')).filter(el => {
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
      return fontSize < 16;
    });

    if (smallText.length > 10) {
      this.addIssue({
        id: 'small-font-size',
        type: 'warning',
        category: 'mobile',
        title: 'Small Font Sizes',
        description: `${smallText.length} elements have font size below 16px`,
        impact: 'low',
        howToFix: 'Use at least 16px font size for body text on mobile',
      });
    }
  }

  private static async analyzePerformance(): Promise<void> {
    const metrics = PerformanceMonitoringService.getMetrics();

    // LCP check
    if (metrics.LCP && metrics.LCP > 2500) {
      this.addIssue({
        id: 'slow-lcp',
        type: metrics.LCP > 4000 ? 'error' : 'warning',
        category: 'performance',
        title: 'Slow Largest Contentful Paint',
        description: `LCP is ${(metrics.LCP / 1000).toFixed(2)}s (should be < 2.5s)`,
        impact: 'high',
        howToFix: 'Optimize images, reduce render-blocking resources, improve server response time',
      });
    }

    // FID check
    if (metrics.FID && metrics.FID > 100) {
      this.addIssue({
        id: 'slow-fid',
        type: metrics.FID > 300 ? 'error' : 'warning',
        category: 'performance',
        title: 'Slow First Input Delay',
        description: `FID is ${metrics.FID}ms (should be < 100ms)`,
        impact: 'high',
        howToFix: 'Reduce JavaScript execution time, split code, defer non-critical scripts',
      });
    }

    // CLS check
    if (metrics.CLS && metrics.CLS > 0.1) {
      this.addIssue({
        id: 'high-cls',
        type: metrics.CLS > 0.25 ? 'error' : 'warning',
        category: 'performance',
        title: 'High Cumulative Layout Shift',
        description: `CLS is ${metrics.CLS.toFixed(3)} (should be < 0.1)`,
        impact: 'high',
        howToFix: 'Add size attributes to images/videos, avoid inserting content above existing content',
      });
    }

    // Check for lazy loading
    const images = document.querySelectorAll('img');
    const lazyImages = Array.from(images).filter(img => img.hasAttribute('loading'));
    
    if (images.length > 5 && lazyImages.length === 0) {
      this.addIssue({
        id: 'missing-lazy-loading',
        type: 'info',
        category: 'performance',
        title: 'Images Not Lazy Loaded',
        description: 'Consider lazy loading images below the fold',
        impact: 'low',
        howToFix: 'Add loading="lazy" attribute to images that are not immediately visible',
      });
    }
  }

  private static addIssue(issue: SEOIssue): void {
    this.issues.push(issue);
  }

  private static calculateOverallScore(): number {
    if (this.issues.length === 0) return 100;

    let penalties = 0;
    this.issues.forEach(issue => {
      switch (issue.type) {
        case 'critical':
          penalties += 15;
          break;
        case 'error':
          penalties += 10;
          break;
        case 'warning':
          penalties += 5;
          break;
        case 'info':
          penalties += 1;
          break;
      }
    });

    return Math.max(0, 100 - penalties);
  }

  private static generateRecommendations(): string[] {
    const recs: string[] = [];
    const criticalIssues = this.issues.filter(i => i.type === 'critical');
    const highImpactIssues = this.issues.filter(i => i.impact === 'high');

    if (criticalIssues.length > 0) {
      recs.push(`Fix ${criticalIssues.length} critical issues immediately - these are blocking your SEO`);
    }

    if (highImpactIssues.length > 0) {
      recs.push(`Address ${highImpactIssues.length} high-impact issues to significantly improve SEO`);
    }

    const perfIssues = this.issues.filter(i => i.category === 'performance');
    if (perfIssues.length > 0) {
      recs.push('Improve page speed - performance is a ranking factor');
    }

    const mobileIssues = this.issues.filter(i => i.category === 'mobile');
    if (mobileIssues.length > 0) {
      recs.push('Optimize for mobile - mobile-first indexing is now standard');
    }

    const contentIssues = this.issues.filter(i => i.category === 'content');
    if (contentIssues.length > 0) {
      recs.push('Enhance content quality and structure for better rankings');
    }

    return recs;
  }

  static exportReport(report: SEOAnalysisReport): string {
    return JSON.stringify(report, null, 2);
  }

  static generateTextReport(report: SEOAnalysisReport): string {
    let text = `SEO Analysis Report\n`;
    text += `===================\n\n`;
    text += `URL: ${report.url}\n`;
    text += `Date: ${report.timestamp.toLocaleString()}\n`;
    text += `Score: ${report.score}/100\n\n`;
    
    text += `Summary\n`;
    text += `-------\n`;
    text += `Critical Issues: ${report.stats.critical}\n`;
    text += `Errors: ${report.stats.errors}\n`;
    text += `Warnings: ${report.stats.warnings}\n`;
    text += `Info: ${report.stats.info}\n\n`;

    if (report.recommendations.length > 0) {
      text += `Top Recommendations\n`;
      text += `------------------\n`;
      report.recommendations.forEach((rec, i) => {
        text += `${i + 1}. ${rec}\n`;
      });
      text += `\n`;
    }

    text += `Issues by Category\n`;
    text += `-----------------\n`;
    Object.entries(report.categories).forEach(([cat, count]) => {
      if (count > 0) {
        text += `${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${count}\n`;
      }
    });
    text += `\n`;

    text += `Detailed Issues\n`;
    text += `--------------\n\n`;
    
    ['critical', 'error', 'warning', 'info'].forEach(type => {
      const issuesOfType = report.issues.filter(i => i.type === type);
      if (issuesOfType.length > 0) {
        text += `${type.toUpperCase()} (${issuesOfType.length})\n`;
        text += `${'='.repeat(type.length + 10)}\n\n`;
        
        issuesOfType.forEach(issue => {
          text += `[${issue.category}] ${issue.title}\n`;
          text += `Description: ${issue.description}\n`;
          text += `Impact: ${issue.impact}\n`;
          text += `How to fix: ${issue.howToFix}\n`;
          if (issue.affectedElements && issue.affectedElements.length > 0) {
            text += `Affected: ${issue.affectedElements.slice(0, 3).join(', ')}`;
            if (issue.affectedElements.length > 3) {
              text += ` (+${issue.affectedElements.length - 3} more)`;
            }
            text += `\n`;
          }
          text += `\n`;
        });
      }
    });

    return text;
  }
}
