
export interface PageSEOProps {
  pageType: 'homepage' | 'fund' | 'manager' | 'category' | 'tag' | '404' | 'disclaimer' | 'about' | 'faqs' | 'privacy' | 'comparison' | 'comparisons-hub' | 'fund-comparison' | 'roi-calculator' | 'managers-hub' | 'categories-hub' | 'tags-hub' | 'fund-alternatives' | 'alternatives-hub' | 'verification-program' | 'verified-funds' | 'saved-funds' | 'team-member' | 'ira-401k-eligible';
  fundName?: string;
  managerName?: string;
  categoryName?: string;
  tagName?: string;
  comparisonTitle?: string;
  comparisonSlug?: string;
  funds?: any[];
  managerProfile?: any;
  memberName?: string;
  memberRole?: string;
  linkedinUrl?: string;
  memberSlug?: string;
}

export interface SEOData {
  title: string;
  description: string;
  url: string;
  structuredData: any;
  robots?: string;
  keywords?: string[]; // Array of SEO keywords for meta keywords tag
  canonical?: string; // Canonical URL for this page
  helmetData?: {
    title: string;
    meta: string;
    link: string;
    script: string;
  };
}
