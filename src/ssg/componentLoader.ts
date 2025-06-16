
import React from 'react';

// Mock TooltipProvider for SSR
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

// Component loader with error handling using dynamic imports
export const loadComponent = async (path: string, componentName: string = 'default') => {
  try {
    const module = await import(path);
    return module[componentName] || module.default;
  } catch (error: any) {
    console.warn(`Could not load component from ${path}:`, error.message);
    return () => React.createElement('div', null, 'Loading...');
  }
};

// Load all page components using dynamic imports
export const loadComponents = async () => {
  const components: any = {};
  
  try {
    const [
      Index,
      FundDetails,
      TagPage,
      CategoryPage,
      TagsHub,
      CategoriesHub,
      ManagersHub,
      About,
      Disclaimer,
      Privacy,
      ComparisonPage,
      FundManager,
      FAQs,
      ComparisonsHub,
      ROICalculator,
      FundQuiz,
    ] = await Promise.all([
      import('../pages/Index'),
      import('../pages/FundDetails'),
      import('../pages/TagPage'),
      import('../pages/CategoryPage'),
      import('../pages/TagsHub'),
      import('../pages/CategoriesHub'),
      import('../pages/ManagersHub'),
      import('../pages/About'),
      import('../pages/Disclaimer'),
      import('../pages/Privacy'),
      import('../pages/ComparisonPage'),
      import('../pages/FundManager'),
      import('../pages/FAQs'),
      import('../pages/ComparisonsHub'),
      import('../pages/ROICalculator'),
      import('../pages/FundQuiz'),
    ]);

    components.Index = Index.default;
    components.FundDetails = FundDetails.default;
    components.TagPage = TagPage.default;
    components.CategoryPage = CategoryPage.default;
    components.TagsHub = TagsHub.default;
    components.CategoriesHub = CategoriesHub.default;
    components.ManagersHub = ManagersHub.default;
    components.About = About.default;
    components.Disclaimer = Disclaimer.default;
    components.Privacy = Privacy.default;
    components.ComparisonPage = ComparisonPage.default;
    components.FundManager = FundManager.default;
    components.FAQs = FAQs.default;
    components.ComparisonsHub = ComparisonsHub.default;
    components.ROICalculator = ROICalculator.default;
    components.FundQuiz = FundQuiz.default;
  } catch (error) {
    console.error('Error loading components:', error);
  }

  return components;
};
