
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SEODataService } from '../services/seoDataService';
import { StaticRoute } from './routeDiscovery';

// Mock TooltipProvider for SSR
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Import all page components with better error handling
const loadComponent = (path: string, componentName: string = 'default') => {
  try {
    const module = require(path);
    return module[componentName] || module.default;
  } catch (error) {
    console.warn(`Could not load component from ${path}:`, error.message);
    return () => React.createElement('div', null, 'Loading...');
  }
};

const Index = loadComponent('../pages/Index');
const FundDetails = loadComponent('../pages/FundDetails');
const TagPage = loadComponent('../pages/TagPage');
const CategoryPage = loadComponent('../pages/CategoryPage');
const TagsHub = loadComponent('../pages/TagsHub');
const CategoriesHub = loadComponent('../pages/CategoriesHub');
const ManagersHub = loadComponent('../pages/ManagersHub');
const About = loadComponent('../pages/About');
const Disclaimer = loadComponent('../pages/Disclaimer');
const Privacy = loadComponent('../pages/Privacy');
const ComparisonPage = loadComponent('../pages/ComparisonPage');
const FundManager = loadComponent('../pages/FundManager');
const FAQs = loadComponent('../pages/FAQs');
const ComparisonsHub = loadComponent('../pages/ComparisonsHub');
const ROICalculator = loadComponent('../pages/ROICalculator');
const FundQuiz = loadComponent('../pages/FundQuiz');

export class SSRUtils {
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
            React.createElement(Route, { path: '/', element: React.createElement(Index) }),
            React.createElement(Route, { path: '/funds/:id', element: React.createElement(FundDetails) }),
            React.createElement(Route, { path: '/tags', element: React.createElement(TagsHub) }),
            React.createElement(Route, { path: '/tags/:tag', element: React.createElement(TagPage) }),
            React.createElement(Route, { path: '/categories', element: React.createElement(CategoriesHub) }),
            React.createElement(Route, { path: '/categories/:category', element: React.createElement(CategoryPage) }),
            React.createElement(Route, { path: '/managers', element: React.createElement(ManagersHub) }),
            React.createElement(Route, { path: '/manager/:name', element: React.createElement(FundManager) }),
            React.createElement(Route, { path: '/about', element: React.createElement(About) }),
            React.createElement(Route, { path: '/disclaimer', element: React.createElement(Disclaimer) }),
            React.createElement(Route, { path: '/privacy', element: React.createElement(Privacy) }),
            React.createElement(Route, { path: '/compare', element: React.createElement(ComparisonPage) }),
            React.createElement(Route, { path: '/comparisons', element: React.createElement(ComparisonsHub) }),
            React.createElement(Route, { path: '/faqs', element: React.createElement(FAQs) }),
            React.createElement(Route, { path: '/roi-calculator', element: React.createElement(ROICalculator) }),
            React.createElement(Route, { path: '/fund-quiz', element: React.createElement(FundQuiz) })
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

  static generateMetaTags(seoData: any): string {
    const metaTags = [
      `<title>${seoData.title}</title>`,
      `<meta name="description" content="${seoData.description}" />`,
      `<link rel="canonical" href="${seoData.url}" />`,
      `<meta property="og:title" content="${seoData.title}" />`,
      `<meta property="og:description" content="${seoData.description}" />`,
      `<meta property="og:url" content="${seoData.url}" />`,
      `<meta name="twitter:title" content="${seoData.title}" />`,
      `<meta name="twitter:description" content="${seoData.description}" />`,
    ];

    if (seoData.structuredData && Object.keys(seoData.structuredData).length > 0) {
      metaTags.push(
        `<script type="application/ld+json">${JSON.stringify(seoData.structuredData)}</script>`
      );
    }

    return metaTags.join('\n    ');
  }

  static generateHTMLTemplate(content: string, seoData: any): string {
    const metaTags = this.generateMetaTags(seoData);
    
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO meta tags (server-side rendered) -->
    ${metaTags}
    
    <!-- Preconnect to external domains for performance -->
    <link rel="preconnect" href="https://www.googletagmanager.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://cdn.prod.website-files.com" />
    
    <!-- Preload critical resources -->
    <link rel="preload" href="/src/index.css" as="style" />
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
    
    <!-- DNS prefetch for better performance -->
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://cdn.gpteng.co" />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3ML90T25MY"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3ML90T25MY');
    </script>
    
    <!-- Security headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    
    <!-- Default Open Graph tags -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Movingto" />
    <meta property="og:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />
    
    <!-- Default Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@movingtoio" />
    <meta name="twitter:creator" content="@movingtoio" />
    
    <!-- Favicon and app icons -->
    <link rel="icon" href="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png" type="image/png">
    <link rel="apple-touch-icon" href="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png">
    
    <!-- Theme color for mobile browsers -->
    <meta name="theme-color" content="#EF4444" />
  </head>

  <body>
    <div id="root">${content}</div>
    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }
}

// Export functions for direct access
export const renderRoute = (route: StaticRoute) => SSRUtils.renderRoute(route);
export const generateHTMLTemplate = (content: string, seoData: any) => SSRUtils.generateHTMLTemplate(content, seoData);
