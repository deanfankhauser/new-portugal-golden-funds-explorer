
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

if (typeof global !== 'undefined' && !global.React) {
  global.React = React;
}

export { TooltipProvider };

export const loadComponents = async () => {
  try {
    const [
      Index,
      FundIndex,
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
      import('../pages/FundIndex').then(m => m.default).catch(() => null),
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

    console.log('🔥 ComponentLoader: All components loaded successfully', {
      Index: !!Index,
      FundIndex: !!FundIndex,
      FundDetails: !!FundDetails,
      TagsHub: !!TagsHub,
      TagPage: !!TagPage,
      CategoriesHub: !!CategoriesHub,
      CategoryPage: !!CategoryPage,
      ManagersHub: !!ManagersHub,
      FundManager: !!FundManager,
      About: !!About,
      Disclaimer: !!Disclaimer,
      Privacy: !!Privacy,
      ComparisonPage: !!ComparisonPage,
      ComparisonsHub: !!ComparisonsHub,
      FAQs: !!FAQs,
      ROICalculator: !!ROICalculator,
      FundQuiz: !!FundQuiz
    });

    return {
      Index,
      FundIndex,
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
    console.error('🔥 ComponentLoader: Error loading components:', error);
    return {};
  }
};
