
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import { analytics } from "./utils/analytics";
import { PerformanceService } from "./services/performanceService";
import { AccessibilityService } from "./services/accessibilityService";
import Sitemap from "./components/Sitemap";

// Lazy load all page components for better performance
const Index = lazy(() => import("./pages/Index"));
const FundDetails = lazy(() => import("./pages/FundDetails"));
const TagPage = lazy(() => import("./pages/TagPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const TagsHub = lazy(() => import("./pages/TagsHub"));
const CategoriesHub = lazy(() => import("./pages/CategoriesHub"));
const ManagersHub = lazy(() => import("./pages/ManagersHub"));
const About = lazy(() => import("./pages/About"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const FundManager = lazy(() => import("./pages/FundManager"));
const FAQs = lazy(() => import("./pages/FAQs"));
const FundComparison = lazy(() => import("./pages/FundComparison"));
const ComparisonsHub = lazy(() => import("./pages/ComparisonsHub"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const FundQuiz = lazy(() => import("./pages/FundQuiz"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50" role="status" aria-label="Loading page">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF4444]"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Component to handle route tracking
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

// Component to initialize global services
const AppInitializer = () => {
  useEffect(() => {
    // Initialize performance optimizations
    PerformanceService.initializePerformanceOptimizations();
    PerformanceService.addResourceHints();
    
    // Initialize accessibility enhancements
    AccessibilityService.initializeAccessibility();
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RecentlyViewedProvider>
          <ComparisonProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppInitializer />
              <RouteTracker />
              <main role="main" aria-label="Main content">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/sitemap.xml" element={<Sitemap />} />
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
                    <Route path="/compare/:slug" element={<FundComparison />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/roi-calculator" element={<ROICalculator />} />
                    <Route path="/fund-quiz" element={<FundQuiz />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
            </BrowserRouter>
          </ComparisonProvider>
        </RecentlyViewedProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
