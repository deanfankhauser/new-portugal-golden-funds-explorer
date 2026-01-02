/**
 * Comprehensive Sitemap Service - BUILD-TIME ONLY
 * This file uses Node.js-only modules (fs, path) and should NEVER be imported by client code
 */
import fs from 'fs';
import path from 'path';
import { fetchAllBuildDataCached } from '../../../src/lib/build-data-fetcher';
import { generateComparisonsFromFunds } from '../../../src/data/services/comparison-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../../../src/lib/utils';

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
  private static readonly PRODUCTION_BASE_URL = 'https://funds.movingto.com';

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
      let normalized = urlObj.toString();
      if (normalized.endsWith('/') && normalized !== this.PRODUCTION_BASE_URL + '/') {
        normalized = normalized.slice(0, -1);
      }
      return normalized;
    } catch {
      let cleanUrl = url.startsWith('/') ? url : `/${url}`;
      if (cleanUrl.endsWith('/') && cleanUrl !== '/') {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      return `${this.PRODUCTION_BASE_URL}${cleanUrl}`;
    }
  }

  /**
   * Format date for sitemap (YYYY-MM-DD format)
   */
  private static formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date.split('T')[0];
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
      const sitemapURL = `${this.PRODUCTION_BASE_URL}/${sitemap.filename}`;
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
  private static async collectAllURLs(): Promise<SitemapURL[]> {
    const urls: SitemapURL[] = [];
    const currentDate = new Date().toISOString().split('T')[0];
    
    console.log(`🗺️  Generating sitemap URLs with BASE_URL: ${this.PRODUCTION_BASE_URL}`);
    
    // Fetch all data from database (cached)
    console.log('📊 Fetching data from database for sitemap generation...');
    const { funds, categories, tags, managers, teamMembers } = await fetchAllBuildDataCached();
    console.log(`✅ Loaded ${funds.length} funds, ${categories.length} categories, ${tags.length} tags, ${managers.length} managers, ${teamMembers.length} team members from database`);

    // Homepage
    urls.push({
      loc: this.PRODUCTION_BASE_URL,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    });

    // Static pages
    const staticPages = [
      { path: '/about', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/disclaimer', priority: 0.3, changefreq: 'monthly' as const },
      { path: '/privacy', priority: 0.3, changefreq: 'monthly' as const },
      { path: '/faqs', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/roi-calculator', priority: 0.6, changefreq: 'monthly' as const }
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${this.PRODUCTION_BASE_URL}${page.path}`,
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
        loc: `${this.PRODUCTION_BASE_URL}${hub.path}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: hub.priority
      });
    });

    // Fund detail pages
    funds.forEach(fund => {
      urls.push({
        loc: `${this.PRODUCTION_BASE_URL}/${fund.id}`,
        lastmod: fund.dateModified || currentDate,
        changefreq: 'weekly',
        priority: fund.fundStatus === 'Open' ? 0.9 : fund.fundStatus === 'Closing Soon' ? 0.95 : 0.8
      });
    });

    // Category pages
    categories.forEach(category => {
      const slug = categoryToSlug(category);
      urls.push({
        loc: `${this.PRODUCTION_BASE_URL}/categories/${slug}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Tag pages
    try {
      const { getFundsByTag } = await import('../../../src/data/services/tags-service');
      tags.forEach(tag => {
        const fundsWithTag = getFundsByTag(funds, tag);
        if (fundsWithTag.length > 0) {
          const slug = tagToSlug(tag);
          urls.push({
            loc: `${this.PRODUCTION_BASE_URL}/tags/${slug}`,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: 0.7
          });
        }
      });
    } catch (error) {
      console.warn('Failed to generate tag URLs:', error);
    }

    // Manager pages
    managers.forEach(manager => {
      const slug = managerToSlug(manager.name);
      urls.push({
        loc: `${this.PRODUCTION_BASE_URL}/manager/${slug}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Team member profile pages - filter by indexability
    const { isGoneTeamMember } = await import('../../../src/lib/gone-slugs');
    const { checkTeamMemberIndexability } = await import('../../../src/lib/indexability/checks');
    
    const indexableTeamMembers = teamMembers.filter(member => {
      // Skip gone team members
      if (isGoneTeamMember(member.slug)) return false;
      
      const result = checkTeamMemberIndexability({
        name: member.name,
        role: member.role,
        bio: member.bio
      });
      return result.isIndexable;
    });
    
    console.log(`📄 Team members: ${indexableTeamMembers.length} indexable (${teamMembers.length - indexableTeamMembers.length} excluded from sitemap)`);
    
    indexableTeamMembers.forEach(member => {
      urls.push({
        loc: `${this.PRODUCTION_BASE_URL}/team/${member.slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      });
    });

    // Comparison pages
    try {
      const comparisons = generateComparisonsFromFunds(funds);
      comparisons.forEach(comparison => {
        urls.push({
          loc: `${this.PRODUCTION_BASE_URL}/compare/${comparison.slug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.85
        });
      });
    } catch (error) {
      console.warn('Failed to generate comparison URLs:', error);
    }

    // Fund alternatives pages
    funds.forEach(fund => {
      urls.push({
        loc: `${this.PRODUCTION_BASE_URL}/${fund.id}/alternatives`,
        lastmod: fund.dateModified || currentDate,
        changefreq: 'weekly',
        priority: 0.7
      });
    });

    return urls;
  }

  /**
   * Extract canonical URL from HTML content
   */
  private static extractCanonicalURL(htmlContent: string): string | null {
    const canonicalMatch = htmlContent.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    return canonicalMatch ? canonicalMatch[1] : null;
  }

  /**
   * Check if a page has a non-self-referencing canonical tag
   */
  private static hasNonSelfReferencingCanonical(htmlPath: string, expectedURL: string): boolean {
    try {
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
      const canonicalURL = this.extractCanonicalURL(htmlContent);
      
      if (!canonicalURL) {
        return false;
      }
      
      const normalizedCanonical = canonicalURL.toLowerCase().replace(/\/$/, '');
      const normalizedExpected = expectedURL.toLowerCase().replace(/\/$/, '');
      
      return normalizedCanonical !== normalizedExpected;
    } catch (error) {
      console.warn(`⚠️  Could not read HTML file: ${htmlPath}`, error);
      return false;
    }
  }

  /**
   * Discover dynamic routes from built dist folder
   */
  private static discoverDynamicPathsFromDist(outputDir: string, subdirs: string[]): string[] {
    const found: Array<{ path: string; htmlPath: string }> = [];

    const hasIndexHtml = (dir: string) => fs.existsSync(path.join(dir, 'index.html'));

    const walk = (baseAbs: string, rel: string, subdir: string) => {
      if (rel && hasIndexHtml(baseAbs)) {
        const fullPath = `${subdir}/${rel}`.replace(/\\/g, '/');
        const htmlPath = path.join(baseAbs, 'index.html');
        found.push({ path: fullPath, htmlPath });
      }
      const entries = fs.existsSync(baseAbs) ? fs.readdirSync(baseAbs, { withFileTypes: true }) : [];
      for (const entry of entries) {
        if (entry.isDirectory()) {
          walk(path.join(baseAbs, entry.name), `${rel ? rel + '/' : ''}${entry.name}`, subdir);
        }
      }
    };

    subdirs.forEach((sub) => {
      const root = path.join(outputDir, sub);
      if (!fs.existsSync(root)) return;
      walk(root, '', sub);
    });

    let excludedCount = 0;
    const validPaths = found.filter(({ path: relPath, htmlPath }) => {
      const expectedURL = `${this.PRODUCTION_BASE_URL}/${relPath}`;
      const shouldExclude = this.hasNonSelfReferencingCanonical(htmlPath, expectedURL);
      
      if (shouldExclude) {
        excludedCount++;
        console.log(`🚫 Excluding legacy slug alias from sitemap: ${expectedURL}`);
      }
      
      return !shouldExclude;
    });

    if (excludedCount > 0) {
      console.log(`✅ Excluded ${excludedCount} legacy slug alias pages from sitemap`);
    }

    const urls = validPaths.map(({ path: relPath }) => `${this.PRODUCTION_BASE_URL}/${relPath}`);

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
   * Generate robots.txt content
   */
  private static generateRobotsTxt(sitemapFiles: string[]): string {
    const currentDate = new Date().toISOString().split('T')[0];
    
    let robotsContent = `# Robots.txt for ${this.PRODUCTION_BASE_URL}
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
Disallow: /api/

# Allow important pages
Allow: /categories
Allow: /tags
Allow: /managers
Allow: /comparisons
Allow: /alternatives

# Sitemap locations
`;

    sitemapFiles.forEach(filename => {
      robotsContent += `Sitemap: ${this.PRODUCTION_BASE_URL}/${filename}\n`;
    });

    return robotsContent;
  }

  /**
   * Verify all expected dynamic routes are included
   */
  private static async verifyAndAddMissingRoutes(allURLs: SitemapURL[]): Promise<SitemapURL[]> {
    const currentDate = new Date().toISOString().split('T')[0];
    const existingURLs = new Set(allURLs.map(url => url.loc));
    const missingURLs: SitemapURL[] = [];
    
    const { categories, tags, funds } = await fetchAllBuildDataCached();

    // Verify all categories are included
    categories.forEach(category => {
      const slug = categoryToSlug(category);
      const expectedURL = `${this.PRODUCTION_BASE_URL}/categories/${slug}`;
      if (!existingURLs.has(expectedURL)) {
        console.warn(`⚠️  Missing category route: ${expectedURL}`);
        missingURLs.push({
          loc: expectedURL,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        });
      }
    });

    // Verify all tags with funds are included
    try {
      const { getFundsByTag } = await import('../../../src/data/services/tags-service');
      tags.forEach(tag => {
        const fundsWithTag = getFundsByTag(funds, tag);
        if (fundsWithTag.length > 0) {
          const slug = tagToSlug(tag);
          const expectedURL = `${this.PRODUCTION_BASE_URL}/tags/${slug}`;
          if (!existingURLs.has(expectedURL)) {
            console.warn(`⚠️  Missing tag route: ${expectedURL}`);
            missingURLs.push({
              loc: expectedURL,
              lastmod: currentDate,
              changefreq: 'weekly',
              priority: 0.7
            });
          }
        }
      });
    } catch (error) {
      console.warn('Failed to verify tag routes:', error);
    }

    if (missingURLs.length > 0) {
      console.log(`🔍 Added ${missingURLs.length} missing dynamic routes to sitemap`);
      return [...allURLs, ...missingURLs];
    }

    console.log(`✅ All expected dynamic routes are present in sitemap`);
    return allURLs;
  }

  /**
   * Generate comprehensive sitemap(s) and save to directory
   */
  public static async generateSitemaps(outputDir: string): Promise<{
    sitemapFiles: string[];
    totalURLs: number;
    robotsTxtGenerated: boolean;
  }> {
    console.log('🗺️  Starting comprehensive sitemap generation...');
    
    // Collect all URLs from database
    let allURLs = await this.collectAllURLs();
    console.log(`📊 Collected ${allURLs.length} URLs from database`);

    // Discover additional paths from dist folder
    const discoveredPaths = this.discoverDynamicPathsFromDist(outputDir, [
      'categories', 'tags', 'manager', 'team', 'compare'
    ]);
    console.log(`🔍 Discovered ${discoveredPaths.length} additional paths from dist folder`);

    // Merge discovered paths (avoiding duplicates)
    const existingLocs = new Set(allURLs.map(u => u.loc));
    const currentDate = new Date().toISOString().split('T')[0];
    
    discoveredPaths.forEach(loc => {
      if (!existingLocs.has(loc)) {
        allURLs.push({
          loc,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.6
        });
      }
    });

    // Verify and add any missing routes
    allURLs = await this.verifyAndAddMissingRoutes(allURLs);

    // Sort URLs for consistency
    allURLs.sort((a, b) => a.loc.localeCompare(b.loc));

    console.log(`📊 Total URLs for sitemap: ${allURLs.length}`);

    // Split into chunks if needed
    const chunks = this.chunkURLs(allURLs);
    const sitemapFiles: string[] = [];
    const currentDateStr = new Date().toISOString().split('T')[0];

    if (chunks.length === 1) {
      // Single sitemap
      const xml = this.generateSitemapXML(chunks[0]);
      fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), xml);
      sitemapFiles.push('sitemap.xml');
      console.log(`✅ Generated sitemap.xml with ${chunks[0].length} URLs`);
    } else {
      // Multiple sitemaps with index
      chunks.forEach((chunk, index) => {
        const filename = `sitemap-${index + 1}.xml`;
        const xml = this.generateSitemapXML(chunk);
        fs.writeFileSync(path.join(outputDir, filename), xml);
        sitemapFiles.push(filename);
        console.log(`✅ Generated ${filename} with ${chunk.length} URLs`);
      });

      // Generate sitemap index
      const indexXML = this.generateSitemapIndexXML(
        sitemapFiles.map(f => ({ filename: f, lastmod: currentDateStr }))
      );
      fs.writeFileSync(path.join(outputDir, 'sitemap-index.xml'), indexXML);
      sitemapFiles.unshift('sitemap-index.xml');
      console.log(`✅ Generated sitemap-index.xml referencing ${chunks.length} sitemaps`);
    }

    // Generate robots.txt
    const robotsTxt = this.generateRobotsTxt(sitemapFiles);
    fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsTxt);
    console.log(`✅ Generated robots.txt`);

    return {
      sitemapFiles,
      totalURLs: allURLs.length,
      robotsTxtGenerated: true
    };
  }

  /**
   * Validate generated sitemaps
   */
  public static validateSitemaps(outputDir: string): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const sitemapPath = path.join(outputDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      errors.push('sitemap.xml not found');
      return { valid: false, errors, warnings };
    }

    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    if (!content.includes('<?xml version=')) {
      errors.push('Missing XML declaration');
    }
    
    if (!content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push('Missing sitemap namespace');
    }
    
    if (!content.includes('<url>')) {
      errors.push('No URL entries found');
    }

    const urlCount = (content.match(/<url>/g) || []).length;
    if (urlCount < 10) {
      warnings.push(`Low URL count: ${urlCount}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
