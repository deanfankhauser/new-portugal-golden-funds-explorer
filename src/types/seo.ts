
export interface PageSEOProps {
  pageType: 'homepage' | 'fund' | 'manager' | 'category' | 'tag' | '404' | 'disclaimer' | 'about' | 'faqs' | 'privacy' | 'comparison' | 'comparisons-hub' | 'fund-comparison' | 'roi-calculator' | 'fund-quiz' | 'managers-hub' | 'categories-hub' | 'tags-hub' | 'fund-index' | 'fund-alternatives' | 'alternatives-hub';
  fundName?: string;
  managerName?: string;
  categoryName?: string;
  tagName?: string;
  comparisonTitle?: string;
  comparisonSlug?: string;
}

export interface SEOData {
  title: string;
  description: string;
  url: string;
  structuredData: any;
}
