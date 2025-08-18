import { Review, AggregateRating } from '../../types/review';
import reviewsData from '../reviews/index';

export class ReviewsService {
  static getReviewsByFundId(fundId: string): Review[] {
    return reviewsData[fundId] || [];
  }

  static getAggregateRatingByFundId(fundId: string): AggregateRating | null {
    const reviews = this.getReviewsByFundId(fundId);
    
    if (reviews.length === 0) {
      return null;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      ratingValue: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1
    };
  }

  static buildReviewStructuredData(fundId: string) {
    const reviews = this.getReviewsByFundId(fundId);
    const aggregateRating = this.getAggregateRatingByFundId(fundId);

    if (!aggregateRating || reviews.length === 0) {
      return null;
    }

    return {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: aggregateRating.bestRating,
        worstRating: aggregateRating.worstRating
      },
      review: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.reviewerName
        },
        datePublished: review.dateReviewed,
        reviewBody: review.content,
        name: review.title,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        }
      }))
    };
  }
}