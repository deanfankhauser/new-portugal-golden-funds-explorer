import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import FundDetails from "./pages/FundDetails";
import TagPage from "./pages/TagPage";
import CategoryPage from "./pages/CategoryPage";
import TagsHub from "./pages/TagsHub";
import CategoriesHub from "./pages/CategoriesHub";
import ManagersHub from "./pages/ManagersHub";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import ComparisonPage from "./pages/ComparisonPage";
import FundManager from "./pages/FundManager";
import FAQs from "./pages/FAQs";
import FundComparison from "./pages/FundComparison";
import ComparisonsHub from "./pages/ComparisonsHub";
import ROICalculator from "./pages/ROICalculator";
import FundQuiz from "./pages/FundQuiz";
import { analytics } from "./utils/analytics";
import Sitemap from "./components/Sitemap";

const queryClient = new QueryClient();

// Component to handle route tracking
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);

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
              <RouteTracker />
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
            </BrowserRouter>
          </ComparisonProvider>
        </RecentlyViewedProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
