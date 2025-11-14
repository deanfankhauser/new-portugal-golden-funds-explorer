import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageLoader } from "@/components/common/LoadingSkeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
import { DataCopyButton } from "@/components/admin/DataCopyButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useEnhancedAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
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

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-[calc(100vh-4rem)] w-full">
            <AdminSidebar />
            
            <div className="flex-1 flex flex-col">
              <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="flex h-14 items-center gap-4 px-6">
                  <SidebarTrigger />
                  <h1 className="text-xl font-semibold">Admin Panel</h1>
                  {adminRole && (
                    <span className="text-sm text-muted-foreground">
                      Role: {adminRole}
                    </span>
                  )}
                </div>
              </div>

              <main className="flex-1 p-6 overflow-auto">
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
              </main>
            </div>
          </div>
        </SidebarProvider>

        <Footer />
      </div>
    </>
  );
}