import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Global state for fund brief requests
let globalIsRequestingBrief = false;
let globalSetters: Set<(value: boolean) => void> = new Set();

export const useFundBrief = () => {
  const [isRequestingBrief, setIsRequestingBrief] = useState(globalIsRequestingBrief);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Register this component's setter
  useEffect(() => {
    globalSetters.add(setIsRequestingBrief);
    return () => {
      globalSetters.delete(setIsRequestingBrief);
    };
  }, []);

  // Update global state and notify all components
  const updateGlobalState = useCallback((value: boolean) => {
    globalIsRequestingBrief = value;
    globalSetters.forEach(setter => setter(value));
  }, []);

  const requestFundBrief = useCallback(async (fundName: string, fundId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request fund brief",
        variant: "destructive",
      });
      return { success: false, error: "Not authenticated" };
    }

    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found. Please try logging in again.",
        variant: "destructive",
      });
      return { success: false, error: "No user email" };
    }

    updateGlobalState(true);

    try {
      const { error } = await supabase.functions.invoke('send-fund-brief', {
        body: {
          userEmail: user.email,
          fundName: fundName,
          fundId: fundId,
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Fund Brief Requested",
        description: `We'll send the ${fundName} brief to ${user.email} within 24 hours.`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error requesting fund brief:', error);
      toast({
        title: "Error",
        description: "Failed to request fund brief. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      updateGlobalState(false);
    }
  }, [isAuthenticated, user?.email, toast, updateGlobalState]);

  return {
    isRequestingBrief,
    requestFundBrief
  };
};