
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";

const queryClient = new QueryClient();

const AppSSG = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RecentlyViewedProvider>
          <ComparisonProvider>
            <Toaster />
            <Sonner />
            {children}
          </ComparisonProvider>
        </RecentlyViewedProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppSSG;
