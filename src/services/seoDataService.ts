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
    console.log('SEODataService: Processing SEO data request:', {
      pageType,
      fundName,
      managerName,
      categoryName,
      tagName,
      comparisonTitle
    });

    switch (pageType) {
      case 'homepage':
        console.log('SEODataService: Generating homepage SEO');
        return FundPageSEOService.getHomepageSEO();
      
      case 'fund':
        console.log('SEODataService: Generating fund SEO for:', fundName);
        if (!fundName) {
          console.error('SEODataService: Fund name is missing for fund page!');
          return FundPageSEOService.getHomepageSEO(); // Fallback
        }
        const fundSEO = FundPageSEOService.getFundPageSEO(fundName);
        console.log('SEODataService: Generated fund SEO:', fundSEO);
        return fundSEO;
      
      case 'manager':
        console.log('SEODataService: Generating manager SEO for:', managerName);
        if (!managerName) {
          console.error('SEODataService: Manager name is missing for manager page!');
          return FundPageSEOService.getHomepageSEO(); // Fallback
        }
        return ManagerPageSEOService.getManagerPageSEO(managerName);
      
      case 'category':
        console.log('SEODataService: Generating category SEO for:', categoryName);
        if (!categoryName) {
          console.error('SEODataService: Category name is missing for category page!');
          return FundPageSEOService.getHomepageSEO(); // Fallback
        }
        return CategoryPageSEOService.getCategoryPageSEO(categoryName);
      
      case 'tag':
        console.log('SEODataService: Generating tag SEO for:', tagName);
        if (!tagName) {
          console.error('SEODataService: Tag name is missing for tag page!');
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
        console.log('SEODataService: Using default homepage SEO for unknown page type:', pageType);
        return FundPageSEOService.getHomepageSEO();
    }
  }
}
