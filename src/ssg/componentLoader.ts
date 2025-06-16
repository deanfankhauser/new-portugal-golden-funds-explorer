
import React from 'react';

// Mock TooltipProvider for SSR
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Component loader with error handling
export const loadComponent = (path: string, componentName: string = 'default') => {
  try {
    const module = require(path);
    return module[componentName] || module.default;
  } catch (error) {
    console.warn(`Could not load component from ${path}:`, error.message);
    return () => React.createElement('div', null, 'Loading...');
  }
};

// Load all page components
export const components = {
  Index: loadComponent('../pages/Index'),
  FundDetails: loadComponent('../pages/FundDetails'),
  TagPage: loadComponent('../pages/TagPage'),
  CategoryPage: loadComponent('../pages/CategoryPage'),
  TagsHub: loadComponent('../pages/TagsHub'),
  CategoriesHub: loadComponent('../pages/CategoriesHub'),
  ManagersHub: loadComponent('../pages/ManagersHub'),
  About: loadComponent('../pages/About'),
  Disclaimer: loadComponent('../pages/Disclaimer'),
  Privacy: loadComponent('../pages/Privacy'),
  ComparisonPage: loadComponent('../pages/ComparisonPage'),
  FundManager: loadComponent('../pages/FundManager'),
  FAQs: loadComponent('../pages/FAQs'),
  ComparisonsHub: loadComponent('../pages/ComparisonsHub'),
  ROICalculator: loadComponent('../pages/ROICalculator'),
  FundQuiz: loadComponent('../pages/FundQuiz'),
};
