import { SitemapService, SitemapEntry } from './sitemapService';
import { getAllComparisonSlugs } from '../data/services/comparison-service';
import { URL_CONFIG } from '../utils/urlConfig';
import { DateManagementService } from './dateManagementService';
import { funds } from '../data/funds';

export class EnhancedSitemapService extends SitemapService {
  
  // Generate comparison pages for sitemap
  private static getComparisonPages(): SitemapEntry[] {
    const comparisonSlugs = getAllComparisonSlugs();
    const contentDates = DateManagementService.getContentDates('comparison');
    
    return comparisonSlugs.map(slug => ({
      url: URL_CONFIG.buildComparisonUrl(slug),
      lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
      changefreq: 'weekly' as const,
      priority: 0.85
    }));
  }

  // Generate alternatives pages for sitemap
  private static getAlternativesPages(): SitemapEntry[] {
    return funds.map(fund => {
      const contentDates = DateManagementService.getFundContentDates(fund);
      return {
        url: `${URL_CONFIG.buildFundUrl(fund.id)}/alternatives`,
        lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
        changefreq: contentDates.changeFrequency,
        priority: 0.8
      };
    });
  }

  // Generate fund index page
  private static getFundIndexPage(): SitemapEntry {
    const contentDates = DateManagementService.getContentDates('fund-index');
    return {
      url: `${URL_CONFIG.BASE_URL}/index`,
      lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
      changefreq: 'daily',
      priority: 0.9
    };
  }

  // Enhanced sitemap generation with all pages
  static generateEnhancedSitemapEntries(): SitemapEntry[] {
    return [
      ...super.generateSitemapEntries(),
      this.getFundIndexPage(),
      ...this.getComparisonPages(),
      ...this.getAlternativesPages()
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
Sitemap: ${URL_CONFIG.BASE_URL}/sitemap.xml

# Disallow admin and auth pages
Disallow: /admin
Disallow: /auth
Disallow: /manager-auth
Disallow: /investor-auth
Disallow: /api/

# Allow important pages
Allow: /index
Allow: /categories
Allow: /tags
Allow: /managers
Allow: /comparisons
Allow: /alternatives`;
  }

  // Generate enhanced XML sitemap with proper indexing hints
  static generateEnhancedSitemapXML(): string {
    const entries = this.generateEnhancedSitemapEntries();
    
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
</sitemapindex>`;
  }
}