
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to convert tag to URL-friendly slug
export function tagToSlug(tag: string): string {
  return tag.toLowerCase()
    .replace(/€/g, 'eur')
    .replace(/\s+/g, '-')
    .replace(/[+]/g, 'plus')
    .replace(/[€]/g, 'eur') // Extra safety for Euro symbol
    .replace(/-risk$/g, '') // Remove '-risk' suffix for cleaner URLs
    .replace(/</g, 'lt') // Convert < to lt
    .replace(/>/g, 'gt') // Convert > to gt
    .replace(/%/g, 'pct') // Convert % to pct
    .replace(/annual-yield$/g, '') // Remove 'annual-yield' suffix for cleaner URLs
    .replace(/-year-lock-up$/g, '') // Remove '-year-lock-up' suffix for cleaner URLs
    .replace(/year/g, '') // Remove 'year' for lock-up tags
    .replace(/m$/g, '') // Remove 'M' for fund size tags
    .replace(/golden-visa-funds-for-/g, '') // Remove prefix for audience tags
    .replace(/-citizens$/g, ''); // Remove '-citizens' suffix for audience tags
}

// Function to convert slug back to tag
export function slugToTag(slug: string): string {
  // Handle audience segment tags specifically
  if (['us', 'australian', 'uk', 'canadian', 'chinese'].includes(slug)) {
    const audienceMap: { [key: string]: string } = {
      'us': 'Golden Visa funds for U.S. citizens',
      'australian': 'Golden Visa funds for Australian citizens',
      'uk': 'Golden Visa funds for UK citizens',
      'canadian': 'Golden Visa funds for Canadian citizens',
      'chinese': 'Golden Visa funds for Chinese citizens'
    };
    return audienceMap[slug];
  }
  
  // Handle risk level tags specifically
  if (['low', 'medium', 'high'].includes(slug)) {
    return `${slug.charAt(0).toUpperCase() + slug.slice(1)}-risk`;
  }
  
  // Handle APY level tags specifically
  if (['lt-3', '3-5', 'gt-5'].includes(slug)) {
    const apyMap: { [key: string]: string } = {
      'lt-3': '< 3% annual yield',
      '3-5': '3-5% annual yield',
      'gt-5': '> 5% annual yield'
    };
    return apyMap[slug];
  }
  
  // Handle lock-up period tags specifically
  if (['lt-5', '5-10', 'gt-10'].includes(slug)) {
    const lockupMap: { [key: string]: string } = {
      'lt-5': '< 5-year lock-up',
      '5-10': '5-10 year lock-up',
      'gt-10': '> 10-year lock-up'
    };
    return lockupMap[slug];
  }
  
  // Handle management fee tags specifically
  if (['lt-1', '1-1.5', 'gt-1.5'].includes(slug)) {
    const managementFeeMap: { [key: string]: string } = {
      'lt-1': '< 1% management fee',
      '1-1.5': '1-1.5% management fee',
      'gt-1.5': '> 1.5% management fee'
    };
    return managementFeeMap[slug];
  }
  
  // Handle fund size tags specifically
  if (['lt-50m', '50-100m', 'gt-100m'].includes(slug)) {
    const fundSizeMap: { [key: string]: string } = {
      'lt-50m': 'Small-cap < €50M',
      '50-100m': 'Mid-cap €50-100M',
      'gt-100m': 'Large-cap > €100M'
    };
    return fundSizeMap[slug];
  }
  
  return slug
    .replace(/eur/g, '€')
    .replace(/plus/g, '+')
    .replace(/lt/g, '<')
    .replace(/gt/g, '>')
    .replace(/pct/g, '%')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => {
      // Handle special cases for Euro amounts
      if (word.includes('€')) {
        return word;
      }
      // Capitalize first letter of regular words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Function to convert category to URL-friendly slug
export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

// Function to convert slug back to category
export function slugToCategory(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Function to convert manager name to URL-friendly slug
export function managerToSlug(managerName: string): string {
  return managerName
    .toLowerCase()
    .replace(/[&]/g, 'and') // Convert & to 'and'
    .replace(/[,\.]/g, '') // Remove commas and periods
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]/g, '') // Remove any remaining non-word characters except hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to convert slug back to manager name (for URL parsing)
export function slugToManager(slug: string): string {
  // This is a reverse mapping - we'll need to match against actual manager names
  // since the transformation isn't perfectly reversible
  const commonReplacements: { [key: string]: string } = {
    'and': '&',
    '-': ' '
  };
  
  let result = slug;
  Object.entries(commonReplacements).forEach(([from, to]) => {
    result = result.replace(new RegExp(from, 'g'), to);
  });
  
  // Capitalize each word
  return result.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
