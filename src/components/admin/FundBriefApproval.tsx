import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Loader2, 
  FileText,
  User,
  Calendar 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

interface BriefSubmission {
  id: string;
  fund_id: string;
  user_id: string;
  brief_url: string;
  brief_filename: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  // Joined data
  fund_name?: string;
  submitter_name?: string;
  submitter_email?: string;
}

const FundBriefApproval: React.FC = () => {
  const [submissions, setSubmissions] = useState<BriefSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const { user, session } = useEnhancedAuth();

  const fetchSubmissions = async () => {
    console.log('FundBriefApproval: fetchSubmissions called, user:', user?.id);
    try {
      const { data, error } = await supabase
        .from('fund_brief_submissions')
        .select(`
          *,
          funds!inner(name),
          manager_profiles!left!manager_user_id(manager_name, email),
          investor_profiles!left!investor_user_id(first_name, last_name, email)
        `)
        .order('submitted_at', { ascending: false });

      console.log('FundBriefApproval: Query result:', { data, error });

      if (error) throw error;

      // Transform the data to flatten joined fields
      const transformedData = data?.map((item: any) => ({
        ...item,
        fund_name: item.funds?.name || 'Unknown Fund',
        submitter_name: item.manager_profiles?.manager_name || 
                       `${item.investor_profiles?.first_name || ''} ${item.investor_profiles?.last_name || ''}`.trim() ||
                       'Unknown User',
        submitter_email: item.manager_profiles?.email || item.investor_profiles?.email || ''
      })) as BriefSubmission[];

      console.log('FundBriefApproval: Transformed data:', transformedData);
      setSubmissions(transformedData || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load fund brief submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchSubmissions();
  }, [user?.id]);

  const handleApprove = async (submission: BriefSubmission) => {
    if (!user) return;

    setProcessing(submission.id);
    try {
      // Move file from pending to approved bucket
      const fileName = submission.brief_filename.split('/').pop() || submission.brief_filename;
      const approvedFileName = `${submission.fund_id}-fund-brief-approved-${Date.now()}.pdf`;

      // Download from pending bucket
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('fund-briefs-pending')
        .download(submission.brief_filename);

      if (downloadError) throw downloadError;

      // Upload to approved bucket
      const { error: uploadError } = await supabase.storage
        .from('fund-briefs')
        .upload(approvedFileName, fileData, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the new public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fund-briefs')
        .getPublicUrl(approvedFileName);

      // Update fund with the new brief URL
      const { error: fundUpdateError } = await supabase
        .from('funds')
        .update({ fund_brief_url: publicUrl })
        .eq('id', submission.fund_id);

      if (fundUpdateError) throw fundUpdateError;

      // Update submission status
      const { error: submissionUpdateError } = await supabase
        .from('fund_brief_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', submission.id);

      if (submissionUpdateError) throw submissionUpdateError;

      // Delete from pending bucket
      await supabase.storage
        .from('fund-briefs-pending')
        .remove([submission.brief_filename]);

      toast.success('Fund brief approved and made active');
      fetchSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
      toast.error('Failed to approve fund brief');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (submission: BriefSubmission) => {
    if (!user) return;

    const reason = rejectionReason[submission.id];
    if (!reason?.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessing(submission.id);
    try {
      // Update submission status
      const { error } = await supabase
        .from('fund_brief_submissions')
        .update({
          status: 'rejected',
          rejection_reason: reason.trim(),
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', submission.id);

      if (error) throw error;

      // Delete from pending bucket
      await supabase.storage
        .from('fund-briefs-pending')
        .remove([submission.brief_filename]);

      toast.success('Fund brief rejected');
      setRejectionReason(prev => ({ ...prev, [submission.id]: '' }));
      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error('Failed to reject fund brief');
    } finally {
      setProcessing(null);
    }
  };

  const downloadBrief = async (submission: BriefSubmission) => {
    try {
      const { data, error } = await supabase.storage
        .from('fund-briefs-pending')
        .download(submission.brief_filename);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${submission.fund_name}-fund-brief.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download fund brief');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Fund Brief Submissions
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchSubmissions}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No fund brief submissions found
            </p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(submission.status)}>
                            {getStatusIcon(submission.status)}
                            <span className="ml-1 capitalize">{submission.status}</span>
                          </Badge>
                          <h3 className="font-semibold">{submission.fund_name}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{submission.submitter_name}</span>
                            {submission.submitter_email && (
                              <span className="text-xs">({submission.submitter_email})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {submission.rejection_reason && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Rejection Reason:</strong> {submission.rejection_reason}
                            </p>
                          </div>
                        )}

                        {submission.status === 'pending' && (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`rejection-${submission.id}`}>
                                Rejection Reason (if rejecting)
                              </Label>
                              <Textarea
                                id={`rejection-${submission.id}`}
                                placeholder="Enter reason for rejection..."
                                value={rejectionReason[submission.id] || ''}
                                onChange={(e) => setRejectionReason(prev => ({
                                  ...prev,
                                  [submission.id]: e.target.value
                                }))}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadBrief(submission)}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>

                        {submission.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(submission)}
                              disabled={processing === submission.id}
                              className="gap-2"
                            >
                              {processing === submission.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(submission)}
                              disabled={processing === submission.id}
                              className="gap-2"
                            >
                              {processing === submission.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FundBriefApproval;