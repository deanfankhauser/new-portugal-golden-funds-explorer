import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { toast } from 'sonner';

export interface SavedFund {
  id: string;
  user_id: string;
  fund_id: string;
  saved_at: string;
}

export const useSavedFunds = () => {
  const [savedFunds, setSavedFunds] = useState<SavedFund[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useEnhancedAuth();

  const fetchSavedFunds = async () => {
    if (!user) {
      setSavedFunds([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_funds')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved funds:', error);
        toast.error('Failed to load saved funds');
        return;
      }

      setSavedFunds(data || []);
    } catch (error) {
      console.error('Error fetching saved funds:', error);
      toast.error('Failed to load saved funds');
    } finally {
      setLoading(false);
    }
  };

  const saveFund = async (fundId: string) => {
    if (!user) {
      toast.error('You must be logged in to save funds');
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_funds')
        .insert({
          user_id: user.id,
          fund_id: fundId
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info('Fund is already saved');
          return false;
        }
        console.error('Error saving fund:', error);
        toast.error('Failed to save fund');
        return false;
      }

      toast.success('Fund saved successfully');
      fetchSavedFunds(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error saving fund:', error);
      toast.error('Failed to save fund');
      return false;
    }
  };

  const unsaveFund = async (fundId: string) => {
    if (!user) {
      toast.error('You must be logged in to unsave funds');
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_funds')
        .delete()
        .eq('user_id', user.id)
        .eq('fund_id', fundId);

      if (error) {
        console.error('Error unsaving fund:', error);
        toast.error('Failed to unsave fund');
        return false;
      }

      toast.success('Fund removed from saved funds');
      fetchSavedFunds(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error unsaving fund:', error);
      toast.error('Failed to unsave fund');
      return false;
    }
  };

  const isFundSaved = (fundId: string) => {
    return savedFunds.some(saved => saved.fund_id === fundId);
  };

  useEffect(() => {
    fetchSavedFunds();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('saved_funds_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_funds',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSavedFunds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    savedFunds,
    loading,
    saveFund,
    unsaveFund,
    isFundSaved,
    refetch: fetchSavedFunds
  };
};