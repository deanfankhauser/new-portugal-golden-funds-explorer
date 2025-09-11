import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Edit3, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const { user, loading, userType } = useEnhancedAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [pendingSuggestions, setPendingSuggestions] = useState([]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchPendingSuggestions = async () => {
      if (!isAdmin) return;

      try {
        const { data, error } = await supabase
          .from('fund_edit_suggestions')
          .select(`
            *,
            investor_profiles(first_name, last_name),
            manager_profiles(manager_name, company_name)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPendingSuggestions(data || []);
      } catch (error) {
        console.error('Error fetching pending suggestions:', error);
      }
    };

    fetchPendingSuggestions();
  }, [isAdmin]);

  if (loading || checkingAdmin) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/investor-auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="about" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access the admin panel.</p>
            <p className="text-sm text-gray-500 mt-2">Contact an administrator if you need access.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="about" />
      <Header />
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage fund edit suggestions and user permissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Suggestions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingSuggestions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Pending Fund Edit Suggestions
              </CardTitle>
              <CardDescription>
                Review and approve fund information updates submitted by the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingSuggestions.length === 0 ? (
                <div className="text-center py-8">
                  <Edit3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending suggestions</p>
                  <p className="text-sm text-gray-500">All caught up! Check back later for new submissions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSuggestions.slice(0, 5).map((suggestion: any) => (
                    <div key={suggestion.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">Fund ID: {suggestion.fund_id}</h3>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Submitted by: {suggestion.investor_profiles?.first_name || suggestion.manager_profiles?.manager_name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Object.keys(suggestion.suggested_changes).length} field(s) modified
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" disabled>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingSuggestions.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-4">
                      And {pendingSuggestions.length - 5} more suggestions...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coming Soon Notice */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>🚧 Admin Features Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Full admin functionality including suggestion review, approval/rejection, and user management
                will be available in the next update.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;