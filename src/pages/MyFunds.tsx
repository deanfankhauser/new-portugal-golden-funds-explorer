import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit3 } from 'lucide-react';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { Fund } from '@/data/types/funds';
import MyProfilesCard from '@/components/manager-profile/MyProfilesCard';

interface FundAssignment {
  id: string;
  fund_id: string;
  status: string;
  assigned_at: string;
  permissions: {
    can_edit: boolean;
    can_publish: boolean;
  };
}

const MyFunds = () => {
  const { user, loading: authLoading } = useEnhancedAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<FundAssignment[]>([]);
  const { funds } = useRealTimeFunds();

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('fund_managers' as any)
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('assigned_at', { ascending: false });

        if (error) throw error;
        setAssignments((data as any) || []);
      } catch (error) {
        console.error('Error fetching fund assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  if (authLoading || loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Get assigned funds with full fund data
  const assignedFunds = assignments
    .map(assignment => {
      const fund = funds.find(f => f.id === assignment.fund_id);
      return fund ? { ...fund, assignment } : null;
    })
    .filter((f): f is Fund & { assignment: FundAssignment } => f !== null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="about" />
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Funds</h1>
            <p className="text-muted-foreground">
              Manage and update information for funds assigned to you
            </p>
          </div>

          {/* Company Profiles */}
          <div className="mb-8">
            <MyProfilesCard />
          </div>

          {/* Funds List */}
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Funds Assigned</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You don't have any funds assigned to you yet. Contact an administrator if you believe this is an error.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedFunds.map((fund) => (
                <Card key={fund.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{fund.name}</CardTitle>
                      <Badge variant={fund.assignment.status === 'active' ? 'default' : 'secondary'}>
                        {fund.assignment.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {fund.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{fund.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fund Size</span>
                        <span className="font-medium">€{fund.fundSize}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assigned</span>
                        <span className="font-medium">
                          {new Date(fund.assignment.assigned_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="pt-3">
                        {fund.assignment.permissions?.can_edit && (
                          <Link to={`/manage-fund/${fund.id}`}>
                            <Button className="w-full" size="sm">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Manage Fund
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
