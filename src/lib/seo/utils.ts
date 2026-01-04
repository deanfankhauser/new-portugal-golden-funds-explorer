import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from './constants';

/**
 * Optimize text to fit within max length, preferring sentence boundaries
 * Never truncates mid-sentence if avoidable
 */
export function optimizeText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Try to find complete sentences that fit
  const sentencePattern = /[^.!?]+[.!?]+/g;
  const sentences = text.match(sentencePattern) || [];
  let result = '';
  
  for (const sentence of sentences) {
    if ((result + sentence.trim()).length <= maxLength) {
      result = (result + ' ' + sentence.trim()).trim();
    } else {
      break;
    }
  }
  
  // If we got at least one complete sentence that's substantial, use it
  if (result.length >= maxLength * 0.5) {
    return result;
  }
  
  // Fallback: truncate at word boundary without ellipsis if near natural end
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const lastPunctuation = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  // Prefer ending at punctuation if it's close to the end
  if (lastPunctuation > maxLength * 0.7) {
    return truncated.substring(0, lastPunctuation + 1);
  }
  
  // Otherwise end at word boundary
  return lastSpace > maxLength * 0.7 
    ? truncated.substring(0, lastSpace)
    : truncated;
}

/**
 * Optimize title to max 60 characters
 */
export function optimizeTitle(title: string): string {
  return optimizeText(title, MAX_TITLE_LENGTH);
}

/**
 * Optimize description to max 155 characters
 */
export function optimizeDescription(description: string): string {
  return optimizeText(description, MAX_DESCRIPTION_LENGTH);
}

/**
 * Create URL-safe slug from text
 */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

/**
 * Get current year for dynamic SEO content
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
