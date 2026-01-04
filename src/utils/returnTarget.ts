import { Fund } from '../data/types/funds';

export const getReturnTargetNumbers = (fund: Fund): { min?: number; max?: number } => {
  // Prioritize direct database fields
  const min = fund.expectedReturnMin;
  const max = fund.expectedReturnMax;
  if (min != null || max != null) {
    return { min, max };
  }

  // Parse returnTarget string
  const rt = (fund.returnTarget || '').toString().toLowerCase();
  
  // Normalize em dash/en dash and "to"
  const cleaned = rt.replace(/–|—/g, '-').replace(/\s+to\s+/g, '-');

  // Check for ranges like "3-5", "3 - 5"
  const range = cleaned.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (range) {
    return { min: parseFloat(range[1]), max: parseFloat(range[2]) };
  }
  
  // Check for single values like "3", "3%", "3 percent"
  const single = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (single) {
    const v = parseFloat(single[1]);
    return { min: v, max: v };
  }
  
  return {};
};

export const getReturnTargetDisplay = (fund: Fund): string | null => {
  const { min, max } = getReturnTargetNumbers(fund);
  
  // Treat 0 as "not disclosed" - 0% is not a meaningful target return
  const effectiveMin = (min != null && min > 0) ? min : null;
  const effectiveMax = (max != null && max > 0) ? max : null;
  
  // If both are null/0, check for valid returnTarget string fallback
  if (effectiveMin == null && effectiveMax == null) {
    if (fund.returnTarget && 
        fund.returnTarget !== 'Unspecified' && 
        fund.returnTarget !== '0' && 
        fund.returnTarget !== '0%' &&
        !fund.returnTarget.includes('0-0') &&
        !fund.returnTarget.includes('0–0')) {
      return fund.returnTarget;
    }
    return null;
  }
  
  // If only max is valid, show as single value
  if (effectiveMin == null && effectiveMax != null) {
    const formatted = Number(effectiveMax.toFixed(2)).toString();
    return `${formatted}% p.a.`;
  }
  
  // If only min is valid, show as single value
  if (effectiveMin != null && effectiveMax == null) {
    const formatted = Number(effectiveMin.toFixed(2)).toString();
    return `${formatted}% p.a.`;
  }
  
  // Both are valid
  if (effectiveMin === effectiveMax) {
    const formatted = Number(effectiveMin!.toFixed(2)).toString();
    return `${formatted}% p.a.`;
  }
  
  // Format range
  const minFormatted = Number(effectiveMin!.toFixed(2)).toString();
  const maxFormatted = Number(effectiveMax!.toFixed(2)).toString();
  return `${minFormatted}–${maxFormatted}% p.a.`;
};

export const hasValidReturn = (fund: Fund): boolean => {
  const { min, max } = getReturnTargetNumbers(fund);
  return (min != null && min > 0) || (max != null && max > 0);
};