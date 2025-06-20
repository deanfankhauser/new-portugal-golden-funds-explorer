
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, '--') // Convert " & " to "--"
    .replace(/\s+/g, '-') // Convert spaces to dashes
    .replace(/[^\w\-]+/g, '') // Remove special characters except dashes
    .replace(/--+/g, '--') // Normalize multiple dashes to double dashes
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function slugToCategory(slug: string): string {
  console.log('🔥 slugToCategory: Converting slug:', slug);
  
  // Clean the slug first
  const cleanSlug = slug.replace(/^-+|-+$/g, '');
  
  // Handle special cases with double dashes that represent "&"
  let converted = cleanSlug
    .replace(/--/g, ' & ') // Convert double dashes to " & "
    .replace(/-/g, ' ') // Convert single dashes to spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  
  console.log('🔥 slugToCategory: Converted to:', converted);
  return converted;
}

export function tagToSlug(tag: string): string {
  // Handle special percentage cases first
  if (tag.includes('> 1.5% management')) {
    return '15-management-fee';
  }
  if (tag.includes('< 1% management')) {
    return '1-management-fee';
  }
  if (tag.includes('1-1.5% management')) {
    return '1-1-5-management-fee';
  }
  
  return tag
    .toLowerCase()
    .trim()
    .replace(/[><%]/g, '') // Remove special symbols
    .replace(/\s+/g, '-') // Convert spaces to dashes
    .replace(/[^\w\-\.]+/g, '') // Keep only word chars, dashes, and dots
    .replace(/--+/g, '-') // Normalize multiple dashes
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function slugToTag(slug: string): string {
  console.log('🔥 slugToTag: Converting slug:', slug);
  
  // Handle special management fee cases first
  if (slug === '15-management-fee' || slug === '-15-management-fee') {
    console.log('🔥 slugToTag: Matched > 1.5% management fee pattern');
    return '> 1.5% management fee';
  }
  if (slug === '1-management-fee' || slug === '-1-management-fee') {
    console.log('🔥 slugToTag: Matched < 1% management fee pattern');
    return '< 1% management fee';
  }
  if (slug === '1-1-5-management-fee' || slug === '-1-1-5-management-fee') {
    console.log('🔥 slugToTag: Matched 1-1.5% management fee pattern');
    return '1-1.5% management fee';
  }
  
  // Clean up the slug first
  const cleanSlug = slug.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  // General conversion
  let converted = cleanSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
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
