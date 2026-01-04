/**
 * Query Parameter Robots Handler
 * 
 * Detects filter/search/pagination URLs and returns appropriate robots directive.
 * URLs with these parameters should be noindex to prevent crawl waste.
 */

// Query parameters that trigger noindex
const NOINDEX_PARAMS = [
  'filter',
  'sort',
  'page',
  'search',
  'q',
  'category',
  'tag',
  'min',
  'max',
  'minInvestment',
  'maxInvestment',
  'risk',
  'manager',
  'order',
  'orderBy',
  'limit',
  'offset',
  'view',
  // Common tracking params (should also noindex to prevent duplicate content)
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
  'source',
  'fbclid',
  'gclid',
  'msclkid'
];

/**
 * Check if current URL has query parameters that should trigger noindex
 */
export function shouldNoindexForQueryParams(): boolean {
  if (typeof window === 'undefined') return false;
  
  const params = new URLSearchParams(window.location.search);
  
  // Check if any noindex-triggering params exist
  return NOINDEX_PARAMS.some(param => params.has(param));
}

/**
 * Get the appropriate robots directive based on query parameters
 */
export function getQueryParamRobots(): string {
  return shouldNoindexForQueryParams() ? 'noindex, follow' : 'index, follow';
}

/**
 * Strip query parameters from a URL for canonical purposes
 * Preserves only the origin + pathname
 */
export function stripQueryParams(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.search = ''; // Remove all query params
    urlObj.hash = ''; // Remove fragment
    
    // Remove trailing slashes (except for homepage)
    let cleanUrl = urlObj.toString();
    if (cleanUrl.endsWith('/') && urlObj.pathname !== '/') {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    
    return cleanUrl;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}
