
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function categoryToSlug(category: string): string {
  // Convert category to URL slug
  
  const slug = category
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, '--') // Convert " & " to "--"
    .replace(/\s+/g, '-') // Convert spaces to dashes
    .replace(/[^\w\-]+/g, '') // Remove special characters except dashes
    .replace(/--+/g, '--') // Normalize multiple dashes to double dashes
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  
  // Return URL-safe slug
  return slug;
}

export function slugToCategory(slug: string): string {
  // Convert URL slug back to category
  
  // Clean the slug first
  const cleanSlug = slug.replace(/^-+|-+$/g, '');
  
  // Handle special cases with double dashes that represent "&"
  let converted = cleanSlug
    .replace(/--/g, ' & ') // Convert double dashes to " & "
    .replace(/-/g, ' ') // Convert single dashes to spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  
  // Return readable category name
  return converted;
}

export function tagToSlug(tag: string): string {
  // Convert tag to URL slug - only lowercase letters, numbers, and hyphens
  
  // Handle special low fees tag
  if (tag.includes('Low fees')) {
    return 'low-fees';
  }
  
  let slug = tag
    .toLowerCase()
    .trim()
    // Handle special characters with meaningful replacements
    .replace(/€/g, '')                    // Remove Euro symbol
    .replace(/[–—]/g, '-')                // Convert em-dash/en-dash to hyphen
    .replace(/\s*&\s*/g, '-and-')         // Convert & to -and-
    .replace(/</g, 'less-than-')          // Convert < to less-than-
    .replace(/>/g, 'greater-than-')       // Convert > to greater-than-
    .replace(/%/g, '-percent')            // Convert % to -percent
    .replace(/\+$/g, '-plus')             // Convert trailing + to -plus
    .replace(/\./g, '')                   // Remove dots completely
    .replace(/\s+/g, '-')                 // Convert spaces to hyphens
    .replace(/(\d+k)(\d)/gi, '$1-$2')     // Insert hyphen between "250k" and "350" → "250k-350"
    .replace(/(\d)(\d{3}k)/gi, '$1-$2')   // Insert hyphen between numbers like "5" and "10" → "5-10"
    .replace(/[^a-z0-9-]/g, '')           // Remove any remaining special characters (only keep letters, numbers, hyphens)
    .replace(/-+/g, '-')                  // Normalize multiple hyphens to single
    .replace(/^-+|-+$/g, '');             // Remove leading/trailing hyphens
  
  return slug;
}

export function slugToTag(slug: string): string {
  // Convert URL slug back to tag
  
  // Handle special cases
  if (slug === 'low-fees') {
    return 'Low fees (<1% management fee)';
  }
  
  // Handle min-subscription patterns
  if (slug.startsWith('min-subscription-')) {
    const range = slug.replace('min-subscription-', '');
    // Convert "100k-250k" back to "Min. subscription €100k–€250k"
    const parts = range.split('-').filter(p => p);
    if (parts.length === 2) {
      return `Min. subscription €${parts[0].toUpperCase()}–€${parts[1].toUpperCase()}`;
    }
    if (parts.length === 1 && parts[0].includes('plus')) {
      return `Min. subscription €${parts[0].replace('plus', '+').toUpperCase()}`;
    }
  }
  
  // Handle target-yield patterns
  if (slug.startsWith('target-yield-')) {
    const value = slug.replace('target-yield-', '');
    if (value.includes('plus')) {
      return `Target yield >${value.replace('-percent', '%').replace('-plus', '').replace(/-/g, '')}`;
    }
    return `Target yield ${value.replace('-percent', '%').replace(/-/g, '–')}`;
  }
  
  // Handle long-lock-up patterns
  if (slug.startsWith('long-lock-up-')) {
    const range = slug.replace('long-lock-up-', '').replace('-years', '');
    return `Long lock-up (${range.replace(/-/g, '–')} years)`;
  }
  
  // Clean up the slug first
  const cleanSlug = slug.replace(/^-+|-+$/g, '');
  
  // General conversion
  let converted = cleanSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return converted;
}

export function managerToSlug(manager: string): string {
  return manager
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function slugToManager(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Normalize tag slugs to handle common variations (u-s vs us, u-k vs uk)
export function normalizeTagSlug(slug: string): string {
  return slug
    .toLowerCase()
    // Normalize "u-s" to "us" and "u-k" to "uk"
    .replace(/\bu-s\b/g, 'us')
    .replace(/\bu-k\b/g, 'uk')
    // Remove any double hyphens and trim
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
