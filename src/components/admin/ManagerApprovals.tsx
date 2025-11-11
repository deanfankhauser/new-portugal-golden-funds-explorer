import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Building2, Calendar, Mail, Globe, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PendingProfile {
  id: string;
  user_id: string;
  email: string;
  company_name: string;
  manager_name: string;
  description?: string;
  website?: string;
  registration_number?: string;
  license_number?: string;
  logo_url?: string;
  city?: string;
  country?: string;
  founded_year?: number;
  assets_under_management?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const ManagerApprovals: React.FC = () => {
  const { toast } = useToast();
  const [pendingProfiles, setPendingProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<PendingProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const fetchPendingProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_pending_manager_profiles');
      
      if (error) throw error;
      
      setPendingProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching pending profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending manager profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profile: PendingProfile) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('admin_approve_manager_profile', {
        p_profile_id: profile.id,
        p_admin_notes: `Approved by admin at ${new Date().toISOString()}`,
      });

      if (error) throw error;

      // Send approval email
      await supabase.functions.invoke('notify-manager-approval', {
        body: {
          profile_id: profile.id,
          company_name: profile.company_name,
          manager_name: profile.manager_name,
          email: profile.email,
          approved: true,
        },
      });

      toast({
        title: 'Manager Approved',
        description: `${profile.company_name} has been approved and notified`,
      });

      fetchPendingProfiles();
    } catch (error: any) {
      console.error('Error approving manager:', error);
      toast({
        title: 'Approval Failed',
        description: error.message || 'Failed to approve manager profile',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProfile || !rejectionReason.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a rejection reason',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('admin_reject_manager_profile', {
        p_profile_id: selectedProfile.id,
        p_rejection_reason: rejectionReason,
      });

      if (error) throw error;

      // Send rejection email
      await supabase.functions.invoke('notify-manager-approval', {
        body: {
          profile_id: selectedProfile.id,
          company_name: selectedProfile.company_name,
          manager_name: selectedProfile.manager_name,
          email: selectedProfile.email,
          approved: false,
          rejection_reason: rejectionReason,
        },
      });

      toast({
        title: 'Manager Rejected',
        description: `${selectedProfile.company_name} has been notified of the rejection`,
      });

      setSelectedProfile(null);
      setRejectionReason('');
      fetchPendingProfiles();
    } catch (error: any) {
      console.error('Error rejecting manager:', error);
      toast({
        title: 'Rejection Failed',
        description: error.message || 'Failed to reject manager profile',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div>Loading pending manager profiles...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Pending Manager Approvals
          </CardTitle>
          <CardDescription>
            Review and approve manager profiles to list them on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingProfiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending manager profiles
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {profile.logo_url && (
                          <img
                            src={profile.logo_url}
                            alt={profile.company_name}
                            className="h-8 w-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{profile.company_name}</div>
                          {profile.website && (
                            <a
                              href={profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{profile.manager_name}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {profile.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {profile.city && profile.country
                        ? `${profile.city}, ${profile.country}`
                        : profile.country || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(profile)}
                          disabled={processing}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setSelectedProfile(profile)}
                              disabled={processing}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Manager Profile</DialogTitle>
                              <DialogDescription>
                                Provide a reason for rejecting {profile.company_name}. This will be sent to the manager.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Rejection Reason</Label>
                                <Textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="Please provide a clear reason for the rejection..."
                                  rows={4}
                                  className="mt-2"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProfile(null);
                                    setRejectionReason('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleReject}
                                  disabled={!rejectionReason.trim() || processing}
                                >
                                  Reject Manager
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{pendingProfiles.length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">-</div>
              <div className="text-sm text-muted-foreground">Approved Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">-</div>
              <div className="text-sm text-muted-foreground">Rejected Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};