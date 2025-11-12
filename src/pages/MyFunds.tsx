import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Edit3, TrendingUp, Eye, Users } from 'lucide-react';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAllFunds } from '@/hooks/useFundsQuery';
import { useFundEngagementMetrics } from '@/hooks/useFundEngagementMetrics';
import { Fund } from '@/data/types/funds';
import { Profile } from '@/types/profile';

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

const MyFunds = () => {
  const { user, loading: authLoading } = useEnhancedAuth();
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [companiesWithFunds, setCompaniesWithFunds] = useState<CompanyWithFunds[]>([]);
  const { data: allFunds, isLoading: fundsLoading, isError, isFetching } = useAllFunds();
  
  // Show loading during any loading/error state (allows React Query retry)
  const loading = assignmentsLoading || fundsLoading || isFetching || isError;
  
  // Get all fund IDs for metrics
  const allFundIds = companiesWithFunds.flatMap(c => c.funds.map(f => f.id));
  const metrics = useFundEngagementMetrics(allFundIds);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user || !allFunds) {
        setAssignmentsLoading(false);
        return;
      }

      try {
        // Get company-level assignments
        const { data: assignmentsData, error: assignError } = await supabase
          .from('manager_profile_assignments')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('assigned_at', { ascending: false });

        if (assignError) throw assignError;

        const assignments = (assignmentsData || []) as unknown as ProfileAssignment[];

        // Get full profile data for each assignment
        if (assignments.length > 0) {
          const profileIds = assignments.map(a => a.profile_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', profileIds);

          if (!profilesError && profilesData) {
            // Match profiles with their assignments and funds
            const companiesData: CompanyWithFunds[] = profilesData.map((profile: Profile) => {
              const assignment = assignments.find(a => a.profile_id === profile.id)!;
              // Find all funds managed by this company
              const companyFunds = allFunds.filter(f => f.managerName === profile.company_name);
              
              return {
                profile,
                assignment,
                funds: companyFunds
              };
            });

            setCompaniesWithFunds(companiesData);
          }
        }
      } catch (error) {
        console.error('Error fetching company assignments:', error);
      } finally {
        setAssignmentsLoading(false);
      }
    };

    fetchAssignments();
  }, [user, allFunds]);

  if (authLoading || loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="about" />
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Companies & Funds</h1>
            <p className="text-muted-foreground">
              Manage company profiles and all associated investment funds
            </p>
          </div>

          {/* Companies and Their Funds */}
          {companiesWithFunds.length === 0 ? (
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
                  {/* Company Card */}
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
                        {assignment.permissions.can_edit_profile && (
                          <Link to={`/manage-profile/${profile.id}`}>
                            <Button>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Company Profile
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Associated Funds */}
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
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-1">{fund.name}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-4 w-4" />
                                      {metrics[fund.id]?.loading ? '—' : metrics[fund.id]?.monthlyViews ?? 0} impressions (30d)
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {metrics[fund.id]?.loading ? '—' : metrics[fund.id]?.totalLeads ?? 0} total leads
                                    </span>
                                  </div>
                                </div>
                                <Link to={`/manage-fund/${fund.id}`}>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default MyFunds;
