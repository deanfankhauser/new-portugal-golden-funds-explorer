import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface FundBriefSubmissionProps {
  fundId: string;
  fundName: string;
  currentBriefUrl?: string;
  onSubmissionSuccess?: () => void;
}

interface BriefSubmission {
  id: string;
  brief_url: string;
  brief_filename: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
}

const FundBriefSubmission: React.FC<FundBriefSubmissionProps> = ({
  fundId,
  fundName,
  currentBriefUrl,
  onSubmissionSuccess,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submissions, setSubmissions] = useState<BriefSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed for fund briefs';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const fetchSubmissions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('fund_brief_submissions')
        .select('*')
        .eq('fund_id', fundId)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data as BriefSubmission[]) || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [fundId, user]);

  const submitBrief = async (file: File) => {
    console.log('submitBrief called with file:', file.name, file.type, file.size);
    const validation = validateFile(file);
    if (validation) {
      console.log('File validation failed:', validation);
      toast.error(validation);
      return;
    }

    if (!user) {
      console.log('User not authenticated:', user);
      toast.error('You must be logged in to submit a fund brief');
      return;
    }

    console.log('Starting upload for user:', user.id, 'fund:', fundId);
    setUploading(true);
    try {
      // Create unique filename with user folder structure
      const fileExt = 'pdf';
      const fileName = `${user.id}/${fundId}-fund-brief-${Date.now()}.${fileExt}`;

      // Upload to pending bucket
      console.log('Uploading file:', fileName);
      const { data, error } = await supabase.storage
        .from('fund-briefs-pending')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
      console.log('Upload successful:', data);

      // Create a signed URL (valid for 7 days) since the bucket is private
      const { data: signedUrlData, error: signError } = await supabase.storage
        .from('fund-briefs-pending')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7);
      if (signError) {
        console.error('Signed URL error:', signError);
      }
      const publicUrl = signedUrlData?.signedUrl || '';

      // Create submission record
      console.log('Creating submission record with:', { fund_id: fundId, user_id: user.id, brief_url: publicUrl, brief_filename: fileName });
      const { error: submissionError } = await supabase
        .from('fund_brief_submissions')
        .insert({
          fund_id: fundId,
          user_id: user.id,
          brief_url: publicUrl,
          brief_filename: fileName,
          status: 'pending'
        });

      if (submissionError) {
        console.error('Submission record error:', submissionError);
        throw submissionError;
      }
      console.log('Submission record created successfully');

      toast.success('Fund brief submitted for admin approval');
      fetchSubmissions(); // Refresh the list
      onSubmissionSuccess?.(); // Notify parent component
    } catch (error) {
      console.error('Error submitting fund brief:', error);
      toast.error('Failed to submit fund brief');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      submitBrief(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      submitBrief(files[0]);
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
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Fund Brief Document</Label>
            <p className="text-sm text-muted-foreground">
              Submit a PDF fund brief for admin approval. Once approved, it will be available for investor requests.
            </p>
          </div>

          {/* Current Approved Brief */}
          {currentBriefUrl && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Current Approved Fund Brief</p>
                <p className="text-xs text-green-600">
                  Active and available for investor distribution
                </p>
              </div>
            </div>
          )}

          {/* Previous Submissions */}
          {submissions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Recent Submissions</Label>
              {submissions.slice(0, 3).map((submission) => (
                <div
                  key={submission.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg ${getStatusColor(submission.status)}`}
                >
                  {getStatusIcon(submission.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{getStatusText(submission.status)}</p>
                    <p className="text-xs opacity-75">
                      Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                      {submission.reviewed_at && ` • Reviewed ${new Date(submission.reviewed_at).toLocaleDateString()}`}
                    </p>
                    {submission.rejection_reason && (
                      <p className="text-xs mt-1 font-medium">
                        Reason: {submission.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Submitting fund brief...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drop your PDF here or{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={() => document.getElementById('brief-upload')?.click()}
                    >
                      browse files
                    </Button>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF only, max 10MB
                  </p>
                </div>
              </div>
            )}
            <input
              id="brief-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Usage Guidelines */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Fund briefs require admin approval before becoming active</p>
            <p>• You'll be notified when your submission is reviewed</p>
            <p>• Only approved briefs will be sent to investors</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundBriefSubmission;