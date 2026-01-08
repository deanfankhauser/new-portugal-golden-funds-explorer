import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
        toast({
          title: 'Failed to load saved funds',
          variant: 'destructive'
        });
        return;
      }

      setSavedFunds(data || []);
    } catch (error) {
      console.error('Error fetching saved funds:', error);
      toast({
        title: 'Failed to load saved funds',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFund = async (fundId: string) => {
    if (!user) {
      toast({
        title: 'You must be logged in to save funds',
        variant: 'destructive'
      });
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
          toast({
            title: 'Fund is already saved'
          });
          return false;
        }
        console.error('Error saving fund:', error);
        toast({
          title: 'Failed to save fund',
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Added to watchlist'
      });
      fetchSavedFunds(); // Refresh the list
      return true;
    } catch (error) {
        console.error('Error saving fund:', error);
        toast({
          title: 'Failed to add to watchlist',
          variant: 'destructive'
        });
      return false;
    }
  };

  const unsaveFund = async (fundId: string) => {
    if (!user) {
      toast({
        title: 'You must be logged in to unsave funds',
        variant: 'destructive'
      });
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
        toast({
          title: 'Failed to unsave fund',
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Removed from watchlist'
      });
      fetchSavedFunds(); // Refresh the list
      return true;
    } catch (error) {
        console.error('Error unsaving fund:', error);
        toast({
          title: 'Failed to remove from watchlist',
          variant: 'destructive'
        });
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