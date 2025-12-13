import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from './constants';

/**
 * Optimize text to fit within max length, truncating at word boundary
 */
export function optimizeText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > maxLength * 0.8 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
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
