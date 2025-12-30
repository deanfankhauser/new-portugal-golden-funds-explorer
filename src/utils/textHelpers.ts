/**
 * Centralized text helpers for consistent copy across the site
 */

/**
 * Returns singular or plural form based on count
 * @param count - The number to check
 * @param singular - Singular form (e.g., "fund")
 * @param plural - Optional plural form (defaults to singular + "s")
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? singular : pluralForm;
}

/**
 * Returns "a" or "an" based on the next word
 * Uses simple vowel check (covers most cases)
 */
export function getArticle(word: string): 'a' | 'an' {
  if (!word) return 'a';
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const firstChar = word.toLowerCase().charAt(0);
  return vowels.includes(firstChar) ? 'an' : 'a';
}

/**
 * Returns word with correct article prefix
 * @example withArticle("infrastructure") => "an infrastructure"
 * @example withArticle("private equity") => "a private equity"
 */
export function withArticle(word: string): string {
  return `${getArticle(word)} ${word}`;
}

/**
 * Formats fund count with correct pluralization
 * @example formatFundCount(1) => "1 fund"
 * @example formatFundCount(25) => "25 funds"
 */
export function formatFundCount(count: number): string {
  return `${count} ${pluralize(count, 'fund')}`;
}

/**
 * Formats count with "+" suffix for display (e.g., "25+")
 * Uses a floor to avoid awkward low numbers
 */
export function formatCountWithPlus(count: number, floor: number = 20): string {
  if (count >= floor) {
    return `${count}+`;
  }
  return String(count);
}

/**
 * Formats currency with thousands separators
 * Returns "Not disclosed" for null/undefined/0
 */
export function formatCurrencyValue(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) {
    return 'Not disclosed';
  }
  return `€${value.toLocaleString('en-US')}`;
}

/**
 * Formats a nullable numeric field, returning fallback for missing values
 */
export function formatNumericField(
  value: number | null | undefined, 
  suffix?: string,
  fallback: string = 'Not disclosed'
): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  return suffix ? `${value}${suffix}` : String(value);
}
