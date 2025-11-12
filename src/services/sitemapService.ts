
import { getAllCategories } from '../data/services/categories-service';
import { getAllTags } from '../data/services/tags-service';
import { getAllFundManagers } from '../data/services/managers-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';
import { URL_CONFIG } from '../utils/urlConfig';
import { DateManagementService } from './dateManagementService';
import { Fund } from '../data/types/funds';


export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapService {
  private static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Static pages configuration
  private static getStaticPages(): SitemapEntry[] {
    const currentDate = this.getCurrentDate();
    
    return [
      // Homepage
      {
        url: URL_CONFIG.BASE_URL,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 1.0
      },
      // Hub Pages
      {
        url: URL_CONFIG.buildUrl('/categories'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: URL_CONFIG.buildUrl('/tags'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: URL_CONFIG.buildUrl('/managers'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: URL_CONFIG.buildUrl('/comparisons'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        url: URL_CONFIG.buildUrl('/compare'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.6
      },
      {
        url: URL_CONFIG.buildUrl('/alternatives'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.7
      },
      // Static Pages
      {
        url: URL_CONFIG.buildUrl('/about'),
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        url: URL_CONFIG.buildUrl('/disclaimer'),
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: URL_CONFIG.buildUrl('/privacy'),
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: URL_CONFIG.buildUrl('/faqs'),
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        url: URL_CONFIG.buildUrl('/roi-calculator'),
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        url: URL_CONFIG.buildUrl('/saved-funds'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.6
      }
    ];
  }

  // Generate fund detail pages with actual modification dates
  private static getFundPages(funds: Fund[]): SitemapEntry[] {
    return funds.map(fund => {
      const contentDates = DateManagementService.getFundContentDates(fund);
      return {
        url: URL_CONFIG.buildFundUrl(fund.id),
        lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
        changefreq: contentDates.changeFrequency,
        priority: fund.fundStatus === 'Open' ? 0.9 : 
                  fund.fundStatus === 'Closing Soon' ? 0.95 : 0.8
      };
    });
  }

  // Generate category pages with content-aware dates
  private static getCategoryPages(funds: Fund[]): SitemapEntry[] {
    const categories = getAllCategories(funds);
    
    return categories.map(category => {
      const contentDates = DateManagementService.getContentDates('category', category);
      return {
        url: URL_CONFIG.buildCategoryUrl(category),
        lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
        changefreq: contentDates.changeFrequency,
        priority: 0.8
      };
    });
  }

  // Generate tag pages with content-aware dates
  private static getTagPages(funds: Fund[]): SitemapEntry[] {
    const tags = getAllTags(funds);
    
    return tags.map(tag => {
      const contentDates = DateManagementService.getContentDates('tag', tag);
      return {
        url: URL_CONFIG.buildTagUrl(tag),
        lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
        changefreq: contentDates.changeFrequency,
        priority: 0.7
      };
    });
  }

  // Generate manager pages with content-aware dates
  private static getManagerPages(funds: Fund[]): SitemapEntry[] {
    const managers = getAllFundManagers(funds);
    
    return managers.map(manager => {
      const contentDates = DateManagementService.getContentDates('manager', manager.name);
      return {
        url: URL_CONFIG.buildManagerUrl(manager.name),
        lastmod: DateManagementService.formatSitemapDate(contentDates.dateModified),
        changefreq: contentDates.changeFrequency,
        priority: 0.8
      };
    });
  }

  // Generate complete sitemap entries
  static generateSitemapEntries(funds: Fund[]): SitemapEntry[] {
    return [
      ...this.getStaticPages(),
      ...this.getFundPages(funds),
      ...this.getCategoryPages(funds),
      ...this.getTagPages(funds),
      ...this.getManagerPages(funds)
    ];
  }

  // Convert entries to XML format
  static generateSitemapXML(funds: Fund[]): string {
    const entries = this.generateSitemapEntries(funds);
    
    const urlElements = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  // Update the sitemap file
  static updateSitemap(funds: Fund[]): void {
    const sitemapXML = this.generateSitemapXML(funds);
    // In a real application, this would write to the public/sitemap.xml file
    // For now, we'll just return the XML content
    // Sitemap generated with entries
  }
}
