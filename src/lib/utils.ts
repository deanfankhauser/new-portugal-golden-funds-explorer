
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function slugToCategory(slug: string): string {
  console.log('🔥 slugToCategory: Converting slug:', slug);
  
  // Handle special cases with double dashes that represent "&" or other separators
  let converted = slug
    .replace(/--/g, ' & ') // Convert double dashes to " & "
    .replace(/-/g, ' ') // Convert single dashes to spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  
  console.log('🔥 slugToCategory: Converted to:', converted);
  return converted;
}

export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function slugToTag(slug: string): string {
  console.log('🔥 slugToTag: Converting slug:', slug);
  
  // Clean up the slug first
  const cleanSlug = slug.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  // Handle special cases for tags that start with symbols or numbers
  let converted = cleanSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  // Handle special cases for percentage and number prefixes
  if (cleanSlug.startsWith('15-management') || cleanSlug.includes('15-management')) {
    converted = '> 1.5% management fee';
  } else if (cleanSlug.startsWith('1-management') || cleanSlug.includes('1-management')) {
    converted = '< 1% management fee';
  } else if (cleanSlug.startsWith('1-1-5-management') || cleanSlug.includes('1-1-5-management')) {
    converted = '1-1.5% management fee';
  }
  
  console.log('🔥 slugToTag: Converted to:', converted);
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
