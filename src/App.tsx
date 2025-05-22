
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FundDetails from "./pages/FundDetails";
import TagPage from "./pages/TagPage";
import CategoryPage from "./pages/CategoryPage";
import TagsHub from "./pages/TagsHub";
import CategoriesHub from "./pages/CategoriesHub";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import ComparisonPage from "./pages/ComparisonPage";
import FundManager from "./pages/FundManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ComparisonProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/funds/:id" element={<FundDetails />} />
            <Route path="/tags" element={<TagsHub />} />
            <Route path="/tags/:tag" element={<TagPage />} />
            <Route path="/categories" element={<CategoriesHub />} />
            <Route path="/categories/:category" element={<CategoryPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/manager/:name" element={<FundManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ComparisonProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
