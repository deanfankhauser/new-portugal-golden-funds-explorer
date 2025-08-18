export interface Review {
  id: string;
  fundId: string;
  reviewerName: string;
  reviewerCountry: string;
  rating: number; // 1-5
  title: string;
  content: string;
  dateReviewed: string; // ISO date
  verified: boolean;
}

export interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

export interface ReviewFilters {
  minRating: number | null;
  country: string | null;
}