import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";
import { ComparisonProvider } from './contexts/ComparisonContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { ShortlistProvider } from './contexts/ShortlistContext';
import { EnhancedAuthProvider } from './contexts/EnhancedAuthContext';

// Lazy load all pages for optimal performance

// Lazy load all pages for optimal performance
import Index from './pages/Index'; // Keep homepage non-lazy for instant load
import { 
  PageLoader, 
  FundDetailsLoader, 
  FundIndexLoader, 
  ComparisonLoader,
  ROICalculatorLoader 
} from './components/common/LoadingSkeleton';

// Lazy load all secondary pages
const FundIndex = lazy(() => import('./pages/FundIndex'));
const FundDetails = lazy(() => import('./pages/FundDetails'));
const TagPage = lazy(() => import('./pages/TagPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const TagsHub = lazy(() => import('./pages/TagsHub'));
const CategoriesHub = lazy(() => import('./pages/CategoriesHub'));
const ManagersHub = lazy(() => import('./pages/ManagersHub'));
const FundManager = lazy(() => import('./pages/FundManager'));
const About = lazy(() => import('./pages/About'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const ComparisonsHub = lazy(() => import('./pages/ComparisonsHub'));
const FAQs = lazy(() => import('./pages/FAQs'));
const ROICalculator = lazy(() => import('./pages/ROICalculator'));

const FundComparison = lazy(() => import('./pages/FundComparison'));
const FundAlternatives = lazy(() => import('./pages/FundAlternatives'));
const AlternativesHub = lazy(() => import('./pages/AlternativesHub'));
import ManagerAuth from './pages/ManagerAuth'; // Make non-lazy for debugging
const InvestorAuth = lazy(() => import('./pages/InvestorAuth'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const EmailConfirmation = lazy(() => import('./pages/EmailConfirmation'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const SavedFunds = lazy(() => import('./pages/SavedFunds'));
const TempMigrationPage = lazy(() => import('./pages/TempMigrationPage'));

const NotFound = lazy(() => import('./pages/NotFound'));

// Import funds data to validate direct fund routes
import { fundsData } from './data/mock/funds/index';

import './App.css';
import SEODebugger from './components/common/SEODebugger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const location = useLocation();

  React.useLayoutEffect(() => {
    // Single, reliable scroll strategy with proper timing
    const scrollToTop = () => {
      // Strategy 1: Window scroll with instant behavior
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      // Strategy 2: Direct DOM element manipulation as fallback
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Execute immediately and then after a brief delay for async content
    scrollToTop();
    
    // Use requestAnimationFrame for smooth timing with async loading
    requestAnimationFrame(() => {
      scrollToTop();
      
      // Final scroll after component mounting is complete
      setTimeout(scrollToTop, 100);
    });
  }, [location.pathname]);

  return null;
};


// Component to handle direct fund routes (e.g., /horizon-fund)
const DirectFundRoute = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Extract potential fund ID from pathname (remove leading slash)
  const potentialFundId = pathname.slice(1);
  
  // Check if this path matches a fund ID
  const fund = fundsData.find(f => f.id === potentialFundId);
  
  if (fund) {
    // Valid fund found, render fund details with lazy loading
    return (
      <Suspense fallback={<FundDetailsLoader />}>
        <FundDetails />
      </Suspense>
    );
  }
  
  // No fund found, show 404 with lazy loading
  return (
    <Suspense fallback={<PageLoader />}>
      <NotFound />
    </Suspense>
  );
};

// Import SEO and performance optimization hook
// SEO optimization removed - using consolidated service
import SEOProvider from './components/providers/SEOProvider';

import SEOEnhancer from './components/common/SEOEnhancer';

function App() {
  // SEO optimization handled by consolidated service

  // App initialization
  
  
  return (
    <QueryClientProvider client={queryClient}>
      <ComparisonProvider>
        <ShortlistProvider>
          <RecentlyViewedProvider>
            <EnhancedAuthProvider>
              <TooltipProvider>
              <Router>
                <SEOProvider>
                  <ScrollToTop />
                  <div className="min-h-screen w-full bg-background">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/index" element={
                        <Suspense fallback={<FundIndexLoader />}>
                          <FundIndex />
                        </Suspense>
                      } />
                      <Route path="/tags" element={
                        <Suspense fallback={<PageLoader />}>
                          <TagsHub />
                        </Suspense>
                      } />
                      <Route path="/tags/:tag" element={
                        <Suspense fallback={<PageLoader />}>
                          <TagPage />
                        </Suspense>
                      } />
                      <Route path="/categories" element={
                        <Suspense fallback={<PageLoader />}>
                          <CategoriesHub />
                        </Suspense>
                      } />
                      <Route path="/categories/:category" element={
                        <Suspense fallback={<PageLoader />}>
                          <CategoryPage />
                        </Suspense>
                      } />
                      <Route path="/managers" element={
                        <Suspense fallback={<PageLoader />}>
                          <ManagersHub />
                        </Suspense>
                      } />
                      <Route path="/manager/:name" element={
                        <Suspense fallback={<PageLoader />}>
                          <FundManager />
                        </Suspense>
                      } />
                      <Route path="/about" element={
                        <Suspense fallback={<PageLoader />}>
                          <About />
                        </Suspense>
                      } />
                      <Route path="/disclaimer" element={
                        <Suspense fallback={<PageLoader />}>
                          <Disclaimer />
                        </Suspense>
                      } />
                      <Route path="/privacy" element={
                        <Suspense fallback={<PageLoader />}>
                          <Privacy />
                        </Suspense>
                      } />
                      <Route path="/compare" element={
                        <Suspense fallback={<ComparisonLoader />}>
                          <ComparisonPage />
                        </Suspense>
                      } />
                      <Route path="/compare/:slug" element={
                        <Suspense fallback={<ComparisonLoader />}>
                          <FundComparison />
                        </Suspense>
                      } />
                      <Route path="/comparisons" element={
                        <Suspense fallback={<PageLoader />}>
                          <ComparisonsHub />
                        </Suspense>
                      } />
                      <Route path="/faqs" element={
                        <Suspense fallback={<PageLoader />}>
                          <FAQs />
                        </Suspense>
                      } />
                      <Route path="/roi-calculator" element={
                        <Suspense fallback={<ROICalculatorLoader />}>
                          <ROICalculator />
                        </Suspense>
                      } />
                        
                        {/* Manager Authentication */}
                        <Route path="/manager-auth" element={<ManagerAuth />} />
                        
                        {/* Investor Authentication */}
                        <Route path="/investor-auth" element={
                          <Suspense fallback={<PageLoader />}>
                            <InvestorAuth />
                          </Suspense>
                        } />
                       
                        {/* Account Settings */}
                        <Route path="/account-settings" element={
                          <Suspense fallback={<PageLoader />}>
                            <AccountSettings />
                          </Suspense>
                        } />
                        
                        {/* Email Confirmation */}
                        <Route path="/confirm" element={
                          <Suspense fallback={<PageLoader />}>
                            <EmailConfirmation />
                          </Suspense>
                        } />
                        
                         {/* Password Reset */}
                         <Route path="/reset-password" element={
                           <Suspense fallback={<PageLoader />}>
                             <ResetPassword />
                           </Suspense>
                         } />
                         
                       {/* Admin Panel */}
                       <Route path="/admin" element={
                         <Suspense fallback={<PageLoader />}>
                           <AdminPanel />
                         </Suspense>
                       } />

                       {/* Temporary Migration Page */}
                       <Route path="/migrate-funds" element={
                         <Suspense fallback={<PageLoader />}>
                           <TempMigrationPage />
                         </Suspense>
                       } />

                       {/* Saved Funds */}
                       <Route path="/saved-funds" element={
                         <Suspense fallback={<PageLoader />}>
                           <SavedFunds />
                         </Suspense>
                       } />

                      {/* Alternatives hub */}
                      <Route path="/alternatives" element={
                        <Suspense fallback={<PageLoader />}>
                          <AlternativesHub />
                        </Suspense>
                      } />
                      
                      <Route path="/:id/alternatives" element={
                        <Suspense fallback={<PageLoader />}>
                          <FundAlternatives />
                        </Suspense>
                      } />
                      
                      {/* Direct fund routes - MUST be last before 404 */}
                      <Route path="/:id" element={<DirectFundRoute />} />
                      <Route path="*" element={
                        <Suspense fallback={<PageLoader />}>
                          <NotFound />
                        </Suspense>
                      } />
                    </Routes>
                  </div>
                  <Toaster />
                  <SEODebugger />
                  <SEOEnhancer enableMonitoring={import.meta.env.DEV} />
                  
                </SEOProvider>
              </Router>
            </TooltipProvider>
            </EnhancedAuthProvider>
          </RecentlyViewedProvider>
        </ShortlistProvider>
      </ComparisonProvider>
    </QueryClientProvider>
  );
}

export default App;
