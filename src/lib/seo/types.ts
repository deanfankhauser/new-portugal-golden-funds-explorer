import { Fund } from '@/data/types/funds';

export interface SEOData {
  title: string;
  description: string;
  url: string;
  canonical?: string;
  robots?: string;
  keywords?: string[];
  structuredData: any;
}

export interface SEOParams {
  fundId?: string;
  fundName?: string;
  categoryName?: string;
  tagName?: string;
  managerName?: string;
  managerProfile?: any;
  comparisonSlug?: string;
  funds?: Fund[];
  name?: string;
  role?: string;
  companyName?: string;
  slug?: string;
  pageType?: string;
}

export type PageType = 
  | 'homepage'
  | 'fund'
  | 'fund-details'
  | 'fund-alternatives'
  | 'fund-matcher'
  | 'fund-matcher-results'
  | 'funds'
  | 'category'
  | 'tag'
  | 'manager'
  | 'team-member'
  | 'comparison'
  | 'fund-comparison'
  | 'comparisons-hub'
  | 'roi-calculator'
  | 'faqs'
  | 'about'
  | 'disclaimer'
  | 'privacy'
  | 'cookie-policy'
  | 'contact'
  | 'managers-hub'
  | 'categories-hub'
  | 'tags-hub'
  | 'alternatives-hub'
  | 'verified-funds'
  | 'verification-program'
  | 'saved-funds'
  | 'auth'
  | 'ira-401k-eligible'
  | 'best-funds'
  | 'us-citizens-funds'
  | '404';
