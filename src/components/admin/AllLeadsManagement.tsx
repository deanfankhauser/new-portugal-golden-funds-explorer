import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  fund_id: string | null;
  fund_name: string;
  manager_name: string;
  investment_amount_range: string;
  status: string;
  interest_areas: any;
  created_at: string;
  updated_at: string;
}

export function AllLeadsManagement() {
  const { user } = useEnhancedAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkingStatus, setCheckingStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAllLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, statusFilter, searchQuery]);

  const fetchAllLeads = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('fund_enquiries')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          fund_id,
          investment_amount_range,
          status,
          interest_areas,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch fund names for each lead
      const leadsWithFunds = await Promise.all(
        (data || []).map(async (lead) => {
          if (!lead.fund_id) {
            // General enquiry without specific fund
            return {
              ...lead,
              fund_name: 'General Enquiry',
              manager_name: 'General',
            };
          }

          const { data: fund } = await supabase
            .from('funds')
            .select('name, manager_name')
            .eq('id', lead.fund_id)
            .single();

          return {
            ...lead,
            fund_name: fund?.name || 'Unknown Fund',
            manager_name: fund?.manager_name || 'Unknown Manager',
          };
        })
      );

      setLeads(leadsWithFunds);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leads',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (statusFilter === 'stale') {
      // Stale leads: Open leads not updated in 7+ days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      filtered = filtered.filter(lead => 
        lead.status === 'open' && 
        new Date(lead.updated_at) < sevenDaysAgo
      );
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.first_name.toLowerCase().includes(query) ||
        lead.last_name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.fund_name.toLowerCase().includes(query) ||
        lead.manager_name.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
  };

  const isLeadStale = (lead: Lead) => {
    if (lead.status !== 'open') return false;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(lead.updated_at) < sevenDaysAgo;
  };

  const exportToCSV = () => {
    const headers = ['Lead Name', 'Email', 'Phone', 'Fund', 'Manager', 'Investment Range', 'Status', 'Created', 'Last Updated'];
    const rows = filteredLeads.map(lead => [
      `${lead.first_name} ${lead.last_name}`,
      lead.email,
      lead.phone || '',
      lead.fund_name,
      lead.manager_name,
      lead.investment_amount_range,
      lead.status,
      format(new Date(lead.created_at), 'yyyy-MM-dd'),
      format(new Date(lead.updated_at), 'yyyy-MM-dd HH:mm'),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Leads exported to CSV',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'won':
        return 'default';
      case 'closed_lost':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'text-green-600';
      case 'closed_lost':
        return 'text-red-600';
      default:
        return 'text-bronze';
    }
  };

  const handleCheckStatus = async (lead: Lead) => {
    try {
      setCheckingStatus(prev => ({ ...prev, [lead.id]: true }));
      
      const { error } = await supabase.functions.invoke('request-lead-status-check', {
        body: {
          leadId: lead.id,
          leadName: `${lead.first_name} ${lead.last_name}`,
          leadEmail: lead.email,
          leadPhone: lead.phone,
          fundId: lead.fund_id,
          fundName: lead.fund_name,
          managerName: lead.manager_name,
          currentStatus: lead.status,
          investmentRange: lead.investment_amount_range,
          createdAt: lead.created_at,
        }
      });

      if (error) throw error;

      toast({
        title: 'Status check sent',
        description: `Email sent to ${lead.fund_name} managers`,
      });
    } catch (error) {
      console.error('Error sending status check:', error);
      toast({
        title: 'Error',
        description: 'Failed to send status check email',
        variant: 'destructive',
      });
    } finally {
      setCheckingStatus(prev => ({ ...prev, [lead.id]: false }));
    }
  };

  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-3xl font-bold">{totalLeads}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Won Leads</p>
              <p className="text-3xl font-bold text-green-600">{wonLeads}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-3xl font-bold">{conversionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              placeholder="Search by name, email, fund, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="stale">Stale (7+ days)</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Fund</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Investment Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.first_name} {lead.last_name}
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || 'N/A'}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={lead.fund_name}>
                      {lead.fund_id ? (
                        lead.fund_name
                      ) : (
                        <Badge variant="outline" className="border-bronze/30 text-bronze">
                          General Enquiry
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{lead.manager_name}</TableCell>
                    <TableCell>{lead.investment_amount_range}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(lead.status)} className={getStatusColor(lead.status)}>
                          {lead.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {isLeadStale(lead) && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Stale
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(lead.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(lead.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckStatus(lead)}
                        disabled={checkingStatus[lead.id]}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {checkingStatus[lead.id] ? 'Sending...' : 'Check status'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        Showing {filteredLeads.length} of {totalLeads} total leads
      </p>
    </div>
  );
}
