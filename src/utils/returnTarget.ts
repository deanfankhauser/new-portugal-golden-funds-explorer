import { Fund } from '../data/funds';

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

export const getReturnTargetDisplay = (fund: Fund): string => {
  const { min, max } = getReturnTargetNumbers(fund);
  
  if (min != null && max != null) {
    if (min === max) {
      // Format with max 2 decimal places, remove trailing zeros
      const formatted = Number(min.toFixed(2)).toString();
      return `${formatted}% p.a.`;
    }
    // Format range with max 2 decimal places
    const minFormatted = Number(min.toFixed(2)).toString();
    const maxFormatted = Number(max.toFixed(2)).toString();
    return `${minFormatted}–${maxFormatted}% p.a.`;
  }
  
  if (min != null) {
    const formatted = Number(min.toFixed(2)).toString();
    return `${formatted}% p.a.`;
  }
  
  if (fund.returnTarget && fund.returnTarget !== 'Unspecified') {
    return fund.returnTarget;
  }
  
  return 'Not disclosed';
};