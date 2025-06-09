
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from 'react-router-dom';
import { SEODataService } from '../services/seoDataService';
import { SEOService } from '../services/seoService';
import { StaticRoute } from './routeDiscovery';

// Import all page components
import Index from '../pages/Index';
import FundDetails from '../pages/FundDetails';
import TagPage from '../pages/TagPage';
import CategoryPage from '../pages/CategoryPage';
import TagsHub from '../pages/TagsHub';
import CategoriesHub from '../pages/CategoriesHub';
import ManagersHub from '../pages/ManagersHub';
import About from '../pages/About';
import Disclaimer from '../pages/Disclaimer';
import Privacy from '../pages/Privacy';
import ComparisonPage from '../pages/ComparisonPage';
import FundManager from '../pages/FundManager';
import FAQs from '../pages/FAQs';
import ComparisonsHub from '../pages/ComparisonsHub';
import ROICalculator from '../pages/ROICalculator';
import FundQuiz from '../pages/FundQuiz';

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

    const AppRouter = () => (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StaticRouter location={route.path}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/funds/:id" element={<FundDetails />} />
              <Route path="/tags" element={<TagsHub />} />
              <Route path="/tags/:tag" element={<TagPage />} />
              <Route path="/categories" element={<CategoriesHub />} />
              <Route path="/categories/:category" element={<CategoryPage />} />
              <Route path="/managers" element={<ManagersHub />} />
              <Route path="/manager/:name" element={<FundManager />} />
              <Route path="/about" element={<About />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/comparisons" element={<ComparisonsHub />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/roi-calculator" element={<ROICalculator />} />
              <Route path="/fund-quiz" element={<FundQuiz />} />
            </Routes>
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );

    const html = renderToString(<AppRouter />);

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
