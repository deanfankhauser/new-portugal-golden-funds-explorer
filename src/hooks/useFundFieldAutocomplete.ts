import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Generic hook to fetch unique values for autocomplete fields
 * Used to prevent typos in fund editing forms
 */
const useFundFieldValues = (fieldName: string, queryKey: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funds')
        .select(fieldName)
        .order(fieldName);
      
      if (error) throw error;
      
      // Extract unique non-null values
      const uniqueValues = Array.from(
        new Set(
          data
            .map(fund => fund[fieldName as keyof typeof fund])
            .filter(Boolean) as string[]
        )
      ).sort();
      
      return uniqueValues;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

/**
 * Hook to fetch all unique fund categories
 */
export const useFundCategories = () => {
  return useFundFieldValues('category', 'fund-categories');
};

/**
 * Hook to fetch all unique custodian names
 */
export const useCustodianNames = () => {
  return useFundFieldValues('custodian', 'custodian-names');
};

/**
 * Hook to fetch all unique auditor names
 */
export const useAuditorNames = () => {
  return useFundFieldValues('auditor', 'auditor-names');
};
