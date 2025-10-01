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
  Calendar,
  Trash2
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
      // 1) Fetch base submissions without any joins (avoids PostgREST relationship issues)
      const { data: baseRows, error: baseError } = await supabase
        .from('fund_brief_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (baseError) {
        console.error('FundBriefApproval: base fetch error', baseError);
        throw baseError;
      }

      const rows = baseRows || [];
      console.log('FundBriefApproval: base rows count', rows.length);

      if (rows.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      // 2) Collect related IDs
      const fundIds = Array.from(new Set(rows.map(r => r.fund_id).filter(Boolean)));
      const managerIds = Array.from(new Set(rows.map(r => r.manager_user_id).filter(Boolean)));
      const investorIds = Array.from(new Set(rows.map(r => r.investor_user_id).filter(Boolean)));

      // 3) Fetch related data (sequential to satisfy TS types)
      let fundsRes: any = { data: [], error: null };
      let managersRes: any = { data: [], error: null };
      let investorsRes: any = { data: [], error: null };

      if (fundIds.length) {
        fundsRes = await supabase.from('funds').select('id, name').in('id', fundIds);
      }
      if (managerIds.length) {
        managersRes = await supabase
          .from('manager_profiles')
          .select('user_id, manager_name, email')
          .in('user_id', managerIds);
      }
      if (investorIds.length) {
        investorsRes = await supabase
          .from('investor_profiles')
          .select('user_id, first_name, last_name, email')
          .in('user_id', investorIds);
      }

      if (fundsRes.error) console.warn('FundBriefApproval: funds fetch error', fundsRes.error);
      if (managersRes.error) console.warn('FundBriefApproval: managers fetch error', managersRes.error);
      if (investorsRes.error) console.warn('FundBriefApproval: investors fetch error', investorsRes.error);

      // 4) Build lookup maps
      const fundMap = new Map<string, string>();
      (fundsRes.data || []).forEach((f: any) => fundMap.set(f.id, f.name));

      const managerMap = new Map<string, { name: string; email?: string }>();
      (managersRes.data || []).forEach((m: any) => managerMap.set(m.user_id, { name: m.manager_name, email: m.email }));

      const investorMap = new Map<string, { name: string; email?: string }>();
      (investorsRes.data || []).forEach((i: any) =>
        investorMap.set(i.user_id, { name: `${i.first_name || ''} ${i.last_name || ''}`.trim(), email: i.email })
      );

      // 5) Transform rows for UI
      const transformed: BriefSubmission[] = rows.map((r: any) => {
        const manager = r.manager_user_id ? managerMap.get(r.manager_user_id) : undefined;
        const investor = r.investor_user_id ? investorMap.get(r.investor_user_id) : undefined;
        return {
          ...r,
          fund_name: fundMap.get(r.fund_id) || 'Unknown Fund',
          submitter_name: manager?.name || investor?.name || 'Unknown User',
          submitter_email: manager?.email || investor?.email || ''
        } as BriefSubmission;
      });

      console.log('FundBriefApproval: transformed rows', transformed.length);
      setSubmissions(transformed);
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
    if (!user) {
      toast.error('You must be logged in as admin to approve briefs');
      return;
    }

    console.log('🟢 Starting approval process for submission:', submission.id, 'fund:', submission.fund_id);
    setProcessing(submission.id);
    
    try {
      // Move file from pending to approved bucket
      const fileName = submission.brief_filename.split('/').pop() || submission.brief_filename;
      const approvedFileName = `${submission.fund_id}-fund-brief-approved-${Date.now()}.pdf`;
      console.log('📁 File names:', { fileName, approvedFileName });

      // Download from pending bucket
      console.log('⬇️ Downloading from pending bucket...');
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('fund-briefs-pending')
        .download(submission.brief_filename);

      if (downloadError) {
        console.error('❌ Download error:', downloadError);
        throw new Error(`Failed to download file: ${downloadError.message}`);
      }
      console.log('✅ File downloaded successfully');

      // Upload to approved bucket
      console.log('⬆️ Uploading to approved bucket...');
      const { error: uploadError } = await supabase.storage
        .from('fund-briefs')
        .upload(approvedFileName, fileData, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }
      console.log('✅ File uploaded successfully');

      // Get the new public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fund-briefs')
        .getPublicUrl(approvedFileName);
      console.log('🔗 Generated public URL:', publicUrl);

      // CRITICAL: Update fund with the new brief URL
      console.log('💾 Updating fund record with brief URL...');
      const { data: fundUpdateData, error: fundUpdateError } = await supabase
        .from('funds')
        .update({ fund_brief_url: publicUrl })
        .eq('id', submission.fund_id)
        .select();

      if (fundUpdateError) {
        console.error('❌ Fund update error:', fundUpdateError);
        throw new Error(`Failed to update fund: ${fundUpdateError.message}`);
      }
      console.log('✅ Fund record updated:', fundUpdateData);

      // Update submission status
      console.log('📝 Updating submission status...');
      const { data: submissionUpdateData, error: submissionUpdateError } = await supabase
        .from('fund_brief_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', submission.id)
        .select();

      if (submissionUpdateError) {
        console.error('❌ Submission update error:', submissionUpdateError);
        throw new Error(`Failed to update submission: ${submissionUpdateError.message}`);
      }
      console.log('✅ Submission updated:', submissionUpdateData);

      // Send approval notification email
      try {
        await supabase.functions.invoke('notify-brief-decision', {
          body: {
            submissionId: submission.id,
            fundName: submission.fund_name,
            fundId: submission.fund_id,
            decision: 'approved',
            submitterEmail: submission.submitter_email,
            submitterName: submission.submitter_name
          }
        });
      } catch (emailError) {
        console.error('⚠️ Failed to send approval email (non-critical):', emailError);
      }

      // Delete from pending bucket
      console.log('🗑️ Deleting from pending bucket...');
      await supabase.storage
        .from('fund-briefs-pending')
        .remove([submission.brief_filename]);

      // Dispatch event to trigger fund data refresh across the app
      window.dispatchEvent(new CustomEvent('fund-brief-approved', { 
        detail: { fundId: submission.fund_id, briefUrl: publicUrl }
      }));
      console.log('✅ Approval process completed successfully');

      toast.success('Fund brief approved and activated! Page will refresh...');
      
      // Refresh submissions list
      await fetchSubmissions();
      
      // Force page reload to ensure all components see the update
      setTimeout(() => window.location.reload(), 1500);
      
    } catch (error: any) {
      console.error('❌ APPROVAL FAILED:', error);
      toast.error(error.message || 'Failed to approve fund brief. Check console for details.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (submission: BriefSubmission) => {
    if (!user) return;

    const rawReason = rejectionReason[submission.id];
    const reason = (rawReason && rawReason.trim()) ? rawReason.trim() : 'Rejected by admin';
    console.log('Reject button clicked for submission:', submission.id, 'reason:', reason);
    
    // Proceed even if no explicit reason was provided to avoid blocking the action


    setProcessing(submission.id);
    try {
      console.log('Starting rejection process for submission:', submission.id);
      
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

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database updated successfully, now deleting file:', submission.brief_filename);

      // Delete from pending bucket
      const { error: storageError } = await supabase.storage
        .from('fund-briefs-pending')
        .remove([submission.brief_filename]);

      if (storageError) {
        console.warn('Storage deletion error (non-critical):', storageError);
      }

      // Send rejection notification email
      try {
        await supabase.functions.invoke('notify-brief-decision', {
          body: {
            submissionId: submission.id,
            fundName: submission.fund_name,
            fundId: submission.fund_id,
            decision: 'rejected',
            rejectionReason: reason,
            submitterEmail: submission.submitter_email,
            submitterName: submission.submitter_name
          }
        });
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't throw - email failure shouldn't stop the rejection process
      }

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

  const handleDelete = async (submission: BriefSubmission) => {
    if (!user) return;

    setProcessing(submission.id);
    try {
      // Delete from database
      const { error: deleteError } = await supabase
        .from('fund_brief_submissions')
        .delete()
        .eq('id', submission.id);

      if (deleteError) throw deleteError;

      // Delete file from storage based on status
      const bucket = submission.status === 'approved' ? 'fund-briefs' : 'fund-briefs-pending';
      await supabase.storage
        .from(bucket)
        .remove([submission.brief_filename]);

      // If approved brief, also remove fund_brief_url from fund
      if (submission.status === 'approved') {
        await supabase
          .from('funds')
          .update({ fund_brief_url: null })
          .eq('id', submission.fund_id);
      }

      toast.success('Fund brief deleted successfully');
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete fund brief');
    } finally {
      setProcessing(null);
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('Refresh button clicked');
              setLoading(true);
              fetchSubmissions();
            }}
          >
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
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(submission)}
                          disabled={processing === submission.id}
                          className="gap-2"
                        >
                          {processing === submission.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </Button>
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