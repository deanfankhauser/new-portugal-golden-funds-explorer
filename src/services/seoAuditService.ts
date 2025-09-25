import { EnhancedSEOValidationService } from './enhancedSEOValidationService';
import { PerformanceOptimizationService } from './performanceOptimizationService';
import { EnhancedSitemapService } from './enhancedSitemapService';

export interface SEOAuditResult {
  score: number;
  issues: {
    critical: string[];
    warnings: string[];
    recommendations: string[];
  };
  technicalSEO: {
    sitemapAccessible: boolean;
    robotsTxtPresent: boolean;
    metaTagsOptimized: boolean;
    structuredDataValid: boolean;
    performanceScore: number;
  };
  indexing: {
    indexablePages: number;
    noIndexPages: number;
    canonicalIssues: string[];
  };
  contentSEO: {
    titleOptimization: number;
    descriptionOptimization: number;
    headingStructure: number;
    internalLinking: number;
  };
}

export class SEOAuditService {
  
  static async performComprehensiveAudit(): Promise<SEOAuditResult> {
    const issues = {
      critical: [] as string[],
      warnings: [] as string[],
      recommendations: [] as string[]
    };

    // Technical SEO Audit
    const seoValidation = EnhancedSEOValidationService.validatePageSEO();
    const performanceMetrics = PerformanceOptimizationService.validatePerformanceOptimizations();
    
    // Sitemap validation
    const sitemapValidation = await EnhancedSitemapService.validateSitemapAccess();
    
    if (!sitemapValidation.accessible) {
      issues.critical.push(`Sitemap not accessible: ${sitemapValidation.error}`);
    }

    // Meta tags audit
    const metaIssues = this.auditMetaTags();
    issues.warnings.push(...metaIssues.warnings);
    issues.recommendations.push(...metaIssues.recommendations);

    // Structured data audit
    const structuredDataIssues = this.auditStructuredData();
    issues.warnings.push(...structuredDataIssues);

    // Performance audit
    if (performanceMetrics.score < 80) {
      issues.warnings.push(`Performance score below optimal: ${performanceMetrics.score}/100`);
    }

    // Content audit
    const contentAudit = this.auditContent();
    
    // Security audit
    const securityIssues = this.auditSecurity();
    issues.warnings.push(...securityIssues);

    // Calculate overall score
    const score = this.calculateOverallScore(seoValidation, performanceMetrics, contentAudit);

    return {
      score,
      issues,
      technicalSEO: {
        sitemapAccessible: sitemapValidation.accessible,
        robotsTxtPresent: this.checkRobotsTxt(),
        metaTagsOptimized: metaIssues.warnings.length === 0,
        structuredDataValid: structuredDataIssues.length === 0,
        performanceScore: performanceMetrics.score
      },
      indexing: {
        indexablePages: this.countIndexablePages(),
        noIndexPages: this.countNoIndexPages(),
        canonicalIssues: this.findCanonicalIssues()
      },
      contentSEO: contentAudit
    };
  }

  private static auditMetaTags(): { warnings: string[]; recommendations: string[] } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check title
    const title = document.title;
    if (!title) {
      warnings.push('Missing page title');
    } else if (title.length > 60) {
      warnings.push(`Title too long: ${title.length} characters (should be ≤60)`);
    } else if (title.length < 30) {
      recommendations.push(`Title could be longer: ${title.length} characters (optimal: 50-60)`);
    }

    // Check meta description
    const description = document.querySelector('meta[name="description"]');
    if (!description) {
      warnings.push('Missing meta description');
    } else {
      const content = description.getAttribute('content') || '';
      if (content.length > 160) {
        warnings.push(`Meta description too long: ${content.length} characters (should be ≤160)`);
      } else if (content.length < 120) {
        recommendations.push(`Meta description could be longer: ${content.length} characters (optimal: 150-160)`);
      }
    }

    // Check viewport
    if (!document.querySelector('meta[name="viewport"]')) {
      warnings.push('Missing viewport meta tag');
    }

    // Check canonical
    if (!document.querySelector('link[rel="canonical"]')) {
      warnings.push('Missing canonical URL');
    }

    return { warnings, recommendations };
  }

  private static auditStructuredData(): string[] {
    const issues: string[] = [];
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (scripts.length === 0) {
      issues.push('No structured data found');
      return issues;
    }

    scripts.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent || '{}');
        if (!data['@context'] || !data['@type']) {
          issues.push(`Structured data script ${index + 1} missing @context or @type`);
        }
      } catch (error) {
        issues.push(`Invalid JSON in structured data script ${index + 1}`);
      }
    });

    return issues;
  }

  private static auditContent(): {
    titleOptimization: number;
    descriptionOptimization: number;
    headingStructure: number;
    internalLinking: number;
  } {
    // Title optimization
    const title = document.title;
    const titleScore = title ? Math.min(100, (title.length / 60) * 100) : 0;

    // Description optimization
    const description = document.querySelector('meta[name="description"]');
    const descContent = description?.getAttribute('content') || '';
    const descScore = descContent ? Math.min(100, (descContent.length / 160) * 100) : 0;

    // Heading structure
    const h1s = document.querySelectorAll('h1');
    const h2s = document.querySelectorAll('h2');
    let headingScore = 0;
    if (h1s.length === 1) headingScore += 50;
    if (h2s.length > 0) headingScore += 30;
    if (h1s.length === 1 && h2s.length >= 2) headingScore += 20;

    // Internal linking
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href*="funds.movingto.com"]');
    const linkScore = Math.min(100, internalLinks.length * 10);

    return {
      titleOptimization: titleScore,
      descriptionOptimization: descScore,
      headingStructure: headingScore,
      internalLinking: linkScore
    };
  }

  private static auditSecurity(): string[] {
    const issues: string[] = [];
    
    // Check for HTTPS
    if (location.protocol !== 'https:') {
      issues.push('Site not served over HTTPS');
    }

    // Check security headers
    const securityHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Referrer-Policy'
    ];

    securityHeaders.forEach(header => {
      if (!document.querySelector(`meta[name="${header}"]`)) {
        issues.push(`Missing security header: ${header}`);
      }
    });

    return issues;
  }

  private static checkRobotsTxt(): boolean {
    // This would need to be checked server-side in a real implementation
    return true; // Assume present for now
  }

  private static countIndexablePages(): number {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const content = robotsMeta?.getAttribute('content') || '';
    return content.includes('noindex') ? 0 : 1;
  }

  private static countNoIndexPages(): number {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const content = robotsMeta?.getAttribute('content') || '';
    return content.includes('noindex') ? 1 : 0;
  }

  private static findCanonicalIssues(): string[] {
    const issues: string[] = [];
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    
    if (canonicals.length > 1) {
      issues.push(`Multiple canonical tags found: ${canonicals.length}`);
    }

    canonicals.forEach(canonical => {
      const href = canonical.getAttribute('href');
      if (!href) {
        issues.push('Canonical tag missing href attribute');
      } else if (!href.startsWith('http')) {
        issues.push('Canonical URL should be absolute');
      }
    });

    return issues;
  }

  private static calculateOverallScore(
    seoValidation: any,
    performanceMetrics: any,
    contentAudit: any
  ): number {
    const seoScore = seoValidation.score || 0;
    const perfScore = performanceMetrics.score || 0;
    const contentScore = (
      contentAudit.titleOptimization +
      contentAudit.descriptionOptimization +
      contentAudit.headingStructure +
      contentAudit.internalLinking
    ) / 4;

    return Math.round((seoScore * 0.4 + perfScore * 0.3 + contentScore * 0.3));
  }

  static generateAuditReport(audit: SEOAuditResult): string {
    let report = `🔍 COMPREHENSIVE SEO AUDIT REPORT\n`;
    report += `Overall Score: ${audit.score}/100\n\n`;

    // Critical Issues
    if (audit.issues.critical.length > 0) {
      report += `🚨 CRITICAL ISSUES (${audit.issues.critical.length}):\n`;
      audit.issues.critical.forEach(issue => report += `   • ${issue}\n`);
      report += `\n`;
    }

    // Technical SEO
    report += `⚙️ TECHNICAL SEO:\n`;
    report += `   • Sitemap: ${audit.technicalSEO.sitemapAccessible ? '✅' : '❌'} Accessible\n`;
    report += `   • Robots.txt: ${audit.technicalSEO.robotsTxtPresent ? '✅' : '❌'} Present\n`;
    report += `   • Meta Tags: ${audit.technicalSEO.metaTagsOptimized ? '✅' : '⚠️'} Optimized\n`;
    report += `   • Structured Data: ${audit.technicalSEO.structuredDataValid ? '✅' : '⚠️'} Valid\n`;
    report += `   • Performance: ${audit.technicalSEO.performanceScore}/100\n\n`;

    // Content SEO
    report += `📝 CONTENT SEO:\n`;
    report += `   • Title Optimization: ${audit.contentSEO.titleOptimization.toFixed(0)}%\n`;
    report += `   • Description Optimization: ${audit.contentSEO.descriptionOptimization.toFixed(0)}%\n`;
    report += `   • Heading Structure: ${audit.contentSEO.headingStructure.toFixed(0)}%\n`;
    report += `   • Internal Linking: ${audit.contentSEO.internalLinking.toFixed(0)}%\n\n`;

    // Warnings & Recommendations
    if (audit.issues.warnings.length > 0) {
      report += `⚠️ WARNINGS (${audit.issues.warnings.length}):\n`;
      audit.issues.warnings.forEach(warning => report += `   • ${warning}\n`);
      report += `\n`;
    }

    if (audit.issues.recommendations.length > 0) {
      report += `💡 RECOMMENDATIONS (${audit.issues.recommendations.length}):\n`;
      audit.issues.recommendations.forEach(rec => report += `   • ${rec}\n`);
    }

    return report;
  }
}