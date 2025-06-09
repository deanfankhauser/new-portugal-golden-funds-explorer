
import { funds, getAllCategories, getAllTags } from '../data/funds';
import { getAllFundManagers } from '../data/services/managers-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';
import { URL_CONFIG } from '../utils/urlConfig';

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
        url: `${URL_CONFIG.BASE_URL}/categories`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: `${URL_CONFIG.BASE_URL}/tags`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: `${URL_CONFIG.BASE_URL}/managers`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: `${URL_CONFIG.BASE_URL}/comparisons`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.7
      },
      // Static Pages
      {
        url: `${URL_CONFIG.BASE_URL}/about`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        url: `${URL_CONFIG.BASE_URL}/disclaimer`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: `${URL_CONFIG.BASE_URL}/privacy`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: `${URL_CONFIG.BASE_URL}/faqs`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        url: `${URL_CONFIG.BASE_URL}/roi-calculator`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        url: `${URL_CONFIG.BASE_URL}/fund-quiz`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      }
    ];
  }

  // Generate fund detail pages
  private static getFundPages(): SitemapEntry[] {
    const currentDate = this.getCurrentDate();
    
    return funds.map(fund => ({
      url: URL_CONFIG.buildFundUrl(fund.id),
      lastmod: currentDate,
      changefreq: 'weekly' as const,
      priority: 0.9
    }));
  }

  // Generate category pages
  private static getCategoryPages(): SitemapEntry[] {
    const currentDate = this.getCurrentDate();
    const categories = getAllCategories();
    
    return categories.map(category => ({
      url: URL_CONFIG.buildCategoryUrl(categoryToSlug(category)),
      lastmod: currentDate,
      changefreq: 'weekly' as const,
      priority: 0.8
    }));
  }

  // Generate tag pages
  private static getTagPages(): SitemapEntry[] {
    const currentDate = this.getCurrentDate();
    const tags = getAllTags();
    
    return tags.map(tag => ({
      url: URL_CONFIG.buildTagUrl(tagToSlug(tag)),
      lastmod: currentDate,
      changefreq: 'weekly' as const,
      priority: 0.7
    }));
  }

  // Generate manager pages with SEO-friendly URLs
  private static getManagerPages(): SitemapEntry[] {
    const currentDate = this.getCurrentDate();
    const managers = getAllFundManagers();
    
    return managers.map(manager => ({
      url: URL_CONFIG.buildManagerUrl(manager.name),
      lastmod: currentDate,
      changefreq: 'weekly' as const,
      priority: 0.8
    }));
  }

  // Generate complete sitemap entries
  static generateSitemapEntries(): SitemapEntry[] {
    return [
      ...this.getStaticPages(),
      ...this.getFundPages(),
      ...this.getCategoryPages(),
      ...this.getTagPages(),
      ...this.getManagerPages()
    ];
  }

  // Convert entries to XML format
  static generateSitemapXML(): string {
    const entries = this.generateSitemapEntries();
    
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
  static updateSitemap(): void {
    const sitemapXML = this.generateSitemapXML();
    // In a real application, this would write to the public/sitemap.xml file
    // For now, we'll just return the XML content
    console.log('Generated sitemap with', this.generateSitemapEntries().length, 'entries');
  }
}
