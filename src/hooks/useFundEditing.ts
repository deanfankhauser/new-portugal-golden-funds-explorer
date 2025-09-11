import { useState, useCallback } from 'react';
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

      toast({
        title: "Suggestion Submitted! 🎉",
        description: "Your fund update suggestion has been submitted for review. We'll notify you once it's approved.",
      });

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

  return {
    user,
    loading: authLoading || loading,
    isHydrated,
    checkHydration,
    submitFundEditSuggestion,
    getUserSuggestions,
    checkIfUserIsAdmin,
    isAuthenticated: !!user,
  };
};