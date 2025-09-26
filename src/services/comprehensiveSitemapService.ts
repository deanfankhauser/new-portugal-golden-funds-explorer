import fs from 'fs';
import path from 'path';
import { funds } from '../data/services/funds-service';
import { getAllCategories } from '../data/services/categories-service';
import { getAllTags } from '../data/services/tags-service';
import { getAllFundManagers } from '../data/services/managers-service';
import { getAllComparisonSlugs } from '../data/services/comparison-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';
import { URL_CONFIG } from '../utils/urlConfig';

export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class ComprehensiveSitemapService {
  private static readonly MAX_URLS_PER_SITEMAP = 50000;
  private static readonly XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
  private static readonly SITEMAP_NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';

  /**
   * Escape XML special characters to ensure valid XML
   */
  private static escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Validate and normalize URL
   */
  private static normalizeURL(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      // If not absolute, assume it's relative and prepend base URL
      const cleanUrl = url.startsWith('/') ? url : `/${url}`;
      return `${URL_CONFIG.BASE_URL}${cleanUrl}`;
    }
  }

  /**
   * Format date for sitemap (YYYY-MM-DD format)
   */
  private static formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date.split('T')[0]; // Extract YYYY-MM-DD from ISO string
    }
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate URL element XML
   */
  private static generateURLElement(sitemapURL: SitemapURL): string {
    const { loc, lastmod, changefreq, priority } = sitemapURL;
    
    let urlXML = '  <url>\n';
    urlXML += `    <loc>${this.escapeXML(this.normalizeURL(loc))}</loc>\n`;
    
    if (lastmod) {
      urlXML += `    <lastmod>${this.formatDate(lastmod)}</lastmod>\n`;
    }
    
    if (changefreq) {
      urlXML += `    <changefreq>${changefreq}</changefreq>\n`;
    }
    
    if (priority !== undefined) {
      const formattedPriority = Math.min(1.0, Math.max(0.0, priority)).toFixed(1);
      urlXML += `    <priority>${formattedPriority}</priority>\n`;
    }
    
    urlXML += '  </url>';
    return urlXML;
  }

  /**
   * Generate sitemap XML content
   */
  private static generateSitemapXML(urls: SitemapURL[]): string {
    const urlElements = urls.map(url => this.generateURLElement(url)).join('\n');
    
    return `${this.XML_DECLARATION}
<urlset xmlns="${this.SITEMAP_NAMESPACE}">
${urlElements}
</urlset>`;
  }

  /**
   * Generate sitemap index XML
   */
  private static generateSitemapIndexXML(sitemapFiles: Array<{ filename: string; lastmod: string }>): string {
    const sitemapElements = sitemapFiles.map(sitemap => {
      const sitemapURL = `${URL_CONFIG.BASE_URL}/${sitemap.filename}`;
      return `  <sitemap>
    <loc>${this.escapeXML(sitemapURL)}</loc>
    <lastmod>${this.formatDate(sitemap.lastmod)}</lastmod>
  </sitemap>`;
    }).join('\n');

    return `${this.XML_DECLARATION}
<sitemapindex xmlns="${this.SITEMAP_NAMESPACE}">
${sitemapElements}
</sitemapindex>`;
  }

  /**
   * Collect all URLs from the application
   */
  private static collectAllURLs(): SitemapURL[] {
    const urls: SitemapURL[] = [];
    const currentDate = new Date().toISOString().split('T')[0];

    // Homepage
    urls.push({
      loc: URL_CONFIG.BASE_URL,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    });

    // Static pages
    const staticPages = [
      { path: '/index', priority: 0.9, changefreq: 'daily' as const },
      { path: '/about', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/disclaimer', priority: 0.3, changefreq: 'monthly' as const },
      { path: '/privacy', priority: 0.3, changefreq: 'monthly' as const },
      { path: '/faqs', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/roi-calculator', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/saved-funds', priority: 0.6, changefreq: 'weekly' as const }
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${URL_CONFIG.BASE_URL}${page.path}`,
        lastmod: currentDate,
        changefreq: page.changefreq,
        priority: page.priority
      });
    });

    // Hub pages
    const hubPages = [
      { path: '/categories', priority: 0.8 },
      { path: '/tags', priority: 0.8 },
      { path: '/managers', priority: 0.8 },
      { path: '/comparisons', priority: 0.7 },
      { path: '/compare', priority: 0.6 },
      { path: '/alternatives', priority: 0.7 }
    ];

    hubPages.forEach(hub => {
      urls.push({
        loc: `${URL_CONFIG.BASE_URL}${hub.path}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: hub.priority
      });
    });

    // Fund detail pages
    funds.forEach(fund => {
      urls.push({
        loc: URL_CONFIG.buildFundUrl(fund.id),
        lastmod: fund.dateModified || currentDate,
        changefreq: 'weekly',
        priority: fund.fundStatus === 'Open' ? 0.9 : fund.fundStatus === 'Closing Soon' ? 0.95 : 0.8
      });

      // Fund alternatives pages
      urls.push({
        loc: `${URL_CONFIG.buildFundUrl(fund.id)}/alternatives`,
        lastmod: fund.dateModified || currentDate,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Category pages
    try {
      const categories = getAllCategories();
      categories.forEach(category => {
        urls.push({
          loc: URL_CONFIG.buildCategoryUrl(category),
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    } catch (error) {
      console.warn('Failed to generate category URLs:', error);
    }

    // Tag pages
    try {
      const tags = getAllTags();
      tags.forEach(tag => {
        urls.push({
          loc: URL_CONFIG.buildTagUrl(tag),
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.7
        });
      });
    } catch (error) {
      console.warn('Failed to generate tag URLs:', error);
    }

    // Manager pages
    try {
      const managers = getAllFundManagers();
      managers.forEach(manager => {
        urls.push({
          loc: URL_CONFIG.buildManagerUrl(manager.name),
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    } catch (error) {
      console.warn('Failed to generate manager URLs:', error);
    }

    // Comparison pages
    try {
      const comparisonSlugs = getAllComparisonSlugs();
      comparisonSlugs.forEach(slug => {
        urls.push({
          loc: URL_CONFIG.buildComparisonUrl(slug),
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.85
        });
      });
    } catch (error) {
      console.warn('Failed to generate comparison URLs:', error);
    }

    return urls;
  }

  /**
   * Discover dynamic routes from built dist folder, e.g., /categories/* and /tags/*
   * This ensures nested or dynamically generated paths are always included.
   */
  private static discoverDynamicPathsFromDist(outputDir: string, subdirs: string[]): string[] {
    const found: string[] = [];

    const hasIndexHtml = (dir: string) => fs.existsSync(path.join(dir, 'index.html'));

    const walk = (baseAbs: string, rel: string) => {
      // If this folder has an index.html and rel is non-empty, it represents a route
      if (rel && hasIndexHtml(baseAbs)) {
        found.push(rel.replace(/\\/g, '/')); // normalize
      }
      const entries = fs.existsSync(baseAbs) ? fs.readdirSync(baseAbs, { withFileTypes: true }) : [];
      for (const entry of entries) {
        if (entry.isDirectory()) {
          walk(path.join(baseAbs, entry.name), `${rel ? rel + '/' : ''}${entry.name}`);
        }
      }
    };

    subdirs.forEach((sub) => {
      const root = path.join(outputDir, sub);
      if (!fs.existsSync(root)) return;
      walk(root, '');
    });

    // Convert discovered relative paths into absolute canonical URLs under BASE_URL
    const urls = found.map(rel => `${URL_CONFIG.BASE_URL}/${rel.startsWith('categories') || rel.startsWith('tags') ? rel : rel}`);

    return Array.from(new Set(urls));
  }

  /**
   * Split URLs into chunks for multiple sitemaps
   */
  private static chunkURLs(urls: SitemapURL[]): SitemapURL[][] {
    const chunks: SitemapURL[][] = [];
    for (let i = 0; i < urls.length; i += this.MAX_URLS_PER_SITEMAP) {
      chunks.push(urls.slice(i, i + this.MAX_URLS_PER_SITEMAP));
    }
    return chunks;
  }

  /**
   * Generate robots.txt content with sitemap references
   */
  private static generateRobotsTxt(sitemapFiles: string[]): string {
    const currentDate = new Date().toISOString().split('T')[0];
    
    let robotsContent = `# Robots.txt for ${URL_CONFIG.BASE_URL}
# Generated on ${currentDate}

User-agent: *
Allow: /

# Enhanced crawling directives
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

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
Allow: /alternatives

# Sitemap locations
`;

    sitemapFiles.forEach(filename => {
      robotsContent += `Sitemap: ${URL_CONFIG.BASE_URL}/${filename}\n`;
    });

    return robotsContent;
  }

  /**
   * Generate comprehensive sitemap(s) and save to directory
   */
  public static generateSitemaps(outputDir: string): {
    sitemapFiles: string[];
    totalURLs: number;
    robotsTxtGenerated: boolean;
  } {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Collect all URLs
    const allURLs = this.collectAllURLs();

    // Discover dynamic category/tag paths from built dist to ensure full coverage
    const discoveredFromDist = this.discoverDynamicPathsFromDist(outputDir, ['categories', 'tags']);
    discoveredFromDist.forEach(loc => {
      allURLs.push({
        loc,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: loc.includes('/categories/') ? 0.8 : 0.7
      });
    });

    console.log(`📊 Collected ${allURLs.length} URLs for sitemap generation (including ${discoveredFromDist.length} discovered from dist)`);

    // Remove duplicates
    const uniqueURLs = allURLs.filter((url, index, self) => 
      index === self.findIndex(u => u.loc === url.loc)
    );

    if (uniqueURLs.length !== allURLs.length) {
      console.log(`🔄 Removed ${allURLs.length - uniqueURLs.length} duplicate URLs`);
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const sitemapFiles: string[] = [];

    if (uniqueURLs.length <= this.MAX_URLS_PER_SITEMAP) {
      // Single sitemap
      const sitemapXML = this.generateSitemapXML(uniqueURLs);
      const filename = 'sitemap.xml';
      fs.writeFileSync(path.join(outputDir, filename), sitemapXML, 'utf8');
      sitemapFiles.push(filename);
      console.log(`✅ Generated single sitemap: ${filename} (${uniqueURLs.length} URLs)`);
    } else {
      // Multiple sitemaps + index
      const urlChunks = this.chunkURLs(uniqueURLs);
      
      urlChunks.forEach((chunk, index) => {
        const filename = `sitemap-${index + 1}.xml`;
        const sitemapXML = this.generateSitemapXML(chunk);
        fs.writeFileSync(path.join(outputDir, filename), sitemapXML, 'utf8');
        sitemapFiles.push(filename);
        console.log(`✅ Generated sitemap: ${filename} (${chunk.length} URLs)`);
      });

      // Generate sitemap index
      const sitemapIndexData = sitemapFiles.map(filename => ({
        filename,
        lastmod: currentDate
      }));
      
      const sitemapIndexXML = this.generateSitemapIndexXML(sitemapIndexData);
      const indexFilename = 'sitemap-index.xml';
      fs.writeFileSync(path.join(outputDir, indexFilename), sitemapIndexXML, 'utf8');
      sitemapFiles.push(indexFilename);
      console.log(`✅ Generated sitemap index: ${indexFilename}`);

      // Also create a main sitemap.xml pointing to the index
      const mainSitemapContent = sitemapIndexXML;
      fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), mainSitemapContent, 'utf8');
      console.log(`✅ Generated main sitemap.xml (points to index)`);
    }

    // Generate robots.txt
    const robotsTxtContent = this.generateRobotsTxt(sitemapFiles);
    fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsTxtContent, 'utf8');
    console.log(`✅ Generated robots.txt with sitemap references`);

    return {
      sitemapFiles,
      totalURLs: uniqueURLs.length,
      robotsTxtGenerated: true
    };
  }

  /**
   * Validate generated sitemap files
   */
  public static validateSitemaps(outputDir: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const sitemapPath = path.join(outputDir, 'sitemap.xml');
      if (!fs.existsSync(sitemapPath)) {
        errors.push('Main sitemap.xml file not found');
        return { valid: false, errors, warnings };
      }

      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      
      // Basic XML validation
      if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        errors.push('Missing or invalid XML declaration');
      }

      if (!sitemapContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        errors.push('Missing or invalid sitemap namespace');
      }

      // Count URLs
      const urlMatches = sitemapContent.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;
      
      if (urlCount === 0) {
        errors.push('No URLs found in sitemap');
      } else if (urlCount > this.MAX_URLS_PER_SITEMAP) {
        warnings.push(`Sitemap contains ${urlCount} URLs, exceeding recommended limit of ${this.MAX_URLS_PER_SITEMAP}`);
      }

      // Check for required elements
      const requiredElements = ['<loc>', '<lastmod>', '<changefreq>', '<priority>'];
      requiredElements.forEach(element => {
        if (!sitemapContent.includes(element)) {
          warnings.push(`Missing ${element} elements in sitemap`);
        }
      });

      console.log(`🔍 Sitemap validation: ${errors.length} errors, ${warnings.length} warnings`);
      
    } catch (error) {
      errors.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}