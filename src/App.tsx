
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from './contexts/AuthContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { useLayoutEffect } from 'react';

// Import all pages
import Index from './pages/Index';
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
    // Set scroll restoration to manual to prevent browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top using multiple methods for maximum compatibility
    const scrollToTop = () => {
      // Method 1: Direct DOM manipulation
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 2: Window scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      // Method 3: Alternative window scroll
      window.scrollTo(0, 0);
      
      // Method 4: Scroll all scrollable elements to top
      const scrollableElements = document.querySelectorAll('*');
      scrollableElements.forEach(element => {
        if (element.scrollTop > 0) {
          element.scrollTop = 0;
        }
      });
    };
    
    // Execute immediately
    scrollToTop();
    
    // Execute with multiple timeouts to ensure it works
    const timeouts = [0, 10, 50, 100].map(delay => 
      setTimeout(scrollToTop, delay)
    );
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [location.pathname, location.search, location.hash]);
  
  return null;
};

// Debug component to log current route
const RouteDebugger = () => {
  const location = useLocation();
  
  console.log('Current route:', location.pathname);
  console.log('Current search:', location.search);
  console.log('Current hash:', location.hash);
  
  return null;
};

function App() {
  console.log('App component mounting...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ComparisonProvider>
          <RecentlyViewedProvider>
            <TooltipProvider>
              <Router>
                <ScrollToTop />
                <RouteDebugger />
                <div className="min-h-screen w-full bg-gray-50">
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
                    <Route path="/compare/:slug" element={<FundComparison />} />
                    <Route path="/comparisons" element={<ComparisonsHub />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/roi-calculator" element={<ROICalculator />} />
                    <Route path="/fund-quiz" element={<FundQuiz />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
              </Router>
            </TooltipProvider>
          </RecentlyViewedProvider>
        </ComparisonProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
