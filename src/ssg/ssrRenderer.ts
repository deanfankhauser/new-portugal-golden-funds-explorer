
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ConsolidatedSEOService } from '../services/consolidatedSEOService';
import { StaticRoute } from './routeDiscovery';
import { loadComponents, TooltipProvider } from './componentLoader';
import { AuthProvider } from '../contexts/AuthContext';
import { ComparisonProvider } from '../contexts/ComparisonContext';
import { RecentlyViewedProvider } from '../contexts/RecentlyViewedContext';

// Ensure React is available globally for SSR
if (typeof global !== 'undefined' && !global.React) {
  global.React = React;
}
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

export class SSRRenderer {
  static async renderRoute(route: StaticRoute): Promise<{ html: string; seoData: any }> {
    if (import.meta.env.DEV) {
      console.log(`🔥 SSR: Starting render for route ${route.path} (type: ${route.pageType})`);
    }
    
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          retry: false,
        },
      },
    });

    // Get SEO data for this route with detailed logging
    if (import.meta.env.DEV) {
      console.log(`🔥 SSR: Requesting SEO data with params:`, {
        pageType: route.pageType,
        fundName: route.params?.fundName,
        managerName: route.params?.managerName,
        categoryName: route.params?.categoryName,
        tagName: route.params?.tagName,
      });
    }

    const seoData = ConsolidatedSEOService.getSEOData(route.pageType as any, {
      fundName: route.params?.fundName,
      managerName: route.params?.managerName,
      categoryName: route.params?.categoryName,
      tagName: route.params?.tagName,
      comparisonSlug: route.params?.slug,
    });

    // Validate SEO data completeness
    const hasStructuredData = Array.isArray(seoData.structuredData) 
      ? seoData.structuredData.length > 0 
      : !!seoData.structuredData && Object.keys(seoData.structuredData).length > 0;

    if (import.meta.env.DEV) {
      const seoValidation = {
        hasTitle: !!seoData.title,
        hasDescription: !!seoData.description,
        hasUrl: !!seoData.url,
        hasStructuredData,
        titleLength: seoData.title?.length || 0,
        descriptionLength: seoData.description?.length || 0
      };

      console.log(`🔥 SSR: SEO data validation for ${route.path}:`, seoValidation);
      console.log(`🔥 SSR: Generated SEO data:`, {
        title: seoData.title,
        description: seoData.description.substring(0, 100) + '...',
        url: seoData.url,
        pageType: route.pageType,
        structuredDataInfo: Array.isArray(seoData.structuredData) 
          ? `array with ${seoData.structuredData.length} items` 
          : `object with ${seoData.structuredData ? Object.keys(seoData.structuredData).length : 0} keys`
      });
    }

    // Load all components
    const components = await loadComponents();
    const FallbackComponent = () => React.createElement('div', { className: 'p-8 text-center' }, 'Page Loading...');

    // Create a proper fallback for missing components
    const getComponent = (componentName: string) => {
      const component = components[componentName];
      if (!component) {
        if (import.meta.env.DEV) {
          console.warn(`🔥 SSR: Component ${componentName} not available, using fallback`);
        }
        return FallbackComponent;
      }
      return component;
    };

    const AppRouter = () => React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        AuthProvider,
        null,
        React.createElement(
          ComparisonProvider,
          null,
          React.createElement(
            RecentlyViewedProvider,
            null,
            React.createElement(
              TooltipProvider,
              null,
              React.createElement(
                StaticRouter,
                { location: route.path },
                React.createElement(
                  Routes,
                  null,
                  // Main routes
                  React.createElement(Route, { path: '/', element: React.createElement(getComponent('Index')) }),
                  React.createElement(Route, { path: '/index', element: React.createElement(getComponent('FundIndex')) }),
                  
                  // Hub pages
                  React.createElement(Route, { path: '/tags', element: React.createElement(getComponent('TagsHub')) }),
                  React.createElement(Route, { path: '/tags/:tag', element: React.createElement(getComponent('TagPage')) }),
                  React.createElement(Route, { path: '/categories', element: React.createElement(getComponent('CategoriesHub')) }),
                  React.createElement(Route, { path: '/categories/:category', element: React.createElement(getComponent('CategoryPage')) }),
                  React.createElement(Route, { path: '/managers', element: React.createElement(getComponent('ManagersHub')) }),
                  React.createElement(Route, { path: '/manager/:name', element: React.createElement(getComponent('FundManager')) }),
                  
                  // Static pages
                  React.createElement(Route, { path: '/about', element: React.createElement(getComponent('About')) }),
                  React.createElement(Route, { path: '/disclaimer', element: React.createElement(getComponent('Disclaimer')) }),
                  React.createElement(Route, { path: '/privacy', element: React.createElement(getComponent('Privacy')) }),
                  React.createElement(Route, { path: '/compare', element: React.createElement(getComponent('ComparisonPage')) }),
                  React.createElement(Route, { path: '/comparisons', element: React.createElement(getComponent('ComparisonsHub')) }),
                  React.createElement(Route, { path: '/faqs', element: React.createElement(getComponent('FAQs')) }),
                  React.createElement(Route, { path: '/roi-calculator', element: React.createElement(getComponent('ROICalculator')) }),
                  React.createElement(Route, { path: '/fund-quiz', element: React.createElement(getComponent('FundQuiz')) }),
                  React.createElement(Route, { path: '/compare/:slug', element: React.createElement(getComponent('FundComparison')) }),
                  
                  // Alternatives hub
                  React.createElement(Route, { path: '/alternatives', element: React.createElement(getComponent('AlternativesHub')) }),
                  
                  // Fund alternatives routes
                  React.createElement(Route, { path: '/:id/alternatives', element: React.createElement(getComponent('FundAlternatives')) }),
                  
                  // Fund details routes (must be last due to catch-all nature)
                  React.createElement(Route, { path: '/:id', element: React.createElement(getComponent('FundDetails')) })
                )
              )
            )
          )
        )
      )
    );

    // Clear any previous helmet data
    Helmet.rewind();
    
    try {
      const html = renderToString(React.createElement(AppRouter));
      if (import.meta.env.DEV) {
        console.log(`🔥 SSR: Successfully rendered HTML for ${route.path}, length: ${html.length} chars`);
      }
      
      const helmet = Helmet.rewind();

      // Ensure we have complete SEO data
      const finalSeoData = {
        title: seoData.title || 'Portugal Golden Visa Investment Funds | Eligible Investments 2025',
        description: seoData.description || 'Compare and discover the best Golden Visa-eligible investment funds in Portugal.',
        url: seoData.url || `https://funds.movingto.com${route.path}`,
        structuredData: seoData.structuredData || {},
        helmetData: {
          title: helmet.title.toString(),
          meta: helmet.meta.toString(),
          link: helmet.link.toString(),
          script: helmet.script.toString()
        }
      };

      if (import.meta.env.DEV) {
        const finalHasStructuredData = Array.isArray(finalSeoData.structuredData) 
          ? finalSeoData.structuredData.length > 0 
          : !!finalSeoData.structuredData && Object.keys(finalSeoData.structuredData).length > 0;

        console.log(`🔥 SSR: Final SEO data for ${route.path}:`, {
          title: finalSeoData.title,
          url: finalSeoData.url,
          hasStructuredData: finalHasStructuredData,
          structuredDataInfo: Array.isArray(finalSeoData.structuredData) 
            ? `array with ${finalSeoData.structuredData.length} items` 
            : `object with ${Object.keys(finalSeoData.structuredData).length} keys`
        });
      }

      return { html, seoData: finalSeoData };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`🔥 SSR: Error rendering route ${route.path}:`, error);
      }
      return { 
        html: '<div class="p-8 text-center text-red-600">Error rendering page. Please try again later.</div>', 
        seoData: {
          title: 'Error - Portugal Golden Visa Investment Funds | Movingto',
          description: 'An error occurred while loading this page. Please try again later.',
          url: `https://funds.movingto.com${route.path}`,
          structuredData: {}
        }
      };
    }
  }
}
