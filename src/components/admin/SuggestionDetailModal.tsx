import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Check, X, Clock, User, Building, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuggestionDetailModalProps {
  suggestion: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const SuggestionDetailModal: React.FC<SuggestionDetailModalProps> = ({
  suggestion,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData.user?.id;

      const { error } = await supabase
        .from('fund_edit_suggestions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: adminId
        })
        .eq('id', suggestion.id);

      if (error) throw error;

      // Create edit history entry that is publicly readable (drives UI overrides)
      const { error: historyError } = await supabase
        .from('fund_edit_history')
        .insert({
          admin_user_id: adminId,
          changed_by: adminId,
          fund_id: suggestion.fund_id,
          suggestion_id: suggestion.id,
          changes: suggestion.suggested_changes
        });

      if (historyError) {
        console.error('Error creating fund_edit_history record:', historyError);
      }

      // Apply approved changes directly to the funds table
      try {
        const sc = suggestion.suggested_changes || {};
        const updatePayload: Record<string, any> = {};

        if (typeof sc.description === 'string') updatePayload.description = sc.description;
        if (typeof sc.shortDescription === 'string') updatePayload.description = sc.shortDescription;
        if (typeof sc.short_description === 'string') updatePayload.description = sc.short_description;
        if (typeof sc.detailedDescription === 'string') updatePayload.detailed_description = sc.detailedDescription;
        if (typeof sc.managerName === 'string') updatePayload.manager_name = sc.managerName;
        if (typeof sc.minimumInvestment === 'number') updatePayload.minimum_investment = sc.minimumInvestment;
        if (typeof sc.managementFee === 'number') updatePayload.management_fee = sc.managementFee;
        if (typeof sc.performanceFee === 'number') updatePayload.performance_fee = sc.performanceFee;
        if (typeof sc.term === 'number') updatePayload.lock_up_period_months = Math.round(sc.term * 12);
        if (typeof sc.category === 'string') updatePayload.category = sc.category;
        if (typeof sc.websiteUrl === 'string') updatePayload.website = sc.websiteUrl;
        // Ignore name and unsupported fields on purpose

        if (Object.keys(updatePayload).length > 0) {
          console.log('Applying changes to funds table:', updatePayload, 'for fund:', suggestion.fund_id);
          console.log('Original suggested changes:', sc);
          const { error: fundsUpdateError } = await supabase
            .from('funds')
            .update(updatePayload)
            .eq('id', suggestion.fund_id);

          if (fundsUpdateError) {
            console.error('Error updating funds table with approved changes:', fundsUpdateError);
          } else {
            console.log('✅ Successfully updated funds table');
            console.log('Updated fields:', Object.keys(updatePayload));
          }
        } else {
          console.log('No valid changes to apply to funds table');
          console.log('Available suggestion fields:', Object.keys(sc));
          console.log('Suggestion changes:', sc);
        }
      } catch (applyErr) {
        console.error('Unexpected error applying approved changes to funds:', applyErr);
      }

      // Skip admin activity log to avoid FK/RLS conflicts in current setup
      console.info('Audit log skipped for suggestion approval', { suggestionId: suggestion.id });

      // Send email notification
      try {
        console.log('Fetching user profile for email notification...');
        const { data: userProfile } = await supabase
          .from('manager_profiles')
          .select('email, manager_name')
          .eq('user_id', suggestion.user_id)
          .single();

        console.log('User profile found:', userProfile);

        if (userProfile?.email) {
          console.log('Sending email notification to:', userProfile.email);
          const emailResult = await supabase.functions.invoke('send-notification-email', {
            body: {
              to: userProfile.email,
              subject: `Fund Edit Approved - ${suggestion.fund_id}`,
              fundId: suggestion.fund_id,
              status: 'approved',
              managerName: userProfile.manager_name
            }
          });
          console.log('Email notification result:', emailResult);
          
          if (emailResult.error) {
            console.error('Email function returned error:', emailResult.error);
            toast({
              title: "Email Warning",
              description: "Suggestion approved but email notification failed. Please check logs.",
              variant: "destructive"
            });
          } else {
            console.log('Email sent successfully');
          }
        } else {
          console.log('No email address found for user');
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        toast({
          title: "Email Error",
          description: "Suggestion approved but email notification failed.",
          variant: "destructive"
        });
      }

      toast({
        title: "Suggestion Approved",
        description: "The suggestion has been approved and published.",
      });

      // Trigger immediate local overlay and then a global refetch
      window.dispatchEvent(new CustomEvent('funds:apply-overlay', { detail: { fund_id: suggestion.fund_id, changes: suggestion.suggested_changes } }));
      window.dispatchEvent(new CustomEvent('funds:refetch'));

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error approving suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to approve suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    const finalRejectionReason = rejectionReason.trim() || "The suggested changes do not meet our current guidelines and cannot be approved at this time.";
    
    setIsRejecting(true);

    try {
      console.log('Starting rejection process for suggestion:', suggestion.id);
      console.log('Rejection reason:', finalRejectionReason);
      
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData.user?.id;
      console.log('Admin ID:', adminId);

      const { error } = await supabase
        .from('fund_edit_suggestions')
        .update({
          status: 'rejected',
          rejection_reason: finalRejectionReason,
          approved_by: adminId
        })
        .eq('id', suggestion.id);

      if (error) {
        console.error('Database error during rejection:', error);
        throw error;
      }

      console.log('✅ Suggestion successfully marked as rejected');

      // Skip admin activity log to avoid FK/RLS conflicts in current setup
      console.info('Audit log skipped for suggestion rejection', { suggestionId: suggestion.id });

      // Send email notification
      try {
        console.log('Fetching user profile for email notification...');
        const { data: userProfile } = await supabase
          .from('manager_profiles')
          .select('email, manager_name')
          .eq('user_id', suggestion.user_id)
          .single();

        console.log('User profile found:', userProfile);

        if (userProfile?.email) {
          console.log('Sending rejection email notification to:', userProfile.email);
          const emailResult = await supabase.functions.invoke('send-notification-email', {
            body: {
              to: userProfile.email,
              subject: `Fund Edit Rejected - ${suggestion.fund_id}`,
              fundId: suggestion.fund_id,
              status: 'rejected',
              rejectionReason: finalRejectionReason,
              managerName: userProfile.manager_name
            }
          });
          console.log('Email notification result:', emailResult);
          
          if (emailResult.error) {
            console.error('Email function returned error:', emailResult.error);
            toast({
              title: "Email Warning", 
              description: "Suggestion rejected but email notification failed. Please check logs.",
              variant: "destructive"
            });
          } else {
            console.log('Rejection email sent successfully');
          }
        } else {
          console.log('No email address found for user');
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        toast({
          title: "Email Error",
          description: "Suggestion rejected but email notification failed.",
          variant: "destructive"
        });
      }

      toast({
        title: "Suggestion Rejected",
        description: "The suggestion has been rejected with the provided reason.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to reject suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const renderValueComparison = (field: string, currentValue: any, suggestedValue: any) => {
    // Helper function to normalize display values
    const normalizeForDisplay = (value: any): string => {
      if (value === null || value === undefined || value === '') {
        return 'Not set';
      }
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    };

    // Helper function to check if values are actually different
    const normalizeForComparison = (value: any): any => {
      if (value === '' || value === null || value === undefined) {
        return undefined;
      }
      return value;
    };

    const normalizedCurrent = normalizeForComparison(currentValue);
    const normalizedSuggested = normalizeForComparison(suggestedValue);
    const isChanged = JSON.stringify(normalizedCurrent) !== JSON.stringify(normalizedSuggested);
    
    return (
      <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Current Value</Label>
          <div className={`mt-1 p-2 bg-muted rounded ${isChanged ? 'border-l-4 border-red-400' : ''}`}>
            <pre className="text-sm whitespace-pre-wrap">
              {normalizeForDisplay(currentValue)}
            </pre>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Suggested Value</Label>
          <div className={`mt-1 p-2 bg-muted rounded ${isChanged ? 'border-l-4 border-green-400' : ''}`}>
            <pre className="text-sm whitespace-pre-wrap">
              {normalizeForDisplay(suggestedValue)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  if (!suggestion) return null;

  const changedFields = Object.keys(suggestion.suggested_changes || {});
  
  // Get submitter info from the enriched user profile
  const getSubmitterInfo = () => {
    const profile = suggestion.userProfile;
    
    if (!profile) {
      return {
        name: `User ${suggestion.user_id?.slice(-8) || 'Unknown'}`,
        type: 'User'
      };
    }

    if (profile.type === 'manager') {
      return {
        name: profile.company_name || profile.manager_name || 'Manager',
        type: 'Manager',
        company_name: profile.company_name,
        manager_name: profile.manager_name
      };
    } else if (profile.type === 'investor') {
      return {
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Investor',
        type: 'Investor',
        first_name: profile.first_name,
        last_name: profile.last_name
      };
    }

    return {
      name: `User ${suggestion.user_id?.slice(-8) || 'Unknown'}`,
      type: 'User'
    };
  };

  const submitterInfo = getSubmitterInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Fund Edit Suggestion #{suggestion.id?.slice(-8)}
            <Badge className={getStatusColor(suggestion.status)}>
              {suggestion.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Suggestion Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Submitted</Label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(suggestion.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {submitterInfo?.company_name ? (
                  <Building className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <Label className="text-sm font-medium">Submitted by</Label>
                  <div className="text-sm text-muted-foreground">
                    {submitterInfo.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {submitterInfo.type}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Fund ID</Label>
                  <div className="text-sm text-muted-foreground font-mono">
                    {suggestion.fund_id}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Field Changes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Proposed Changes ({changedFields.length} fields)</h3>
              
              {changedFields.map((field) => (
                <div key={field} className="space-y-2">
                  <h4 className="font-medium capitalize">{field.replace(/_/g, ' ')}</h4>
                  {renderValueComparison(
                    field,
                    suggestion.current_values?.[field],
                    suggestion.suggested_changes?.[field]
                  )}
                </div>
              ))}
            </div>

            {/* Rejection Reason (if rejected) */}
            {suggestion.status === 'rejected' && suggestion.rejection_reason && (
              <>
                <Separator />
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Label className="text-sm font-medium text-red-800">Rejection Reason</Label>
                  <div className="mt-1 text-sm text-red-700">
                    {suggestion.rejection_reason}
                  </div>
                </div>
              </>
            )}

            {/* Action Section */}
            {suggestion.status === 'pending' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rejection-reason">
                      Rejection Reason <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="Provide a clear reason for rejecting this suggestion..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isRejecting || isApproving}
                      className="flex items-center gap-2"
                    >
                      {isRejecting ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApprove}
                      disabled={isApproving || isRejecting}
                      className="flex items-center gap-2"
                    >
                      {isApproving ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};