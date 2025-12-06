import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageLoader } from "@/components/common/LoadingSkeleton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import FundAnalyticsDashboard from "@/components/admin/FundAnalyticsDashboard";
import { EnhancedSuggestionsTable } from "@/components/admin/EnhancedSuggestionsTable";
import FundManagement from "@/components/admin/FundManagement";
import FundRankingManager from "@/components/admin/FundRankingManager";
import { ManagerProfileAssignment } from "@/components/admin/ManagerProfileAssignment";
import UsersManagement from "@/components/admin/UsersManagement";
import EmailCapturesManagement from "@/components/admin/EmailCapturesManagement";
import { AllLeadsManagement } from "@/components/admin/AllLeadsManagement";
import { PerformanceMonitoring } from "@/components/admin/PerformanceMonitoring";
import { QuizAnalyticsTab } from "@/components/admin/QuizAnalyticsTab";
import { DataCopyButton } from "@/components/admin/DataCopyButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditFundsManagement } from "@/components/admin/EditFundsManagement";
import { EditCompanyProfilesManagement } from "@/components/admin/EditCompanyProfilesManagement";
import { AdminCreateCompanyProfile } from "@/components/admin/AdminCreateCompanyProfile";
import { isDevelopment } from "@/lib/environment";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useEnhancedAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // DEV MODE BYPASS - auto-grant superadmin access in preview/localhost
      if (isDevelopment()) {
        console.log('🔧 DEV MODE: Auto-granting superadmin access');
        setIsAdmin(true);
        setAdminRole('super_admin');
        setCheckingAdmin(false);
        return;
      }

      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
          return;
        }

        if (adminData) {
          setIsAdmin(true);
          setAdminRole(adminData.role);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  if (checkingAdmin) {
    return <PageLoader />;
  }

  // In dev mode, skip user check since we're using mock user
  if (!user && !isDevelopment()) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        
        {/* DEV MODE indicator badge */}
        {isDevelopment() && (
          <div className="fixed top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold z-50">
            DEV MODE - Auth Bypassed
          </div>
        )}
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route index element={<FundAnalyticsDashboard />} />
              <Route path="suggestions" element={<EnhancedSuggestionsTable onDataChange={() => {}} />} />
              <Route path="funds" element={<FundManagement />} />
              <Route path="rankings" element={<FundRankingManager />} />
              <Route path="company-managers" element={<ManagerProfileAssignment />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="emails" element={<EmailCapturesManagement />} />
              <Route path="leads" element={<AllLeadsManagement />} />
              <Route path="performance" element={<PerformanceMonitoring />} />
              <Route path="quiz-analytics" element={<QuizAnalyticsTab />} />
              <Route path="edit-funds" element={<EditFundsManagement />} />
              <Route path="edit-profiles/new" element={<AdminCreateCompanyProfile />} />
              <Route path="edit-profiles" element={<EditCompanyProfilesManagement />} />
              <Route
                path="settings" 
                element={
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DataCopyButton />
                    </CardContent>
                  </Card>
                } 
              />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}