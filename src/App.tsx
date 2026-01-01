import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";
import { ComparisonProvider } from './contexts/ComparisonContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { ShortlistProvider } from './contexts/ShortlistContext';
import { EnhancedAuthProvider } from './contexts/EnhancedAuthContext';
import { QueryProvider } from './providers/QueryProvider';

// Lazy load all pages for optimal performance

// Lazy load all pages for optimal performance
import Index from './pages/Index'; // Keep homepage non-lazy for instant load
import { 
  PageLoader, 
  FundDetailsLoader, 
  ComparisonLoader,
  ROICalculatorLoader 
} from './components/common/LoadingSkeleton';

// Lazy load all secondary pages
const FundDetails = lazy(() => import('./pages/FundDetails'));
const TagPage = lazy(() => import('./pages/TagPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const TagsHub = lazy(() => import('./pages/TagsHub'));
const CategoriesHub = lazy(() => import('./pages/CategoriesHub'));
const ManagersHub = lazy(() => import('./pages/ManagersHub'));
const FundManager = lazy(() => import('./pages/FundManager'));
const TeamMemberProfile = lazy(() => import('./pages/TeamMemberProfile'));
const About = lazy(() => import('./pages/About'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const ComparisonsHub = lazy(() => import('./pages/ComparisonsHub'));
const FAQs = lazy(() => import('./pages/FAQs'));
const ROICalculator = lazy(() => import('./pages/ROICalculator'));

const FundComparison = lazy(() => import('./pages/FundComparison'));
const FundAlternatives = lazy(() => import('./pages/FundAlternatives'));
const AlternativesHub = lazy(() => import('./pages/AlternativesHub'));
const VerifiedFunds = lazy(() => import('./pages/VerifiedFunds'));
const VerificationProgram = lazy(() => import('./pages/VerificationProgram'));
const IRAEligibleFunds = lazy(() => import('./pages/IRAEligibleFunds'));
const Auth = lazy(() => import('./pages/Auth'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const EmailConfirmation = lazy(() => import('./pages/EmailConfirmation'));
const ConfirmEmailCapture = lazy(() => import('./pages/ConfirmEmailCapture'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const SavedFunds = lazy(() => import('./pages/SavedFunds'));

const FundManagerPanel = lazy(() => import('./pages/FundManagerPanel'));
const SubmitFund = lazy(() => import('./pages/SubmitFund'));
const FundMatcher = lazy(() => import('./pages/FundMatcher'));
const FundMatcherResults = lazy(() => import('./pages/FundMatcherResults'));

const NotFound = lazy(() => import('./pages/NotFound'));

// Import hook to fetch funds from database
import { useRealTimeFunds } from './hooks/useRealTimeFunds';

import './App.css';
import SEODebugger from './components/common/SEODebugger';

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

// Component to handle invitation redirects
const InviteRedirect = () => {
  const { token } = useParams<{ token: string }>();
  console.log('🎫 Redirecting invite token:', token);
  return <Navigate to={`/auth?invite=${token}`} replace />;
};

// Component to handle legacy invitation URLs with query params
const LegacyInviteRedirect = () => {
  const [searchParams] = useSearchParams();
  const invite = searchParams.get('invite') || searchParams.get('token');
  console.log('🎫 LegacyRedirect saw invite/token:', invite);
  return <Navigate to={invite ? `/auth?invite=${invite}` : '/auth'} replace />;
};


// Component to handle direct fund routes (e.g., /horizon-fund)
const DirectFundRoute = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { funds, loading, error } = useRealTimeFunds();
  
  // Extract potential fund ID from pathname (remove leading slash)
  const potentialFundId = pathname.slice(1);
  
  // Show loading only during initial load when no data exists
  if (loading && (!funds || funds.length === 0)) {
    return <FundDetailsLoader />;
  }
  
  // If there was an error fetching funds and no data, show loader
  if (error && (!funds || funds.length === 0)) {
    return <FundDetailsLoader />;
  }
  
  // Check if this path matches a fund ID
  const fund = funds.find(f => f.id === potentialFundId);
  
  if (fund) {
    // Valid fund found, render fund details with lazy loading
    return (
      <Suspense fallback={<FundDetailsLoader />}>
        <FundDetails />
      </Suspense>
    );
  }
  
  // Only show 404 when we successfully loaded funds AND confirmed no match
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
import ExitIntentModal from './components/ExitIntentModal';

function App() {
  // SEO optimization handled by consolidated service

  // App initialization
  
  
  return (
    <QueryProvider>
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
                      <Route path="/index" element={<Navigate to="/" replace />} />
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
                      <Route path="/team/:slug" element={
                        <Suspense fallback={<PageLoader />}>
                          <TeamMemberProfile />
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
                      <Route path="/terms" element={
                        <Suspense fallback={<PageLoader />}>
                          <Terms />
                        </Suspense>
                      } />
                      <Route path="/cookie-policy" element={
                        <Suspense fallback={<PageLoader />}>
                          <CookiePolicy />
                        </Suspense>
                      } />
                      <Route path="/contact" element={
                        <Suspense fallback={<PageLoader />}>
                          <Contact />
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
                      <Route path="/ira-401k-eligible-funds" element={
                        <Suspense fallback={<PageLoader />}>
                          <IRAEligibleFunds />
                        </Suspense>
                      } />
                      <Route path="/fund-matcher" element={
                        <Suspense fallback={<PageLoader />}>
                          <FundMatcher />
                        </Suspense>
                      } />
                      <Route path="/fund-matcher/results" element={
                        <Suspense fallback={<PageLoader />}>
                          <FundMatcherResults />
                        </Suspense>
                      } />
                        
                        {/* Unified Authentication */}
                        <Route path="/auth" element={
                          <Suspense fallback={<PageLoader />}>
                            <Auth />
                          </Suspense>
                        } />
                        
                        {/* Invitation redirect routes - handle all possible URL patterns */}
                        <Route path="/invite/:token" element={<InviteRedirect />} />
                        <Route path="/invite/:token/*" element={<InviteRedirect />} />
                        <Route path="/invite" element={<LegacyInviteRedirect />} />
                        <Route path="/auth/accept" element={<LegacyInviteRedirect />} />
                        <Route path="/accept-invitation" element={<LegacyInviteRedirect />} />
                        <Route path="/team-invite" element={<LegacyInviteRedirect />} />
                        <Route path="/api/accept-team-invitation" element={<LegacyInviteRedirect />} />
                        
                        {/* Legacy auth routes - redirect to unified auth */}
                        <Route path="/manager-auth" element={
                          <Suspense fallback={<PageLoader />}>
                            <Auth />
                          </Suspense>
                        } />
                        <Route path="/investor-auth" element={
                          <Suspense fallback={<PageLoader />}>
                            <Auth />
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
                        
                        {/* Email Capture Confirmation */}
                        <Route path="/confirm-email" element={
                          <Suspense fallback={<PageLoader />}>
                            <ConfirmEmailCapture />
                          </Suspense>
                        } />
                        
                       {/* Admin Panel with nested routes */}
                       <Route path="/admin/*" element={
                         <Suspense fallback={<PageLoader />}>
                           <AdminPanel />
                         </Suspense>
                       } />


                       {/* Saved Funds */}
                       <Route path="/saved-funds" element={
                         <Suspense fallback={<PageLoader />}>
                           <SavedFunds />
                         </Suspense>
                       } />

                       {/* Fund Manager Dashboard */}
                       <Route path="/dashboard/*" element={
                         <Suspense fallback={<PageLoader />}>
                           <FundManagerPanel />
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

                      {/* Submit Fund */}
                      <Route path="/submit-fund" element={
                        <Suspense fallback={<PageLoader />}>
                          <SubmitFund />
                        </Suspense>
                      } />

                      {/* Verified Funds */}
                      <Route path="/verified-funds" element={
                        <Suspense fallback={<PageLoader />}>
                          <VerifiedFunds />
                        </Suspense>
                      } />

                      {/* Verification Program */}
                      <Route path="/verification-program" element={
                        <Suspense fallback={<PageLoader />}>
                          <VerificationProgram />
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
                  <SEOEnhancer enableMonitoring={typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false} />
                  <ExitIntentModal />
                  
                </SEOProvider>
              </Router>
            </TooltipProvider>
            </EnhancedAuthProvider>
          </RecentlyViewedProvider>
        </ShortlistProvider>
      </ComparisonProvider>
    </QueryProvider>
  );
}

export default App;
