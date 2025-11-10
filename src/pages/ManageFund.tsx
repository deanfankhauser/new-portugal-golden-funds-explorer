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

const ManageFund: React.FC = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [fund, setFund] = useState<Fund | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [canDirectEdit, setCanDirectEdit] = useState(false);

  useEffect(() => {
    const checkAccessAndLoadFund = async () => {
      if (!user || !fundId) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has access to this fund
        const { data: canEdit, error: permError } = await supabase
          .rpc('can_user_edit_fund', {
            p_user_id: user.id,
            p_fund_id: fundId
          });

        if (permError) throw permError;

        setHasAccess(!!canEdit);
        setCanDirectEdit(!!canEdit);

        if (!canEdit) {
          setLoading(false);
          return;
        }

        // Load fund data
        const { data: fundData, error: fundError } = await supabase
          .from('funds')
          .select('*')
          .eq('id', fundId)
          .single();

        if (fundError) throw fundError;

        setFund(fundData as any);
      } catch (error) {
        console.error('Error loading fund:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndLoadFund();
  }, [user, fundId]);

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
