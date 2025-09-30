import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { toast } from '@/hooks/use-toast';

export interface FundEditSuggestion {
  id: string;
  user_id: string;
  fund_id: string;
  suggested_changes: Record<string, any>;
  current_values: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
}

export const useFundEditing = () => {
  const { user, loading: authLoading } = useEnhancedAuth();
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, any>>>({});

  // Load pending changes from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fundEditPendingChanges');
      if (stored) {
        try {
          setPendingChanges(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading pending changes:', error);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save pending changes to localStorage
  const updatePendingChanges = useCallback((fundId: string, changes: Record<string, any>) => {
    setPendingChanges(prev => {
      const updated = { ...prev };
      if (Object.keys(changes).length === 0) {
        delete updated[fundId];
      } else {
        updated[fundId] = { ...prev[fundId], ...changes };
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('fundEditPendingChanges', JSON.stringify(updated));
      }
      
      return updated;
    });
  }, []);

  // SSG compatibility - only enable after hydration
  const checkHydration = useCallback(() => {
    if (typeof window !== 'undefined' && !isHydrated) {
      setIsHydrated(true);
    }
  }, [isHydrated]);

  const submitFundEditSuggestion = useCallback(async (
    fundId: string,
    suggestedChanges: Record<string, any>,
    currentValues: Record<string, any>
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to submit suggestions');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fund_edit_suggestions')
        .insert({
          user_id: user.id,
          fund_id: fundId,
          suggested_changes: suggestedChanges,
          current_values: currentValues,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification to super admins and thank you email to submitter
      try {
        console.log('Sending notification to super admins for new suggestion:', data.id);
        
        // Get submitter info for notification
        const { data: userProfile } = await supabase
          .from('manager_profiles')
          .select('manager_name, company_name, email')
          .eq('user_id', user.id)
          .single();
        
        const submitterName = userProfile 
          ? `${userProfile.manager_name} (${userProfile.company_name})`
          : 'User';
        
        // Send admin notification
        const notificationResult = await supabase.functions.invoke('notify-super-admins', {
          body: {
            suggestionId: data.id,
            fundId: fundId,
            submitterName: submitterName,
            submitterType: 'Manager',
            changes: suggestedChanges
          }
        });
        
        if (notificationResult.error) {
          console.error('Failed to send admin notification:', notificationResult.error);
        } else {
          console.log('✅ Super admin notification sent successfully');
        }

        // Send thank you email to submitter
        if (userProfile?.email) {
          const thankYouResult = await supabase.functions.invoke('send-notification-email', {
            body: {
              to: userProfile.email,
              subject: `Fund Edit Submission Received - ${fundId}`,
              fundId: fundId,
              status: 'submitted',
              managerName: userProfile.manager_name
            }
          });
          
          if (thankYouResult.error) {
            console.error('Failed to send thank you email:', thankYouResult.error);
          } else {
            console.log('✅ Thank you email sent successfully');
          }
        }
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        // Don't throw here - the suggestion was still created successfully
      }

      toast({
        title: "Suggestion Submitted! 🎉",
        description: "Your fund update suggestion has been submitted for review. We'll notify you once it's approved.",
      });

      // Store pending changes locally for immediate UI feedback
      updatePendingChanges(fundId, suggestedChanges);

      return data;
    } catch (error) {
      console.error('Error submitting fund edit suggestion:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your suggestion. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserSuggestions = useCallback(async (fundId?: string) => {
    if (!user) return [];

    try {
      let query = supabase
        .from('fund_edit_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fundId) {
        query = query.eq('fund_id', fundId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as FundEditSuggestion[];
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      return [];
    }
  }, [user]);

  const checkIfUserIsAdmin = useCallback(async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }, [user]);

  const clearPendingChangesForFund = useCallback((fundId: string) => {
    updatePendingChanges(fundId, {});
  }, [updatePendingChanges]);

  const clearAllPendingChanges = useCallback(() => {
    setPendingChanges({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fundEditPendingChanges');
    }
  }, []);

  return {
    user,
    loading: authLoading || loading,
    isHydrated,
    checkHydration,
    submitFundEditSuggestion,
    getUserSuggestions,
    checkIfUserIsAdmin,
    isAuthenticated: !!user,
    pendingChanges,
    updatePendingChanges,
    getPendingChangesForFund: (fundId: string) => pendingChanges[fundId] || {},
    clearPendingChangesForFund,
    clearAllPendingChanges,
  };
};