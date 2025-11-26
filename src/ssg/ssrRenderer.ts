
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
import { fetchAllFundsForBuild } from '../lib/build-data-fetcher';
import type { Fund } from '../data/types/funds';

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
    // Enable debug logging in production builds to diagnose SSG issues
    const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
    const isSSGDebug = typeof process !== 'undefined' ? process.env.SSG_DEBUG === '1' : false;
    const shouldLog = isDev || isSSGDebug;
    
    if (shouldLog) {
      console.log(`\n🔥 SSR: Starting render for route ${route.path} (type: ${route.pageType})`);
      console.log(`🔥 SSR: Environment - isDev: ${isDev}, SSG_DEBUG: ${isSSGDebug}`);
    }
    
    // Extract fund ID and find fund data for SSR injection
    let fundDataForSSR: Fund | null = null;
    let managerDataForSSR: { name: string; profile?: any; funds: Fund[]; isVerified: boolean } | null = null;
    
    // Handle fund detail pages
    if (route.path.match(/^\/[^\/]+$/)) {
      const fundId = route.path.replace('/', '');
      if (shouldLog) {
        console.log(`🔥 SSR: Detected potential fund page. Fund ID: "${fundId}"`);
        console.log(`🔥 SSR: Route params passed:`, route.params);
      }
      
      // Fetch fund data from database during build
      const allFunds = await fetchAllFundsForBuild();
      fundDataForSSR = allFunds.find(f => f.id === fundId) || null;
      
      if (shouldLog) {
        console.log(`🔥 SSR: Fund data found for SSR:`, fundDataForSSR ? `✅ ${fundDataForSSR.name}` : '❌ Not found');
      }
    }
    
    // Handle manager profile pages
    if (route.pageType === 'manager' && route.params?.managerName) {
      if (shouldLog) {
        console.log(`🔥 SSR: Detected manager page. Manager: "${route.params.managerName}"`);
      }
      
      managerDataForSSR = {
        name: route.params.managerName,
        profile: route.params.managerProfile,
        funds: route.params.funds || [],
        isVerified: !!route.params.managerProfile
      };
      
      if (shouldLog) {
        console.log(`🔥 SSR: Manager data prepared for SSR:`, managerDataForSSR ? `✅ ${managerDataForSSR.name} (${managerDataForSSR.funds.length} funds)` : '❌ Not found');
      }
    }
    
    // Create query client and prefetch data for SSG
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          retry: false,
          enabled: true, // Always enable queries during SSG
        },
      },
    });

    // Prefetch data for SSG to populate React Query cache
    console.log(`🔥 SSR: Prefetching data for SSG...`);
    const allFunds = await fetchAllFundsForBuild();
    console.log(`🔥 SSR: Prefetched ${allFunds.length} funds for SSG`);
    
    // Populate the React Query cache with SSG data
    queryClient.setQueryData(['funds-all'], allFunds);
    
    // For fund detail pages, also set the specific fund in cache
    if (fundDataForSSR) {
      queryClient.setQueryData(['fund', fundDataForSSR.id], fundDataForSSR);
      console.log(`🔥 SSR: Cached fund data for ${fundDataForSSR.id}`);
    }

    // Get SEO data for this route with detailed logging
    if (shouldLog) {
      console.log(`🔥 SSR: Requesting SEO data with params:`, {
        pageType: route.pageType,
        fundName: route.params?.fundName,
        managerName: route.params?.managerName,
        categoryName: route.params?.categoryName,
        tagName: route.params?.tagName,
        comparisonSlug: route.params?.slug,
      });
    }

    // DIAGNOSTIC: Log SSR rendering context
    if (route.pageType === 'fund' || route.pageType === 'fund-details') {
      console.log('🔧 [SSR] Rendering fund page:', {
        routePath: route.path,
        pageType: route.pageType,
        routeFundId: route.fundId,
        fundDataForSSRId: fundDataForSSR?.id,
        fundDataForSSRName: fundDataForSSR?.name,
        paramsKeys: Object.keys(route.params || {}),
        allFundsLength: allFunds?.length || 0,
        allFundsFirstFive: allFunds?.slice(0, 5).map(f => f.id) || []
      });
    }

    // Fetch comprehensive SEO data from ConsolidatedSEOService
    // This data will be injected into static HTML <head> during build
    const seoData = ConsolidatedSEOService.getSEOData(
      route.pageType as any,
      {
        fundId: route.fundId ?? fundDataForSSR?.id,
        fundName: route.params?.fundName,
        managerName: route.params?.managerName,
        categoryName: route.params?.categoryName,
        tagName: route.params?.tagName,
        comparisonSlug: route.params?.slug,
        // Team member params for team-member page type
        name: route.params?.name,
        role: route.params?.role,
        linkedinUrl: route.params?.linkedinUrl,
        slug: route.params?.slug,
        photoUrl: route.params?.photoUrl,
        bio: route.params?.bio,
        companyName: route.params?.companyName,
      },
      allFunds
    );
    
    // DIAGNOSTIC: Log SEO data result
    if (route.pageType === 'fund' || route.pageType === 'fund-details') {
      console.log('📊 [SSR] SEO data generated:', {
        routePath: route.path,
        seoDataUrl: seoData.url,
        seoDataCanonical: seoData.canonical,
        isHomepageCanonical: seoData.canonical === 'https://funds.movingto.com/',
        titleIncludesMovingto: seoData.title.includes('Movingto')
      });
    }

    // Handle 404 pages with noindex
    if (route.pageType === '404') {
      seoData.robots = 'noindex, follow';
    }

    // Validate SEO data completeness
    const hasStructuredData = Array.isArray(seoData.structuredData) 
      ? seoData.structuredData.length > 0 
      : !!seoData.structuredData && Object.keys(seoData.structuredData).length > 0;

    if (shouldLog) {
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

    // Load components specific to this route
    const needed: string[] = (() => {
      switch (route.pageType) {
        case 'homepage': return ['Index'];
        case 'fund': return ['FundDetails'];
        case 'manager': return ['FundManager'];
        
        // Hub pages - support both hyphenated and underscore variants
        case 'tags-hub':
        case 'tags_hub': return ['TagsHub'];
        
        case 'categories-hub':
        case 'categories_hub': return ['CategoriesHub'];
        
        case 'comparisons-hub':
        case 'comparisons_hub': return ['ComparisonsHub'];
        
        case 'alternatives-hub':
        case 'alternatives_hub': return ['AlternativesHub'];
        
        case 'managers-hub':
        case 'managers_hub': return ['ManagersHub'];
        
        // Individual pages
        case 'tag': return ['TagPage'];
        case 'category': return ['CategoryPage'];
        case 'comparison': return ['FundComparison'];
        case 'fund-comparison': return ['FundComparison'];
        case 'fund-alternatives':
        case 'fund_alternatives': return ['FundAlternatives'];
        
        // Static pages
        case 'faqs': return ['FAQs'];
        case 'privacy': return ['Privacy'];
        case 'disclaimer': return ['Disclaimer'];
        case 'about': return ['About'];
        case 'auth': return ['Auth'];
        case 'roi-calculator': return ['ROICalculator'];
        case 'saved-funds': return ['SavedFunds'];
        case 'verified-funds': return ['VerifiedFunds'];
        case 'verification-program': return ['VerificationProgram'];
        case 'ira-401k-eligible': return ['IRAEligibleFunds'];
        case 'compare': return ['ComparisonPage'];
        case 'team-member': return ['TeamMemberProfile'];
        
        default: return ['Index'];
      }
    })();
    const components = await loadComponents(needed);
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
          React.createElement('li', null, React.createElement('a', { href: '/' }, 'All Funds')),
          React.createElement('li', null, React.createElement('a', { href: '/comparisons' }, 'Comparisons')),
          React.createElement('li', null, React.createElement('a', { href: '/alternatives' }, 'Alternatives')),
          React.createElement('li', null, React.createElement('a', { href: '/categories' }, 'Categories')),
          React.createElement('li', null, React.createElement('a', { href: '/tags' }, 'Tags')),
          React.createElement('li', null, React.createElement('a', { href: '/managers' }, 'Fund Managers')),
          React.createElement('li', null, React.createElement('a', { href: '/roi-calculator' }, 'ROI Calculator'))
        )
      )
    );

    // Create a proper fallback for missing components
    const getComponent = (componentName: string) => {
      const component = components[componentName];
      if (!component) {
        if (shouldLog) {
          console.warn(`🔥 SSR: Component ${componentName} not available, using fallback`);
        }
        return FallbackComponent;
      }
      return component;
    };

    // During SSG, avoid importing EnhancedAuthProvider to prevent Supabase client initialization
    const isSSG = typeof window === 'undefined';
    let AuthWrapper: React.ComponentType<any> = React.Fragment as any;
    
    if (!isSSG) {
      // Only load auth provider in browser environments
      const { EnhancedAuthProvider } = await import('../contexts/EnhancedAuthContext');
      AuthWrapper = EnhancedAuthProvider;
    }

    const AppRouter = () => React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        AuthWrapper,
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
                
                // Hub pages
                React.createElement(Route, { path: '/tags', element: React.createElement(getComponent('TagsHub')) }),
                React.createElement(Route, { path: '/tags/:tag', element: React.createElement(getComponent('TagPage')) }),
                React.createElement(Route, { path: '/categories', element: React.createElement(getComponent('CategoriesHub')) }),
                React.createElement(Route, { path: '/categories/:category', element: React.createElement(getComponent('CategoryPage')) }),
                React.createElement(Route, { path: '/managers', element: React.createElement(getComponent('ManagersHub')) }),
                React.createElement(Route, { 
                  path: '/manager/:name', 
                  element: isSSG && managerDataForSSR
                    ? React.createElement(getComponent('FundManager'), { managerData: managerDataForSSR })
                    : React.createElement(getComponent('FundManager'))
                }),
                React.createElement(Route, { path: '/team/:slug', element: React.createElement(getComponent('TeamMemberProfile')) }),
                
                // Static pages
                React.createElement(Route, { path: '/about', element: React.createElement(getComponent('About')) }),
                React.createElement(Route, { path: '/disclaimer', element: React.createElement(getComponent('Disclaimer')) }),
                React.createElement(Route, { path: '/privacy', element: React.createElement(getComponent('Privacy')) }),
                React.createElement(Route, { path: '/compare', element: React.createElement(getComponent('ComparisonPage')) }),
                React.createElement(Route, { path: '/comparisons', element: React.createElement(getComponent('ComparisonsHub')) }),
                React.createElement(Route, { path: '/faqs', element: React.createElement(getComponent('FAQs')) }),
                React.createElement(Route, { path: '/roi-calculator', element: React.createElement(getComponent('ROICalculator')) }),
                
                // Auth page
                React.createElement(Route, { path: '/auth', element: React.createElement(getComponent('Auth')) }),
                React.createElement(Route, { path: '/account-settings', element: React.createElement(getComponent('AccountSettings')) }),
                React.createElement(Route, { path: '/confirm', element: React.createElement(getComponent('EmailConfirmation')) }),
                
                React.createElement(Route, { 
                  path: '/compare/:slug', 
                  element: isSSG 
                    ? React.createElement(getComponent('FundComparison'), { initialSlug: route.params?.slug, initialFunds: allFunds })
                    : React.createElement(getComponent('FundComparison'))
                }),
                
                // Alternatives hub
                React.createElement(Route, { path: '/alternatives', element: React.createElement(getComponent('AlternativesHub')) }),
                
                // Fund alternatives routes
                React.createElement(Route, { path: '/:id/alternatives', element: React.createElement(getComponent('FundAlternatives')) }),
                
                // Fund details routes (must be last due to catch-all nature)
                // Use SSR-compatible wrapper with direct fund data injection
                React.createElement(Route, { 
                  path: '/:id', 
                  element: isSSG && fundDataForSSR
                    ? React.createElement(getComponent('FundDetails'), { 
                        fund: fundDataForSSR, 
                        initialId: fundDataForSSR.id 
                      })
                    : React.createElement(getComponent('FundDetails'), fundDataForSSR ? { fund: fundDataForSSR } : null)
                })
              )
            )
          )
        )
      )
      )
    );

    // Clear any previous helmet data
    Helmet.rewind();
    
    // Ensure we have complete SEO data with all required fields for meta tag injection
    const finalSeoData = {
      title: seoData.title || 'Portugal Golden Visa Investment Funds | Eligible Investments 2025',
      description: seoData.description || 'Compare and discover the best Golden Visa-eligible investment funds in Portugal.',
      url: seoData.url || `https://funds.movingto.com${route.path}`,
      structuredData: seoData.structuredData || {},
      keywords: seoData.keywords || ['Portugal Golden Visa', 'investment funds', 'Portuguese residency', 'Golden Visa funds 2025'],
      robots: seoData.robots || 'index, follow, max-image-preview:large',
      canonical: seoData.canonical || seoData.url || `https://funds.movingto.com${route.path}`,
      helmetData: {
        title: '',
        meta: '',
        link: '',
        script: ''
      }
    };
    
    if (shouldLog) {
      console.log(`🔥 SSR: Final SEO data prepared for meta tag injection:`, {
        title: finalSeoData.title.substring(0, 60) + '...',
        description: finalSeoData.description.substring(0, 100) + '...',
        url: finalSeoData.url,
        keywords: finalSeoData.keywords.slice(0, 3).join(', '),
        robots: finalSeoData.robots,
        hasStructuredData: !!finalSeoData.structuredData && Object.keys(finalSeoData.structuredData).length > 0
      });
    }
    
    try {
      // Log before rendering comparison routes
      if (route.pageType === 'fund-comparison' || route.pageType === 'comparison') {
        console.log(`🔥 SSR: About to render FundComparison, slug: ${route.params?.slug}`);
      }
      
      // Log before rendering fund detail routes
      if (route.pageType === 'fund' && fundDataForSSR) {
        console.log(`🔥 SSR: About to render FundDetails, id: ${fundDataForSSR.id}, name: ${fundDataForSSR.name}`);
      }
      
      // Wait for any lazy components to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const html = renderToString(React.createElement(AppRouter));
      
      // Log after rendering comparison routes
      if (route.pageType === 'fund-comparison' || route.pageType === 'comparison') {
        console.log(`🔥 SSR: Finished rendering FundComparison, content length: ${html.length}`);
      }
      
      // Log after rendering fund detail routes
      if (route.pageType === 'fund' && fundDataForSSR) {
        console.log(`🔥 SSR: Finished rendering FundDetails (${fundDataForSSR.id}), content length: ${html.length}`);
      }
      
      // Ensure the HTML has substantial content - if not, it might be a lazy loading issue
      if (html.length < 500) {
        if (shouldLog) {
          console.warn(`🔥 SSR: Short HTML content for ${route.path} (${html.length} chars), possible lazy loading issue`);
        }
        // Try again after a longer wait
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryHtml = renderToString(React.createElement(AppRouter));
        if (retryHtml.length > html.length) {
          if (shouldLog) {
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
      
      // Always log content quality for debugging SSG issues
      console.log(`🔥 SSR: Successfully rendered HTML for ${route.path}, length: ${html.length} chars`);
      
      // Check for content quality indicators
      const hasH1 = html.includes('<h1');
      const hasMainContent = html.includes('main') || html.includes('article') || html.includes('section');
      const hasLinks = html.includes('<a href');
      const hasFundCards = html.includes('fund-card') || html.includes('FundCard');
      
      console.log(`🔥 SSR: Content quality for ${route.path}:`, {
        hasH1,
        hasMainContent,
        hasLinks,
        hasFundCards,
        contentLength: html.length
      });
      
      // Warn if content is suspiciously short
      if (html.length < 2000) {
        console.warn(`⚠️  SSR: HTML content for ${route.path} is very short (${html.length} chars) - may indicate rendering issue`);
      }
      
      const helmet = Helmet.rewind();
      
      // Update helmet data in finalSeoData
      finalSeoData.helmetData = {
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString(),
        script: helmet.script.toString()
      };

      if (shouldLog) {
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
      const isSSG = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
      
      console.error(`❌ SSR: CRITICAL ERROR rendering route ${route.path}`);
      console.error(`   Error message:`, error.message);
      console.error(`   Error stack:`, error.stack);
      
      // During SSG, we should fail fast rather than silently generating error pages
      if (isSSG) {
        throw new Error(`SSG rendering failed for ${route.path}: ${error.message}`);
      }
      
      // Only use fallback during client-side hydration/dev
      return { 
        html: `
          <div class="p-8 text-center">
            <div class="mb-4 font-semibold">Error rendering page. Please try again later.</div>
            <div class="text-sm text-muted-foreground mb-4">Error: ${error.message}</div>
            <nav aria-label="Continue exploring" class="mt-2">
              <ul class="flex flex-wrap justify-center gap-3 text-sm">
                <li><a href="/">Home</a></li>
                <li><a href="/">All Funds</a></li>
                <li><a href="/comparisons">Comparisons</a></li>
                <li><a href="/alternatives">Alternatives</a></li>
                <li><a href="/categories">Categories</a></li>
                <li><a href="/tags">Tags</a></li>
                <li><a href="/managers">Fund Managers</a></li>
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
