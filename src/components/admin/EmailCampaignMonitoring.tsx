import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, TrendingUp, MousePointer, Eye, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface EmailStats {
  email_type: string;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  open_rate: number;
  click_rate: number;
  avg_clicks_per_email: number;
}

interface RecentEmail {
  id: string;
  sent_at: string;
  email_type: string;
  fund_name: string;
  manager_name: string;
  manager_email: string;
  subject: string;
  is_verified_fund: boolean;
  opened_at: string | null;
  first_click_at: string | null;
  click_count: number;
  weekly_impressions: number | null;
  weekly_leads: number | null;
}

interface ManagerEngagement {
  manager_email: string;
  manager_name: string;
  total_emails: number;
  opened: number;
  clicked: number;
  open_rate: number;
  last_opened: string | null;
  total_clicks: number;
}

export function EmailCampaignMonitoring() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [emailStats, setEmailStats] = useState<EmailStats[]>([]);
  const [recentEmails, setRecentEmails] = useState<RecentEmail[]>([]);
  const [managerEngagement, setManagerEngagement] = useState<ManagerEngagement[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchEmailStats(),
        fetchRecentEmails(),
        fetchManagerEngagement(),
      ]);
    } catch (error) {
      console.error('Error fetching email campaign data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email campaign data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmailStats = async () => {
    const { data, error } = await supabase.rpc('get_email_campaign_stats', { days: 30 });

    if (error) {
      console.error('Error fetching email stats:', error);
      return;
    }

    setEmailStats(data || []);
  };

  const fetchRecentEmails = async () => {
    const { data: logs, error } = await supabase
      .from('fund_manager_email_logs')
      .select(`
        id,
        sent_at,
        email_type,
        fund_id,
        manager_name,
        manager_email,
        subject,
        is_verified_fund,
        opened_at,
        first_click_at,
        click_count,
        weekly_impressions,
        weekly_leads
      `)
      .eq('test_mode', false)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching recent emails:', error);
      return;
    }

    // Fetch fund names
    const emailsWithFunds = await Promise.all(
      (logs || []).map(async (log) => {
        const { data: fund } = await supabase
          .from('funds')
          .select('name')
          .eq('id', log.fund_id)
          .single();

        return {
          ...log,
          fund_name: fund?.name || 'Unknown Fund',
        };
      })
    );

    setRecentEmails(emailsWithFunds);
  };

  const fetchManagerEngagement = async () => {
    const { data, error } = await supabase
      .from('fund_manager_email_logs')
      .select('*')
      .eq('test_mode', false)
      .gte('sent_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching manager engagement:', error);
      return;
    }

    // Aggregate by manager
    const managerMap = new Map<string, ManagerEngagement>();
    
    (data || []).forEach((email) => {
      const key = email.manager_email;
      if (!managerMap.has(key)) {
        managerMap.set(key, {
          manager_email: email.manager_email,
          manager_name: email.manager_name || 'Unknown',
          total_emails: 0,
          opened: 0,
          clicked: 0,
          open_rate: 0,
          last_opened: null,
          total_clicks: 0,
        });
      }

      const manager = managerMap.get(key)!;
      manager.total_emails++;
      if (email.opened_at) manager.opened++;
      if (email.first_click_at) manager.clicked++;
      manager.total_clicks += email.click_count || 0;
      if (email.opened_at && (!manager.last_opened || email.opened_at > manager.last_opened)) {
        manager.last_opened = email.opened_at;
      }
    });

    // Calculate open rates and sort
    const managers = Array.from(managerMap.values())
      .map(m => ({
        ...m,
        open_rate: m.total_emails > 0 ? (m.opened / m.total_emails) * 100 : 0,
      }))
      .sort((a, b) => b.open_rate - a.open_rate)
      .slice(0, 20);

    setManagerEngagement(managers);
  };

  const getEmailTypeLabel = (type: string) => {
    return type === 'weekly_digest' ? 'Weekly Digest' : 'Monthly Reminder';
  };

  const getEmailTypeColor = (type: string) => {
    return type === 'weekly_digest' ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading email campaign data...</p>
        </div>
      </div>
    );
  }

  const totalStats = emailStats.reduce((acc, stat) => ({
    total_sent: acc.total_sent + stat.total_sent,
    total_opened: acc.total_opened + stat.total_opened,
    total_clicked: acc.total_clicked + stat.total_clicked,
  }), { total_sent: 0, total_opened: 0, total_clicked: 0 });

  const overallOpenRate = totalStats.total_sent > 0 
    ? ((totalStats.total_opened / totalStats.total_sent) * 100).toFixed(1) 
    : '0.0';
  
  const overallClickRate = totalStats.total_sent > 0 
    ? ((totalStats.total_clicked / totalStats.total_sent) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.total_sent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallOpenRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.total_opened} / {totalStats.total_sent} opened
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallClickRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.total_clicked} / {totalStats.total_sent} clicked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engaged Managers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerEngagement.filter(m => m.opened > 0).length}</div>
            <p className="text-xs text-muted-foreground">
              Out of {managerEngagement.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Emails</TabsTrigger>
          <TabsTrigger value="managers">Manager Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Type Performance</CardTitle>
              <CardDescription>Breakdown by email campaign type (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Type</TableHead>
                    <TableHead className="text-right">Sent</TableHead>
                    <TableHead className="text-right">Opened</TableHead>
                    <TableHead className="text-right">Clicked</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Click Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailStats.map((stat) => (
                    <TableRow key={stat.email_type}>
                      <TableCell>
                        <Badge variant={getEmailTypeColor(stat.email_type)}>
                          {getEmailTypeLabel(stat.email_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{stat.total_sent}</TableCell>
                      <TableCell className="text-right">{stat.total_opened}</TableCell>
                      <TableCell className="text-right">{stat.total_clicked}</TableCell>
                      <TableCell className="text-right">
                        <span className={stat.open_rate >= 20 ? 'text-green-600 font-medium' : ''}>
                          {stat.open_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={stat.click_rate >= 5 ? 'text-green-600 font-medium' : ''}>
                          {stat.click_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Emails Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Activity</CardTitle>
              <CardDescription>Last 50 emails sent (excluding test mode)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fund</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="text-sm">
                        {format(new Date(email.sent_at), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEmailTypeColor(email.email_type)} className="text-xs">
                          {getEmailTypeLabel(email.email_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {email.fund_name}
                        {email.is_verified_fund && (
                          <Badge variant="outline" className="ml-2 text-xs">Verified</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-sm">
                        {email.manager_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {email.opened_at ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          {email.first_click_at && (
                            <MousePointer className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{email.click_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manager Engagement Tab */}
        <TabsContent value="managers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manager Engagement Leaderboard</CardTitle>
              <CardDescription>Top 20 managers by email engagement (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manager</TableHead>
                    <TableHead className="text-right">Emails</TableHead>
                    <TableHead className="text-right">Opened</TableHead>
                    <TableHead className="text-right">Clicked</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Total Clicks</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managerEngagement.map((manager) => (
                    <TableRow key={manager.manager_email}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{manager.manager_name}</div>
                          <div className="text-xs text-muted-foreground">{manager.manager_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{manager.total_emails}</TableCell>
                      <TableCell className="text-right">{manager.opened}</TableCell>
                      <TableCell className="text-right">{manager.clicked}</TableCell>
                      <TableCell className="text-right">
                        <span className={manager.open_rate >= 50 ? 'text-green-600 font-medium' : ''}>
                          {manager.open_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{manager.total_clicks}</TableCell>
                      <TableCell className="text-sm">
                        {manager.last_opened 
                          ? format(new Date(manager.last_opened), 'MMM d, HH:mm')
                          : 'Never'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
