
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import { RouterView } from 'vue-router';

const queryClient = new QueryClient();

const AppSSG = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RecentlyViewedProvider>
          <ComparisonProvider>
            <Toaster />
            <Sonner />
            <RouterView />
          </ComparisonProvider>
        </RecentlyViewedProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppSSG;
