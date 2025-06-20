
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
    .replace(/--+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function slugToCategory(slug: string): string {
  console.log('🔥 slugToCategory: Converting slug:', slug);
  
  // Handle special cases with double dashes that represent "&" or other separators
  let converted = slug
    .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes first
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
    .replace(/--+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function slugToTag(slug: string): string {
  console.log('🔥 slugToTag: Converting slug:', slug);
  
  let converted = slug
    .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes first
    .replace(/-/g, ' ') // Convert dashes to spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  
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
    .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes first
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}
