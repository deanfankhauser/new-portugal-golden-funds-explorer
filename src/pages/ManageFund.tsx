import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import FundManagerSidebar from '@/components/fund-manager/FundManagerSidebar';
import { Link } from 'react-router-dom';
import UpdateFundTab from '@/components/fund-manager/UpdateFundTab';
import AnalyticsTab from '@/components/fund-manager/AnalyticsTab';
import LeadsTab from '@/components/fund-manager/LeadsTab';
import AdvertisingTab from '@/components/fund-manager/AdvertisingTab';
import { Fund } from '@/data/types/funds';
import { useFund } from '@/hooks/useFundsQuery';

const ManageFund: React.FC = () => {
  const { fundId, '*': subRoute } = useParams<{ fundId: string; '*': string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [canDirectEdit, setCanDirectEdit] = useState(false);
  const { data: fund, isLoading: fundLoading, isFetching, isError } = useFund(fundId);
  
  // Show loading during any loading/error state (allows React Query retry)
  const loading = fundLoading || isFetching || isError;

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !fund) {
        return;
      }

      try {
        // Check company-level permissions using manager_name
        const { data: hasCompanyAccess, error: companyError } = await supabase.rpc(
          'can_user_manage_company_funds',
          {
            check_user_id: user.id,
            check_manager_name: fund.managerName,
          }
        );
        if (companyError) throw companyError;
        
        const access = !!hasCompanyAccess;
        const direct = !!hasCompanyAccess; // All company managers can edit
        
        setHasAccess(access);
        setCanDirectEdit(direct);
        
        console.log('[ManageFund] Permission check', {
          fundId,
          managerName: fund.managerName,
          access,
          direct,
        });
      } catch (e) {
        console.error('[ManageFund] Permission check failed', e);
        setHasAccess(false);
        setCanDirectEdit(false);
      }
    };

    checkAccess();
  }, [user, fund, fundId]);

  // Get current section from location
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/update')) return { label: 'Update Fund', path: 'update' };
    if (path.includes('/analytics')) return { label: 'Analytics', path: 'analytics' };
    if (path.includes('/leads')) return { label: 'Leads', path: 'leads' };
    if (path.includes('/advertising')) return { label: 'Advertising', path: 'advertising' };
    return { label: 'Update Fund', path: 'update' };
  };

  const currentSection = getCurrentSection();

  if (authLoading || loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <FundManagerSidebar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <FundManagerSidebar />
          <div className="flex-1 p-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please log in to access fund management.
                <Button onClick={() => navigate('/auth')} className="ml-4" size="sm">
                  Log In
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!hasAccess) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <FundManagerSidebar />
          <div className="flex-1 p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have access to manage this fund. If you believe this is an error, please contact support.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!fund) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <FundManagerSidebar />
          <div className="flex-1 p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Fund not found.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <FundManagerSidebar 
          fundId={fund.id} 
          fundName={fund.name}
        />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-xl font-semibold">{fund.name}</h1>
              {fund.isVerified && (
                <Badge variant="secondary">Verified</Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={`/funds/${fund.slug}`} target="_blank" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Public Page
              </Link>
            </Button>
          </header>
          
          {/* Breadcrumb Navigation */}
          <div className="border-b bg-muted/30 px-4 lg:px-6 py-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/my-funds">My Companies</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/my-funds">{fund.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentSection.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route index element={<Navigate to="update" replace />} />
                <Route path="update" element={<UpdateFundTab fund={fund} canDirectEdit={canDirectEdit} />} />
                <Route path="analytics" element={<AnalyticsTab fundId={fund.id} />} />
                <Route path="leads" element={<LeadsTab fundId={fund.id} />} />
                <Route path="advertising" element={<AdvertisingTab fundId={fund.id} fundName={fund.name} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManageFund;
