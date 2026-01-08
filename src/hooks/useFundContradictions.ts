import { useMemo } from 'react';
import { Fund } from '@/data/types/funds';
import { detectFundContradictions, ContradictionResult } from '@/utils/fundContradictionDetector';

/**
 * Hook to detect contradictions in fund data
 * Returns contradiction results for display in UI
 */
export function useFundContradictions(fund: Fund | null | undefined): ContradictionResult {
  return useMemo(() => {
    if (!fund) {
      return {
        hasContradictions: false,
        errorCount: 0,
        warningCount: 0,
        contradictions: [],
      };
    }
    
    return detectFundContradictions(fund);
  }, [fund]);
}

/**
 * Hook to detect contradictions with form data
 * Used in edit forms where fund data might be modified
 */
export function useFundContradictionsWithFormData(
  fund: Fund | null | undefined,
  formData: {
    description?: string;
    detailedDescription?: string;
    redemptionTerms?: any;
    managementFee?: number | string;
    performanceFee?: number | string;
    tags?: string[];
  }
): ContradictionResult {
  return useMemo(() => {
    if (!fund) {
      return {
        hasContradictions: false,
        errorCount: 0,
        warningCount: 0,
        contradictions: [],
      };
    }
    
    // Create a merged fund object with form data overrides
    const mergedFund: Fund = {
      ...fund,
      description: formData.description ?? fund.description,
      detailedDescription: formData.detailedDescription ?? fund.detailedDescription,
      redemptionTerms: formData.redemptionTerms ?? fund.redemptionTerms,
      managementFee: typeof formData.managementFee === 'string' 
        ? parseFloat(formData.managementFee) || fund.managementFee 
        : formData.managementFee ?? fund.managementFee,
      performanceFee: typeof formData.performanceFee === 'string'
        ? parseFloat(formData.performanceFee) || fund.performanceFee
        : formData.performanceFee ?? fund.performanceFee,
      tags: (formData.tags as any) ?? fund.tags,
    };
    
    return detectFundContradictions(mergedFund);
  }, [fund, formData.description, formData.detailedDescription, formData.redemptionTerms, formData.managementFee, formData.performanceFee, formData.tags]);
}
