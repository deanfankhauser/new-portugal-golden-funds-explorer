import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Edit3, Clock, CheckCircle, XCircle, Settings, Database, FileText, TrendingUp, Mail, Building2 } from 'lucide-react';
import { PageLoader } from '@/components/common/LoadingSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedSuggestionsTable } from '@/components/admin/EnhancedSuggestionsTable';
import UsersManagement from '@/components/admin/UsersManagement';
import { DataCopyButton } from '@/components/admin/DataCopyButton';
import MigrateFundsButton from '@/components/admin/MigrateFundsButton';
import FundManagement from '@/components/admin/FundManagement';
import FundRankingManager from '@/components/admin/FundRankingManager';
import EmailCapturesManagement from '@/components/admin/EmailCapturesManagement';
import { FundManagerAssignment } from '@/components/admin/FundManagerAssignment';
import { ManagerProfileAssignment } from '@/components/admin/ManagerProfileAssignment';

const AdminPanel = () => {
  const { user, loading } = useEnhancedAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalUsers: 0,
    emailCapturesCount: 0,
    emailCapturesConfirmed: 0
  });

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
          setAdminRole(null);
        } else {
          setIsAdmin(!!data);
          setAdminRole(data?.role || null);
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
    const fetchStats = async () => {
      if (!isAdmin) return;

      try {
        console.log('Fetching admin stats...');
        
        // Get pending suggestions count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('fund_edit_suggestions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (pendingError) {
          console.error('Error fetching pending count:', pendingError);
        } else {
          console.log('Pending suggestions count:', pendingCount);
        }

        // Get today's approved suggestions
        const today = new Date().toISOString().split('T')[0];
        const { count: approvedToday } = await supabase
          .from('fund_edit_suggestions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved')
          .gte('approved_at', today);

        // Get today's rejected suggestions
        const { count: rejectedToday } = await supabase
          .from('fund_edit_suggestions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected')
          .gte('updated_at', today);

        // Get total users from unified profiles table
        const { count: totalUserCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get email captures stats
        const { count: emailCapturesCount } = await supabase
          .from('email_captures')
          .select('*', { count: 'exact', head: true });

        const { count: emailCapturesConfirmed } = await supabase
          .from('email_captures')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'confirmed');

        setStats({
          pendingCount: pendingCount || 0,
          approvedToday: approvedToday || 0,
          rejectedToday: rejectedToday || 0,
          totalUsers: totalUserCount || 0,
          emailCapturesCount: emailCapturesCount || 0,
          emailCapturesConfirmed: emailCapturesConfirmed || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (loading || checkingAdmin) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Suggestions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvedToday}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejectedToday}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Captures</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.emailCapturesCount}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.emailCapturesConfirmed} confirmed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="suggestions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="funds" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Funds
              </TabsTrigger>
              <TabsTrigger value="rankings" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Rankings
              </TabsTrigger>
              <TabsTrigger value="fund-managers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Fund Managers
              </TabsTrigger>
              <TabsTrigger value="profiles" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Managers
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="emails" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Captures
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions">
              <EnhancedSuggestionsTable onDataChange={() => {
                // Refresh stats when suggestions data changes
                if (isAdmin) {
                  const fetchStats = async () => {
                    try {
                      const { count: pendingCount } = await supabase
                        .from('fund_edit_suggestions')
                        .select('*', { count: 'exact', head: true })
                        .eq('status', 'pending');
                      
                      setStats(prev => ({ ...prev, pendingCount: pendingCount || 0 }));
                    } catch (error) {
                      console.error('Error refreshing stats:', error);
                    }
                  };
                  fetchStats();
                }
              }} />
            </TabsContent>
            
            <TabsContent value="funds">
              <FundManagement />
            </TabsContent>

            <TabsContent value="rankings">
              <FundRankingManager />
            </TabsContent>

            <TabsContent value="fund-managers">
              <FundManagerAssignment />
            </TabsContent>

            <TabsContent value="profiles">
              <ManagerProfileAssignment />
            </TabsContent>

            <TabsContent value="users">
              <UsersManagement currentUserRole={adminRole} />
            </TabsContent>

            <TabsContent value="emails">
              <EmailCapturesManagement />
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <MigrateFundsButton />
                
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      System configuration and data management tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataCopyButton />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;