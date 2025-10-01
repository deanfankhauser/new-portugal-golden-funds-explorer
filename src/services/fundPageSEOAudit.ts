/**
 * Fund Page SEO Audit Service
 * Comprehensive SEO validation for fund detail pages
 */

export interface FundPageSEOAuditResult {
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  metrics: {
    metaTags: { valid: number; total: number; missing: string[] };
    headings: { h1Count: number; h2Count: number; valid: boolean };
    structuredData: { valid: boolean; schemas: string[] };
    images: { total: number; withAlt: number; optimized: number };
    internalLinks: { count: number; contextual: number };
    content: { titleLength: number; descriptionLength: number; keywords: string[] };
    performance: { lcp: string; cls: string; fid: string };
  };
}

export class FundPageSEOAudit {
  /**
   * Run comprehensive SEO audit on current fund page
   */
  static runAudit(): FundPageSEOAuditResult {
    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // 1. Meta Tags Audit
    const metaTagsResult = this.auditMetaTags();
    if (metaTagsResult.missing.length > 0) {
      criticalIssues.push(...metaTagsResult.missing.map(tag => `Missing ${tag}`));
    }
    
    // 2. Heading Structure Audit
    const headingsResult = this.auditHeadings();
    if (!headingsResult.valid) {
      if (headingsResult.h1Count === 0) {
        criticalIssues.push('Missing H1 heading');
      } else if (headingsResult.h1Count > 1) {
        warnings.push(`Multiple H1 headings found (${headingsResult.h1Count})`);
      }
      if (headingsResult.h2Count === 0) {
        warnings.push('No H2 headings found - add subheadings for better structure');
      }
    }
    
    // 3. Structured Data Audit
    const structuredDataResult = this.auditStructuredData();
    if (!structuredDataResult.valid) {
      criticalIssues.push('Invalid or missing structured data (JSON-LD)');
    } else if (structuredDataResult.schemas.length === 0) {
      warnings.push('No structured data schemas found');
    }
    
    // 4. Images Audit
    const imagesResult = this.auditImages();
    if (imagesResult.total > 0) {
      const altCoverage = (imagesResult.withAlt / imagesResult.total) * 100;
      if (altCoverage < 100) {
        warnings.push(`${imagesResult.total - imagesResult.withAlt} images missing alt text (${altCoverage.toFixed(0)}% coverage)`);
      }
      if (imagesResult.optimized < imagesResult.total) {
        recommendations.push(`Optimize ${imagesResult.total - imagesResult.optimized} images for better performance`);
      }
    }
    
    // 5. Internal Links Audit
    const linksResult = this.auditInternalLinks();
    if (linksResult.count < 3) {
      warnings.push(`Low internal link count (${linksResult.count}) - add more contextual links`);
    }
    if (linksResult.contextual < 2) {
      recommendations.push('Add more contextual internal links within content');
    }
    
    // 6. Content Audit
    const contentResult = this.auditContent();
    if (contentResult.titleLength > 60) {
      warnings.push(`Title too long (${contentResult.titleLength} chars) - should be ≤60`);
    }
    if (contentResult.descriptionLength > 160) {
      warnings.push(`Description too long (${contentResult.descriptionLength} chars) - should be ≤160`);
    }
    if (contentResult.keywords.length < 3) {
      recommendations.push('Add more relevant keywords to meta tags');
    }
    
    // 7. Performance Audit
    const performanceResult = this.auditPerformance();
    if (performanceResult.lcp === 'poor') {
      criticalIssues.push('Poor Largest Contentful Paint (LCP) - optimize loading speed');
    } else if (performanceResult.lcp === 'needs-improvement') {
      warnings.push('LCP needs improvement - consider image optimization and preloading');
    }
    
    // Calculate overall score
    const score = this.calculateScore({
      metaTags: metaTagsResult,
      headings: headingsResult,
      structuredData: structuredDataResult,
      images: imagesResult,
      internalLinks: linksResult,
      content: contentResult,
      performance: performanceResult
    });
    
    // Determine status
    let status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
    if (criticalIssues.length > 0) {
      status = 'critical';
    } else if (score >= 90) {
      status = 'excellent';
    } else if (score >= 75) {
      status = 'good';
    } else {
      status = 'needs-improvement';
    }
    
    return {
      score,
      status,
      criticalIssues,
      warnings,
      recommendations,
      metrics: {
        metaTags: metaTagsResult,
        headings: headingsResult,
        structuredData: structuredDataResult,
        images: imagesResult,
        internalLinks: linksResult,
        content: contentResult,
        performance: performanceResult
      }
    };
  }
  
  /**
   * Audit meta tags
   */
  private static auditMetaTags() {
    const missing: string[] = [];
    let valid = 0;
    
    // Check required meta tags
    const requiredTags = [
      { selector: 'title', name: 'title' },
      { selector: 'meta[name="description"]', name: 'meta description' },
      { selector: 'link[rel="canonical"]', name: 'canonical URL' },
      { selector: 'meta[property="og:title"]', name: 'OpenGraph title' },
      { selector: 'meta[property="og:description"]', name: 'OpenGraph description' },
      { selector: 'meta[name="twitter:card"]', name: 'Twitter Card' }
    ];
    
    requiredTags.forEach(tag => {
      const element = document.querySelector(tag.selector);
      if (element) {
        valid++;
      } else {
        missing.push(tag.name);
      }
    });
    
    return { valid, total: requiredTags.length, missing };
  }
  
  /**
   * Audit heading structure
   */
  private static auditHeadings() {
    const h1Elements = document.querySelectorAll('h1');
    const h2Elements = document.querySelectorAll('h2');
    
    return {
      h1Count: h1Elements.length,
      h2Count: h2Elements.length,
      valid: h1Elements.length === 1 && h2Elements.length > 0
    };
  }
  
  /**
   * Audit structured data
   */
  private static auditStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const schemas: string[] = [];
    let valid = false;
    
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '');
        if (data['@type']) {
          schemas.push(data['@type']);
          valid = true;
        }
      } catch (e) {
        // Invalid JSON
      }
    });
    
    return { valid, schemas };
  }
  
  /**
   * Audit images
   */
  private static auditImages() {
    const images = document.querySelectorAll('img');
    let withAlt = 0;
    let optimized = 0;
    
    images.forEach(img => {
      if (img.alt && img.alt.trim() !== '') {
        withAlt++;
      }
      // Check if image uses lazy loading or is optimized
      if (img.loading === 'lazy' || img.classList.contains('optimized')) {
        optimized++;
      }
    });
    
    return {
      total: images.length,
      withAlt,
      optimized
    };
  }
  
  /**
   * Audit internal links
   */
  private static auditInternalLinks() {
    const links = document.querySelectorAll('a[href^="/"]');
    let contextual = 0;
    
    // Count contextual links (within main content, not nav/footer)
    links.forEach(link => {
      const parent = link.closest('main, article, .content');
      if (parent) {
        contextual++;
      }
    });
    
    return {
      count: links.length,
      contextual
    };
  }
  
  /**
   * Audit content optimization
   */
  private static auditContent() {
    const title = document.querySelector('title')?.textContent || '';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(',') || [];
    
    return {
      titleLength: title.length,
      descriptionLength: description.length,
      keywords: keywords.filter(k => k.trim() !== '')
    };
  }
  
  /**
   * Audit performance metrics
   */
  private static auditPerformance() {
    const lcp = this.getLCPStatus();
    const cls = this.getCLSStatus();
    const fid = this.getFIDStatus();
    
    return { lcp, cls, fid };
  }
  
  private static getLCPStatus(): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
    // Check if Core Web Vitals data is available
    const vitals = (window as any).__coreWebVitals;
    if (vitals?.lcp) {
      const lcp = vitals.lcp.value;
      if (lcp <= 2500) return 'good';
      if (lcp <= 4000) return 'needs-improvement';
      return 'poor';
    }
    
    // Fallback: Check navigation timing
    if (window.performance?.timing) {
      const timing = window.performance.timing;
      const lcp = timing.loadEventEnd - timing.navigationStart;
      if (lcp > 0) {
        if (lcp <= 2500) return 'good';
        if (lcp <= 4000) return 'needs-improvement';
        return 'poor';
      }
    }
    
    return 'unknown';
  }
  
  private static getCLSStatus(): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
    const vitals = (window as any).__coreWebVitals;
    if (vitals?.cls) {
      const cls = vitals.cls.value;
      if (cls <= 0.1) return 'good';
      if (cls <= 0.25) return 'needs-improvement';
      return 'poor';
    }
    return 'unknown';
  }
  
  private static getFIDStatus(): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
    const vitals = (window as any).__coreWebVitals;
    if (vitals?.fid) {
      const fid = vitals.fid.value;
      if (fid <= 100) return 'good';
      if (fid <= 300) return 'needs-improvement';
      return 'poor';
    }
    return 'unknown';
  }
  
  /**
   * Calculate overall SEO score
   */
  private static calculateScore(metrics: any): number {
    let score = 0;
    
    // Meta tags (30 points)
    score += (metrics.metaTags.valid / metrics.metaTags.total) * 30;
    
    // Headings (15 points)
    if (metrics.headings.valid) score += 15;
    else if (metrics.headings.h1Count === 1) score += 10;
    
    // Structured data (20 points)
    if (metrics.structuredData.valid) score += 20;
    
    // Images (10 points)
    if (metrics.images.total > 0) {
      score += (metrics.images.withAlt / metrics.images.total) * 10;
    } else {
      score += 10; // No images is fine
    }
    
    // Internal links (10 points)
    if (metrics.internalLinks.count >= 5) score += 10;
    else score += (metrics.internalLinks.count / 5) * 10;
    
    // Content (10 points)
    if (metrics.content.titleLength <= 60 && metrics.content.descriptionLength <= 160) {
      score += 10;
    } else if (metrics.content.titleLength <= 70 && metrics.content.descriptionLength <= 180) {
      score += 5;
    }
    
    // Performance (5 points)
    if (metrics.performance.lcp === 'good') score += 5;
    else if (metrics.performance.lcp === 'needs-improvement') score += 2;
    
    return Math.round(score);
  }
  
  /**
   * Generate human-readable audit report
   */
  static generateReport(): string {
    const result = this.runAudit();
    
    let report = `
══════════════════════════════════════════
   FUND PAGE SEO AUDIT REPORT
══════════════════════════════════════════

Overall Score: ${result.score}/100 (${result.status.toUpperCase()})

`;
    
    if (result.criticalIssues.length > 0) {
      report += `🚨 CRITICAL ISSUES (${result.criticalIssues.length}):\n`;
      result.criticalIssues.forEach(issue => {
        report += `   ❌ ${issue}\n`;
      });
      report += '\n';
    }
    
    if (result.warnings.length > 0) {
      report += `⚠️  WARNINGS (${result.warnings.length}):\n`;
      result.warnings.forEach(warning => {
        report += `   ⚠️  ${warning}\n`;
      });
      report += '\n';
    }
    
    if (result.recommendations.length > 0) {
      report += `💡 RECOMMENDATIONS (${result.recommendations.length}):\n`;
      result.recommendations.forEach(rec => {
        report += `   💡 ${rec}\n`;
      });
      report += '\n';
    }
    
    report += `
──────────────────────────────────────────
   DETAILED METRICS
──────────────────────────────────────────

📋 Meta Tags: ${result.metrics.metaTags.valid}/${result.metrics.metaTags.total}
${result.metrics.metaTags.missing.length > 0 ? `   Missing: ${result.metrics.metaTags.missing.join(', ')}` : '   ✅ All required meta tags present'}

📝 Headings:
   H1: ${result.metrics.headings.h1Count} ${result.metrics.headings.h1Count === 1 ? '✅' : '❌'}
   H2: ${result.metrics.headings.h2Count} ${result.metrics.headings.h2Count > 0 ? '✅' : '⚠️'}

🔍 Structured Data:
   Status: ${result.metrics.structuredData.valid ? '✅ Valid' : '❌ Invalid/Missing'}
   Schemas: ${result.metrics.structuredData.schemas.join(', ') || 'None'}

🖼️  Images:
   Total: ${result.metrics.images.total}
   With Alt: ${result.metrics.images.withAlt} (${result.metrics.images.total > 0 ? Math.round((result.metrics.images.withAlt / result.metrics.images.total) * 100) : 0}%)
   Optimized: ${result.metrics.images.optimized}

🔗 Internal Links:
   Total: ${result.metrics.internalLinks.count}
   Contextual: ${result.metrics.internalLinks.contextual}

📄 Content:
   Title Length: ${result.metrics.content.titleLength} chars ${result.metrics.content.titleLength <= 60 ? '✅' : '⚠️'}
   Description: ${result.metrics.content.descriptionLength} chars ${result.metrics.content.descriptionLength <= 160 ? '✅' : '⚠️'}
   Keywords: ${result.metrics.content.keywords.length}

⚡ Performance:
   LCP: ${result.metrics.performance.lcp}
   CLS: ${result.metrics.performance.cls}
   FID: ${result.metrics.performance.fid}

══════════════════════════════════════════
`;
    
    return report;
  }
}
