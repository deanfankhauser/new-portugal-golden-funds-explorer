
import { SEOData, PageSEOProps } from '../types/seo';
import { FundPageSEOService } from './seo/fundPageSEOService';
import { ManagerPageSEOService } from './seo/managerPageSEOService';
import { CategoryPageSEOService } from './seo/categoryPageSEOService';
import { UtilityPageSEOService } from './seo/utilityPageSEOService';
import { ComparisonPageSEOService } from './seo/comparisonPageSEOService';

export class SEODataService {
  static getSEOData({ 
    pageType, 
    fundName, 
    managerName, 
    categoryName, 
    tagName,
    comparisonTitle
  }: PageSEOProps): SEOData {
    console.log('🔥 SEODataService: ===== PROCESSING SEO DATA REQUEST =====');
    console.log('🔥 SEODataService: Input parameters:', {
      pageType,
      fundName,
      managerName,
      categoryName,
      tagName,
      comparisonTitle
    });
    
    // Add proxy detection right here
    if (typeof window !== 'undefined') {
      const isUnderProxy = window.location.pathname.startsWith('/funds/') || 
                          window.location.href.includes('/funds/');
      
      console.log('🔥 SEODataService: Current URL context:', {
        href: window.location.href,
        pathname: window.location.pathname,
        origin: window.location.origin,
        isUnderProxy,
        pageType,
        fundName
      });
      
      if (isUnderProxy && pageType === 'fund') {
        console.log('🔥 SEODataService: 🚨 FUND PAGE UNDER PROXY - Investigating parameters');
        console.log('🔥 SEODataService: Fund name received:', fundName);
        console.log('🔥 SEODataService: Page type:', pageType);
        
        if (!fundName) {
          console.error('🔥 SEODataService: 🚨🚨🚨 CRITICAL: Fund name is missing under proxy!');
          console.error('🔥 SEODataService: This is likely the root cause of the default title issue');
        } else {
          console.log('🔥 SEODataService: ✅ Fund name is present, proceeding with fund SEO generation');
        }
      }
    }

    switch (pageType) {
      case 'homepage':
        console.log('🔥 SEODataService: Generating homepage SEO');
        const homepageSEO = FundPageSEOService.getHomepageSEO();
        console.log('🔥 SEODataService: Homepage SEO generated:', homepageSEO);
        return homepageSEO;
      
      case 'fund':
        console.log('🔥 SEODataService: ===== GENERATING FUND SEO =====');
        console.log('🔥 SEODataService: Fund name parameter:', fundName);
        
        if (!fundName) {
          console.error('🔥 SEODataService: 🚨🚨🚨 CRITICAL ERROR: Fund name is missing for fund page!');
          console.error('🔥 SEODataService: This will cause fallback to homepage SEO');
          console.error('🔥 SEODataService: Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
          
          const fallbackSEO = FundPageSEOService.getHomepageSEO();
          console.log('🔥 SEODataService: Returning fallback homepage SEO:', fallbackSEO);
          return fallbackSEO;
        }
        
        console.log('🔥 SEODataService: Calling FundPageSEOService.getFundPageSEO with:', fundName);
        const fundSEO = FundPageSEOService.getFundPageSEO(fundName);
        console.log('🔥 SEODataService: Fund SEO generated:', fundSEO);
        
        // Verify the SEO is fund-specific
        if (fundSEO.title === 'Portugal Golden Visa Investment Funds | Eligible Investments 2025') {
          console.error('🔥 SEODataService: 🚨🚨🚨 CRITICAL: Generated fund SEO has default homepage title!');
          console.error('🔥 SEODataService: Fund name was:', fundName);
          console.error('🔥 SEODataService: Generated SEO:', fundSEO);
        } else {
          console.log('🔥 SEODataService: ✅ Fund SEO appears to be fund-specific');
        }
        
        return fundSEO;
      
      case 'manager':
        console.log('🔥 SEODataService: Generating manager SEO for:', managerName);
        if (!managerName) {
          console.error('🔥 SEODataService: Manager name is missing for manager page!');
          return FundPageSEOService.getHomepageSEO(); // Fallback
        }
        return ManagerPageSEOService.getManagerPageSEO(managerName);
      
      case 'category':
        console.log('🔥 SEODataService: Generating category SEO for:', categoryName);
        if (!categoryName) {
          console.error('🔥 SEODataService: Category name is missing for category page!');
          return FundPageSEOService.getHomepageSEO(); // Fallback
        }
        return CategoryPageSEOService.getCategoryPageSEO(categoryName);
      
      case 'tag':
        console.log('🔥 SEODataService: Generating tag SEO for:', tagName);
        if (!tagName) {
          console.error('🔥 SEODataService: Tag name is missing for tag page!');
          return CategoryPageSEOService.getTagPageSEO('Investment'); // Fallback
        }
        return CategoryPageSEOService.getTagPageSEO(tagName);

      case '404':
        return UtilityPageSEOService.getNotFoundPageSEO();

      case 'disclaimer':
        return UtilityPageSEOService.getDisclaimerPageSEO();

      case 'about':
        return UtilityPageSEOService.getAboutPageSEO();

      case 'faqs':
        return UtilityPageSEOService.getFAQsPageSEO();

      case 'privacy':
        return UtilityPageSEOService.getPrivacyPageSEO();

      case 'comparison':
        return ComparisonPageSEOService.getComparisonPageSEO();

      case 'comparisons-hub':
        return ComparisonPageSEOService.getComparisonsHubSEO();

      case 'fund-comparison':
        return ComparisonPageSEOService.getFundComparisonSEO(comparisonTitle!);

      case 'roi-calculator':
        return ComparisonPageSEOService.getROICalculatorSEO();

      case 'fund-quiz':
        return ComparisonPageSEOService.getFundQuizSEO();

      case 'managers-hub':
        return ManagerPageSEOService.getManagersHubSEO();

      case 'categories-hub':
        return CategoryPageSEOService.getCategoriesHubSEO();

      case 'tags-hub':
        return CategoryPageSEOService.getTagsHubSEO();
      
      default:
        console.log('🔥 SEODataService: Using default homepage SEO for unknown page type:', pageType);
        const defaultSEO = FundPageSEOService.getHomepageSEO();
        console.log('🔥 SEODataService: Default SEO generated:', defaultSEO);
        return defaultSEO;
    }
  }
}
