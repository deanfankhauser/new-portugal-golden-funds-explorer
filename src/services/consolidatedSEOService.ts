import { SEOData } from '../types/seo';
import { URL_CONFIG } from '../utils/urlConfig';
import { Fund } from '../data/types/funds';
import { normalizeComparisonSlug } from '../utils/comparisonUtils';
import { parseComparisonSlug } from '../data/services/comparison-service';
import { InvestmentFundStructuredDataService } from './investmentFundStructuredDataService';
import { EnhancedStructuredDataService } from './enhancedStructuredDataService';
import { normalizeTagLabel, formatMinimumForTitle } from '../utils/tagLabelNormalizer';
import { managerToSlug } from '../lib/utils';
import { getTagSeoTitle } from '../utils/tagSeoMappings';


export class ConsolidatedSEOService {
  private static readonly DEFAULT_IMAGE = 'https://funds.movingto.com/og-default.png';
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

  // Generate optimized fund title - dynamic year, fees & risk focused
  private static generateFundTitle(fund: any): string {
    // Pattern: [Fund Name]: Fees, Risk, Returns & Terms (2025)
    // Note: Year is updated client-side via useYearUpdate hook to avoid SSG rebuilds on New Year's Day
    
    const currentYear = new Date().getFullYear();
    const fundName = fund.name;
    const maxLength = 60;
    
    // Primary title: [Fund Name]: Fees, Risk, Returns & Terms (2025)
    const fullTitle = `${fundName}: Fees, Risk, Returns & Terms (${currentYear})`;
    
    if (fullTitle.length <= maxLength) {
      return fullTitle;
    }
    
    // Truncated fallback: [Fund Name]: Fees & Terms (2025)
    const shortTitle = `${fundName}: Fees & Terms (${currentYear})`;
    
    if (shortTitle.length <= maxLength) {
      return shortTitle;
    }
    
    // Final fallback: Truncate fund name to fit
    const suffixLength = `: Fees & Terms (${currentYear})`.length;
    const maxNameLength = maxLength - suffixLength - 3; // -3 for ellipsis
    const truncatedName = fundName.substring(0, maxNameLength).trim() + '...';
    return `${truncatedName}: Fees & Terms (${currentYear})`;
  }

  // Generate optimized fund description with conditional logic
  private static generateFundDescription(fund: any): string {
    // Pattern: View objective data for [Fund Name]. {TrustSignal} Analysis covers {FeeSignal}, Minimum Investment ([Min_Investment]), and Golden Visa eligibility.
    
    const fundName = fund.name;
    
    // Step A: Trust Signal Variable (conditional on cmvmId)
    const trustSignal = fund.cmvmId 
      ? `Regulated by CMVM #${fund.cmvmId}.`
      : `Managed by ${fund.managerName}.`;
    
    // Step B: Fee Signal Variable (conditional on managementFee)
    const feeSignal = (fund.managementFee !== null && fund.managementFee !== undefined)
      ? `Management Fee (${fund.managementFee}%)`
      : 'fee structure';
    
    // Step C: Minimum Investment Formatting
    const minInvestment = fund.minimumInvestment 
      ? `€${(fund.minimumInvestment / 1000).toFixed(0)}k`
      : 'available minimums';
    
    // Final Description Construction
    const description = `View objective data for ${fundName}. ${trustSignal} Analysis covers ${feeSignal}, Minimum Investment (${minInvestment}), and Golden Visa eligibility.`;
    
    // Ensure we stay within character limit
    return this.optimizeText(description, this.MAX_DESCRIPTION_LENGTH);
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
          title: this.optimizeText('Compare Portugal Golden Visa Funds – Directory of CMVM-Regulated Funds | Movingto Funds', this.MAX_TITLE_LENGTH),
          keywords: ['Portugal Golden Visa funds', 'Golden Visa investment', 'Portugal investment funds', 'CMVM funds', 'investment immigration', 'residence by investment', 'Portugal capital transfer', 'VC funds Portugal', 'real estate funds Portugal', 'fund comparison'],
          description: this.optimizeText('Compare Portugal Golden Visa funds by performance, fees, risk and minimum. Use our independent directory to shortlist funds for residency.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/'),
          canonical: URL_CONFIG.buildUrl('/'),
          structuredData: this.getHomepageStructuredData(funds)
        };

      case 'fund':
      case 'fund-details':
        const targetIdOrName = params.fundId || params.fundName;
        
        // DIAGNOSTIC: Log fund lookup attempt
        console.log('🔍 [SEO] Fund lookup attempt:', {
          targetIdOrName,
          pageType: params.pageType,
          hasFundsArray: !!funds,
          fundsArrayLength: funds?.length || 0,
          firstFiveFundIds: funds?.slice(0, 5).map(f => f.id) || []
        });
        
        const fund = funds 
          ? funds.find(f => f.id === targetIdOrName || f.name === targetIdOrName)
          : this.getFundByName(targetIdOrName);
        
        if (!fund) {
          // DIAGNOSTIC: Log fund matching failure
          console.error('❌ [SEO] Fund NOT FOUND:', {
            targetIdOrName,
            searchedInArray: !!funds,
            fundsAvailable: funds?.length || 0,
            allFundIds: funds?.map(f => f.id) || [],
            willUseFallback: !!targetIdOrName
          });
          
          if (targetIdOrName) {
            console.log('⚠️ [SEO] Using self-referencing canonical fallback for:', targetIdOrName);
            return {
              title: this.optimizeText(`${targetIdOrName} – Portugal Golden Visa Fund | Movingto Funds`, this.MAX_TITLE_LENGTH),
              description: this.optimizeText('Explore details for this Portugal Golden Visa investment fund on Movingto.', this.MAX_DESCRIPTION_LENGTH),
              url: URL_CONFIG.buildFundUrl(targetIdOrName),
              canonical: URL_CONFIG.buildFundUrl(targetIdOrName),
              structuredData: []
            };
          }
          
          console.error('💥 [SEO] No targetIdOrName - falling back to homepage SEO');
          return this.getSEOData('homepage', {}, funds);
        }
        
        // DIAGNOSTIC: Log successful fund match
        console.log('✅ [SEO] Fund FOUND:', {
          fundId: fund.id,
          fundName: fund.name,
          targetIdOrName
        });
        
        // Generate dynamic, metric-rich title and description
        const fundTitle = this.generateFundTitle(fund);
        const fundDescription = this.generateFundDescription(fund);
        const fundKeywords = this.generateFundKeywords(fund);
        
        return {
          title: this.optimizeText(fundTitle, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(fundDescription, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildFundUrl(fund.id),
          canonical: URL_CONFIG.buildFundUrl(fund.id),
          keywords: fundKeywords,
          structuredData: this.getFundStructuredData(fund)
        };

      case 'category':
        const categoryName = params.categoryName;
        const categoryFunds = params.funds || [];
        const currentYear = new Date().getFullYear();
        
        // SEO Title: "Best [Category Name] Funds for Portugal Golden Visa ({Current Year})"
        const categoryTitle = `Best ${categoryName} Funds for Portugal Golden Visa (${currentYear})`;
        
        // SEO Description: "Compare the top [Category Name] investment funds eligible for the Portugal Golden Visa. Analysis of fees, yields, and risk profiles for [Count] funds."
        const categoryDescription = `Compare the top ${categoryName} investment funds eligible for the Portugal Golden Visa. Analysis of fees, yields, and risk profiles for ${categoryFunds.length} fund${categoryFunds.length !== 1 ? 's' : ''}.`;
        
        const categoryKeywords = [
          `best ${categoryName} Golden Visa funds`,
          `${categoryName} investment Portugal ${currentYear}`,
          `Portugal ${categoryName} funds`,
          'Golden Visa investment categories',
          `${categoryName} fund comparison`,
          `top ${categoryName} funds Portugal`,
          `${categoryName} fund fees yields`
        ];
        
        return {
          title: this.optimizeText(categoryTitle, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(categoryDescription, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildCategoryUrl(params.categoryName),
          canonical: URL_CONFIG.buildCategoryUrl(params.categoryName),
          keywords: categoryKeywords,
          structuredData: this.getCategoryStructuredData(params.categoryName, categoryFunds)
        };

      case 'tag':
        // Smart SEO title using mappings
        const cleanTagLabel = normalizeTagLabel(params.tagName);
        const fundsCount = params.funds?.length || 0;
        const tagTitle = `${getTagSeoTitle(params.tagName)} | Movingto Funds`;
        const tagDescription = `Browse ${fundsCount} ${cleanTagLabel} funds eligible for Portugal Golden Visa. Compare average yields, lock-up periods, and fees for this investment theme.`;
        const tagKeywords = [
          `${params.tagName} Golden Visa funds`,
          `${params.tagName} investment funds Portugal`,
          'thematic investing Portugal',
          `${params.tagName} fund comparison`,
          'Portugal investment themes',
          `best ${params.tagName} funds`
        ];
        
        return {
          title: this.optimizeText(tagTitle, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(tagDescription, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildTagUrl(params.tagName),
          canonical: URL_CONFIG.buildTagUrl(params.tagName),
          keywords: tagKeywords,
          structuredData: this.getTagStructuredData(params.tagName, params.funds || [])
        };

      case 'manager':
        const fundCount = params.funds?.length || 0;
        const goldenVisaFundCount = params.funds?.filter((f: any) => f.tags?.includes('Golden Visa Eligible')).length || fundCount;
        
        // SEO Title: "[Manager Name]: Corporate Profile, Track Record & Active Funds"
        const managerTitle = `${params.managerName}: Corporate Profile, Track Record & Active Funds`;
        
        // SEO Description: "View the corporate profile of [Manager Name]. Regulated Portuguese fund manager with [X] active Golden Visa funds. View AUM and investment strategy."
        const managerDescription = `View the corporate profile of ${params.managerName}. Regulated Portuguese fund manager with ${goldenVisaFundCount} active Golden Visa fund${goldenVisaFundCount !== 1 ? 's' : ''}. View AUM and investment strategy.`;
        
        return {
          title: this.optimizeText(managerTitle, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(managerDescription, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildManagerUrl(params.managerName),
          canonical: URL_CONFIG.buildManagerUrl(params.managerName),
          keywords: [
            `${params.managerName}`,
            'Portugal fund manager',
            'corporate profile',
            'track record',
            'Golden Visa fund manager',
            'investment fund management Portugal',
            'CMVM regulated',
            'fund manager analysis',
            'active funds',
            'AUM'
          ],
          structuredData: this.getManagerStructuredData(params.managerName, params.managerProfile, params.funds || [])
        };

      case 'team-member':
        const memberName = params.name || 'Team Member';
        const memberRole = params.role || 'Team Member';
        const companyName = params.companyName || '';
        return {
          title: this.optimizeText(`${memberName}: Professional Profile & Managed Funds - ${companyName}`, this.MAX_TITLE_LENGTH),
          description: this.optimizeText(`Professional profile of ${memberName}, ${memberRole} at ${companyName}. View their investment track record and currently active Golden Visa funds.`, this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl(`/team/${params.slug}`),
          canonical: URL_CONFIG.buildUrl(`/team/${params.slug}`),
          keywords: [
            memberName,
            memberRole,
            companyName,
            'fund team member',
            'investment professional',
            'Portugal fund management',
            'Golden Visa fund professional'
          ],
          structuredData: this.getTeamMemberStructuredData(params)
        };

      case 'compare':
      case 'comparison':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparison Tool – Compare Any Two Funds | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare Portugal Golden Visa funds side by side. Check performance, fees, risk, liquidity, minimum investment and more before choosing your fund.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/compare'),
          canonical: URL_CONFIG.buildUrl('/compare'),
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
              title: this.optimizeText(`${fund1.name} vs ${fund2.name} Review: Fees, Risk & Golden Visa Comparison`, this.MAX_TITLE_LENGTH),
              description: this.optimizeText(`Detailed comparison of ${fund1.name} and ${fund2.name}. Analyze the differences in Management Fees, Risk Profiles, and Target Returns to find the right Golden Visa fund for you.`, this.MAX_DESCRIPTION_LENGTH),
              url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
              canonical: URL_CONFIG.buildComparisonUrl(normalizedSlug),
              robots: 'index, follow',
              keywords: [
                `${fund1.name} vs ${fund2.name}`,
                'fund comparison',
                'investment comparison',
                'fund review',
                'fees comparison',
                'risk comparison',
                'Golden Visa fund comparison',
                'investment fund analysis',
                `${fund1.managerName}`,
                `${fund2.managerName}`,
                'fund performance comparison',
                'compare funds',
                'investment analysis'
              ],
              structuredData: this.getFundComparisonStructuredData(fund1, fund2)
            };
          }
        }
        
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Comparison – Investment Analysis | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare Portugal Golden Visa funds side by side. Check performance, fees, risk, liquidity, minimum investment and more before choosing your fund.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildComparisonUrl(normalizedSlug),
          canonical: URL_CONFIG.buildComparisonUrl(normalizedSlug),
          robots: 'index, follow',
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
          title: this.optimizeText('Portugal Golden Visa Fund ROI Calculator – Estimate Returns | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Estimate potential returns from Portugal Golden Visa funds. Adjust investment amount, target yield and holding period to see projected outcomes.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('roi-calculator'),
          canonical: URL_CONFIG.buildUrl('roi-calculator'),
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
          canonical: `${baseUrl}/404`,
          structuredData: this.getHomepageStructuredData()
        };

      case 'managers-hub':
        return {
          title: this.optimizeText('Browse 28+ Golden Visa Fund Managers – Compare Track Records | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare verified Golden Visa fund managers in Portugal. Analyze track records, AUM and performance. Connect with Movingto\'s legal team.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('managers'),
          canonical: URL_CONFIG.buildUrl('managers'),
          keywords: [
            'fund managers Portugal',
            'Golden Visa fund managers',
            'investment professionals Portugal',
            'fund management companies',
            'Portuguese fund managers directory',
            'investment fund professionals',
            'best Golden Visa fund managers',
            'top rated fund managers Portugal',
            'verified fund management companies',
            'experienced Golden Visa managers'
          ],
          structuredData: this.getManagersHubStructuredData()
        };

      case 'categories-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Categories – Debt, Equity, VC & More | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Explore Portugal Golden Visa fund categories – debt, equity, venture capital, real estate, clean energy, crypto. See all funds and compare metrics.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('categories'),
          canonical: URL_CONFIG.buildUrl('categories'),
          keywords: [
            'fund categories',
            'investment types Portugal',
            'Golden Visa fund categories',
            'fund classification',
            'investment strategies Portugal',
            'fund types',
            'debt funds Portugal',
            'equity funds Golden Visa',
            'venture capital funds Portugal',
            'what types of Golden Visa funds'
          ],
          structuredData: this.getCategoriesHubStructuredData()
        };

      case 'tags-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Tags – Filter by Strategy, Risk & Minimums | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Filter Portugal Golden Visa funds by 40+ tags including risk level, strategy, minimum investment, liquidity and investor profile to match your goals.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('tags'),
          canonical: URL_CONFIG.buildUrl('tags'),
          keywords: [
            'fund characteristics',
            'investment tags',
            'fund features',
            'Golden Visa fund attributes',
            'investment fund filters',
            'fund search criteria',
            'filter Golden Visa funds',
            'find funds by characteristics',
            'Golden Visa fund finder',
            'investment fund search'
          ],
          structuredData: this.getTagsHubStructuredData()
        };

      case 'alternatives-hub':
        return {
          title: this.optimizeText('Portugal Golden Visa Fund Alternatives – Discover Similar Funds | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Find alternative Portugal Golden Visa funds similar to your chosen fund based on strategy, risk profile, fees and minimum ticket.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/alternatives'),
          canonical: URL_CONFIG.buildUrl('/alternatives'),
          keywords: [
            'fund alternatives',
            'similar investment funds',
            'alternative funds Portugal',
            'comparable Golden Visa funds',
            'fund substitutes',
            'investment alternatives',
            'find similar Golden Visa funds',
            'alternative investment options Portugal',
            'comparable investment funds',
            'funds like'
          ],
          structuredData: this.getAlternativesHubStructuredData(funds)
        };

      case 'comparisons-hub':
        return {
          title: this.optimizeText('Compare 435+ Golden Visa Fund Pairs – Side-by-Side Analysis | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Compare 435+ Golden Visa fund combinations side-by-side. Analyze fees, returns, risk, and minimums. Connect with Movingto\'s legal team.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('comparisons'),
          canonical: URL_CONFIG.buildUrl('comparisons'),
          keywords: [
            'fund comparison hub',
            'compare Golden Visa funds',
            'side by side fund analysis',
            'investment comparison tool',
            'fund vs fund comparison',
            'compare investment funds Portugal',
            'Golden Visa fund comparisons',
            'investment fund comparison tool',
            'which Golden Visa fund is better',
            'compare fund performance'
          ],
          structuredData: this.getComparisonsHubStructuredData(funds)
        };

      case 'about':
        return {
          title: this.optimizeText('About Movingto Funds – Portugal Golden Visa Investment Fund Platform | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Movingto Funds is an independent directory for Portugal Golden Visa funds. Compare data, fees and performance to choose funds with confidence.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('about'),
          canonical: URL_CONFIG.buildUrl('about'),
          keywords: [
            'about us',
            'platform information',
            'Golden Visa platform',
            'investment fund analysis',
            'about Movingto',
            'investment platform Portugal'
          ],
          structuredData: this.getAboutStructuredData()
        };

      case 'disclaimer':
        return {
          title: this.optimizeText('Disclaimer – Portugal Golden Visa Investment Fund Information | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Important disclaimer for Movingto Funds. Understand the limits of our Portugal Golden Visa investment fund information and advice.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('disclaimer'),
          canonical: URL_CONFIG.buildUrl('disclaimer'),
          keywords: [
            'disclaimer',
            'investment disclaimer',
            'Golden Visa disclaimer',
            'investment information disclaimer',
            'legal disclaimer',
            'investment terms conditions'
          ],
          structuredData: this.getDisclaimerStructuredData()
        };

      case 'faqs':
        return {
          title: this.optimizeText('Portugal Golden Visa Investment Funds – FAQs & Common Questions | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Answers to common questions about Portugal Golden Visa investment funds. Learn how eligibility, risk, performance, fees and minimums work.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('faqs'),
          canonical: URL_CONFIG.buildUrl('faqs'),
          keywords: [
            'FAQs',
            'frequently asked questions',
            'Golden Visa questions',
            'investment fund FAQs',
            'Portugal Golden Visa FAQ',
            'Portugal visa questions',
            'how long Golden Visa process',
            'Golden Visa minimum investment 2025',
            'can family get Golden Visa',
            'Golden Visa tax implications'
          ],
          structuredData: this.getFAQStructuredData()
        };

      case 'privacy':
        return {
          title: this.optimizeText('Privacy Policy – Portugal Golden Visa Investment Fund Platform | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Read the privacy policy for Movingto Funds, our Portugal Golden Visa investment fund directory and analysis platform.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('privacy'),
          canonical: URL_CONFIG.buildUrl('privacy'),
          keywords: [
            'privacy policy',
            'data privacy',
            'privacy terms',
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
          title: this.optimizeText('12+ CMVM-Verified Golden Visa Funds – Guaranteed Compliance | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Discover 12+ CMVM-verified Portugal Golden Visa funds with guaranteed regulatory compliance. Independent validation, transparent fees, confirmed eligibility.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/verified-funds'),
          canonical: URL_CONFIG.buildUrl('/verified-funds'),
          keywords: [
            'verified Golden Visa funds',
            'CMVM registered funds',
            'verified investment funds Portugal',
            'documented Golden Visa funds',
            'regulated investment funds',
            'validated investment funds Portugal',
            'CMVM verified funds',
            'compliance verified Golden Visa',
            'independently validated funds Portugal'
          ],
          structuredData: this.getVerifiedFundsStructuredData(funds)
        };

      case 'verification-program':
        return {
          title: this.optimizeText('Fund Verification Program – Independent Investment Validation | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Our independent verification program validates Portugal Golden Visa funds through 6-point process: regulatory status, documentation, and eligibility.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/verification-program'),
          canonical: URL_CONFIG.buildUrl('/verification-program'),
          keywords: [
            'fund verification program',
            'independent fund validation',
            'investment verification',
            'fund due diligence',
            'fund verification process',
            'investment transparency Portugal'
          ],
          structuredData: this.getVerificationProgramStructuredData()
        };

      case 'saved-funds':
        return {
          title: this.optimizeText('My Watchlist | Portugal Golden Visa Investment Funds | Movingto', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Your Portugal Golden Visa funds watchlist. Track and compare funds you\'re interested in to make informed investment decisions.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/saved-funds'),
          canonical: URL_CONFIG.buildUrl('/saved-funds'),
          robots: 'noindex, follow', // User-specific page
          keywords: [
            'watchlist',
            'investment watchlist',
            'fund tracking',
            'saved investment funds',
            'fund watchlist',
            'tracked investments'
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

      case 'ira-401k-eligible':
        return {
          title: this.optimizeText('IRA & 401k Eligible Portugal Golden Visa Funds | QEF-Eligible Investments | Movingto Funds', this.MAX_TITLE_LENGTH),
          description: this.optimizeText('Invest in Portugal Golden Visa funds through your IRA or 401k with favorable US tax treatment. Browse QEF-eligible funds with transparent PFIC reporting and reduced tax complexity.', this.MAX_DESCRIPTION_LENGTH),
          url: URL_CONFIG.buildUrl('/ira-401k-eligible-funds'),
          canonical: URL_CONFIG.buildUrl('/ira-401k-eligible-funds'),
          keywords: [
            'IRA eligible Golden Visa funds',
            '401k eligible Portugal funds',
            'QEF eligible funds',
            'PFIC QEF election',
            'US retirement account Portugal investment',
            'IRA Golden Visa investment',
            '401k Portugal real estate',
            'QEF reporting funds',
            'US tax advantaged Golden Visa',
            'retirement account foreign investment'
          ],
          structuredData: this.getIRAEligibleStructuredData(funds)
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
      this.setCanonical(seoData.canonical || seoData.url);
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
    // Respect SSR-provided robots directive without overriding
    const robots = robotsDirective || 'index, follow, max-image-preview:large';
    this.setOrUpdateMeta('robots', robots);
  }

  private static setOpenGraph(seoData: SEOData): void {
    // Enhanced og:type detection
    let ogType = 'website';
    if (seoData.url.includes('/compare/') && seoData.url.includes('-vs-')) {
      ogType = 'article';
    } else if (seoData.structuredData) {
      // Fund pages use 'website' type (not 'product') per SEO requirements
      // Only Person schemas use 'profile' type
      if (Array.isArray(seoData.structuredData)) {
        const hasPerson = seoData.structuredData.some(schema => schema['@type'] === 'Person');
        if (hasPerson) ogType = 'profile';
      } else if (seoData.structuredData['@type'] === 'Person') {
        ogType = 'profile';
      }
      // All fund pages default to 'website' type
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

    // Add article:modified_time for comparison articles
    if (ogType === 'article' && seoData.structuredData) {
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
    
        // Add breadcrumb schema with proper navigation hierarchy
        const breadcrumbItems: any[] = [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL }
        ];

        // Add Browse Funds
        breadcrumbItems.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'Browse Funds',
          'item': `${URL_CONFIG.BASE_URL}/`
        });

        // Add category if available
        if (fund.category) {
          breadcrumbItems.push({
            '@type': 'ListItem',
            'position': breadcrumbItems.length + 1,
            'name': fund.category,
            'item': URL_CONFIG.buildCategoryUrl(fund.category)
          });
        }

        // Add fund
        breadcrumbItems.push({
          '@type': 'ListItem',
          'position': breadcrumbItems.length + 1,
          'name': fund.name,
          'item': URL_CONFIG.buildFundUrl(fund.id)
        });

        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': breadcrumbItems
        };
    
    // Generate FAQ schema for all funds (default or custom)
    const schemas: any[] = [investmentFundSchema, breadcrumbSchema];
    
    // Generate default FAQs if none exist (matching FundFAQSection.tsx logic)
    const defaultFAQs = [
      {
        question: `What makes ${fund.name} unique?`,
        answer: `${fund.name} offers a distinctive investment approach with carefully selected strategies designed to achieve optimal returns while managing risk. The fund combines experienced management with rigorous investment processes to deliver value to investors.`
      },
      {
        question: `How is risk managed?`,
        answer: `${fund.name} employs a multi-layered risk management approach designed to protect capital while pursuing growth opportunities. This includes asset diversification, rigorous selection processes, regular portfolio rebalancing, and professional oversight by experienced managers with proven track records.`
      },
      {
        question: `What are the investment requirements?`,
        answer: `The minimum investment for ${fund.name} is ${fund.minimumInvestment ? `€${fund.minimumInvestment.toLocaleString()}` : 'available upon request'}. The fund features ${fund.redemptionTerms?.frequency || 'periodic'} redemptions with ${fund.redemptionTerms?.minimumHoldingPeriod ? `a ${fund.redemptionTerms.minimumHoldingPeriod}-month` : 'a'} lock-up period. ${fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days notice` : 'Advance notice'} is required for redemptions.`
      },
      {
        question: fund.tags?.includes('Golden Visa Eligible') 
          ? `How does the Golden Visa qualification work?`
          : `What are the regulatory requirements?`,
        answer: fund.tags?.includes('Golden Visa Eligible')
          ? `${fund.name} is approved by Portuguese authorities as a Golden Visa qualifying investment. By investing the minimum amount, you become eligible to apply for Portuguese residency through the Golden Visa program. The fund maintains full compliance with CMVM regulations${fund.cmvmId ? ` and is registered under CMVM #${fund.cmvmId}` : ''}. Our team works closely with investors to ensure all documentation meets Golden Visa requirements.`
          : `${fund.name} operates under strict regulatory oversight${fund.regulatedBy ? ` by ${fund.regulatedBy}` : ''}${fund.cmvmId ? ` and is registered with CMVM #${fund.cmvmId}` : ''}. The fund maintains full compliance with all applicable securities regulations and reporting requirements.`
      },
      {
        question: `What are the expected returns?`,
        answer: `${fund.name} ${fund.returnTarget ? `targets ${fund.returnTarget}` : 'aims to deliver competitive returns'}${fund.historicalPerformance ? `, with historical performance demonstrating the fund's ability to achieve its objectives` : ''}. However, past performance is not indicative of future results. The fund's investments carry inherent market risks. Capital is at risk, and investors should carefully consider their investment objectives and risk tolerance.`
      }
    ];

    // Use fund-specific FAQs if available, otherwise use defaults
    const activeFAQs = (fund.faqs && fund.faqs.length > 0) ? fund.faqs : defaultFAQs;
    
    // Generate FAQ schema with active FAQs
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': activeFAQs.map((faq: any) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
    schemas.push(faqSchema);
    
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

    // Add FAQ schema for category
    const faqSchema = this.getCategoryFAQSchema(categoryName);

    return [baseSchema, itemListSchema, breadcrumbSchema, faqSchema];
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

    // Add FAQ schema for tag
    const faqSchema = this.getTagFAQSchema(tagName);

    return [baseSchema, itemListSchema, breadcrumbSchema, faqSchema];
  }

  private static getManagerStructuredData(managerName: string, managerProfile?: any, funds: any[] = []): any {
    const managerUrl = URL_CONFIG.buildManagerUrl(managerName);
    const fundsCount = funds.length;
    
    // Build comprehensive sameAs array with all social media links and website
    const sameAsLinks: string[] = [];
    if (managerProfile?.website) sameAsLinks.push(managerProfile.website);
    if (managerProfile?.linkedin_url) sameAsLinks.push(managerProfile.linkedin_url);
    if (managerProfile?.twitter_url) sameAsLinks.push(managerProfile.twitter_url);
    if (managerProfile?.facebook_url) sameAsLinks.push(managerProfile.facebook_url);
    if (managerProfile?.instagram_url) sameAsLinks.push(managerProfile.instagram_url);
    
    // Build complete postal address
    const postalAddress: any = {
      '@type': 'PostalAddress',
      'addressCountry': managerProfile?.country || 'PT'
    };
    if (managerProfile?.city) postalAddress.addressLocality = managerProfile.city;
    if (managerProfile?.address) postalAddress.streetAddress = managerProfile.address;
    
    // Base Organization Schema (Enhanced with complete company details)
    const organizationSchema: any = {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'FinancialService'],
      'name': managerName,
      'url': managerProfile?.website || managerUrl,
      ...(managerProfile?.logo_url && { 'logo': managerProfile.logo_url }),
      ...(managerProfile?.description && { 'description': managerProfile.description }),
      'address': postalAddress,
      ...(managerProfile?.founded_year && { 'foundingDate': managerProfile.founded_year.toString() }),
      ...(sameAsLinks.length > 0 && { 'sameAs': sameAsLinks }),
      'areaServed': {
        '@type': 'Place',
        'name': 'Portugal'
      },
      'serviceType': 'Investment Fund Management',
      'knowsAbout': 'Golden Visa Investment Funds',
      'parentOrganization': {
        '@type': 'Organization',
        'name': 'CMVM',
        'url': 'https://www.cmvm.pt/'
      }
    };
    
    // Add registration and license numbers as identifiers
    if (managerProfile?.registration_number || managerProfile?.license_number) {
      const identifiers: any[] = [];
      if (managerProfile.registration_number) {
        identifiers.push({
          '@type': 'PropertyValue',
          'propertyID': 'CMVM Registration Number',
          'value': managerProfile.registration_number
        });
      }
      if (managerProfile.license_number) {
        identifiers.push({
          '@type': 'PropertyValue',
          'propertyID': 'License Number',
          'value': managerProfile.license_number
        });
      }
      organizationSchema.identifier = identifiers;
    }

    // Add contact information if available
    if (managerProfile?.email || managerProfile?.phone) {
      organizationSchema['contactPoint'] = {
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        ...(managerProfile.email && { 'email': managerProfile.email }),
        ...(managerProfile.phone && { 'telephone': managerProfile.phone })
      };
    }

    // BreadcrumbList Schema
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
          'name': 'Fund Managers',
          'item': `${URL_CONFIG.BASE_URL}/managers`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': managerName,
          'item': managerUrl
        }
      ]
    };

    // FinancialService Schema
    const financialServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      'name': `${managerName} Investment Management`,
      'description': managerProfile?.description || `Professional investment fund management services by ${managerName} specializing in Golden Visa eligible funds.`,
      'provider': {
        '@type': 'Organization',
        'name': managerName
      },
      'serviceType': 'Investment Fund Management',
      'areaServed': {
        '@type': 'Place',
        'name': 'Portugal'
      },
      ...(funds.length > 0 && {
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': `${managerName} Investment Funds`,
          'numberOfItems': fundsCount,
          'itemListElement': funds.slice(0, 10).map(fund => ({
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'FinancialProduct',
              'name': fund.name,
              'category': fund.category || 'Investment Fund',
              'url': URL_CONFIG.buildFundUrl(fund.id)
            },
            ...(fund.minimumInvestment && {
              'price': fund.minimumInvestment,
              'priceCurrency': 'EUR'
            })
          }))
        }
      })
    };

    // CollectionPage Schema with ItemList
    const collectionPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${managerName} Golden Visa Investment Funds`,
      'description': `Browse ${fundsCount} Golden Visa eligible investment funds managed by ${managerName}`,
      'url': managerUrl,
      'numberOfItems': fundsCount,
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': funds.map((fund, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'url': URL_CONFIG.buildFundUrl(fund.id),
            'category': fund.category || 'Investment Fund',
            'description': fund.description,
            'provider': {
              '@type': 'Organization',
              'name': managerName
            },
            ...(fund.minimumInvestment && {
              'offers': {
                '@type': 'Offer',
                'price': fund.minimumInvestment,
                'priceCurrency': 'EUR',
                'availability': 'https://schema.org/InStock'
              }
            })
          }
        }))
      }
    };

    // Return array of schemas
    // Use actual manager FAQs from database if available, otherwise use generic FAQs
    const faqSchema = managerProfile?.manager_faqs && Array.isArray(managerProfile.manager_faqs) && managerProfile.manager_faqs.length > 0
      ? this.getManagerSpecificFAQSchema(managerName, managerProfile.manager_faqs)
      : this.getManagerFAQSchema(managerName, fundsCount);
    
    return [
      organizationSchema,
      breadcrumbSchema,
      financialServiceSchema,
      ...(funds.length > 0 ? [collectionPageSchema] : []),
      faqSchema
    ];
  }

  private static getComparisonStructuredData(): any {
    const faqSchema = {
      '@type': 'FAQPage',
      'name': 'Golden Visa Fund Comparison Tool FAQs',
      'description': 'How to use the comparison tool to analyze investment funds',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How do I use the Golden Visa fund comparison tool?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Select any two Golden Visa funds from the comparison interface to view side-by-side analysis of fees, returns, minimums, risk profiles, and fund characteristics. The tool displays detailed metrics including management fees, performance fees, historical returns, minimum investment requirements, and redemption terms. Use filters to narrow down funds by category, manager, or specific features before comparing.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What metrics should I compare when evaluating Golden Visa funds?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Key comparison metrics include: (1) Total fees (management + performance fees), (2) Historical returns over 1, 3, 5 years, (3) Minimum investment amount, (4) Lock-up period and redemption terms, (5) Risk level and volatility, (6) Fund category and investment strategy, (7) Manager track record and AUM, (8) CMVM registration status. Compare funds within the same category for meaningful analysis.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Can I compare funds from different categories?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, you can compare any two Golden Visa funds regardless of category. However, cross-category comparisons (e.g., Bitcoin fund vs. Debt fund) may be less meaningful due to fundamentally different risk-return profiles. For apples-to-apples comparison, compare funds within the same category (e.g., two VC funds, two Real Estate funds). The tool shows category differences to highlight strategy variations.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I interpret the fee comparison?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Fee comparison shows: (1) Management fee: annual percentage charged on AUM (typically 1-2%), (2) Performance fee: percentage of returns above hurdle rate (typically 10-20%), (3) Subscription/redemption fees: one-time charges when entering/exiting (0-3%). Calculate total cost by adding management fee + expected performance fee based on projected returns. Lower fees don\'t always mean better value - consider net returns after all fees.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What does "Minimum Investment" mean in the comparison?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Minimum Investment shows the smallest amount you can invest in each specific fund. Note: Portugal\'s Golden Visa requires €500,000 total investment across one or more eligible funds. If a fund has €250,000 minimum, you can combine it with another fund to reach €500,000 threshold. Some funds have €500,000+ minimums requiring full investment in a single fund.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How reliable are the historical returns shown?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Historical returns are sourced from fund administrators and audited financial statements. Returns represent past performance and do not guarantee future results. Compare returns over multiple time periods (1, 3, 5 years) and consider risk-adjusted returns (returns relative to volatility). Newer funds may show limited history. Review fund prospectus for detailed performance methodology and disclaimers.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What do the risk level indicators mean?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Risk levels indicate expected volatility and potential for loss: (1) Low Risk: Debt/fixed income funds with 3-6% target returns and capital preservation focus, (2) Medium Risk: Diversified or infrastructure funds with 5-9% targets and moderate volatility, (3) High Risk: VC, growth equity, or crypto funds with 10-20%+ targets but higher loss potential. Match risk level to your investment timeline and risk tolerance.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Can I save my fund comparisons?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Each comparison generates a unique URL you can bookmark or share. The URL preserves the exact fund pair comparison for future reference. You can also add individual funds to your watchlist by clicking the star icon on any fund card. Create an account to access your watchlist across devices and receive alerts when watchlist fund data changes.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How often is comparison data updated?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Fund data is updated regularly: (1) Fees and minimums: as reported by fund managers, (2) Historical returns: quarterly from fund administrators, (3) NAV values: monthly or quarterly depending on fund, (4) CMVM registration: verified annually. Check individual fund pages for "Last Updated" timestamps. Contact Movingto\'s legal team for the most current information before making investment decisions.'
          }
        }
      ]
    };

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
        },
        faqSchema
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
      '@graph': [
        {
          '@type': 'CollectionPage',
          'name': 'Fund Managers Directory',
          'description': 'Directory of investment fund managers',
          'url': URL_CONFIG.buildUrl('managers')
        },
        {
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
              'name': 'Fund Managers',
              'item': URL_CONFIG.buildUrl('managers')
            }
          ]
        }
      ]
    };
  }

  private static getCategoriesHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          'name': 'Fund Categories',
          'description': 'Browse investment fund categories',
          'url': URL_CONFIG.buildUrl('categories')
        },
        {
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
              'item': URL_CONFIG.buildUrl('categories')
            }
          ]
        }
      ]
    };
  }

  private static getTagsHubStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          'name': 'Fund Tags',
          'description': 'Explore funds by characteristics',
          'url': URL_CONFIG.buildUrl('tags')
        },
        {
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
              'item': URL_CONFIG.buildUrl('tags')
            }
          ]
        }
      ]
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
      '@graph': [
        {
          '@type': 'AboutPage',
          'name': 'About Movingto',
          'description': 'About our investment fund analysis platform',
          'url': URL_CONFIG.buildUrl('about')
        },
        {
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
              'name': 'About',
              'item': URL_CONFIG.buildUrl('about')
            }
          ]
        }
      ]
    };
  }

  private static getDisclaimerStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          'name': 'Disclaimer',
          'description': 'Investment information disclaimer',
          'url': URL_CONFIG.buildUrl('disclaimer')
        },
        {
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
              'name': 'Disclaimer',
              'item': URL_CONFIG.buildUrl('disclaimer')
            }
          ]
        }
      ]
    };
  }

  private static getFAQStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          'name': 'Portugal Golden Visa Investment Fund FAQs',
          'description': 'Frequently asked questions about Portugal Golden Visa investment funds',
          'url': URL_CONFIG.buildUrl('faqs'),
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What is a Golden Visa investment fund?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'A Golden Visa investment fund is a regulated investment vehicle that allows foreign investors to obtain Portuguese residency by making a qualifying investment. For Portugal\'s Golden Visa program, eligible funds must focus on private equity/venture capital with €500,000 minimum investment and cannot be linked to real estate (rule changed October 2023). Source: IMI Daily regulatory documentation.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What are the minimum investment amounts?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Portugal Golden Visa fund route requires €500,000 total investment (post-October 2023 changes), with no real estate exposure permitted. Individual fund subscription minimums may be lower, but total qualifying investment must reach €500,000. Source: IMI Daily regulatory updates.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How long does the Golden Visa process take?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The processing time varies by country and fund. Typically, it takes 3-12 months from application submission to approval. This includes due diligence, document verification, and government processing. Some countries offer expedited processing for additional fees.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What are the tax implications of Golden Visa investments?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Tax implications depend on your country of residence, the fund\'s jurisdiction, and the type of investment. Generally, you may be subject to capital gains tax, income tax on distributions, and potentially wealth taxes. We recommend consulting with a tax advisor familiar with international tax law.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Can family members be included in the Golden Visa application?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Most Golden Visa programs allow inclusion of family members, typically including spouse, dependent children, and sometimes parents or grandparents. Each family member may require additional investment or fees. Check specific program requirements for eligibility criteria.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What are the ongoing obligations after obtaining a Golden Visa?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Ongoing obligations typically include maintaining the investment for a minimum period (usually 5 years), meeting minimum residency requirements, and complying with tax obligations. Some programs require periodic renewals and proof of continued investment.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How do I compare different Golden Visa funds?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'When comparing funds, consider factors such as minimum investment amount, expected returns, risk level, management fees, fund track record, liquidity terms, and the specific Golden Visa program requirements. Our comparison tools help you evaluate these factors side by side.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What happens if I want to exit my investment early?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Early exit terms vary by fund. Some funds offer liquidity windows at specific intervals, while others may have lock-up periods. Early withdrawal may result in penalties or reduced returns. Review the fund\'s redemption terms carefully before investing.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Are Portugal Golden Visa funds safe?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Portugal Golden Visa funds carry investment risk like all equity investments. However, funds on Movingto are CMVM-regulated, providing regulatory oversight. Due diligence, diversification, and understanding lock-up periods reduce risk. Capital is at risk and past performance does not guarantee future returns.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How long do I need to hold a Golden Visa investment?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Portugal Golden Visa requires a minimum 5-year investment holding period to maintain residency status and apply for citizenship. Individual funds may have additional lock-up periods (typically 5-10 years). Redeeming early may affect visa eligibility and incur penalties.'
              }
            }
          ]
        },
        {
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
              'name': 'FAQs',
              'item': URL_CONFIG.buildUrl('faqs')
            }
          ]
        }
      ]
    };
  }

  private static getPrivacyStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          'name': 'Privacy Policy',
          'description': 'Privacy policy for our platform',
          'url': URL_CONFIG.buildUrl('privacy')
        },
        {
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
              'name': 'Privacy Policy',
              'item': URL_CONFIG.buildUrl('privacy')
            }
          ]
        }
      ]
    };
  }

  private static getCategoryFAQSchema(categoryName: string): any {
    const categoryLower = categoryName.toLowerCase();
    let faqs: Array<{ question: string; answer: string }> = [];

    // Category-specific FAQs
    if (categoryLower === 'bitcoin') {
      faqs = [
        {
          question: 'Are Bitcoin Golden Visa funds eligible for Portuguese residency?',
          answer: 'Yes, Bitcoin-focused investment funds can qualify for Portugal\'s Golden Visa if they meet CMVM registration requirements and the €500,000 minimum investment threshold. The fund must be properly regulated and cannot have real estate exposure (as of October 2023 rule changes).'
        },
        {
          question: 'What are the risks of Bitcoin Golden Visa funds?',
          answer: 'Bitcoin funds carry high volatility risk due to cryptocurrency price fluctuations. Investors should consider market cycles, regulatory changes, custody security, and liquidity constraints. These funds typically have higher risk profiles compared to traditional debt or real estate funds.'
        },
        {
          question: 'How are Bitcoin fund returns taxed in Portugal?',
          answer: 'Portugal offers favorable tax treatment for cryptocurrency gains for individual investors under certain conditions. However, fund-level taxation and distribution taxation vary by fund structure. Consult with Movingto\'s legal team for specific tax implications based on your residency status.'
        }
      ];
    } else if (categoryLower === 'crypto') {
      faqs = [
        {
          question: 'What types of crypto assets do these funds invest in?',
          answer: 'Cryptocurrency Golden Visa funds typically invest in a diversified portfolio of digital assets including Bitcoin, Ethereum, and other established cryptocurrencies. Some funds also invest in blockchain infrastructure, DeFi protocols, and Web3 projects. Investment strategies vary by fund manager.'
        },
        {
          question: 'How liquid are crypto Golden Visa funds?',
          answer: 'Liquidity varies significantly by fund. Some offer quarterly redemptions while others have lock-up periods of 3-5 years. Crypto funds may have redemption gates during market stress. Review each fund\'s redemption terms and NAV calculation frequency before investing.'
        },
        {
          question: 'Are crypto funds more volatile than traditional Golden Visa options?',
          answer: 'Yes, cryptocurrency funds typically exhibit higher volatility than traditional debt, real estate, or infrastructure funds. Monthly returns can swing significantly based on crypto market conditions. These funds are suitable for investors with higher risk tolerance and longer investment horizons.'
        }
      ];
    } else if (categoryLower === 'real estate') {
      faqs = [
        {
          question: 'Can I invest in real estate funds for Portugal Golden Visa?',
          answer: 'As of October 2023, Portugal changed Golden Visa rules to exclude direct real estate investments. However, real estate-focused funds that invest in commercial property, development projects, or REITs may still qualify if they meet CMVM requirements and the €500,000 minimum. Verify eligibility with Movingto\'s legal team.'
        },
        {
          question: 'What returns can I expect from real estate Golden Visa funds?',
          answer: 'Real estate fund returns typically range from 4-8% annually, combining rental income and capital appreciation. Returns depend on property type (residential, commercial, logistics), location, development stage, and market conditions. Review historical performance and current portfolio composition.'
        },
        {
          question: 'How long is the typical lock-up period for real estate funds?',
          answer: 'Real estate Golden Visa funds typically have lock-up periods of 5-7 years to match property development and sales cycles. Some open-ended funds offer quarterly redemptions subject to liquidity gates. Closed-ended funds return capital only at fund maturity or exit events.'
        }
      ];
    } else if (categoryLower === 'debt') {
      faqs = [
        {
          question: 'What types of debt do these funds invest in?',
          answer: 'Debt Golden Visa funds invest in corporate bonds, structured credit, real estate debt, infrastructure loans, and private lending. Some focus on senior secured debt for lower risk, while others pursue mezzanine or subordinated debt for higher yields. Portfolio composition varies by fund strategy.'
        },
        {
          question: 'Are debt funds safer than equity funds for Golden Visa?',
          answer: 'Debt funds generally offer lower volatility and more predictable returns than equity funds, with typical yields of 4-7% annually. They rank senior to equity in capital structure, providing downside protection. However, they still carry credit risk, interest rate risk, and liquidity risk. Review credit ratings and default history.'
        },
        {
          question: 'How are debt fund distributions paid?',
          answer: 'Most debt Golden Visa funds pay quarterly or semi-annual distributions from interest income. Some funds offer capital preservation with periodic coupon payments, while others reinvest cash flow for compound growth. Distribution frequency and yield depend on the fund\'s investment mandate and cash flow generation.'
        }
      ];
    } else if (categoryLower === 'infrastructure') {
      faqs = [
        {
          question: 'What types of infrastructure projects qualify for Golden Visa?',
          answer: 'Infrastructure Golden Visa funds invest in essential assets like renewable energy projects (solar, wind), transportation networks (ports, toll roads), utilities (water, waste management), and telecommunications infrastructure. Projects must be in Portugal or have significant Portuguese economic impact.'
        },
        {
          question: 'What are typical returns for infrastructure funds?',
          answer: 'Infrastructure Golden Visa funds target stable returns of 5-9% annually, combining project cash flows and asset appreciation. Returns are typically lower volatility than equity but higher than pure debt funds. Infrastructure assets often have inflation-linked revenues providing natural hedges.'
        },
        {
          question: 'How long until infrastructure funds return capital?',
          answer: 'Infrastructure funds typically have 7-12 year fund lives matching project development and operational phases. Capital is returned through project dividends, refinancing events, or asset sales. Some funds offer earlier exits through secondary market sales, though at potential discounts.'
        }
      ];
    } else if (categoryLower === 'venture capital') {
      faqs = [
        {
          question: 'Are Venture Capital funds riskier than other Golden Visa options?',
          answer: 'Yes, VC Golden Visa funds carry higher risk due to startup failure rates (typically 50-70% of portfolio companies). However, successful exits can generate 3-10x returns. VC funds are suitable for investors with high risk tolerance, long time horizons (8-12 years), and diversification across other asset classes.'
        },
        {
          question: 'What stage startups do VC Golden Visa funds invest in?',
          answer: 'VC fund stage focus varies: early-stage funds invest in seed/Series A startups with higher risk/reward, while growth-stage funds invest in Series B+ companies with proven business models and lower risk. Some funds focus on specific sectors like fintech, healthtech, or climate tech. Review fund strategy alignment.'
        },
        {
          question: 'When do VC funds distribute returns?',
          answer: 'VC Golden Visa funds typically distribute capital only upon successful exits (M&A or IPO), which can take 5-10 years from initial investment. Unlike income-generating funds, VC funds reinvest proceeds for compound growth. Expect minimal cash flow during fund life with returns concentrated at maturity.'
        }
      ];
    } else if (categoryLower === 'clean energy') {
      faqs = [
        {
          question: 'What types of clean energy projects do these funds invest in?',
          answer: 'Clean Energy Golden Visa funds invest in solar farms, wind projects, battery storage, green hydrogen, EV charging infrastructure, and energy efficiency retrofits. Portugal has strong renewable energy potential with government support through EU Green Deal funding and climate commitments.'
        },
        {
          question: 'Are clean energy funds eligible for Golden Visa?',
          answer: 'Yes, clean energy funds qualify for Portugal Golden Visa if they meet CMVM registration requirements and invest at least €500,000. These funds align with Portugal\'s decarbonization goals and often benefit from government subsidies, power purchase agreements, and EU climate financing.'
        },
        {
          question: 'What returns do clean energy Golden Visa funds generate?',
          answer: 'Clean energy funds typically target 6-10% annual returns combining project revenues (electricity sales, subsidies) and asset appreciation. Returns benefit from long-term power purchase agreements (10-25 years) providing stable cash flows. ESG-focused investors value impact alongside financial returns.'
        }
      ];
    } else {
      // Generic category FAQs
      faqs = [
        {
          question: `What are the benefits of investing in ${categoryName} Golden Visa funds?`,
          answer: `${categoryName} Golden Visa funds offer diversified exposure to this asset class while meeting Portugal residency requirements. Benefits include professional management, regulatory compliance, risk diversification across multiple investments, and access to institutional-quality deals. Minimum investment starts at €500,000.`
        },
        {
          question: `How do I choose the right ${categoryName} fund for Golden Visa?`,
          answer: `Compare ${categoryName} funds based on track record, management team experience, fee structure (management and performance fees), historical returns, risk profile, redemption terms, and investor protection measures. Consider your investment timeline, risk tolerance, and liquidity needs. Movingto\'s legal team can provide personalized guidance.`
        },
        {
          question: `What documents do I need for ${categoryName} Golden Visa investment?`,
          answer: 'Required documents include valid passport, proof of investment (subscription agreement, capital call confirmation), fund prospectus showing CMVM registration, clean criminal record certificate, proof of legal entry to Portugal, and completed IMI (Immigration Authority) application forms. Processing takes 3-12 months.'
        }
      ];
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': `${categoryName} Golden Visa Funds FAQs`,
      'description': `Frequently asked questions about ${categoryName} Golden Visa investment funds`,
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  }

  private static getTagFAQSchema(tagName: string): any {
    const tagLower = tagName.toLowerCase();
    let faqs: Array<{ question: string; answer: string }> = [];

    // Tag-specific FAQs for high-value tags
    if (tagLower === 'verified') {
      faqs = [
        {
          question: 'What does "Verified" mean for Golden Visa funds?',
          answer: 'Verified funds have undergone independent validation of their documentation, performance claims, CMVM registration, and management team credentials. Verification provides investors with additional confidence beyond standard regulatory compliance. Contact Movingto to understand our 6-point verification process.'
        },
        {
          question: 'Do verified funds perform better than non-verified funds?',
          answer: 'Verification indicates transparency and documentation quality, not guaranteed performance. However, verified funds typically have experienced management teams, established track records, and institutional-grade governance. Past performance doesn\'t guarantee future results. Always review each fund\'s historical returns and risk profile.'
        }
      ];
    } else if (tagLower === 'low risk') {
      faqs = [
        {
          question: 'What makes a Golden Visa fund "Low Risk"?',
          answer: 'Low risk funds typically invest in senior debt, investment-grade bonds, diversified loan portfolios, or established infrastructure with stable cash flows. They prioritize capital preservation over high returns. Expected annual returns range 3-6% with lower volatility. Suitable for conservative investors prioritizing residency over aggressive growth.'
        },
        {
          question: 'Can low risk funds still lose money?',
          answer: 'Yes, all investments carry risk. Low risk funds can experience losses from credit defaults, interest rate changes, liquidity constraints, or economic downturns. "Low risk" indicates relative risk compared to equity or VC funds, not zero risk. Review fund prospectus for detailed risk disclosures.'
        }
      ];
    } else if (tagLower === 'high risk') {
      faqs = [
        {
          question: 'Why would someone choose high risk Golden Visa funds?',
          answer: 'High risk funds (VC, growth equity, crypto) target higher returns (10-20%+ annually) to compensate for volatility and potential losses. Suitable for investors with long time horizons (8-12 years), high risk tolerance, diversification across other assets, and who can afford capital loss while still meeting Golden Visa requirements.'
        },
        {
          question: 'What percentage of portfolio should be high risk funds?',
          answer: 'Financial advisors typically recommend limiting high risk investments to 10-30% of total portfolio depending on age, wealth, and risk tolerance. For Golden Visa investors, consider splitting €500,000 minimum across multiple funds (mix of low/medium/high risk) for diversification. Consult Movingto\'s legal team for allocation strategies.'
        }
      ];
    } else if (tagLower === 'dividend paying') {
      faqs = [
        {
          question: 'How often do dividend-paying Golden Visa funds distribute?',
          answer: 'Distribution frequency varies by fund: quarterly (most common), semi-annual, or annual payments. Some funds offer monthly distributions for maximum cash flow. Review fund prospectus for distribution policy, payout ratios, and sustainability of dividend payments based on underlying investment income.'
        },
        {
          question: 'Are Golden Visa fund dividends taxed in Portugal?',
          answer: 'Dividend taxation depends on fund structure, investor tax residency status, and applicable tax treaties. Portugal offers Non-Habitual Resident (NHR) tax regime with potential exemptions. Fund distributions may be taxed as income or capital gains. Consult tax advisor for your specific situation and Movingto for NHR eligibility.'
        }
      ];
    } else if (tagLower === 'esg') {
      faqs = [
        {
          question: 'What ESG criteria do these Golden Visa funds follow?',
          answer: 'ESG Golden Visa funds apply environmental (carbon reduction, renewable energy), social (labor practices, community impact), and governance (board independence, ethics) screening. Most follow EU Taxonomy or SFDR Article 8/9 classifications. Review fund ESG reports for specific metrics, impact targets, and third-party certifications.'
        },
        {
          question: 'Do ESG funds sacrifice returns for impact?',
          answer: 'Recent studies show ESG funds can match or exceed traditional fund returns while providing positive impact. ESG screening may reduce risk by avoiding controversial industries and improving long-term sustainability. However, returns vary by fund manager, strategy, and market conditions. Review historical performance alongside ESG ratings.'
        }
      ];
    } else if (tagLower.includes('target yield') || tagLower.includes('apy')) {
      faqs = [
        {
          question: `What does "${tagName}" mean for Golden Visa funds?`,
          answer: `This indicates the fund's expected annual return target based on investment strategy and historical performance. "Target" yields are projections, not guarantees. Actual returns may be higher or lower depending on market conditions, investment execution, and fund manager skill. Review past performance and risk factors before investing.`
        },
        {
          question: 'Are target yields guaranteed?',
          answer: 'No, target yields are projections based on fund strategy and market assumptions. Actual returns fluctuate based on economic conditions, interest rates, credit performance, and manager execution. Some funds meet or exceed targets consistently, while others underperform. Review 3-5 year historical returns for more reliable expectations.'
        }
      ];
    } else if (tagLower.includes('min. subscription') || tagLower.includes('minimum investment')) {
      faqs = [
        {
          question: `Can I invest less than ${tagName} for Golden Visa?`,
          answer: `Individual fund minimums vary, but Portugal's Golden Visa requires €500,000 total investment across one or more eligible funds. You can combine multiple funds to reach the threshold. Fund minimums indicate per-fund entry requirements. Consult Movingto's legal team to structure qualifying investments.`
        },
        {
          question: 'Does higher minimum investment mean better funds?',
          answer: 'Not necessarily. Minimum subscriptions reflect fund strategy and target investor base (retail vs. institutional). Some excellent funds have €50,000 minimums while others require €1,000,000+. Evaluate funds based on track record, team, strategy, and fees rather than minimum investment alone.'
        }
      ];
    } else {
      // Generic tag FAQs
      faqs = [
        {
          question: `What does the "${tagName}" tag mean for Golden Visa funds?`,
          answer: `The "${tagName}" tag indicates this characteristic or feature is present in the fund's strategy, structure, or investment approach. Tags help investors filter and compare Golden Visa funds based on specific criteria. Review individual fund profiles for detailed information on how this characteristic applies.`
        },
        {
          question: `How many Golden Visa funds have the "${tagName}" tag?`,
          answer: `The number of funds with this tag varies as new funds launch and existing funds update strategies. Use our filter system to see all current "${tagName}" funds, compare their features, fees, and performance. Connect with Movingto's legal team for personalized fund recommendations based on your investment goals.`
        }
      ];
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': `${tagName} Golden Visa Funds FAQs`,
      'description': `Frequently asked questions about ${tagName} Golden Visa investment funds`,
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  }

  // Generate FAQ schema from actual manager FAQs stored in database
  private static getManagerSpecificFAQSchema(managerName: string, managerFaqs: any[]): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': `${managerName} Golden Visa Funds FAQs`,
      'description': `Frequently asked questions about ${managerName} and their Golden Visa investment funds`,
      'mainEntity': managerFaqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  }

  // Generic FAQ schema when manager hasn't added custom FAQs
  private static getManagerFAQSchema(managerName: string, fundsCount: number): any {
    const faqs = [
      {
        question: `What types of Golden Visa funds does ${managerName} manage?`,
        answer: `${managerName} manages ${fundsCount} Golden Visa eligible investment fund${fundsCount !== 1 ? 's' : ''} in Portugal. Their portfolio may include various asset classes such as venture capital, real estate, debt, infrastructure, or alternative investments. Review their individual fund profiles for specific strategies, risk profiles, minimum investments, and historical performance data.`
      },
      {
        question: `Is ${managerName} a registered fund manager in Portugal?`,
        answer: `${managerName} operates as a professional fund manager in Portugal. All Golden Visa eligible funds must be registered with CMVM (Comissão do Mercado de Valores Mobiliários), Portugal's securities regulator. Verify CMVM registration status, license numbers, and regulatory compliance on each fund's profile page before investing.`
      },
      {
        question: `How do I invest in ${managerName}'s Golden Visa funds?`,
        answer: `To invest in ${managerName}'s Golden Visa funds: (1) Review fund profiles comparing strategy, fees, returns, and risk, (2) Contact ${managerName} directly or through Movingto's legal team for subscription documents, (3) Complete KYC/AML verification, (4) Sign subscription agreement and transfer €500,000 minimum investment, (5) Receive proof of investment for Golden Visa application. Processing takes 3-12 months.`
      },
      {
        question: `What is ${managerName}'s track record managing Golden Visa funds?`,
        answer: `Review ${managerName}'s historical performance data, assets under management (AUM), fund inception dates, and investment team credentials on their profile page. Compare their funds' historical returns, risk-adjusted performance, fee structures, and investor protection measures against other managers. Past performance does not guarantee future results.`
      },
      {
        question: `Can I meet with ${managerName}'s investment team?`,
        answer: `Most fund managers offer investor meetings to discuss fund strategy, answer questions, and explain Golden Visa eligibility. Contact ${managerName} directly through their website or request an introduction through Movingto's legal team. Meetings help you assess management quality, investment philosophy, and alignment with your goals before committing €500,000+.`
      },
      {
        question: `What fees does ${managerName} charge for fund management?`,
        answer: `Fund management fees vary by strategy and typically include: (1) Management fee: 1-2% annually on AUM, (2) Performance fee: 10-20% on returns above hurdle rate, (3) Subscription/redemption fees: 0-3%. Review detailed fee structures on each fund's profile. Compare total cost of ownership across ${managerName}'s funds and competitors before investing.`
      },
      {
        question: `Does ${managerName} manage verified Golden Visa funds?`,
        answer: `Some of ${managerName}'s funds may carry "Verified" status indicating independent validation of documentation, performance claims, and compliance. Verified funds undergo enhanced due diligence beyond standard CMVM registration. Check individual fund profiles for verification badges and review Movingto's 6-point verification criteria.`
      },
      {
        question: `How can I track performance of ${managerName}'s funds?`,
        answer: `Fund performance tracking varies by fund: (1) Quarterly NAV updates from the fund administrator, (2) Annual audited financial statements, (3) Monthly investor reports for some funds, (4) Access to investor portal for real-time data. Review NAV calculation frequency, reporting transparency, and auditor credentials before investing.`
      }
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': `${managerName} Golden Visa Funds FAQs`,
      'description': `Frequently asked questions about ${managerName} and their Golden Visa investment funds`,
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
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

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': `${fund1.name} vs ${fund2.name} Comparison FAQs`,
      'description': `Frequently asked questions about comparing ${fund1.name} and ${fund2.name}`,
      'mainEntity': [
        {
          '@type': 'Question',
          'name': `Which fund has lower fees: ${fund1.name} or ${fund2.name}?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `Compare the total fee structure of both funds including management fees, performance fees, and subscription/redemption fees. ${fund1.name} charges ${fund1.managementFee ? fund1.managementFee + '% management fee' : 'fees detailed in prospectus'} while ${fund2.name} charges ${fund2.managementFee ? fund2.managementFee + '% management fee' : 'fees detailed in prospectus'}. Consider net returns after all fees rather than gross returns alone. Review complete fee schedules in each fund's offering documents.`
          }
        },
        {
          '@type': 'Question',
          'name': `Which fund has better historical performance?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `Review historical returns over multiple time periods (1, 3, 5 years) and compare risk-adjusted performance. ${fund1.name} is managed by ${fund1.managerName} while ${fund2.name} is managed by ${fund2.managerName}. Past performance does not guarantee future results. Consider consistency of returns, drawdown periods, and performance relative to category benchmarks when evaluating track records.`
          }
        },
        {
          '@type': 'Question',
          'name': `What are the minimum investment requirements for each fund?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `${fund1.name} has a minimum investment of ${fund1.minimumInvestment ? '€' + fund1.minimumInvestment.toLocaleString() : 'amount specified in prospectus'}, while ${fund2.name} requires ${fund2.minimumInvestment ? '€' + fund2.minimumInvestment.toLocaleString() : 'amount specified in prospectus'}. Remember that Portugal's Golden Visa requires €500,000 total investment. You can combine multiple funds to reach this threshold if individual minimums are lower. Consult Movingto's legal team to structure qualifying investments.`
          }
        },
        {
          '@type': 'Question',
          'name': `Which fund category do these belong to?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `${fund1.name} is categorized as ${fund1.category || 'investment fund'} while ${fund2.name} falls under ${fund2.category || 'investment fund'}. Different categories have distinct risk-return profiles, liquidity terms, and investment strategies. Compare funds within the same category for more meaningful analysis, or compare across categories to understand diversification opportunities within your €500,000 Golden Visa investment.`
          }
        },
        {
          '@type': 'Question',
          'name': `What are the redemption terms for each fund?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `Redemption terms vary significantly between funds and impact liquidity. Review each fund's lock-up periods, redemption windows (monthly, quarterly, annual), notice periods, and potential redemption fees. Some funds have gates limiting redemptions during stress periods. For Golden Visa purposes, you must maintain €500,000 investment for at least 5 years. Check individual fund prospectuses for complete redemption policies.`
          }
        },
        {
          '@type': 'Question',
          'name': `Are both funds CMVM registered for Golden Visa?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `All funds listed on Movingto must be CMVM (Comissão do Mercado de Valores Mobiliários) registered to qualify for Portugal's Golden Visa program. Verify current registration status, CMVM fund codes, and regulatory compliance on each fund's profile page. "Verified" badges indicate independent validation beyond standard CMVM registration. Always confirm eligibility with Movingto's legal team before investing.`
          }
        },
        {
          '@type': 'Question',
          'name': `Which fund is better for my Golden Visa application?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `The "better" fund depends on your investment goals, risk tolerance, time horizon, and liquidity needs. Compare: (1) Expected returns vs. acceptable risk, (2) Lock-up period alignment with your timeline, (3) Fee impact on net returns, (4) Manager track record and expertise, (5) Portfolio diversification with other assets. Both funds qualify for Golden Visa. Connect with Movingto's legal team for personalized recommendations based on your complete financial situation.`
          }
        }
      ]
    };

    // Return array with separate root-level schemas for better SEO
    return [
      // Separate BreadcrumbList at root level (not nested in WebPage)
      {
        "@context": "https://schema.org",
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
            "name": "Comparisons Hub",
            "item": URL_CONFIG.buildUrl('/comparisons')
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${fund1.name} vs ${fund2.name}`,
            "item": comparisonUrl
          }
        ]
      },
      // WebPage schema
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${fund1.name} vs ${fund2.name} | Portugal Golden Visa Fund Comparison`,
        "description": `Compare ${fund1.name} vs ${fund2.name}: fees, minimum investment, target returns, fund size, Golden Visa eligibility, redemption terms and more to choose the right Portugal Golden Visa fund.`,
        "url": comparisonUrl
      },
      // ItemList for the two funds being compared
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Compared Funds",
        "numberOfItems": 2,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "FinancialProduct",
              "name": fund1.name,
              "description": fund1.description || `Investment fund: ${fund1.name}`,
              "url": URL_CONFIG.buildFundUrl(fund1.id),
              "offers": {
                "@type": "Offer",
                "price": fund1.minimumInvestment || 0,
                "priceCurrency": "EUR"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
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
          }
        ]
      },
      // FAQPage schema (sole source - client-side FAQSection skips injection)
      faqSchema
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

  // Watchlist structured data (user-specific, minimal schema)
  private static getSavedFundsStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Investment Funds Watchlist',
      'description': 'User\'s Portugal Golden Visa investment funds watchlist',
      'url': URL_CONFIG.buildUrl('/saved-funds')
    };
  }

  // Team Member structured data with @graph format for Rich Results
  private static getTeamMemberStructuredData(params: any): any {
    const pageUrl = URL_CONFIG.buildUrl(`/team/${params.slug}`);
    const personId = `${pageUrl}#person`;
    const companyUrl = params.companyName ? URL_CONFIG.buildUrl(`/manager/${managerToSlug(params.companyName)}`) : undefined;
    const companyId = companyUrl ? `${companyUrl}#organization` : undefined;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': personId,
          'name': params.name,
          'jobTitle': params.role,
          'url': pageUrl,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': pageUrl
          },
          ...(params.photoUrl && { image: params.photoUrl }),
          ...(params.bio && { description: params.bio }),
          ...(params.linkedinUrl && { sameAs: [params.linkedinUrl] }),
          ...(params.companyName && {
            worksFor: {
              '@type': 'Organization',
              '@id': companyId,
              'name': params.companyName,
              'url': companyUrl
            }
          })
        },
        {
          '@type': 'WebPage',
          '@id': pageUrl,
          'name': `${params.name} – ${params.role}`,
          'description': `Team member profile for ${params.name}${params.companyName ? ` at ${params.companyName}` : ''}`,
          'mainEntity': { '@id': personId }
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
            { '@type': 'ListItem', 'position': 2, 'name': params.companyName || 'Fund Manager', 'item': params.companyName ? companyUrl : URL_CONFIG.BASE_URL },
            { '@type': 'ListItem', 'position': 3, 'name': params.name, 'item': pageUrl }
          ]
        }
      ]
    };
  }

  // IRA/401k eligible funds page structured data
  private static getIRAEligibleStructuredData(funds?: Fund[]): any[] {
    const pageUrl = URL_CONFIG.buildUrl('/ira-401k-eligible-funds');
    const qefFunds = funds?.filter(f => f.pficStatus) || [];

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'IRA & 401k Eligible Portugal Golden Visa Funds',
        'description': 'QEF-eligible Portugal Golden Visa funds suitable for US retirement accounts with favorable PFIC tax treatment',
        'url': pageUrl,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': qefFunds.length,
          'itemListElement': qefFunds.slice(0, 10).map((fund, index) => ({
            '@type': 'InvestmentFund',
            'position': index + 1,
            'name': fund.name,
            'description': fund.description,
            'url': URL_CONFIG.buildFundUrl(fund.id)
          }))
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What is a QEF-eligible fund?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'A Qualified Electing Fund (QEF) eligible fund provides annual PFIC statements allowing US investors to elect QEF treatment, which enables preferential capital gains tax rates instead of punitive ordinary income rates on PFIC distributions.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can I invest in Portugal Golden Visa funds through my IRA or 401k?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, QEF-eligible Portugal Golden Visa funds can be held in US retirement accounts with proper structuring. The QEF election simplifies tax reporting and eliminates the complex interest charges that typically apply to PFIC investments.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What are the tax benefits of QEF election?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'QEF election provides long-term capital gains treatment (15-20% tax rates instead of up to 37%), eliminates interest charges on deferred gains, simplifies Form 8621 filing, and makes funds suitable for tax-deferred retirement accounts.'
            }
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': 'IRA & 401k Eligible Funds', 'item': pageUrl }
        ]
      }
    ];
  }

}
