import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Edit3, BarChart3, Users, Megaphone, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import FundManagementHeader from '@/components/fund-manager/FundManagementHeader';
import UpdateFundTab from '@/components/fund-manager/UpdateFundTab';
import AnalyticsTab from '@/components/fund-manager/AnalyticsTab';
import LeadsTab from '@/components/fund-manager/LeadsTab';
import AdvertisingTab from '@/components/fund-manager/AdvertisingTab';
import { Fund } from '@/data/types/funds';
import { useFund } from '@/hooks/useFundsQuery';

const ManageFund: React.FC = () => {
  const { fundId } = useParams<{ fundId: string }>();
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

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
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
    );
  }

  if (!hasAccess) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have access to manage this fund. If you believe this is an error, please contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fund not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FundManagementHeader fund={fund} canDirectEdit={canDirectEdit} />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="update" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="update" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Update Fund
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="advertising" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Advertising
            </TabsTrigger>
          </TabsList>

          <TabsContent value="update">
            <UpdateFundTab fund={fund} canDirectEdit={canDirectEdit} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab fundId={fund.id} />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsTab fundId={fund.id} />
          </TabsContent>

          <TabsContent value="advertising">
            <AdvertisingTab fundId={fund.id} fundName={fund.name} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageFund;
