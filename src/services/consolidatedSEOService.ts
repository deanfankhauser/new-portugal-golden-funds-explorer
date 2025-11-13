import { SEOData } from '../types/seo';
import { URL_CONFIG } from '../utils/urlConfig';
import { Fund } from '../data/types/funds';
import { normalizeComparisonSlug } from '../utils/comparisonUtils';
import { parseComparisonSlug } from '../data/services/comparison-service';
import { InvestmentFundStructuredDataService } from './investmentFundStructuredDataService';
import { EnhancedStructuredDataService } from './enhancedStructuredDataService';


export class ConsolidatedSEOService {
  private static readonly DEFAULT_IMAGE = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
  private static readonly MAX_TITLE_LENGTH = 60;
  private static readonly MAX_DESCRIPTION_LENGTH = 155;

  // Clean up duplicate meta tags
  static cleanup(): void {
    // Remove duplicate and empty title tags
    const titles = document.querySelectorAll('title');
    if (titles.length > 1) {
      // Remove empty titles first
      titles.forEach(title => {
        if (!title.textContent?.trim()) {
          title.remove();
        }
      });
      
      // If still duplicates, keep only the first meaningful one
      const remainingTitles = document.querySelectorAll('title');
      if (remainingTitles.length > 1) {
        for (let i = 1; i < remainingTitles.length; i++) {
          remainingTitles[i].remove();
        }
      }
    }

    // Remove duplicate viewports
    const viewports = document.querySelectorAll('meta[name="viewport"]');
    if (viewports.length > 1) {
      for (let i = 1; i < viewports.length; i++) {
        viewports[i].remove();
      }
    }

    // Remove duplicate descriptions
    const descriptions = document.querySelectorAll('meta[name="description"]');
    if (descriptions.length > 1) {
      for (let i = 1; i < descriptions.length; i++) {
        descriptions[i].remove();
      }
    }

    // Remove duplicate canonicals
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    if (canonicals.length > 1) {
      for (let i = 1; i < canonicals.length; i++) {
        canonicals[i].remove();
      }
    }

    // Clean up only managed structured data, preserve others (like FAQ schemas)
    const managedSchemas = document.querySelectorAll('script[type="application/ld+json"][data-managed="consolidated-seo"]');
    managedSchemas.forEach(script => script.remove());
    
    // Remove duplicate robots meta tags (keep only one)
    const robotsTags = document.querySelectorAll('meta[name="robots"]');
    robotsTags.forEach((robot, index) => {
      if (index > 0) robot.remove();
    });
    
    // If we're about to inject new JSON-LD and there are existing ones, replace or skip to prevent duplication
    const existingJsonLd = document.querySelectorAll('script[type="application/ld+json"]:not([data-managed])');
    if (existingJsonLd.length > 0) {
      // Mark existing as managed to prevent duplication
      existingJsonLd.forEach(script => script.setAttribute('data-managed', 'legacy'));
    }
  }

  // Optimize title and description
  static optimizeText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLength * 0.8 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  // Generate optimized fund title with key metrics
  private static generateFundTitle(fund: any): string {
    const parts: string[] = [fund.name];
    
    // Add category for context
    if (fund.category) {
      parts.push(fund.category);
    }
    
    // Add minimum investment if competitive
    if (fund.minimumInvestment && fund.minimumInvestment <= 500000) {
      const minInvestFormatted = fund.minimumInvestment >= 1000000 
        ? `€${(fund.minimumInvestment / 1000000).toFixed(1)}M`
        : `€${(fund.minimumInvestment / 1000).toFixed(0)}k`;
      parts.push(`from ${minInvestFormatted}`);
    }
    
    // Add key differentiators
    if (fund.tags?.includes('UCITS')) parts.push('UCITS');
    if (fund.tags?.includes('Daily NAV') || fund.tags?.includes('No Lock-Up')) {
      parts.push('Liquid');
    }
    
    return `${parts.join(' | ')} | Portugal Golden Visa Fund | Movingto`;
  }

  // Generate optimized fund description with USPs and performance
  private static generateFundDescription(fund: any): string {
    const parts: string[] = [];
    
    // Start with fund name and manager for brand recognition
    parts.push(`${fund.name} by ${fund.managerName}:`);
    
    // Add historical performance if available (high-impact SEO)
    if (fund.historicalPerformance && typeof fund.historicalPerformance === 'object') {
      const performanceData = Object.entries(fund.historicalPerformance)
        .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA));
      
      if (performanceData.length > 0) {
        const [latestYear, latestData]: [string, any] = performanceData[0];
        if (latestData && latestData.returns) {
          parts.push(`${latestData.returns}% returns in ${latestYear}`);
        }
      }
    }
    
    // Add minimum investment
    const minInvest = fund.minimumInvestment >= 1000000 
      ? `€${(fund.minimumInvestment / 1000000).toFixed(1)}M`
      : `€${(fund.minimumInvestment / 1000).toFixed(0)}k`;
    parts.push(`${minInvest} minimum`);
    
    // Add return target if available
    if (fund.returnTarget) {
      parts.push(`${fund.returnTarget} target`);
    }
    
    // Add management fee
    if (fund.managementFee) {
      parts.push(`${fund.managementFee}% fee`);
    }
    
    // Add risk level for investor matching
    if (fund.riskLevel) {
      parts.push(`${fund.riskLevel.toLowerCase()}-risk`);
    }
    
    // Add key USPs
    const usps: string[] = [];
    if (fund.tags?.includes('UCITS')) usps.push('UCITS regulated');
    if (fund.tags?.includes('Daily NAV')) usps.push('daily liquidity');
    if (fund.tags?.includes('No Lock-Up')) usps.push('no lock-up');
    if (fund.tags?.includes('PFIC-Compliant')) usps.push('PFIC-compliant');
    
    if (usps.length > 0) {
      parts.push(usps.slice(0, 2).join(', '));
    }
    
    // Add Portugal Golden Visa context
    parts.push(`Portugal Golden Visa eligible ${fund.category.toLowerCase()} fund`);
    
    return parts.join('. ') + '.';
  }

  // Generate dynamic keywords based on fund characteristics
  private static generateFundKeywords(fund: any): string[] {
    const keywords: string[] = [
      'Portugal Golden Visa',
      fund.name,
      fund.category,
      fund.managerName,
      'investment fund Portugal'
    ];
    
    // Add minimum investment range keywords
    if (fund.minimumInvestment) {
      if (fund.minimumInvestment <= 350000) keywords.push('low minimum investment');
      if (fund.minimumInvestment === 500000) keywords.push('€500k Golden Visa fund');
    }
    
    // Add liquidity keywords
    if (fund.tags?.includes('Daily NAV') || fund.tags?.includes('No Lock-Up')) {
      keywords.push('liquid investment', 'daily redemption', 'no lock-up period');
    }
    
    // Add regulatory keywords
    if (fund.tags?.includes('UCITS')) {
      keywords.push('UCITS fund', 'regulated fund', 'EU regulated investment');
    }
    
    if (fund.tags?.includes('PFIC-Compliant')) {
      keywords.push('PFIC compliant', 'US investor friendly', 'QEF eligible');
    }
    
    // Add performance keywords
    if (fund.returnTarget) {
      keywords.push(`${fund.returnTarget} returns`, 'fund performance');
    }
    
    // Add sector keywords
    if (fund.tags?.includes('Real Estate')) keywords.push('real estate fund Portugal');
    if (fund.tags?.includes('Venture Capital')) keywords.push('venture capital Portugal');
    if (fund.tags?.includes('Private Equity')) keywords.push('private equity Portugal');
    if (fund.tags?.includes('Sustainability')) keywords.push('ESG fund', 'sustainable investment');
    
    // Add investor type keywords
    if (fund.tags?.includes('Golden Visa funds for U.S. citizens')) {
      keywords.push('US citizen Golden Visa');
    }
    
    return keywords;
  }

  // Get SEO data for different page types
  static getSEOData(pageType: string, params: any = {}, funds?: Fund[]): SEOData {
    const baseUrl = URL_CONFIG.BASE_URL;
    
    switch (pageType) {
      case 'homepage':
        return {
          title: this.optimizeText('Portugal Golden Visa Funds 2025 | Compare 28+ Investment Options', 60),
          description: this.optimizeText('Discover and compare Portugal Golden Visa Investment Funds. Comprehensive analysis, performance data, and expert insights for qualified Golden Visa investment decisions.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/'),
          structuredData: this.getHomepageStructuredData(funds)
        };

      case 'fund':
      case 'fund-details':
        const fund = funds 
          ? funds.find(f => f.id === params.fundName || f.name === params.fundName)
          : this.getFundByName(params.fundName);
        if (!fund) return this.getSEOData('homepage', {}, funds);
        
        // Generate dynamic, metric-rich title and description
        const fundTitle = this.generateFundTitle(fund);
        const fundDescription = this.generateFundDescription(fund);
        const fundKeywords = this.generateFundKeywords(fund);
        
        return {
          title: this.optimizeText(fundTitle, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(fundDescription, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildFundUrl(fund.id),
          keywords: fundKeywords,
          structuredData: this.getFundStructuredData(fund)
        };

      case 'category':
        return {
          title: this.optimizeText(`${params.categoryName} Portugal Golden Visa Investment Funds | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Discover ${params.categoryName} Portugal Golden Visa investment funds. Compare minimum investments, returns, fees, and eligibility for residency applications.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildCategoryUrl(params.categoryName),
          keywords: [
            `${params.categoryName} Golden Visa funds`,
            `${params.categoryName} investment Portugal`,
            `Portugal ${params.categoryName} funds`,
            'Golden Visa investment categories',
            `${params.categoryName} fund comparison`
          ],
          structuredData: this.getCategoryStructuredData(params.categoryName, params.funds || [])
        };

      case 'tag':
        return {
          title: this.optimizeText(`${params.tagName} Portugal Golden Visa Investment Funds | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Explore ${params.tagName} Portugal Golden Visa investment funds. Compare minimum investments, returns, and Golden Visa eligibility requirements.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildTagUrl(params.tagName),
          keywords: [
            `${params.tagName} Golden Visa funds`,
            `${params.tagName} investment funds Portugal`,
            'Golden Visa fund characteristics',
            `${params.tagName} fund features`,
            'Portugal investment fund tags'
          ],
          structuredData: this.getTagStructuredData(params.tagName, params.funds || [])
        };

      case 'manager':
        return {
          title: this.optimizeText(`${params.managerName} | Portugal Golden Visa Fund Manager | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Profile and Portugal Golden Visa investment funds managed by ${params.managerName}. Track record, investment philosophy, and fund performance.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildManagerUrl(params.managerName),
          keywords: [
            `${params.managerName}`,
            'Portugal fund manager',
            'Golden Visa fund manager',
            'investment fund management Portugal',
            'fund manager profile',
            'Golden Visa investment professionals'
          ],
          structuredData: this.getManagerStructuredData(params.managerName)
        };

      case 'comparison':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparison Tool | Compare Investment Funds | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare Portugal Golden Visa investment funds side by side. Analyze performance, fees, risk profiles and make informed Golden Visa investment decisions.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/compare'),
          keywords: [
            'Golden Visa fund comparison',
            'compare investment funds Portugal',
            'fund comparison tool',
            'investment fund analysis',
            'Golden Visa fund comparison tool',
            'side-by-side fund comparison'
          ],
          structuredData: this.getComparisonStructuredData()
        };

      case 'fund-comparison':
        const normalizedSlug = normalizeComparisonSlug(params.comparisonSlug || '');
        const slugData = parseComparisonSlug(normalizedSlug);
        
        if (slugData && funds) {
          const fund1 = funds.find(f => f.id === slugData.fund1Id);
          const fund2 = funds.find(f => f.id === slugData.fund2Id);
          
          if (fund1 && fund2) {
            return {
              title: this.optimizeText(`${fund1.name} vs ${fund2.name} Comparison | Portugal Golden Visa Funds 2025`, this.MAX_TITLE_LENGTH),
              description: this.optimizeText(`Compare ${fund1.name} (${fund1.managerName}) vs ${fund2.name} (${fund2.managerName}) Portugal Golden Visa funds. Side-by-side analysis of fees, minimum investment, returns, and performance metrics.`, this.MAX_DESCRIPTION_LENGTH),
              url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
              keywords: [
                `${fund1.name} vs ${fund2.name}`,
                'Golden Visa fund comparison',
                'investment fund analysis',
                `${fund1.managerName}`,
                `${fund2.managerName}`,
                'fund performance comparison'
              ],
              structuredData: this.getFundComparisonStructuredData(fund1, fund2)
            };
          }
        }
        
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparison | Investment Analysis 2025', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare Portugal Golden Visa investment funds side-by-side. Detailed analysis of fees, returns, minimum investment, and fund performance metrics.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
          keywords: [
            'Golden Visa fund comparison',
            'investment fund analysis',
            'compare funds Portugal',
            'fund comparison tool',
            'investment analysis'
          ],
          structuredData: this.getGenericComparisonStructuredData()
        };

      case 'roi-calculator':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund ROI Calculator | Investment Returns | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Calculate potential returns on Portugal Golden Visa investment funds. Compare different funds and investment scenarios for Golden Visa investments.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('roi-calculator'),
          keywords: [
            'ROI calculator',
            'investment returns calculator',
            'Golden Visa ROI',
            'fund returns calculation',
            'investment calculator Portugal',
            'Golden Visa returns'
          ],
          structuredData: this.getCalculatorStructuredData()
        };

      case '404':
        return {
          title: this.optimizeText('Page Not Found | Portugal Investment Funds | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('The page you are looking for could not be found. Explore our investment funds.', this.MAX_DESCRIPTION_LENGTH),
          url: `${baseUrl}/404`,
          structuredData: this.getHomepageStructuredData()
        };

      case 'managers-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Managers | Investment Professionals | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Directory of Portugal Golden Visa fund managers. Find experienced investment professionals managing Golden Visa eligible funds.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('managers'),
          keywords: [
            'fund managers Portugal',
            'Golden Visa fund managers',
            'investment professionals Portugal',
            'fund management companies',
            'Portuguese fund managers directory',
            'investment fund professionals'
          ],
          structuredData: this.getManagersHubStructuredData()
        };

      case 'categories-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Categories | Investment Types | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Browse Portugal Golden Visa investment fund categories. Explore different investment types and strategies for Golden Visa programs.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('categories'),
          keywords: [
            'fund categories',
            'investment types Portugal',
            'Golden Visa fund categories',
            'fund classification',
            'investment strategies Portugal',
            'fund types'
          ],
          structuredData: this.getCategoriesHubStructuredData()
        };

      case 'tags-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Tags | Investment Characteristics | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Explore Portugal Golden Visa investment funds by characteristics and tags. Find Golden Visa funds that match your criteria.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('tags'),
          keywords: [
            'fund characteristics',
            'investment tags',
            'fund features',
            'Golden Visa fund attributes',
            'investment fund filters',
            'fund search criteria'
          ],
          structuredData: this.getTagsHubStructuredData()
        };

      case 'alternatives-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Alternatives Hub | Compare Investment Options | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Explore alternative Portugal Golden Visa investment funds for every fund in our database. Find similar Golden Visa fund options based on category, risk level, and investment requirements.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/alternatives'),
          keywords: [
            'fund alternatives',
            'similar investment funds',
            'alternative funds Portugal',
            'comparable Golden Visa funds',
            'fund substitutes',
            'investment alternatives'
          ],
          structuredData: this.getAlternativesHubStructuredData(funds)
        };

      case 'comparisons-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparisons | Investment Analysis Hub | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Hub for comparing Portugal Golden Visa investment funds. Access Golden Visa fund comparison tools and analysis.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('comparisons'),
          keywords: [
            'fund comparison hub',
            'investment analysis tools',
            'Golden Visa comparisons',
            'fund analysis hub',
            'comparison tools Portugal',
            'investment fund comparisons'
          ],
          structuredData: this.getComparisonsHubStructuredData(funds)
        };

      case 'about':
        return {
          title: this.optimizeText('About | Portugal Golden Visa Investment Fund Analysis Platform | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Learn about our platform for analyzing Portugal Golden Visa investment funds. Expert Golden Visa fund analysis.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('about'),
          keywords: [
            'about Movingto',
            'Portugal Golden Visa platform',
            'investment fund comparison platform',
            'Golden Visa analysis tool',
            'fund research platform',
            'investment platform Portugal'
          ],
          structuredData: this.getAboutStructuredData()
        };

      case 'disclaimer':
        return {
          title: this.optimizeText('Disclaimer | Portugal Golden Visa Investment Information | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Important disclaimer regarding Portugal Golden Visa investment information. Please read our terms.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('disclaimer'),
          keywords: [
            'investment disclaimer',
            'Golden Visa terms',
            'fund information disclaimer',
            'investment risk warning',
            'legal disclaimer Portugal',
            'investment terms conditions'
          ],
          structuredData: this.getDisclaimerStructuredData()
        };

      case 'faqs':
        return {
          title: this.optimizeText('FAQs | Portugal Golden Visa Investment Fund Questions | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Frequently asked questions about Portugal Golden Visa investment funds. Get answers about Golden Visa programs.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('faqs'),
          keywords: [
            'Golden Visa FAQs',
            'investment fund questions',
            'Portugal residency FAQ',
            'Golden Visa answers',
            'fund investment questions',
            'Portugal visa questions'
          ],
          structuredData: this.getFAQStructuredData()
        };

      case 'privacy':
        return {
          title: this.optimizeText('Privacy Policy | Portugal Golden Visa Investment Fund Platform | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Privacy policy for our Portugal Golden Visa investment fund platform. Learn how we protect your data while helping you find the right investment funds.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('privacy'),
          keywords: [
            'privacy policy',
            'data protection',
            'investor privacy',
            'GDPR compliance',
            'data security Portugal',
            'privacy terms'
          ],
          structuredData: this.getPrivacyStructuredData()
        };

      case 'fund-alternatives':
        const altFund = this.getFundByName(params.fundName);
        if (!altFund) return this.getSEOData('homepage');
        
        return {
          title: this.optimizeText(`${altFund.name} Alternatives | Similar Portugal Golden Visa Funds | Movingto`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Discover investment alternatives to ${altFund.name}. Compare similar Portugal Golden Visa eligible funds with matching investment profiles and characteristics.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildFundUrl(altFund.id),
          canonical: URL_CONFIG.buildFundUrl(altFund.id),
          robots: 'noindex,follow',
          keywords: [
            `${altFund.name} alternatives`,
            'similar funds',
            'comparable investment funds',
            'alternative Golden Visa funds',
            `${altFund.category} alternatives`,
            'fund substitutes Portugal'
          ],
          structuredData: this.getFundAlternativesStructuredData(altFund)
        };

      case 'verified-funds':
        return {
          title: this.optimizeText('Verified Portugal Golden Visa Funds | Fully Documented Investments | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Browse verified Portugal Golden Visa investment funds with complete regulatory documentation, CMVM registration, and third-party validation. All funds independently verified for transparency and investor confidence.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/verified-funds'),
          keywords: [
            'verified Golden Visa funds',
            'Portugal verified investments',
            'CMVM registered funds',
            'documented investment funds',
            'transparent Golden Visa funds',
            'validated investment funds Portugal'
          ],
          structuredData: this.getVerifiedFundsStructuredData(funds)
        };

      case 'verification-program':
        return {
          title: this.optimizeText('Fund Verification Program | Independent Investment Validation | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Learn about our independent verification program for Portugal Golden Visa funds. 6-point verification process including regulatory status, documentation review, and Golden Visa eligibility validation.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/verification-program'),
          keywords: [
            'fund verification program',
            'investment validation',
            'due diligence process',
            'fund documentation review',
            'CMVM verification',
            'investment transparency Portugal'
          ],
          structuredData: this.getVerificationProgramStructuredData()
        };

      case 'saved-funds':
        return {
          title: this.optimizeText('My Saved Funds | Portugal Golden Visa Investment Portfolio | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Access your saved Portugal Golden Visa investment funds. Compare your shortlisted funds and track your investment research progress.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/saved-funds'),
          robots: 'noindex, follow', // User-specific page
          keywords: [
            'saved investment funds',
            'investment portfolio tracker',
            'Golden Visa fund comparison',
            'shortlisted funds Portugal'
          ],
          structuredData: this.getSavedFundsStructuredData()
        };

      case 'auth':
        return {
          title: this.optimizeText('Login / Register | Portugal Golden Visa Investment Funds | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Sign in or create an account to access personalized features, save funds, and manage your investment portfolio.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/auth'),
          robots: 'noindex, nofollow',
          structuredData: this.getHomepageStructuredData()
        };

      default:
        return this.getSEOData('homepage');
    }
  }

  // Set all meta tags and structured data
  static applyMetaTags(seoData: SEOData): void {
    try {
      this.cleanup();
      
      // Basic meta tags
      document.title = seoData.title;
      this.setOrUpdateMeta('description', seoData.description);
      this.setCanonical(seoData.url);
      this.setRobots(seoData.robots);
      
      // Keywords meta tag
      if (seoData.keywords && seoData.keywords.length > 0) {
        this.setOrUpdateMeta('keywords', seoData.keywords.join(', '));
      }
      
      // Social media tags
    this.setOpenGraph(seoData);
    this.setTwitterCard(seoData);
    this.setLocale();
      
      // Structured data
      if (seoData.structuredData) {
        this.setStructuredData(seoData.structuredData);
      }
      
      // Security headers
      this.addSecurityHeaders();
      
      // Dispatch event to notify components of SEO update
      window.dispatchEvent(new CustomEvent('seo:updated', { detail: seoData }));
      
    } catch (error) {
      // Silent fallback - no console logging in production
    }
  }

  // Helper methods
  private static setOrUpdateMeta(nameOrProperty: string, content: string): void;
  private static setOrUpdateMeta(nameOrProperty: string, attribute: string, content: string): void;
  private static setOrUpdateMeta(nameOrProperty: string, contentOrAttribute: string, content?: string): void {
    const isProperty = nameOrProperty === 'property';
    const attributeName = isProperty ? contentOrAttribute : nameOrProperty;
    const metaContent = isProperty ? content! : contentOrAttribute;
    
    const selector = isProperty ? `meta[property="${attributeName}"]` : `meta[name="${attributeName}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(isProperty ? 'property' : 'name', attributeName);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', metaContent);
  }

  private static setCanonical(url: string): void {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    
    // Always remove trailing slashes from canonical URLs (except for homepage)
    const urlObj = new URL(url);
    if (urlObj.pathname.endsWith('/') && urlObj.pathname !== '/') {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    canonical.setAttribute('href', urlObj.toString());
  }

  private static setRobots(robotsDirective?: string): void {
    // Ensure fund pages are always indexable - never use noindex for funds
    const robots = robotsDirective === 'noindex, follow' ? 'index, follow' : (robotsDirective || 'index, follow, max-image-preview:large');
    this.setOrUpdateMeta('robots', robots);
  }

  private static setOpenGraph(seoData: SEOData): void {
    // Enhanced og:type detection
    let ogType = 'website';
    if (seoData.url.includes('/compare/') && seoData.url.includes('-vs-')) {
      ogType = 'article';
    } else if (seoData.structuredData) {
      // Check for fund pages (multiple schemas)
      if (Array.isArray(seoData.structuredData)) {
        const hasInvestmentFund = seoData.structuredData.some(schema => schema['@type'] === 'InvestmentFund');
        if (hasInvestmentFund) ogType = 'product';
      } else if (seoData.structuredData['@type'] === 'InvestmentFund') {
        ogType = 'product';
      } else if (seoData.structuredData['@type'] === 'FinancialProduct') {
        ogType = 'product';
      } else if (seoData.structuredData['@type'] === 'Person') {
        ogType = 'profile';
      }
    }
    
    // DEV-only verification log
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('🔍 SEO og:type set to:', ogType, 'for URL:', seoData.url);
    }
    
    const ogTags = [
      { property: 'og:title', content: seoData.title },
      { property: 'og:description', content: seoData.description },
      { property: 'og:url', content: seoData.url },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: this.DEFAULT_IMAGE },
      { property: 'og:site_name', content: 'Movingto' },
    ];

    // Add article:modified_time for fund pages
    if (ogType === 'product' && seoData.structuredData) {
      let modifiedTime = new Date().toISOString();
      if (Array.isArray(seoData.structuredData)) {
        const webPageSchema = seoData.structuredData.find(schema => schema['@type'] === 'WebPage');
        if (webPageSchema && webPageSchema.dateModified) {
          modifiedTime = webPageSchema.dateModified;
        }
      }
      ogTags.push({ property: 'article:modified_time', content: modifiedTime });
    }

    document.querySelectorAll('meta[property^="og:"], meta[property^="article:"]').forEach(tag => tag.remove());
    
    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  private static setTwitterCard(seoData: SEOData): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@movingtoio' },
      { name: 'twitter:title', content: seoData.title },
      { name: 'twitter:description', content: seoData.description },
      { name: 'twitter:image', content: this.DEFAULT_IMAGE },
    ];

    document.querySelectorAll('meta[name^="twitter:"]').forEach(tag => tag.remove());
    
    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  private static setLocale(): void {
    this.setOrUpdateMeta('property', 'og:locale', 'en_US');
  }

  private static setStructuredData(structuredData: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-managed', 'consolidated-seo');
    
    // Ensure structured data is valid before adding to DOM
    try {
      if (structuredData && typeof structuredData === 'object') {
        // Ensure @context exists and is a string
        if (Array.isArray(structuredData)) {
          structuredData.forEach(item => {
            if (item && typeof item === 'object' && !item['@context']) {
              item['@context'] = 'https://schema.org';
            }
          });
        } else if (!structuredData['@context']) {
          structuredData['@context'] = 'https://schema.org';
        }
        
        script.textContent = JSON.stringify(structuredData, null, 2);
        document.head.appendChild(script);
      }
    } catch (error) {
      console.warn('Failed to add structured data:', error);
    }
  }

  private static addSecurityHeaders(): void {
    const securityMetas = [
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'referrer', content: 'strict-origin-when-cross-origin' }
    ];

    securityMetas.forEach(meta => {
      const identifier = meta['http-equiv'] || meta.name;
      const existing = document.querySelector(`meta[${meta['http-equiv'] ? 'http-equiv' : 'name'}="${identifier}"]`);
      if (!existing) {
        const metaElement = document.createElement('meta');
        if (meta['http-equiv']) {
          metaElement.setAttribute('http-equiv', meta['http-equiv']);
        } else {
          metaElement.setAttribute('name', meta.name);
        }
        metaElement.content = meta.content;
        document.head.appendChild(metaElement);
      }
    });
  }

  private static getFundByName(fundNameOrId: string, funds?: Fund[]): Fund | undefined {
    // If no funds provided, return undefined (runtime will handle via React Query)
    if (!funds || funds.length === 0) return undefined;
    
    // Search by both fund ID and name for maximum compatibility
    return funds.find(fund => 
      fund.id === fundNameOrId || 
      fund.name === fundNameOrId ||
      fund.name.toLowerCase() === fundNameOrId.toLowerCase()
    );
  }

  private static slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  // Structured data generators
  private static getHomepageStructuredData(funds?: Fund[]): any {
    // Get top funds for ItemList schema
    const topFunds = funds ? funds.filter((f: any) => f && f.name && f.id).slice(0, 10) : [];
    
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Movingto - Portugal Golden Visa Investment Funds',
        'url': URL_CONFIG.BASE_URL,
        'description': 'Comprehensive analysis and comparison of Portugal Golden Visa Investment Funds',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL,
        'logo': {
          '@type': 'ImageObject',
          'url': `${URL_CONFIG.BASE_URL}/lovable-uploads/c5481949-8ec2-43f1-a77f-8d6cce1eec0e.png`,
          'width': 512,
          'height': 512
        },
        'description': 'Independent platform for comparing Portugal Golden Visa investment funds',
        'foundingDate': '2024-01-01',
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'Investor Relations',
          'email': 'info@movingto.com',
          'areaServed': 'PT',
          'availableLanguage': ['en', 'pt']
        },
        'sameAs': [
          'https://www.linkedin.com/company/movingto',
          'https://twitter.com/movingto',
          'https://www.facebook.com/movingto'
        ],
        'knowsAbout': [
          'Portugal Golden Visa',
          'Investment Funds',
          'Real Estate Investment',
          'Portuguese Residency',
          'Fund Management',
          'CMVM Regulation',
          'European Investment'
        ],
        'areaServed': {
          '@type': 'Country',
          'name': 'Portugal',
          'alternateName': 'PT'
        },
        'founder': {
          '@type': 'Organization',
          'name': 'Movingto'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Top Portugal Golden Visa Investment Funds',
        'description': 'Featured top-rated Portugal Golden Visa investment funds',
        'numberOfItems': topFunds.length,
        'itemListElement': topFunds.map((fund: any, index: number) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'url': URL_CONFIG.buildFundUrl(fund.id),
            'category': fund.category,
            'offers': {
              '@type': 'Offer',
              'price': fund.minimumInvestment || 0,
              'priceCurrency': 'EUR'
            }
          }
        }))
      }
    ];
  }

  private static getFundStructuredData(fund: any): any {
    // Use comprehensive investment fund structured data
    const investmentFundSchema = InvestmentFundStructuredDataService.generateInvestmentFundSchema(fund);
    
    // Add breadcrumb schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': fund.name, 'item': URL_CONFIG.buildFundUrl(fund.id) }
      ]
    };
    
    // Add FAQ schema if fund has FAQs
    const schemas: any[] = [investmentFundSchema, breadcrumbSchema];
    if (fund.faqs && fund.faqs.length > 0) {
      const faqSchema = EnhancedStructuredDataService.generateFundFAQSchema(fund);
      schemas.push(faqSchema);
    }
    
    // Add fund manager organization schema
    const managerSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': fund.managerName,
      'url': URL_CONFIG.buildManagerUrl(fund.managerName)
    };
    schemas.push(managerSchema);
    
    return schemas;
  }

  private static getCategoryStructuredData(categoryName: string, funds: any[] = []): any {
    const categorySlug = this.slugify(categoryName);
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${categoryName} Investment Funds`,
      'description': `Collection of ${categoryName} investment funds in Portugal`,
      'url': URL_CONFIG.buildCategoryUrl(categoryName)
    };

    // Add ItemList schema for SEO
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `${categoryName} Portugal Golden Visa Investment Funds`,
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'name': fund.name
      }))
    };

    // Add BreadcrumbList schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': URL_CONFIG.BASE_URL
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Categories',
          'item': `${URL_CONFIG.BASE_URL}/categories`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': categoryName,
          'item': `${URL_CONFIG.BASE_URL}/categories/${categorySlug}`
        }
      ]
    };

    return [baseSchema, itemListSchema, breadcrumbSchema];
  }

  private static getTagStructuredData(tagName: string, funds: any[] = []): any {
    const tagSlug = this.slugify(tagName);
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${tagName} Investment Funds`,
      'description': `Investment funds tagged with ${tagName}`,
      'url': URL_CONFIG.buildTagUrl(tagName)
    };

    // Add ItemList schema for SEO
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `${tagName} Portugal Golden Visa Investment Funds`,
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'name': fund.name
      }))
    };

    // Add BreadcrumbList schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': URL_CONFIG.BASE_URL
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Tags',
          'item': `${URL_CONFIG.BASE_URL}/tags`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': tagName,
          'item': `${URL_CONFIG.BASE_URL}/tags/${tagSlug}`
        }
      ]
    };

    return [baseSchema, itemListSchema, breadcrumbSchema];
  }

  private static getManagerStructuredData(managerName: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': managerName,
      'url': URL_CONFIG.buildManagerUrl(managerName)
    };
  }

  private static getComparisonStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': URL_CONFIG.buildUrl('compare'),
          'name': 'Investment Fund Comparison Tool',
          'description': 'Compare investment funds side-by-side to analyze performance, fees, and risk profiles',
          'url': URL_CONFIG.buildUrl('compare'),
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': URL_CONFIG.buildUrl('/')
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Compare Funds',
                'item': URL_CONFIG.buildUrl('compare')
              }
            ]
          }
        },
        {
          '@type': 'WebApplication',
          'name': 'Fund Comparison Tool',
          'description': 'Interactive tool to compare investment funds',
          'url': URL_CONFIG.buildUrl('compare'),
          'applicationCategory': 'FinanceApplication'
        }
      ]
    };
  }

  private static getCalculatorStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': URL_CONFIG.buildUrl('roi-calculator') + '#webapp',
          'name': 'Portugal Golden Visa Fund ROI Calculator',
          'description': 'Interactive calculator for estimating investment returns on Portugal Golden Visa funds over time with compound growth projections',
          'url': URL_CONFIG.buildUrl('roi-calculator'),
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'Web Browser',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'EUR'
          },
          'featureList': [
            'Calculate compound returns',
            'Compare multiple investment scenarios',
            'Project returns over custom time periods',
            'Adjust for management fees',
            'Visualize growth projections'
          ]
        },
        {
          '@type': 'FinancialService',
          'name': 'Investment Return Calculator',
          'description': 'Free online tool for calculating potential returns on Portugal Golden Visa investment funds',
          'url': URL_CONFIG.buildUrl('roi-calculator'),
          'provider': {
            '@type': 'Organization',
            'name': 'Movingto'
          },
          'areaServed': {
            '@type': 'Country',
            'name': 'Portugal'
          }
        },
        {
          '@type': 'HowTo',
          'name': 'How to Calculate Investment Returns',
          'description': 'Step-by-step guide to calculating ROI on Portugal Golden Visa funds',
          'step': [
            { '@type': 'HowToStep', 'position': 1, 'name': 'Enter Investment Amount', 'text': 'Input your intended investment amount in EUR' },
            { '@type': 'HowToStep', 'position': 2, 'name': 'Set Time Horizon', 'text': 'Choose your investment duration (typically 5-10 years)' },
            { '@type': 'HowToStep', 'position': 3, 'name': 'Input Expected Return', 'text': 'Enter the fund\'s target annual return percentage' },
            { '@type': 'HowToStep', 'position': 4, 'name': 'Review Results', 'text': 'Analyze projected returns and total portfolio value over time' }
          ]
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
            { '@type': 'ListItem', 'position': 2, 'name': 'ROI Calculator', 'item': URL_CONFIG.buildUrl('roi-calculator') }
          ]
        }
      ]
    };
  }

  private static getManagersHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Fund Managers Directory',
      'description': 'Directory of investment fund managers',
      'url': URL_CONFIG.buildUrl('managers')
    };
  }

  private static getCategoriesHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Fund Categories',
      'description': 'Browse investment fund categories',
      'url': URL_CONFIG.buildUrl('categories')
    };
  }

  private static getTagsHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Fund Tags',
      'description': 'Explore funds by characteristics',
      'url': URL_CONFIG.buildUrl('tags')
    };
  }

  private static getComparisonsHubStructuredData(funds?: Fund[]): any {
    // Get top 10 fund pairs for featured comparisons
    const topComparisons = funds && funds.length > 0 
      ? funds.slice(0, 10).flatMap((fund, i) => 
          funds.slice(i + 1, i + 3).map((otherFund, j) => ({
            '@type': 'ListItem',
            'position': i * 2 + j + 1,
            'name': `${fund.name} vs ${otherFund.name}`,
            'item': URL_CONFIG.buildUrl(`compare/${normalizeComparisonSlug(`${fund.id}-vs-${otherFund.id}`)}`)
          }))
        ).slice(0, 10)
      : [];

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': URL_CONFIG.buildUrl('comparisons'),
          'name': 'Portugal Golden Visa Fund Comparisons Hub',
          'description': 'Comprehensive hub for comparing Portugal Golden Visa investment funds side-by-side. Access comparison tools, featured fund matchups, and detailed performance analysis.',
          'url': URL_CONFIG.buildUrl('comparisons'),
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': URL_CONFIG.buildUrl('/')
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Fund Comparisons',
                'item': URL_CONFIG.buildUrl('comparisons')
              }
            ]
          },
          'mainEntity': {
            '@type': 'ItemList',
            'name': 'Featured Portugal Golden Visa Fund Comparisons',
            'description': 'Popular fund comparison matchups for Golden Visa investors',
            'numberOfItems': topComparisons.length,
            'itemListElement': topComparisons
          }
        },
        {
          '@type': 'WebApplication',
          'name': 'Fund Comparison Tool',
          'description': 'Interactive application for comparing Portugal Golden Visa investment funds side-by-side with detailed metrics',
          'url': URL_CONFIG.buildUrl('comparisons'),
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'Web Browser',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'EUR'
          },
          'featureList': [
            'Side-by-side fund comparison',
            'Performance metrics analysis',
            'Fee structure comparison',
            'Risk profile assessment',
            'Investment requirements comparison',
            'Golden Visa eligibility verification'
          ]
        },
        {
          '@type': 'Service',
          'name': 'Investment Fund Comparison Service',
          'description': 'Free comparison service for analyzing Portugal Golden Visa investment funds',
          'provider': {
            '@type': 'Organization',
            'name': 'Movingto'
          },
          'serviceType': 'Financial Analysis',
          'areaServed': {
            '@type': 'Country',
            'name': 'Portugal'
          }
        }
      ]
    };
  }

  private static getAboutStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About Movingto',
      'description': 'About our investment fund analysis platform',
      'url': URL_CONFIG.buildUrl('about')
    };
  }

  private static getDisclaimerStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Disclaimer',
      'description': 'Investment information disclaimer',
      'url': URL_CONFIG.buildUrl('disclaimer')
    };
  }

  private static getFAQStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': 'Frequently Asked Questions',
      'description': 'Common questions about investment funds',
      'url': URL_CONFIG.buildUrl('faqs')
    };
  }

  private static getPrivacyStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Privacy Policy',
      'description': 'Privacy policy for our platform',
      'url': URL_CONFIG.buildUrl('privacy')
    };
  }

  private static getFundAlternativesStructuredData(fund: any): any {
    // Simple structured data without dynamic imports  
    const baseStructuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': `${fund.name} Alternatives`,
        'description': `Alternative investment funds similar to ${fund.name}`,
        'url': URL_CONFIG.buildFundUrl(fund.id) + '/alternatives',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': URL_CONFIG.buildUrl('')
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': fund.name,
              'item': URL_CONFIG.buildFundUrl(fund.id)
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Alternatives',
              'item': URL_CONFIG.buildFundUrl(fund.id) + '/alternatives'
            }
          ]
        }
      }
    ];

    return baseStructuredData;
  }


  // Generate fund comparison structured data
  private static getFundComparisonStructuredData(fund1: any, fund2: any) {
    if (!fund1 || !fund2 || !fund1.name || !fund2.name || !fund1.id || !fund2.id) return this.getGenericComparisonStructuredData();

    const normalizedSlug = `${[fund1.id, fund2.id].sort().join('-vs-')}`;
    const comparisonUrl = URL_CONFIG.buildComparisonUrl(normalizedSlug);

    return [
      // Main WebPage schema
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${fund1.name} vs ${fund2.name} Comparison`,
        "description": `Compare ${fund1.name} and ${fund2.name} investment funds side-by-side to make informed investment decisions`,
        "url": comparisonUrl,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": URL_CONFIG.BASE_URL
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Fund Comparisons",
              "item": URL_CONFIG.buildUrl('comparisons')
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${fund1.name} vs ${fund2.name}`,
              "item": comparisonUrl
            }
          ]
        },
        "mainEntity": {
          "@type": "ItemList",
          "name": "Fund Comparison",
          "numberOfItems": 2,
          "itemListElement": [
            {
              "@type": "FinancialProduct",
              "name": fund1.name,
              "description": fund1.description || `Investment fund: ${fund1.name}`,
              "url": URL_CONFIG.buildFundUrl(fund1.id),
              "offers": {
                "@type": "Offer",
                "price": fund1.minimumInvestment || 0,
                "priceCurrency": "EUR"
              }
            },
            {
              "@type": "FinancialProduct", 
              "name": fund2.name,
              "description": fund2.description || `Investment fund: ${fund2.name}`,
              "url": URL_CONFIG.buildFundUrl(fund2.id),
              "offers": {
                "@type": "Offer",
                "price": fund2.minimumInvestment || 0,
                "priceCurrency": "EUR"
              }
            }
          ]
        }
      }
    ];
  }

  // Generate generic comparison structured data
  private static getGenericComparisonStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Fund Comparison Tool',
      'description': 'Compare Portugal Golden Visa investment funds'
    };
  }

  private static getAlternativesHubStructuredData(funds?: Fund[]) {
    // Use a simple list of funds for structured data to avoid SSR issues
    const topFunds = funds ? funds.filter((f: any) => f && typeof f.name === 'string' && typeof f.id === 'string').slice(0, 20) : [];

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": URL_CONFIG.buildUrl('/alternatives'),
          "name": "Portugal Golden Visa Fund Alternatives Hub",
          "description": "Comprehensive directory of alternative Portugal Golden Visa investment funds. Find similar funds based on category, risk level, investment amount, and returns.",
          "url": URL_CONFIG.buildUrl('/alternatives'),
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": URL_CONFIG.BASE_URL },
              { "@type": "ListItem", "position": 2, "name": "Fund Alternatives", "item": URL_CONFIG.buildUrl('/alternatives') }
            ]
          },
          "mainEntity": {
            "@type": "ItemList",
            "name": "Portugal Golden Visa Investment Funds",
            "description": "All available funds with alternatives and similar options",
            "numberOfItems": topFunds.length,
            "itemListElement": topFunds.map((item: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "FinancialProduct",
                "name": item.name,
                "category": item.category,
                "url": URL_CONFIG.buildFundUrl(item.id),
                "offers": item.minimumInvestment ? {
                  "@type": "Offer",
                  "price": item.minimumInvestment,
                  "priceCurrency": "EUR"
                } : undefined
              }
            }))
          }
        },
        {
          "@type": "WebPage",
          "name": "Fund Alternatives Finder",
          "description": "Tool for discovering alternative investment funds similar to your preferred options",
          "url": URL_CONFIG.buildUrl('/alternatives'),
          "about": {
            "@type": "FinancialProduct",
            "name": "Portugal Golden Visa Investment Funds"
          }
        }
      ]
    };
  }

  // Verified Funds structured data
  private static getVerifiedFundsStructuredData(funds: Fund[] = []): any {
    const verifiedFunds = funds.filter(f => f.isVerified);
    
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Verified Portugal Golden Visa Investment Funds',
        'description': 'Collection of independently verified Portugal Golden Visa investment funds',
        'url': URL_CONFIG.buildUrl('/verified-funds'),
        'about': {
          '@type': 'FinancialProduct',
          'name': 'Portugal Golden Visa Investment Funds'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Verified Golden Visa Funds',
        'numberOfItems': verifiedFunds.length,
        'itemListElement': verifiedFunds.slice(0, 20).map((fund, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'url': URL_CONFIG.buildFundUrl(fund.id),
            'category': fund.category
          }
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': 'Verified Funds', 'item': URL_CONFIG.buildUrl('/verified-funds') }
        ]
      }
    ];
  }

  // Verification Program structured data
  private static getVerificationProgramStructuredData(): any {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Fund Verification Program',
        'description': 'Independent verification service for Portugal Golden Visa investment funds',
        'provider': {
          '@type': 'Organization',
          'name': 'Movingto'
        },
        'serviceType': 'Investment Fund Verification',
        'areaServed': {
          '@type': 'Country',
          'name': 'Portugal'
        },
        'url': URL_CONFIG.buildUrl('/verification-program')
      },
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': 'Fund Verification Process',
        'description': '6-point verification process for Portugal Golden Visa funds',
        'step': [
          { '@type': 'HowToStep', 'position': 1, 'name': 'Regulatory Status Check', 'text': 'Verify CMVM registration and regulatory compliance' },
          { '@type': 'HowToStep', 'position': 2, 'name': 'Entity Name Matching', 'text': 'Ensure fund names and entities are consistent across documentation' },
          { '@type': 'HowToStep', 'position': 3, 'name': 'Documentation Review', 'text': 'Review prospectus, subscription docs, and company extracts' },
          { '@type': 'HowToStep', 'position': 4, 'name': 'Custodian Verification', 'text': 'Confirm safekeeping relationship with custodian/depositary' },
          { '@type': 'HowToStep', 'position': 5, 'name': 'Audit Evidence', 'text': 'Review latest auditor letters when available' },
          { '@type': 'HowToStep', 'position': 6, 'name': 'Golden Visa Consistency', 'text': 'Verify Golden Visa eligibility claims are consistent' }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': 'Verification Program', 'item': URL_CONFIG.buildUrl('/verification-program') }
        ]
      }
    ];
  }

  // Saved Funds structured data (user-specific, minimal schema)
  private static getSavedFundsStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Saved Investment Funds',
      'description': 'User\'s saved Portugal Golden Visa investment funds',
      'url': URL_CONFIG.buildUrl('/saved-funds')
    };
  }

}
