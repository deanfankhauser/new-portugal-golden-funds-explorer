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
  const [isProcessing, setIsProcessing] = useState(false);
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
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('fund_edit_suggestions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', suggestion.id);

      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'suggestion_approved',
        p_target_type: 'fund_edit_suggestion',
        p_target_id: suggestion.id,
        p_details: { fund_id: suggestion.fund_id }
      });

      toast({
        title: "Suggestion Approved",
        description: "The suggestion has been approved successfully.",
      });

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
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this suggestion.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('fund_edit_suggestions')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', suggestion.id);

      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'suggestion_rejected',
        p_target_type: 'fund_edit_suggestion',
        p_target_id: suggestion.id,
        p_details: { 
          fund_id: suggestion.fund_id,
          rejection_reason: rejectionReason
        }
      });

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
      setIsProcessing(false);
    }
  };

  const renderValueComparison = (field: string, currentValue: any, suggestedValue: any) => {
    const isChanged = JSON.stringify(currentValue) !== JSON.stringify(suggestedValue);
    
    return (
      <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Current Value</Label>
          <div className={`mt-1 p-2 bg-muted rounded ${isChanged ? 'border-l-4 border-red-400' : ''}`}>
            <pre className="text-sm whitespace-pre-wrap">
              {typeof currentValue === 'object' 
                ? JSON.stringify(currentValue, null, 2) 
                : String(currentValue || 'Not set')}
            </pre>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Suggested Value</Label>
          <div className={`mt-1 p-2 bg-muted rounded ${isChanged ? 'border-l-4 border-green-400' : ''}`}>
            <pre className="text-sm whitespace-pre-wrap">
              {typeof suggestedValue === 'object' 
                ? JSON.stringify(suggestedValue, null, 2) 
                : String(suggestedValue || 'Not set')}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  if (!suggestion) return null;

  const changedFields = Object.keys(suggestion.suggested_changes || {});
  const submitterInfo = suggestion.investor_profiles?.[0] || suggestion.manager_profiles?.[0];

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
                    {submitterInfo?.company_name || 
                     `${submitterInfo?.first_name || ''} ${submitterInfo?.last_name || ''}`.trim() ||
                     'Unknown User'}
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
                    <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
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
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Approve
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