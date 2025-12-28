import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Search, Eye, Check, X, Loader2, ExternalLink } from 'lucide-react';

interface FundSubmission {
  id: string;
  company_name: string;
  fund_name: string;
  contact_name: string;
  category: string;
  status: string;
  created_at: string;
  company_logo_url: string;
  user_id: string;
}

export function FundSubmissionsManagement() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['fund-submissions', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('fund_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FundSubmission[];
    },
  });

  const processMutation = useMutation({
    mutationFn: async ({ action, submissionId, reason }: { action: 'approve' | 'reject'; submissionId: string; reason?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const response = await supabase.functions.invoke('process-fund-submission', {
        body: { submissionId, action, rejectionReason: reason, adminUserId: user?.id },
      });
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fund-submissions'] });
      toast.success(variables.action === 'approve' ? 'Submission approved!' : 'Submission rejected');
      setShowDetailModal(false);
      setShowRejectModal(false);
      setSelectedSubmission(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const filteredSubmissions = submissions?.filter(s =>
    s.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fund_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = {
    pending: submissions?.filter(s => s.status === 'pending').length || 0,
    approved: submissions?.filter(s => s.status === 'approved').length || 0,
    rejected: submissions?.filter(s => s.status === 'rejected').length || 0,
  };

  const handleApprove = () => {
    if (selectedSubmission) {
      processMutation.mutate({ action: 'approve', submissionId: selectedSubmission.id });
    }
  };

  const handleReject = () => {
    if (selectedSubmission && rejectionReason) {
      processMutation.mutate({ action: 'reject', submissionId: selectedSubmission.id, reason: rejectionReason });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fund Submissions</h1>
        <div className="flex gap-2">
          <Badge variant="outline">{statusCounts.pending} Pending</Badge>
          <Badge variant="secondary">{statusCounts.approved} Approved</Badge>
          <Badge variant="destructive">{statusCounts.rejected} Rejected</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Fund</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions?.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {submission.company_logo_url && (
                          <img src={submission.company_logo_url} alt="" className="h-8 w-8 rounded object-contain bg-white border" />
                        )}
                        <span className="font-medium">{submission.company_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{submission.fund_name}</TableCell>
                    <TableCell>{submission.contact_name}</TableCell>
                    <TableCell>{submission.category}</TableCell>
                    <TableCell>{format(new Date(submission.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={
                        submission.status === 'pending' ? 'outline' :
                        submission.status === 'approved' ? 'default' : 'destructive'
                      }>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedSubmission(submission); setShowDetailModal(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Company</Label><p className="font-medium">{selectedSubmission.company_name}</p></div>
                <div><Label className="text-muted-foreground">Fund</Label><p className="font-medium">{selectedSubmission.fund_name}</p></div>
                <div><Label className="text-muted-foreground">Contact</Label><p>{selectedSubmission.contact_name} ({selectedSubmission.contact_role})</p></div>
                <div><Label className="text-muted-foreground">Category</Label><p>{selectedSubmission.category}</p></div>
                <div><Label className="text-muted-foreground">Min Investment</Label><p>€{selectedSubmission.minimum_investment?.toLocaleString()}</p></div>
                <div><Label className="text-muted-foreground">GV Eligible</Label><p>{selectedSubmission.gv_eligible ? 'Yes' : 'No'}</p></div>
              </div>
              <div><Label className="text-muted-foreground">Description</Label><p className="text-sm mt-1">{selectedSubmission.fund_description}</p></div>
            </div>
          )}
          <DialogFooter>
            {selectedSubmission?.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => { setShowRejectModal(true); setShowDetailModal(false); }}>
                  <X className="h-4 w-4 mr-2" />Reject
                </Button>
                <Button onClick={handleApprove} disabled={processMutation.isPending}>
                  {processMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>Please provide a reason for rejection.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason || processMutation.isPending}>
              {processMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
