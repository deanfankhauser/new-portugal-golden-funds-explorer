
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SEODataService } from '../services/seoDataService';
import { StaticRoute } from './routeDiscovery';
import { components, TooltipProvider } from './componentLoader';

export class SSRRenderer {
  static renderRoute(route: StaticRoute): { html: string; seoData: any } {
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

    console.log(`SSR: Rendering route ${route.path} with SEO data:`, {
      title: seoData.title,
      description: seoData.description
    });

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
            React.createElement(Route, { path: '/', element: React.createElement(components.Index) }),
            React.createElement(Route, { path: '/funds/:id', element: React.createElement(components.FundDetails) }),
            React.createElement(Route, { path: '/tags', element: React.createElement(components.TagsHub) }),
            React.createElement(Route, { path: '/tags/:tag', element: React.createElement(components.TagPage) }),
            React.createElement(Route, { path: '/categories', element: React.createElement(components.CategoriesHub) }),
            React.createElement(Route, { path: '/categories/:category', element: React.createElement(components.CategoryPage) }),
            React.createElement(Route, { path: '/managers', element: React.createElement(components.ManagersHub) }),
            React.createElement(Route, { path: '/manager/:name', element: React.createElement(components.FundManager) }),
            React.createElement(Route, { path: '/about', element: React.createElement(components.About) }),
            React.createElement(Route, { path: '/disclaimer', element: React.createElement(components.Disclaimer) }),
            React.createElement(Route, { path: '/privacy', element: React.createElement(components.Privacy) }),
            React.createElement(Route, { path: '/compare', element: React.createElement(components.ComparisonPage) }),
            React.createElement(Route, { path: '/comparisons', element: React.createElement(components.ComparisonsHub) }),
            React.createElement(Route, { path: '/faqs', element: React.createElement(components.FAQs) }),
            React.createElement(Route, { path: '/roi-calculator', element: React.createElement(components.ROICalculator) }),
            React.createElement(Route, { path: '/fund-quiz', element: React.createElement(components.FundQuiz) })
          )
        )
      )
    );

    // Clear any previous helmet state
    Helmet.rewind();
    
    // Render the component to extract helmet data
    const html = renderToString(React.createElement(AppRouter));
    
    // Get helmet data after rendering
    const helmet = Helmet.rewind();

    // Merge helmet data with our SEO data, prioritizing our SEO data
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

    return { html, seoData: finalSeoData };
  }
}
