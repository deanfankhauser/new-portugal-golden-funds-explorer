
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SEODataService } from '../services/seoDataService';
import { StaticRoute } from './routeDiscovery';
import { loadComponents, TooltipProvider } from './componentLoader';

export class SSRRenderer {
  static async renderRoute(route: StaticRoute): Promise<{ html: string; seoData: any }> {
    console.log(`SSR: Starting render for route ${route.path}`);
    
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          retry: false,
        },
      },
    });

    // Get SEO data for this route
    const seoData = SEODataService.getSEOData({
      pageType: route.pageType as any,
      fundName: route.params?.fundName,
      managerName: route.params?.managerName,
      categoryName: route.params?.categoryName,
      tagName: route.params?.tagName,
    });

    console.log(`SSR: Generated SEO data for ${route.path}:`, {
      title: seoData.title,
      description: seoData.description,
      pageType: route.pageType
    });

    // Load all components
    const components = await loadComponents();

    const AppRouter = () => React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(
          StaticRouter,
          { location: route.path },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: '/', element: React.createElement(components.Index || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/funds/:id', element: React.createElement(components.FundDetails || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/tags', element: React.createElement(components.TagsHub || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/tags/:tag', element: React.createElement(components.TagPage || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/categories', element: React.createElement(components.CategoriesHub || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/categories/:category', element: React.createElement(components.CategoryPage || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/managers', element: React.createElement(components.ManagersHub || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/manager/:name', element: React.createElement(components.FundManager || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/about', element: React.createElement(components.About || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/disclaimer', element: React.createElement(components.Disclaimer || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/privacy', element: React.createElement(components.Privacy || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/compare', element: React.createElement(components.ComparisonPage || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/comparisons', element: React.createElement(components.ComparisonsHub || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/faqs', element: React.createElement(components.FAQs || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/roi-calculator', element: React.createElement(components.ROICalculator || (() => React.createElement('div', null, 'Loading...'))) }),
            React.createElement(Route, { path: '/fund-quiz', element: React.createElement(components.FundQuiz || (() => React.createElement('div', null, 'Loading...'))) })
          )
        )
      )
    );

    // Clear any previous helmet state
    Helmet.rewind();
    
    try {
      // Render the component to extract helmet data
      const html = renderToString(React.createElement(AppRouter));
      console.log(`SSR: Successfully rendered HTML for ${route.path}, length: ${html.length}`);
      
      // Get helmet data after rendering
      const helmet = Helmet.rewind();

      // Use our SEO data as the primary source of truth
      const finalSeoData = {
        ...seoData,
        title: seoData.title, // Always use our SEO service title
        description: seoData.description, // Always use our SEO service description
        helmetData: {
          title: helmet.title.toString(),
          meta: helmet.meta.toString(),
          link: helmet.link.toString(),
          script: helmet.script.toString()
        }
      };

      console.log(`SSR: Final SEO data for ${route.path}:`, {
        title: finalSeoData.title,
        description: finalSeoData.description,
        url: finalSeoData.url
      });

      return { html, seoData: finalSeoData };
    } catch (error) {
      console.error(`SSR: Error rendering route ${route.path}:`, error);
      return { 
        html: '<div>Error rendering page</div>', 
        seoData: {
          title: 'Error - Portugal Golden Visa Investment Funds | Movingto',
          description: 'An error occurred while loading this page.',
          url: `https://movingto.com/funds${route.path}`,
          structuredData: {}
        }
      };
    }
  }
}
