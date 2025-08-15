
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

// Ensure React is available globally for SSR and client-side
if (typeof global !== 'undefined' && !global.React) {
  global.React = React;
}
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

export { TooltipProvider };

export const loadComponents = async () => {
  try {
    console.log('🔥 ComponentLoader: Starting component loading...');
    
    const componentPromises = {
      Index: import('../pages/Index').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load Index:', err.message);
        return null;
      }),
      FundIndex: import('../pages/FundIndex').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load FundIndex:', err.message);
        return null;
      }),
      FundDetails: import('../pages/FundDetails').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load FundDetails:', err.message);
        return null;
      }),
      TagsHub: import('../pages/TagsHub').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load TagsHub:', err.message);
        return null;
      }),
      TagPage: import('../pages/TagPage').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load TagPage:', err.message);
        return null;
      }),
      CategoriesHub: import('../pages/CategoriesHub').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load CategoriesHub:', err.message);
        return null;
      }),
      CategoryPage: import('../pages/CategoryPage').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load CategoryPage:', err.message);
        return null;
      }),
      ManagersHub: import('../pages/ManagersHub').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load ManagersHub:', err.message);
        return null;
      }),
      FundManager: import('../pages/FundManager').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load FundManager:', err.message);
        return null;
      }),
      About: import('../pages/About').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load About:', err.message);
        return null;
      }),
      Disclaimer: import('../pages/Disclaimer').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load Disclaimer:', err.message);
        return null;
      }),
      Privacy: import('../pages/Privacy').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load Privacy:', err.message);
        return null;
      }),
      ComparisonPage: import('../pages/ComparisonPage').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load ComparisonPage:', err.message);
        return null;
      }),
      ComparisonsHub: import('../pages/ComparisonsHub').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load ComparisonsHub:', err.message);
        return null;
      }),
      FAQs: import('../pages/FAQs').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load FAQs:', err.message);
        return null;
      }),
      ROICalculator: import('../pages/ROICalculator').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load ROICalculator:', err.message);
        return null;
      }),
      FundQuiz: import('../pages/FundQuiz').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load FundQuiz:', err.message);
        return null;
      }),
      ListYourFund: import('../pages/ListYourFund').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load ListYourFund:', err.message);
        return null;
      })
    };

    const components = await Promise.all(Object.values(componentPromises));
    const componentKeys = Object.keys(componentPromises);
    
    const loadedComponents: any = {};
    componentKeys.forEach((key, index) => {
      loadedComponents[key] = components[index];
    });

    console.log('🔥 ComponentLoader: Component loading summary:', 
      Object.fromEntries(
        Object.entries(loadedComponents).map(([key, component]) => [key, !!component])
      )
    );

    const successCount = Object.values(loadedComponents).filter(Boolean).length;
    const totalCount = Object.keys(loadedComponents).length;
    
    console.log(`🔥 ComponentLoader: Successfully loaded ${successCount}/${totalCount} components`);

    return loadedComponents;
  } catch (error) {
    console.error('🔥 ComponentLoader: Critical error loading components:', error);
    return {};
  }
};
