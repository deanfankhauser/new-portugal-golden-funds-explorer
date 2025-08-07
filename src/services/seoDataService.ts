import { SEOData, PageSEOProps } from '../types/seo';
import { FundPageSEOService } from './seo/fundPageSEOService';
import { ManagerPageSEOService } from './seo/managerPageSEOService';
import { CategoryPageSEOService } from './seo/categoryPageSEOService';
import { UtilityPageSEOService } from './seo/utilityPageSEOService';
import { ComparisonPageSEOService } from './seo/comparisonPageSEOService';
import { FundIndexSEOService } from './seo/fundIndexSEOService';

export class SEODataService {
  static getSEOData({ 
    pageType, 
    fundName, 
    managerName, 
    categoryName, 
    tagName,
    comparisonTitle
  }: PageSEOProps): SEOData {

    switch (pageType) {
      case 'homepage':
        return FundPageSEOService.getHomepageSEO();
      
      case 'fund-index':
        return FundIndexSEOService.getFundIndexSEO();
      
      case 'fund':
        if (!fundName) {
          return FundPageSEOService.getHomepageSEO();
        }
        return FundPageSEOService.getFundPageSEO(fundName);
      
      case 'manager':
        if (!managerName) {
          return FundPageSEOService.getHomepageSEO();
        }
        return ManagerPageSEOService.getManagerPageSEO(managerName);
      
      case 'category':
        if (!categoryName) {
          return FundPageSEOService.getHomepageSEO();
        }
        return CategoryPageSEOService.getCategoryPageSEO(categoryName);
      
      case 'tag':
        if (!tagName) {
          return CategoryPageSEOService.getTagPageSEO('Investment');
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
        return FundPageSEOService.getHomepageSEO();
    }
  }
}
