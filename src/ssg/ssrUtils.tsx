
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { SEODataService } from '../services/seoDataService';
import { StaticRoute } from './routeDiscovery';

// Mock TooltipProvider for SSR
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Import all page components with error handling
let Index: React.ComponentType<any>;
let FundDetails: React.ComponentType<any>;
let TagPage: React.ComponentType<any>;
let CategoryPage: React.ComponentType<any>;
let TagsHub: React.ComponentType<any>;
let CategoriesHub: React.ComponentType<any>;
let ManagersHub: React.ComponentType<any>;
let About: React.ComponentType<any>;
let Disclaimer: React.ComponentType<any>;
let Privacy: React.ComponentType<any>;
let ComparisonPage: React.ComponentType<any>;
let FundManager: React.ComponentType<any>;
let FAQs: React.ComponentType<any>;
let ComparisonsHub: React.ComponentType<any>;
let ROICalculator: React.ComponentType<any>;
let FundQuiz: React.ComponentType<any>;

try {
  Index = require('../pages/Index').default;
  FundDetails = require('../pages/FundDetails').default;
  TagPage = require('../pages/TagPage').default;
  CategoryPage = require('../pages/CategoryPage').default;
  TagsHub = require('../pages/TagsHub').default;
  CategoriesHub = require('../pages/CategoriesHub').default;
  ManagersHub = require('../pages/ManagersHub').default;
  About = require('../pages/About').default;
  Disclaimer = require('../pages/Disclaimer').default;
  Privacy = require('../pages/Privacy').default;
  ComparisonPage = require('../pages/ComparisonPage').default;
  FundManager = require('../pages/FundManager').default;
  FAQs = require('../pages/FAQs').default;
  ComparisonsHub = require('../pages/ComparisonsHub').default;
  ROICalculator = require('../pages/ROICalculator').default;
  FundQuiz = require('../pages/FundQuiz').default;
} catch (error) {
  console.warn('Some page components could not be loaded for SSR:', error.message);
  
  // Fallback components
  const FallbackComponent = () => React.createElement('div', null, 'Page loading...');
  Index = Index || FallbackComponent;
  FundDetails = FundDetails || FallbackComponent;
  TagPage = TagPage || FallbackComponent;
  CategoryPage = CategoryPage || FallbackComponent;
  TagsHub = TagsHub || FallbackComponent;
  CategoriesHub = CategoriesHub || FallbackComponent;
  ManagersHub = ManagersHub || FallbackComponent;
  About = About || FallbackComponent;
  Disclaimer = Disclaimer || FallbackComponent;
  Privacy = Privacy || FallbackComponent;
  ComparisonPage = ComparisonPage || FallbackComponent;
  FundManager = FundManager || FallbackComponent;
  FAQs = FAQs || FallbackComponent;
  ComparisonsHub = ComparisonsHub || FallbackComponent;
  ROICalculator = ROICalculator || FallbackComponent;
  FundQuiz = FundQuiz || FallbackComponent;
}

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

    const html = renderToString(React.createElement(AppRouter));

    return { html, seoData };
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
    
    <!-- SEO meta tags -->
    ${metaTags}
    
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
