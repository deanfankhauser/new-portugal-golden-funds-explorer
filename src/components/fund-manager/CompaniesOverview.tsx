import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Edit3, TrendingUp, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAllFunds } from '@/hooks/useFundsQuery';
import { useFundEngagementMetrics } from '@/hooks/useFundEngagementMetrics';
import { Fund } from '@/data/types/funds';
import { Profile } from '@/types/profile';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import PageSEO from '@/components/common/PageSEO';

interface ProfileAssignment {
  id: string;
  profile_id: string;
  status: string;
  assigned_at: string;
  permissions: {
    can_edit_profile: boolean;
    can_edit_funds: boolean;
    can_manage_team: boolean;
    can_view_analytics: boolean;
  };
}

interface CompanyWithFunds {
  profile: Profile;
  assignment: ProfileAssignment;
  funds: Fund[];
}

const CompaniesOverview: React.FC = () => {
  const { user } = useEnhancedAuth();
  const [companiesWithFunds, setCompaniesWithFunds] = useState<CompanyWithFunds[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: allFunds } = useAllFunds();
  
  const allFundIds = companiesWithFunds.flatMap(c => c.funds.map(f => f.id));
  const metrics = useFundEngagementMetrics(allFundIds);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      const { data } = await supabase.rpc('is_user_admin');
      setIsAdmin(!!data);
    };
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user || !allFunds) return;

      try {
        let companiesData: CompanyWithFunds[] = [];

        if (isAdmin) {
          const { data: allProfiles } = await supabase
            .from('profiles')
            .select('*')
            .not('company_name', 'is', null)
            .order('company_name');

          if (allProfiles) {
            const companiesDataPromises = allProfiles.map(async (profile: Profile) => {
              const { data: companyFunds } = await supabase
                .rpc('get_funds_by_company_name', { 
                  company_name_param: profile.company_name 
                });
              
              return {
                profile,
                assignment: {
                  id: 'admin-access',
                  profile_id: profile.id,
                  status: 'active',
                  assigned_at: new Date().toISOString(),
                  permissions: {
                    can_edit_profile: true,
                    can_edit_funds: true,
                    can_manage_team: true,
                    can_view_analytics: true
                  }
                },
                funds: (companyFunds || []).map(cf => 
                  allFunds.find(f => f.id === cf.id)
                ).filter((f): f is Fund => f !== undefined)
              };
            });

            companiesData = await Promise.all(companiesDataPromises);
          }
        } else {
          const { data: assignmentsData } = await supabase
            .from('manager_profile_assignments')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('assigned_at', { ascending: false });

          if (assignmentsData && assignmentsData.length > 0) {
            const profileIds = assignmentsData.map(a => a.profile_id);
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('*')
              .in('id', profileIds);

            if (profilesData) {
              const companiesDataPromises = profilesData.map(async (profile: Profile) => {
                const assignment = assignmentsData.find(a => a.profile_id === profile.id)!;
                
                const { data: companyFunds } = await supabase
                  .rpc('get_funds_by_company_name', { 
                    company_name_param: profile.company_name 
                  });
                
                return {
                  profile,
                  assignment: assignment as unknown as ProfileAssignment,
                  funds: (companyFunds || []).map(cf => 
                    allFunds.find(f => f.id === cf.id)
                  ).filter((f): f is Fund => f !== undefined)
                };
              });

              companiesData = await Promise.all(companiesDataPromises);
            }
          }
        }

        setCompaniesWithFunds(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user, allFunds, isAdmin]);

  return (
    <>
      <PageSEO pageType="about" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isAdmin ? 'All Companies (Admin View)' : 'My Companies'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? 'View and manage all company profiles and their investment funds across the platform' 
              : 'Manage your assigned companies and their investment funds'
            }
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Loading companies...
            </CardContent>
          </Card>
        ) : companiesWithFunds.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Companies Assigned</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any companies assigned to you yet. Contact an administrator if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {companiesWithFunds.map(({ profile, assignment, funds: companyFunds }) => (
              <div key={profile.id} className="space-y-4">
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {profile.logo_url && (
                          <img
                            src={profile.logo_url}
                            alt={profile.company_name}
                            className="h-16 w-16 rounded-lg object-cover border"
                          />
                        )}
                        <div>
                          <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            {profile.company_name}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Managing {companyFunds.length} fund{companyFunds.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {assignment.permissions.can_edit_profile && (
                          <Link to={`/dashboard/company/${profile.id}`}>
                            <Button>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {companyFunds.length > 0 ? (
                  <div className="pl-4 border-l-2 border-primary/20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Investment Funds
                    </h3>
                    <div className="space-y-3">
                      {companyFunds.map((fund) => (
                        <Card key={fund.id} className="hover:border-primary/40 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <CompanyLogo managerName={fund.managerName} size="sm" className="mt-1" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-1">{fund.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {metrics[fund.id]?.loading ? '—' : metrics[fund.id]?.monthlyViews ?? 0} impressions (30d)
                                  </span>
                                </div>
                              </div>
                              <Link to={`/dashboard/fund/${fund.id}/update`}>
                                <Button variant="outline" size="sm">
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Manage
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="ml-4">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No funds associated with this company yet
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CompaniesOverview;
