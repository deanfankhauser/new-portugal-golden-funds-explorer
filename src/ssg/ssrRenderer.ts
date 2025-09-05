
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ConsolidatedSEOService } from '../services/consolidatedSEOService';
import { StaticRoute } from './routeDiscovery';
import { loadComponents, TooltipProvider } from './componentLoader';
import { ComparisonProvider } from '../contexts/ComparisonContext';
import { RecentlyViewedProvider } from '../contexts/RecentlyViewedContext';

// Ensure React is available globally for SSR
if (typeof global !== 'undefined' && !global.React) {
  global.React = React;
}
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

// Mock localStorage for SSG environment
if (typeof global !== 'undefined' && !global.localStorage) {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
}

// Also mock it for window if in browser-like environment during SSG
if (typeof window !== 'undefined' && !window.localStorage) {
  window.localStorage = global.localStorage;
}

export class SSRRenderer {
  static async renderRoute(route: StaticRoute): Promise<{ html: string; seoData: any }> {
    // Check if we're in development mode safely for SSG environments
    const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
    
    // Mock Enhanced Auth Provider for SSG
    const MockEnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const mockValue = {
        user: null,
        session: null,
        loading: false,
        userType: null,
        profile: null,
        signUp: async () => ({ error: null }),
        signIn: async () => ({ error: null }),
        signOut: async () => ({ error: null }),
        updateProfile: async () => ({ error: null }),
        uploadAvatar: async () => ({ error: null }),
        refreshProfile: async () => {},
      };

      return React.createElement(
        React.createContext(mockValue).Provider,
        { value: mockValue },
        children
      );
    };
    
    if (isDev) {
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
    if (isDev) {
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

    // Handle 404 pages with noindex
    if (route.pageType === '404') {
      seoData.robots = 'noindex, follow';
    }

    // Validate SEO data completeness
    const hasStructuredData = Array.isArray(seoData.structuredData) 
      ? seoData.structuredData.length > 0 
      : !!seoData.structuredData && Object.keys(seoData.structuredData).length > 0;

    if (isDev) {
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
    const FallbackComponent = () => React.createElement(
      'div',
      { className: 'p-8 text-center' },
      React.createElement('div', { className: 'mb-6 font-semibold' }, 'Page Loading...'),
      React.createElement(
        'nav',
        { 'aria-label': 'Continue exploring', className: 'mt-2' },
        React.createElement(
          'ul',
          { className: 'flex flex-wrap justify-center gap-3 text-sm' },
          React.createElement('li', null, React.createElement('a', { href: '/' }, 'Home')),
          React.createElement('li', null, React.createElement('a', { href: '/index' }, 'All Funds')),
          React.createElement('li', null, React.createElement('a', { href: '/comparisons' }, 'Comparisons')),
          React.createElement('li', null, React.createElement('a', { href: '/alternatives' }, 'Alternatives')),
          React.createElement('li', null, React.createElement('a', { href: '/categories' }, 'Categories')),
          React.createElement('li', null, React.createElement('a', { href: '/tags' }, 'Tags')),
          React.createElement('li', null, React.createElement('a', { href: '/managers' }, 'Fund Managers')),
          React.createElement('li', null, React.createElement('a', { href: '/fund-quiz' }, 'Fund Quiz')),
          React.createElement('li', null, React.createElement('a', { href: '/roi-calculator' }, 'ROI Calculator'))
        )
      )
    );

    // Create a proper fallback for missing components
    const getComponent = (componentName: string) => {
      const component = components[componentName];
      if (!component) {
        if (isDev) {
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
        MockEnhancedAuthProvider,
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
                
                // Auth pages
                React.createElement(Route, { path: '/manager-auth', element: React.createElement(getComponent('ManagerAuth')) }),
                React.createElement(Route, { path: '/investor-auth', element: React.createElement(getComponent('InvestorAuth')) }),
                
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
    
    // Ensure we have complete SEO data
    const finalSeoData = {
      title: seoData.title || 'Portugal Golden Visa Investment Funds | Eligible Investments 2025',
      description: seoData.description || 'Compare and discover the best Golden Visa-eligible investment funds in Portugal.',
      url: seoData.url || `https://funds.movingto.com${route.path}`,
      structuredData: seoData.structuredData || {},
      robots: seoData.robots,
      helmetData: {
        title: '',
        meta: '',
        link: '',
        script: ''
      }
    };
    
    try {
      // Wait for any lazy components to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const html = renderToString(React.createElement(AppRouter));
      
      // Ensure the HTML has substantial content - if not, it might be a lazy loading issue
      if (html.length < 500) {
        if (isDev) {
          console.warn(`🔥 SSR: Short HTML content for ${route.path} (${html.length} chars), possible lazy loading issue`);
        }
        // Try again after a longer wait
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryHtml = renderToString(React.createElement(AppRouter));
        if (retryHtml.length > html.length) {
          if (isDev) {
            console.log(`🔥 SSR: Retry successful for ${route.path}, improved from ${html.length} to ${retryHtml.length} chars`);
          }
          const helmet = Helmet.rewind();
          finalSeoData.helmetData = {
            title: helmet.title.toString(),
            meta: helmet.meta.toString(),
            link: helmet.link.toString(),
            script: helmet.script.toString()
          };
          return { html: retryHtml, seoData: finalSeoData };
        }
      }
      
      if (isDev) {
        console.log(`🔥 SSR: Successfully rendered HTML for ${route.path}, length: ${html.length} chars`);
        
        // Check for content quality indicators
        const hasH1 = html.includes('<h1');
        const hasMainContent = html.includes('main') || html.includes('article') || html.includes('section');
        const hasLinks = html.includes('<a href');
        
        console.log(`🔥 SSR: Content quality for ${route.path}:`, {
          hasH1,
          hasMainContent,
          hasLinks,
          contentLength: html.length
        });
      }
      
      const helmet = Helmet.rewind();
      
      // Update helmet data in finalSeoData
      finalSeoData.helmetData = {
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString(),
        script: helmet.script.toString()
      };

      if (isDev) {
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
      if (isDev) {
        console.error(`🔥 SSR: Error rendering route ${route.path}:`, error);
      }
      return { 
        html: `
          <div class="p-8 text-center">
            <div class="mb-4 font-semibold">Error rendering page. Please try again later.</div>
            <nav aria-label="Continue exploring" class="mt-2">
              <ul class="flex flex-wrap justify-center gap-3 text-sm">
                <li><a href="/">Home</a></li>
                <li><a href="/index">All Funds</a></li>
                <li><a href="/comparisons">Comparisons</a></li>
                <li><a href="/alternatives">Alternatives</a></li>
                <li><a href="/categories">Categories</a></li>
                <li><a href="/tags">Tags</a></li>
                <li><a href="/managers">Fund Managers</a></li>
                <li><a href="/fund-quiz">Fund Quiz</a></li>
                <li><a href="/roi-calculator">ROI Calculator</a></li>
              </ul>
            </nav>
          </div>
        `, 
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
