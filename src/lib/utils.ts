
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
  // Handle special cases for category names
  const specialCases: Record<string, string> = {
    'real-estate': 'Real Estate',
    'venture-capital-funds': 'Venture Capital Funds',
    'private-equity': 'Private Equity',
    'mixed-funds': 'Mixed Funds'
  };
  
  if (specialCases[slug]) {
    return specialCases[slug];
  }
  
  // Convert slug back to category name with proper capitalization
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Manager slug conversion functions
export function managerToSlug(manager: string): string {
  return manager.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugToManager(slug: string): string {
  // Handle special cases for manager names that have specific capitalization
  const specialCases: Record<string, string> = {
    'octanova-scr-sa': 'Octanova SCR, SA',
    'lince-capital': 'Lince Capital',
    'optimize-investment-partners': 'Optimize Investment Partners',
    'portugal-ventures': 'Portugal Ventures',
    'horizonte-equity-partners': 'Horizonte Equity Partners'
  };
  
  if (specialCases[slug]) {
    return specialCases[slug];
  }
  
  // Convert slug back to manager name with proper capitalization
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Tag slug conversion functions - FIXED VERSION
export function tagToSlug(tag: string): string {
  return tag.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugToTag(slug: string): string {
  // Handle special cases for tag names with specific formatting
  const specialCases: Record<string, string> = {
    'golden-visa-funds-for-us-citizens': 'Golden Visa funds for U.S. citizens',
    'golden-visa-funds-for-australian-citizens': 'Golden Visa funds for Australian citizens',
    'golden-visa-funds-for-uk-citizens': 'Golden Visa funds for UK citizens',
    'golden-visa-funds-for-canadian-citizens': 'Golden Visa funds for Canadian citizens',
    'golden-visa-funds-for-chinese-citizens': 'Golden Visa funds for Chinese citizens',
    'funds-under-500000': 'Funds under €500,000',
    'funds-500000-1000000': 'Funds €500,000 - €1,000,000',
    'funds-1000000-2000000': 'Funds €1,000,000 - €2,000,000',
    'funds-over-2000000': 'Funds over €2,000,000',
    'low-risk-funds': 'Low risk funds',
    'medium-risk-funds': 'Medium risk funds',
    'high-risk-funds': 'High risk funds',
    'low-apy-funds': 'Low APY funds (0-5%)',
    'medium-apy-funds': 'Medium APY funds (5-10%)',
    'high-apy-funds': 'High APY funds (10%+)',
    'short-lockup-funds': 'Short lock-up funds (0-2 years)',
    'medium-lockup-funds': 'Medium lock-up funds (2-5 years)',
    'long-lockup-funds': 'Long lock-up funds (5+ years)',
    'low-management-fee-funds': 'Low management fee funds (0-1%)',
    'medium-management-fee-funds': 'Medium management fee funds (1-2%)',
    'high-management-fee-funds': 'High management fee funds (2%+)',
    'small-fund-size': 'Small fund size (under €50M)',
    'medium-fund-size': 'Medium fund size (€50M-€200M)',
    'large-fund-size': 'Large fund size (over €200M)'
  };
  
  if (specialCases[slug]) {
    return specialCases[slug];
  }
  
  // Default conversion with proper capitalization for words
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
