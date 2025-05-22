
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to convert tag to URL-friendly slug
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

// Function to convert slug back to tag
export function slugToTag(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
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
