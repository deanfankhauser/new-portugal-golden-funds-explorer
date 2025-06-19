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

// Tag slug conversion functions - COMPREHENSIVE FIXED VERSION
export function tagToSlug(tag: string): string {
  return tag.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugToTag(slug: string): string {
  // Comprehensive special cases mapping for all tag types
  const specialCases: Record<string, string> = {
    // Audience tags
    'golden-visa-funds-for-us-citizens': 'Golden Visa funds for U.S. citizens',
    'golden-visa-funds-for-australian-citizens': 'Golden Visa funds for Australian citizens',
    'golden-visa-funds-for-uk-citizens': 'Golden Visa funds for UK citizens',
    'golden-visa-funds-for-canadian-citizens': 'Golden Visa funds for Canadian citizens',
    'golden-visa-funds-for-chinese-citizens': 'Golden Visa funds for Chinese citizens',
    
    // Investment amount tags
    'under-250k': 'Under €250k',
    'under-300k': 'Under €300k',
    'under-350k': 'Under €350k',
    'under-400k': 'Under €400k',
    'under-500k': 'Under €500k',
    '250k-350k': '€250k-€350k',
    '280k-350k': '€280k-€350k',
    '300k-400k': '€300k-€400k',
    '350k-500k': '€350k-€500k',
    '400k-600k': '€400k-€600k',
    '500k': '€500k+',
    
    // Fund size tags
    'small-cap-50m': 'Small-cap < €50M',
    'mid-cap-50-100m': 'Mid-cap €50-100M',
    'large-cap-100m': 'Large-cap > €100M',
    
    // Management fee tags
    '1-management-fee': '< 1% management fee',
    '1-15-management-fee': '1-1.5% management fee',
    '15-management-fee': '> 1.5% management fee',
    
    // APY tags
    '3-annual-yield': '< 3% annual yield',
    '3-5-annual-yield': '3-5% annual yield',
    '5-annual-yield': '> 5% annual yield',
    
    // Lock-up period tags
    '5-year-lock-up': '< 5-year lock-up',
    '5-10-year-lock-up': '5-10 year lock-up',
    '10-year-lock-up': '> 10-year lock-up',
    
    // Risk level tags
    'low-risk': 'Low-risk',
    'medium-risk': 'Medium-risk',
    'high-risk': 'High-risk',
    
    // Special percentage/return tags
    '12-return': '12% Return',
    '5-yield': '5 % Yield',
    '5-dividend': '5% Dividend',
    
    // Other special tags
    'mid-cap': 'Mid-Cap',
    'smes': 'SMEs',
    'pfic-compliant': 'PFIC-Compliant',
    'qef-eligible': 'QEF Eligible',
    'ucits': 'UCITS',
    'ai-driven': 'AI-Driven',
    'energy-as-a-service': 'Energy-as-a-Service',
    'no-lock-up': 'No Lock-Up',
    'lock-up': 'Lock-Up',
    'no-fees': 'No Fees',
    'tax-free': 'Tax Free',
    'daily-nav': 'Daily NAV'
  };
  
  // Check for exact match first
  if (specialCases[slug]) {
    return specialCases[slug];
  }
  
  // Default conversion with proper capitalization for words
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
