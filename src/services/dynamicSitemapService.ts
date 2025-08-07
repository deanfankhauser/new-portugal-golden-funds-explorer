import { fundsData } from '../data/mock/funds';
import { getAllFundManagers } from '../data/services/managers-service';
import { getAllCategories } from '../data/services/categories-service';
import { getAllTags } from '../data/services/tags-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

export class DynamicSitemapService {
  private static readonly BASE_URL = 'https://movingto.com/funds';
  private static readonly CURRENT_DATE = new Date().toISOString().split('T')[0];

  // Generate complete sitemap XML
  static generateSitemapXML(): string {
    const urls = [
      ...this.getStaticUrls(),
      ...this.getFundUrls(),
      ...this.getCategoryUrls(),
      ...this.getTagUrls(),
      ...this.getManagerUrls()
    ];

    const urlElements = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  // Static pages
  private static getStaticUrls() {
    return [
      { loc: this.BASE_URL, lastmod: this.CURRENT_DATE, changefreq: 'daily', priority: '1.0' },
      { loc: `${this.BASE_URL}/index`, lastmod: this.CURRENT_DATE, changefreq: 'weekly', priority: '0.9' },
      { loc: `${this.BASE_URL}/categories`, lastmod: this.CURRENT_DATE, changefreq: 'weekly', priority: '0.8' },
      { loc: `${this.BASE_URL}/tags`, lastmod: this.CURRENT_DATE, changefreq: 'weekly', priority: '0.8' },
      { loc: `${this.BASE_URL}/managers`, lastmod: this.CURRENT_DATE, changefreq: 'weekly', priority: '0.8' },
      { loc: `${this.BASE_URL}/comparisons`, lastmod: this.CURRENT_DATE, changefreq: 'weekly', priority: '0.7' },
      { loc: `${this.BASE_URL}/about`, lastmod: this.CURRENT_DATE, changefreq: 'monthly', priority: '0.6' },
      { loc: `${this.BASE_URL}/disclaimer`, lastmod: this.CURRENT_DATE, changefreq: 'monthly', priority: '0.3' },
      { loc: `${this.BASE_URL}/privacy`, lastmod: this.CURRENT_DATE, changefreq: 'monthly', priority: '0.3' },
      { loc: `${this.BASE_URL}/faqs`, lastmod: this.CURRENT_DATE, changefreq: 'monthly', priority: '0.7' },
      { loc: `${this.BASE_URL}/roi-calculator`, lastmod: this.CURRENT_DATE, changefreq: 'monthly', priority: '0.6' },
      { loc: `${this.BASE_URL}/fund-quiz`, lastmod: this.CURRENT_DATE, changefreq: 'monthly', priority: '0.6' }
    ];
  }

  // Fund detail pages
  private static getFundUrls() {
    return fundsData.map(fund => ({
      loc: `${this.BASE_URL}/${fund.id}`,
      lastmod: this.CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.9'
    }));
  }

  // Category pages
  private static getCategoryUrls() {
    const categories = getAllCategories();
    return categories.map(category => ({
      loc: `${this.BASE_URL}/categories/${categoryToSlug(category)}`,
      lastmod: this.CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.8'
    }));
  }

  // Tag pages
  private static getTagUrls() {
    const tags = getAllTags();
    return tags.map(tag => ({
      loc: `${this.BASE_URL}/tags/${tagToSlug(tag)}`,
      lastmod: this.CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.7'
    }));
  }

  // Manager pages
  private static getManagerUrls() {
    const managers = getAllFundManagers();
    return managers.map(manager => ({
      loc: `${this.BASE_URL}/manager/${managerToSlug(manager.name)}`,
      lastmod: this.CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.8'
    }));
  }

  // Update sitemap file (for SSG)
  static updateSitemapFile(): void {
    const sitemapXML = this.generateSitemapXML();
    // In production, this would write to the public/sitemap.xml file
    // For now, this just generates the content
    console.log('📍 Dynamic sitemap generated with current date:', this.CURRENT_DATE);
    console.log('📊 Total URLs:', sitemapXML.split('<url>').length - 1);
  }
}