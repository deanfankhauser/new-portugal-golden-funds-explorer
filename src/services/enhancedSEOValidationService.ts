export interface EnhancedSEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number;
  duplicateMetaTags: string[];
  missingAltImages: HTMLImageElement[];
  nonOptimizedImages: HTMLImageElement[];
}

export class EnhancedSEOValidationService {
  
  // Comprehensive SEO validation with enhanced checks
  static validatePageSEO(): EnhancedSEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Existing validations
    const titleValidation = this.validateTitle();
    const descriptionValidation = this.validateMetaDescription();
    const headingsValidation = this.validateHeadingsStructure();
    const canonicalValidation = this.validateCanonical();
    const structuredDataValidation = this.validateStructuredData();
    const ogValidation = this.validateOpenGraph();
    const performanceValidation = this.validatePerformanceIndicators();

    // Enhanced validations
    const duplicateMetaTags = this.detectDuplicateMetaTags();
    const imageValidation = this.validateImagesEnhanced();
    const preloadValidation = this.validatePreloadDirectives();
    
    // Dev-only: Check for multiple FAQ schemas
    const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
    if (isDev) {
      const faqSchemas = document.querySelectorAll('script[type="application/ld+json"]');
      const faqCount = Array.from(faqSchemas).filter(script => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          return data['@type'] === 'FAQPage';
        } catch {
          return false;
        }
      }).length;
      
      if (faqCount > 1) {
        warnings.push(`Multiple FAQPage schemas detected (${faqCount}). Consider consolidating to avoid conflicts.`);
      }
    }

    // Aggregate results
    [titleValidation, descriptionValidation, headingsValidation, canonicalValidation, 
     structuredDataValidation, ogValidation, performanceValidation].forEach(validation => {
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
      suggestions.push(...validation.suggestions);
      if (!validation.isValid) score -= 10;
    });

    // Apply enhanced penalties
    if (duplicateMetaTags.length > 0) {
      warnings.push(`Duplicate meta tags detected: ${duplicateMetaTags.join(', ')}`);
      score -= duplicateMetaTags.length * 5;
    }

    if (imageValidation.missingAltImages.length > 0) {
      errors.push(`${imageValidation.missingAltImages.length} images missing alt text`);
      score -= imageValidation.missingAltImages.length * 3;
    }

    if (imageValidation.nonOptimizedImages.length > 0) {
      suggestions.push(`${imageValidation.nonOptimizedImages.length} images not using OptimizedImage component`);
      score -= Math.min(10, imageValidation.nonOptimizedImages.length * 2);
    }

    score = Math.max(0, score);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score,
      duplicateMetaTags,
      missingAltImages: imageValidation.missingAltImages,
      nonOptimizedImages: imageValidation.nonOptimizedImages
    };
  }

  // Detect duplicate meta tags
  private static detectDuplicateMetaTags(): string[] {
    const duplicates: string[] = [];
    const metaTags = document.querySelectorAll('meta');
    const seenTags = new Map<string, number>();

    metaTags.forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || '';
      if (name) {
        const count = seenTags.get(name) || 0;
        seenTags.set(name, count + 1);
        if (count > 0) {
          duplicates.push(name);
        }
      }
    });

    return Array.from(new Set(duplicates));
  }

  // Enhanced image validation - optimized to avoid forced reflows
  private static validateImagesEnhanced(): {
    missingAltImages: HTMLImageElement[];
    nonOptimizedImages: HTMLImageElement[];
  } {
    const images = document.querySelectorAll('img');
    const missingAltImages: HTMLImageElement[] = [];
    const nonOptimizedImages: HTMLImageElement[] = [];

    // Batch all DOM reads together to avoid forced reflows
    images.forEach((img) => {
      // Only read attributes, don't trigger layout
      const hasAlt = img.hasAttribute('alt');
      const altText = hasAlt ? img.getAttribute('alt') : null;
      const hasOptimized = img.hasAttribute('data-optimized');
      const hasLoading = img.hasAttribute('loading');

      // Check for missing alt text
      if (!altText || altText.trim().length === 0) {
        missingAltImages.push(img);
      }

      // Check if using OptimizedImage component
      if (!hasOptimized && !hasLoading) {
        nonOptimizedImages.push(img);
      }
    });

    return { missingAltImages, nonOptimizedImages };
  }

  // Validate preload directives
  private static validatePreloadDirectives(): { errors: string[]; warnings: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    const preloads = document.querySelectorAll('link[rel="preload"]');
    const preconnects = document.querySelectorAll('link[rel="preconnect"]');
    const criticalCSS = document.querySelectorAll('link[rel="stylesheet"]');

    // Check for critical resource preloading
    if (preloads.length === 0 && criticalCSS.length > 0) {
      suggestions.push('Consider preloading critical CSS for better LCP');
    }

    // Check for external domain preconnects
    if (preconnects.length === 0) {
      suggestions.push('Consider adding preconnect directives for external domains');
    }

    // Validate preload integrity
    preloads.forEach(preload => {
      const href = preload.getAttribute('href');
      const as = preload.getAttribute('as');
      
      if (!href) {
        errors.push('Preload directive missing href attribute');
      }
      
      if (!as) {
        warnings.push('Preload directive missing "as" attribute');
      }
    });

    return { errors, warnings, suggestions };
  }

  // Auto-fix common SEO issues
  static autoFixSEOIssues(): void {
    const validation = this.validatePageSEO();

    // Fix missing alt text with generic descriptions
    validation.missingAltImages.forEach((img, index) => {
      if (!img.alt) {
        img.alt = `Image ${index + 1}`;
      }
    });

    // Remove duplicate meta tags (keep the first occurrence)
    validation.duplicateMetaTags.forEach(tagName => {
      const duplicates = document.querySelectorAll(`meta[name="${tagName}"], meta[property="${tagName}"]`);
      for (let i = 1; i < duplicates.length; i++) {
        duplicates[i].remove();
      }
    });

    // Add missing preconnect for common domains
    const commonDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    const existingPreconnects = Array.from(document.querySelectorAll('link[rel="preconnect"]'))
      .map(link => new URL(link.getAttribute('href') || '').hostname);

    commonDomains.forEach(domain => {
      if (!existingPreconnects.includes(domain)) {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = `https://${domain}`;
        document.head.appendChild(preconnect);
      }
    });
  }

  // Basic validations from original service
  private static validateTitle() {
    const title = document.title;
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Missing title tag');
    } else {
      if (title.length < 30) warnings.push('Title too short');
      if (title.length > 60) warnings.push('Title too long');
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions };
  }

  private static validateMetaDescription() {
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!metaDesc) {
      errors.push('Missing meta description');
    } else {
      if (metaDesc.length < 120) warnings.push('Meta description too short');
      if (metaDesc.length > 160) warnings.push('Meta description too long');
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions };
  }

  private static validateHeadingsStructure() {
    const h1s = document.querySelectorAll('h1');
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (h1s.length === 0) errors.push('Missing H1 tag');
    if (h1s.length > 1) errors.push('Multiple H1 tags');

    return { isValid: errors.length === 0, errors, warnings, suggestions };
  }

  private static validateCanonical() {
    const canonical = document.querySelector('link[rel="canonical"]');
    const errors: string[] = [];

    if (!canonical) errors.push('Missing canonical URL');

    return { isValid: errors.length === 0, errors, warnings: [], suggestions: [] };
  }

  private static validateStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (scripts.length === 0) errors.push('No structured data found');

    return { isValid: errors.length === 0, errors, warnings, suggestions };
  }

  private static validateOpenGraph() {
    const requiredOG = ['og:title', 'og:description', 'og:image', 'og:url'];
    const errors: string[] = [];

    requiredOG.forEach(prop => {
      if (!document.querySelector(`meta[property="${prop}"]`)) {
        errors.push(`Missing ${prop}`);
      }
    });

    return { isValid: errors.length === 0, errors, warnings: [], suggestions: [] };
  }

  private static validatePerformanceIndicators() {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    const preloads = document.querySelectorAll('link[rel="preload"]');
    if (preloads.length === 0) {
      suggestions.push('Add preload directives for critical resources');
    }

    return { isValid: true, errors: [], warnings, suggestions };
  }

  // Generate comprehensive report
  static generateEnhancedSEOReport(): string {
    const validation = this.validatePageSEO();
    
    let report = `📊 Enhanced SEO Validation Report\n`;
    report += `Score: ${validation.score}/100\n\n`;
    
    if (validation.errors.length > 0) {
      report += `❌ Critical Issues (${validation.errors.length}):\n`;
      validation.errors.forEach((error, i) => report += `${i + 1}. ${error}\n`);
      report += '\n';
    }
    
    if (validation.warnings.length > 0) {
      report += `⚠️ Warnings (${validation.warnings.length}):\n`;
      validation.warnings.forEach((warning, i) => report += `${i + 1}. ${warning}\n`);
      report += '\n';
    }
    
    if (validation.suggestions.length > 0) {
      report += `💡 Optimizations (${validation.suggestions.length}):\n`;
      validation.suggestions.forEach((suggestion, i) => report += `${i + 1}. ${suggestion}\n`);
      report += '\n';
    }

    if (validation.duplicateMetaTags.length > 0) {
      report += `🔄 Duplicate Meta Tags: ${validation.duplicateMetaTags.join(', ')}\n`;
    }

    if (validation.missingAltImages.length > 0) {
      report += `🖼️ Images Missing Alt Text: ${validation.missingAltImages.length}\n`;
    }

    if (validation.nonOptimizedImages.length > 0) {
      report += `⚡ Non-Optimized Images: ${validation.nonOptimizedImages.length}\n`;
    }
    
    return report;
  }
}
