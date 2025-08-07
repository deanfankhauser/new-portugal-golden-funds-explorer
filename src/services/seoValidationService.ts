export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number;
}

export class SEOValidationService {
  
  // Validate page SEO comprehensively
  static validatePageSEO(): SEOValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check title tag
    const titleValidation = this.validateTitle();
    if (!titleValidation.isValid) {
      errors.push(...titleValidation.errors);
      score -= 15;
    }
    warnings.push(...titleValidation.warnings);
    suggestions.push(...titleValidation.suggestions);

    // Check meta description
    const descriptionValidation = this.validateMetaDescription();
    if (!descriptionValidation.isValid) {
      errors.push(...descriptionValidation.errors);
      score -= 10;
    }
    warnings.push(...descriptionValidation.warnings);
    suggestions.push(...descriptionValidation.suggestions);

    // Check headings structure
    const headingsValidation = this.validateHeadingsStructure();
    if (!headingsValidation.isValid) {
      warnings.push(...headingsValidation.errors);
      score -= 5;
    }
    suggestions.push(...headingsValidation.suggestions);

    // Check images
    const imagesValidation = this.validateImages();
    warnings.push(...imagesValidation.warnings);
    suggestions.push(...imagesValidation.suggestions);
    if (imagesValidation.warnings.length > 0) {
      score -= Math.min(10, imagesValidation.warnings.length * 2);
    }

    // Check canonical URL
    const canonicalValidation = this.validateCanonical();
    if (!canonicalValidation.isValid) {
      errors.push(...canonicalValidation.errors);
      score -= 8;
    }

    // Check structured data
    const structuredDataValidation = this.validateStructuredData();
    if (!structuredDataValidation.isValid) {
      warnings.push(...structuredDataValidation.errors);
      score -= 5;
    }
    suggestions.push(...structuredDataValidation.suggestions);

    // Check OpenGraph
    const ogValidation = this.validateOpenGraph();
    if (!ogValidation.isValid) {
      warnings.push(...ogValidation.errors);
      score -= 5;
    }

    // Check performance indicators
    const performanceValidation = this.validatePerformanceIndicators();
    warnings.push(...performanceValidation.warnings);
    suggestions.push(...performanceValidation.suggestions);

    score = Math.max(0, score);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score
    };
  }

  // Validate title tag
  private static validateTitle(): SEOValidationResult {
    const title = document.title;
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Missing title tag');
    } else {
      if (title.length < 30) {
        warnings.push('Title is too short (recommended: 30-60 characters)');
      } else if (title.length > 60) {
        warnings.push('Title is too long (recommended: 30-60 characters)');
      }

      if (!title.includes('Golden Visa') && !title.includes('Portugal')) {
        suggestions.push('Consider including "Golden Visa" or "Portugal" in the title for better keyword targeting');
      }

      if (title === 'Portugal Golden Visa Investment Funds | Movingto') {
        warnings.push('Using default homepage title - should be page-specific');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: 0
    };
  }

  // Validate meta description
  private static validateMetaDescription(): SEOValidationResult {
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!metaDesc || metaDesc.trim().length === 0) {
      errors.push('Missing meta description');
    } else {
      if (metaDesc.length < 120) {
        warnings.push('Meta description is too short (recommended: 120-160 characters)');
      } else if (metaDesc.length > 160) {
        warnings.push('Meta description is too long (recommended: 120-160 characters)');
      }

      if (!metaDesc.includes('Golden Visa')) {
        suggestions.push('Consider including "Golden Visa" in meta description');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: 0
    };
  }

  // Validate headings structure
  private static validateHeadingsStructure(): SEOValidationResult {
    const h1s = document.querySelectorAll('h1');
    const h2s = document.querySelectorAll('h2');
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (h1s.length === 0) {
      errors.push('Missing H1 tag');
    } else if (h1s.length > 1) {
      errors.push('Multiple H1 tags found (should have exactly one)');
    }

    if (h2s.length === 0) {
      suggestions.push('Consider adding H2 tags for better content structure');
    }

    // Check if H1 contains relevant keywords
    if (h1s.length === 1) {
      const h1Text = h1s[0].textContent?.toLowerCase() || '';
      if (!h1Text.includes('golden visa') && !h1Text.includes('fund') && !h1Text.includes('investment')) {
        suggestions.push('Consider including relevant keywords in H1 tag');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      suggestions,
      score: 0
    };
  }

  // Validate images
  private static validateImages(): SEOValidationResult {
    const images = document.querySelectorAll('img');
    const warnings: string[] = [];
    const suggestions: string[] = [];

    let imagesWithoutAlt = 0;
    let imagesWithoutLoading = 0;

    images.forEach((img) => {
      if (!img.alt || img.alt.trim().length === 0) {
        imagesWithoutAlt++;
      }
      
      if (!img.loading) {
        imagesWithoutLoading++;
      }
    });

    if (imagesWithoutAlt > 0) {
      warnings.push(`${imagesWithoutAlt} image(s) missing alt text`);
    }

    if (imagesWithoutLoading > 0) {
      suggestions.push(`${imagesWithoutLoading} image(s) could benefit from lazy loading`);
    }

    return {
      isValid: true,
      errors: [],
      warnings,
      suggestions,
      score: 0
    };
  }

  // Validate canonical URL
  private static validateCanonical(): SEOValidationResult {
    const canonical = document.querySelector('link[rel="canonical"]');
    const errors: string[] = [];

    if (!canonical) {
      errors.push('Missing canonical URL');
    } else {
      const href = canonical.getAttribute('href');
      if (!href || href.trim().length === 0) {
        errors.push('Canonical URL is empty');
      } else {
        try {
          new URL(href);
        } catch {
          errors.push('Invalid canonical URL format');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      suggestions: [],
      score: 0
    };
  }

  // Validate structured data
  private static validateStructuredData(): SEOValidationResult {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (scripts.length === 0) {
      errors.push('No structured data found');
    } else {
      let hasValidStructuredData = false;
      
      scripts.forEach((script) => {
        try {
          const data = JSON.parse(script.textContent || '');
          if (data['@context'] && data['@type']) {
            hasValidStructuredData = true;
          }
        } catch {
          errors.push('Invalid JSON-LD structured data');
        }
      });

      if (!hasValidStructuredData) {
        errors.push('No valid structured data schema found');
      }

      if (scripts.length > 3) {
        suggestions.push('Consider consolidating structured data for better performance');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      suggestions,
      score: 0
    };
  }

  // Validate OpenGraph tags
  private static validateOpenGraph(): SEOValidationResult {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    const errors: string[] = [];

    if (!ogTitle) errors.push('Missing og:title');
    if (!ogDescription) errors.push('Missing og:description');
    if (!ogImage) errors.push('Missing og:image');
    if (!ogUrl) errors.push('Missing og:url');

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      suggestions: [],
      score: 0
    };
  }

  // Validate performance indicators
  private static validatePerformanceIndicators(): SEOValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for preload directives
    const preloads = document.querySelectorAll('link[rel="preload"]');
    if (preloads.length === 0) {
      suggestions.push('Consider adding preload directives for critical resources');
    }

    // Check for preconnect directives
    const preconnects = document.querySelectorAll('link[rel="preconnect"]');
    if (preconnects.length < 2) {
      suggestions.push('Consider adding preconnect directives for external domains');
    }

    // Check for lazy loading implementation
    const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    const totalImages = document.querySelectorAll('img').length;
    
    if (totalImages > 3 && lazyImages.length < totalImages * 0.5) {
      suggestions.push('Consider implementing lazy loading for more images');
    }

    return {
      isValid: true,
      errors: [],
      warnings,
      suggestions,
      score: 0
    };
  }

  // Generate SEO report
  static generateSEOReport(): string {
    const validation = this.validatePageSEO();
    
    let report = `📊 SEO Validation Report\n`;
    report += `Score: ${validation.score}/100\n\n`;
    
    if (validation.errors.length > 0) {
      report += `❌ Errors (${validation.errors.length}):\n`;
      validation.errors.forEach((error, i) => {
        report += `${i + 1}. ${error}\n`;
      });
      report += '\n';
    }
    
    if (validation.warnings.length > 0) {
      report += `⚠️ Warnings (${validation.warnings.length}):\n`;
      validation.warnings.forEach((warning, i) => {
        report += `${i + 1}. ${warning}\n`;
      });
      report += '\n';
    }
    
    if (validation.suggestions.length > 0) {
      report += `💡 Suggestions (${validation.suggestions.length}):\n`;
      validation.suggestions.forEach((suggestion, i) => {
        report += `${i + 1}. ${suggestion}\n`;
      });
    }
    
    return report;
  }

  // Log SEO report to console
  static logSEOReport(): void {
    // SEO report generated and available
  }
}