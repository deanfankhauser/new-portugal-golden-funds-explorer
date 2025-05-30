
import { funds } from '../data/funds';
import { categories } from '../data/services/categories-service';
import { tags } from '../data/services/tags-service';
import { managers } from '../data/services/managers-service';
import { URL_CONFIG } from '../utils/urlConfig';

export class SitemapService {
  
  static generateXMLSitemap(): string {
    const baseUrl = URL_CONFIG.BASE_URL;
    const currentDate = new Date().toISOString().split('T')[0];

    const urls: Array<{
      loc: string;
      lastmod: string;
      changefreq: string;
      priority: string;
    }> = [];

    // Homepage
    urls.push({
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    });

    // Hub pages
    const hubPages = [
      { path: 'categories', priority: '0.8' },
      { path: 'tags', priority: '0.8' },
      { path: 'managers', priority: '0.8' },
      { path: 'comparisons', priority: '0.7' }
    ];

    hubPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}/${page.path}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: page.priority
      });
    });

    // Static pages
    const staticPages = [
      { path: 'about', priority: '0.6' },
      { path: 'faqs', priority: '0.7' },
      { path: 'roi-calculator', priority: '0.6' },
      { path: 'fund-quiz', priority: '0.6' },
      { path: 'disclaimer', priority: '0.3' },
      { path: 'privacy', priority: '0.3' }
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}/${page.path}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: page.priority
      });
    });

    // Fund detail pages
    funds.forEach(fund => {
      urls.push({
        loc: URL_CONFIG.buildFundUrl(fund.id),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.9'
      });
    });

    // Category pages
    categories.forEach(category => {
      urls.push({
        loc: URL_CONFIG.buildCategoryUrl(category.slug),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Tag pages
    tags.forEach(tag => {
      urls.push({
        loc: URL_CONFIG.buildTagUrl(tag.slug),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.7'
      });
    });

    // Manager pages
    managers.forEach(manager => {
      urls.push({
        loc: URL_CONFIG.buildManagerUrl(manager.name),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Generate XML
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const xmlFooter = '</urlset>';
    
    const xmlUrls = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

    return xmlHeader + xmlUrls + '\n' + xmlFooter;
  }

  static generateRobotsTxt(): string {
    const baseUrl = URL_CONFIG.BASE_URL;
    
    return `User-agent: *
Allow: /

# Important paths for ${baseUrl}
Allow: /funds/
Allow: /funds/funds/
Allow: /funds/tags/
Allow: /funds/categories/
Allow: /funds/managers/

# Explicitly specify important listing pages
Allow: /funds/funds/*
Allow: /funds/tags
Allow: /funds/tags/*
Allow: /funds/categories
Allow: /funds/categories/*
Allow: /funds/managers
Allow: /funds/managers/*
Allow: /funds/manager/*
Allow: /funds/about
Allow: /funds/disclaimer
Allow: /funds/privacy
Allow: /funds/compare
Allow: /funds/comparisons
Allow: /funds/faqs
Allow: /funds/roi-calculator
Allow: /funds/fund-quiz

Sitemap: ${baseUrl}/sitemap.xml`;
  }
}
