/**
 * Fuzzy matching utility for manager names to handle variations
 * Matches the logic used in database function can_user_manage_company_funds
 * 
 * Examples:
 * - "Lince Capital SCR" matches "Lince Capital, SCR, S.A."
 * - "Company" matches "Company SCR"
 * - "Manager Inc." matches "Manager Inc., S.A."
 */
export const managerNamesMatch = (name1: string, name2: string): boolean => {
  if (!name1 || !name2) return false;
  
  // Exact match
  if (name1 === name2) return true;
  
  // Case-insensitive comparison for remaining checks
  const n1 = name1.toLowerCase();
  const n2 = name2.toLowerCase();
  
  // One name starts with the other
  if (n1.startsWith(n2) || n2.startsWith(n1)) return true;
  
  // Strip common suffixes and compare
  const stripSuffixes = (name: string): string => {
    return name
      .replace(/, scr, s\.a\./gi, '')
      .replace(/ scr/gi, '')
      .replace(/, s\.a\./gi, '')
      .trim();
  };
  
  const stripped1 = stripSuffixes(n1);
  const stripped2 = stripSuffixes(n2);
  
  // Compare stripped versions
  if (stripped1 === stripped2) return true;
  if (stripped1.startsWith(stripped2) || stripped2.startsWith(stripped1)) return true;
  
  return false;
};
