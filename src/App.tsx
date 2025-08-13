import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from './contexts/AuthContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { useLayoutEffect, useEffect } from 'react';

// Import all pages
import Index from './pages/Index';
import FundIndex from './pages/FundIndex';
import FundDetails from './pages/FundDetails';
import TagPage from './pages/TagPage';
import CategoryPage from './pages/CategoryPage';
import TagsHub from './pages/TagsHub';
import CategoriesHub from './pages/CategoriesHub';
import ManagersHub from './pages/ManagersHub';
import FundManager from './pages/FundManager';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import Privacy from './pages/Privacy';
import ComparisonPage from './pages/ComparisonPage';
import ComparisonsHub from './pages/ComparisonsHub';
import FAQs from './pages/FAQs';
import ROICalculator from './pages/ROICalculator';
import FundQuiz from './pages/FundQuiz';
import FundComparison from './pages/FundComparison';
import NotFound from './pages/NotFound';

// Import funds data to validate direct fund routes
import { fundsData } from './data/mock/funds';

import './App.css';

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

  useLayoutEffect(() => {
    // Simple, reliable scroll to top
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};


// Component to handle direct fund routes (e.g., /horizon-fund)
const DirectFundRoute = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Extract potential fund ID from pathname (remove leading slash)
  const potentialFundId = pathname.slice(1);
  
  // Check if this is a valid fund ID
  
  // Check if this path matches a fund ID
  const fund = fundsData.find(f => f.id === potentialFundId);
  
  if (fund) {
    // Valid fund found, redirect to fund details
    return <FundDetails />;
  }
  
  // No fund found, show 404
  return <NotFound />;
};

// Import SEO and performance optimization hook
// SEO optimization removed - using consolidated service
import SEOProvider from './components/providers/SEOProvider';
import ExitIntentPopup from './components/common/ExitIntentPopup';

function App() {
  // SEO optimization handled by consolidated service

  // App initialization
  
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ComparisonProvider>
          <RecentlyViewedProvider>
            <TooltipProvider>
              <Router>
                <SEOProvider>
                  <ScrollToTop />
                  <div className="min-h-screen w-full bg-gray-50">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/index" element={<FundIndex />} />
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
                      <Route path="/compare/:slug" element={<FundComparison />} />
                      <Route path="/comparisons" element={<ComparisonsHub />} />
                      <Route path="/faqs" element={<FAQs />} />
                      <Route path="/roi-calculator" element={<ROICalculator />} />
                      <Route path="/fund-quiz" element={<FundQuiz />} />
                      <Route path="/:id" element={<DirectFundRoute />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Toaster />
                  <ExitIntentPopup />
                </SEOProvider>
              </Router>
            </TooltipProvider>
          </RecentlyViewedProvider>
        </ComparisonProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
