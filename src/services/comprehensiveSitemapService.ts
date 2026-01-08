/**
 * Comprehensive Sitemap Service - CLIENT-SAFE STUB
 * 
 * WARNING: This is a browser-safe stub file. The actual sitemap generation
 * logic has been moved to scripts/ssg/services/comprehensiveSitemapService.ts
 * which uses Node.js-only modules (fs, path) that cannot run in the browser.
 * 
 * This stub exists to prevent import errors in client code that may still
 * reference this file, but actual sitemap generation only happens at build time.
 */

export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class ComprehensiveSitemapService {
  /**
   * Generate sitemaps - CLIENT-SAFE STUB
   * This method is a no-op in the browser. Actual generation happens at build time.
   */
  public static async generateSitemaps(_outputDir: string): Promise<{
    sitemapFiles: string[];
    totalURLs: number;
    robotsTxtGenerated: boolean;
  }> {
    console.warn('ComprehensiveSitemapService.generateSitemaps() called in browser context - this is a no-op');
    return {
      sitemapFiles: [],
      totalURLs: 0,
      robotsTxtGenerated: false
    };
  }

  /**
   * Validate sitemaps - CLIENT-SAFE STUB
   * This method is a no-op in the browser. Actual validation happens at build time.
   */
  public static validateSitemaps(_outputDir: string): { valid: boolean; errors: string[]; warnings: string[] } {
    console.warn('ComprehensiveSitemapService.validateSitemaps() called in browser context - this is a no-op');
    return {
      valid: true,
      errors: [],
      warnings: ['Validation skipped - running in browser context']
    };
  }
}
