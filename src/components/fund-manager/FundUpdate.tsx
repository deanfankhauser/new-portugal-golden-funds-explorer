import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFund } from '@/hooks/useFundsQuery';
import { supabase } from '@/integrations/supabase/client';
import PageSEO from '@/components/common/PageSEO';
import UpdateFundTab from './UpdateFundTab';
import { isDevelopment } from '@/lib/environment';

const FundUpdate: React.FC = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const { user, loading: authLoading } = useEnhancedAuth();
  const [hasAccess, setHasAccess] = useState(isDevelopment()); // Auto-grant in dev mode
  const [canDirectEdit, setCanDirectEdit] = useState(isDevelopment()); // Auto-grant in dev mode
  const { data: fund, isLoading: fundLoading } = useFund(fundId);

  useEffect(() => {
    const checkAccess = async () => {
      // Skip permission check in dev mode
      if (isDevelopment()) {
        setHasAccess(true);
        setCanDirectEdit(true);
        return;
      }

      if (!user || !fund) return;

      try {
        const { data: hasCompanyAccess, error } = await supabase.rpc(
          'can_user_manage_company_funds',
          {
            check_user_id: user.id,
            check_manager_name: fund.managerName,
          }
        );
        
        if (error) throw error;
        
        const access = !!hasCompanyAccess;
        setHasAccess(access);
        setCanDirectEdit(access);
      } catch (e) {
        console.error('Permission check failed', e);
        setHasAccess(false);
        setCanDirectEdit(false);
      }
    };

    checkAccess();
  }, [user, fund]);

  if (authLoading || fundLoading) {
    return <PageLoader />;
  }

  // DEV MODE BYPASS - skip auth check in preview/localhost
  if (!user && !isDevelopment()) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasAccess) {
    return (
      <>
        <PageSEO pageType="about" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have access to manage this fund.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  if (!fund) {
    return (
      <>
        <PageSEO pageType="about" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fund not found.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageSEO pageType="about" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {fund.name}
              {fund.isVerified && <Badge variant="secondary">Verified</Badge>}
            </h1>
            <p className="text-muted-foreground mt-1">
              Update fund information
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/funds/${fund.slug}`} target="_blank" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Public Page
            </Link>
          </Button>
        </div>

        <UpdateFundTab fund={fund} canDirectEdit={canDirectEdit} />
      </div>
    </>
  );
};

export default FundUpdate;
