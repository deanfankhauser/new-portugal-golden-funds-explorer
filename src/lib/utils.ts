
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
  // Convert tag to URL slug
  
  // Handle special low fees tag
  if (tag.includes('Low fees')) {
    return 'low-fees';
  }
  
  const slug = tag
    .toLowerCase()
    .trim()
    .replace(/[><%]/g, '') // Remove special symbols
    .replace(/\s+/g, '-') // Convert spaces to dashes
    .replace(/[^\w\-\.]+/g, '') // Keep only word chars, dashes, and dots
    .replace(/--+/g, '-') // Normalize multiple dashes
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  
  // Return URL-safe tag slug
  return slug;
}

export function slugToTag(slug: string): string {
  // Convert URL slug back to tag
  
  // Handle special low fees tag
  if (slug === 'low-fees') {
    return 'Low fees (<1% management fee)';
  }
  
  // Clean up the slug first
  const cleanSlug = slug.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  // General conversion
  let converted = cleanSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  // Return readable tag name
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
