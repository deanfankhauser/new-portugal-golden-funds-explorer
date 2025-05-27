
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
    .replace(/-risk$/g, ''); // Remove '-risk' suffix for cleaner URLs
}

// Function to convert slug back to tag
export function slugToTag(slug: string): string {
  // Handle risk level tags specifically
  if (['low', 'medium', 'high'].includes(slug)) {
    return `${slug.charAt(0).toUpperCase() + slug.slice(1)}-risk`;
  }
  
  return slug
    .replace(/eur/g, '€')
    .replace(/plus/g, '+')
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
