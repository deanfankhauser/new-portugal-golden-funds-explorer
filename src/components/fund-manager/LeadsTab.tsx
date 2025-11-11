import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Mail, Calendar, TrendingUp, Search, Download, ChevronDown, ChevronRight, Copy, Phone, Edit2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface LeadsTabProps {
  fundId: string;
}

interface Enquiry {
  id: string;
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
}

const LeadsTab: React.FC<LeadsTabProps> = ({ fundId }) => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');

  useEffect(() => {
    fetchEnquiries();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('fund_enquiries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fund_enquiries',
          filter: `fund_id=eq.${fundId}`,
        },
        () => {
          fetchEnquiries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fundId]);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_enquiries')
        .select('*')
        .eq('fund_id', fundId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries((data as any) || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load enquiries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (enquiryId: string, newStatus: 'open' | 'closed_lost' | 'won') => {
    try {
      const updates: any = { status: newStatus };
      
      // Set contacted_at if moving from open to another status
      const currentEnquiry = enquiries.find(e => e.id === enquiryId);
      if (currentEnquiry?.status === 'open' && newStatus !== 'open' && !currentEnquiry.contacted_at) {
        updates.contacted_at = new Date().toISOString();
      }
      
      // Set closed_at if marking as won or closed_lost
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

      fetchEnquiries();
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
      fetchEnquiries();
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
    const headers = ['Name', 'Email', 'Phone', 'Investment Range', 'Status', 'Date', 'Message'];
    const rows = filteredEnquiries.map(e => [
      `${e.first_name} ${e.last_name}`,
      e.email,
      e.phone || 'N/A',
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
    a.download = `leads-${fundId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filter and sort enquiries
  const filteredEnquiries = enquiries
    .filter(e => {
      if (filterStatus !== 'all' && e.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          e.first_name.toLowerCase().includes(query) ||
          e.last_name.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <p className="text-xs text-muted-foreground mt-1">All time</p>
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

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>Manage enquiries and track conversion</CardDescription>
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <div className="text-center py-12 border rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Leads Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Leads will appear here once prospective investors enquire about your fund.
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
                              <span>{enquiry.email}</span>
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
                          <Badge variant="outline">{enquiry.investment_amount_range}</Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <RadioGroup
                            value={enquiry.status}
                            onValueChange={(value) => updateStatus(enquiry.id, value as any)}
                            className="flex gap-2"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="open" id={`${enquiry.id}-open`} />
                              <Label htmlFor={`${enquiry.id}-open`} className="text-xs cursor-pointer">Open</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="won" id={`${enquiry.id}-won`} />
                              <Label htmlFor={`${enquiry.id}-won`} className="text-xs cursor-pointer">Won</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="closed_lost" id={`${enquiry.id}-lost`} />
                              <Label htmlFor={`${enquiry.id}-lost`} className="text-xs cursor-pointer">Lost</Label>
                            </div>
                          </RadioGroup>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expandable Details */}
                      {expandedRow === enquiry.id && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/30">
                            <div className="p-4 space-y-4">
                              {/* Interest Areas */}
                              <div>
                                <Label className="text-sm font-semibold mb-2 block">Interest Areas</Label>
                                <div className="flex flex-wrap gap-2">
                                  {enquiry.interest_areas.map(area => (
                                    <Badge key={area} variant="secondary">{area}</Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Message */}
                              <div>
                                <Label className="text-sm font-semibold mb-2 block">Message</Label>
                                <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border">
                                  {enquiry.message}
                                </p>
                              </div>

                              {/* Internal Notes */}
                              <div>
                                <Label className="text-sm font-semibold mb-2 block">Internal Notes</Label>
                                {editingNotes === enquiry.id ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={notesValue}
                                      onChange={e => setNotesValue(e.target.value)}
                                      placeholder="Add internal notes (not visible to prospect)"
                                      rows={3}
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => saveNotes(enquiry.id)}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Save
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-2">
                                    <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border flex-1">
                                      {enquiry.notes || 'No notes yet'}
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingNotes(enquiry.id);
                                        setNotesValue(enquiry.notes || '');
                                      }}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Timeline */}
                              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                                <div>Created: {new Date(enquiry.created_at).toLocaleString()}</div>
                                {enquiry.contacted_at && (
                                  <div>Contacted: {new Date(enquiry.contacted_at).toLocaleString()}</div>
                                )}
                                {enquiry.closed_at && (
                                  <div>Closed: {new Date(enquiry.closed_at).toLocaleString()}</div>
                                )}
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
  );
};

export default LeadsTab;
