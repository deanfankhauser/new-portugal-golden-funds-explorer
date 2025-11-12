
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

export const loadComponents = async (only?: string[]) => {
  try {
    const isSSG = typeof process !== 'undefined';
    const isDebug = isSSG && process.env.SSG_DEBUG === '1';
    
    if (isDebug) {
      console.log('\n🔥 ComponentLoader: Starting component loading...');
      console.log('🔥 ComponentLoader: Environment:', {
        isSSG,
        nodeEnv: process.env.NODE_ENV,
        ssgDebug: process.env.SSG_DEBUG
      });
    }
    
    const loaders: Record<string, () => Promise<any>> = {
      Index: () => import('../pages/Index').then(m => m.default),
      FundDetails: () => import('../pages/FundDetails').then(m => m.default),
      TagsHub: () => import('../pages/TagsHub').then(m => m.default),
      TagPage: () => import('../pages/TagPage').then(m => m.default),
      CategoriesHub: () => import('../pages/CategoriesHub').then(m => m.default),
      CategoryPage: () => import('../pages/CategoryPage').then(m => m.default),
      ManagersHub: () => import('../pages/ManagersHub').then(m => m.default),
      FundManager: () => import('../pages/FundManager').then(m => m.default),
      About: () => import('../pages/About').then(m => m.default),
      Disclaimer: () => import('../pages/Disclaimer').then(m => m.default),
      Privacy: () => import('../pages/Privacy').then(m => m.default),
      ComparisonPage: () => import('../pages/ComparisonPage').then(m => m.default),
      ComparisonsHub: () => import('../pages/ComparisonsHub').then(m => m.default),
      FAQs: () => import('../pages/FAQs').then(m => m.default),
      ROICalculator: () => import('../pages/ROICalculator').then(m => m.default),
      FundComparison: () => import('../pages/FundComparison').then(m => m.default),
      FundAlternatives: () => import('../pages/FundAlternatives').then(m => m.default),
      AlternativesHub: () => import('../pages/AlternativesHub').then(m => m.default),
      Auth: () => import('../pages/Auth').then(m => m.default),
      AccountSettings: () => import('../pages/AccountSettings').then(m => m.default),
      ResetPassword: () => import('../pages/ResetPassword').then(m => m.default),
      EmailConfirmation: () => import('../pages/EmailConfirmation').then(m => m.default),
    };

    const names = only && only.length ? only : Object.keys(loaders);

    const loadedComponents: Record<string, any> = {};

    for (const key of names) {
      try {
        loadedComponents[key] = await loaders[key]();
      } catch (err: any) {
        console.error(`❌ ComponentLoader: Failed to load ${key}`);
        console.error('   Error:', err?.message);
        if (isDebug) console.error('   Stack:', err?.stack);
        loadedComponents[key] = null;
      }
    }

    if (isDebug) {
      const summary = Object.fromEntries(
        names.map((key) => [key, loadedComponents[key] ? '✅' : '❌'])
      );
      console.log('🔥 ComponentLoader: Component loading summary:');
      Object.entries(summary).forEach(([name, status]) => {
        console.log(`   ${status} ${name}`);
      });

      const successCount = Object.values(loadedComponents).filter(Boolean).length;
      const totalCount = names.length;
      
      console.log(`🔥 ComponentLoader: Successfully loaded ${successCount}/${totalCount} components\n`);
      
      if (successCount < totalCount) {
        console.warn('⚠️  ComponentLoader: Some components failed to load - will use fallback');
      }
    }

    return loadedComponents;
  } catch (error) {
    console.error('🔥 ComponentLoader: Critical error loading components:', error);
    return {};
  }
};
