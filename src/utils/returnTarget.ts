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
  
  // If both min and max are 0 or undefined, return null (no data)
  if ((min === 0 && max === 0) || (min == null && max == null)) {
    // Check if there's a valid returnTarget string
    if (fund.returnTarget && fund.returnTarget !== 'Unspecified' && fund.returnTarget !== '0' && fund.returnTarget !== '0%') {
      return fund.returnTarget;
    }
    return null;
  }
  
  if (min != null && max != null) {
    // If max is 0 or invalid, treat as single value (but only if min is meaningful)
    if (max <= 0 || max < min) {
      if (min <= 0) return null; // Both are 0 or invalid
      const formatted = Number(min.toFixed(2)).toString();
      return `${formatted}% p.a.`;
    }
    
    // If both are 0, return null
    if (min === 0 && max === 0) {
      return null;
    }
    
    if (min === max) {
      if (min <= 0) return null; // 0% is not meaningful
      const formatted = Number(min.toFixed(2)).toString();
      return `${formatted}% p.a.`;
    }
    // Format range with max 2 decimal places
    const minFormatted = Number(min.toFixed(2)).toString();
    const maxFormatted = Number(max.toFixed(2)).toString();
    return `${minFormatted}–${maxFormatted}% p.a.`;
  }
  
  if (min != null && min > 0) {
    const formatted = Number(min.toFixed(2)).toString();
    return `${formatted}% p.a.`;
  }
  
  if (fund.returnTarget && fund.returnTarget !== 'Unspecified' && fund.returnTarget !== '0' && fund.returnTarget !== '0%') {
    return fund.returnTarget;
  }
  
  return null;
};