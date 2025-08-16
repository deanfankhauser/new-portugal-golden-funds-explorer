import { Review } from '../../types/review';

// File-based review storage
// When we have reviews, they'll be added here
export const reviewsData: Record<string, Review[]> = {
  // Example format (commented out):
  // 'horizon-fund': [
  //   {
  //     id: 'rev-001',
  //     fundId: 'horizon-fund',
  //     reviewerName: 'John S.',
  //     reviewerCountry: 'Portugal',
  //     rating: 5,
  //     title: 'Excellent fund with great returns',
  //     content: 'I invested through this fund for my Golden Visa and the process was smooth. Great communication and transparency.',
  //     dateReviewed: '2024-01-15',
  //     verified: true
  //   }
  // ]
};

export default reviewsData;