
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Category slug conversion functions
export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function slugToCategory(slug: string): string {
  // Convert slug back to category name with proper capitalization
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Manager slug conversion functions
export function managerToSlug(manager: string): string {
  return manager.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function slugToManager(slug: string): string {
  // Convert slug back to manager name with proper capitalization
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Tag slug conversion functions
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function slugToTag(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
