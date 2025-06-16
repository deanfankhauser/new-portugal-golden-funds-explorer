
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

// Ensure React is available globally for SSR
if (typeof global !== 'undefined' && !global.React) {
  global.React = React;
}

export { TooltipProvider };

export const loadComponents = async () => {
  try {
    // Use dynamic imports with error handling
    const [
      Index,
      FundDetails,
      TagsHub,
      TagPage,
      CategoriesHub,
      CategoryPage,
      ManagersHub,
      FundManager,
      About,
      Disclaimer,
      Privacy,
      ComparisonPage,
      ComparisonsHub,
      FAQs,
      ROICalculator,
      FundQuiz
    ] = await Promise.all([
      import('../pages/Index').then(m => m.default).catch(() => null),
      import('../pages/FundDetails').then(m => m.default).catch(() => null),
      import('../pages/TagsHub').then(m => m.default).catch(() => null),
      import('../pages/TagPage').then(m => m.default).catch(() => null),
      import('../pages/CategoriesHub').then(m => m.default).catch(() => null),
      import('../pages/CategoryPage').then(m => m.default).catch(() => null),
      import('../pages/ManagersHub').then(m => m.default).catch(() => null),
      import('../pages/FundManager').then(m => m.default).catch(() => null),
      import('../pages/About').then(m => m.default).catch(() => null),
      import('../pages/Disclaimer').then(m => m.default).catch(() => null),
      import('../pages/Privacy').then(m => m.default).catch(() => null),
      import('../pages/ComparisonPage').then(m => m.default).catch(() => null),
      import('../pages/ComparisonsHub').then(m => m.default).catch(() => null),
      import('../pages/FAQs').then(m => m.default).catch(() => null),
      import('../pages/ROICalculator').then(m => m.default).catch(() => null),
      import('../pages/FundQuiz').then(m => m.default).catch(() => null)
    ]);

    return {
      Index,
      FundDetails,
      TagsHub,
      TagPage,
      CategoriesHub,
      CategoryPage,
      ManagersHub,
      FundManager,
      About,
      Disclaimer,
      Privacy,
      ComparisonPage,
      ComparisonsHub,
      FAQs,
      ROICalculator,
      FundQuiz
    };
  } catch (error) {
    console.error('Error loading components:', error);
    return {};
  }
};
