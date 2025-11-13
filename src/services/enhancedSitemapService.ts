import { SitemapService, SitemapEntry } from './sitemapService';
import { generateComparisonsFromFunds } from '../data/services/comparison-service';
import { URL_CONFIG } from '../utils/urlConfig';
import { DateManagementService } from './dateManagementService';
import { fetchAllFundsForBuild } from '../lib/build-data-fetcher';

export class EnhancedSitemapService extends SitemapService {
  
  // Generate comparison pages for sitemap (canonical with self-referencing canonical tags)
  private static async getComparisonPages(): Promise<SitemapEntry[]> {
    const funds = await fetchAllFundsForBuild();
    const comparisons = generateComparisonsFromFunds(funds);
    const contentDates = DateManagementService.getContentDates('comparison');
    
    return comparisons.map(comparison => ({
      url: URL_CONFIG.buildComparisonUrl(comparison.slug),
      lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
      changefreq: 'weekly' as const,
      priority: 0.85
    }));
  }

  // Enhanced sitemap generation with canonical pages only
  // NOTE: Alternatives pages excluded - they have non-self-referencing canonical tags
  static async generateEnhancedSitemapEntries(): Promise<SitemapEntry[]> {
    const funds = await fetchAllFundsForBuild();
    const [baseEntries, comparisonPages] = await Promise.all([
      Promise.resolve(super.generateSitemapEntries(funds)),
      this.getComparisonPages()
    ]);
    
    return [
      ...baseEntries,
      ...comparisonPages
    ];
  }

  // Generate robots.txt content
  static generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Enhanced crawling directives
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

# Sitemap location
Sitemap: ${URL_CONFIG.BASE_URL}/sitemap-index.xml

# Disallow admin and auth pages
Disallow: /admin
Disallow: /auth
Disallow: /api/

# Allow important pages
Allow: /categories
Allow: /tags
Allow: /managers
Allow: /comparisons
Allow: /alternatives`;
  }

  // Generate enhanced XML sitemap with proper indexing hints
  static async generateEnhancedSitemapXML(): Promise<string> {
    const entries = await this.generateEnhancedSitemapEntries();
    
    const urlElements = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
  }

  // Validate sitemap accessibility
  static async validateSitemapAccess(): Promise<{ accessible: boolean; error?: string }> {
    try {
      const sitemapUrl = `${URL_CONFIG.BASE_URL}/sitemap.xml`;
      const response = await fetch(sitemapUrl, { method: 'HEAD' });
      
      return {
        accessible: response.ok,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };
    } catch (error) {
      return {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate sitemap index for large sites
  static generateSitemapIndex(): string {
    const baseUrl = URL_CONFIG.BASE_URL;
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-funds.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-enhanced.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
  }
}