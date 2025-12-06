import React, { useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import FundManagerSidebar from '@/components/fund-manager/FundManagerSidebar';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import MyLeads from '@/pages/MyLeads';
import CompanyDetails from '@/components/fund-manager/CompanyDetails';
import CompanyTeamManagement from '@/components/fund-manager/CompanyTeamManagement';
import FundUpdate from '@/components/fund-manager/FundUpdate';
import FundAnalytics from '@/components/fund-manager/FundAnalytics';
import FundAdvertising from '@/components/fund-manager/FundAdvertising';
import FundTeam from '@/components/fund-manager/FundTeam';
import { isDevelopment } from '@/lib/environment';

const FundManagerPanel: React.FC = () => {
  const { user, loading: authLoading } = useEnhancedAuth();
  const location = useLocation();

  if (authLoading) {
    return <PageLoader />;
  }

  // DEV MODE BYPASS - skip auth check in preview/localhost
  if (!user && !isDevelopment()) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <FundManagerSidebar />
        
        <main className="flex-1 overflow-auto bg-background">
          <div className="sticky top-0 z-10 h-14 flex items-center border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
          </div>
          
          <div className="p-4 lg:p-6">
            <Routes>
              {/* Default to Leads */}
              <Route index element={<MyLeads />} />
              
              {/* Company Management */}
              <Route path="company/:profileId" element={<CompanyDetails />} />
              <Route path="company/:profileId/team-members" element={<CompanyTeamManagement />} />
              <Route path="company/:profileId/team" element={<FundTeam />} />
              
              {/* Fund Management */}
              <Route path="fund/:fundId/update" element={<FundUpdate />} />
              <Route path="fund/:fundId/analytics" element={<FundAnalytics />} />
              <Route path="fund/:fundId/advertising" element={<FundAdvertising />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default FundManagerPanel;
