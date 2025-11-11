
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
    
    const componentPromises = {
      Index: import('../pages/Index').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load Index');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      FundDetails: import('../pages/FundDetails').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load FundDetails');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      TagsHub: import('../pages/TagsHub').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load TagsHub');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      TagPage: import('../pages/TagPage').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load TagPage');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      CategoriesHub: import('../pages/CategoriesHub').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load CategoriesHub');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      CategoryPage: import('../pages/CategoryPage').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load CategoryPage');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      ManagersHub: import('../pages/ManagersHub').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load ManagersHub');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      FundManager: import('../pages/FundManager').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load FundManager');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      About: import('../pages/About').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load About');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      Disclaimer: import('../pages/Disclaimer').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load Disclaimer');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
        return null;
      }),
      Privacy: import('../pages/Privacy').then(m => m.default).catch(err => {
        console.error('❌ ComponentLoader: Failed to load Privacy');
        console.error('   Error:', err.message);
        if (isDebug) console.error('   Stack:', err.stack);
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
      FundComparison: import('../pages/FundComparison').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load FundComparison:', err.message);
        return null;
      }),
      FundAlternatives: import('../pages/FundAlternatives').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load FundAlternatives:', err.message);
        return null;
      }),
      AlternativesHub: import('../pages/AlternativesHub').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load AlternativesHub:', err.message);
        return null;
      }),
      Auth: import('../pages/Auth').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load Auth:', err.message);
        return null;
      }),
      AccountSettings: import('../pages/AccountSettings').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load AccountSettings:', err.message);
        return null;
      }),
      ResetPassword: import('../pages/ResetPassword').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load ResetPassword:', err.message);
        return null;
      }),
      EmailConfirmation: import('../pages/EmailConfirmation').then(m => m.default).catch(err => {
        console.warn('ComponentLoader: Failed to load EmailConfirmation:', err.message);
        return null;
      }),
    };

    const components = await Promise.all(Object.values(componentPromises));
    const componentKeys = Object.keys(componentPromises);
    
    const loadedComponents: any = {};
    componentKeys.forEach((key, index) => {
      loadedComponents[key] = components[index];
    });

    if (isDebug) {
      const summary = Object.fromEntries(
        Object.entries(loadedComponents).map(([key, component]) => [key, component ? '✅' : '❌'])
      );
      console.log('🔥 ComponentLoader: Component loading summary:');
      Object.entries(summary).forEach(([name, status]) => {
        console.log(`   ${status} ${name}`);
      });

      const successCount = Object.values(loadedComponents).filter(Boolean).length;
      const totalCount = Object.keys(loadedComponents).length;
      
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
