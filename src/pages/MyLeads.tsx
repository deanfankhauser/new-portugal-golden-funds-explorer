import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import PageSEO from '@/components/common/PageSEO';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import FundManagerSidebar from '@/components/fund-manager/FundManagerSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Mail, Calendar, TrendingUp, Search, Download, ChevronDown, ChevronRight, Copy, Phone, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { PageLoader } from '@/components/common/LoadingSkeleton';

interface Enquiry {
  id: string;
  fund_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  investment_amount_range: string;
  interest_areas: string[];
  message: string;
  status: 'open' | 'closed_lost' | 'won';
  notes: string | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
  closed_at: string | null;
  manager_name: string | null;
  funds?: {
    name: string;
  };
}

const MyLeads = () => {
  const { user, loading: authLoading } = useEnhancedAuth();
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [companies, setCompanies] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      const { data } = await supabase.rpc('is_user_admin');
      setIsAdmin(!!data);
    };
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchAllLeads();
  }, [user, isAdmin]);

  const fetchAllLeads = async () => {
    try {
      // Get all companies user manages
      let companyNames: string[] = [];

      if (isAdmin) {
        // Admin sees all companies
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('company_name')
          .not('company_name', 'is', null);
        
        companyNames = allProfiles?.map(p => p.company_name) || [];
      } else {
        // Get user's assigned companies
        const { data: assignments } = await supabase
          .from('manager_profile_assignments')
          .select('profiles!inner(company_name)')
          .eq('user_id', user!.id)
          .eq('status', 'active');

        companyNames = assignments?.map(a => (a.profiles as any).company_name) || [];
      }

      setCompanies(companyNames);

      // Get all funds for these companies
      const allFundIds: string[] = [];
      for (const companyName of companyNames) {
        const { data: companyFunds } = await supabase.rpc('get_funds_by_company_name', {
          company_name_param: companyName
        });
        allFundIds.push(...(companyFunds?.map((f: any) => f.id) || []));
      }

      // Fetch all leads for these companies
      let query = supabase
        .from('fund_enquiries')
        .select('*, funds(name)')
        .order('created_at', { ascending: false });

      if (allFundIds.length > 0) {
        // Include fund-specific leads AND general company leads
        const companiesOr = companyNames.map(c => `and(fund_id.is.null,manager_name.eq.${c})`).join(',');
        query = query.or(`fund_id.in.(${allFundIds.join(',')}),${companiesOr}`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setEnquiries((data as any) || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (enquiryId: string, newStatus: 'open' | 'closed_lost' | 'won') => {
    try {
      const updates: any = { status: newStatus };
      
      const currentEnquiry = enquiries.find(e => e.id === enquiryId);
      if (currentEnquiry?.status === 'open' && newStatus !== 'open' && !currentEnquiry.contacted_at) {
        updates.contacted_at = new Date().toISOString();
      }
      
      if (newStatus === 'won' || newStatus === 'closed_lost') {
        updates.closed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('fund_enquiries')
        .update(updates)
        .eq('id', enquiryId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Lead marked as ${newStatus.replace('_', ' ')}`,
      });

      fetchAllLeads();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const saveNotes = async (enquiryId: string) => {
    try {
      const { error } = await supabase
        .from('fund_enquiries')
        .update({ notes: notesValue })
        .eq('id', enquiryId);

      if (error) throw error;

      toast({
        title: 'Notes Saved',
        description: 'Internal notes updated successfully',
      });

      setEditingNotes(null);
      fetchAllLeads();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard`,
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Investment Range', 'Status', 'Date', 'Message'];
    const rows = filteredEnquiries.map(e => [
      `${e.first_name} ${e.last_name}`,
      e.email,
      e.phone || 'N/A',
      e.manager_name || 'N/A',
      e.fund_id ? (e.funds?.name || 'Fund Enquiry') : 'General Company Enquiry',
      e.investment_amount_range,
      e.status,
      new Date(e.created_at).toLocaleDateString(),
      e.message.replace(/,/g, ';'),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filter and sort enquiries
  const filteredEnquiries = enquiries
    .filter(e => {
      if (filterStatus !== 'all' && e.status !== filterStatus) return false;
      if (filterCompany !== 'all' && e.manager_name !== filterCompany) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          e.first_name.toLowerCase().includes(query) ||
          e.last_name.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query) ||
          (e.manager_name && e.manager_name.toLowerCase().includes(query)) ||
          (e.funds?.name && e.funds.name.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return a.status.localeCompare(b.status);
    });

  // Calculate statistics
  const stats = {
    total: enquiries.length,
    open: enquiries.filter(e => e.status === 'open').length,
    won: enquiries.filter(e => e.status === 'won').length,
    conversion: enquiries.length > 0 ? ((enquiries.filter(e => e.status === 'won').length / enquiries.length) * 100).toFixed(1) : '0',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-bronze/10 text-bronze border-bronze/30';
      case 'won': return 'bg-success/10 text-success border-success/30';
      case 'closed_lost': return 'bg-muted text-muted-foreground border-muted-foreground/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading || loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <FundManagerSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 lg:px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold ml-4">All Leads</h1>
          </header>
          
          <PageSEO pageType="about" />
          
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Total Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">All companies</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Open Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-bronze">{stats.open}</div>
                    <p className="text-xs text-muted-foreground mt-1">Require attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Won Deals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">{stats.won}</div>
                    <p className="text-xs text-muted-foreground mt-1">Successful conversions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Conversion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.conversion}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Lead to investor</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Leads Table */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Lead Management</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">All enquiries across your managed companies</p>
                    </div>
                    <Button onClick={exportToCSV} variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, company, or fund..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterCompany} onValueChange={setFilterCompany}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="All Companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companies.map(company => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'status')}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date (Newest)</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Leads Table */}
                  {filteredEnquiries.length === 0 ? (
                    <div className="text-center py-12 border border-border/40 rounded-lg shadow-sm bg-card">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-3">No Leads Yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Leads will appear here once prospective investors enquire about your funds or companies.
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Investment Range</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEnquiries.map(enquiry => (
                            <React.Fragment key={enquiry.id}>
                              <TableRow 
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => setExpandedRow(expandedRow === enquiry.id ? null : enquiry.id)}
                              >
                                <TableCell>
                                  {expandedRow === enquiry.id ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {enquiry.first_name} {enquiry.last_name}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="h-3 w-3 text-muted-foreground" />
                                      <span className="truncate max-w-[200px]">{enquiry.email}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(enquiry.email, 'Email');
                                        }}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    {enquiry.phone && (
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        <span>{enquiry.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">{enquiry.manager_name || 'N/A'}</span>
                                </TableCell>
                                <TableCell>
                                  {enquiry.fund_id ? (
                                    <Badge variant="secondary" className="text-xs">
                                      {enquiry.funds?.name || 'Fund'}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs border-bronze/30 text-bronze flex items-center gap-1 w-fit">
                                      <Building2 className="h-3 w-3" />
                                      General
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">{enquiry.investment_amount_range}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(enquiry.status)}>
                                    {enquiry.status === 'closed_lost' ? 'Closed Lost' : enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                                </TableCell>
                              </TableRow>

                              {/* Expanded Row */}
                              {expandedRow === enquiry.id && (
                                <TableRow>
                                  <TableCell colSpan={8} className="bg-muted/30 p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Lead Details */}
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-semibold mb-2">Message</h4>
                                          <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg border">
                                            {enquiry.message}
                                          </p>
                                        </div>
                                        
                                        {enquiry.interest_areas && enquiry.interest_areas.length > 0 && (
                                          <div>
                                            <h4 className="font-semibold mb-2">Interest Areas</h4>
                                            <div className="flex flex-wrap gap-2">
                                              {enquiry.interest_areas.map((area, idx) => (
                                                <Badge key={idx} variant="secondary">{area}</Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        <div>
                                          <h4 className="font-semibold mb-2">Timeline</h4>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                              <Calendar className="h-4 w-4 text-muted-foreground" />
                                              <span>Created: {new Date(enquiry.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {enquiry.contacted_at && (
                                              <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>Contacted: {new Date(enquiry.contacted_at).toLocaleDateString()}</span>
                                              </div>
                                            )}
                                            {enquiry.closed_at && (
                                              <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>Closed: {new Date(enquiry.closed_at).toLocaleDateString()}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Status & Notes */}
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-semibold mb-3">Lead Status</h4>
                                          <RadioGroup 
                                            value={enquiry.status} 
                                            onValueChange={(value) => updateStatus(enquiry.id, value as any)}
                                          >
                                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                                              <RadioGroupItem value="open" id={`open-${enquiry.id}`} />
                                              <label htmlFor={`open-${enquiry.id}`} className="flex-1 cursor-pointer">
                                                <div className="font-medium">Open</div>
                                                <div className="text-xs text-muted-foreground">New lead requiring attention</div>
                                              </label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                                              <RadioGroupItem value="won" id={`won-${enquiry.id}`} />
                                              <label htmlFor={`won-${enquiry.id}`} className="flex-1 cursor-pointer">
                                                <div className="font-medium text-success">Won</div>
                                                <div className="text-xs text-muted-foreground">Successfully converted to investor</div>
                                              </label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                                              <RadioGroupItem value="closed_lost" id={`closed-${enquiry.id}`} />
                                              <label htmlFor={`closed-${enquiry.id}`} className="flex-1 cursor-pointer">
                                                <div className="font-medium text-muted-foreground">Closed Lost</div>
                                                <div className="text-xs text-muted-foreground">Did not convert</div>
                                              </label>
                                            </div>
                                          </RadioGroup>
                                        </div>

                                        <div>
                                          <h4 className="font-semibold mb-2">Internal Notes</h4>
                                          {editingNotes === enquiry.id ? (
                                            <div className="space-y-2">
                                              <Textarea
                                                value={notesValue}
                                                onChange={(e) => setNotesValue(e.target.value)}
                                                placeholder="Add internal notes about this lead..."
                                                className="min-h-[100px]"
                                              />
                                              <div className="flex gap-2">
                                                <Button size="sm" onClick={() => saveNotes(enquiry.id)}>Save</Button>
                                                <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)}>Cancel</Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              onClick={() => {
                                                setEditingNotes(enquiry.id);
                                                setNotesValue(enquiry.notes || '');
                                              }}
                                              className="text-sm p-3 rounded-lg border bg-background cursor-pointer hover:border-primary/40 transition-colors min-h-[100px]"
                                            >
                                              {enquiry.notes || <span className="text-muted-foreground italic">Click to add notes...</span>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MyLeads;
