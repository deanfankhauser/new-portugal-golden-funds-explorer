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
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';

const ManageFund: React.FC = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [fund, setFund] = useState<Fund | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [canDirectEdit, setCanDirectEdit] = useState(false);
  const { getFundById } = useRealTimeFunds();

  useEffect(() => {
    const checkAccessAndLoadFund = async () => {
      console.log('[ManageFund] init', { fundId, userId: user?.id });

      if (!user || !fundId) {
        setLoading(false);
        return;
      }

      try {
        // 1) Permission checks: try RPC, fallback to direct assignment query
        let access = false;
        let direct = false;
        try {
          const { data: canEdit, error: permError } = await supabase.rpc('can_user_edit_fund', {
            p_user_id: user.id,
            p_fund_id: fundId,
          });
          if (permError) throw permError;
          access = !!canEdit;
          direct = !!canEdit;
          console.log('[ManageFund] RPC can_user_edit_fund result', { access, direct });
        } catch (e) {
          console.warn('[ManageFund] RPC failed, falling back to fund_managers', e);
          const { data: assignment, error: assignError } = await supabase
            .from('fund_managers')
            .select('status, permissions')
            .eq('user_id', user.id)
            .eq('fund_id', fundId)
            .maybeSingle();
          if (assignError) {
            console.warn('[ManageFund] fund_managers fallback error', assignError);
          }
          access = assignment?.status === 'active';
          // permissions is jsonb; guard optional
          // @ts-expect-error permissions is jsonb from DB
          direct = Boolean(assignment?.permissions?.can_edit);
          console.log('[ManageFund] Fallback assignment result', { access, direct, assignment });
        }

        setHasAccess(access);
        setCanDirectEdit(direct);
        if (!access) {
          console.warn('[ManageFund] No access to this fund', { fundId });
          return;
        }

        // 2) Load fund: DB first, then fallback to local dataset
        let loadedFund: any = null;
        try {
          const { data: fundData, error: fundError } = await supabase
            .from('funds')
            .select('*')
            .eq('id', fundId)
            .maybeSingle();
          if (fundError) throw fundError;
          loadedFund = fundData ?? null;
          console.log('[ManageFund] Fund from DB', loadedFund?.id);
        } catch (dbErr) {
          console.warn('[ManageFund] DB fund fetch failed, will try fallback', dbErr);
        }

        if (!loadedFund) {
          const fallback = getFundById(fundId);
          if (fallback) {
            console.log('[ManageFund] Using fallback fund dataset', fallback.id);
            loadedFund = fallback;
          }
        }

        // Transform snake_case DB fields to camelCase for UI compatibility
        if (loadedFund) {
          loadedFund = {
            ...loadedFund,
            detailedDescription: loadedFund.detailed_description || loadedFund.detailedDescription,
            managerName: loadedFund.manager_name || loadedFund.managerName,
            minimumInvestment: loadedFund.minimum_investment || loadedFund.minimumInvestment,
            expectedReturnMin: loadedFund.expected_return_min || loadedFund.expectedReturnMin,
            expectedReturnMax: loadedFund.expected_return_max || loadedFund.expectedReturnMax,
            managementFee: loadedFund.management_fee || loadedFund.managementFee,
            performanceFee: loadedFund.performance_fee || loadedFund.performanceFee,
            lockUpPeriodMonths: loadedFund.lock_up_period_months || loadedFund.lockUpPeriodMonths,
            websiteUrl: loadedFund.website || loadedFund.websiteUrl,
            cmvmId: loadedFund.cmvm_id || loadedFund.cmvmId,
            inceptionDate: loadedFund.inception_date || loadedFund.inceptionDate,
            navFrequency: loadedFund.nav_frequency || loadedFund.navFrequency,
            pficStatus: loadedFund.pfic_status || loadedFund.pficStatus,
            regulatedBy: loadedFund.regulated_by || loadedFund.regulatedBy,
            riskLevel: loadedFund.risk_level || loadedFund.riskLevel,
            fundStatus: loadedFund.fund_status || loadedFund.fundStatus,
            eligibilityBasis: loadedFund.eligibility_basis || loadedFund.eligibilityBasis,
            redemptionTerms: loadedFund.redemption_terms || loadedFund.redemptionTerms,
            geographicAllocation: loadedFund.geographic_allocation || loadedFund.geographicAllocation,
            teamMembers: loadedFund.team_members || loadedFund.teamMembers,
            pdfDocuments: loadedFund.pdf_documents || loadedFund.pdfDocuments,
            historicalPerformance: loadedFund.historical_performance || loadedFund.historicalPerformance,
            gvEligible: loadedFund.gv_eligible !== undefined ? loadedFund.gv_eligible : loadedFund.gvEligible,
            isVerified: loadedFund.is_verified !== undefined ? loadedFund.is_verified : loadedFund.isVerified,
            subscriptionFee: loadedFund.subscription_fee || loadedFund.subscriptionFee,
            redemptionFee: loadedFund.redemption_fee || loadedFund.redemptionFee,
            hurdleRate: loadedFund.hurdle_rate || loadedFund.hurdleRate,
          };
        }

        setFund(loadedFund as any);
      } catch (error) {
        console.error('[ManageFund] Unexpected error', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndLoadFund();
  }, [user, fundId, getFundById]);

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
